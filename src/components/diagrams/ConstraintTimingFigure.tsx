import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.03 — constraint timing: why scheduling mistakes are invisible.

   A 1-bit table. Two columns: T=0 (when the scheduler commits) and T+Δ (when
   the job runs). Every constraint reads ✓ at decision time. By execution time,
   four constraints have shifted. The committed decision is now suboptimal.
   No annotation needed — the contrast between ✓ and ↑↓ makes the point.
   ============================================================================ */

const W = "#ffffff";

const ROWS = [
  { label: "POWER COST",  after: "↑ +121%" },
  { label: "CAPACITY",    after: "↓  −25%" },
  { label: "QUEUE DEPTH", after: "↑    ×3" },
  { label: "DEMAND",      after: "↑  SPIKE" },
];

const LX = 40;    // label col start
const CA = 246;   // T=0 col center
const DX = 274;   // divider x
const CB = 292;   // T+Δ col start
const ROW_Y = [104, 130, 156, 182];

export function ConstraintTimingFigure({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.03" title="constraint timing" />
      <div className="relative">
        <svg
          viewBox="0 0 540 236"
          className="relative block w-full"
          role="img"
          aria-label="Table showing four constraints — power cost, capacity, queue depth, demand — all passing checks at T=0 when a job is scheduled. At T+delta when the job executes: power cost up 121%, capacity down 25%, queue depth tripled, demand spike. The committed decision is now suboptimal."
        >
          {/* Column headers */}
          <text x={LX} y={46} fontSize={10} letterSpacing="0.16em" fill={W} fillOpacity={0.45} className="font-mono">
            CONSTRAINT
          </text>
          <text x={CA} y={46} fontSize={10} letterSpacing="0.14em" fill={W} fillOpacity={0.45} textAnchor="middle" className="font-mono">
            T=0
          </text>
          <text x={CB} y={46} fontSize={10} letterSpacing="0.14em" fill={W} fillOpacity={0.45} className="font-mono">
            T+Δ
          </text>

          <text x={LX} y={60} fontSize={9.5} letterSpacing="0.1em" fill={W} fillOpacity={0.3} className="font-mono">
            ─────────────
          </text>
          <text x={CA} y={60} fontSize={9.5} fill={W} fillOpacity={0.3} textAnchor="middle" className="font-mono">
            SCHEDULED
          </text>
          <text x={CB} y={60} fontSize={9.5} letterSpacing="0.1em" fill={W} fillOpacity={0.3} className="font-mono">
            EXECUTED
          </text>

          {/* Header separator */}
          <line x1={LX} y1={70} x2={526} y2={70} stroke={W} strokeWidth={0.8} strokeOpacity={0.35} />

          {/* Vertical divider between T=0 and T+Δ */}
          <line x1={DX} y1={70} x2={DX} y2={196} stroke={W} strokeWidth={0.7} strokeDasharray="2 5" strokeOpacity={0.3} />

          {/* Constraint rows */}
          {ROWS.map((row, i) => (
            <g key={row.label}>
              <text x={LX} y={ROW_Y[i]} fontSize={11} letterSpacing="0.09em" fill={W} fillOpacity={0.55} className="font-mono">
                {row.label}
              </text>
              {/* T=0: all clear */}
              <text x={CA} y={ROW_Y[i]} fontSize={13} fill={W} fillOpacity={0.5} textAnchor="middle" className="font-mono">
                ✓
              </text>
              {/* T+Δ: shifted */}
              <text x={CB} y={ROW_Y[i]} fontSize={12} fill={W} fillOpacity={1} className="font-mono">
                {row.after}
              </text>
            </g>
          ))}

          {/* Bottom separator */}
          <line x1={LX} y1={196} x2={526} y2={196} stroke={W} strokeWidth={0.8} strokeOpacity={0.35} />

          {/* Outcome row */}
          <text x={LX} y={220} fontSize={10.5} letterSpacing="0.1em" fill={W} fillOpacity={0.45} className="font-mono">
            JOB COMMITTED
          </text>
          <text x={CA} y={220} fontSize={13} fill={W} fillOpacity={0.4} textAnchor="middle" className="font-mono">
            ✓
          </text>
          <text x={CB} y={220} fontSize={11} letterSpacing="0.1em" fill={W} fillOpacity={1} className="font-mono">
            DECISION SUBOPTIMAL
          </text>
        </svg>
      </div>
      <CaptionStrip label="fig.03 — constraints shift between decision and execution" />
    </figure>
  );
}
