import { chromium } from "playwright";
import { resolve } from "node:path";
import { mkdirSync } from "node:fs";

const OUT = resolve(process.cwd(), ".qa/iter3");
mkdirSync(OUT, { recursive: true });
const BASE = "http://127.0.0.1:5188";
const browser = await chromium.launch();

async function figs(path, prefix) {
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 1000 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const n = await page.locator("figure").count();
  for (let i = 0; i < n; i++) {
    const fig = page.locator("figure").nth(i);
    await fig.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2700);
    await fig.screenshot({ path: resolve(OUT, `${prefix}-fig${i}.png`) });
  }
  await ctx.close();
}
await figs("/", "index");
await browser.close();
console.log("done");
