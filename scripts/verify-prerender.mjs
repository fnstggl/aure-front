/**
 * Build gate: fail if any prerendered route shipped without real body content.
 *
 * Guards against the SPA regressing to an empty `<div id="root"></div>` shell
 * (which is invisible to non-JS crawlers and AI fetchers). For every
 * each dist route's index.html it asserts the document contains a populated #root with an
 * <h1> and a meaningful amount of text. Exits non-zero on the first failure so
 * `npm run build` breaks loudly rather than deploying empty pages.
 */
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(root, "dist");
const MIN_TEXT = 200; // visible-ish text chars required in the body

async function htmlFiles() {
  const files = [];
  if (existsSync(path.join(DIST, "index.html"))) files.push(["/", path.join(DIST, "index.html")]);
  for (const entry of await readdir(DIST, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const f = path.join(DIST, entry.name, "index.html");
      if (existsSync(f)) files.push(["/" + entry.name, f]);
    }
  }
  if (existsSync(path.join(DIST, "404.html"))) files.push(["/404.html", path.join(DIST, "404.html")]);
  return files;
}

const failures = [];

for (const [route, file] of await htmlFiles()) {
  const html = await readFile(file, "utf8");
  // The built entry <script> lives in <head>, so #root is the last body node:
  // capture from the opening marker to the final </div> before </body>.
  const rootMatch = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/);
  const rootInner = rootMatch ? rootMatch[1] : "";
  const text = rootInner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const hasH1 = /<h1[\s>]/.test(rootInner);

  // The 404 page is intentionally minimal; it still must be non-empty + have an h1.
  const minText = route === "/404.html" ? 50 : MIN_TEXT;
  const problems = [];
  if (html.includes('<div id="root"></div>')) problems.push("empty #root");
  if (!hasH1) problems.push("no <h1>");
  if (text.length < minText) problems.push(`only ${text.length} chars of text`);

  if (problems.length) {
    failures.push(`  ✗ ${route} — ${problems.join(", ")}`);
  } else {
    console.log(`  ✓ ${route.padEnd(20)} h1 ✓  ${text.length} chars`);
  }
}

if (failures.length) {
  console.error("\n[verify-prerender] FAILED — routes missing body content:");
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("\n[verify-prerender] all routes have prerendered body content ✓");
