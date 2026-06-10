/**
 * Aurelius flagship — "advisory layer" vertical 3-layer schematic (line art).
 *
 * ONE idea in 3 seconds: Aurelius sits between the customer's existing scheduler
 * and GPU execution as an advisory/control layer. A vertical isometric stack:
 *
 *     EXISTING SCHEDULER   (top)
 *            |  metadata
 *     AURELIUS             (middle, dominant)  — constraint gate
 *            |  approved
 *     EXECUTION / GPU      (bottom)            — execution unchanged
 *
 * Thin white line art on near-black; steel-blue = approved metadata/control;
 * red only for a rejected payload caught at the gate. Emits structure.svg +
 * meta.json (anchors for the animated overlay + scheduler-name crossfade).
 *
 *   node scripts/gen-schematic.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const PUB = resolve(__dir, "../public/diagrams/aurelius-schematic");
const META_DIR = resolve(__dir, "../src/components/diagrams/aurelius-schematic");
mkdirSync(PUB, { recursive: true });
mkdirSync(META_DIR, { recursive: true });

/* ---- projection (2:1 orthographic isometric) ---- */
const W = 880, H = 744;
const SX = 33, SY = 16.5, SZ = 30, OX = 432, OY = 392;
const r = (n) => Math.round(n * 10) / 10;
const iso = (x, y, z = 0) => [OX + (x - y) * SX, OY + (x + y) * SY - z * SZ];

/* ---- palette ---- */
const W1 = "#e2e6ec";
const W2 = "rgba(226,230,236,0.5)";
const W3 = "rgba(226,230,236,0.24)";
const FILL_T = "#0e1218", FILL_S = "#0a0d12", FILL_S2 = "#070a0e";
const STEEL = "#7b91bb", STEELF = "rgba(123,145,187,0.5)";
const RED = "#c25b57";
const BG = "#080a0e";

/* ---- svg helpers ---- */
const pts = (a) => a.map((p) => `${r(p[0])},${r(p[1])}`).join(" ");
const line = (a, b, s = W1, w = 1.1, dash, op = 1) =>
  `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="${s}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}${op !== 1 ? ` opacity="${op}"` : ""} stroke-linecap="round"/>`;
const poly = (p, s = W1, f = "none", w = 1.1, op = 1) =>
  `<polygon points="${pts(p)}" fill="${f}" stroke="${s}" stroke-width="${w}"${op !== 1 ? ` opacity="${op}"` : ""} stroke-linejoin="round"/>`;
const polyline = (p, s = W1, w = 1.1, dash, op = 1) =>
  `<polyline points="${pts(p)}" fill="none" stroke="${s}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}${op !== 1 ? ` opacity="${op}"` : ""} stroke-linejoin="round" stroke-linecap="round"/>`;

/* ---- primitives ---- */
function isoPlane(x, y, z, w, d, th = 0.3, { topFill = FILL_T, sw = 1.2 } = {}) {
  const A = iso(x, y, z), B = iso(x + w, y, z), Cc = iso(x + w, y + d, z), D = iso(x, y + d, z);
  const Bb = iso(x + w, y, z - th), Cb = iso(x + w, y + d, z - th), Db = iso(x, y + d, z - th);
  let s = "";
  s += poly([B, Cc, Cb, Bb], W2, FILL_S, 1.1);
  s += poly([D, Cc, Cb, Db], W2, FILL_S2, 1.1);
  s += poly([A, B, Cc, D], W1, topFill, sw);
  return s;
}
function isoBox(x, y, z, w, d, h, { top = FILL_T, side = FILL_S, side2 = FILL_S2, sw = 1.1 } = {}) {
  const T0 = iso(x, y, z + h), T1 = iso(x + w, y, z + h), T2 = iso(x + w, y + d, z + h), T3 = iso(x, y + d, z + h);
  const B1 = iso(x + w, y, z), B2 = iso(x + w, y + d, z), B3 = iso(x, y + d, z);
  let s = "";
  s += poly([T1, T2, B2, B1], W1, side, sw);
  s += poly([T3, T2, B2, B3], W1, side2, sw);
  s += poly([T0, T1, T2, T3], W1, top, sw);
  return s;
}
function serverRack(x, y, z, w, d, h) {
  let s = isoBox(x, y, z, w, d, h);
  for (let i = 1; i <= 4; i++) s += line(iso(x + w, y + 0.12, z + (h * i) / 5), iso(x + w, y + d - 0.12, z + (h * i) / 5), W2, 0.8);
  for (let i = 1; i <= 3; i++) s += line(iso(x + 0.1, y + (d * i) / 4, z + h), iso(x + w - 0.1, y + (d * i) / 4, z + h), W3, 0.7);
  s += `<circle cx="${r(iso(x + w, y + 0.4, z + h * 0.78)[0])}" cy="${r(iso(x + w, y + 0.4, z + h * 0.78)[1])}" r="1.5" fill="${STEEL}"/>`;
  return s;
}
// exploded struts between two planes at the same footprint (4 corners)
function struts(x, y, z0, z1, w, d) {
  let s = "";
  for (const [cx, cy] of [[x + 0.3, y + 0.3], [x + w - 0.3, y + 0.3], [x + 0.3, y + d - 0.3], [x + w - 0.3, y + d - 0.3]])
    s += line(iso(cx, cy, z0), iso(cx, cy, z1), W3, 0.8, "2 5");
  return s;
}
// scheduler console with a front screen panel (the crossfading name sits here, in HTML)
function schedulerConsole(x, y, z, w, d, h) {
  let s = isoBox(x, y, z, w, d, h);
  // screen panel on the +x (right-front) face
  const z0 = z + h * 0.24, z1 = z + h * 0.84, ya = y + 0.28, yb = y + d - 0.28;
  s += poly([iso(x + w, ya, z1), iso(x + w, yb, z1), iso(x + w, yb, z0), iso(x + w, ya, z0)], W2, "rgba(123,145,187,0.06)", 1);
  return s;
}
// Aurelius control module (dominant) with keystone + a constraint gate frame on top
function aureliusModule(x, y, z, w, d, h) {
  let s = isoBox(x, y, z, w, d, h, { sw: 1.3 });
  // inner inset on top (control surface)
  const ix = x + 0.5, iy = y + 0.5, iw = w - 1, id = d - 1;
  s += polyline([iso(ix, iy, z + h), iso(ix + iw, iy, z + h), iso(ix + iw, iy + id, z + h), iso(ix, iy + id, z + h), iso(ix, iy, z + h)], W2, 0.9);
  // keystone emblem
  const e = iso(x + w / 2, y + d / 2, z + h);
  s += poly([[e[0], e[1] - 11], [e[0] + 8, e[1] - 1], [e[0] + 4, e[1] - 1], [e[0], e[1] - 6.5], [e[0] - 4, e[1] - 1], [e[0] - 8, e[1] - 1]], STEEL, "none", 1.2);
  return s;
}
// constraint gate: a small upright portal (two posts + lintel) on the Aurelius entry
function gate(x, y, z, h, span) {
  let s = "";
  s += isoBox(x, y, z, 0.28, 0.28, h, { sw: 1 });
  s += isoBox(x, y + span, z, 0.28, 0.28, h, { sw: 1 });
  s += line(iso(x + 0.14, y + 0.14, z + h), iso(x + 0.14, y + span + 0.14, z + h), W1, 1.1);
  for (let i = 0; i < 4; i++) {
    const yy = y + 0.24 + (i * (span - 0.24)) / 3;
    s += line(iso(x + 0.14, yy, z + h * 0.8), iso(x + 0.14, yy, z + 0.14), i === 3 ? RED : W2, 1.1, null, i === 3 ? 0.85 : 0.5);
  }
  return s;
}

/* ====================== composition (vertical stack) ====================== */
// shared footprint center ~ (3,3); Aurelius plane is larger (dominant).
const Z_EXEC = 0, Z_AUR = 4.2, Z_SCH = 8.6;
const EX = 0, EY = 0, EW = 6, ED = 6;                 // execution footprint
const AX = -0.8, AY = -0.8, AW = 7.6, AD = 7.6;        // Aurelius footprint (larger)
const SXX = 0.5, SYY = 0.5, SW = 5, SD = 5;            // scheduler footprint
// modules
const SCH_M = { x: 1.6, y: 1.6, w: 2.6, d: 2.6, h: 1.4 };
const AUR_M = { x: 1.4, y: 1.4, w: 3.2, d: 3.2, h: 1.7 };
const GATE = { x: 4.6, y: 1.8, h: 1.9, span: 2.4 };     // constraint gate on Aurelius plane (front)
const COL = { x: 4.0, y: 4.0 };                          // front column the packets travel

function buildStructure() {
  let s = `<rect x="0" y="0" width="${W}" height="${H}" fill="${BG}"/>`;

  // struts (exploded vertical stack)
  s += struts(SXX + 0.4, SYY + 0.4, Z_EXEC, Z_SCH, EW - 0.8, ED - 0.8);

  // ---- BOTTOM: execution / GPU fleet ----
  s += isoPlane(EX, EY, Z_EXEC, EW, ED, 0.34);
  const racks = [[0.7, 0.8], [2.4, 0.8], [4.1, 0.8], [0.7, 3.4], [2.4, 3.4], [4.1, 3.4]];
  for (const [rx, ry] of racks) s += serverRack(EX + rx, EY + ry, Z_EXEC, 1.2, 1.5, 1.5);

  // ---- MIDDLE: Aurelius (dominant) ----
  s += isoPlane(AX, AY, Z_AUR, AW, AD, 0.38, { sw: 1.3 });
  s += aureliusModule(AUR_M.x, AUR_M.y, Z_AUR, AUR_M.w, AUR_M.d, AUR_M.h);
  s += gate(GATE.x, GATE.y, Z_AUR, GATE.h, GATE.span);

  // ---- TOP: existing scheduler ----
  s += isoPlane(SXX, SYY, Z_SCH, SW, SD, 0.3);
  s += schedulerConsole(SCH_M.x, SCH_M.y, Z_SCH, SCH_M.w, SCH_M.d, SCH_M.h);

  return s;
}

/* ---- anchors / paths for the animated overlay ---- */
const schedOut = iso(COL.x, COL.y, Z_SCH);                 // metadata leaves scheduler
const aurIn = iso(COL.x, COL.y, Z_AUR + AUR_M.h + 0.1);    // enters Aurelius (top of module)
const aurOut = iso(COL.x, COL.y, Z_AUR);                   // exits Aurelius downward
const execIn = iso(COL.x, COL.y, Z_EXEC + 1.6);            // reaches execution
const gateTop = iso(GATE.x + 0.14, GATE.y + GATE.span / 2, Z_AUR + GATE.h);
const gatePt = iso(GATE.x + 0.14, GATE.y + GATE.span / 2, Z_AUR + GATE.h * 0.5);
const rejectFrom = iso(COL.x + 0.2, COL.y - 0.6, Z_SCH);   // alternate candidate from scheduler

// scheduler screen center (on the console +x face) for the HTML name crossfade
const schedScreen = iso(SCH_M.x + SCH_M.w, SCH_M.y + SCH_M.d / 2, Z_SCH + SCH_M.h * 0.54);

const meta = {
  viewBox: [W, H],
  packet: { schedOut, aurIn, aurOut, execIn },
  reject: { from: rejectFrom, to: gatePt },
  gate: gateTop,
  schedScreen,
  labels: {
    scheduler: iso(SXX + SW / 2, SYY + SD, Z_SCH),
    schedMeta: iso(COL.x + 0.2, COL.y + 0.2, (Z_SCH + Z_AUR) / 2 + 0.4),
    aurelius: iso(AX + AW / 2, AY + AD, Z_AUR),
    execution: iso(EX + EW / 2, EY + ED, Z_EXEC),
    execUnchanged: iso(COL.x + 0.2, COL.y + 0.2, (Z_AUR + Z_EXEC) / 2 - 0.2),
  },
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${buildStructure()}</svg>\n`;
writeFileSync(resolve(PUB, "structure.svg"), svg);
writeFileSync(resolve(META_DIR, "meta.json"), JSON.stringify(meta, null, 2));
console.log("wrote vertical structure.svg + meta.json");
