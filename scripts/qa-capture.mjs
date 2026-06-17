import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";

/* QA capture — full pages + every isolated diagram figure, desktop + mobile.
   Usage: node scripts/qa-capture.mjs <tag> */

const __dir = dirname(fileURLToPath(import.meta.url));
const tag = process.argv[2] || "current";
const OUT = resolve(__dir, `../.qa/${tag}`);
mkdirSync(OUT, { recursive: true });
const BASE = "http://127.0.0.1:5188";

const browser = await chromium.launch();

async function fullPage({ path, name, width, height }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: true });
  await ctx.close();
  console.log("full ->", name);
}

async function figures({ path, prefix, width = 1440 }) {
  const ctx = await browser.newContext({ viewport: { width, height: 1100 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const figs = await page.locator("figure").count();
  for (let i = 0; i < figs; i++) {
    const fig = page.locator("figure").nth(i);
    await fig.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000); // let the animation settle into the resting frame
    try {
      await fig.screenshot({ path: resolve(OUT, `${prefix}-fig${String(i).padStart(2, "0")}.png`) });
      console.log("fig ->", `${prefix}-fig${i}`);
    } catch (e) {
      console.log("skip fig", i, e.message.split("\n")[0]);
    }
  }
  await ctx.close();
}

async function heroShot({ width, height, name }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: resolve(OUT, `${name}.png`) });
  await ctx.close();
  console.log("hero ->", name);
}

await heroShot({ width: 1440, height: 860, name: "hero-desktop" });
await heroShot({ width: 390, height: 844, name: "hero-mobile" });

for (const [path, name] of [
  ["/", "index"],
  ["/how-it-works", "how-it-works"],
  ["/safety", "safety"],
  ["/shadow-audit", "shadow-audit"],
  ["/docs", "docs"],
  ["/contact", "contact"],
]) {
  await fullPage({ path, name, width: 1440, height: 900 });
}

await fullPage({ path: "/", name: "index-mobile", width: 390, height: 844 });

// Isolated diagram figures — the core of the QA
await figures({ path: "/", prefix: "index" });
await figures({ path: "/how-it-works", prefix: "hiw" });
await figures({ path: "/safety", prefix: "safety" });
await figures({ path: "/", prefix: "index-mobile", width: 390 });

await browser.close();
console.log("done ->", OUT);
