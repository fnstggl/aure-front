import { chromium } from "playwright";
import http from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, extname } from "node:path";

/* Self-contained visual QA: serve dist/ with SPA fallback, drive Playwright,
   write screenshots, exit. Run: node scripts/qa-redesign.mjs <tag> */

const __dir = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dir, "../dist");
const tag = process.argv[2] || "redesign";
const OUT = resolve(__dir, `../.qa/${tag}`);
await mkdir(OUT, { recursive: true });

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
};

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

const server = http.createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";
    let filePath = join(DIST, urlPath);

    // direct file?
    if (await exists(filePath) && (await stat(filePath)).isFile()) {
      res.writeHead(200, { "content-type": TYPES[extname(filePath)] || "application/octet-stream" });
      createReadStream(filePath).pipe(res);
      return;
    }
    // prerendered route dir?
    const routeIndex = join(DIST, urlPath, "index.html");
    if (await exists(routeIndex)) {
      res.writeHead(200, { "content-type": "text/html" });
      res.end(await readFile(routeIndex));
      return;
    }
    // SPA fallback
    res.writeHead(200, { "content-type": "text/html" });
    res.end(await readFile(join(DIST, "index.html")));
  } catch (e) {
    res.writeHead(500); res.end(String(e));
  }
});

await new Promise((r) => server.listen(4178, "127.0.0.1", r));
const BASE = "http://127.0.0.1:4178";
console.log("serving dist on", BASE);

const browser = await chromium.launch();

async function fullPage({ path, name, width, height, reduced = true }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });
  await ctx.close();
  console.log("full ->", name);
}

async function viewport({ path, name, width, height, reduced = false }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: join(OUT, `${name}.png`) });
  await ctx.close();
  console.log("view ->", name);
}

async function figures({ path, prefix, width = 1440 }) {
  const ctx = await browser.newContext({ viewport: { width, height: 1100 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const n = await page.locator("figure").count();
  for (let i = 0; i < n; i++) {
    const fig = page.locator("figure").nth(i);
    await fig.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    try {
      await fig.screenshot({ path: join(OUT, `${prefix}-fig${String(i).padStart(2, "0")}.png`) });
      console.log("fig ->", `${prefix}-fig${i}`);
    } catch (e) {
      console.log("skip fig", i, e.message.split("\n")[0]);
    }
  }
  await ctx.close();
}

// Hero (live motion) + full pages (reduced motion so reveals are all visible)
await viewport({ path: "/", name: "hero-desktop", width: 1440, height: 860 });
await viewport({ path: "/", name: "hero-mobile", width: 390, height: 844 });
await fullPage({ path: "/", name: "index-desktop", width: 1440, height: 900 });
await fullPage({ path: "/", name: "index-mobile", width: 390, height: 844 });
await fullPage({ path: "/technical-report", name: "techreport-desktop", width: 1440, height: 900 });
await fullPage({ path: "/technical-report", name: "techreport-mobile", width: 390, height: 844 });
await fullPage({ path: "/contact", name: "contact-desktop", width: 1440, height: 900 });

// Isolated figures
await figures({ path: "/", prefix: "index" });
await figures({ path: "/technical-report", prefix: "techreport" });

await browser.close();
server.close();
console.log("done ->", OUT);
