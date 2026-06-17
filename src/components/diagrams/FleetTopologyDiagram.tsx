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

/* The selected region (US-WEST) is level with the queue, so its path is a
   single straight line — no mid-line kink. Rejected regions branch cleanly
   off one vertical bus that leaves the selected line at a marked node. */
const BUS_X = 404;
const QY = 238; // queue exit + selected path Y == US-WEST row center
const SEL_PATH = `M236 ${QY} H548`;
const REJ_PATHS = [
  `M236 ${QY} H${BUS_X} V92 H548`,
  `M236 ${QY} H${BUS_X} V384 H548`,
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

export function FleetTopologyDiagram({ fig = "fig.04", title = "fleet topology" }: { fig?: string; title?: string } = {}) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const step = useSequence(3, { enabled: inView, interval: 2600, resting: 2 });

  return (
    <div ref={ref}>
      <TopologyPlate fig={fig} title={title} caption="region · cluster · pool placement" vb={[1000, 490]} minWidth={920}>
        {/* rejected candidate paths — dim red, drawn first so the selected line sits on top */}
        {REJ_PATHS.map((d) => (
          <path key={d} d={d} fill="none" stroke={C.redLine} strokeWidth={1.6} strokeDasharray="2 6" opacity={0.5} markerEnd={arrow("red")} />
        ))}
        {/* selected path — bright, straight, on top */}
        <path d={SEL_PATH} fill="none" stroke={C.steelStrong} strokeWidth={2.4} markerEnd={arrow("steel")} />
        {/* branch node where the rejected bus leaves the selected line */}
        <circle cx={BUS_X} cy={QY} r={3} fill={C.steelText} />
        {!reduced && inView && (
          <circle r="4.5" fill={C.steelText}>
            <animateMotion dur="2.6s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#fleet-sel" />
            </animateMotion>
          </circle>
        )}
        <path id="fleet-sel" d={SEL_PATH} fill="none" stroke="none" />

        {/* workload source plate — centered on the selected (US-WEST) row */}
        <SystemSurface x={36} y={170} w={200} h={136} state="neutral" />
        <Annotation x={56} y={198} state="white" size={13} track={1}>WORKLOAD QUEUE</Annotation>
        <line x1={56} y1={210} x2={216} y2={210} stroke={C.rail} strokeWidth="1.2" />
        {[["job", "batch_infer"], ["gpus", "128×H100"], ["deadline", "4h"], ["region", "us only"]].map(([k, v], i) => (
          <g key={k}>
            <Annotation x={56} y={233 + i * 18} state="dim" size={11}>{k}</Annotation>
            <Annotation x={216} y={233 + i * 18} anchor="end" state="neutral" size={11}>{v}</Annotation>
          </g>
        ))}
        <circle cx={236} cy={238} r={3.5} fill={C.steelText} />

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
