import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useTime, useTransform, type MotionValue } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import meta from "./aurelius-schematic/meta.json";

/* ============================================================================
   Aurelius flagship — "advisory layer" vertical schematic (line art).

   ONE idea in 3 seconds: Aurelius sits between the customer's existing scheduler
   and GPU execution as an advisory layer.

       EXISTING SCHEDULER   (top)   scheduler metadata ↓
       AURELIUS             (mid, dominant)   constraint gate
       EXECUTION / GPU      (bottom)  execution unchanged

   Blue = approved metadata/control flow; red only for a rejected payload caught
   at the gate. Line-art structure is authored (scripts/gen-schematic.mjs); this
   wrapper animates the flow with Framer Motion (opacity/transform only — no
   layout shift). prefers-reduced-motion shows the resolved state.
   ========================================================================== */

const STRUCT = "/diagrams/aurelius-schematic/structure.svg";
const [VW, VH] = meta.viewBox as [number, number];
const px = (x: number) => `${(x / VW) * 100}%`;
const py = (y: number) => `${(y / VH) * 100}%`;
const EASE = [0.16, 1, 0.3, 1] as const;
const T = 9000;
type Pt = [number, number];

const STEEL = "#8298c2", STEEL_DIM = "rgba(123,145,187,0.4)", RED = "#c25b57";
const SCHEDULERS = ["Kubernetes", "Slurm", "Ray", "Volcano", "Nomad"];

const P = meta.packet, RJ = meta.reject, L = meta.labels as Record<string, Pt>;

/* sparse labels (toggle off for the no-labels legibility test) */
type Tag = { text: string; at: Pt; place: "above" | "below" | "left" | "right"; tone?: "white" | "steel" | "red" | "dim"; size?: "sm" | "xs"; mobileHide?: boolean };
const TAGS: Tag[] = [
  { text: "EXISTING SCHEDULER", at: [L.scheduler[0] - 150, L.scheduler[1] - 30], place: "left", tone: "white" },
  { text: "scheduler metadata", at: [L.schedMeta[0] + 16, L.schedMeta[1]], place: "right", tone: "steel", size: "xs" },
  { text: "AURELIUS", at: [L.aurelius[0] - 150, L.aurelius[1] + 6], place: "left", tone: "steel" },
  { text: "advisory · constraint gate", at: [L.aurelius[0] - 150, L.aurelius[1] + 26], place: "left", tone: "dim", size: "xs", mobileHide: true },
  { text: "EXECUTION · GPU FLEET", at: [L.execution[0] + 150, L.execution[1] + 8], place: "right", tone: "white" },
  { text: "execution unchanged", at: [L.execUnchanged[0] + 16, L.execUnchanged[1]], place: "right", tone: "dim", size: "xs" },
];
const toneClass: Record<NonNullable<Tag["tone"]>, string> = {
  white: "text-white/80 border-white/15",
  steel: "text-[hsl(220_34%_74%)] border-[hsl(220_30%_55%/0.4)]",
  red: "text-[hsl(2_45%_64%)] border-[hsl(2_45%_50%/0.42)]",
  dim: "text-white/42 border-white/10",
};
const placeStyle: Record<Tag["place"], React.CSSProperties> = {
  above: { transform: "translate(-50%,-100%)" },
  below: { transform: "translate(-50%,0)" },
  left: { transform: "translate(-100%,-50%)" },
  right: { transform: "translate(0,-50%)" },
};

/* always-on flow rails + resolved state (vertical column + gate stop) */
function Rails() {
  const [gx, gy] = meta.gate as Pt;
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      {/* approved metadata column: scheduler -> Aurelius -> execution */}
      <line x1={P.schedOut[0]} y1={P.schedOut[1]} x2={P.aurIn[0]} y2={P.aurIn[1]} stroke={STEEL} strokeWidth={1.5} strokeDasharray="2 5" strokeLinecap="round" />
      <line x1={P.aurOut[0]} y1={P.aurOut[1]} x2={P.execIn[0]} y2={P.execIn[1]} stroke={STEEL} strokeWidth={1.5} strokeDasharray="2 5" strokeLinecap="round" />
      {/* persistent rejected mark at the gate */}
      <circle cx={gx} cy={gy} r={7} fill="#080a0e" stroke={RED} strokeWidth={1.4} />
      <path d={`M${gx - 3.4},${gy - 3.4} L${gx + 3.4},${gy + 3.4} M${gx + 3.4},${gy - 3.4} L${gx - 3.4},${gy + 3.4}`} stroke={RED} strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

/* looping flow: blue approved packet + occasional red rejected packet */
function FlowCycle() {
  const time = useTime();
  const cycle = useTransform(time, (t) => (t % T) / T);
  const [gx, gy] = meta.gate as Pt;
  const useWin = (a: number, b: number, c: number, d: number, hi = 1): MotionValue<number> => useTransform(cycle, [a, b, c, d], [0, hi, hi, 0]);

  // blue packet: schedOut -> aurIn (pause) -> execIn
  const bx = P.schedOut[0]; // straight column, x constant
  const by = useTransform(cycle, [0, 0.16, 0.32, 0.48, 0.54], [P.schedOut[1], P.aurIn[1], P.aurIn[1], P.execIn[1], P.execIn[1]]);
  const bo = useTransform(cycle, [0, 0.03, 0.49, 0.55], [0, 1, 1, 0]);
  // Aurelius "processing" brighten while the packet sits inside
  const aurO = useTransform(cycle, [0.16, 0.2, 0.34, 0.4], [0, 0.5, 0.5, 0]);
  // execution receives
  const exO = useTransform(cycle, [0.46, 0.5, 0.62, 0.68], [0, 0.6, 0.6, 0]);

  // red rejected candidate -> gate -> flash -> fade (during processing)
  const rx = useTransform(cycle, [0.18, 0.27], [RJ.from[0], RJ.to[0]], { clamp: true });
  const ry = useTransform(cycle, [0.18, 0.27], [RJ.from[1], RJ.to[1]], { clamp: true });
  const ro = useWin(0.17, 0.2, 0.26, 0.29);
  const flashO = useTransform(cycle, [0.27, 0.3, 0.4], [0, 1, 0]);
  const aurHalo = useTransform(aurO, (v) => v * 0.5);
  const exHalo = useTransform(exO, (v) => v * 0.6);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="sgv" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8298c2" stopOpacity="0.9" /><stop offset="100%" stopColor="#8298c2" stopOpacity="0" /></radialGradient>
        <radialGradient id="srv" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c25b57" stopOpacity="0.9" /><stop offset="100%" stopColor="#c25b57" stopOpacity="0" /></radialGradient>
      </defs>

      {/* Aurelius processing glow */}
      <motion.circle cx={meta.gate[0] - 28} cy={meta.gate[1] + 14} r={64} fill="url(#sgv)" style={{ opacity: aurHalo }} />
      {/* execution receive pulse */}
      <motion.circle cx={P.execIn[0]} cy={P.execIn[1]} r={34} fill="url(#sgv)" style={{ opacity: exHalo }} />

      {/* blue approved packet */}
      <motion.g style={{ x: bx, y: by, opacity: bo }}>
        <circle r={10} fill="url(#sgv)" />
        <path d="M0,-5 L6.5,0 L0,5 L-6.5,0 Z" fill={STEEL} stroke="#dbe4f5" strokeWidth={0.8} />
        <circle r={1.9} fill="#eef3fc" />
      </motion.g>

      {/* red rejected candidate + gate flash */}
      <motion.g style={{ x: rx, y: ry, opacity: ro }}>
        <circle r={8} fill="url(#srv)" /><circle r={4} fill={RED} />
      </motion.g>
      <motion.circle cx={gx} cy={gy} r={16} fill="url(#srv)" style={{ opacity: flashO }} />
    </svg>
  );
}

export function AureliusSchematicDiagram() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();
  const hideLabels = useMemo(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("nolabels"), []);
  const looping = inView && !reduced;

  // scheduler-name crossfade (no layout shift; crossfade only)
  const [ni, setNi] = useState(0);
  useEffect(() => {
    if (reduced || !inView) return;
    const id = setInterval(() => setNi((n) => (n + 1) % SCHEDULERS.length), 2300);
    return () => clearInterval(id);
  }, [reduced, inView]);

  return (
    <figure data-acp="schematic" className="relative overflow-hidden rounded-xl border border-border bg-[#080a0e]">
      <div className="relative overflow-x-auto">
        <div ref={ref} className="relative aspect-[880/744] w-full min-w-[560px] [container-type:inline-size]">
          {reduced ? (
            <img src={STRUCT} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full select-none" />
          ) : (
            <motion.img src={STRUCT} alt="" aria-hidden draggable={false} loading="eager" className="absolute inset-0 h-full w-full select-none" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.9, ease: EASE }} />
          )}

          <Rails />
          {looping && <FlowCycle />}

          {/* scheduler-name crossfade on the console screen */}
          {!hideLabels && (
            <div className="pointer-events-none absolute" style={{ left: px(meta.schedScreen[0]), top: py(meta.schedScreen[1]), transform: "translate(-50%,-50%)" }}>
              <div className="relative" style={{ width: "9cqw", height: "2.6cqw", minWidth: 70 }}>
                {reduced ? (
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[hsl(220_34%_78%)]" style={{ fontSize: "clamp(8px,1.15cqw,15px)" }}>{SCHEDULERS[0]}</span>
                ) : (
                  <AnimatePresence>
                    <motion.span key={SCHEDULERS[ni]} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[hsl(220_34%_78%)]"
                      style={{ fontSize: "clamp(8px,1.15cqw,15px)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                      {SCHEDULERS[ni]}
                    </motion.span>
                  </AnimatePresence>
                )}
              </div>
            </div>
          )}

          {/* sparse labels */}
          {!hideLabels && (
            <div className="pointer-events-none absolute inset-0">
              {TAGS.map((t) => (
                <motion.div key={t.text} className={`absolute ${t.mobileHide ? "hidden md:block" : ""}`} style={{ left: px(t.at[0]), top: py(t.at[1]), ...placeStyle[t.place] }}
                  initial={reduced ? false : { opacity: 0 }} animate={reduced ? { opacity: 1 } : inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.5, delay: 0.7, ease: EASE }}>
                  <div className={`whitespace-nowrap rounded-[2px] border bg-[hsl(0_0%_3%/0.7)] font-mono uppercase leading-none ${toneClass[t.tone ?? "white"]}`}
                    style={{ fontSize: t.size === "xs" ? "clamp(5px,0.72cqw,8.5px)" : "clamp(6px,0.92cqw,11px)", padding: "0.42em 0.6em", letterSpacing: "0.16em" }}>
                    {t.text}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <figcaption className="flex items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/30">
        <span className="flex items-center gap-2.5"><span className="h-px w-4 bg-[hsl(220_30%_55%/0.5)]" aria-hidden />aurelius · advisory layer</span>
        <span className="hidden tabular-nums text-white/18 sm:inline">metadata_only</span>
      </figcaption>
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[10px] tabular-nums tracking-[0.16em] text-white/22">fig.00</span>
    </figure>
  );
}
