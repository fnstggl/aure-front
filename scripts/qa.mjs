import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dir, "../.qa");
const URL = "http://127.0.0.1:5188/";
const FIG = "figure:has-text('authored isometric schematic')";

const browser = await chromium.launch();

async function shootFigure({ name, width, height, reduced }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  const fig = page.locator(FIG).first();
  await fig.scrollIntoViewIfNeeded();
  await page.waitForTimeout(reduced ? 600 : 3400); // let the reveal settle
  await fig.screenshot({ path: resolve(OUT, `${name}.png`) });
  console.log("shot ->", name);
  await ctx.close();
}

await shootFigure({ name: "flagship-desktop", width: 1440, height: 1100, reduced: false });
await shootFigure({ name: "flagship-mobile", width: 390, height: 1400, reduced: false });
await shootFigure({ name: "flagship-reduced", width: 1440, height: 1100, reduced: true });

// mid-animation frame (packet travelling / red flash) for review
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  const fig = page.locator(FIG).first();
  await fig.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await fig.screenshot({ path: resolve(OUT, "flagship-midanim.png") });
  console.log("shot -> flagship-midanim");
  await ctx.close();
}

await browser.close();
console.log("done");
