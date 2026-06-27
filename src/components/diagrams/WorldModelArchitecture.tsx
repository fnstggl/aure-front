import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.01 — the predictive control architecture, drawn as a 1-bit instrument.

   Pure black plate, pure white ink — no gray, no gold. One left-to-right flow
   makes the whole thesis legible in five seconds: Aurelius does not react to the
   current scheduler state, it forecasts the FUTURE cluster state, simulates a
   set of candidate decisions against it, scores their economic outcomes, and
   commits the single optimum through a constraint gate. The fan is the idea —
   two candidates are explored and dropped (faint, dead-ended), one is chosen
   (heavier, filled) and proceeds. Hierarchy is weight + fill, never value.
   ============================================================================ */

const W = "#ffffff";
const MY = 150; // main flow line (y)

export function WorldModelArchitecture({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.01" title="predictive control architecture" />
      <div className="relative">
        <svg
          viewBox="0 0 820 300"
          className="relative block w-full"
          role="img"
          aria-label="Predictive control architecture: current state feeds a predictive world model that forecasts future constraints; Aurelius simulates candidate decisions, scores their economic outcomes, and commits the single optimum through a constraint gate to recommend or execute."
        >
         <g transform="translate(30 0)">
          {/* ---- 01 current state -------------------------------------- */}
          <rect x={46} y={MY - 6} width={12} height={12} fill="none" stroke={W} strokeWidth={1.4} />
          <line x1={58} y1={MY} x2={108} y2={MY} stroke={W} strokeWidth={1.3} />
          <text x={52} y={MY + 26} textAnchor="middle" fontSize={12} letterSpacing="0.08em" fill={W} className="font-mono">
            current state
          </text>

          {/* ---- 02 predictive world model ----------------------------- */}
          <rect x={108} y={MY - 28} width={114} height={56} fill="none" stroke={W} strokeWidth={1.6} />
          {/* small lattice glyph — the model */}
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}-${c}`} x={140 + c * 18} y={MY - 14 + r * 14} width={2.4} height={2.4} fill={W} />
            )),
          )}
          <text x={165} y={MY + 50} textAnchor="middle" fontSize={12} letterSpacing="0.06em" fill={W} className="font-mono">
            predictive world model
          </text>

          {/* ---- forecast (dashed → the future) ------------------------ */}
          <line x1={222} y1={MY} x2={300} y2={MY} stroke={W} strokeWidth={1.3} strokeDasharray="2 5" />
          <text x={261} y={MY - 16} textAnchor="middle" fontSize={10} letterSpacing="0.18em" fill={W} className="font-mono">
            FORECAST →
          </text>

          {/* ---- 03 future constraints (horizon) ----------------------- */}
          <line x1={300} y1={MY - 44} x2={300} y2={MY + 44} stroke={W} strokeWidth={1.4} strokeDasharray="2 5" />
          {[-30, -10, 12, 30].map((dy, i) => (
            <line key={i} x1={296} y1={MY + dy} x2={308} y2={MY + dy} stroke={W} strokeWidth={1.2} />
          ))}
          <text x={300} y={MY - 54} textAnchor="middle" fontSize={11.5} letterSpacing="0.06em" fill={W} className="font-mono">
            future constraints
          </text>
          <line x1={300} y1={MY} x2={356} y2={MY} stroke={W} strokeWidth={1.3} />

          {/* ---- 04 candidate actions (simulation fan) ----------------- */}
          <rect x={350} y={MY - 6} width={12} height={12} fill="none" stroke={W} strokeWidth={1.4} />
          <text x={356} y={MY + 70} textAnchor="middle" fontSize={12} letterSpacing="0.06em" fill={W} className="font-mono">
            candidate actions
          </text>
          <text x={356} y={MY + 84} textAnchor="middle" fontSize={10} letterSpacing="0.04em" fill={W} className="font-mono" opacity={0.6}>
            simulated · scored
          </text>

          {/* fan: hub → junction → three candidates (orthogonal) */}
          <line x1={362} y1={MY} x2={412} y2={MY} stroke={W} strokeWidth={1.3} />
          {/* rejected (up) */}
          <path d={`M412 ${MY} V${MY - 50} H470`} fill="none" stroke={W} strokeWidth={1.2} opacity={0.4} />
          <rect x={470} y={MY - 56} width={11} height={11} fill="none" stroke={W} strokeWidth={1.3} opacity={0.5} />
          <rect x={484} y={MY - 53} width={32} height={5} fill="none" stroke={W} strokeWidth={1.1} opacity={0.45} />
          {/* rejected (down) */}
          <path d={`M412 ${MY} V${MY + 50} H470`} fill="none" stroke={W} strokeWidth={1.2} opacity={0.4} />
          <rect x={470} y={MY + 45} width={11} height={11} fill="none" stroke={W} strokeWidth={1.3} opacity={0.5} />
          <rect x={484} y={MY + 48} width={26} height={5} fill="none" stroke={W} strokeWidth={1.1} opacity={0.45} />
          {/* chosen (mid) — heavier, the longest economic score */}
          <line x1={412} y1={MY} x2={476} y2={MY} stroke={W} strokeWidth={2.4} />
          <rect x={476} y={MY - 6} width={12} height={12} fill={W} stroke={W} strokeWidth={2} />
          <rect x={494} y={MY - 3} width={62} height={6} fill={W} />

          {/* ---- 05 economic optimum ----------------------------------- */}
          <line x1={556} y1={MY} x2={596} y2={MY} stroke={W} strokeWidth={2.4} />
          <text x={500} y={MY + 24} textAnchor="middle" fontSize={11.5} letterSpacing="0.06em" fill={W} className="font-mono">
            economic optimum
          </text>

          {/* ---- constraint gate --------------------------------------- */}
          <line x1={600} y1={MY - 16} x2={600} y2={MY + 16} stroke={W} strokeWidth={1.6} />
          <line x1={596} y1={MY} x2={656} y2={MY} stroke={W} strokeWidth={2.4} />
          <text x={600} y={MY - 26} textAnchor="middle" fontSize={11} letterSpacing="0.06em" fill={W} className="font-mono">
            constraint gate
          </text>

          {/* ---- 06 recommend / execute -------------------------------- */}
          <rect x={650} y={MY - 7} width={14} height={14} fill={W} stroke={W} strokeWidth={2} />
          <text x={672} y={MY - 2} textAnchor="start" fontSize={12} letterSpacing="0.06em" fill={W} className="font-mono">
            recommend
          </text>
          <text x={672} y={MY + 13} textAnchor="start" fontSize={12} letterSpacing="0.06em" fill={W} className="font-mono">
            / execute
          </text>
         </g>
        </svg>
      </div>
      <CaptionStrip label="fig.01 — observe → forecast → simulate → decide" />
    </figure>
  );
}
