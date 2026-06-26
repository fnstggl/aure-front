import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { TopologyPlate, Annotation, Tag, C, EASE } from "./plate";

/* Plate — Economic scheduling window.
   One idea: schedulers place flexible work by availability, not future price,
   so it runs through the daytime peak. Aurelius reads the forward price curve
   and shifts only the flexible, constraint-safe jobs into the low-cost window —
   each job visibly slides down the curve to a cheaper price point.

   Everything shares ONE time axis (00:00 → 24:00): the price curve on top, the
   job rows below. The price curve is the single sanctioned curved line on the
   whole site; every other connector stays straight / orthogonal. */

/* ---- plot frame -------------------------------------------------------- */
const PX0 = 178; // plot left (gutter holds job labels + lock/flex tags)
const PX1 = 958; // plot right
const TOP = 56; // curve top
const BASE = 234; // time axis baseline
const T_MAX = 24;
const C_MIN = 0.4;
const C_MAX = 1.25;
const tx = (t: number) => PX0 + (t / T_MAX) * (PX1 - PX0);
const cy = (c: number) => BASE - ((c - C_MIN) / (C_MAX - C_MIN)) * (BASE - TOP);

/* forward price curve, sampled (time, $/GPU-hr) — daytime peak, night trough */
const CURVE_PTS: [number, number][] = [
  [0, 0.56], [3, 0.49], [6, 0.6], [9, 0.92], [11.5, 1.14],
  [13, 1.2], [15.5, 1.06], [18, 0.76], [20.5, 0.53], [22.5, 0.47], [24, 0.5],
];

/* Catmull-Rom → cubic bezier, so the one curve stays genuinely smooth. */
function smoothPath(pts: [number, number][]) {
  let d = `M${tx(pts[0][0]).toFixed(1)} ${cy(pts[0][1]).toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [tx(p1[0]) + (tx(p2[0]) - tx(p0[0])) / 6, cy(p1[1]) + (cy(p2[1]) - cy(p0[1])) / 6];
    const c2 = [tx(p2[0]) - (tx(p3[0]) - tx(p1[0])) / 6, cy(p2[1]) - (cy(p3[1]) - cy(p1[1])) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${tx(p2[0]).toFixed(1)} ${cy(p2[1]).toFixed(1)}`;
  }
  return d;
}
const CURVE = smoothPath(CURVE_PTS);
const CURVE_FILL = `${CURVE} L${PX1} ${BASE} L${PX0} ${BASE} Z`;

const WIN_T0 = 18.5; // low-cost window start (time)

type Job = {
  label: string;
  kind: "lock" | "flex";
  start: number; // peak-time start
  low?: number; // shifted start
  dur: number; // hours
  peakC: number; // $/GPU-hr at peak slot
  lowC?: number; // $/GPU-hr in window
  row: number;
};

const JOBS: Job[] = [
  { label: "realtime", kind: "lock", start: 9, dur: 1, peakC: 0.92, row: 0 },
  { label: "batch", kind: "flex", start: 10.5, low: 19.5, dur: 2, peakC: 1.08, lowC: 0.53, row: 1 },
  { label: "training", kind: "flex", start: 12.5, low: 21, dur: 2.5, peakC: 1.2, lowC: 0.48, row: 2 },
  { label: "fine-tune", kind: "lock", start: 11.5, dur: 1.5, peakC: 1.12, row: 3 },
];

const ROW_Y = (r: number) => 290 + r * 33;
const BLK_H = 19;
const wOf = (dur: number) => (dur / T_MAX) * (PX1 - PX0);

export function QueueShiftDiagram({ fig = "fig.02", title = "economic scheduling" }: { fig?: string; title?: string } = {}) {
  const { ref, inView } = useInView();
  const mode = useSequence(2, { enabled: inView, interval: 4600, resting: 1 }); // 0 scheduler · 1 aurelius
  const on = mode === 1;

  return (
    <div ref={ref}>
      <TopologyPlate fig={fig} title={title} caption="price-aware time shifting" vb={[1000, 470]} minWidth={780}>
        {/* low-cost window band — spans curve + job rows so the link is explicit */}
        <rect
          x={tx(WIN_T0)}
          y={TOP - 12}
          width={PX1 - tx(WIN_T0)}
          height={ROW_Y(3) + 18 - (TOP - 12)}
          fill="none"
          stroke="none"
          style={{ transition: "fill 0.6s" }}
        />
        <line x1={tx(WIN_T0)} y1={TOP - 12} x2={tx(WIN_T0)} y2={ROW_Y(3) + 18} stroke={on ? C.steelLine : C.lineFaint} strokeWidth="1" strokeDasharray="2 4" style={{ transition: "stroke 0.6s" }} />

        {/* ---- cost (y) axis ---- */}
        <line x1={PX0} y1={TOP - 8} x2={PX0} y2={BASE} stroke={C.rail} strokeWidth="1" />
        {/* y-axis value labels only — gridlines removed to reduce clutter */}
        {[0.5, 0.8, 1.1].map((c) => (
          <Annotation key={c} x={PX0 - 12} y={cy(c) + 3.5} anchor="end" state="dim" size={10}>{c.toFixed(2)}</Annotation>
        ))}
        <Annotation x={PX0 - 12} y={TOP + 2} anchor="end" state="dim" size={9.5} track={0.4}>$/GPU·h</Annotation>

        {/* ---- price curve (the one sanctioned curve) ---- */}
        <path d={CURVE_FILL} fill="none" />
        <path d={CURVE} fill="none" stroke={C.line} strokeWidth="1.6" />
        <Annotation x={tx(13)} y={cy(1.2) - 12} anchor="middle" state="dim" size={10.5} track={0.6}>PEAK PRICING</Annotation>
        <Annotation x={tx(21.3)} y={TOP + 4} anchor="middle" state={on ? "active" : "dim"} size={10.5} track={0.6}>LOW-COST WINDOW</Annotation>

        {/* ---- time (x) axis ---- */}
        <line x1={PX0} y1={BASE} x2={PX1} y2={BASE} stroke={C.rail} strokeWidth="1.2" />
        {[0, 6, 12, 18, 24].map((t) => (
          <g key={t}>
            <line x1={tx(t)} y1={BASE} x2={tx(t)} y2={BASE + 5} stroke={C.rail} strokeWidth="1" />
            <Annotation x={tx(t)} y={BASE + 18} anchor="middle" state="dim" size={10}>{String(t).padStart(2, "0")}:00</Annotation>
          </g>
        ))}

        {/* ---- jobs on the shared time axis ---- */}
        {JOBS.map((job) => {
          const flex = job.kind === "flex";
          const shifted = flex && on;
          const startT = shifted ? job.low! : job.start;
          const y = ROW_Y(job.row);
          const w = wOf(job.dur);
          const priceC = shifted ? job.lowC! : job.peakC;
          const delta = flex ? Math.round((1 - job.lowC! / job.peakC) * 100) : 0;
          const curveDotX = tx(startT + job.dur / 2);

          return (
            <g key={job.label}>
              {/* row baseline */}
              <line x1={PX0} y1={y} x2={PX1} y2={y} stroke="#ffffff" strokeWidth="1" />
              <Annotation x={38} y={y + 4} state={flex ? "white" : "neutral"} size={11}>{job.label}</Annotation>
              <Tag x={PX0 - 16} y={y + 4} anchor="end" state={flex ? (on ? "active" : "neutral") : "dim"} size={9.5}>{flex ? "FLEX" : "LOCK"}</Tag>

              {flex && (
                <>
                  {/* ghost origin slot in the peak */}
                  <rect x={tx(job.start)} y={y - BLK_H / 2} width={w} height={BLK_H} fill="none" stroke="#ffffff" strokeWidth="1.1" strokeDasharray="2 3" />
                  {/* shift connector — straight, into the window */}
                  <motion.g initial={false} animate={{ opacity: shifted ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
                    <line x1={tx(job.start) + w + 5} y1={y} x2={tx(job.low!) - 7} y2={y} stroke={C.steelLine} strokeWidth="1" strokeDasharray="3 4" />
                    <path d={`M${tx(job.low!) - 13} ${y - 4} L${tx(job.low!) - 6} ${y} L${tx(job.low!) - 13} ${y + 4}`} fill="none" stroke={C.steelStrong} strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter" />
                  </motion.g>
                  {/* guide from the moving block up to its price point on the curve */}
                  <motion.line
                    x1={curveDotX}
                    x2={curveDotX}
                    y1={cy(priceC)}
                    y2={y - BLK_H / 2}
                    stroke="#ffffff"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    initial={false}
                    animate={{ x1: curveDotX, x2: curveDotX, y1: cy(priceC) }}
                    transition={{ duration: 0.95, ease: EASE }}
                  />
                  <motion.circle r="3" fill={shifted ? C.steelText : C.faint} initial={false} animate={{ cx: curveDotX, cy: cy(priceC) }} transition={{ duration: 0.95, ease: EASE }} style={{ transition: "fill 0.5s" }} />
                  {/* Δ savings tag */}
                  <motion.g initial={false} animate={{ opacity: shifted ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
                    <Annotation x={tx(job.low!) + w + 12} y={y + 4} state="selected" size={11}>−{delta}%</Annotation>
                  </motion.g>
                </>
              )}

              {/* the job block itself */}
              <motion.rect
                initial={false}
                animate={{ x: tx(startT) }}
                transition={{ duration: 0.95, ease: EASE }}
                y={y - BLK_H / 2}
                width={w}
                height={BLK_H}
                fill="none"
                stroke={flex ? (shifted ? C.steelStrong : C.steelLine) : C.surfaceStroke}
                strokeWidth={flex ? 1.6 : 1.3}
                style={{ transition: "stroke 0.6s" }}
              />
            </g>
          );
        })}

        {/* ---- mode readout ---- */}
        <line x1={PX0} y1={433} x2={PX1} y2={433} stroke={C.rail} strokeWidth="1" />
        <circle cx={48} cy={452} r={3} fill={on ? C.steelText : C.faint} />
        <foreignObject x={66} y={440} width={890} height={26}>
          <div className="h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="font-mono text-[12px]"
                style={{ color: on ? C.steelText : C.dim }}
              >
                {on
                  ? "aurelius · 2 flexible jobs shifted into low-cost window · locked jobs untouched · shadow counterfactual"
                  : "scheduler · flexible jobs run through the daytime peak by availability, not price"}
              </motion.div>
            </AnimatePresence>
          </div>
        </foreignObject>
      </TopologyPlate>
    </div>
  );
}
