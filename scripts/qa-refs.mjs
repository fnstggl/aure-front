import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dir, "../.qa/refs");
mkdirSync(OUT, { recursive: true });

const TARGETS = [
  ["stripe-home", "https://stripe.com"],
  ["stripe-docs", "https://docs.stripe.com/payments"],
  ["nvidia-dc", "https://www.nvidia.com/en-us/data-center/"],
  ["nvidia-dev", "https://developer.nvidia.com/blog/"],
  ["databricks-home", "https://www.databricks.com"],
  ["databricks-arch", "https://www.databricks.com/product/data-intelligence-platform"],
  ["snowflake-home", "https://www.snowflake.com/en/"],
  ["snowflake-arch", "https://www.snowflake.com/en/product/platform/snowflake-architecture/"],
  ["appliedcompute", "https://www.appliedcompute.ai"],
  ["appliedcompute-alt", "https://appliedcompute.com"],
];

const browser = await chromium.launch({ args: ["--ignore-certificate-errors"] });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  ignoreHTTPSErrors: true,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
});

for (const [name, url] of TARGETS) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(4500); // let hero / diagrams paint
    // best-effort cookie dismissal
    for (const t of ["Accept all", "Accept All", "Accept", "Agree", "I agree", "Got it"]) {
      const b = page.getByRole("button", { name: t }).first();
      if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); break; }
    }
    await page.waitForTimeout(800);
    await page.screenshot({ path: resolve(OUT, `${name}.png`) }); // above-the-fold
    console.log("ok ->", name, url);
  } catch (e) {
    console.log("FAIL ->", name, url, "::", e.message.split("\n")[0]);
  }
  await page.close();
}

await browser.close();
console.log("done ->", OUT);
