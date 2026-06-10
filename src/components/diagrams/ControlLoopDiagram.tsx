import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, Annotation, C, EASE, RX } from "./plate";

/* Plate 03 — Control loop.
   One idea: a deterministic closed loop. A single packet steps along a straight
   line through observe → forecast → decide → filter → log, lighting the active
   station, then returns to the start. No dashboard, no orbit — just the cycle.
   Passes the no-label test: five nodes on a line, one moving dot, a return arc. */

const STATIONS = [
  { key: "observe", label: "OBSERVE", note: "Read scheduler metadata — timing, resources, constraints." },
  { key: "forecast", label: "FORECAST", note: "Forecast cost & carbon with explicit uncertainty bounds." },
  { key: "decide", label: "DECIDE", note: "Rank run / delay / relocate by expected economics." },
  { key: "filter", label: "FILTER", note: "Reject any candidate that violates a hard constraint." },
  { key: "log", label: "LOG", note: "Record the decision and outcome — append-only." },
];

const CX = [104, 302, 500, 698, 896];
const RAIL_Y = 104;
const NW = 154;
const NH = 56;
const RB = RAIL_Y + NH / 2; // block bottom
/* orthogonal return: down from LOG, straight across, up into OBSERVE */
const RETURN = `M${CX[4]} ${RB} V206 H${CX[0]} V${RB}`;

export function ControlLoopDiagram() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const step = useSequence(STATIONS.length, { enabled: inView, interval: 2000, resting: 2 });

  return (
    <div ref={ref}>
      <TopologyPlate fig="fig.03" caption="deterministic control loop" vb={[1000, 268]} minWidth={720}>
        {/* base rail through every station */}
        <line x1={CX[0]} y1={RAIL_Y} x2={CX[4]} y2={RAIL_Y} stroke={C.rail} strokeWidth="1.4" />
        {/* completed portion of the rail, up to the active station */}
        <motion.line
          y1={RAIL_Y}
          y2={RAIL_Y}
          x1={CX[0]}
          x2={CX[0]}
          stroke={C.steelStrong}
          strokeWidth="1.6"
          initial={false}
          animate={{ x2: CX[step] }}
          transition={{ type: "spring", stiffness: 150, damping: 24 }}
        />

        {/* return arc — the loop closes back to observe */}
        <path d={RETURN} fill="none" stroke={C.rail} strokeWidth="1.2" strokeDasharray="3 6" opacity={0.7} />
        {!reduced && inView && (
          <path d={RETURN} fill="none" stroke={C.steelLine} strokeWidth="1.2" strokeDasharray="3 9" className="flow-dash" opacity={0.55} />
        )}
        <path
          d={`M${CX[0] - 5} ${RB + 12} L${CX[0]} ${RB + 2} L${CX[0] + 5} ${RB + 12}`}
          fill="none"
          stroke={C.steelLine}
          strokeWidth="1.4"
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity={0.8}
        />

        {/* stations */}
        {STATIONS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <g key={s.key} style={{ transition: "opacity 0.5s" }} opacity={active ? 1 : done ? 0.82 : 0.55}>
              <rect
                x={CX[i] - NW / 2}
                y={RAIL_Y - NH / 2}
                width={NW}
                height={NH}
                rx={RX}
                fill={active ? C.steelFill : C.surface}
                stroke={active ? C.steelStrong : C.surfaceStroke}
                strokeWidth={active ? 2 : 1.4}
                style={{ transition: "fill 0.5s, stroke 0.5s" }}
              />
              <Annotation x={CX[i]} y={RAIL_Y - 4} anchor="middle" state="dim" size={10} track={0.6}>
                {String(i + 1).padStart(2, "0")}
              </Annotation>
              <Annotation x={CX[i]} y={RAIL_Y + 15} anchor="middle" state={active ? "active" : "neutral"} size={12.5} track={1}>
                {s.label}
              </Annotation>
            </g>
          );
        })}

        {/* single traveling packet */}
        <motion.circle
          r="5"
          cx={CX[0]}
          cy={RAIL_Y}
          fill={C.steelText}
          initial={false}
          animate={{ cx: CX[step] }}
          transition={{ type: "spring", stiffness: 150, damping: 24 }}
        />

        {/* one calm line of context for the active station */}
        <foreignObject x={60} y={236} width={880} height={26}>
          <div className="flex h-full items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={step}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="font-mono text-[12.5px]"
                style={{ color: C.steelText }}
              >
                {STATIONS[step].note}
              </motion.span>
            </AnimatePresence>
          </div>
        </foreignObject>
      </TopologyPlate>
    </div>
  );
}
