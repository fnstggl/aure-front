import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, SystemSurface, Annotation, StatusMark, C, EASE, RX, arrow } from "./plate";

/* Plate 04 — Fleet topology.
   One idea: candidate placements are explored across real fleet topology —
   region → cluster → GPU pool. Invalid regions are rejected with a reason; one
   safe lower-cost placement is selected and carried through to a single pool. */

type RState = "rejected" | "selected";

const REGIONS: {
  code: string;
  x: number;
  y: number;
  state: RState;
  clusters: { name: string; pools: { id: string; sel?: boolean }[] }[];
}[] = [
  {
    code: "US-EAST", x: 552, y: 36, state: "rejected",
    clusters: [{ name: "cluster-a", pools: [{ id: "A100" }, { id: "L40S" }] }, { name: "cluster-b", pools: [{ id: "H100" }] }],
  },
  {
    code: "US-WEST", x: 552, y: 182, state: "selected",
    clusters: [{ name: "cluster-a", pools: [{ id: "A100" }] }, { name: "cluster-b", pools: [{ id: "H100", sel: true }, { id: "spot" }] }],
  },
  {
    code: "EU-CENTRAL", x: 552, y: 328, state: "rejected",
    clusters: [{ name: "cluster-a", pools: [{ id: "H100" }] }, { name: "cluster-b", pools: [{ id: "A100" }, { id: "rsv" }] }],
  },
];

const RW = 408;
const RH = 112;

/* orthogonal fan-out from a single vertical bus at x=404 */
const PATHS = [
  "M236 250 H404 V92 H548",
  "M236 250 H404 V238 H548",
  "M236 250 H404 V384 H548",
];

const READOUT = [
  { t: "candidate · US-EAST — capacity insufficient", sel: false },
  { t: "candidate · EU-CENTRAL — data residency blocked", sel: false },
  { t: "selected · US-WEST / cluster-b / H100 — −18% · SLA pass", sel: true },
];

function Region({ r }: { r: (typeof REGIONS)[number] }) {
  const sel = r.state === "selected";
  return (
    <g style={{ transition: "opacity 0.5s" }} opacity={sel ? 1 : 0.72}>
      <SystemSurface x={r.x} y={r.y} w={RW} h={RH} state={sel ? "selected" : "rejected"} />
      <Annotation x={r.x + 18} y={r.y + 28} state={sel ? "white" : "rejected"} size={13.5} track={1.2}>{r.code}</Annotation>
      <StatusMark x={r.x + RW - 20} y={r.y + 22} kind={sel ? "pass" : "fail"} r={8} />
      {r.clusters.map((c, ci) => {
        const cx = r.x + 18 + ci * 196;
        return (
          <g key={c.name}>
            <rect x={cx} y={r.y + 42} width={180} height={56} rx={0} fill="none" stroke={sel ? C.surfaceStroke : C.lineFaint} strokeWidth="1.2" />
            <Annotation x={cx + 14} y={r.y + 60} state="dim" size={10.5} track={0.6}>{c.name}</Annotation>
            {c.pools.map((p, pi) => {
              const px = cx + 14 + pi * 58;
              return (
                <g key={p.id}>
                  <rect
                    x={px}
                    y={r.y + 68}
                    width={52}
                    height={20}
                    rx={0}
                    fill="none"
                    stroke={p.sel ? C.steelStrong : C.surfaceStroke}
                    strokeWidth={p.sel ? 2 : 1.1}
                  />
                  <Annotation x={px + 26} y={r.y + 81} anchor="middle" state={p.sel ? "white" : "neutral"} size={10} track={0.4}>{p.id}</Annotation>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

export function FleetTopologyDiagram() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const step = useSequence(3, { enabled: inView, interval: 2600, resting: 2 });

  return (
    <div ref={ref}>
      <TopologyPlate fig="fig.04" caption="region · cluster · pool placement" vb={[1000, 490]} minWidth={920}>
        {/* candidate paths — selected steel, rejected red, all with arrowheads */}
        {PATHS.map((d, i) => {
          const isSel = i === 1;
          return (
            <path
              key={d}
              d={d}
              fill="none"
              stroke={isSel ? C.steelStrong : C.redLine}
              strokeWidth={isSel ? 2.4 : 1.8}
              strokeDasharray={isSel ? undefined : "2 6"}
              opacity={isSel ? 1 : 0.55}
              markerEnd={arrow(isSel ? "steel" : "red")}
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
        <SystemSurface x={36} y={182} w={200} h={136} state="neutral" />
        <Annotation x={56} y={210} state="white" size={13} track={1}>WORKLOAD QUEUE</Annotation>
        <line x1={56} y1={222} x2={216} y2={222} stroke={C.rail} strokeWidth="1.2" />
        {[["job", "batch_infer"], ["gpus", "128×H100"], ["deadline", "4h"], ["region", "us only"]].map(([k, v], i) => (
          <g key={k}>
            <Annotation x={56} y={245 + i * 18} state="dim" size={11}>{k}</Annotation>
            <Annotation x={216} y={245 + i * 18} anchor="end" state="neutral" size={11}>{v}</Annotation>
          </g>
        ))}
        <circle cx={236} cy={250} r={3.5} fill={C.steelText} />

        {REGIONS.map((r) => <Region key={r.code} r={r} />)}

        {/* readout */}
        <foreignObject x={36} y={460} width={928} height={24}>
          <div className="flex h-full items-center gap-2.5">
            <span className="inline-block h-1.5 w-1.5" style={{ background: READOUT[step].sel ? C.steelText : C.red }} />
            <div className="relative h-4 flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4, ease: EASE }} className="block font-mono text-[11.5px]" style={{ color: READOUT[step].sel ? C.steelText : "hsl(0 0% 100% / 0.56)" }}>
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
