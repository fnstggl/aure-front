import { chromium } from "playwright";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, extname } from "node:path";
import { mkdirSync, readFileSync, existsSync, statSync } from "node:fs";

/* Self-contained visual QA for the private research memo: serves dist/ over
   IPv4 (vite preview forces IPv6 in this sandbox) with directory-index + SPA
   fallback, then screenshots the route at desktop + mobile. */

const __dir = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dir, "../dist");
const OUT = resolve(__dir, "../.qa/research");
mkdirSync(OUT, { recursive: true });
const PATH = process.env.PAGEPATH || "/fireworks-ai-FH37X";

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

function send(res, file) {
  res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  let p = join(DIST, url);
  if (existsSync(p) && statSync(p).isFile()) return send(res, p);
  const idx = join(p, "index.html");
  if (existsSync(idx)) return send(res, idx); // prerendered directory route
  return send(res, join(DIST, "index.html")); // SPA fallback
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;
console.log("serving dist at", BASE, "→", PATH);

const browser = await chromium.launch();
async function shot({ width, height, name, full, reduced = false }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + PATH, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: !!full });
  await ctx.close();
  console.log("->", name);
}

await shot({ width: 1440, height: 900, name: "research-hero-desktop" });
// Reduced motion forces scroll-reveals visible, so full-page captures show all
// content (off-screen IntersectionObserver reveals never fire in fullPage mode).
await shot({ width: 1440, height: 900, name: "research-full-desktop", full: true, reduced: true });
await shot({ width: 390, height: 844, name: "research-full-mobile", full: true, reduced: true });

await browser.close();
server.close();
console.log("done ->", OUT);
