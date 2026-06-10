import { useMemo } from "react";
import { motion, useTime, useTransform, type MotionValue } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import meta from "./aurelius-control-plane/meta.json";

/* ============================================================================
   Aurelius Control Plane — flagship layered isometric illustration (v3: story).

   Rendering is the authored translucent-glass art (unchanged). This wrapper adds
   a subtle, looping ~10s transformation cycle that makes the architecture legible
   even with labels hidden:

     workload pulses → metadata extracted → travels the metadata-only bridge →
     Aurelius brightens → forecast/rank/filter stages fire → constraint gate scans
     → payload path flashes red and stays blocked → safe advisory returns to the
     scheduler → a new record lands on the audit ledger → settle → repeat.

   Each visual layer is an opaque asset (1440x900); swap any file for a Spline/
   Figma render with no code change. Motion animates only opacity / transform —
   no layout shift, no scroll. prefers-reduced-motion shows the resolved state.
   ========================================================================== */

const SRC = "/diagrams/aurelius-control-plane";
const [VW, VH] = meta.viewBox as [number, number];
const px = (x: number) => `${(x / VW) * 100}%`;
const py = (y: number) => `${(y / VH) * 100}%`;
const EASE = [0.16, 1, 0.3, 1] as const;
const T = 10000; // cycle length (ms)

type Pt = [number, number];
const bez = (p: number[][], t: number): Pt => {
  const u = 1 - t;
  return [u * u * p[0][0] + 2 * u * t * p[1][0] + t * t * p[2][0], u * u * p[0][1] + 2 * u * t * p[1][1] + t * t * p[2][1]];
};

/* static object/floor/path layers (one-time reveal, then held) */
type Layer = { id: string; rest: number; delay: number; fromY?: number };
const LAYERS: Layer[] = [
  { id: "base_plane", rest: 1, delay: 0 },
  { id: "background_grid", rest: 0.72, delay: 0.1 },
  { id: "customer_environment", rest: 0.95, delay: 0.26 },
  { id: "execution_layer", rest: 0.58, delay: 0.74 },
  { id: "scheduler", rest: 1, delay: 0.5 },
  { id: "workload_queue", rest: 0.9, delay: 0.4 },
  { id: "sidecar_boundary", rest: 0.95, delay: 0.9 },
  { id: "metadata_bridge", rest: 0.85, delay: 1.05 },
  { id: "advisory_return_path", rest: 0.6, delay: 1.2 },
  { id: "aurelius_control_plane", rest: 1, delay: 1.0, fromY: 16 },
  { id: "constraint_engine", rest: 0.95, delay: 1.35 },
  { id: "audit_ledger", rest: 0.95, delay: 1.5 },
  { id: "blocked_payload", rest: 0.85, delay: 1.65 },
];
const layerVariants = {
  hidden: (c: Layer) => ({ opacity: 0, y: c.fromY ?? 6 }),
  shown: (c: Layer) => ({ opacity: c.rest, y: 0, transition: { duration: 0.7, delay: c.delay, ease: EASE } }),
};

/* HTML technical tags */
type Tag = { text: string; sub?: string; at: Pt; place: "above" | "below" | "left" | "right"; tone?: "default" | "steel" | "red" | "dim"; primary?: boolean; mobileHide?: boolean };
const C = meta.centers as Record<string, Pt>;
const TAGS: Tag[] = [
  { text: "EXISTING SCHEDULER", sub: "scheduler remains authority", at: [C.scheduler[0], C.scheduler[1] - 14], place: "above" },
  { text: "EXECUTION LAYER", sub: "execution unchanged", at: [C.execution[0] + 12, C.execution[1] - 12], place: "above" },
  { text: "WORKLOAD QUEUE", sub: "job metadata · timing", at: [C.queue[0] - 14, C.queue[1] - 6], place: "left" },
  { text: "AURELIUS CONTROL PLANE", sub: "forecast · rank · filter · log", at: [C.aurelius[0], C.aurelius[1] + 36], place: "below", primary: true },
  { text: "CONSTRAINT ENGINE", at: [C.constraint[0] + 10, C.constraint[1] + 24], place: "below", mobileHide: true },
  { text: "APPEND-ONLY AUDIT LEDGER", at: [C.ledger[0] - 8, C.ledger[1] + 26], place: "below", mobileHide: true },
  { text: "METADATA ONLY", at: meta.metaTag as Pt, place: "above", tone: "steel" },
  { text: "PAYLOAD BLOCKED", at: meta.payloadTag as Pt, place: "right", tone: "red" },
  { text: "YOUR SECURE ENVIRONMENT", at: [84, 808], place: "right", tone: "dim", mobileHide: true },
];
const toneClass: Record<NonNullable<Tag["tone"]>, string> = {
  default: "text-white/82 border-white/12",
  steel: "text-[hsl(217_30%_72%)] border-[hsl(216_28%_50%/0.4)]",
  red: "text-[hsl(1_44%_62%)] border-[hsl(1_44%_46%/0.42)]",
  dim: "text-white/42 border-white/10",
};
const placeStyle: Record<Tag["place"], React.CSSProperties> = {
  above: { transform: "translate(-50%, -100%)" },
  below: { transform: "translate(-50%, 0)" },
  left: { transform: "translate(-100%, -50%)" },
  right: { transform: "translate(0, -50%)" },
};

/* ---- the looping transformation cycle (mounted only when active) ---- */
function FlowCycle() {
  const time = useTime();
  const cycle = useTransform(time, (t) => (t % T) / T);

  const packetPts = [meta.packet.from, meta.packet.mid, meta.packet.to];
  const advPts = [meta.advisory.from, meta.advisory.mid, meta.advisory.to];
  const blkPts = [meta.blocked.from, meta.blocked.mid, meta.blocked.to];
  const stages = meta.stages as Pt[];
  const [ax, ay] = meta.aureliusTop as Pt;
  const [cx, cy] = meta.constraintTop as Pt;
  const [lx, ly] = meta.ledgerTop as Pt;
  const [qx, qy] = meta.queueTop as Pt;
  const [barX, barY] = meta.barrier as Pt;

  // helpers: progress -> x/y along a quad bezier; opacity window
  const useTravel = (pts: number[][], inR: [number, number]) => {
    const prog = useTransform(cycle, inR, [0, 1], { clamp: true });
    return { x: useTransform(prog, (p) => bez(pts, p)[0]), y: useTransform(prog, (p) => bez(pts, p)[1]) };
  };
  const useWin = (a: number, b: number, c: number, d: number, hi = 1): MotionValue<number> =>
    useTransform(cycle, [a, b, c, d], [0, hi, hi, 0]);

  // continuous directional flow along the metadata bridge (forward) + advisory (back)
  const bridgeFlow = useTransform(time, (t) => -((t / 26) % 16));
  const advFlow = useTransform(time, (t) => (t / 42) % 14);

  const metaT = useTravel(packetPts, [0.06, 0.22]);
  const metaHead = useTransform(cycle, [0.04, 0.07, 0.2, 0.23], [0, 1, 1, 0]);
  const metaTrail = useTransform(cycle, [0.05, 0.09, 0.2, 0.23], [0, 0.5, 0.5, 0]);
  const advT = useTravel(advPts, [0.6, 0.75]);
  const advO = useWin(0.59, 0.63, 0.72, 0.76);
  const blkT = useTravel(blkPts, [0.47, 0.56]);
  const blkO = useWin(0.46, 0.49, 0.54, 0.57);

  const queuePulse = useTransform(cycle, [0, 0.06, 0.13, 0.5, 0.56, 1], [0.08, 0.32, 0.08, 0.08, 0.24, 0.08]);
  const aurGlow = useTransform(cycle, [0.18, 0.26, 0.48, 0.64], [0.08, 0.7, 0.55, 0.16]);
  const st0 = useWin(0.26, 0.29, 0.34, 0.38);
  const st1 = useWin(0.32, 0.35, 0.4, 0.44);
  const st2 = useWin(0.38, 0.41, 0.46, 0.5);
  const scanX = useTransform(cycle, [0.42, 0.52], [cx - 30, cx + 30], { clamp: true });
  const scanO = useTransform(cycle, [0.41, 0.44, 0.5, 0.53], [0, 0.95, 0.95, 0]);
  const flashO = useTransform(cycle, [0.54, 0.58, 0.66], [0, 1, 0]);
  const plateO = useTransform(cycle, [0.72, 0.8, 0.95, 0.99], [0, 1, 1, 0]);
  const plateY = useTransform(cycle, [0.72, 0.8], [11, 0], { clamp: true });

  const dot = (p: Pt, o: MotionValue<number>, r = 6, fill = "#aebfe0") => (
    <g>
      <motion.circle cx={p[0]} cy={p[1]} r={r + 6} fill="rgba(174,191,224,0.26)" style={{ opacity: o }} />
      <motion.circle cx={p[0]} cy={p[1]} r={r} fill={fill} style={{ opacity: o }} />
    </g>
  );
  const plate = (cx0: number, cy0: number, w = 40, h = 20) => (
    <polygon points={`${cx0},${cy0 - h} ${cx0 + w},${cy0} ${cx0},${cy0 + h} ${cx0 - w},${cy0}`} />
  );
  const chip = (fill: string, stroke: string, s = 8) => (
    <>
      <path d={`M0,${-s * 0.7} L${s},0 L0,${s * 0.7} L${-s},0 Z`} fill={fill} stroke={stroke} strokeWidth={0.8} />
      <circle r={s * 0.32} fill="#eef3fc" />
    </>
  );

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="acp-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#7f9bd0" stopOpacity="0.95" /><stop offset="100%" stopColor="#41557a" stopOpacity="0" /></radialGradient>
        <radialGradient id="acp-r" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c45b57" stopOpacity="0.95" /><stop offset="100%" stopColor="#b5524f" stopOpacity="0" /></radialGradient>
      </defs>

      {/* continuous directional flow: metadata in (steel, forward), advisory out (back) */}
      <motion.path d={meta.paths.bridge} fill="none" stroke="#aebfe0" strokeWidth={2.4} strokeDasharray="2 12" strokeLinecap="round" opacity={0.85} style={{ strokeDashoffset: bridgeFlow }} />
      <motion.path d={meta.paths.advisory} fill="none" stroke="#6f82a8" strokeWidth={1.8} strokeDasharray="2 11" strokeLinecap="round" opacity={0.6} style={{ strokeDashoffset: advFlow }} />

      {/* 1. workload pulse */}
      <motion.ellipse cx={qx} cy={qy} rx={74} ry={38} fill="url(#acp-g)" style={{ opacity: queuePulse }} />

      {/* 3. Aurelius brightens through processing */}
      <motion.ellipse cx={ax} cy={ay - 4} rx={132} ry={74} fill="url(#acp-g)" style={{ opacity: aurGlow }} />
      {/* 4. forecast / rank / filter stage dots fire in sequence */}
      {dot(stages[1], st0)}{dot(stages[2], st1)}{dot(stages[0], st2, 7, "#dbe5f7")}

      {/* 5. constraint gate scan */}
      <motion.g style={{ x: scanX, opacity: scanO }}>
        <line x1={0} y1={cy - 24} x2={0} y2={cy + 26} stroke="#bccbe8" strokeWidth={2.5} strokeLinecap="round" />
      </motion.g>

      {/* 2. metadata packet extracted, travels the bridge (with trail) */}
      <motion.g style={{ x: metaT.x, y: metaT.y }}>
        <motion.circle r={14} fill="url(#acp-g)" style={{ opacity: metaTrail }} />
        <motion.g style={{ opacity: metaHead }}>{chip("#4a608c", "#cdd9f1", 9)}</motion.g>
      </motion.g>

      {/* 6. payload attempts, hits boundary, flashes once, stays blocked */}
      <motion.g style={{ x: blkT.x, y: blkT.y, opacity: blkO }}>
        <circle r={11} fill="url(#acp-r)" />
        <circle r={6} fill="#c45b57" />
      </motion.g>
      <motion.circle cx={barX} cy={barY} r={26} fill="url(#acp-r)" style={{ opacity: flashO }} />

      {/* 7. safe advisory decision returns to scheduler */}
      <motion.g style={{ x: advT.x, y: advT.y, opacity: advO }}>
        <circle r={11} fill="url(#acp-g)" />
        {chip("#6f82a8", "#cdd9f1", 7)}
      </motion.g>

      {/* 8. audit ledger receives a new record plate */}
      <motion.g style={{ opacity: plateO, y: plateY }}>
        <g fill="rgba(90,114,160,0.62)" stroke="#aebfe0" strokeWidth={1.2}>{plate(lx, ly)}</g>
      </motion.g>
    </svg>
  );
}

export function AureliusControlPlaneIllustration() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25, rootMargin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();
  const animate = inView ? "shown" : "hidden";
  const hideLabels = useMemo(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("nolabels"), []);
  const looping = inView && !reduced;

  return (
    <figure data-acp="flagship" className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative overflow-x-auto">
        <div ref={ref} className="relative aspect-[1440/900] w-full min-w-[700px] [container-type:inline-size]">
          {/* ---- stacked authored layers (one-time reveal, then held) ---- */}
          {LAYERS.map((l) =>
            reduced ? (
              <img key={l.id} src={`${SRC}/${l.id}.svg`} alt="" aria-hidden draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none" style={{ opacity: l.rest }} />
            ) : (
              <motion.img key={l.id} src={`${SRC}/${l.id}.svg`} alt="" aria-hidden draggable={false} loading="eager" className="pointer-events-none absolute inset-0 h-full w-full select-none will-change-[transform,opacity]" custom={l} variants={layerVariants} initial="hidden" animate={animate} />
            ),
          )}

          {/* ---- looping transformation cycle ---- */}
          {looping && <FlowCycle />}

          {/* ---- HTML technical tags (hidden for the no-labels legibility test) ---- */}
          {!hideLabels && (
            <div className="pointer-events-none absolute inset-0">
              {TAGS.map((t) => (
                <motion.div key={t.text} className={`absolute ${t.mobileHide ? "hidden md:block" : ""}`} style={{ left: px(t.at[0]), top: py(t.at[1]), ...placeStyle[t.place] }}
                  initial={reduced ? false : { opacity: 0 }} animate={reduced ? { opacity: 1 } : inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.5, delay: t.primary ? 1.2 : 1.0, ease: EASE }}>
                  <div className={`whitespace-nowrap rounded-[3px] border bg-[hsl(0_0%_4%/0.76)] font-mono uppercase leading-none backdrop-blur-[1px] ${toneClass[t.tone ?? "default"]} ${t.primary ? "shadow-[0_0_0_1px_hsl(216_28%_52%/0.2)]" : ""}`} style={{ fontSize: "clamp(6px, 0.95cqw, 11px)", padding: "0.5em 0.66em", letterSpacing: "0.16em" }}>
                    {t.text}
                  </div>
                  {t.sub && (
                    <div className={`mt-1 hidden whitespace-nowrap font-mono tracking-[0.08em] text-white/34 lg:block ${t.place === "left" ? "text-right" : t.place === "right" ? "text-left" : "text-center"}`} style={{ fontSize: "clamp(6px, 0.78cqw, 9.5px)" }}>
                      {t.sub}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* ---- right-side explanation panel ---- */}
          {!hideLabels && (
            <motion.aside className="absolute right-[4.5%] top-[6%] hidden w-[24%] max-w-[300px] lg:block"
              initial={reduced ? false : { opacity: 0, y: 8 }} animate={reduced ? { opacity: 1, y: 0 } : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }} transition={{ duration: 0.7, delay: 0.4, ease: EASE }}>
              <h3 className="text-[clamp(1.05rem,1.5vw,1.4rem)] font-medium tracking-tight text-foreground">The Control Plane</h3>
              <p className="mt-3 text-[12.5px] leading-relaxed text-white/55">
                Aurelius runs beside your scheduler as a sidecar. Only metadata crosses the boundary —
                never payloads, prompts, model outputs, training data, or source code. It forecasts,
                ranks, and filters candidates, returns an advisory decision, and appends every
                counterfactual to a tamper-evident ledger.
              </p>
              <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(217_30%_72%)]">
                <span className="h-px w-4 bg-[hsl(216_28%_52%/0.6)]" aria-hidden />
                Metadata-only · advisory
              </div>
            </motion.aside>
          )}
        </div>
      </div>

      {/* ---- caption strip ---- */}
      <figcaption className="flex items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/30">
        <span className="flex items-center gap-2.5">
          <span className="h-px w-4 bg-[hsl(216_28%_52%/0.5)]" aria-hidden />
          aurelius control plane · authored isometric schematic
        </span>
        <span className="hidden tabular-nums text-white/18 sm:inline">metadata_only</span>
      </figcaption>
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[10px] tabular-nums tracking-[0.16em] text-white/22">fig.00</span>
    </figure>
  );
}
