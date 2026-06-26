import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.02 — the one benchmark figure.

   Two validated deltas against the operator's own scheduler, measured on
   public production traces: SLA-safe goodput per dollar (+26%) and GPU-hours
   (−21%). A diverging figure around a 0 baseline — gains right, reductions
   left. Conservative by construction: it reports only the two numbers the
   landing page states, framed explicitly as a backtest, not a guarantee.
   ============================================================================ */

const GOLD = "hsl(40 34% 58%)";
const GOLD_SOFT = "hsl(40 34% 58% / 0.12)";
const INK = "hsl(0 0% 100% / 0.9)";
const LABEL = "hsl(0 0% 100% / 0.72)";
const DIM = "hsl(0 0% 100% / 0.46)";
const FAINT = "hsl(0 0% 100% / 0.14)";

const BX = 380; // 0% baseline (x)
const S = 5; // px per percentage point
const BAR_H = 34;

export function BenchmarkFigure({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-strong bg-card", className)}>
      <PlateHeader fig="fig.02" title="backtest — public traces" />
      <div className="relative">
        <div className="diagram-grid pointer-events-none absolute inset-0" aria-hidden />
        <svg
          viewBox="0 0 760 252"
          className="relative block w-full"
          role="img"
          aria-label="Backtest on public production traces: +26% SLA-safe goodput per dollar and −21% GPU-hours, both relative to the operator's existing scheduler."
        >
          {/* ±20% guide ticks */}
          {[-20, 20].map((p) => (
            <g key={p}>
              <line x1={BX + p * S} y1={48} x2={BX + p * S} y2={206} stroke={FAINT} strokeWidth={1} strokeDasharray="2 5" />
              <text x={BX + p * S} y={224} textAnchor="middle" fontSize={10} letterSpacing="0.12em" fill={DIM} className="font-mono">
                {p > 0 ? "+20%" : "−20%"}
              </text>
            </g>
          ))}

          {/* 0% baseline — the operator's current scheduler */}
          <line x1={BX} y1={40} x2={BX} y2={206} stroke={INK} strokeWidth={1.4} />
          <text x={BX} y={224} textAnchor="middle" fontSize={10} letterSpacing="0.12em" fill={LABEL} className="font-mono">
            0% · BASELINE
          </text>

          {/* row 1 — SLA-safe goodput / $ : +26% (gain, right, gold) */}
          <text x={BX - 16} y={84} textAnchor="end" fontSize={12} letterSpacing="0.04em" fill={LABEL} className="font-mono">
            SLA-safe goodput / $
          </text>
          <rect x={BX} y={84} width={26 * S} height={BAR_H} fill={GOLD_SOFT} stroke={GOLD} strokeWidth={1.4} />
          <text x={BX + 26 * S + 16} y={106} textAnchor="start" fontSize={22} letterSpacing="-0.01em" fill={GOLD} className="font-mono">
            +26%
          </text>

          {/* row 2 — GPU-hours : −21% (reduction, left, white) */}
          <text x={BX + 16} y={158} textAnchor="start" fontSize={12} letterSpacing="0.04em" fill={LABEL} className="font-mono">
            GPU-hours
          </text>
          <rect x={BX - 21 * S} y={158} width={21 * S} height={BAR_H} fill="none" stroke={INK} strokeWidth={1.4} />
          <text x={BX - 21 * S - 16} y={180} textAnchor="end" fontSize={22} letterSpacing="-0.01em" fill={INK} className="font-mono">
            −21%
          </text>
        </svg>
      </div>
      <CaptionStrip label="Δ vs operator scheduler — backtest, not a guarantee" />
    </figure>
  );
}
