import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, SystemSurface, Annotation, StatusMark, C, EASE, RX, arrow } from "./plate";

/* Plate — Decision logic.
   One idea: candidates are ranked cheapest-first, every one runs through the
   constraint filter, the cheapest UNSAFE option is rejected with its reason,
   and the cheapest option that clears every gate is selected. The remaining
   safe-but-pricier options are resolved as feasible alternatives — nothing
   dead-ends, and the selection rule is legible. */

type Verdict = "fail" | "select" | "pass";
const CANDS: { id: string; rank: number; action: string; mult: number; y: number; verdict: Verdict }[] = [
  { id: "D", rank: 1, action: "delay 2h", mult: 0.62, y: 80, verdict: "fail" }, // cheapest, but unsafe
  { id: "B", rank: 2, action: "delay 38m", mult: 0.74, y: 152, verdict: "select" }, // cheapest safe → selected
  { id: "C", rank: 3, action: "move region", mult: 0.85, y: 224, verdict: "pass" },
  { id: "A", rank: 4, action: "run now", mult: 1.0, y: 296, verdict: "pass" },
];

const PLATE_R = 280; // candidate plate right edge
const FX = 560; // filter left edge
const FW = 26;
const CARD_X = 648;

export function OptimizationDecisionDiagram({ fig = "fig.05", title = "decision logic" }: { fig?: string; title?: string } = {}) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  // steps 0-3 scan each candidate; 4-6 hold the settled verdict
  const step = useSequence(7, { enabled: inView, interval: 1500, resting: 5 });
  const settled = step >= 4;
  const selY = CANDS.find((c) => c.verdict === "select")!.y;

  return (
    <div ref={ref}>
      <TopologyPlate fig={fig} title={title} caption="ranked candidates · constraint filter · selection" vb={[1000, 430]} minWidth={880}>
        <Annotation x={40} y={44} state="dim" size={10.5} track={0.7}>RANKED · CHEAPEST FIRST</Annotation>

        {/* ---- candidate plates ---- */}
        {CANDS.map((c, i) => {
          const scanning = !settled && step === i;
          const selected = settled && c.verdict === "select";
          const rejected = settled && c.verdict === "fail";
          const state = selected ? "selected" : rejected ? "rejected" : scanning ? "active" : "neutral";
          const barW = 116 * c.mult;
          return (
            <g key={c.id} opacity={rejected ? 0.78 : 1} style={{ transition: "opacity 0.5s" }}>
              <SystemSurface x={40} y={c.y - 24} w={240} h={48} state={state} />
              {/* rank chip */}
              <rect x={54} y={c.y - 9} width={18} height={18} rx={0} fill="none" stroke={C.lineFaint} strokeWidth="1" />
              <Annotation x={63} y={c.y + 4} anchor="middle" state="dim" size={10.5}>{c.rank}</Annotation>
              <Annotation x={86} y={c.y - 3} state={selected ? "selected" : rejected ? "rejected" : "white"} size={12}>{c.action}</Annotation>
              {/* cost bar — shorter = cheaper */}
              <rect x={86} y={c.y + 9} width={116} height={3} rx={0} fill="hsl(0 0% 100% / 0.12)" />
              <rect x={86} y={c.y + 9} width={barW} height={3} rx={0} fill={selected ? C.steelStrong : rejected ? C.redLine : "hsl(0 0% 100% / 0.42)"} style={{ transition: "fill 0.5s" }} />
              <Annotation x={264} y={c.y + 4} anchor="end" state={selected ? "selected" : "dim"} size={11}>{c.mult.toFixed(2)}×</Annotation>

              {/* stream into the filter */}
              <line
                x1={PLATE_R}
                y1={c.y}
                x2={rejected ? FX - 14 : FX}
                y2={c.y}
                stroke={rejected ? C.redLine : selected ? C.steelStrong : "hsl(0 0% 100% / 0.28)"}
                strokeWidth={selected ? 2.4 : rejected ? 1.7 : 1.3}
                strokeDasharray={rejected ? "2 5" : undefined}
                opacity={settled && !selected && !rejected ? 0.5 : 0.92}
                style={{ transition: "stroke 0.5s, opacity 0.5s" }}
              />
            </g>
          );
        })}

        {/* unsafe candidate stopped at the gate */}
        <g opacity={settled ? 1 : 0} style={{ transition: "opacity 0.5s" }}>
          <StatusMark x={FX - 14} y={80} kind="fail" r={7} />
          <Annotation x={FX - 26} y={112} anchor="end" state="rejected" size={10.5}>rejected · fails sla (deadline 4h)</Annotation>
        </g>

        {/* ---- constraint filter gate ---- */}
        <rect x={FX} y={56} width={FW} height={264} rx={RX} fill="none" stroke={C.steelLine} strokeWidth="2" />
        <Annotation x={FX + FW / 2} y={44} anchor="middle" state="active" size={10} track={0.5}>CONSTRAINT FILTER</Annotation>

        {/* ---- selected output → recommendation card ---- */}
        <line x1={FX + FW} y1={selY} x2={CARD_X} y2={selY} stroke={C.steelStrong} strokeWidth="2.4" opacity={settled ? 1 : 0.3} markerEnd={arrow("steel")} style={{ transition: "opacity 0.5s" }} />
        {!reduced && inView && settled && (
          <circle r="3.5" fill={C.steelText}>
            <animateMotion dur="1.6s" repeatCount="indefinite" path={`M${FX + FW} ${selY} H${CARD_X}`} />
          </circle>
        )}

        <SystemSurface x={CARD_X} y={92} w={312} h={132} state={settled ? "selected" : "neutral"} />
        <Annotation x={CARD_X + 18} y={118} state={settled ? "active" : "dim"} size={11.5} track={0.6}>SELECTED RECOMMENDATION</Annotation>
        <line x1={CARD_X + 18} y1={128} x2={CARD_X + 294} y2={128} stroke={C.steelLine} strokeWidth="1" opacity={0.4} />
        {!settled && <Annotation x={CARD_X + 18} y={170} state="dim" size={11.5}>awaiting filter…</Annotation>}
        <motion.g animate={{ opacity: settled ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
          <Annotation x={CARD_X + 18} y={154} state="white" size={13}>delay 38m</Annotation>
          <Annotation x={CARD_X + 294} y={154} anchor="end" state="selected" size={12}>−26%</Annotation>
          <StatusMark x={CARD_X + 26} y={177} kind="pass" r={6} />
          <Annotation x={CARD_X + 40} y={181} state="neutral" size={11}>sla · capacity · residency</Annotation>
          <Annotation x={CARD_X + 18} y={208} state="dim" size={10} track={0.4}>CHEAPEST CANDIDATE THAT CLEARS EVERY GATE</Annotation>
        </motion.g>

        {/* ---- feasible alternatives (the safe-but-pricier passes resolve here) ---- */}
        {/* short elbows from the filter merge the two passing candidates downward */}
        <g opacity={settled ? 0.6 : 0} style={{ transition: "opacity 0.5s" }}>
          <path d={`M${FX + FW} 224 H612 V268`} fill="none" stroke="hsl(0 0% 100% / 0.26)" strokeWidth="1.2" />
          <path d={`M${FX + FW} 296 H612 V268`} fill="none" stroke="hsl(0 0% 100% / 0.26)" strokeWidth="1.2" />
          <line x1={612} y1={268} x2={CARD_X} y2={268} stroke="hsl(0 0% 100% / 0.26)" strokeWidth="1.2" markerEnd={arrow("rail")} />
        </g>
        <SystemSurface x={CARD_X} y={240} w={312} h={84} state="dim" />
        <Annotation x={CARD_X + 18} y={264} state="dim" size={10.5} track={0.5}>ALSO FEASIBLE · CLEARED GATES, HIGHER COST</Annotation>
        {[["move region", "0.85×"], ["run now", "1.00×"]].map(([a, m], i) => (
          <g key={a}>
            <Annotation x={CARD_X + 18} y={290 + i * 20} state="neutral" size={11}>{a}</Annotation>
            <Annotation x={CARD_X + 294} y={290 + i * 20} anchor="end" state="dim" size={11}>{m}</Annotation>
          </g>
        ))}

        {/* ---- append log rail ---- */}
        <line x1={40} y1={392} x2={960} y2={392} stroke={C.rail} strokeWidth="1" />
        <Annotation x={40} y={414} state={settled ? "active" : "dim"} size={11} track={0.7}>APPEND · candidate.selected delay_38m 0.74× · 3 feasible · 1 rejected (sla)</Annotation>
      </TopologyPlate>
    </div>
  );
}
