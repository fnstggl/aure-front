import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dir, "../.qa/refs");
mkdirSync(OUT, { recursive: true });

// [name, url, [scrollY positions...]]
const TARGETS = [
  ["ac-flow", "https://appliedcompute.com", [1400, 2400, 3400]],
  ["dbx-arch", "https://www.databricks.com/product/data-intelligence-platform", [900, 1800]],
  ["nvidia-blog-post", "https://developer.nvidia.com/blog/", [700]],
];

const browser = await chromium.launch({ args: ["--ignore-certificate-errors"] });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  ignoreHTTPSErrors: true,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
});

for (const [name, url, scrolls] of TARGETS) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3500);
    for (const t of ["Accept all", "Accept All", "Accept", "Agree", "Got it"]) {
      const b = page.getByRole("button", { name: t }).first();
      if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); break; }
    }
    let i = 0;
    for (const y of scrolls) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(1800);
      await page.screenshot({ path: resolve(OUT, `${name}-${i}.png`) });
      console.log("ok ->", name, i, "@", y);
      i++;
    }
  } catch (e) {
    console.log("FAIL ->", name, "::", e.message.split("\n")[0]);
  }
  await page.close();
}

await browser.close();
console.log("done");
