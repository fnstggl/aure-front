import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5188";
const browser = await chromium.launch();
const PAGES = ["/", "/how-it-works", "/safety", "/shadow-audit", "/docs", "/contact"];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

let totalErrors = 0;

for (const vp of VIEWPORTS) {
  for (const path of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    // scroll the whole page to trigger every IntersectionObserver / scroll effect
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.6;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    // horizontal overflow check (page should never scroll sideways)
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, over: de.scrollWidth - de.clientWidth };
    });
    const flag = overflow.over > 1 ? `  ⚠ H-OVERFLOW +${overflow.over}px` : "";
    const errFlag = errors.length ? `  ✗ ${errors.length} console error(s)` : "";
    totalErrors += errors.length;
    console.log(`${vp.name.padEnd(8)} ${path.padEnd(16)} w=${overflow.clientW}${flag}${errFlag}`);
    errors.forEach((e) => console.log("        " + e.slice(0, 160)));
    await ctx.close();
  }
}

await browser.close();
console.log(totalErrors === 0 ? "\nNO CONSOLE ERRORS" : `\n${totalErrors} CONSOLE ERRORS`);
