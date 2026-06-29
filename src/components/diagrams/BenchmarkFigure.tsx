import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.04 — the headline result, drawn as a 1-bit instrument.

   Pure black plate, pure white ink — no gray, no gold. SLA-safe goodput per
   dollar vs the strongest SLA-aware baseline, across three independent public
   electricity markets' expensive windows, on a bounded Azure/Mooncake replay.
   Every bar is Pareto-safe (SLA strictly better than baseline) and lands on the
   exhaustive optimum at zero search regret. Conservative: only the three
   verified deltas, framed as a bounded historical replay.
   ============================================================================ */

const W = "#ffffff";
const BX = 150; // 0% baseline (x)
const S = 2.35; // px per percentage point
const BAR_H = 30;
const ROWS: { label: string; pct: number }[] = [
  { label: "PJM · expensive", pct: 161.31 },
  { label: "ERCOT · expensive", pct: 191.41 },
  { label: "CAISO · expensive", pct: 147.85 },
];
const R0 = 78;
const RGAP = 56;

export function BenchmarkFigure({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.04" title="result — expensive electricity windows" />
      <div className="relative">
        <svg
          viewBox="0 0 760 300"
          className="relative block w-full"
          role="img"
          aria-label="SLA-safe goodput per dollar versus the strongest SLA-aware baseline on a bounded replay: PJM +161.31%, ERCOT +191.41%, CAISO +147.85%, all with SLA strictly better than baseline and zero search regret."
        >
          {/* +100 / +200 guides */}
          {[100, 200].map((p) => (
            <g key={p}>
              <line x1={BX + p * S} y1={54} x2={BX + p * S} y2={222} stroke={W} strokeWidth={1} strokeDasharray="2 6" opacity={0.5} />
              <text x={BX + p * S} y={240} textAnchor="middle" fontSize={10} letterSpacing="0.08em" fill={W} className="font-mono" opacity={0.7}>
                +{p}%
              </text>
            </g>
          ))}

          {/* 0% baseline — strongest SLA-aware */}
          <line x1={BX} y1={46} x2={BX} y2={222} stroke={W} strokeWidth={1.6} />
          <text x={BX} y={240} textAnchor="middle" fontSize={10} letterSpacing="0.08em" fill={W} className="font-mono">
            0 · BASELINE
          </text>

          {/* bars */}
          {ROWS.map((r, i) => {
            const y = R0 + i * RGAP;
            const headline = r.pct === 191.41;
            return (
              <g key={r.label}>
                <text x={BX - 12} y={y + 20} textAnchor="end" fontSize={11.5} letterSpacing="0.02em" fill={W} className="font-mono">
                  {r.label}
                </text>
                <rect x={BX} y={y} width={r.pct * S} height={BAR_H} fill={headline ? W : "none"} stroke={W} strokeWidth={1.4} />
                <text x={BX + r.pct * S + 14} y={y + 21} textAnchor="start" fontSize={18} letterSpacing="-0.01em" fill={W} className="font-mono">
                  +{r.pct}%
                </text>
              </g>
            );
          })}

          {/* footing note */}
          <text x={BX} y={272} fontSize={10.5} letterSpacing="0.1em" fill={W} className="font-mono">
            SLA strictly better in all three · 0 search regret vs exhaustive · Pareto-safe
          </text>
        </svg>
      </div>
      <CaptionStrip label="fig.04 — Δ SLA-safe goodput/$ vs strongest SLA-aware baseline · bounded replay, not a guarantee" />
    </figure>
  );
}
