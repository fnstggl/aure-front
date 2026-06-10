import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dir, "../.qa");
mkdirSync(OUT, { recursive: true });
const BASE = "http://127.0.0.1:5188/";
const SEL = "[data-acp='schematic']";

const browser = await chromium.launch();
const rect = (sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: r.width, height: r.height };
};

async function shoot({ name, width, height, reduced, query = "", waits = [3200] }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + query, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(SEL, { state: "attached", timeout: 15000 });
    await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center" }), SEL);
    let prev = 0;
    for (let i = 0; i < waits.length; i++) {
      await page.waitForTimeout(waits[i] - prev);
      prev = waits[i];
      const box = await page.evaluate(rect, SEL);
      const suffix = waits.length > 1 ? `-${i}` : "";
      await page.screenshot({ path: resolve(OUT, `${name}${suffix}.png`), clip: box });
    }
    console.log("shot ->", name);
  } catch (e) {
    console.log("FAILED", name, e.message.split("\n")[0]);
  } finally {
    await ctx.close();
  }
}

await shoot({ name: "labeled", width: 1440, height: 1200, reduced: false });
await shoot({ name: "nolabels", width: 1440, height: 1200, reduced: false, query: "?nolabels=1" });
await shoot({ name: "reduced", width: 1440, height: 1200, reduced: true, waits: [900] });
await shoot({ name: "mobile", width: 390, height: 1400, reduced: false });
await shoot({ name: "cycle", width: 1440, height: 1200, reduced: false, query: "?nolabels=1", waits: [1500, 3300, 4600, 6300, 8200] });

await browser.close();
console.log("done");
