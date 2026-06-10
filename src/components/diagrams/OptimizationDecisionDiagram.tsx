import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, SystemSurface, Annotation, StatusMark, C, EASE, RX, arrow } from "./plate";

/* Plate 05 — Decision logic.
   One idea: many ranked candidates converge through a constraint filter into
   one safe recommendation; the unsafe candidate drops out and is recorded. */

const CANDS = [
  { id: "A", action: "run now", cost: 1.0, y: 80, verdict: "pass" as const },
  { id: "B", action: "delay 38m", cost: 0.81, y: 144, verdict: "select" as const },
  { id: "C", action: "move region", cost: 0.74, y: 208, verdict: "pass" as const },
  { id: "D", action: "delay 2h", cost: 0.62, y: 272, verdict: "fail" as const },
];

export function OptimizationDecisionDiagram() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  // steps 0-3 scan each candidate; 4-6 hold the settled verdict (longer dwell)
  const step = useSequence(7, { enabled: inView, interval: 1700, resting: 5 });
  const settled = step >= 4;

  return (
    <div ref={ref}>
      <TopologyPlate fig="fig.05" caption="ranked candidates · constraint filter · selection" vb={[1000, 420]} minWidth={860}>
        <Annotation x={40} y={44} state="dim" size={11} track={0.8}>RANKED CANDIDATES</Annotation>

        {/* candidate plates */}
        {CANDS.map((c, i) => {
          const scanning = !settled && step === i;
          const selected = settled && c.verdict === "select";
          const rejected = settled && c.verdict === "fail";
          const state = selected ? "selected" : rejected ? "rejected" : scanning ? "active" : "neutral";
          return (
            <g key={c.id} opacity={rejected ? 0.7 : 1} style={{ transition: "opacity 0.5s" }}>
              <SystemSurface x={40} y={c.y - 22} w={210} h={44} state={state} />
              <Annotation x={58} y={c.y + 4} state="dim" size={11}>{c.id}</Annotation>
              <Annotation x={80} y={c.y + 4} state={selected ? "selected" : rejected ? "rejected" : "white"} size={12}>{c.action}</Annotation>
              <rect x={80} y={c.y + 9} width={110} height={3} rx={0} fill="hsl(0 0% 100% / 0.12)" />
              <rect x={80} y={c.y + 9} width={110 * c.cost} height={3} rx={0} fill={selected ? C.steelStrong : rejected ? C.redLine : "hsl(0 0% 100% / 0.4)"} style={{ transition: "fill 0.5s" }} />
              <Annotation x={234} y={c.y + 4} anchor="end" state={selected ? "selected" : "dim"} size={11}>{c.cost.toFixed(2)}x</Annotation>
            </g>
          );
        })}

        {/* straight streams — every candidate runs into the constraint filter */}
        {CANDS.map((c) => {
          const sel = settled && c.verdict === "select";
          const fail = c.verdict === "fail";
          return (
            <line
              key={c.id}
              x1={250}
              y1={c.y}
              x2={fail ? 598 : 606}
              y2={c.y}
              stroke={fail ? C.redLine : sel ? C.steelStrong : "hsl(0 0% 100% / 0.26)"}
              strokeWidth={sel ? 2.4 : fail ? 1.8 : 1.3}
              strokeDasharray={fail ? "2 5" : undefined}
              opacity={settled && !sel && !fail ? 0.45 : 0.9}
              style={{ transition: "stroke 0.5s, opacity 0.5s" }}
            />
          );
        })}
        {/* unsafe candidate is stopped at the filter */}
        <StatusMark x={600} y={272} kind="fail" r={7} />
        <Annotation x={620} y={306} anchor="middle" state="rejected" size={11}>rejected unsafe · sla</Annotation>

        {/* constraint filter gate — outline bar */}
        <rect x={606} y={72} width={28} height={210} rx={RX} fill="none" stroke={C.steelLine} strokeWidth="2" />
        <Annotation x={620} y={60} anchor="middle" state="active" size={10.5} track={0.6}>FILTER</Annotation>

        {/* selected output → recommendation plate, straight across */}
        <line x1={634} y1={144} x2={716} y2={144} stroke={C.steelStrong} strokeWidth="2.4" opacity={settled ? 1 : 0.3} markerEnd={arrow("steel")} style={{ transition: "opacity 0.5s" }} />
        {!reduced && inView && settled && (
          <circle r="3.5" fill={C.steelText}>
            <animateMotion dur="1.6s" repeatCount="indefinite" path="M634 144 H716" />
          </circle>
        )}

        <SystemSurface x={720} y={120} w={240} h={132} state={settled ? "selected" : "neutral"} />
        <Annotation x={740} y={146} state={settled ? "active" : "dim"} size={11.5} track={0.6}>SELECTED RECOMMENDATION</Annotation>
        <line x1={740} y1={156} x2={940} y2={156} stroke={C.steelLine} strokeWidth="1" opacity={0.4} />
        {!settled && <Annotation x={740} y={196} state="dim" size={11.5}>awaiting filter…</Annotation>}
        <motion.g animate={{ opacity: settled ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
          <Annotation x={740} y={180} state="white" size={13}>delay 38m</Annotation>
          <Annotation x={940} y={180} anchor="end" state="selected" size={12}>−18%</Annotation>
          <StatusMark x={748} y={203} kind="pass" r={6} />
          <Annotation x={762} y={207} state="neutral" size={11}>sla · capacity · residency</Annotation>
          <Annotation x={740} y={232} state="dim" size={10} track={0.5}>EXPLANATION TRACE ATTACHED</Annotation>
        </motion.g>

        {/* append log rail */}
        <line x1={40} y1={384} x2={960} y2={384} stroke={C.rail} strokeWidth="1" />
        <Annotation x={40} y={406} state={settled ? "active" : "dim"} size={11} track={0.8}>APPEND · decision_candidate.selected delay_38m · sla.pass</Annotation>
      </TopologyPlate>
    </div>
  );
}
