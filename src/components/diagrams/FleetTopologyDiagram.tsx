import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, SystemSurface, Annotation, Tag, StatusMark, C, EASE } from "./plate";

/* Plate 04 — Fleet topology.
   One idea: one workload, three candidate regions. Aurelius selects the single
   safe lower-cost placement and rejects the rest with a reason. No tiny pool
   tables — region, result, and one selected path is the whole story. */

type RState = "rejected" | "selected";

const REGIONS: { code: string; sub: string; result: string; state: RState; y: number; py: number }[] = [
  { code: "US-EAST", sub: "4 GPU clusters · H100 / A100", result: "capacity insufficient", state: "rejected", y: 44, py: 92 },
  { code: "US-WEST", sub: "3 GPU clusters · H100 / spot", result: "−18% cost · SLA pass", state: "selected", y: 172, py: 220 },
  { code: "EU-CENTRAL", sub: "5 GPU clusters · A100", result: "data residency blocked", state: "rejected", y: 300, py: 348 },
];

const RW = 340;
const RH = 96;
const RX = 620;

const PATHS = [
  "M244 228 C420 228 440 92 620 92",
  "M244 228 C430 228 470 220 620 220",
  "M244 228 C420 228 440 348 620 348",
];

const READOUT = [
  { t: "candidate · US-EAST — capacity insufficient", sel: false },
  { t: "candidate · EU-CENTRAL — data residency blocked", sel: false },
  { t: "selected · US-WEST · H100 pool — −18% · SLA pass", sel: true },
];

function Region({ r }: { r: (typeof REGIONS)[number] }) {
  const sel = r.state === "selected";
  return (
    <g style={{ transition: "opacity 0.5s" }} opacity={sel ? 1 : 0.66}>
      <SystemSurface x={RX} y={r.y} w={RW} h={RH} state={r.state} />
      <Tag x={RX + 20} y={r.y + 30} state={sel ? "selected" : "rejected"}>
        {r.code}
      </Tag>
      <StatusMark x={RX + RW - 22} y={r.y + 24} kind={sel ? "pass" : "fail"} r={8} />
      <Annotation x={RX + 20} y={r.y + 54} state="dim" size={11.5}>
        {r.sub}
      </Annotation>
      <Annotation x={RX + 20} y={r.y + 76} state={sel ? "selected" : "rejected"} size={11.5} track={0.4}>
        {r.result}
      </Annotation>
    </g>
  );
}

export function FleetTopologyDiagram() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const step = useSequence(3, { enabled: inView, interval: 2600, resting: 2 });

  return (
    <div ref={ref}>
      <TopologyPlate fig="fig.04" caption="region placement · one selected path" vb={[1000, 444]} minWidth={820}>
        {/* candidate paths */}
        {PATHS.map((d, i) => {
          const isSel = i === 1;
          return (
            <path
              key={d}
              d={d}
              fill="none"
              stroke={isSel ? C.steelStrong : C.redLine}
              strokeWidth={isSel ? 1.8 : 1.2}
              strokeDasharray={isSel ? undefined : "3 5"}
              opacity={isSel ? 0.95 : 0.45}
            />
          );
        })}
        {!reduced && inView && (
          <circle r="4.5" fill={C.steelText}>
            <animateMotion dur="2.6s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#fleet-sel" />
            </animateMotion>
          </circle>
        )}
        <path id="fleet-sel" d={PATHS[1]} fill="none" stroke="none" />

        {/* workload source plate */}
        <SystemSurface x={44} y={168} w={200} h={120} state="active" />
        <Annotation x={64} y={196} state="active" size={13.5} track={0.8}>
          WORKLOAD
        </Annotation>
        <line x1={64} y1={208} x2={224} y2={208} stroke={C.steelLine} strokeWidth="1" opacity={0.35} />
        {[
          ["job", "batch_infer"],
          ["gpus", "128×H100"],
          ["deadline", "4h"],
          ["region", "us only"],
        ].map(([k, v], i) => (
          <g key={k}>
            <Annotation x={64} y={230 + i * 18} state="neutral" size={11}>
              {k}
            </Annotation>
            <Annotation x={224} y={230 + i * 18} anchor="end" state="neutral" size={11}>
              {v}
            </Annotation>
          </g>
        ))}
        <circle cx={244} cy={228} r={3} fill={C.steelText} />

        {REGIONS.map((r) => (
          <Region key={r.code} r={r} />
        ))}

        {/* readout */}
        <foreignObject x={44} y={418} width={912} height={24}>
          <div className="flex h-full items-center gap-2.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: READOUT[step].sel ? C.steelText : C.red }}
            />
            <div className="relative h-4 flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="block font-mono text-[11.5px]"
                  style={{ color: READOUT[step].sel ? C.steelText : "hsl(0 0% 100% / 0.5)" }}
                >
                  {READOUT[step].t}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </foreignObject>
      </TopologyPlate>
    </div>
  );
}
