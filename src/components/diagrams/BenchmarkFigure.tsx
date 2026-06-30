import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.04 — the headline result, drawn as a 1-bit instrument.

   Pure black plate, pure white ink — no gray, no gold. SLA-safe goodput per
   dollar vs a production-class scheduler baseline, across three independent
   public electricity markets' expensive windows, on an uncapped high-load
   replay of the full selected benchmark windows. Every bar is Pareto-safe (SLA
   strictly better than the baseline) at ~84% fewer GPU-hours. The dashed guide
   marks the arithmetic mean across markets — the +724% headline. Conservative:
   only the three verified per-market deltas, framed as a simulated replay.
   ============================================================================ */

const W = "#ffffff";
const BX = 150; // 0% baseline (x)
const S = 0.62; // px per percentage point (axis spans ~0–800%)
const AVG = 724; // arithmetic mean across markets
const BAR_H = 30;
const ROWS: { label: string; pct: number }[] = [
  { label: "PJM · expensive", pct: 698 },
  { label: "ERCOT · expensive", pct: 718 },
  { label: "CAISO · expensive", pct: 755 },
];
const R0 = 78;
const RGAP = 56;

export function BenchmarkFigure({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.04" title="result · uncapped high-load replay" />
      <div className="relative">
        <svg
          viewBox="0 0 760 300"
          className="relative block w-full"
          role="img"
          aria-label="SLA-safe goodput per dollar versus a production-class scheduler baseline on an uncapped high-load replay: PJM +698%, ERCOT +718%, CAISO +755%, arithmetic mean +724%, each with SLA strictly better than the baseline at roughly 84% fewer GPU-hours."
        >
          {/* +200 / +400 / +600 guides */}
          {[200, 400, 600].map((p) => (
            <g key={p}>
              <line x1={BX + p * S} y1={54} x2={BX + p * S} y2={222} stroke={W} strokeWidth={1} strokeDasharray="2 6" opacity={0.5} />
              <text x={BX + p * S} y={240} textAnchor="middle" fontSize={10} letterSpacing="0.08em" fill={W} className="font-mono" opacity={0.7}>
                +{p}%
              </text>
            </g>
          ))}

          {/* arithmetic-mean guide — the +724% headline */}
          <line x1={BX + AVG * S} y1={50} x2={BX + AVG * S} y2={222} stroke={W} strokeWidth={1.2} strokeDasharray="5 4" opacity={0.9} />
          <text x={BX + AVG * S} y={44} textAnchor="middle" fontSize={11} letterSpacing="0.06em" fill={W} className="font-mono">
            avg +{AVG}%
          </text>

          {/* 0% baseline — production-class scheduler */}
          <line x1={BX} y1={46} x2={BX} y2={222} stroke={W} strokeWidth={1.6} />
          <text x={BX} y={240} textAnchor="middle" fontSize={10} letterSpacing="0.08em" fill={W} className="font-mono">
            0 · PRODUCTION
          </text>

          {/* bars */}
          {ROWS.map((r, i) => {
            const y = R0 + i * RGAP;
            return (
              <g key={r.label}>
                <text x={BX - 12} y={y + 20} textAnchor="end" fontSize={11.5} letterSpacing="0.02em" fill={W} className="font-mono">
                  {r.label}
                </text>
                <rect x={BX} y={y} width={r.pct * S} height={BAR_H} fill="none" stroke={W} strokeWidth={1.4} />
                <text x={BX + r.pct * S + 14} y={y + 21} textAnchor="start" fontSize={18} letterSpacing="-0.01em" fill={W} className="font-mono">
                  +{r.pct}%
                </text>
              </g>
            );
          })}

          {/* footing note */}
          <text x={BX} y={272} fontSize={10.5} letterSpacing="0.1em" fill={W} className="font-mono">
            SLA strictly better in all three · ~84% fewer GPU-hours · Pareto-safe
          </text>
        </svg>
      </div>
      <CaptionStrip label="fig.04 · Δ SLA-safe goodput/$ vs production-class scheduler · uncapped high-load replay, not a guarantee" />
    </figure>
  );
}
