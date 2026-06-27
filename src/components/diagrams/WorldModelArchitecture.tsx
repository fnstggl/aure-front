import { cn } from "@/lib/utils";

/* ============================================================================
   fig.01 — the predictive control architecture, drawn as a 1-bit instrument.

   Pure black plate, pure white ink — no gray, no gold. The whole thesis reads
   in five seconds, top to bottom:

     current state → world model → (forecasts) future constraints
        world model → candidate decisions → simulated outcomes
        → economic optimum → constraint gate → recommend / execute

   Aurelius simulates several candidate decisions, scores them (the bars), and
   commits the strongest — the economic optimum, drawn heavier — subject to the
   forecast future constraints, which gate the decision. Hierarchy is weight and
   fill, never value. Few labels, large type, no dense annotations.
   ============================================================================ */

const W = "#ffffff";
const SX = 206; // spine center x

/* a labelled outline station on the spine */
function Node({
  cx,
  cy,
  w,
  label,
  strong = false,
}: {
  cx: number;
  cy: number;
  w: number;
  label: string;
  strong?: boolean;
}) {
  const h = 46;
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill="none" stroke={W} strokeWidth={strong ? 2.4 : 1.4} />
      <text x={cx} y={cy + 5.5} textAnchor="middle" fontSize={15} letterSpacing="0.02em" fill={W} className="font-mono">
        {label}
      </text>
    </g>
  );
}

export function WorldModelArchitecture({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      {/* slim monospace figure label — no schematic tags, no footer strip */}
      <div className="flex items-center gap-3 border-b border-white px-4 py-2.5">
        <span className="border border-white px-1.5 py-0.5 font-mono text-[10px] tabular-nums leading-none tracking-[0.14em] text-white">
          FIG.01
        </span>
        <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.22em] text-white">
          forecast · simulate · decide
        </span>
      </div>

      <svg
        viewBox="0 0 580 548"
        className="block w-full"
        role="img"
        aria-label="Predictive control architecture. Current state feeds a world model that forecasts future constraints. From the world model, Aurelius generates candidate decisions, simulates and scores their outcomes, selects the economic optimum, passes it through a constraint gate enforced by the forecast constraints, and recommends or executes."
      >
        <defs>
          <marker id="wm-arrow" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
            <path d="M1 1.5L6.5 4.5L1 7.5" fill="none" stroke={W} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
          </marker>
        </defs>

        {/* ---------------- forecasting tier ---------------- */}
        <Node cx={SX} cy={56} w={170} label="current state" />
        <line x1={SX} y1={79} x2={SX} y2={101} stroke={W} strokeWidth={1.4} markerEnd="url(#wm-arrow)" />

        <Node cx={SX} cy={128} w={170} label="world model" />
        {/* world model forecasts → future constraints (right branch) */}
        <line x1={SX + 85} y1={128} x2={373} y2={128} stroke={W} strokeWidth={1.4} markerEnd="url(#wm-arrow)" />
        <Node cx={460} cy={128} w={174} label="future constraints" />

        <line x1={SX} y1={151} x2={SX} y2={179} stroke={W} strokeWidth={1.4} markerEnd="url(#wm-arrow)" />

        {/* ---------------- simulate tier ---------------- */}
        <Node cx={SX} cy={206} w={200} label="candidate decisions" />
        <line x1={SX} y1={229} x2={SX} y2={252} stroke={W} strokeWidth={1.4} markerEnd="url(#wm-arrow)" />

        {/* simulated outcomes — three scored candidates; the strongest is solid */}
        <text x={300} y={295} textAnchor="start" fontSize={15} letterSpacing="0.02em" fill={W} className="font-mono">
          simulated
        </text>
        <text x={300} y={314} textAnchor="start" fontSize={15} letterSpacing="0.02em" fill={W} className="font-mono">
          outcomes
        </text>
        <rect x={150} y={272} width={66} height={9} fill="none" stroke={W} strokeWidth={1.3} />
        <rect x={150} y={290} width={104} height={9} fill={W} />
        <rect x={150} y={308} width={52} height={9} fill="none" stroke={W} strokeWidth={1.3} />

        {/* the strongest outcome becomes the economic optimum */}
        <line x1={SX} y1={321} x2={SX} y2={352} stroke={W} strokeWidth={2.4} markerEnd="url(#wm-arrow)" />

        {/* ---------------- decide tier ---------------- */}
        <Node cx={SX} cy={378} w={184} label="economic optimum" strong />
        <line x1={SX} y1={401} x2={SX} y2={430} stroke={W} strokeWidth={2.4} markerEnd="url(#wm-arrow)" />

        {/* constraint gate — the forecast future constraints enforce it */}
        <g>
          <line x1={SX - 46} y1={446} x2={SX + 46} y2={446} stroke={W} strokeWidth={1.8} />
          <line x1={SX - 46} y1={438} x2={SX - 46} y2={454} stroke={W} strokeWidth={1.8} />
          <line x1={SX + 46} y1={438} x2={SX + 46} y2={454} stroke={W} strokeWidth={1.8} />
          <text x={SX + 64} y={450} textAnchor="start" fontSize={15} letterSpacing="0.02em" fill={W} className="font-mono">
            constraint gate
          </text>
        </g>
        {/* dashed feed: future constraints → constraint gate */}
        <path
          d={`M460 151 V446 H${SX + 46}`}
          fill="none"
          stroke={W}
          strokeWidth={1.2}
          strokeDasharray="2 6"
          opacity={0.85}
          markerEnd="url(#wm-arrow)"
        />

        <line x1={SX} y1={454} x2={SX} y2={486} stroke={W} strokeWidth={2.4} markerEnd="url(#wm-arrow)" />

        {/* ---------------- act ---------------- */}
        <Node cx={SX} cy={512} w={200} label="recommend / execute" strong />
      </svg>
    </figure>
  );
}
