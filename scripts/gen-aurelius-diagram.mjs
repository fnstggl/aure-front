/**
 * Aurelius Control Plane — flagship isometric diagram generator.
 *
 * Authors a layered, true-2:1-isometric technical illustration and writes one
 * SVG per named layer into /public/diagrams/aurelius-control-plane/, plus a
 * meta.json (label anchors + animation paths) consumed by the React wrapper.
 *
 * These SVGs are the *source assets* for the layered illustration. They are
 * authored geometry (isometric objects with depth + lighting), not flat
 * dashboard rectangles, and are mirrored into the Figma file as named layers.
 * The React wrapper treats each file as an opaque layer, so authored
 * Figma/Spline renders can later replace any file with no component changes.
 *
 *   node scripts/gen-aurelius-diagram.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dir, "../public/diagrams/aurelius-control-plane");
const META_DIR = resolve(__dir, "../src/components/diagrams/aurelius-control-plane");
mkdirSync(OUT, { recursive: true });
mkdirSync(META_DIR, { recursive: true });

/* ----------------------------------------------------------------------- */
/* Canvas + isometric projection (2:1 dimetric)                            */
/* ----------------------------------------------------------------------- */
const W = 1440, H = 900;
const TILE = 32;   // screen px per grid unit along each ground axis (x half = TILE)
const ZU = 21;     // screen px per unit of height
const OX = 588, OY = 262;

const r = (n) => Math.round(n * 10) / 10;
/** grid (gx along +x→right-down, gy along +y→left-down, gz up) → [sx, sy] */
const pt = (gx, gy, gz = 0) => [OX + (gx - gy) * TILE, OY + (gx + gy) * (TILE / 2) - gz * ZU];
const P = (pts) => pts.map(([x, y]) => `${r(x)},${r(y)}`).join(" ");

/* ----------------------------------------------------------------------- */
/* Palettes — off-white / gray / silver infrastructure; steel-blue accent  */
/* light reads from upper-left: top brightest, +Y (left) face mid, +X dark */
/* ----------------------------------------------------------------------- */
const EDGE_D = "rgba(9,11,15,0.55)";       // dark facet seam
const EDGE_L = "rgba(255,255,255,0.16)";   // top rim highlight
const PAL = {
  silver:  { top: "#e7eaef", left: "#bdc4cd", right: "#8a919c" },
  pale:    { top: "#dde2e9", left: "#b1b9c3", right: "#838b96" },
  gray:    { top: "#c6ccd3", left: "#979ea8", right: "#6b727e" }, // execution (slightly cooler/back)
  body:    { top: "#dfe4ea", left: "#b4bcc6", right: "#868e99" }, // aurelius body
  steel:   { top: "#5a6f95", left: "#46587a", right: "#36455f" }, // aurelius accent panel
  ledger:  { top: "#dde2e9", left: "#aeb6c1", right: "#828a95" },
};
const STEEL = { line: "#4d6088", glow: "#3a4658", edge: "#6479a0", text: "#8b97ab" };
const RED = { core: "#b5524f", line: "rgba(155,63,61,0.78)", glow: "rgba(165,70,68,0.30)" };
const GRID_LINE = "rgba(255,255,255,0.05)";
const PLANE = { top: "#0f1218", left: "#0a0c11", right: "#070a0e", edge: "rgba(120,140,170,0.10)" };

/* ----------------------------------------------------------------------- */
/* Primitives                                                              */
/* ----------------------------------------------------------------------- */
function polygon(points, fill, stroke, sw = 1, opacity = 1) {
  return `<polygon points="${P(points)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ""}${opacity !== 1 ? ` opacity="${opacity}"` : ""} stroke-linejoin="round"/>`;
}

/** A cuboid from base corner (gx,gy) at height gz, footprint a×b, height c. */
function cuboid(gx, gy, a, b, c, pal, gz = 0, { rim = true } = {}) {
  const T0 = pt(gx, gy, gz + c), T1 = pt(gx + a, gy, gz + c), T2 = pt(gx + a, gy + b, gz + c), T3 = pt(gx, gy + b, gz + c);
  const Lb0 = pt(gx, gy + b, gz), Lb1 = pt(gx + a, gy + b, gz);
  const Rb0 = pt(gx + a, gy, gz), Rb1 = pt(gx + a, gy + b, gz);
  let s = "";
  s += polygon([T3, T2, Lb1, Lb0], pal.left, EDGE_D, 1);    // +Y face (left, mid)
  s += polygon([T1, T2, Rb1, Rb0], pal.right, EDGE_D, 1);   // +X face (right, dark)
  s += polygon([T0, T1, T2, T3], pal.top, EDGE_D, 1);       // top
  if (rim) s += `<polyline points="${P([T3, T0, T1])}" fill="none" stroke="${EDGE_L}" stroke-width="1.1"/>`;
  return s;
}

/** thin contact shadow under an object footprint center */
function contactShadow(cx, cy, rx, ry, op = 0.45, id) {
  return `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="url(#${id})" opacity="${op}"/>`;
}
const shadowGrad = (id) =>
  `<radialGradient id="${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#000" stop-opacity="0.55"/><stop offset="70%" stop-color="#000" stop-opacity="0.22"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>`;

/** stacked thin cards (workload queue) */
function cardStack(gx, gy, a, b, n, pal) {
  let s = "";
  const h = 0.32, gap = 0.5;
  for (let i = 0; i < n; i++) {
    const fade = 1 - (n - 1 - i) * 0.05;
    const p = {
      top: shade(pal.top, fade), left: shade(pal.left, fade), right: shade(pal.right, fade),
    };
    s += cuboid(gx, gy, a, b, h, p, i * gap);
  }
  return s;
}

/** iso disc (axis-aligned ellipse): ground circle radius rg at height z */
function disc(gx, gy, rg, z, fill, stroke, sw = 1, op = 1) {
  const [cx, cy] = pt(gx, gy, z);
  const rx = rg * TILE * 1.414, ry = rx / 2;
  return `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ""}${op !== 1 ? ` opacity="${op}"` : ""}/>`;
}

/** iso cylinder / drum (audit ledger). center (gx,gy), radius rg, height hg */
function cylinder(gx, gy, rg, hg, pal, { rings = 3 } = {}) {
  const [cxT, cyT] = pt(gx, gy, hg);
  const [cxB, cyB] = pt(gx, gy, 0);
  const rx = rg * TILE * 1.414, ry = rx / 2;
  let s = "";
  // body
  s += `<path d="M${r(cxT - rx)},${r(cyT)} L${r(cxB - rx)},${r(cyB)} A${r(rx)},${r(ry)} 0 0 0 ${r(cxB + rx)},${r(cyB)} L${r(cxT + rx)},${r(cyT)} A${r(rx)},${r(ry)} 0 0 1 ${r(cxT - rx)},${r(cyT)} Z" fill="${pal.right}" stroke="${EDGE_D}" stroke-width="1"/>`;
  // lit left half of body
  s += `<path d="M${r(cxT - rx)},${r(cyT)} L${r(cxB - rx)},${r(cyB)} A${r(rx)},${r(ry)} 0 0 0 ${r(cxB)},${r(cyB + ry)} L${r(cxT)},${r(cyT + ry)} A${r(rx)},${r(ry)} 0 0 1 ${r(cxT - rx)},${r(cyT)} Z" fill="${pal.left}" opacity="0.9"/>`;
  // ring grooves (the append-only stacked records)
  for (let i = 1; i < rings; i++) {
    const z = (hg * i) / rings;
    const [, cyR] = pt(gx, gy, z);
    s += `<path d="M${r(cxB - rx)},${r(cyR)} A${r(rx)},${r(ry)} 0 0 0 ${r(cxB + rx)},${r(cyR)}" fill="none" stroke="${STEEL.line}" stroke-width="1" opacity="0.5"/>`;
  }
  // top disc + steel rim
  s += disc(gx, gy, rg, hg, pal.top, EDGE_D, 1);
  s += disc(gx, gy, rg * 0.62, hg, "none", STEEL.edge, 1.2, 0.7);
  s += disc(gx, gy, rg * 0.28, hg, STEEL.glow, STEEL.edge, 1, 0.85);
  return s;
}

/** rack with horizontal slot detail on the +X (right) face */
function rackDetail(gx, gy, a, b, c, count = 4) {
  let s = "";
  for (let i = 1; i <= count; i++) {
    const z = (c * i) / (count + 1);
    const A = pt(gx + a, gy + 0.18, z), B = pt(gx + a, gy + b - 0.18, z);
    s += `<line x1="${r(A[0])}" y1="${r(A[1])}" x2="${r(B[0])}" y2="${r(B[1])}" stroke="rgba(8,10,14,0.42)" stroke-width="1.4"/>`;
    const A2 = pt(gx + 0.18, gy + b, z), B2 = pt(gx + a - 0.18, gy + b, z);
    s += `<line x1="${r(A2[0])}" y1="${r(A2[1])}" x2="${r(B2[0])}" y2="${r(B2[1])}" stroke="rgba(8,10,14,0.3)" stroke-width="1.2"/>`;
  }
  return s;
}

/** small status node light */
function led(gx, gy, z, color, r0 = 3) {
  const [x, y] = pt(gx, gy, z);
  return `<circle cx="${r(x)}" cy="${r(y)}" r="${r0}" fill="${color}"/>`;
}

/** color shade helper: scale a #rrggbb by factor (1=unchanged), clamped */
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  const R = c((n >> 16) & 255), G = c((n >> 8) & 255), B = c(n & 255);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}
const lighten = (hex, f) => shade(hex, f);

/** Build per-face gradients for a palette so faces read as rendered, not flat.
 *  Returns { defs, top, left, right } where fills are url() refs. */
let GID = 0;
function gradPal(pal) {
  const id = `g${GID++}`;
  const defs =
    `<linearGradient id="${id}t" x1="0" y1="0" x2="0.65" y2="1"><stop offset="0" stop-color="${lighten(pal.top, 1.05)}"/><stop offset="1" stop-color="${shade(pal.top, 0.95)}"/></linearGradient>` +
    `<linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.left}"/><stop offset="1" stop-color="${shade(pal.left, 0.8)}"/></linearGradient>` +
    `<linearGradient id="${id}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.right}"/><stop offset="1" stop-color="${shade(pal.right, 0.74)}"/></linearGradient>`;
  return { defs, top: `url(#${id}t)`, left: `url(#${id}l)`, right: `url(#${id}r)` };
}

/* ----------------------------------------------------------------------- */
/* Scene layout (grid coordinates)                                         */
/* ----------------------------------------------------------------------- */
const S = {
  plane:    { gx: -2, gy: -2, a: 16, b: 15 },
  queue:    { gx: 0.6, gy: 8.4, a: 3.2, b: 3.8, n: 7 },
  scheduler:{ gx: 5.6, gy: 3.8, a: 3.9, b: 3.9, c: 4.3 },
  exec:     { gx: 10.6, gy: -0.4, racks: 3, a: 1.5, b: 2.0, c: 5.6, gap: 2.5 },
  aurelius: { gx: 7.3, gy: 7.0, a: 4.5, b: 3.5, c: 3.1, riser: 0.34 },
  constraint:{ gx: 12.9, gy: 6.2, a: 2.1, b: 2.1, c: 2.5 },
  ledger:   { gx: 5.2, gy: 11.0, rg: 1.5, hg: 2.7 },
};
/** screen center of an object footprint at a given height */
const centerTop = (o, c) => pt(o.gx + o.a / 2, o.gy + o.b / 2, c ?? o.c ?? 0);
const footCenter = (o) => pt(o.gx + (o.a ?? 0) / 2, o.gy + (o.b ?? 0) / 2, 0);

/* ----------------------------------------------------------------------- */
/* SVG document wrapper                                                    */
/* ----------------------------------------------------------------------- */
function doc(defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">\n${defs ? `<defs>${defs}</defs>\n` : ""}${body}\n</svg>\n`;
}
const PLACEHOLDER_NOTE = "<!-- Authored isometric source asset. Swap with a Figma/Spline render of the same layer + canvas (1440x900) to upgrade fidelity with no component change. -->\n";

/* ===================== base_plane (only opaque layer) ==================== */
function basePlane() {
  // full-canvas charcoal backdrop + isometric platform slab with thickness
  const { gx, gy, a, b } = S.plane;
  const thick = 0.55;
  let body = `<rect x="0" y="0" width="${W}" height="${H}" fill="#070a0e"/>`;
  body += `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#vign)"/>`;
  // platform cuboid (top surface = ground z0)
  body += cuboid(gx, gy, a, b, thick, PLANE, -thick, { rim: false });
  // faint top edge of platform
  const T0 = pt(gx, gy, 0), T1 = pt(gx + a, gy, 0), T2 = pt(gx + a, gy + b, 0), T3 = pt(gx, gy + b, 0);
  body += `<polygon points="${P([T0, T1, T2, T3])}" fill="none" stroke="${PLANE.edge}" stroke-width="1.2"/>`;
  const defs = `<radialGradient id="vign" cx="46%" cy="40%" r="75%"><stop offset="0%" stop-color="#0d1016" stop-opacity="0.9"/><stop offset="55%" stop-color="#090c11" stop-opacity="0.4"/><stop offset="100%" stop-color="#04060a" stop-opacity="0.9"/></radialGradient>`;
  return doc(defs, body);
}

/* ===================== background_grid ==================== */
function backgroundGrid() {
  const { gx, gy, a, b } = S.plane;
  let body = "";
  for (let i = 0; i <= a; i++) {
    const A = pt(gx + i, gy, 0), B = pt(gx + i, gy + b, 0);
    body += `<line x1="${r(A[0])}" y1="${r(A[1])}" x2="${r(B[0])}" y2="${r(B[1])}" stroke="${GRID_LINE}" stroke-width="1"/>`;
  }
  for (let j = 0; j <= b; j++) {
    const A = pt(gx, gy + j, 0), B = pt(gx + a, gy + j, 0);
    body += `<line x1="${r(A[0])}" y1="${r(A[1])}" x2="${r(B[0])}" y2="${r(B[1])}" stroke="${GRID_LINE}" stroke-width="1"/>`;
  }
  // fade mask toward edges
  const defs = `<radialGradient id="gfade" cx="48%" cy="44%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity="0.9"/><stop offset="70%" stop-color="#fff" stop-opacity="0.25"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="gmask"><rect x="0" y="0" width="${W}" height="${H}" fill="url(#gfade)"/></mask>`;
  return doc(defs, `<g mask="url(#gmask)">${body}</g>`);
}

/* ===================== customer_environment (secure boundary) =========== */
function customerEnvironment() {
  // dashed rhombus tracing platform perimeter, lifted slightly
  const { gx, gy, a, b } = S.plane;
  const m = 0.4, z = 0.05;
  const pts = [pt(gx + m, gy + m, z), pt(gx + a - m, gy + m, z), pt(gx + a - m, gy + b - m, z), pt(gx + m, gy + b - m, z)];
  let body = `<polygon points="${P(pts)}" fill="none" stroke="${STEEL.line}" stroke-width="1.4" stroke-dasharray="3 7" opacity="0.5"/>`;
  // corner ticks
  pts.forEach(([x, y]) => {
    body += `<circle cx="${r(x)}" cy="${r(y)}" r="2.4" fill="none" stroke="${STEEL.edge}" stroke-width="1.1" opacity="0.6"/>`;
  });
  return doc("", body);
}

/* ===================== workload_queue ==================== */
function workloadQueue() {
  const o = S.queue;
  const [cx, cy] = footCenter(o);
  let body = contactShadow(cx, cy + 6, 78, 30, 0.5, "qs");
  body += cardStack(o.gx, o.gy, o.a, o.b, o.n, PAL.pale);
  return doc(shadowGrad("qs"), body);
}

/* ===================== scheduler ==================== */
function scheduler() {
  const o = S.scheduler;
  const [cx, cy] = footCenter(o);
  const g = gradPal(PAL.silver), gc = gradPal(PAL.silver);
  let body = contactShadow(cx, cy + 10, 96, 38, 0.6, "ss");
  body += cuboid(o.gx, o.gy, o.a, o.b, o.c, g);
  body += rackDetail(o.gx, o.gy, o.a, o.b, o.c, 4);
  // authority crown: a slim lit bar on top
  body += cuboid(o.gx + 0.5, o.gy + 0.5, o.a - 1, o.b - 1, 0.3, gc, o.c);
  body += led(o.gx + 0.95, o.gy + 0.95, o.c + 0.34, STEEL.edge, 3.2);
  body += led(o.gx + 1.6, o.gy + 0.95, o.c + 0.34, "rgba(255,255,255,0.6)", 2.6);
  return doc(shadowGrad("ss") + g.defs + gc.defs, body);
}

/* ===================== execution_layer ==================== */
function executionLayer() {
  const o = S.exec;
  const g = gradPal(PAL.gray);
  let body = "";
  // back-to-front
  for (let i = 0; i < o.racks; i++) {
    const gy = o.gy + i * o.gap;
    const [cx, cy] = pt(o.gx + o.a / 2, gy + o.b / 2, 0);
    body += contactShadow(cx, cy + 8, 42, 18, 0.55, "es");
  }
  for (let i = 0; i < o.racks; i++) {
    const gy = o.gy + i * o.gap;
    body += cuboid(o.gx, gy, o.a, o.b, o.c, g);
    body += rackDetail(o.gx, gy, o.a, o.b, o.c, 6);
    body += led(o.gx + o.a / 2, gy + 0.4, o.c + 0.12, "rgba(140,170,210,0.6)", 2.2);
  }
  return doc(shadowGrad("es") + g.defs, body);
}

/* ===================== aurelius_control_plane (sidecar) ================== */
function aureliusControlPlane() {
  const o = S.aurelius;
  const [cx, cy] = footCenter(o);
  const g = gradPal(PAL.body), gs = gradPal(PAL.steel);
  const riser = o.riser || 0;
  let body = contactShadow(cx, cy + 12, 104, 40, 0.66, "as");
  // soft steel halo (restrained, not neon)
  body += `<ellipse cx="${r(cx)}" cy="${r(cy - 40)}" rx="150" ry="78" fill="url(#halo)" opacity="0.55"/>`;
  // riser plinth — marks it as a deliberate control plane, slightly lifted
  if (riser) body += cuboid(o.gx - 0.3, o.gy - 0.3, o.a + 0.6, o.b + 0.6, riser, gradPal(PAL.gray), 0, { rim: false });
  body += cuboid(o.gx, o.gy, o.a, o.b, o.c, g, riser);
  // steel accent panel on top — a lit control surface, framed by the white body
  const topZ = riser + o.c;
  body += cuboid(o.gx + 0.55, o.gy + 0.55, o.a - 1.1, o.b - 1.1, 0.34, gs, topZ);
  // top face glow + bright rim
  const tp = (gx, gy) => pt(gx, gy, topZ + 0.34);
  const tA = tp(o.gx + 0.55, o.gy + 0.55), tB = tp(o.gx + o.a - 0.55, o.gy + 0.55), tC = tp(o.gx + o.a - 0.55, o.gy + o.b - 0.55), tD = tp(o.gx + 0.55, o.gy + o.b - 0.55);
  body += `<polygon points="${P([tA, tB, tC, tD])}" fill="url(#auglow)"/>`;
  body += `<polygon points="${P([tA, tB, tC, tD])}" fill="none" stroke="#7d92b8" stroke-width="1.1" opacity="0.85"/>`;
  // emblem: minimal keystone mark in lit steel on the top accent
  const [ex, ey] = pt(o.gx + o.a / 2, o.gy + o.b / 2, topZ + 0.34);
  body += `<g opacity="0.98"><polygon points="${P([[ex, ey - 14], [ex + 12, ey - 1], [ex + 6.5, ey - 1], [ex, ey - 8.5], [ex - 6.5, ey - 1], [ex - 12, ey - 1]])}" fill="#aebbd2"/><polygon points="${P([[ex, ey - 1], [ex + 6.5, ey + 6], [ex - 6.5, ey + 6]])}" fill="#d7dfec"/></g>`;
  // front-face seam detailing
  body += rackDetail(o.gx, o.gy, o.a, o.b, o.c + riser, 2);
  return doc(shadowGrad("as") + g.defs + gs.defs +
    `<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${STEEL.glow}" stop-opacity="0.6"/><stop offset="100%" stop-color="${STEEL.glow}" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="auglow" cx="50%" cy="38%" r="62%"><stop offset="0%" stop-color="#9fb2d4" stop-opacity="0.5"/><stop offset="100%" stop-color="#9fb2d4" stop-opacity="0"/></radialGradient>`, body);
}

/* ===================== constraint_engine ==================== */
function constraintEngine() {
  const o = S.constraint;
  const [cx, cy] = footCenter(o);
  const g = gradPal(PAL.body);
  let body = contactShadow(cx, cy + 8, 56, 24, 0.55, "cs");
  body += cuboid(o.gx, o.gy, o.a, o.b, o.c, g);
  // four vertical constraint "gates" on the +X face (SLA / capacity / residency / power)
  const gates = 4;
  for (let i = 0; i < gates; i++) {
    const gyi = o.gy + 0.3 + (i * (o.b - 0.6)) / (gates - 1);
    const A = pt(o.gx + o.a, gyi, o.c * 0.85), B = pt(o.gx + o.a, gyi, o.c * 0.15);
    const col = i === gates - 1 ? RED.line : STEEL.edge;
    body += `<line x1="${r(A[0])}" y1="${r(A[1])}" x2="${r(B[0])}" y2="${r(B[1])}" stroke="${col}" stroke-width="2" opacity="0.85"/>`;
  }
  // steel top indicator
  body += disc(o.gx + o.a / 2, o.gy + o.b / 2, 0.5, o.c, STEEL.glow, STEEL.edge, 1.2, 0.9);
  return doc(shadowGrad("cs") + g.defs, body);
}

/* ===================== audit_ledger ==================== */
function auditLedger() {
  const o = S.ledger;
  const [cx, cy] = pt(o.gx, o.gy, 0);
  let body = contactShadow(cx, cy + 6, 64, 26, 0.5, "ls");
  body += cylinder(o.gx, o.gy, o.rg, o.hg, PAL.ledger, { rings: 4 });
  return doc(shadowGrad("ls"), body);
}

/* ===================== metadata_bridge ==================== */
// shared bridge geometry (used by bridge layer, packet path, and meta)
const BR_A = pt(S.scheduler.gx + S.scheduler.a - 0.4, S.scheduler.gy + S.scheduler.b / 2, S.scheduler.c * 0.5);
const BR_B = pt(S.aurelius.gx + S.aurelius.a / 2 + 0.4, S.aurelius.gy + 0.4, (S.aurelius.riser || 0) + S.aurelius.c + 0.34);
const BR_MID = [(BR_A[0] + BR_B[0]) / 2 + 6, Math.min(BR_A[1], BR_B[1]) - 52];
const BR_D = `M${r(BR_A[0])},${r(BR_A[1])} Q${r(BR_MID[0])},${r(BR_MID[1])} ${r(BR_B[0])},${r(BR_B[1])}`;

function metadataBridge() {
  // elevated steel conduit arcing from scheduler over to the Aurelius control surface
  let body = `<path d="${BR_D}" fill="none" stroke="${STEEL.glow}" stroke-width="13" opacity="0.22" stroke-linecap="round"/>`;
  body += `<path d="${BR_D}" fill="none" stroke="${STEEL.line}" stroke-width="3" stroke-linecap="round"/>`;
  body += `<path d="${BR_D}" fill="none" stroke="#a8b8d2" stroke-width="1.1" stroke-dasharray="1.5 6" stroke-linecap="round" opacity="0.95"/>`;
  // node endpoints + small collars
  for (const e of [BR_A, BR_B]) {
    body += `<circle cx="${r(e[0])}" cy="${r(e[1])}" r="4.2" fill="${STEEL.glow}" stroke="${STEEL.edge}" stroke-width="1.2"/>`;
    body += `<circle cx="${r(e[0])}" cy="${r(e[1])}" r="1.6" fill="#cdd7e6"/>`;
  }
  return doc("", body);
}

/* ===================== active_paths (execution flow + advisory return) === */
function activePaths() {
  const railTo = (A, B, color, w = 2, dash = null, op = 1) =>
    `<line x1="${r(A[0])}" y1="${r(A[1])}" x2="${r(B[0])}" y2="${r(B[1])}" stroke="${color}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} opacity="${op}" stroke-linecap="round"/>`;
  const chevron = (B, dir, color) => {
    const [x, y] = B; const s = 6;
    const sign = dir;
    return `<polyline points="${r(x - s * sign)},${r(y - s * 0.6)} ${r(x)},${r(y)} ${r(x - s * sign)},${r(y + s * 0.6)}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const qC = pt(S.queue.gx + S.queue.a, S.queue.gy + S.queue.b / 2, 0.9);
  const sIn = pt(S.scheduler.gx, S.scheduler.gy + S.scheduler.b / 2, 0.9);
  const sOut = pt(S.scheduler.gx + S.scheduler.a, S.scheduler.gy + S.scheduler.b / 2, 1.2);
  const eIn = pt(S.exec.gx, S.exec.gy + (S.exec.racks * S.exec.gap) / 2, 1.2);
  const WHITE = "rgba(232,236,240,0.62)";
  let body = "";
  body += railTo(qC, sIn, WHITE, 2);
  body += chevron(sIn, 1, WHITE);
  body += railTo(sOut, eIn, WHITE, 2);
  body += chevron(eIn, 1, WHITE);
  // advisory decision returns: aurelius -> scheduler (steel, dashed)
  const aTop = pt(S.aurelius.gx + S.aurelius.a / 2 - 0.6, S.aurelius.gy + 0.3, S.aurelius.c + 0.4);
  const sBot = pt(S.scheduler.gx + S.scheduler.a / 2 - 0.6, S.scheduler.gy + S.scheduler.b - 0.3, S.scheduler.c * 0.4);
  body += railTo(aTop, sBot, STEEL.line, 1.8, "1 5", 0.9);
  body += chevron(sBot, 1, STEEL.edge);
  return doc("", body);
}

/* ===================== blocked_payload ==================== */
// shared blocked-payload geometry (payloads/prompts/outputs/data/code → blocked)
const BP_FROM = pt(S.exec.gx + 0.2, S.exec.gy + S.exec.racks * S.exec.gap * 0.5, 1.8);
const BP_GATE = pt(S.aurelius.gx + S.aurelius.a, S.aurelius.gy + S.aurelius.b / 2, (S.aurelius.riser || 0) + S.aurelius.c * 0.55);
const BP_BAR = [BP_GATE[0] + 38, BP_GATE[1] + 18];
const BP_MID = [(BP_FROM[0] + BP_BAR[0]) / 2 + 6, (BP_FROM[1] + BP_BAR[1]) / 2 - 18];
const BP_D = `M${r(BP_FROM[0])},${r(BP_FROM[1])} Q${r(BP_MID[0])},${r(BP_MID[1])} ${r(BP_BAR[0])},${r(BP_BAR[1])}`;

function blockedPayload() {
  const [bx, by] = BP_BAR;
  let body = `<path d="${BP_D}" fill="none" stroke="${RED.glow}" stroke-width="11" opacity="0.55" stroke-linecap="round"/>`;
  body += `<path d="${BP_D}" fill="none" stroke="${RED.line}" stroke-width="2.6" stroke-dasharray="7 5" stroke-linecap="round"/>`;
  // payload origin tick
  body += `<circle cx="${r(BP_FROM[0])}" cy="${r(BP_FROM[1])}" r="2.6" fill="${RED.core}" opacity="0.8"/>`;
  // barrier wall (a small iso shield plane) at the boundary
  body += `<polygon points="${P([[bx - 5, by - 26], [bx + 14, by - 16], [bx + 14, by + 14], [bx - 5, by + 5]])}" fill="rgba(155,63,61,0.18)" stroke="${RED.line}" stroke-width="1.5"/>`;
  // blocked X token
  body += `<circle cx="${r(bx)}" cy="${r(by)}" r="12.5" fill="rgba(10,11,14,0.92)" stroke="${RED.core}" stroke-width="1.8"/>`;
  const k = 5.2;
  body += `<path d="M${r(bx - k)},${r(by - k)} L${r(bx + k)},${r(by + k)} M${r(bx + k)},${r(by - k)} L${r(bx - k)},${r(by + k)}" stroke="${RED.core}" stroke-width="2" stroke-linecap="round"/>`;
  return doc("", body);
}

/* ===================== metadata_packet ==================== */
function metadataPacket() {
  // a small steel chip; positioned at origin then translated by the component
  const s = 7;
  const top = [[0, -s * 0.5], [s, 0], [0, s * 0.5], [-s, 0]];
  const left = [[-s, 0], [0, s * 0.5], [0, s * 0.5 + s], [-s, s]];
  const right = [[s, 0], [0, s * 0.5], [0, s * 0.5 + s], [s, s]];
  let body = `<g transform="translate(${W / 2},${H / 2})">`;
  body += `<ellipse cx="0" cy="0" rx="22" ry="22" fill="url(#pglow)" opacity="0.8"/>`;
  body += `<polygon points="${P(left)}" fill="${STEEL.left}" stroke="${STEEL.edge}" stroke-width="0.8"/>`;
  body += `<polygon points="${P(right)}" fill="${STEEL.right}" stroke="${STEEL.edge}" stroke-width="0.8"/>`;
  body += `<polygon points="${P(top)}" fill="${STEEL.edge}" stroke="#9fb0cb" stroke-width="0.8"/>`;
  body += `</g>`;
  const defs = `<radialGradient id="pglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#7f93b6" stop-opacity="0.7"/><stop offset="100%" stop-color="#7f93b6" stop-opacity="0"/></radialGradient>`;
  return doc(defs, body);
}
// expose steel sub-tones for packet
STEEL.left = "#3c4a63"; STEEL.right = "#2c374a";

/* ----------------------------------------------------------------------- */
/* Label + annotation anchors (screen coords)                              */
/* ----------------------------------------------------------------------- */
const labels = [
  { id: "workload_queue", text: "WORKLOAD QUEUE", at: footCenter(S.queue), dy: 64, anchor: "middle", sub: "job metadata · timing" },
  { id: "scheduler", text: "EXISTING SCHEDULER", at: centerTop(S.scheduler, S.scheduler.c), dy: -22, anchor: "middle", sub: "availability · fairness", authority: true },
  { id: "execution", text: "EXECUTION LAYER", at: pt(S.exec.gx + S.exec.a / 2, S.exec.gy + (S.exec.racks * S.exec.gap) / 2, S.exec.c), dy: -20, anchor: "middle", sub: "execution unchanged" },
  { id: "aurelius", text: "AURELIUS CONTROL PLANE", at: centerTop(S.aurelius, S.aurelius.c), dy: 70, anchor: "middle", primary: true, sub: "forecast · rank · filter · log" },
  { id: "constraint", text: "CONSTRAINT ENGINE", at: footCenter(S.constraint), dy: 60, anchor: "middle" },
  { id: "ledger", text: "APPEND-ONLY AUDIT LEDGER", at: pt(S.ledger.gx, S.ledger.gy, 0), dy: 58, anchor: "middle" },
];

const meta = {
  viewBox: [W, H],
  labels,
  metaOnlyTag: { at: BR_MID, text: "METADATA ONLY" },
  payloadTag: { at: [BP_BAR[0] + 18, BP_BAR[1]], text: "PAYLOAD BLOCKED" },
  envTag: { at: pt(S.plane.gx + 0.8, S.plane.gy + S.plane.b - 0.8, 0), text: "YOUR SECURE ENVIRONMENT" },
  notes: ["SCHEDULER REMAINS AUTHORITY", "EXECUTION UNCHANGED"],
  packet: { from: BR_A, mid: BR_MID, to: BR_B },
  blocked: { from: BP_FROM, mid: BP_MID, to: BP_BAR },
  shadowBadge: { at: pt(S.aurelius.gx + S.aurelius.a / 2, S.aurelius.gy + S.aurelius.b / 2, (S.aurelius.riser || 0) + S.aurelius.c + 2.0) },
};

/* ----------------------------------------------------------------------- */
/* labels.svg + annotations.svg (asset-complete; live labels are HTML)     */
/* ----------------------------------------------------------------------- */
function chip(x, y, text, anchor, { accent } = {}) {
  const padX = 9, fs = 13, w = text.length * fs * 0.62 + padX * 2, h = 22;
  const tx = anchor === "middle" ? x : anchor === "end" ? x - w + padX : x + padX;
  const rx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  const fill = accent === "steel" ? STEEL.text : accent === "red" ? RED.core : "#e6e8ea";
  return `<g><rect x="${r(rx)}" y="${r(y - h / 2)}" width="${r(w)}" height="${h}" rx="3" fill="rgba(8,10,13,0.72)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/><text x="${r(anchor === "middle" ? x : tx)}" y="${r(y + 4)}" text-anchor="${anchor}" font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="${fs}" letter-spacing="1.2" fill="${fill}">${text}</text></g>`;
}
function labelsSvg() {
  let body = "";
  for (const l of labels) body += chip(l.at[0], l.at[1] + l.dy, l.text, l.anchor, { accent: l.primary ? "steel" : null });
  return doc("", body);
}
function annotationsSvg() {
  let body = "";
  body += chip(meta.metaOnlyTag.at[0], meta.metaOnlyTag.at[1], meta.metaOnlyTag.text, "middle", { accent: "steel" });
  body += chip(meta.payloadTag.at[0], meta.payloadTag.at[1], meta.payloadTag.text, "start", { accent: "red" });
  body += chip(meta.envTag.at[0], meta.envTag.at[1], meta.envTag.text, "start", {});
  return doc("", body);
}

/* ----------------------------------------------------------------------- */
/* write all layers                                                        */
/* ----------------------------------------------------------------------- */
const layers = {
  base_plane: basePlane(),
  background_grid: backgroundGrid(),
  customer_environment: customerEnvironment(),
  workload_queue: workloadQueue(),
  scheduler: scheduler(),
  execution_layer: executionLayer(),
  aurelius_control_plane: aureliusControlPlane(),
  constraint_engine: constraintEngine(),
  audit_ledger: auditLedger(),
  metadata_bridge: metadataBridge(),
  active_paths: activePaths(),
  blocked_payload: blockedPayload(),
  metadata_packet: metadataPacket(),
  labels: labelsSvg(),
  annotations: annotationsSvg(),
};
for (const [name, svg] of Object.entries(layers)) {
  writeFileSync(resolve(OUT, `${name}.svg`), name === "base_plane" ? svg : PLACEHOLDER_NOTE + svg);
}
writeFileSync(resolve(META_DIR, "meta.json"), JSON.stringify(meta, null, 2));
console.log(`Wrote ${Object.keys(layers).length} layers to ${OUT}`);
console.log(`Wrote meta.json to ${META_DIR}`);
