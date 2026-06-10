/**
 * Aurelius Control Plane — flagship isometric diagram generator (v2: glass + story).
 *
 * Two clear planes tell the architecture in 3 seconds:
 *   - SECURE ENVIRONMENT floor (back): workload queue -> scheduler -> execution.
 *   - AURELIUS CONTROL PLANE floor (front, elevated): the sidecar core, the
 *     constraint gate, and the append-only audit ledger.
 * A thin steel metadata bridge is the ONLY thing crossing between them; the
 * payload path is blocked at the boundary; an advisory recommendation returns.
 *
 * Objects are authored as translucent / frosted glass (semi-transparent faces,
 * bright glass rims, soft frost halos, a glowing steel core) — the closest a
 * vector pipeline gets to Applied-Compute rendered material. Each layer is an
 * opaque asset on a shared 1440x900 canvas, so a Spline/Figma render can replace
 * any single file with no React change.
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

/* ---- canvas + 2:1 isometric projection ---- */
const W = 1440, H = 900, TILE = 44, ZU = 24, OX = 566, OY = 188;
const r = (n) => Math.round(n * 10) / 10;
const pt = (gx, gy, gz = 0) => [OX + (gx - gy) * TILE, OY + (gx + gy) * (TILE / 2) - gz * ZU];
const P = (pts) => pts.map(([x, y]) => `${r(x)},${r(y)}`).join(" ");
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/* ---- glass palette (translucent over charcoal) ---- */
const GLASS = "226,232,242";        // cool off-white glass tint (rgb)
const GLASS_DIM = "150,160,176";     // dimmed/inactive glass
const STEEL_RGB = "74,96,140";       // deep muted steel-blue
const STEEL = { line: "#56688f", edge: "#7488ad", bright: "#9fb1d0", core: "#41557a" };
const RED = { core: "#b5524f", line: "rgba(170,72,69,0.85)", glow: "rgba(170,72,69,0.34)" };
const GRID = "rgba(150,170,200,0.06)";

/* shared defs reused by every layer (frost blur, glows, gradients) */
const DEFS = `
<filter id="frost" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16"/></filter>
<radialGradient id="shadow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#000" stop-opacity="0.5"/><stop offset="70%" stop-color="#000" stop-opacity="0.18"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="steelcore" cx="50%" cy="42%" r="60%"><stop offset="0%" stop-color="#6f8bbd" stop-opacity="0.95"/><stop offset="45%" stop-color="#41557a" stop-opacity="0.8"/><stop offset="100%" stop-color="#2a3550" stop-opacity="0.2"/></radialGradient>
<radialGradient id="steelhalo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#4a6090" stop-opacity="0.5"/><stop offset="100%" stop-color="#4a6090" stop-opacity="0"/></radialGradient>
<linearGradient id="gtop" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="rgba(255,255,255,0.34)"/><stop offset="1" stop-color="rgba(255,255,255,0.08)"/></linearGradient>`;

function doc(body, extraDefs = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none"><defs>${DEFS}${extraDefs}</defs>${body}</svg>\n`;
}
function polygon(points, fill, stroke, sw = 1) {
  return `<polygon points="${P(points)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ""} stroke-linejoin="round"/>`;
}
function shadow(cx, cy, rx, ry, op = 0.5) { return `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="url(#shadow)" opacity="${op}"/>`; }

/* ---- translucent glass cuboid ---- */
function glass(gx, gy, a, b, c, o = {}) {
  const tint = o.tint || GLASS, al = o.al == null ? 1 : o.al, gz = o.gz || 0;
  const ta = (o.topA ?? 0.45) * al, la = (o.leftA ?? 0.27) * al, ra = (o.rightA ?? 0.18) * al, rim = (o.rim ?? 0.72) * al;
  const T0 = pt(gx, gy, gz + c), T1 = pt(gx + a, gy, gz + c), T2 = pt(gx + a, gy + b, gz + c), T3 = pt(gx, gy + b, gz + c);
  const Lb0 = pt(gx, gy + b, gz), Lb1 = pt(gx + a, gy + b, gz), Rb0 = pt(gx + a, gy, gz), Rb1 = pt(gx + a, gy + b, gz);
  let s = "";
  s += polygon([T3, T2, Lb1, Lb0], `rgba(${tint},${la})`, `rgba(255,255,255,${0.10 * al})`, 1);
  s += polygon([T1, T2, Rb1, Rb0], `rgba(${tint},${ra})`, `rgba(255,255,255,${0.07 * al})`, 1);
  s += polygon([T0, T1, T2, T3], `rgba(${tint},${ta})`, `rgba(255,255,255,${0.13 * al})`, 1);
  s += `<polyline points="${P([T3, T0, T1])}" fill="none" stroke="rgba(255,255,255,${rim})" stroke-width="1.2"/>`;
  s += `<line x1="${r(T2[0])}" y1="${r(T2[1])}" x2="${r(Rb1[0])}" y2="${r(Rb1[1])}" stroke="rgba(255,255,255,${0.18 * al})" stroke-width="1"/>`;
  return s;
}
/* thin glass plate / floor slab */
function slab(gx, gy, a, b, o = {}) {
  return glass(gx, gy, a, b, o.c ?? 0.28, { topA: o.topA ?? 0.07, leftA: 0.05, rightA: 0.035, rim: o.rim ?? 0.18, tint: o.tint || GLASS, al: o.al ?? 1, gz: o.gz || 0 });
}
function discTop(gx, gy, rg, z, fill, stroke, sw = 1) {
  const [cx, cy] = pt(gx, gy, z); const rx = rg * TILE * 1.414, ry = rx / 2;
  return `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ""}/>`;
}

/* ---- scene layout: two horizontal bands stacked in depth, shared x-center.
   place(diff, sum, ...) sets screen position directly: diff = horizontal
   (gx-gy), sum = depth (gx+gy). Back band = secure env, front band = Aurelius. */
const place = (diff, sum, a, b, ex = {}) => { const gx = (sum + diff) / 2, gy = (sum - diff) / 2; return { gx: gx - a / 2, gy: gy - b / 2, a, b, ...ex }; };
const BACK = 6.6, FRONT = 15.6;
const S = {
  queue: place(-6.4, BACK, 2.7, 3.0, { n: 6 }),
  scheduler: place(-0.2, BACK, 3.4, 3.4, { c: 4.4 }),
  exec: { ...place(6.0, BACK + 0.4, 1.35, 1.7), racks: 3, gap: 1.55, c: 4.7 },
  aurelius: place(0, FRONT, 4.7, 3.7, { c: 3.4, riser: 0.6 }),
  ledger: place(-6.2, FRONT, 2.4, 2.3, { plates: 7 }),
  constraint: place(5.8, FRONT, 2.2, 2.3, { c: 2.7 }),
};
// center the 3-rack execution cluster on its placement point
S.exec.gy -= ((S.exec.racks - 1) * S.exec.gap) / 2;
const sc = (o, z = 0) => pt(o.gx + o.a / 2, o.gy + o.b / 2, z);
const execSpan = () => ({ gx: S.exec.gx, gy: S.exec.gy, a: S.exec.a, b: S.exec.b + (S.exec.racks - 1) * S.exec.gap });
function bbox(objs, m) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const o of objs) { x0 = Math.min(x0, o.gx); y0 = Math.min(y0, o.gy); x1 = Math.max(x1, o.gx + o.a); y1 = Math.max(y1, o.gy + o.b); }
  return { gx: x0 - m, gy: y0 - m, a: x1 - x0 + 2 * m, b: y1 - y0 + 2 * m };
}
const ENV = bbox([S.queue, S.scheduler, execSpan()], 0.6);
const SIDE = bbox([S.ledger, S.aurelius, S.constraint], 0.6);
const SIDE_GZ = 0.0;

/* dashed iso boundary around a floor */
function boundary(f, gz, color, label) {
  const m = 0.25;
  const pts = [pt(f.gx + m, f.gy + m, gz), pt(f.gx + f.a - m, f.gy + m, gz), pt(f.gx + f.a - m, f.gy + f.b - m, gz), pt(f.gx + m, f.gy + f.b - m, gz)];
  let s = `<polygon points="${P(pts)}" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 7" opacity="0.8"/>`;
  pts.forEach((p) => { s += `<circle cx="${r(p[0])}" cy="${r(p[1])}" r="2.4" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.85"/>`; });
  return s;
}

/* =================== layers =================== */
function basePlane() {
  let b = `<rect x="0" y="0" width="${W}" height="${H}" fill="#06080b"/>`;
  // faint diagonal pinstripe texture (Applied-Compute-style)
  b += `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#stripe)"/>`;
  b += `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#vign)"/>`;
  const extra = `<pattern id="stripe" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,255,255,0.012)" stroke-width="2"/></pattern><radialGradient id="vign" cx="44%" cy="40%" r="78%"><stop offset="0%" stop-color="#0c0f15" stop-opacity="0.85"/><stop offset="55%" stop-color="#080b10" stop-opacity="0.35"/><stop offset="100%" stop-color="#04060a" stop-opacity="0.92"/></radialGradient>`;
  return doc(b, extra);
}
function backgroundGrid() {
  let b = "";
  for (const f of [ENV, SIDE]) {
    const gz = f === SIDE ? SIDE_GZ : 0;
    for (let i = 0; i <= Math.round(f.a); i++) { const A = pt(f.gx + i, f.gy, gz), B = pt(f.gx + i, f.gy + f.b, gz); b += `<line x1="${r(A[0])}" y1="${r(A[1])}" x2="${r(B[0])}" y2="${r(B[1])}" stroke="${GRID}" stroke-width="1"/>`; }
    for (let j = 0; j <= Math.round(f.b); j++) { const A = pt(f.gx, f.gy + j, gz), B = pt(f.gx + f.a, f.gy + j, gz); b += `<line x1="${r(A[0])}" y1="${r(A[1])}" x2="${r(B[0])}" y2="${r(B[1])}" stroke="${GRID}" stroke-width="1"/>`; }
  }
  const extra = `<radialGradient id="gf" cx="48%" cy="46%" r="62%"><stop offset="0%" stop-color="#fff" stop-opacity="0.85"/><stop offset="72%" stop-color="#fff" stop-opacity="0.18"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="gm"><rect width="${W}" height="${H}" fill="url(#gf)"/></mask>`;
  return doc(`<g mask="url(#gm)">${b}</g>`, extra);
}
function customerEnvironment() {
  // back floor slab + dashed secure boundary
  let b = slab(ENV.gx, ENV.gy, ENV.a, ENV.b, { topA: 0.085, rim: 0.22 });
  b += boundary(ENV, 0.3, "rgba(168,186,212,0.6)");
  return doc(b);
}
function sidecarBoundary() {
  // front floor on a thin elevated plinth + dashed Aurelius boundary (steel)
  let b = shadow(...sc(S.aurelius, 0).map((v, i) => i === 1 ? v + 40 : v).slice(0, 2), 250, 70, 0.5);
  // plinth
  b += glass(SIDE.gx, SIDE.gy, SIDE.a, SIDE.b, 0.55, { topA: 0.05, leftA: 0.04, rightA: 0.03, rim: 0.1 });
  // floor top
  b += slab(SIDE.gx, SIDE.gy, SIDE.a, SIDE.b, { gz: 0.55, topA: 0.1, rim: 0.26 });
  b += boundary({ gx: SIDE.gx, gy: SIDE.gy, a: SIDE.a, b: SIDE.b }, 0.55 + 0.3, "rgba(126,148,185,0.66)");
  return doc(b);
}
function frostHalo(cx, cy, rx, ry, fill = "rgba(224,232,246,0.22)") { return `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="${fill}" filter="url(#frost)"/>`; }

function workloadQueue() {
  const o = S.queue; const [cx, cy] = sc(o);
  let b = shadow(cx, cy + 6, 72, 28, 0.45);
  b += frostHalo(cx, cy - 6, 78, 42);
  // stacked translucent job cards
  const h = 0.34, gap = 0.62;
  for (let i = 0; i < o.n; i++) b += glass(o.gx, o.gy, o.a, o.b, h, { gz: i * gap, topA: 0.16 + i * 0.02, leftA: 0.1, rightA: 0.07, rim: 0.4 });
  // a couple of steel accent cards (active jobs)
  b += glass(o.gx + 0.15, o.gy + 0.15, o.a - 0.3, o.b - 0.3, h, { gz: (o.n - 1) * gap + 0.05, tint: STEEL_RGB, topA: 0.5, leftA: 0.32, rightA: 0.22, rim: 0.5 });
  return doc(b);
}
function scheduler() {
  const o = S.scheduler; const [cx, cy] = sc(o);
  let b = shadow(cx, cy + 8, 92, 36, 0.5);
  b += frostHalo(cx, cy - 18, 96, 60);
  b += glass(o.gx, o.gy, o.a, o.b, o.c, { topA: 0.32, leftA: 0.18, rightA: 0.11, rim: 0.6 });
  // internal routing slats on the +X face (authority detail)
  for (let i = 1; i <= 4; i++) { const z = o.c * i / 5; const A = pt(o.gx + o.a, o.gy + 0.2, z), B = pt(o.gx + o.a, o.gy + o.b - 0.2, z); b += `<line x1="${r(A[0])}" y1="${r(A[1])}" x2="${r(B[0])}" y2="${r(B[1])}" stroke="rgba(255,255,255,0.14)" stroke-width="1.2"/>`; }
  // routing core on top (steel) — it directs the flow
  b += glass(o.gx + 0.7, o.gy + 0.7, o.a - 1.4, o.b - 1.4, 0.5, { gz: o.c, tint: STEEL_RGB, topA: 0.5, leftA: 0.34, rightA: 0.24, rim: 0.55 });
  b += discTop(o.gx + o.a / 2, o.gy + o.b / 2, 0.34, o.c + 0.5, "rgba(159,177,208,0.9)", null);
  return doc(b);
}
function executionLayer() {
  // downstream compute — dimmer (inactive but visible)
  const o = S.exec; let b = "";
  for (let i = 0; i < o.racks; i++) { const gy = o.gy + i * o.gap; const [cx, cy] = pt(o.gx + o.a / 2, gy + o.b / 2, 0); b += shadow(cx, cy + 6, 40, 16, 0.4); }
  for (let i = 0; i < o.racks; i++) {
    const gy = o.gy + i * o.gap;
    b += glass(o.gx, gy, o.a, o.b, o.c, { tint: GLASS_DIM, al: 0.7, topA: 0.34, leftA: 0.2, rightA: 0.13, rim: 0.5 });
    for (let k = 1; k <= 5; k++) { const z = o.c * k / 6; const A = pt(o.gx + o.a, gy + 0.18, z), B = pt(o.gx + o.a, gy + o.b - 0.18, z); b += `<line x1="${r(A[0])}" y1="${r(A[1])}" x2="${r(B[0])}" y2="${r(B[1])}" stroke="rgba(180,195,215,0.16)" stroke-width="1"/>`; }
  }
  return doc(b);
}
function aureliusControlPlane() {
  // dominant elevated glass module with a glowing steel core seen through frosted walls
  const o = S.aurelius; const gz = SIDE_GZ + 0.55; const [cx, cy] = sc(o, gz);
  let b = shadow(cx, cy + 14, 118, 44, 0.6);
  b += `<ellipse cx="${r(cx)}" cy="${r(cy - 34)}" rx="200" ry="108" fill="url(#steelhalo)" opacity="0.8"/>`;
  // riser plinth
  b += glass(o.gx - 0.25, o.gy - 0.25, o.a + 0.5, o.b + 0.5, o.riser, { gz, topA: 0.1, leftA: 0.07, rightA: 0.05, rim: 0.3 });
  const bz = gz + o.riser;
  // glowing steel core (drawn first, shows through frosted top)
  b += `<ellipse cx="${r(sc(o, bz + o.c)[0])}" cy="${r(sc(o, bz + o.c)[1])}" rx="86" ry="46" fill="url(#steelcore)"/>`;
  // frosted glass shell (low-alpha so the core glows through)
  b += glass(o.gx, o.gy, o.a, o.b, o.c, { gz: bz, topA: 0.2, leftA: 0.13, rightA: 0.09, rim: 0.62 });
  // embedded steel control surface on top
  b += glass(o.gx + 0.6, o.gy + 0.6, o.a - 1.2, o.b - 1.2, 0.36, { gz: bz + o.c, tint: STEEL_RGB, topA: 0.62, leftA: 0.42, rightA: 0.3, rim: 0.6 });
  // keystone emblem
  const [ex, ey] = sc(o, bz + o.c + 0.36);
  b += `<g opacity="0.98"><polygon points="${P([[ex, ey - 15], [ex + 13, ey - 1], [ex + 7, ey - 1], [ex, ey - 9], [ex - 7, ey - 1], [ex - 13, ey - 1]])}" fill="#cdd8ec"/><polygon points="${P([[ex, ey - 1], [ex + 7, ey + 6.5], [ex - 7, ey + 6.5]])}" fill="#eaf0fa"/></g>`;
  return doc(b);
}
function constraintEngine() {
  // a filter GATE: an open frame with vertical filter slats, one rejected (red)
  const o = S.constraint; const gz = SIDE_GZ + 0.55; const [cx, cy] = sc(o, gz);
  let b = shadow(cx, cy + 8, 56, 24, 0.45);
  b += frostHalo(cx, cy - 8, 56, 34);
  // two glass side posts
  b += glass(o.gx, o.gy, 0.5, o.b, o.c, { gz, topA: 0.3, leftA: 0.18, rightA: 0.12, rim: 0.55 });
  b += glass(o.gx + o.a - 0.5, o.gy, 0.5, o.b, o.c, { gz, topA: 0.3, leftA: 0.18, rightA: 0.12, rim: 0.55 });
  // top lintel
  b += glass(o.gx, o.gy, o.a, 0.5, o.c * 0.32, { gz: gz + o.c * 0.78, topA: 0.32, leftA: 0.2, rightA: 0.13, rim: 0.55 });
  // vertical filter slats inside the gate (last one red = rejected)
  const n = 5;
  for (let i = 0; i < n; i++) {
    const gyi = o.gy + 0.5 + i * (o.b - 1) / (n - 1);
    const top = pt(o.gx + o.a / 2, gyi, gz + o.c * 0.74), bot = pt(o.gx + o.a / 2, gyi, gz + 0.1);
    const col = i === n - 1 ? RED.line : "rgba(120,140,175,0.7)";
    b += `<line x1="${r(top[0])}" y1="${r(top[1])}" x2="${r(bot[0])}" y2="${r(bot[1])}" stroke="${col}" stroke-width="2" opacity="0.85"/>`;
  }
  return doc(b);
}
function auditLedger() {
  // append-only stacked translucent log plates (evidence)
  const o = S.ledger; const gz = SIDE_GZ + 0.55; const [cx, cy] = sc(o, gz);
  let b = shadow(cx, cy + 7, 60, 25, 0.45);
  b += frostHalo(cx, cy - 4, 58, 36);
  const h = 0.22, gap = 0.42;
  for (let i = 0; i < o.plates; i++) {
    const lit = i >= o.plates - 2; // newest entries lit steel
    b += glass(o.gx, o.gy, o.a, o.b, h, { gz: gz + i * gap, tint: lit ? STEEL_RGB : GLASS, topA: lit ? 0.46 : 0.18, leftA: lit ? 0.3 : 0.11, rightA: lit ? 0.2 : 0.07, rim: 0.45 });
  }
  return doc(b);
}

/* ---- flow paths (geometry shared with meta.json) ---- */
const SCHED_OUT = pt(S.scheduler.gx + S.scheduler.a / 2, S.scheduler.gy + S.scheduler.b - 0.2, S.scheduler.c * 0.5);
const AUR_TOP = pt(S.aurelius.gx + S.aurelius.a / 2, S.aurelius.gy + 0.3, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c + 0.36);
const AUR_BACK = pt(S.aurelius.gx + S.aurelius.a / 2 + 1.0, S.aurelius.gy + 0.2, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c * 0.5);
const BR_MID = [mid(SCHED_OUT, AUR_TOP)[0] - 8, Math.min(SCHED_OUT[1], AUR_TOP[1]) - 30];
const BR_D = `M${r(SCHED_OUT[0])},${r(SCHED_OUT[1])} Q${r(BR_MID[0])},${r(BR_MID[1])} ${r(AUR_TOP[0])},${r(AUR_TOP[1])}`;

const EXEC_OUT = pt(S.exec.gx, S.exec.gy + (S.exec.racks * S.exec.gap) / 2, S.exec.c * 0.45);
const BAR = pt(S.aurelius.gx + S.aurelius.a + 0.1, S.aurelius.gy + 0.6, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c * 0.6);
const BP_MID = [mid(EXEC_OUT, BAR)[0] + 18, mid(EXEC_OUT, BAR)[1] - 26];
const BP_D = `M${r(EXEC_OUT[0])},${r(EXEC_OUT[1])} Q${r(BP_MID[0])},${r(BP_MID[1])} ${r(BAR[0])},${r(BAR[1])}`;

const ADV_FROM = pt(S.aurelius.gx + 0.4, S.aurelius.gy + 0.4, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c + 0.36);
const SCHED_BACK = pt(S.scheduler.gx + 0.5, S.scheduler.gy + S.scheduler.b - 0.4, S.scheduler.c * 0.42);
const ADV_MID = [mid(ADV_FROM, SCHED_BACK)[0] - 36, mid(ADV_FROM, SCHED_BACK)[1] - 10];
const ADV_D = `M${r(ADV_FROM[0])},${r(ADV_FROM[1])} Q${r(ADV_MID[0])},${r(ADV_MID[1])} ${r(SCHED_BACK[0])},${r(SCHED_BACK[1])}`;

function metadataBridge() {
  let b = `<path d="${BR_D}" fill="none" stroke="${STEEL.core}" stroke-width="16" opacity="0.26" stroke-linecap="round" filter="url(#frost)"/>`;
  b += `<path d="${BR_D}" fill="none" stroke="${STEEL.line}" stroke-width="3.6" stroke-linecap="round"/>`;
  b += `<path d="${BR_D}" fill="none" stroke="#cdd9f1" stroke-width="1.3" stroke-dasharray="1.5 7" stroke-linecap="round" opacity="1"/>`;
  for (const e of [SCHED_OUT, AUR_TOP]) b += `<circle cx="${r(e[0])}" cy="${r(e[1])}" r="4.6" fill="${STEEL.core}" stroke="${STEEL.bright}" stroke-width="1.4"/><circle cx="${r(e[0])}" cy="${r(e[1])}" r="1.8" fill="#e6eefb"/>`;
  return doc(b);
}
function advisoryReturnPath() {
  let b = `<path d="${ADV_D}" fill="none" stroke="${STEEL.line}" stroke-width="1.8" stroke-dasharray="2 5" stroke-linecap="round" opacity="0.9"/>`;
  // arrowhead into scheduler
  const a = SCHED_BACK, s = 7;
  b += `<polyline points="${r(a[0] + s)},${r(a[1] - s * 0.5)} ${r(a[0])},${r(a[1])} ${r(a[0] + s)},${r(a[1] + s * 0.6)}" fill="none" stroke="${STEEL.bright}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  b += `<circle cx="${r(ADV_FROM[0])}" cy="${r(ADV_FROM[1])}" r="2.6" fill="${STEEL.bright}"/>`;
  return doc(b);
}
function blockedPayload() {
  const [bx, by] = BAR;
  let b = `<path d="${BP_D}" fill="none" stroke="${RED.glow}" stroke-width="10" opacity="0.5" stroke-linecap="round" filter="url(#frost)"/>`;
  b += `<path d="${BP_D}" fill="none" stroke="${RED.line}" stroke-width="2.4" stroke-dasharray="7 5" stroke-linecap="round"/>`;
  b += `<circle cx="${r(EXEC_OUT[0])}" cy="${r(EXEC_OUT[1])}" r="2.6" fill="${RED.core}" opacity="0.85"/>`;
  // red barrier shield at the boundary
  b += `<polygon points="${P([[bx - 6, by - 26], [bx + 13, by - 15], [bx + 13, by + 15], [bx - 6, by + 6]])}" fill="rgba(170,72,69,0.16)" stroke="${RED.line}" stroke-width="1.5"/>`;
  b += `<circle cx="${r(bx)}" cy="${r(by)}" r="12.5" fill="rgba(10,11,14,0.92)" stroke="${RED.core}" stroke-width="1.8"/>`;
  const k = 5.2;
  b += `<path d="M${r(bx - k)},${r(by - k)} L${r(bx + k)},${r(by + k)} M${r(bx + k)},${r(by - k)} L${r(bx - k)},${r(by + k)}" stroke="${RED.core}" stroke-width="2" stroke-linecap="round"/>`;
  return doc(b);
}
function metadataPacket() {
  const s = 7;
  let b = `<g transform="translate(${W / 2},${H / 2})"><ellipse rx="20" ry="20" fill="url(#steelhalo)"/>`;
  b += `<polygon points="${P([[-s, 0], [0, s * 0.5], [0, s * 1.5], [-s, s]])}" fill="rgba(74,96,140,0.92)"/>`;
  b += `<polygon points="${P([[s, 0], [0, s * 0.5], [0, s * 1.5], [s, s]])}" fill="rgba(54,70,102,0.92)"/>`;
  b += `<polygon points="${P([[0, -s * 0.5], [s, 0], [0, s * 0.5], [-s, 0]])}" fill="#7488ad" stroke="#aebdda" stroke-width="0.8"/></g>`;
  return doc(b);
}

/* labels.svg + annotations.svg (asset-complete; live tags are HTML from meta) */
function chip(x, y, text, anchor, accent) {
  const fs = 13, w = text.length * fs * 0.64 + 18, h = 22;
  const rx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  const tx = anchor === "middle" ? x : anchor === "end" ? x - 9 : x + 9;
  const fill = accent === "steel" ? "#9fb1d0" : accent === "red" ? RED.core : "#e6e8ea";
  return `<g><rect x="${r(rx)}" y="${r(y - h / 2)}" width="${r(w)}" height="${h}" rx="3" fill="rgba(8,10,13,0.74)" stroke="rgba(255,255,255,0.13)" stroke-width="1"/><text x="${r(tx)}" y="${r(y + 4)}" text-anchor="${anchor}" font-family="Inter" font-size="${fs}" letter-spacing="1.2" fill="${fill}">${text}</text></g>`;
}
const CENTERS = {
  queue: sc(S.queue), scheduler: sc(S.scheduler, S.scheduler.c), execution: pt(S.exec.gx + S.exec.a / 2, S.exec.gy + (S.exec.racks * S.exec.gap) / 2, S.exec.c),
  aurelius: sc(S.aurelius, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c), constraint: sc(S.constraint, SIDE_GZ + 0.55 + S.constraint.c), ledger: sc(S.ledger, SIDE_GZ + 0.55),
};
function labelsSvg() {
  let b = "";
  b += chip(CENTERS.queue[0], CENTERS.queue[1] + 70, "WORKLOAD QUEUE", "middle");
  b += chip(CENTERS.scheduler[0], CENTERS.scheduler[1] - 26, "EXISTING SCHEDULER", "middle");
  b += chip(CENTERS.execution[0] + 30, CENTERS.execution[1] - 24, "EXECUTION LAYER", "middle");
  b += chip(CENTERS.aurelius[0], CENTERS.aurelius[1] + 96, "AURELIUS CONTROL PLANE", "middle", "steel");
  b += chip(CENTERS.constraint[0] + 10, CENTERS.constraint[1] + 70, "CONSTRAINT ENGINE", "middle");
  b += chip(CENTERS.ledger[0] - 6, CENTERS.ledger[1] + 64, "APPEND-ONLY AUDIT LEDGER", "middle");
  return doc(b);
}
function annotationsSvg() {
  let b = "";
  b += chip(BR_MID[0], BR_MID[1] - 14, "METADATA ONLY", "middle", "steel");
  b += chip(BAR[0] + 20, BAR[1], "PAYLOAD BLOCKED", "start", "red");
  b += chip(ENV.gx * 0 + pt(ENV.gx + 0.6, ENV.gy + ENV.b - 0.6, 0)[0], pt(ENV.gx + 0.6, ENV.gy + ENV.b - 0.6, 0)[1], "YOUR SECURE ENVIRONMENT", "start");
  return doc(b);
}

/* ---- meta for the React wrapper ---- */
const meta = {
  viewBox: [W, H],
  centers: CENTERS,
  envTag: pt(ENV.gx + 0.6, ENV.gy + ENV.b - 0.5, 0),
  paths: { bridge: BR_D, advisory: ADV_D, blocked: BP_D },
  packet: { from: SCHED_OUT, mid: BR_MID, to: AUR_TOP },
  advisory: { from: ADV_FROM, mid: ADV_MID, to: SCHED_BACK },
  blocked: { from: EXEC_OUT, mid: BP_MID, to: BAR },
  barrier: BAR,
  metaTag: [BR_MID[0], BR_MID[1] - 8],
  payloadTag: [BAR[0] + 16, BAR[1]],
  // anchors for looped motion (forecast/rank/filter stages on the Aurelius top)
  stages: [
    sc(S.aurelius, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c + 0.4),
    [sc(S.aurelius, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c + 0.4)[0] - 34, sc(S.aurelius, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c + 0.4)[1] + 8],
    [sc(S.aurelius, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c + 0.4)[0] + 34, sc(S.aurelius, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c + 0.4)[1] + 8],
  ],
  aureliusTop: sc(S.aurelius, SIDE_GZ + 0.55 + S.aurelius.riser + S.aurelius.c),
  constraintTop: sc(S.constraint, SIDE_GZ + 0.55 + S.constraint.c),
  ledgerTop: sc(S.ledger, SIDE_GZ + 0.55 + 7 * 0.42),
  queueTop: sc(S.queue, 6 * 0.62),
};

const PH = "<!-- Authored translucent-glass isometric source asset. Swap with a Spline/Figma render of the same layer at 1440x900 to upgrade fidelity; the React wrapper treats each layer as opaque. -->\n";
const layers = {
  base_plane: basePlane(),
  background_grid: backgroundGrid(),
  customer_environment: customerEnvironment(),
  sidecar_boundary: sidecarBoundary(),
  execution_layer: executionLayer(),
  scheduler: scheduler(),
  workload_queue: workloadQueue(),
  metadata_bridge: metadataBridge(),
  advisory_return_path: advisoryReturnPath(),
  aurelius_control_plane: aureliusControlPlane(),
  constraint_engine: constraintEngine(),
  audit_ledger: auditLedger(),
  blocked_payload: blockedPayload(),
  metadata_packet: metadataPacket(),
  labels: labelsSvg(),
  annotations: annotationsSvg(),
};
for (const [name, svg] of Object.entries(layers)) writeFileSync(resolve(OUT, `${name}.svg`), name === "base_plane" ? svg : PH + svg);
writeFileSync(resolve(META_DIR, "meta.json"), JSON.stringify(meta, null, 2));
console.log(`Wrote ${Object.keys(layers).length} layers + meta.json`);
