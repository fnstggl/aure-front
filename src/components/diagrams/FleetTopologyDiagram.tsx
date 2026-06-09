import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* Diagram 3 — GPU Fleet Topology.
   Three candidate placements are evaluated in sequence: capacity-limited,
   residency-blocked, then a safe lower-cost window in US-WEST. The chosen
   path carries a flowing packet; the readout updates as the candidate
   under evaluation changes. */

const EASE = [0.16, 1, 0.3, 1] as const;

type RegionState = "idle" | "considering" | "rejected" | "selected";

const PATHS = [
  "M120,180 C220,180 250,70 356,70",
  "M120,180 C220,180 250,180 356,180",
  "M120,180 C220,180 250,290 356,290",
];

const READOUT = [
  { text: "candidate A · US-EAST — capacity limited", tone: "fail" as const },
  { text: "candidate C · EU-CENTRAL — data residency blocked", tone: "fail" as const },
  { text: "selected · US-WEST / Cluster B / H100 — −18% · sla pass", tone: "pass" as const },
];

function regionState(index: number, step: number): RegionState {
  if (index === 2) return step === 2 ? "selected" : step < 2 ? "idle" : "idle";
  if (step === index) return "considering";
  if (step > index) return "rejected";
  return "idle";
}

const strokeFor: Record<RegionState, string> = {
  idle: "hsl(0 0% 100% / 0.1)",
  considering: "hsl(218 45% 66% / 0.55)",
  rejected: "hsl(0 72% 51% / 0.4)",
  selected: "hsl(218 45% 66% / 0.7)",
};

function Region({
  x,
  y,
  code,
  clusters,
  state,
  selectedPool,
}: {
  x: number;
  y: number;
  code: string;
  clusters: { name: string; pools: string[] }[];
  state: RegionState;
  selectedPool?: string;
}) {
  const dim = state === "idle" || state === "rejected";
  return (
    <g opacity={dim ? 0.5 : 1} style={{ transition: "opacity 0.5s" }}>
      <rect
        x={x}
        y={y}
        width="300"
        height="84"
        rx="5"
        fill={state === "selected" ? "hsl(218 45% 66% / 0.05)" : "hsl(0 0% 6.5%)"}
        stroke={strokeFor[state]}
        strokeWidth="1"
      />
      <text x={x + 12} y={y + 18} className="font-mono" fontSize="10" letterSpacing="1.5" fill={state === "selected" ? "hsl(218 45% 66%)" : "hsl(0 0% 60%)"}>
        {code}
      </text>
      {state === "rejected" && (
        <g stroke="hsl(0 72% 51% / 0.8)" strokeWidth="1.4" strokeLinecap="round">
          <line x1={x + 280} y1={y + 8} x2={x + 290} y2={y + 18} />
          <line x1={x + 290} y1={y + 8} x2={x + 280} y2={y + 18} />
        </g>
      )}
      {clusters.map((c, ci) => {
        const cx = x + 12 + ci * 142;
        return (
          <g key={c.name}>
            <rect x={cx} y={y + 28} width="130" height="44" rx="3" fill="hsl(0 0% 100% / 0.018)" stroke="hsl(0 0% 100% / 0.04)" />
            <text x={cx + 8} y={y + 42} className="font-mono" fontSize="8.5" fill="hsl(0 0% 50%)">
              {c.name}
            </text>
            <g>
              {c.pools.map((p, pi) => {
                const isSel = state === "selected" && p === selectedPool;
                return (
                  <g key={p}>
                    <rect
                      x={cx + 8 + pi * 40}
                      y={y + 50}
                      width="36"
                      height="14"
                      rx="2"
                      fill={isSel ? "hsl(218 45% 66% / 0.18)" : "hsl(0 0% 100% / 0.04)"}
                      stroke={isSel ? "hsl(218 45% 66% / 0.7)" : "hsl(0 0% 100% / 0.08)"}
                    />
                    <text
                      x={cx + 8 + pi * 40 + 18}
                      y={y + 60}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="7.5"
                      fill={isSel ? "hsl(218 45% 66%)" : "hsl(0 0% 55%)"}
                    >
                      {p}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        );
      })}
    </g>
  );
}

export function FleetTopologyDiagram() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const step = useSequence(3, { enabled: inView, interval: 3600, resting: 2 });

  return (
    <div ref={ref} className="w-full p-5 md:p-7">
      <div className="overflow-x-auto">
        <svg viewBox="0 0 700 360" className="h-auto w-full min-w-[640px]" role="img" aria-label="GPU fleet topology with candidate placement paths">
          {/* candidate paths */}
          {PATHS.map((d, i) => {
            const isSelected = i === 2 && step === 2;
            const active = step === i;
            const stroke = isSelected ? "hsl(218 45% 66% / 0.85)" : active ? "hsl(218 45% 66% / 0.55)" : "hsl(0 0% 100% / 0.1)";
            return (
              <g key={d}>
                <path id={`fleet-path-${i}`} d={d} fill="none" stroke={stroke} strokeWidth="1.5" style={{ transition: "stroke 0.5s" }} />
                {(isSelected || active) && (
                  <path d={d} fill="none" stroke={isSelected ? "hsl(218 45% 66% / 0.65)" : "hsl(218 45% 66% / 0.5)"} strokeWidth="1.5" className="flow-dash" />
                )}
              </g>
            );
          })}

          {/* flowing packet on the selected path */}
          {step === 2 && !reduced && (
            <circle r="4" fill="hsl(218 45% 66%)">
              <animateMotion dur="2.4s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                <mpath href="#fleet-path-2" />
              </animateMotion>
            </circle>
          )}

          {/* workload queue source */}
          <g>
            <rect x="24" y="150" width="96" height="60" rx="5" fill="hsl(0 0% 6.5%)" stroke="hsl(0 0% 100% / 0.14)" />
            <text x="72" y="176" textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="1" fill="hsl(0 0% 70%)">
              WORKLOAD
            </text>
            <text x="72" y="190" textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="1" fill="hsl(0 0% 70%)">
              QUEUE
            </text>
            <circle cx="120" cy="180" r="2.5" fill="hsl(218 45% 66%)" />
          </g>

          <Region x={356} y={28} code="US-EAST" state={regionState(0, step)} clusters={[
            { name: "cluster-a", pools: ["A100", "L40S"] },
            { name: "cluster-b", pools: ["H100"] },
          ]} />
          <Region x={356} y={138} code="US-WEST" state={regionState(2, step)} selectedPool="H100" clusters={[
            { name: "cluster-a", pools: ["A100"] },
            { name: "cluster-b", pools: ["H100", "spot"] },
          ]} />
          <Region x={356} y={248} code="EU-CENTRAL" state={regionState(1, step)} clusters={[
            { name: "cluster-a", pools: ["H100"] },
            { name: "cluster-b", pools: ["A100", "rsv"] },
          ]} />
        </svg>
      </div>

      {/* readout */}
      <div className="mt-4 flex items-center gap-2.5">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${READOUT[step].tone === "pass" ? "bg-signal" : "bg-destructive"} anim-breathe`} aria-hidden />
        <div className="relative h-4 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className={`block font-mono text-[11px] tracking-[0.04em] ${READOUT[step].tone === "pass" ? "text-signal" : "text-white/55"}`}
            >
              {READOUT[step].text}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
