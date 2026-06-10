import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";

/* Broad visual-QA harness. Captures the hero, every diagram figure, and full
   pages at desktop + mobile, plus a reduced-motion pass. Usage:
     node scripts/shots.mjs <outDir>            */

const __dir = dirname(fileURLToPath(import.meta.url));
const tag = process.argv[2] || "base";
const OUT = resolve(__dir, `../.qa/${tag}`);
mkdirSync(OUT, { recursive: true });
const BASE = "http://127.0.0.1:5188";

const browser = await chromium.launch();

async function fullPage({ path, name, width, height, reduced = false }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  // settle a moving cycle into a representative frame
  await page.waitForTimeout(2600);
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: true });
  await ctx.close();
  console.log("full ->", name);
}

async function figures({ path, prefix, width = 1440 }) {
  const ctx = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const figs = await page.locator("figure").count();
  for (let i = 0; i < figs; i++) {
    const fig = page.locator("figure").nth(i);
    await fig.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2800);
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
  await page.waitForTimeout(1500);
  await page.screenshot({ path: resolve(OUT, `${name}.png`) });
  await ctx.close();
  console.log("hero ->", name);
}

// Hero
await heroShot({ width: 1440, height: 900, name: "hero-desktop" });
await heroShot({ width: 390, height: 844, name: "hero-mobile" });

// Full pages — desktop
for (const [path, name] of [
  ["/", "index"],
  ["/how-it-works", "how-it-works"],
  ["/safety", "safety"],
  ["/shadow-audit", "shadow-audit"],
  ["/docs", "docs"],
]) {
  await fullPage({ path, name, width: 1440, height: 900 });
}

// Full page — mobile + reduced motion
await fullPage({ path: "/", name: "index-mobile", width: 390, height: 844 });
await fullPage({ path: "/", name: "index-reduced", width: 1440, height: 900, reduced: true });

// Diagram figures, isolated
await figures({ path: "/", prefix: "index" });
await figures({ path: "/?nolabels=1", prefix: "index-nolabels" });
await figures({ path: "/how-it-works", prefix: "hiw" });
await figures({ path: "/safety", prefix: "safety" });

await browser.close();
console.log("done ->", OUT);
