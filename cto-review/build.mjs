// Rebuild the CTO-review PDFs from source.
//
//   node build.mjs            # writes report.built.html + memo.built.html (self-contained)
//   node build.mjs --pdf      # also renders PDFs if a Chromium binary is available
//
// Fonts (Helvetica Now Display + IBM Plex Mono) are read from ../public/fonts
// and inlined as base64, so the output HTML/PDF is fully self-contained and
// matches the live site's typography. No external assets, no CDN.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const FONTS = "../public/fonts";
const face = (fam, wght, file) =>
  `@font-face{font-family:'${fam}';font-style:normal;font-weight:${wght};font-display:block;` +
  `src:url(data:font/woff2;base64,${readFileSync(`${FONTS}/${file}`).toString("base64")}) format('woff2');}`;

const fontsCss = [
  face("Helvetica Now Display", 400, "HelveticaNowDisplay-Regular.woff2"),
  face("Helvetica Now Display", 500, "HelveticaNowDisplay-Medium.woff2"),
].join("\n");

// The Aurelius wordmark, inlined as a data URI (white on transparent; the memo
// inverts it to black via CSS). Single typeface across both docs is Helvetica
// Now Display; labels reuse it uppercase, so no mono face is embedded.
const logoSrc = "data:image/png;base64," +
  readFileSync("../public/aure_logo.png").toString("base64");

// Pre-render FIG.01 convergence field so the report PDF never depends on JS timing.
function grid() {
  const COLS = 48, ROWS = 13, ch = 10, W = 408;
  const winR = Math.floor(ROWS / 2), winC = Math.floor(COLS * 0.52);
  const rand = n => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
  let maxd = 0; const cells = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const r = Math.floor(i / COLS), c = i % COLS, dr = r - winR, dc = c - winC;
    const d = Math.hypot((dr + dc) * 0.62, (dr - dc) * 1.18); cells.push({ r, c, d }); if (d > maxd) maxd = d;
  }
  let f = "";
  cells.forEach((cc, k) => {
    const nd = cc.d / maxd, isWin = cc.r === winR && cc.c === winC;
    let op = isWin ? 1 : Math.max(0.05, Math.min(0.62,
      0.06 + Math.max(0, 1 - nd) * 0.5 + (rand(k * 3.17) - 0.5) * 0.10));
    if (!isWin && nd > 0.62) op = Math.min(op, 0.10 + rand(k * 1.7) * 0.06);
    const x = (cc.c * (W / COLS)).toFixed(1), y = (cc.r * ch + 3).toFixed(1), sz = isWin ? 6 : 5;
    f += `<rect x="${x}" y="${y}" width="${sz}" height="${sz}" fill="#fff" fill-opacity="${op.toFixed(3)}"${isWin ? ' stroke="#fff" stroke-opacity="0.25" stroke-width="0.8"' : ""}/>`;
  });
  return f;
}

function assemble(src, out, injectGrid) {
  let html = readFileSync(src, "utf8").replace("/*FONTS*/", fontsCss).split("LOGO_SRC").join(logoSrc);
  if (injectGrid) html = html.replace(/(<svg id="grid"[^>]*>)(<\/svg>)/, (m, a, b) => a + grid() + b)
                             .replace(/<script>[\s\S]*?<\/script>\s*<\/body>/, "</body>");
  writeFileSync(out, html);
  return out;
}

const report = assemble("report.html", "report.built.html", true);
const memo = assemble("memo.html", "memo.built.html", false);
console.log("wrote", report, "and", memo);

if (process.argv.includes("--pdf")) {
  const bin = ["/opt/pw-browsers/chromium", "/usr/bin/chromium", "/usr/bin/google-chrome"]
    .find(p => existsSync(p));
  if (!bin) { console.log("no Chromium found; skipping PDF render"); process.exit(0); }
  for (const [html, pdf] of [[report, "Aurelius_Technical_Report.pdf"], [memo, "Aurelius_Memo.pdf"]]) {
    execFileSync(bin, ["--headless", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
      "--virtual-time-budget=6000", `--print-to-pdf=${pdf}`, html], { stdio: "ignore" });
    console.log("rendered", pdf);
  }
}
