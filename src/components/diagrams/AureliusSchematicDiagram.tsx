import { Fragment, useMemo } from "react";
import { motion, AnimatePresence, useTime, useTransform, type MotionValue } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ============================================================================
   Aurelius advisory layer — strict isometric LINE ART (no images, no glow).

   One iconic vertical transformation symbol, drawn entirely in code:

        SCHEDULER     (queued jobs)
            │  metadata
        AURELIUS      (control module + constraint gate)
            │  approved decision
        GPU EXECUTION (server fleet)

   A blue metadata packet travels Scheduler → Aurelius → GPU. A red payload
   packet heads for the same boundary, hits the constraint gate, and disappears.
   Everything is thin off-white stroke on near-black; one steel-blue accent;
   red only for the blocked path. No fills except dark occlusion surfaces.
   prefers-reduced-motion resolves to a clean static state. The drawing passes
   the no-label test — labels are an optional overlay (?nolabels to hide).
   ========================================================================== */

/* ---- canvas + 2:1 isometric projection ----------------------------------- */
const W = 920;
const H = 1000;
const OX = 460;
const SX = 42; // grid unit → screen x (half-width)
const SY = 21; // grid unit → screen y (SX / 2)
const SZ = 28; // grid unit of elevation → screen y (up)

type O = { ox: number; oy: number };
type Pt = [number, number];
const iso = (o: O, x: number, y: number, z = 0): Pt => [o.ox + (x - y) * SX, o.oy + (x + y) * SY - z * SZ];

/* three vertically-aligned plates (centers ~300px apart on screen) */
const oT: O = { ox: OX, oy: 95 }; // scheduler
const oM: O = { ox: OX, oy: 366 }; // aurelius (largest)
const oB: O = { ox: OX, oy: 686 }; // gpu execution

/* ---- palette ------------------------------------------------------------- */
const BG = "#080808";
const INK = "#e8e8e8"; // primary stroke
const INK2 = "rgba(232,232,232,0.46)"; // secondary edges
const INK3 = "rgba(232,232,232,0.22)"; // faint detail
const F_TOP = "#101010"; // top face (occlusion — near-black, necessary for 3D)
const F_R = "#0b0b0b"; // right face
const F_L = "#070707"; // left face
const STEEL = "#ededed"; // metadata / advisory — white
const STEEL_DIM = "rgba(237,237,237,0.5)";
const RED = "#c24d49"; // blocked payload only
const RED_DIM = "rgba(194,77,73,0.62)";

const EASE = [0.16, 1, 0.3, 1] as const;
const T = 9000; // animation cycle (ms)
const SCHEDULERS = ["Kubernetes", "Slurm", "Ray", "Volcano", "Nomad"];

/* ---- svg helpers --------------------------------------------------------- */
const ptsStr = (a: Pt[]) => a.map(([x, y]) => `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`).join(" ");
function Poly({ p, fill = "none", stroke = INK, sw = 1.5, op }: { p: Pt[]; fill?: string; stroke?: string; sw?: number; op?: number }) {
  return <polygon points={ptsStr(p)} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" opacity={op} />;
}
function Ln({ a, b, stroke = INK, sw = 1.4, dash, op }: { a: Pt; b: Pt; stroke?: string; sw?: number; dash?: string; op?: number }) {
  return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} opacity={op} strokeLinecap="round" />;
}

/* ============================================================================
   PRIMITIVES — every object shares the one isometric projection above.
   ========================================================================== */

/* isoPlane(x,y,w,d): a thin slab (the floating platform) with a recessed inset. */
function isoPlane(o: O, x: number, y: number, w: number, d: number, { th = 0.34, inset = 0.7 }: { th?: number; inset?: number } = {}) {
  const A = iso(o, x, y, 0), B = iso(o, x + w, y, 0), C = iso(o, x + w, y + d, 0), D = iso(o, x, y + d, 0);
  const Bb = iso(o, x + w, y, -th), Cb = iso(o, x + w, y + d, -th), Db = iso(o, x, y + d, -th);
  const i = inset;
  const ins: Pt[] = [iso(o, x + i, y + i, 0), iso(o, x + w - i, y + i, 0), iso(o, x + w - i, y + d - i, 0), iso(o, x + i, y + d - i, 0)];
  return (
    <g>
      <Poly p={[B, C, Cb, Bb]} fill={F_R} stroke={INK2} sw={1.3} />
      <Poly p={[D, C, Cb, Db]} fill={F_L} stroke={INK2} sw={1.3} />
      <Poly p={[A, B, C, D]} fill={F_TOP} stroke={INK} sw={1.6} />
      <Poly p={ins} stroke={INK3} sw={1.25} />
    </g>
  );
}

/* isoBox(x,y,w,d,h): a wireframe box with dark faces (top + right + left). */
function isoBox(o: O, x: number, y: number, z: number, w: number, d: number, h: number, { sw = 1.4, top = F_TOP, right = F_R, left = F_L, stroke = INK }: { sw?: number; top?: string; right?: string; left?: string; stroke?: string } = {}) {
  const T0 = iso(o, x, y, z + h), T1 = iso(o, x + w, y, z + h), T2 = iso(o, x + w, y + d, z + h), T3 = iso(o, x, y + d, z + h);
  const B1 = iso(o, x + w, y, z), B2 = iso(o, x + w, y + d, z), B3 = iso(o, x, y + d, z);
  return (
    <g>
      <Poly p={[T1, T2, B2, B1]} fill={right} stroke={stroke} sw={sw} />
      <Poly p={[T3, T2, B2, B3]} fill={left} stroke={stroke} sw={sw} />
      <Poly p={[T0, T1, T2, T3]} fill={top} stroke={stroke} sw={sw} />
    </g>
  );
}

/* serverRack(): box + horizontal unit slots on the front face + top vents. */
function serverRack(o: O, x: number, y: number, w: number, d: number, h: number) {
  const slots: Pt[][] = [];
  for (let i = 1; i <= 4; i++) {
    const zz = (h * i) / 5;
    slots.push([iso(o, x + w, y + 0.12, zz), iso(o, x + w, y + d - 0.12, zz)]);
  }
  const vents: Pt[][] = [];
  for (let i = 1; i <= 3; i++) {
    const yy = y + (d * i) / 4;
    vents.push([iso(o, x + 0.12, yy, h), iso(o, x + w - 0.12, yy, h)]);
  }
  return (
    <g>
      {isoBox(o, x, y, 0, w, d, h, { sw: 1.4 })}
      {slots.map(([a, b], i) => (
        <Ln key={`s${i}`} a={a} b={b} stroke={INK2} sw={1.0} />
      ))}
      {vents.map(([a, b], i) => (
        <Ln key={`v${i}`} a={a} b={b} stroke={INK3} sw={0.9} />
      ))}
    </g>
  );
}

/* schedulerStack(): a short pile of queue cards on the scheduler plate. */
function schedulerStack(o: O) {
  const cards = [0, 0.34, 0.68];
  return (
    <g>
      {cards.map((z, i) => (
        <Fragment key={i}>{isoBox(o, 1.45, 1.35, z, 2.1, 2.3, 0.24, { sw: 1.4, top: i === cards.length - 1 ? "#0f141b" : F_TOP })}</Fragment>
      ))}
    </g>
  );
}

/* aureliusControlModule(): the one dominant object — tiered control core. */
function aureliusControlModule(o: O) {
  const cx = 3.2, cy = 3.2;
  return (
    <g>
      {/* base */}
      {isoBox(o, cx - 1.4, cy - 1.4, 0, 2.8, 2.8, 1.3, { sw: 1.6 })}
      {/* chip / core deck */}
      {isoBox(o, cx - 0.8, cy - 0.8, 1.3, 1.6, 1.6, 0.5, { sw: 1.5, top: "#10151c" })}
      {/* recessed core mark on top */}
      <Poly
        p={[iso(o, cx - 0.32, cy - 0.32, 1.8), iso(o, cx + 0.32, cy - 0.32, 1.8), iso(o, cx + 0.32, cy + 0.32, 1.8), iso(o, cx - 0.32, cy + 0.32, 1.8)]}
        stroke={STEEL_DIM}
        sw={1.3}
      />
    </g>
  );
}

/* constraintGate(): a low wall with a central opening on the Aurelius plate.
   Safe (blue) passes through the gap; unsafe (red) hits the solid post. */
function constraintGate(o: O) {
  const gy = 4.5, h = 1.15;
  return (
    <g>
      {isoBox(o, 3.3, gy, 0, 0.85, 0.3, h, { sw: 1.4 })}
      {isoBox(o, 4.9, gy, 0, 0.85, 0.3, h, { sw: 1.4 })}
      {/* lintel hint over the opening */}
      <Ln a={iso(o, 4.15, gy + 0.15, h)} b={iso(o, 4.9, gy + 0.15, h)} stroke={INK3} sw={1.25} dash="2 4" />
    </g>
  );
}

/* gpuFleet(): a small 2x2 server cluster on the execution plate. */
function gpuFleet(o: O) {
  const pos: Pt[] = [[1.5, 1.5], [2.95, 1.5], [1.5, 2.95], [2.95, 2.95]];
  return (
    <g>
      {pos.map(([x, y], i) => (
        <Fragment key={i}>{serverRack(o, x, y, 1.05, 1.05, 1.2)}</Fragment>
      ))}
    </g>
  );
}

/* arrowDown(): a small downward chevron used as a direction cue on a rail. */
function arrowDown(p: Pt, color: string, s = 7) {
  return <polyline points={`${p[0] - s},${p[1] - s} ${p[0]},${p[1]} ${p[0] + s},${p[1] - s}`} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />;
}

/* ---- anchor points (computed once from the projection) ------------------- */
const A = {
  schedExit: iso(oT, 2.5, 2.45, 1.0), // top of the queue stack
  aurTop: iso(oM, 3.2, 3.2, 1.85), // top of the control module
  aurOut: iso(oM, 3.2, 3.5, 0.7), // advisory leaving the module front
  gap: iso(oM, 4.4, 4.5, 0.95), // the gate opening
  gpuTop: iso(oB, 2.6, 2.2, 1.3), // landing on the fleet
  redStart: iso(oT, 3.1, 2.6, 0.9), // unsafe payload origin (offset)
  gateStop: iso(oM, 5.0, 4.5, 1.15), // top of the solid gate post
};
/* straight flows — control point is the exact midpoint, so each quadratic
   degenerates to a straight line (no curves, per the diagram rules) */
const BLUE_IN: Pt[] = [A.schedExit, [(A.schedExit[0] + A.aurTop[0]) / 2, (A.schedExit[1] + A.aurTop[1]) / 2], A.aurTop];
const BLUE_OUT: Pt[] = [A.aurOut, [(A.aurOut[0] + A.gpuTop[0]) / 2, (A.aurOut[1] + A.gpuTop[1]) / 2], A.gpuTop];
const RED_PATH: Pt[] = [A.redStart, [(A.redStart[0] + A.gateStop[0]) / 2, (A.redStart[1] + A.gateStop[1]) / 2], A.gateStop];

const bez = (p: Pt[], t: number): Pt => {
  const u = 1 - t;
  return [u * u * p[0][0] + 2 * u * t * p[1][0] + t * t * p[2][0], u * u * p[0][1] + 2 * u * t * p[1][1] + t * t * p[2][1]];
};
const pathD = (p: Pt[]) => `M${p[0][0]},${p[0][1]} Q${p[1][0]},${p[1][1]} ${p[2][0]},${p[2][1]}`;

/* ============================================================================
   STATIC STRUCTURE — the three plates and their objects (always rendered).
   ========================================================================== */
function Scene() {
  return (
    <g>
      {/* TOP — scheduler plate */}
      {isoPlane(oT, 0, 0, 5, 5)}
      {schedulerStack(oT)}

      {/* MIDDLE — aurelius plate (largest, clearest) */}
      {isoPlane(oM, 0, 0, 6.4, 6.4)}
      {aureliusControlModule(oM)}
      {constraintGate(oM)}

      {/* BOTTOM — gpu execution plate */}
      {isoPlane(oB, 0, 0, 5.6, 5.6)}
      {gpuFleet(oB)}
    </g>
  );
}

/* Always-on rails + resolved blocked stop (so the static frame reads). */
function Rails() {
  return (
    <g aria-hidden>
      {/* metadata in + advisory out: one continuous steel flow, scheduler → gpu */}
      <path d={pathD(BLUE_IN)} fill="none" stroke={STEEL} strokeWidth={1.6} strokeLinecap="round" />
      <path d={pathD(BLUE_OUT)} fill="none" stroke={STEEL} strokeWidth={1.6} strokeLinecap="round" />
      {arrowDown(bez(BLUE_IN, 0.62), STEEL)}
      {arrowDown(bez(BLUE_OUT, 0.6), STEEL)}
      {/* blocked payload rail, terminating at the gate with a persistent stop */}
      <path d={pathD(RED_PATH)} fill="none" stroke={RED_DIM} strokeWidth={1.6} strokeDasharray="5 5" strokeLinecap="round" />
      <circle cx={A.gateStop[0]} cy={A.gateStop[1]} r={9} fill={BG} stroke={RED} strokeWidth={1.7} />
      <path
        d={`M${A.gateStop[0] - 3.6},${A.gateStop[1] - 3.6} L${A.gateStop[0] + 3.6},${A.gateStop[1] + 3.6} M${A.gateStop[0] + 3.6},${A.gateStop[1] - 3.6} L${A.gateStop[0] - 3.6},${A.gateStop[1] + 3.6}`}
        stroke={RED}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </g>
  );
}

/* ---- looping transformation cycle (moving parts only) -------------------- */
function FlowCycle() {
  const time = useTime();
  const cycle = useTransform(time, (t) => (t % T) / T);

  const useTravel = (p: Pt[], a: number, b: number) => {
    const prog = useTransform(cycle, [a, b], [0, 1], { clamp: true });
    return { x: useTransform(prog, (v) => bez(p, v)[0]), y: useTransform(prog, (v) => bez(p, v)[1]) };
  };
  const useWin = (a: number, b: number, c: number, d: number, hi = 1): MotionValue<number> => useTransform(cycle, [a, b, c, d], [0, hi, hi, 0]);

  const metaT = useTravel(BLUE_IN, 0.05, 0.22);
  const metaO = useWin(0.03, 0.07, 0.2, 0.23);
  const corePulse = useTransform(cycle, [0.22, 0.3, 0.4], [0, 1, 0]);
  const redT = useTravel(RED_PATH, 0.32, 0.46);
  const redO = useWin(0.31, 0.34, 0.44, 0.47);
  const flashO = useTransform(cycle, [0.45, 0.49, 0.58], [0, 1, 0]);
  const advT = useTravel(BLUE_OUT, 0.56, 0.76);
  const advO = useWin(0.55, 0.59, 0.74, 0.77);
  const execO = useWin(0.76, 0.8, 0.92, 0.96, 0.9);

  const chip = (fill: string) => (
    <>
      <path d="M0,-5 L6.5,0 L0,5 L-6.5,0 Z" fill={fill} stroke={INK} strokeWidth={0.9} />
      <circle r={1.8} fill={INK} />
    </>
  );

  return (
    <g aria-hidden>
      {/* metadata packet: scheduler → aurelius */}
      <motion.g style={{ x: metaT.x, y: metaT.y, opacity: metaO }}>{chip(STEEL)}</motion.g>

      {/* aurelius core evaluates (subtle stroke pulse on the core mark) */}
      <motion.g style={{ opacity: corePulse }}>
        <Poly
          p={[iso(oM, 2.88, 2.88, 1.8), iso(oM, 3.52, 2.88, 1.8), iso(oM, 3.52, 3.52, 1.8), iso(oM, 2.88, 3.52, 1.8)]}
          stroke={STEEL}
          sw={1.6}
        />
      </motion.g>

      {/* unsafe payload: heads to the gate, hits the post, flashes once */}
      <motion.g style={{ x: redT.x, y: redT.y, opacity: redO }}>
        <circle r={6} fill={BG} stroke={RED} strokeWidth={1.6} />
        <circle r={2.2} fill={RED} />
      </motion.g>
      <motion.circle cx={A.gateStop[0]} cy={A.gateStop[1]} r={15} fill="none" stroke={RED} strokeWidth={1.6} style={{ opacity: flashO }} />

      {/* approved advisory: aurelius → gpu execution */}
      <motion.g style={{ x: advT.x, y: advT.y, opacity: advO }}>{chip(STEEL)}</motion.g>

      {/* execution continues forward on the fleet */}
      <motion.g style={{ opacity: execO }}>
        <circle cx={A.gpuTop[0]} cy={A.gpuTop[1] + 2} r={14} fill="none" stroke={STEEL} strokeWidth={1.4} />
      </motion.g>
    </g>
  );
}

/* ---- label overlay (HTML, optional — the drawing passes the no-label test) */
type Tag = { text: string; at: Pt; place: "above" | "below" | "left" | "right"; tone?: "white" | "steel" | "red" | "dim"; mobileHide?: boolean };
const px = (x: number) => `${(x / W) * 100}%`;
const py = (y: number) => `${(y / H) * 100}%`;
const TAGS: Tag[] = [
  { text: "AURELIUS CONTROL", at: [iso(oM, 6.4, 0, 0)[0] + 10, iso(oM, 6.4, 0, 0)[1] + 18], place: "right", tone: "steel", mobileHide: true },
  { text: "CONSTRAINT GATE", at: [A.gateStop[0] + 52, A.gateStop[1] + 26], place: "right", tone: "dim", mobileHide: true },
  { text: "GPU EXECUTION", at: [OX, iso(oB, 5.6, 5.6, 0)[1] + 16], place: "below", tone: "white" },
  { text: "METADATA ONLY", at: [bez(BLUE_IN, 0.5)[0] - 14, bez(BLUE_IN, 0.5)[1]], place: "left", tone: "steel" },
  { text: "PAYLOAD BLOCKED", at: [A.gateStop[0] + 52, A.gateStop[1] - 4], place: "right", tone: "red" },
];
const toneClass: Record<NonNullable<Tag["tone"]>, string> = {
  white: "text-white/80 border-white/15",
  steel: "text-white/85 border-white/30",
  red: "text-[hsl(2_42%_58%)] border-[hsl(2_42%_44%/0.5)]",
  dim: "text-white/40 border-white/10",
};
const placeStyle: Record<Tag["place"], React.CSSProperties> = {
  above: { transform: "translate(-50%,-100%)" },
  below: { transform: "translate(-50%,0)" },
  left: { transform: "translate(-100%,-50%)" },
  right: { transform: "translate(0,-50%)" },
};

export function AureliusSchematicDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();
  const hideLabels = useMemo(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("nolabels"), []);
  const looping = inView && !reduced;
  const nameIdx = useSequence(SCHEDULERS.length, { enabled: inView, interval: 2800 });

  return (
    <figure data-acp="schematic" className="relative mx-auto max-w-[600px] overflow-hidden border border-border" style={{ background: BG }}>
      <div ref={ref} className="relative aspect-[920/1000] w-full [container-type:inline-size]">
        <motion.svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Aurelius advisory layer: scheduler metadata passes through Aurelius before GPU execution; unsafe payload is blocked at the constraint gate."
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? { opacity: 1 } : inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <Scene />
          <Rails />
          {looping && <FlowCycle />}
        </motion.svg>

        {/* sparse label overlay */}
        {!hideLabels && (
          <div className="pointer-events-none absolute inset-0">
            {/* scheduler name — crossfades slowly over the queue stack */}
            <div className="absolute" style={{ left: px(iso(oT, 2.5, 2.5, 0)[0]), top: py(iso(oT, 0, 0, 0)[1] - 6), transform: "translate(-50%,-100%)" }}>
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Scheduler</span>
                <div className="relative h-[1.2em]" style={{ fontSize: "clamp(11px,1.6cqw,16px)" }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={SCHEDULERS[nameIdx]}
                      className="block whitespace-nowrap font-medium tracking-tight text-white/85"
                      initial={reduced ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      {SCHEDULERS[nameIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {TAGS.map((t) => (
              <motion.div
                key={t.text}
                className={`absolute ${t.mobileHide ? "hidden md:block" : ""}`}
                style={{ left: px(t.at[0]), top: py(t.at[1]), ...placeStyle[t.place] }}
                initial={reduced ? false : { opacity: 0 }}
                animate={reduced ? { opacity: 1 } : inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
              >
                <div
                  className={`whitespace-nowrap border bg-[hsl(0_0%_3%/0.72)] font-mono uppercase leading-none ${toneClass[t.tone ?? "white"]}`}
                  style={{ fontSize: "clamp(6px,0.85cqw,10px)", padding: "0.42em 0.6em", letterSpacing: "0.18em" }}
                >
                  {t.text}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <figcaption className="flex items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/30">
        <span className="flex items-center gap-2.5">
          <span className="h-px w-4 bg-white/40" aria-hidden />
          advisory layer · scheduler → aurelius → execution
        </span>
        <span className="hidden tabular-nums text-white/18 sm:inline">metadata_only</span>
      </figcaption>
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[10px] tabular-nums tracking-[0.16em] text-white/22">fig.00</span>
    </figure>
  );
}
