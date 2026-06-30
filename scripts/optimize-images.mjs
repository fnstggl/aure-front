/**
 * One-shot image optimizer for the marketing site's large raster assets.
 *
 * The hero/background art ships as 2880×1620 PNGs (hundreds of KB each) that are
 * only ever used as decorative CSS backgrounds or a faded footer flourish. WebP
 * at a high visual quality is a fraction of the size with no perceptible change.
 * This script (re)generates the .webp variants from the PNG sources so the
 * conversion is reproducible; the committed .webp files are what the site
 * actually references, so the production build does NOT depend on this script.
 *
 * Run:  node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");

// source PNG -> webp quality. These are the two large background rasters that
// compress well as WebP. (hand-dots.png is intentionally left as PNG: it's a
// high-frequency dotted pattern with alpha that WebP actually makes larger.)
const TARGETS = [
  { src: "datacenter_back.png", quality: 80 },
  { src: "mobile_background.png", quality: 80 },
];

for (const { src, quality } of TARGETS) {
  const inPath = path.join(pub, src);
  const outPath = path.join(pub, src.replace(/\.png$/, ".webp"));
  const info = await sharp(inPath).webp({ quality, effort: 6 }).toFile(outPath);
  console.log(`[img] ${src} -> ${path.basename(outPath)}  ${(info.size / 1024).toFixed(0)} KB`);
}
