import { useMemo } from "react";
import { motion, useTime, useTransform, type MotionValue } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import meta from "./aurelius-schematic/meta.json";

/* ============================================================================
   Aurelius flagship — Crusoe/Lambda-style technical isometric LINE ART.

   Thin white wireframe on near-black; one steel-blue signal accent; red only for
   the blocked payload path. The static line-art structure is an authored SVG
   (scripts/gen-schematic.mjs -> /public/diagrams/aurelius-schematic/structure.svg);
   this wrapper draws the transformation story over it with Framer Motion:

     GPU fleet / scheduler (left)  --metadata-only bridge-->  Aurelius control
     plane (right): constraint gate filters, forecast cloud above, advisory
     decision returns to the scheduler, every decision appended to the audit
     ledger. The payload path is blocked at the boundary wall.

   Only opacity / transform / SVG pathLength + strokeDashoffset animate — no
   layout shift, no scroll. prefers-reduced-motion shows the resolved state.
   ========================================================================== */

const STRUCT = "/diagrams/aurelius-schematic/structure.svg";
const [VW, VH] = meta.viewBox as [number, number];
const px = (x: number) => `${(x / VW) * 100}%`;
const py = (y: number) => `${(y / VH) * 100}%`;
const EASE = [0.16, 1, 0.3, 1] as const;
const T = 10000;
type Pt = [number, number];
const bez = (p: number[][], t: number): Pt => {
  const u = 1 - t;
  return [u * u * p[0][0] + 2 * u * t * p[1][0] + t * t * p[2][0], u * u * p[0][1] + 2 * u * t * p[1][1] + t * t * p[2][1]];
};

const STEEL = "#8298c2", STEEL_DIM = "rgba(123,145,187,0.45)", WHITE = "rgba(226,230,236,0.9)", RED = "#c25b57", RED_DIM = "rgba(194,91,87,0.4)";

/* sparse line-art labels (toggle off for the no-labels legibility test) */
type Tag = { text: string; at: Pt; place: "above" | "below" | "left" | "right"; tone?: "white" | "steel" | "red" | "dim"; mobileHide?: boolean };
const L = meta.labels as Record<string, Pt>;
const TAGS: Tag[] = [
  { text: "GPU FLEET · SCHEDULER", at: [L.scheduler[0], L.scheduler[1] + 26], place: "below", tone: "white" },
  { text: "AURELIUS CONTROL PLANE", at: [L.aurelius[0], L.aurelius[1] + 30], place: "below", tone: "steel" },
  { text: "METADATA ONLY", at: [meta.packet.mid[0], meta.packet.mid[1] - 6], place: "above", tone: "steel" },
  { text: "PAYLOAD BLOCKED", at: [meta.barrier[0] - 8, meta.barrier[1] + 4], place: "left", tone: "red" },
  { text: "CONSTRAINT", at: [L.constraint[0], L.constraint[1] - 6], place: "above", tone: "dim", mobileHide: true },
  { text: "APPEND-ONLY LEDGER", at: [L.ledger[0] + 10, L.ledger[1] - 4], place: "right", tone: "dim", mobileHide: true },
  { text: "ECONOMIC FORECAST", at: [L.forecast[0], L.forecast[1] - 64], place: "above", tone: "dim", mobileHide: true },
];
const toneClass: Record<NonNullable<Tag["tone"]>, string> = {
  white: "text-white/80 border-white/15",
  steel: "text-[hsl(220_34%_74%)] border-[hsl(220_30%_55%/0.4)]",
  red: "text-[hsl(2_45%_64%)] border-[hsl(2_45%_50%/0.42)]",
  dim: "text-white/40 border-white/10",
};
const placeStyle: Record<Tag["place"], React.CSSProperties> = {
  above: { transform: "translate(-50%,-100%)" },
  below: { transform: "translate(-50%,0)" },
  left: { transform: "translate(-100%,-50%)" },
  right: { transform: "translate(0,-50%)" },
};

/* arrowhead at point `p`, pointing along direction from `prev` */
function Arrow({ p, from, color }: { p: Pt; from: Pt; color: string }) {
  const a = Math.atan2(p[1] - from[1], p[0] - from[0]);
  const s = 7;
  const x1 = p[0] - s * Math.cos(a - 0.45), y1 = p[1] - s * Math.sin(a - 0.45);
  const x2 = p[0] - s * Math.cos(a + 0.45), y2 = p[1] - s * Math.sin(a + 0.45);
  return <polyline points={`${x1},${y1} ${p[0]},${p[1]} ${x2},${y2}`} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />;
}

/* always-on rails + direction cues + persistent blocked stop (resolved state) */
function Rails() {
  const [barX, barY] = meta.barrier as Pt;
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      {/* metadata-only bridge: the single steel link reaching Aurelius */}
      <path d={meta.paths.bridge} fill="none" stroke={STEEL} strokeWidth={1.6} strokeLinecap="round" />
      <Arrow p={meta.packet.to as Pt} from={meta.packet.mid as Pt} color={STEEL} />
      {/* advisory return */}
      <path d={meta.paths.advisory} fill="none" stroke={STEEL_DIM} strokeWidth={1.3} strokeDasharray="2 5" strokeLinecap="round" />
      <Arrow p={meta.advisory.to as Pt} from={meta.advisory.mid as Pt} color={STEEL_DIM} />
      {/* blocked payload: red rail terminating at the wall with a persistent stop */}
      <path d={meta.paths.blocked} fill="none" stroke={RED_DIM} strokeWidth={1.4} strokeDasharray="6 5" strokeLinecap="round" />
      <circle cx={barX} cy={barY} r={9} fill="#080a0e" stroke={RED} strokeWidth={1.5} />
      <path d={`M${barX - 4},${barY - 4} L${barX + 4},${barY + 4} M${barX + 4},${barY - 4} L${barX - 4},${barY + 4}`} stroke={RED} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

/* ---- looping transformation cycle (moving/pulsing parts only) ---- */
function FlowCycle() {
  const time = useTime();
  const cycle = useTransform(time, (t) => (t % T) / T);
  const bridgePts = [meta.packet.from, meta.packet.mid, meta.packet.to];
  const advPts = [meta.advisory.from, meta.advisory.mid, meta.advisory.to];
  const blkPts = [meta.blocked.from, meta.blocked.mid, meta.blocked.to];
  const [barX, barY] = meta.barrier as Pt;
  const [gx, gy] = meta.gate as Pt;
  const [lx, ly] = meta.ledger as Pt;
  const [cx, cy] = meta.cloud as Pt;

  const useTravel = (pts: number[][], a: number, b: number) => {
    const prog = useTransform(cycle, [a, b], [0, 1], { clamp: true });
    return { x: useTransform(prog, (p) => bez(pts, p)[0]), y: useTransform(prog, (p) => bez(pts, p)[1]) };
  };
  const useWin = (a: number, b: number, c: number, d: number, hi = 1): MotionValue<number> => useTransform(cycle, [a, b, c, d], [0, hi, hi, 0]);

  const metaT = useTravel(bridgePts, 0.06, 0.22);
  const metaO = useWin(0.05, 0.08, 0.2, 0.23);
  const advT = useTravel(advPts, 0.6, 0.76);
  const advO = useWin(0.59, 0.63, 0.73, 0.77);
  const blkT = useTravel(blkPts, 0.46, 0.55);
  const blkO = useWin(0.45, 0.48, 0.53, 0.56);
  const gatePulse = useTransform(cycle, [0.26, 0.32, 0.42], [0, 1, 0]);
  const flashO = useTransform(cycle, [0.53, 0.57, 0.66], [0, 1, 0]);
  const plateO = useTransform(cycle, [0.74, 0.82, 0.95, 0.99], [0, 1, 1, 0]);
  const plateY = useTransform(cycle, [0.74, 0.82], [10, 0], { clamp: true });
  const cloudO = useTransform(cycle, [0.2, 0.3, 0.5, 0.6], [0.2, 0.85, 0.85, 0.2]);
  const cloudHalo = useTransform(cloudO, (v) => v * 0.4);

  const chip = (fill: string) => (<><path d="M0,-5 L6.5,0 L0,5 L-6.5,0 Z" fill={fill} stroke="#dbe4f5" strokeWidth={0.8} /><circle r={1.9} fill="#eef3fc" /></>);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="sg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8298c2" stopOpacity="0.9" /><stop offset="100%" stopColor="#8298c2" stopOpacity="0" /></radialGradient>
        <radialGradient id="sr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c25b57" stopOpacity="0.9" /><stop offset="100%" stopColor="#c25b57" stopOpacity="0" /></radialGradient>
      </defs>

      {/* forecast cloud activity */}
      <motion.circle cx={cx} cy={cy} r={42} fill="url(#sg)" style={{ opacity: cloudHalo }} />

      {/* metadata packet travels the bridge into Aurelius */}
      <motion.g style={{ x: metaT.x, y: metaT.y, opacity: metaO }}>
        <circle r={11} fill="url(#sg)" />{chip(STEEL)}
      </motion.g>

      {/* constraint gate pulse */}
      <motion.circle cx={gx} cy={gy} r={16} fill="none" stroke={STEEL} strokeWidth={2} style={{ opacity: gatePulse }} />

      {/* blocked payload packet hits the boundary and flashes red once */}
      <motion.g style={{ x: blkT.x, y: blkT.y, opacity: blkO }}><circle r={9} fill="url(#sr)" /><circle r={4.5} fill={RED} /></motion.g>
      <motion.circle cx={barX} cy={barY} r={20} fill="url(#sr)" style={{ opacity: flashO }} />

      {/* advisory decision returns to scheduler */}
      <motion.g style={{ x: advT.x, y: advT.y, opacity: advO }}><circle r={9} fill="url(#sg)" />{chip(STEEL)}</motion.g>

      {/* audit ledger receives a new record line */}
      <motion.g style={{ opacity: plateO, y: plateY }}>
        <line x1={lx - 26} y1={ly} x2={lx + 26} y2={ly + 13} stroke={STEEL} strokeWidth={2} strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

export function AureliusSchematicDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();
  const hideLabels = useMemo(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("nolabels"), []);
  const looping = inView && !reduced;

  return (
    <figure data-acp="schematic" className="relative overflow-hidden rounded-xl border border-border bg-[#080a0e]">
      <div className="relative overflow-x-auto">
        <div ref={ref} className="relative aspect-[1280/850] w-full min-w-[720px] [container-type:inline-size]">
          {/* line-art structure */}
          {reduced ? (
            <img src={STRUCT} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full select-none" />
          ) : (
            <motion.img src={STRUCT} alt="" aria-hidden draggable={false} loading="eager" className="absolute inset-0 h-full w-full select-none" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.9, ease: EASE }} />
          )}

          {/* story overlay: always-on rails + (when active) the looping cycle */}
          <Rails />
          {looping && <FlowCycle />}

          {/* sparse labels */}
          {!hideLabels && (
            <div className="pointer-events-none absolute inset-0">
              {TAGS.map((t) => (
                <motion.div key={t.text} className={`absolute ${t.mobileHide ? "hidden md:block" : ""}`} style={{ left: px(t.at[0]), top: py(t.at[1]), ...placeStyle[t.place] }}
                  initial={reduced ? false : { opacity: 0 }} animate={reduced ? { opacity: 1 } : inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.5, delay: 0.8, ease: EASE }}>
                  <div className={`whitespace-nowrap rounded-[2px] border bg-[hsl(0_0%_3%/0.7)] font-mono uppercase leading-none ${toneClass[t.tone ?? "white"]}`} style={{ fontSize: "clamp(6px,0.85cqw,10px)", padding: "0.42em 0.6em", letterSpacing: "0.18em" }}>
                    {t.text}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <figcaption className="flex items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/30">
        <span className="flex items-center gap-2.5"><span className="h-px w-4 bg-[hsl(220_30%_55%/0.5)]" aria-hidden />aurelius control plane · isometric schematic</span>
        <span className="hidden tabular-nums text-white/18 sm:inline">metadata_only</span>
      </figcaption>
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[10px] tabular-nums tracking-[0.16em] text-white/22">fig.00</span>
    </figure>
  );
}
