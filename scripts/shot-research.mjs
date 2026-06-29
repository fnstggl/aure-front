import { chromium } from "playwright";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, extname } from "node:path";
import { mkdirSync, readFileSync, existsSync, statSync } from "node:fs";

/* Self-contained QA for the private research memo: serves dist/ over IPv4
   (directory-index + SPA fallback), screenshots the route + key diagram
   sections at desktop & mobile, and prints the rendered word count. */

const __dir = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dir, "../dist");
const OUT = resolve(__dir, "../.qa/research");
mkdirSync(OUT, { recursive: true });
const PATH = process.env.PAGEPATH || "/fireworks-ai-FH37X";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".json": "application/json", ".webmanifest": "application/manifest+json", ".xml": "application/xml" };
const send = (res, f) => { res.writeHead(200, { "Content-Type": MIME[extname(f)] || "application/octet-stream" }); res.end(readFileSync(f)); };
const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const p = join(DIST, url);
  if (existsSync(p) && statSync(p).isFile()) return send(res, p);
  const idx = join(p, "index.html");
  if (existsSync(idx)) return send(res, idx);
  return send(res, join(DIST, "index.html"));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();

async function shot({ width, height, name, full, reduced }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  await page.goto(BASE + PATH, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: !!full });
  await ctx.close();
  console.log("->", name);
}

// Hero with the real cover image; full pages with reveals forced visible.
await shot({ width: 1440, height: 900, name: "v2-hero-desktop" });
await shot({ width: 1440, height: 900, name: "v2-full-desktop", full: true, reduced: true });
await shot({ width: 390, height: 844, name: "v2-full-mobile", full: true, reduced: true });

// Diagram + CTA close-ups, and a word count, in one reduced-motion pass.
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(BASE + PATH, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
for (const sel of ["#surprise", "#fit", "#hypotheses", "#workload", "#backtest", "#cta"]) {
  const el = page.locator(sel);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await el.screenshot({ path: resolve(OUT, `v2-sec${sel.replace("#", "-")}.png`) });
  console.log("->", sel);
}
// Rendered word count (hero img has no text; count visible memo copy).
const text = await page.evaluate(() => document.body.innerText);
const words = text.trim().split(/\s+/).filter(Boolean).length;
console.log("RENDERED_WORD_COUNT:", words);

// Confirm CTA copy exactly.
const ctaTitle = (await page.locator("#cta h2").innerText()).trim();
const ctaBtn = (await page.locator("#cta a").first().innerText()).trim();
console.log("CTA_TITLE:", JSON.stringify(ctaTitle));
console.log("CTA_PRIMARY:", JSON.stringify(ctaBtn));

await ctx.close();
await browser.close();
server.close();
console.log("done ->", OUT);
