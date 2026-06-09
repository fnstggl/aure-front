import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, SystemSurface, Annotation, Tag, StatusMark, C, EASE } from "./plate";

/* Plate 04 — Fleet topology.
   One idea: candidate placements are explored across real fleet topology;
   invalid regions are rejected with a reason, and one safe lower-cost
   placement is selected and carried through to a GPU pool. */

type RState = "rejected" | "selected";

const REGIONS: {
  code: string;
  x: number;
  y: number;
  state: RState;
  clusters: { name: string; pools: { id: string; sel?: boolean }[] }[];
}[] = [
  {
    code: "US-EAST", x: 560, y: 40, state: "rejected",
    clusters: [{ name: "cluster-a", pools: [{ id: "A100" }, { id: "L40S" }] }, { name: "cluster-b", pools: [{ id: "H100" }] }],
  },
  {
    code: "US-WEST", x: 596, y: 186, state: "selected",
    clusters: [{ name: "cluster-a", pools: [{ id: "A100" }] }, { name: "cluster-b", pools: [{ id: "H100", sel: true }, { id: "spot" }] }],
  },
  {
    code: "EU-CENTRAL", x: 560, y: 332, state: "rejected",
    clusters: [{ name: "cluster-a", pools: [{ id: "H100" }] }, { name: "cluster-b", pools: [{ id: "A100" }, { id: "rsv" }] }],
  },
];

const RW = 400;
const RH = 108;

const PATHS = [
  "M232 250 C400 250 420 94 560 94",
  "M232 250 C420 250 470 240 596 240",
  "M232 250 C400 250 420 386 560 386",
];

const READOUT = [
  { t: "candidate · US-EAST — capacity insufficient", sel: false },
  { t: "candidate · EU-CENTRAL — data residency blocked", sel: false },
  { t: "selected · US-WEST / cluster-b / H100 — −18% · sla pass", sel: true },
];

function Region({ r }: { r: (typeof REGIONS)[number] }) {
  const sel = r.state === "selected";
  return (
    <g style={{ transition: "opacity 0.5s" }} opacity={sel ? 1 : 0.62}>
      <SystemSurface x={r.x} y={r.y} w={RW} h={RH} state={r.state} />
      <Tag x={r.x + 16} y={r.y + 24} state={sel ? "selected" : "rejected"}>{r.code}</Tag>
      <StatusMark x={r.x + RW - 18} y={r.y + 18} kind={sel ? "pass" : "fail"} r={7} />
      {r.clusters.map((c, ci) => {
        const cx = r.x + 16 + ci * 192;
        return (
          <g key={c.name}>
            <rect x={cx} y={r.y + 40} width={176} height={52} rx={4} fill="hsl(0 0% 100% / 0.014)" stroke="hsl(0 0% 100% / 0.06)" />
            <Annotation x={cx + 12} y={r.y + 58} state="dim" size={10.5} track={0.4}>{c.name}</Annotation>
            {c.pools.map((p, pi) => {
              const px = cx + 12 + pi * 56;
              return (
                <g key={p.id}>
                  <rect x={px} y={r.y + 66} width={50} height={18} rx={3} fill={p.sel ? C.steelFill : "hsl(0 0% 100% / 0.04)"} stroke={p.sel ? C.steelStrong : "hsl(0 0% 100% / 0.09)"} strokeWidth="1" />
                  <Annotation x={px + 25} y={r.y + 78} anchor="middle" state={p.sel ? "selected" : "neutral"} size={9.5} track={0.4}>{p.id}</Annotation>
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
      <TopologyPlate fig="fig.04" caption="region · cluster · pool placement" vb={[1000, 472]} minWidth={900}>
        {/* candidate paths */}
        {PATHS.map((d, i) => {
          const isSel = i === 1;
          return (
            <path key={d} d={d} fill="none" stroke={isSel ? C.steelStrong : C.redLine} strokeWidth={isSel ? 1.6 : 1.2} strokeDasharray={isSel ? undefined : "3 4"} opacity={isSel ? 0.9 : 0.4} />
          );
        })}
        {!reduced && inView && (
          <circle r="4" fill={C.steelText}>
            <animateMotion dur="2.6s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#fleet-sel" />
            </animateMotion>
          </circle>
        )}
        <path id="fleet-sel" d={PATHS[1]} fill="none" stroke="none" />

        {/* workload source plate */}
        <SystemSurface x={40} y={184} w={192} h={132} state="active" />
        <Annotation x={58} y={210} state="active" size={13} track={0.8}>WORKLOAD</Annotation>
        <line x1={58} y1={222} x2={214} y2={222} stroke={C.steelLine} strokeWidth="1" opacity={0.35} />
        {[["job", "batch_infer"], ["gpus", "128×H100"], ["deadline", "4h"], ["region", "us only"]].map(([k, v], i) => (
          <g key={k}>
            <Annotation x={58} y={244 + i * 18} state="neutral" size={11}>{k}</Annotation>
            <Annotation x={214} y={244 + i * 18} anchor="end" state="neutral" size={11}>{v}</Annotation>
          </g>
        ))}
        <circle cx={232} cy={250} r={3} fill={C.steelText} />

        {REGIONS.map((r) => <Region key={r.code} r={r} />)}

        {/* readout */}
        <foreignObject x={40} y={446} width={900} height={24}>
          <div className="flex h-full items-center gap-2.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: READOUT[step].sel ? C.steelText : C.red }} />
            <div className="relative h-4 flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4, ease: EASE }} className="block font-mono text-[11.5px]" style={{ color: READOUT[step].sel ? C.steelText : "hsl(0 0% 100% / 0.5)" }}>
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
