import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, SystemSurface, Annotation, Tag, StatusMark, C, EASE } from "./plate";

/* Plate 01 — Scheduler Interception.
   One idea: Aurelius is a sidecar control plane, not a replacement. The
   execution rail (queue → scheduler → execution) runs unchanged on top;
   only metadata branches down to Aurelius, which returns an advisory
   decision. Payload never crosses. Outcomes append to a lower ledger. */

const META_PATH = "M406 182 C406 214 406 214 406 246";
const ADVISORY_PATH = "M598 250 C660 250 636 142 690 142";

export function SchedulerInterceptionDiagram() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const step = useSequence(5, { enabled: inView, interval: 2600, resting: 2 });
  const decided = step >= 2;

  return (
    <div ref={ref}>
      <TopologyPlate fig="fig.01" caption="scheduler interception · control plane" vb={[1000, 466]} minWidth={820}>
        {/* ---- execution rail (top) ---- */}
        <line x1="232" y1="142" x2="300" y2="142" stroke={C.rail} strokeWidth="1.4" />
        <line x1="512" y1="142" x2="690" y2="142" stroke={C.rail} strokeWidth="1.4" />
        <line x1="690" y1="142" x2="760" y2="142" stroke={C.rail} strokeWidth="1.4" />

        <SystemSurface x={44} y={104} w={188} h={76} state={step === 0 ? "active" : "neutral"} />
        <Annotation x={64} y={138} state={step === 0 ? "active" : "white"} size={14} track={1}>WORKLOAD QUEUE</Annotation>
        <Annotation x={64} y={158} state="dim" size={11.5}>job metadata · timing</Annotation>

        <SystemSurface x={300} y={104} w={212} h={76} state={step === 1 ? "active" : "neutral"} />
        <Annotation x={320} y={138} state={step === 1 ? "active" : "white"} size={14} track={1}>EXISTING SCHEDULER</Annotation>
        <Annotation x={320} y={158} state="dim" size={11.5}>availability · fairness</Annotation>

        <SystemSurface x={760} y={104} w={196} h={76} state={step === 3 ? "active" : "neutral"} />
        <Annotation x={780} y={138} state={step === 3 ? "active" : "white"} size={14} track={1}>EXECUTION LAYER</Annotation>
        <Annotation x={780} y={158} state="dim" size={11.5}>execution unchanged</Annotation>

        <Tag x={406} y={198} anchor="middle" state="dim">SCHEDULER REMAINS AUTHORITY</Tag>

        {/* ---- metadata branch (down to Aurelius) ---- */}
        <path d={META_PATH} fill="none" stroke={C.steelLine} strokeWidth="1.4" opacity={decided ? 1 : 0.5} style={{ transition: "opacity 0.5s" }} />
        <Annotation x={416} y={228} state="active" size={11} track={0.6}>metadata only</Annotation>

        {/* ---- advisory return (up to rail) ---- */}
        <path d={ADVISORY_PATH} fill="none" stroke={C.steelLine} strokeWidth="1.4" strokeDasharray="3 4" opacity={step >= 3 ? 1 : 0.4} style={{ transition: "opacity 0.5s" }} />
        <Annotation x={648} y={196} state={step >= 3 ? "active" : "dim"} size={11} track={0.6}>advisory decision</Annotation>

        {/* ---- payload tap → blocked ---- */}
        <line x1="724" y1="142" x2="724" y2="214" stroke={C.rail} strokeWidth="1.2" strokeDasharray="2 4" opacity={0.5} />
        <StatusMark x={724} y={224} kind="fail" r={8} />
        <Annotation x={742} y={228} state="rejected" size={11} track={0.6}>no payload access</Annotation>

        {/* ---- Aurelius control plane (sidecar) ---- */}
        <SystemSurface x={300} y={246} w={300} h={132} state={decided ? "selected" : "active"} rx={7} />
        <Annotation x={320} y={274} state="active" size={13.5} track={1}>AURELIUS CONTROL LAYER</Annotation>
        <line x1="320" y1="286" x2="580" y2="286" stroke={C.steelLine} strokeWidth="1" opacity={0.4} />

        <motion.g animate={{ opacity: decided ? 0 : 1 }} transition={{ duration: 0.4, ease: EASE }}>
          <Annotation x={320} y={330} state="dim" size={12.5}>evaluating candidates…</Annotation>
        </motion.g>
        <motion.g animate={{ opacity: decided ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
          <Annotation x={320} y={310} state="neutral" size={12}>forecast</Annotation>
          <Annotation x={580} y={310} anchor="end" state="active" size={12}>−38m window</Annotation>
          <Annotation x={320} y={332} state="neutral" size={12}>selected</Annotation>
          <Annotation x={580} y={332} anchor="end" state="selected" size={12}>delay batch</Annotation>
          <Annotation x={320} y={354} state="neutral" size={12}>rejected</Annotation>
          <g opacity={0.85}>
            <Annotation x={580} y={354} anchor="end" state="rejected" size={12}>delay 2h</Annotation>
            <line x1="520" y1="350" x2="580" y2="350" stroke={C.red} strokeWidth="1" />
          </g>
        </motion.g>

        {/* metadata packet */}
        {inView && !reduced && (
          <circle r="3.5" fill={C.steelText}>
            <animateMotion dur="2.6s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.35;0.7;1" calcMode="linear">
              <mpath href="#sched-meta" />
            </animateMotion>
          </circle>
        )}
        <path id="sched-meta" d={META_PATH} fill="none" stroke="none" />

        {/* ---- audit ledger rail (bottom) ---- */}
        <line x1="300" y1="418" x2="956" y2="418" stroke={C.rail} strokeWidth="1" />
        <Annotation x={44} y={422} state={step === 4 ? "active" : "dim"} size={11.5} track={1}>APPEND-ONLY LOG</Annotation>
        {[340, 470, 600, 730, 860].map((x, i) => (
          <g key={x}>
            <rect x={x} y={412} width={84} height={12} rx={2} fill={step === 4 ? C.steelFillSoft : C.plane} stroke={step === 4 && i === 4 ? C.steelStrong : C.planeStroke} strokeWidth="1" style={{ transition: "all 0.5s" }} />
          </g>
        ))}
      </TopologyPlate>
    </div>
  );
}
