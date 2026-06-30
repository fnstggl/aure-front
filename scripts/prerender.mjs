/**
 * Body prerendering for the client-rendered SPA.
 *
 * `vite build` + the seoPrerender plugin (vite.config.ts) already write correct
 * per-route <head> metadata + JSON-LD into dist/<route>/index.html, but the
 * <body> is just `<div id="root"></div>` — so non-JS crawlers and AI fetchers
 * see no page content. This pass loads each built route in headless Chromium,
 * lets React render, and writes the resulting markup back into the static body.
 *
 * The client still boots normally: main.tsx uses createRoot().render(), which
 * replaces the prerendered markup with a fresh client render on load — so there
 * are no hydration-mismatch hazards from the site's animation/random content,
 * while crawlers and a no-JS first paint get the real, readable HTML.
 *
 * It also emits dist/404.html (noindex) for Netlify to serve on unknown URLs.
 *
 * Runs after `vite build`. Pure post-processing of dist/ — it never edits source.
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(root, "dist");
const ROOT_MARKER = '<div id="root"></div>';
const PORT = 4317;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

/** Tiny static server for dist/, with SPA fallback to index.html. */
function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      let filePath = path.join(DIST, urlPath);
      if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
      if (!existsSync(filePath)) {
        if (path.extname(urlPath)) {
          res.statusCode = 404;
          return res.end("not found");
        }
        // SPA fallback (used by the 404 probe): serve the app shell so the
        // client router can render the matching component for the URL.
        filePath = path.join(DIST, "index.html");
      }
      res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
      res.end(await readFile(filePath));
    } catch (err) {
      res.statusCode = 500;
      res.end(String(err));
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

/** Discover prerendered routes: dist/index.html ("/") + dist/<seg>/index.html. */
async function discoverRoutes() {
  const routes = ["/"];
  for (const entry of await readdir(DIST, { withFileTypes: true })) {
    if (entry.isDirectory() && existsSync(path.join(DIST, entry.name, "index.html"))) {
      routes.push("/" + entry.name);
    }
  }
  return routes;
}

/** Render one URL and return the #root innerHTML once content has settled. */
async function renderBody(page, url, minText = 150) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  // Wait until the app has rendered an <h1> and a meaningful amount of text.
  // (minText is lowered for the intentionally-sparse 404 page.)
  await page.waitForFunction(
    (min) => {
      const r = document.getElementById("root");
      return !!r && !!r.querySelector("h1") && (r.textContent || "").trim().length > min;
    },
    minText,
    { timeout: 30000 },
  );
  // Settle entrance animations / count-ups, then pin scroll-reveal elements to
  // their visible state so the static HTML isn't left at opacity:0 for no-JS.
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  });
  return page.evaluate(() => document.getElementById("root").innerHTML);
}

/** Strip the JSON-LD block and retarget head tags for the noindex 404 doc. */
function buildNotFoundDoc(baseHtml, body) {
  let html = baseHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>Page not found — Aurelius</title>");
  html = html.replace(
    /(<meta name="robots" content=")[^"]*(")/,
    "$1noindex, follow$2",
  );
  html = html.replace(
    /(<meta name="description" content=")[^"]*(")/,
    "$1The page you requested does not exist.$2",
  );
  // A 404 should not assert a canonical to a real URL.
  html = html.replace(/\s*<link rel="canonical"[^>]*>/g, "");
  // Drop the homepage JSON-LD graph carried by the shell.
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
  return html.replace(ROOT_MARKER, `<div id="root">${body}</div>`);
}

const server = await startServer();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });

try {
  const baseShell = await readFile(path.join(DIST, "index.html"), "utf8");
  const routes = await discoverRoutes();

  for (const route of routes) {
    const file = route === "/" ? path.join(DIST, "index.html") : path.join(DIST, route, "index.html");
    const html = await readFile(file, "utf8");
    if (!html.includes(ROOT_MARKER)) {
      throw new Error(`[prerender] root marker not found in ${file} (already prerendered?)`);
    }
    const body = await renderBody(page, `http://127.0.0.1:${PORT}${route}`);
    await writeFile(file, html.replace(ROOT_MARKER, `<div id="root">${body}</div>`));
    console.log(`[prerender] ${route.padEnd(20)} ${(body.length / 1024).toFixed(1)} KB body`);
  }

  // 404 page: render the SPA's NotFound via a non-existent URL, then bake it
  // into dist/404.html with noindex. Netlify serves this on unknown routes.
  const notFoundBody = await renderBody(page, `http://127.0.0.1:${PORT}/__prerender_not_found__`, 50);
  await writeFile(path.join(DIST, "404.html"), buildNotFoundDoc(baseShell, notFoundBody));
  console.log(`[prerender] /404.html           ${(notFoundBody.length / 1024).toFixed(1)} KB body (noindex)`);
} finally {
  await browser.close();
  server.close();
}

console.log("[prerender] done");
