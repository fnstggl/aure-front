import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { TopologyPlate, Annotation, Tag, C, EASE } from "./plate";

/* Plate 02 — Price / scheduling window.
   One idea: schedulers place flexible work by availability, not future
   economics, so it runs through peak pricing. Aurelius shifts only the
   flexible, constraint-safe jobs into the low-cost window. */

type Job = { label: string; locked: boolean; peakX: number; lowX: number; w: number; y: number };

const JOBS: Job[] = [
  { label: "realtime", locked: true, peakX: 250, lowX: 250, w: 70, y: 214 },
  { label: "batch", locked: false, peakX: 300, lowX: 700, w: 130, y: 256 },
  { label: "training", locked: false, peakX: 360, lowX: 760, w: 96, y: 298 },
  { label: "fine-tune", locked: true, peakX: 300, lowX: 300, w: 60, y: 340 },
];

const CURVE = "M60 132 C180 130 235 56 320 60 C430 66 520 150 700 150 C800 150 880 132 945 132";
const CURVE_FILL = `${CURVE} L945 176 L60 176 Z`;

export function QueueShiftDiagram() {
  const { ref, inView } = useInView();
  const mode = useSequence(2, { enabled: inView, interval: 4600, resting: 1 }); // 0 scheduler, 1 aurelius

  return (
    <div ref={ref}>
      <TopologyPlate fig="fig.02" caption="economic scheduling window" vb={[1000, 410]} minWidth={760}>
        {/* low-cost window zone */}
        <rect x={640} y={40} width={250} height={350} fill={mode === 1 ? C.steelFillSoft : "hsl(0 0% 100% / 0.012)"} stroke="none" style={{ transition: "fill 0.6s" }} />
        <line x1={640} y1={40} x2={640} y2={390} stroke={C.steelLine} strokeWidth="1" strokeDasharray="2 4" opacity={0.5} />

        {/* cost curve on recessed time plane */}
        <path d={CURVE_FILL} fill="hsl(0 0% 100% / 0.03)" />
        <path d={CURVE} fill="none" stroke={C.faint} strokeWidth="1.4" />
        <Annotation x={300} y={74} anchor="middle" state="dim" size={11} track={0.8}>PEAK PRICING</Annotation>
        <Annotation x={765} y={74} anchor="middle" state={mode === 1 ? "active" : "dim"} size={11} track={0.8}>LOW-COST WINDOW</Annotation>

        {/* job tracks */}
        {JOBS.map((job) => {
          const x = mode === 1 ? job.lowX : job.peakX;
          const shifted = !job.locked && mode === 1;
          const fill = job.locked ? "hsl(0 0% 100% / 0.05)" : shifted ? C.steelFill : "hsl(0 0% 100% / 0.07)";
          const stroke = job.locked ? C.surfaceStroke : shifted ? C.steelStrong : C.faint;
          return (
            <g key={job.label}>
              <line x1={200} y1={job.y} x2={945} y2={job.y} stroke="hsl(0 0% 100% / 0.05)" strokeWidth="1" />
              <Annotation x={44} y={job.y + 4} state="neutral" size={12}>{job.label}</Annotation>
              <Tag x={150} y={job.y + 4} state="dim" anchor="end">{job.locked ? "LOCK" : "FLEX"}</Tag>
              {!job.locked && (
                <rect x={job.peakX} y={job.y - 11} width={job.w} height={22} rx={3} fill="none" stroke="hsl(0 0% 100% / 0.08)" strokeDasharray="2 3" />
              )}
              <motion.rect
                initial={false}
                animate={{ x }}
                transition={{ duration: 0.95, ease: EASE }}
                y={job.y - 11}
                width={job.w}
                height={22}
                rx={3}
                fill={fill}
                stroke={stroke}
                strokeWidth="1"
                style={{ transition: "fill 0.6s, stroke 0.6s" }}
              />
            </g>
          );
        })}

        {/* mode readout */}
        <circle cx={50} cy={384} r={3} fill={mode === 1 ? C.steelText : C.faint} />
        <foreignObject x={68} y={372} width={830} height={26}>
          <div className="h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="font-mono text-[12.5px]"
                style={{ color: mode === 1 ? C.steelText : C.dim }}
              >
                {mode === 1
                  ? "aurelius · flexible jobs shifted to low-cost window · shadow counterfactual"
                  : "scheduler · flexible jobs run through peak pricing"}
              </motion.div>
            </AnimatePresence>
          </div>
        </foreignObject>
      </TopologyPlate>
    </div>
  );
}
