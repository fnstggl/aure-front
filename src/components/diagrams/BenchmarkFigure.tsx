import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.02 — the one benchmark figure, drawn as a 1-bit instrument.

   Pure black plate, pure white ink — no gray, no gold. Two validated deltas
   against the operator's own scheduler, on public production traces: SLA-safe
   goodput per dollar (+26%, the headline — a solid bar) and GPU-hours (−21%, an
   outline bar). A diverging figure around a 0 baseline, with an axis title and
   ± guides. Conservative: only the two stated numbers, framed as a backtest.
   ============================================================================ */

const W = "#ffffff";
const BX = 380; // 0% baseline (x)
const S = 5; // px per percentage point
const BAR_H = 34;
const R1 = 88; // goodput bar top
const R2 = 164; // gpu-hours bar top

export function BenchmarkFigure({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.02" title="backtest — public traces" />
      <div className="relative">
        <svg
          viewBox="0 0 760 282"
          className="relative block w-full"
          role="img"
          aria-label="Backtest on public production traces: +26% SLA-safe goodput per dollar and −21% GPU-hours, both relative to the operator's existing scheduler."
        >
          {/* ±20% guides */}
          {[-20, 20].map((p) => (
            <g key={p}>
              <line x1={BX + p * S} y1={62} x2={BX + p * S} y2={222} stroke={W} strokeWidth={1} strokeDasharray="2 6" />
              <text x={BX + p * S} y={240} textAnchor="middle" fontSize={10} letterSpacing="0.1em" fill={W} className="font-mono">
                {p > 0 ? "+20" : "−20"}
              </text>
            </g>
          ))}

          {/* 0% baseline — the operator's current scheduler */}
          <line x1={BX} y1={54} x2={BX} y2={222} stroke={W} strokeWidth={1.6} />
          <text x={BX} y={240} textAnchor="middle" fontSize={10} letterSpacing="0.1em" fill={W} className="font-mono">
            0 · BASELINE
          </text>

          {/* axis title */}
          <text x={BX} y={262} textAnchor="middle" fontSize={10.5} letterSpacing="0.18em" fill={W} className="font-mono">
            Δ VS OPERATOR BASELINE (%)
          </text>

          {/* row 1 — SLA-safe goodput / $ : +26% (headline, solid bar) */}
          <text x={BX - 16} y={R1 + 22} textAnchor="end" fontSize={12} letterSpacing="0.04em" fill={W} className="font-mono">
            SLA-safe goodput / $
          </text>
          <rect x={BX} y={R1} width={26 * S} height={BAR_H} fill={W} stroke={W} strokeWidth={1.4} />
          <text x={BX + 26 * S + 16} y={R1 + 24} textAnchor="start" fontSize={22} letterSpacing="-0.01em" fill={W} className="font-mono">
            +26%
          </text>

          {/* row 2 — GPU-hours : −21% (outline bar) */}
          <text x={BX + 16} y={R2 + 22} textAnchor="start" fontSize={12} letterSpacing="0.04em" fill={W} className="font-mono">
            GPU-hours
          </text>
          <rect x={BX - 21 * S} y={R2} width={21 * S} height={BAR_H} fill="none" stroke={W} strokeWidth={1.4} />
          <text x={BX - 21 * S - 16} y={R2 + 24} textAnchor="end" fontSize={22} letterSpacing="-0.01em" fill={W} className="font-mono">
            −21%
          </text>
        </svg>
      </div>
      <CaptionStrip label="fig.02 — Δ vs operator scheduler · backtest, not a guarantee" />
    </figure>
  );
}
