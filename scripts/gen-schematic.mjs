/**
 * Aurelius flagship — Crusoe/Lambda-style technical isometric LINE ART.
 *
 * Emits the STATIC line-art structure (thin white strokes on near-black) plus a
 * meta.json of anchor points / paths the React wrapper uses to animate the
 * transformation story. Pure orthographic isometric, minimal dark fills for
 * occlusion, one steel-blue signal accent, red only for the blocked path.
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
const W = 1280, H = 850;
const SX = 40, SY = 20, SZ = 33, OX = 560, OY = 286;
const r = (n) => Math.round(n * 10) / 10;
const iso = (x, y, z = 0) => [OX + (x - y) * SX, OY + (x + y) * SY - z * SZ];

/* ---- palette ---- */
const W1 = "#e2e6ec";          // primary line
const W2 = "rgba(226,230,236,0.5)";  // secondary / back edge
const W3 = "rgba(226,230,236,0.26)"; // faint
const FILL_T = "#0e1218";      // top face fill (occlusion)
const FILL_S = "#0a0d12";      // side face fill
const FILL_S2 = "#070a0e";     // darker side
const STEEL = "#7b91bb";       // signal accent
const STEELF = "rgba(123,145,187,0.5)";
const RED = "#c25b57";
const BG = "#080a0e";

/* ---- svg helpers ---- */
const pts = (a) => a.map((p) => `${r(p[0])},${r(p[1])}`).join(" ");
const line = (a, b, s = W1, w = 1.1, dash, op = 1) =>
  `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="${s}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}${op !== 1 ? ` opacity="${op}"` : ""} stroke-linecap="round"/>`;
const poly = (p, s = W1, f = "none", w = 1.1, op = 1) =>
  `<polygon points="${pts(p)}" fill="${f}" stroke="${s}" stroke-width="${w}"${op !== 1 ? ` opacity="${op}"` : ""} stroke-linejoin="round"/>`;
const polyline = (p, s = W1, w = 1.1, dash, op = 1) =>
  `<polyline points="${pts(p)}" fill="none" stroke="${s}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""}${op !== 1 ? ` opacity="${op}"` : ""} stroke-linecap="round" stroke-linejoin="round"/>`;

/* ---- primitives ---- */
// flat slab (thin extruded plane). x,y,z = near origin corner; w,d footprint.
function isoPlane(x, y, z, w, d, th = 0.32, { topFill = FILL_T } = {}) {
  const A = iso(x, y, z), B = iso(x + w, y, z), Cc = iso(x + w, y + d, z), D = iso(x, y + d, z);
  const Bb = iso(x + w, y, z - th), Cb = iso(x + w, y + d, z - th), Db = iso(x, y + d, z - th);
  let s = "";
  s += poly([B, Cc, Cb, Bb], W2, FILL_S, 1.1);     // right side
  s += poly([D, Cc, Cb, Db], W2, FILL_S2, 1.1);    // left side
  s += poly([A, B, Cc, D], W1, topFill, 1.2);      // top
  return s;
}
// wireframe box with dark faces for occlusion. returns {svg, faces}
function isoBox(x, y, z, w, d, h, { top = FILL_T, side = FILL_S, side2 = FILL_S2, sw = 1.1 } = {}) {
  const T0 = iso(x, y, z + h), T1 = iso(x + w, y, z + h), T2 = iso(x + w, y + d, z + h), T3 = iso(x, y + d, z + h);
  const B1 = iso(x + w, y, z), B2 = iso(x + w, y + d, z), B3 = iso(x, y + d, z);
  let s = "";
  s += poly([T1, T2, B2, B1], W1, side, sw);   // +x right face
  s += poly([T3, T2, B2, B3], W1, side2, sw);  // +y left face
  s += poly([T0, T1, T2, T3], W1, top, sw);    // top
  return s;
}
// server rack: box + front-face slot detail + fan vents on top-right face
function serverRack(x, y, z, w, d, h) {
  let s = isoBox(x, y, z, w, d, h);
  // horizontal unit slots on the +x face
  for (let i = 1; i <= 5; i++) {
    const zz = z + (h * i) / 6;
    s += line(iso(x + w, y + 0.12, zz), iso(x + w, y + d - 0.12, zz), W2, 0.8);
  }
  // vent stripes on top
  for (let i = 1; i <= 4; i++) {
    const yy = y + (d * i) / 5;
    s += line(iso(x + 0.1, yy, z + h), iso(x + w - 0.1, yy, z + h), W3, 0.7);
  }
  // a couple of lit unit LEDs (steel) on the front
  s += `<circle cx="${r(iso(x + w, y + 0.4, z + h * 0.78)[0])}" cy="${r(iso(x + w, y + 0.4, z + h * 0.78)[1])}" r="1.6" fill="${STEEL}"/>`;
  return s;
}
// small GPU node (low box)
function gpuNode(x, y, z, sz = 0.9, h = 0.7) {
  return isoBox(x, y, z, sz, sz, h, { sw: 0.9 });
}
// boundary wall (thin vertical plane along an axis)
function wall(x, y, z, len, ht, axis = "x", { s = W1, dash, op = 1, fill = "rgba(194,91,87,0.06)" } = {}) {
  const e = axis === "x" ? [x + len, y, z] : [x, y + len, z];
  const A = iso(x, y, z), B = iso(...e), Bt = iso(e[0], e[1], z + ht), At = iso(x, y, z + ht);
  let out = poly([A, B, Bt, At], s, fill, 1.1, op);
  if (dash) out = poly([A, B, Bt, At], s, "none", 1.2, op).replace("/>", ` stroke-dasharray="${dash}"/>`);
  return out;
}
// audit ledger: a stack of thin plates (archive)
function ledgerStack(x, y, z, n, w = 2.2, d = 1.6, gap = 0.34) {
  let s = "";
  for (let i = 0; i < n; i++) s += isoPlane(x, y, z + i * gap, w, d, 0.16, { topFill: i >= n - 1 ? "rgba(123,145,187,0.14)" : FILL_T });
  return s;
}
// control-plane chip: notched socket plate + raised die + pins
function chipModule(x, y, z, w = 3.4, d = 3.0) {
  let s = isoPlane(x, y, z, w, d, 0.3);
  // notched inner ring (socket)
  const mx = x + 0.5, my = y + 0.5, mw = w - 1, md = d - 1;
  s += polyline([iso(mx, my, z), iso(mx + mw, my, z), iso(mx + mw, my + md, z), iso(mx, my + md, z), iso(mx, my, z)], W2, 0.9);
  // raised die
  s += isoBox(x + w / 2 - 0.7, y + d / 2 - 0.7, z, 1.4, 1.4, 0.5, { top: "rgba(123,145,187,0.12)", sw: 1 });
  // emblem keystone on die
  const e = iso(x + w / 2, y + d / 2, z + 0.5);
  s += poly([[e[0], e[1] - 9], [e[0] + 7, e[1] - 1], [e[0] + 3.5, e[1] - 1], [e[0], e[1] - 5.5], [e[0] - 3.5, e[1] - 1], [e[0] - 7, e[1] - 1]], STEEL, "none", 1.1);
  return s;
}
// constraint gate: a frame/portal (two posts + lintel) the advisory passes through
function gate(x, y, z, h = 2.2, span = 2.0) {
  let s = "";
  s += isoBox(x, y, z, 0.34, 0.34, h, { sw: 1 });
  s += isoBox(x, y + span, z, 0.34, 0.34, h, { sw: 1 });
  s += line(iso(x + 0.17, y + 0.17, z + h), iso(x + 0.17, y + span + 0.17, z + h), W1, 1.1);
  // filter bars (last one red = rejected candidate)
  for (let i = 0; i < 4; i++) {
    const yy = y + 0.3 + (i * (span - 0.3)) / 3;
    s += line(iso(x + 0.17, yy, z + h * 0.78), iso(x + 0.17, yy, z + 0.2), i === 3 ? RED : W2, 1.2, null, i === 3 ? 0.9 : 0.6);
  }
  return s;
}
// upright cloud silhouette (economic forecast) with slight iso depth + accent dots
function cloud(cx, cy, scale = 1, depth = 14) {
  const u = scale;
  // front silhouette path (flat bottom, 3 bumps)
  const d = `M ${cx - 70 * u},${cy + 8 * u}
    a ${20 * u},${20 * u} 0 0 1 ${2 * u},${-34 * u}
    a ${22 * u},${22 * u} 0 0 1 ${40 * u},${-12 * u}
    a ${26 * u},${26 * u} 0 0 1 ${52 * u},${10 * u}
    a ${18 * u},${18 * u} 0 0 1 ${-2 * u},${36 * u}
    Z`;
  const dx = depth, dy = -depth * 0.5;
  let s = "";
  // depth copy (back), connectors, front
  s += `<path d="${d}" transform="translate(${r(dx)},${r(dy)})" fill="${BG}" stroke="${W2}" stroke-width="1"/>`;
  // connector lines at silhouette extremes (approx)
  s += line([cx - 68 * u, cy - 12 * u], [cx - 68 * u + dx, cy - 12 * u + dy], W2, 0.9);
  s += line([cx + 22 * u, cy + 8 * u], [cx + 22 * u + dx, cy + 8 * u + dy], W2, 0.9);
  s += `<path d="${d}" fill="${BG}" stroke="${W1}" stroke-width="1.2"/>`;
  // forecast matrix dots (steel accent), sparse
  const cells = [[-44, -16], [-30, 2], [-12, -22], [-12, 6], [6, -8], [22, -18], [22, 8], [-44, 4]];
  cells.forEach(([ox, oy], i) => {
    s += `<rect x="${r(cx + ox * u)}" y="${r(cy + oy * u)}" width="${r(7 * u)}" height="${r(7 * u)}" fill="${i % 3 === 0 ? STEEL : STEELF}"/>`;
  });
  return s;
}

/* ====================== composition ====================== */
// LEFT: customer infrastructure (exploded: GPU fleet plane over datacenter infra)
// RIGHT: Aurelius control plane (chip) + forecast cloud + constraint gate + ledger
// BETWEEN: steel metadata bridge (+ packet), red blocked path to a boundary wall,
//          steel advisory return.

// left stack centered at world (2.5, 9.5); right Aurelius centered at (9.5, 2.5)
const LX = 0, LY = 7, LW = 5, LD = 5;          // left footprint
const Z_INFRA = 0, Z_GPU = 3.6;
const RX = 6.6, RY = 0.4, RW = 5, RD = 5;        // right footprint
const Z_AUR = 1.8;

function buildStructure() {
  let s = `<rect x="0" y="0" width="${W}" height="${H}" fill="${BG}"/>`;

  // ---- LEFT: datacenter infra plane (bottom) ----
  s += isoPlane(LX, LY, Z_INFRA, LW, LD, 0.4);
  // a couple of cooling/power units on it
  s += serverRack(LX + 0.6, LY + 0.7, Z_INFRA, 1.3, 1.6, 1.4);
  s += isoBox(LX + 2.7, LY + 2.7, Z_INFRA, 1.6, 1.6, 0.9);
  // exploded struts to GPU plane
  for (const [cx, cy] of [[LX + 0.4, LY + 0.4], [LX + LW - 0.4, LY + 0.4], [LX + 0.4, LY + LD - 0.4], [LX + LW - 0.4, LY + LD - 0.4]])
    s += line(iso(cx, cy, Z_INFRA), iso(cx, cy, Z_GPU), W3, 0.8, "2 4");

  // ---- LEFT: GPU fleet plane (top) ----
  s += isoPlane(LX, LY, Z_GPU, LW, LD, 0.32);
  // grid of server racks (the fleet / execution)
  const racks = [[0.5, 0.6], [2.0, 0.6], [3.5, 0.6], [0.5, 2.1], [2.0, 2.1], [3.5, 2.1], [0.5, 3.6], [2.0, 3.6], [3.5, 3.6]];
  for (const [rx, ry] of racks) s += serverRack(LX + rx, LY + ry, Z_GPU, 1.1, 1.1, 1.9);

  // ---- RIGHT: Aurelius control plane ----
  s += isoPlane(RX, RY, Z_AUR, RW, RD, 0.36);
  // boundary wall along the inbound (left) edge — payloads are blocked here
  s += wall(RX, RY + 0.5, Z_AUR, 4.0, 2.1, "y", { s: "rgba(226,230,236,0.6)", fill: "rgba(123,145,187,0.05)" });
  // constraint gate just inside the inbound edge (metadata/advisory passes through)
  s += gate(RX + 0.7, RY + 1.3, Z_AUR, 2.0, 2.3);
  // control-plane chip at center
  s += chipModule(RX + 1.5, RY + 1.2, Z_AUR, 2.4, 2.6);
  // audit ledger stack (back-right corner)
  s += ledgerStack(RX + 3.5, RY + 0.5, Z_AUR, 6, 1.5, 1.3);

  // ---- forecast cloud above Aurelius ----
  const cc = iso(RX + RW / 2, RY + RD / 2, Z_AUR + 6.4);
  s += cloud(cc[0], cc[1], 1.0, 16);
  // dashed forecast arrows from chip up to cloud
  for (let i = -1; i <= 1; i++) {
    const a = iso(RX + RW / 2 + i * 0.7, RY + RD / 2 + i * 0.2, Z_AUR + 0.6);
    const b = [a[0] + i * 6, cc[1] + 70];
    s += line(a, b, STEELF, 1, "2 5");
  }

  return s;
}

/* ---- anchors / paths for the animated overlay ---- */
const schedOut = iso(LX + LW - 0.4, LY + 0.8, Z_GPU + 1.0);    // leaves GPU/scheduler plane
const aurIn = iso(RX + 0.5, RY + 2.4, Z_AUR + 0.4);            // enters Aurelius (through gate)
const bMid = [(schedOut[0] + aurIn[0]) / 2, Math.min(schedOut[1], aurIn[1]) - 26];
const bridgeD = `M${r(schedOut[0])},${r(schedOut[1])} Q${r(bMid[0])},${r(bMid[1])} ${r(aurIn[0])},${r(aurIn[1])}`;

const advFrom = iso(RX + 0.7, RY + 1.6, Z_AUR + 0.6);
const schedIn = iso(LX + LW - 0.8, LY + 2.4, Z_GPU + 0.8);
const aMid = [(advFrom[0] + schedIn[0]) / 2, Math.max(advFrom[1], schedIn[1]) + 24];
const advD = `M${r(advFrom[0])},${r(advFrom[1])} Q${r(aMid[0])},${r(aMid[1])} ${r(schedIn[0])},${r(schedIn[1])}`;

const payFrom = iso(LX + LW - 0.4, LY + 4.2, Z_GPU + 1.4);     // payload tries to leave the fleet
const barrier = iso(RX - 0.2, RY + 2.0, Z_AUR + 1.0);          // hits the boundary wall
const pMid = [(payFrom[0] + barrier[0]) / 2, (payFrom[1] + barrier[1]) / 2 + 30];
const payD = `M${r(payFrom[0])},${r(payFrom[1])} Q${r(pMid[0])},${r(pMid[1])} ${r(barrier[0])},${r(barrier[1])}`;

const gateTop = iso(RX + 0.87, RY + 2.45, Z_AUR + 2.0);
const ledgerTop = iso(RX + 4.25, RY + 1.15, Z_AUR + 6 * 0.34);

const meta = {
  viewBox: [W, H],
  paths: { bridge: bridgeD, advisory: advD, blocked: payD },
  packet: { from: schedOut, mid: bMid, to: aurIn },
  advisory: { from: advFrom, mid: aMid, to: schedIn },
  blocked: { from: payFrom, mid: pMid, to: barrier },
  barrier, gate: gateTop, ledger: ledgerTop,
  cloud: iso(RX + RW / 2, RY + RD / 2, Z_AUR + 6.4),
  labels: {
    workload: iso(LX + LW / 2, LY + LD / 2, Z_GPU + 2.0),
    scheduler: iso(LX + LW / 2, LY + LD, Z_GPU),
    aurelius: iso(RX + RW / 2, RY + RD / 2, Z_AUR),
    constraint: gateTop,
    ledger: ledgerTop,
    forecast: iso(RX + RW / 2, RY + RD / 2, Z_AUR + 6.4),
    blocked: barrier,
    bridge: bMid,
  },
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${buildStructure()}</svg>\n`;
writeFileSync(resolve(PUB, "structure.svg"), svg);
writeFileSync(resolve(META_DIR, "meta.json"), JSON.stringify(meta, null, 2));
console.log("wrote structure.svg + meta.json");
