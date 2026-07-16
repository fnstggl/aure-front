import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";

/* Generates the Fireworks cover at public/research_fireworksai.png (text baked
   in, 90° sharp edges) so the memo's hero works on checkout. Replace the PNG
   with the final art any time — the page just reads /research_fireworksai.png. */

const __dir = dirname(fileURLToPath(import.meta.url));
const PUB = resolve(__dir, "../public");
const W = 1152;
const H = 632;

const aureLogo = "data:image/png;base64," + readFileSync(resolve(PUB, "aure_logo.png")).toString("base64");

const grain =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const field = [
  "radial-gradient(55% 55% at 16% 70%, hsl(210 50% 72% / 0.42), transparent 72%)",
  "radial-gradient(82% 82% at 44% 46%, hsl(222 75% 44% / 0.55), transparent 72%)",
  "radial-gradient(55% 70% at 82% 38%, hsl(6 78% 52% / 0.50), transparent 72%)",
  "radial-gradient(46% 52% at 92% 72%, hsl(18 85% 56% / 0.34), transparent 72%)",
  "hsl(224 56% 11%)",
].join(", ");

// Two-point sparkle (same mark as the config), white.
const spark = (cx, cy, r, inner = 0.32) => {
  const i = r * inner;
  return `M${cx} ${cy - r} L${cx + i} ${cy - i} L${cx + r} ${cy} L${cx + i} ${cy + i} L${cx} ${cy + r} L${cx - i} ${cy + i} L${cx - r} ${cy} L${cx - i} ${cy - i} Z`;
};

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px}
  .cover{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${field};
    font-family:Geist,Inter,system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .grain{position:absolute;inset:0;background-image:url("${grain}");opacity:.07;mix-blend-mode:overlay}
  .vig{position:absolute;inset:0;background:radial-gradient(125% 95% at 50% 44%, transparent 38%, hsl(0 0% 2% / 0.58) 100%)}
  .title{position:relative;display:flex;align-items:center;gap:18px;color:#fff;font-weight:500;
    font-size:60px;letter-spacing:-0.025em;line-height:1.04;white-space:nowrap}
  .title svg{height:.74em;width:auto}
  .by{position:absolute;bottom:54px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:10px;
    color:hsl(0 0% 100% / .72);font-size:15px;letter-spacing:-0.01em}
  .by img{height:17px;width:auto;opacity:.92}
</style></head>
<body><div class="cover">
  <div class="grain"></div><div class="vig"></div>
  <div class="title"><span style="color:hsl(0 0% 100% / .92)">Economic Analysis for</span>
    <svg viewBox="0 0 36 36" fill="#fff"><path d="${spark(14, 19, 13)}"/><path d="${spark(28, 8, 6.5)}"/></svg>
    <span>Fireworks AI</span></div>
  <div class="by"><span>Research by</span><img src="${aureLogo}" alt="Aurelius"/></div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.waitForTimeout(1200); // let the webfont settle
await page.locator(".cover").screenshot({ path: resolve(PUB, "research_fireworksai.png") });
await browser.close();
console.log(`wrote public/research_fireworksai.png (${W}x${H} @2x)`);
