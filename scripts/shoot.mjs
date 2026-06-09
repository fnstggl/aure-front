import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const url = "file://" + resolve(__dir, "preview.html");
const out = process.argv[2] || resolve(__dir, "../.diagram-preview.png");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.locator("#stage").screenshot({ path: out });
await browser.close();
console.log("shot ->", out);
