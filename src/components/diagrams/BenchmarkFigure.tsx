import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.04 — the case-study result, drawn as a 1-bit instrument.

   Pure black plate, pure white ink — no gray, no gold. The Alibaba GenAI 2026
   public-workload case study, reported HONESTLY against an SLA-safe baseline:
   SLA-safe goodput per dollar (+38.2%, the headline — a solid bar) and
   GPU-hours (−27.6%, an outline bar), both arms at 0.000% SLA violations. A
   larger comparison against an SLA-violating baseline is deliberately excluded
   — see the report body. A diverging figure around the SLA-safe baseline.
   Conservative: only the two verified deltas, framed as a historical replay.
   ============================================================================ */

const W = "#ffffff";
const BX = 300; // baseline (x)
const S = 3.0; // px per percentage point
const BAR_H = 34;
const R1 = 88; // goodput bar top
const R2 = 164; // gpu-hours bar top

export function BenchmarkFigure({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.04" title="case study — alibaba genai 2026" />
      <div className="relative">
        <svg
          viewBox="0 0 760 282"
          className="relative block w-full"
          role="img"
          aria-label="Alibaba GenAI 2026 historical replay: +38.2% SLA-safe goodput per dollar and −27.6% GPU-hours versus an SLA-safe baseline, both at zero SLA violations."
        >
          {/* ±20 / ±40 guides */}
          {[-40, -20, 20, 40].map((p) => (
            <g key={p}>
              <line x1={BX + p * S} y1={62} x2={BX + p * S} y2={222} stroke={W} strokeWidth={1} strokeDasharray="2 6" opacity={0.5} />
              <text x={BX + p * S} y={240} textAnchor="middle" fontSize={10} letterSpacing="0.08em" fill={W} className="font-mono" opacity={0.7}>
                {p > 0 ? `+${p}` : `−${Math.abs(p)}`}
              </text>
            </g>
          ))}

          {/* 0% baseline — the SLA-safe baseline */}
          <line x1={BX} y1={54} x2={BX} y2={222} stroke={W} strokeWidth={1.6} />
          <text x={BX} y={240} textAnchor="middle" fontSize={10} letterSpacing="0.08em" fill={W} className="font-mono">
            0 · SLA-SAFE BASELINE
          </text>

          {/* axis title */}
          <text x={BX} y={262} textAnchor="middle" fontSize={10.5} letterSpacing="0.16em" fill={W} className="font-mono">
            Δ VS SLA-SAFE BASELINE (%)
          </text>

          {/* row 1 — SLA-safe goodput / $ : +38.2% (headline, solid bar) */}
          <text x={BX - 16} y={R1 + 22} textAnchor="end" fontSize={12} letterSpacing="0.04em" fill={W} className="font-mono">
            SLA-safe goodput / $
          </text>
          <rect x={BX} y={R1} width={38.2 * S} height={BAR_H} fill={W} stroke={W} strokeWidth={1.4} />
          <text x={BX + 38.2 * S + 16} y={R1 + 24} textAnchor="start" fontSize={22} letterSpacing="-0.01em" fill={W} className="font-mono">
            +38.2%
          </text>

          {/* row 2 — GPU-hours : −27.6% (outline bar) */}
          <text x={BX + 16} y={R2 + 22} textAnchor="start" fontSize={12} letterSpacing="0.04em" fill={W} className="font-mono">
            GPU-hours
          </text>
          <rect x={BX - 27.6 * S} y={R2} width={27.6 * S} height={BAR_H} fill="none" stroke={W} strokeWidth={1.4} />
          <text x={BX - 27.6 * S - 16} y={R2 + 24} textAnchor="end" fontSize={22} letterSpacing="-0.01em" fill={W} className="font-mono">
            −27.6%
          </text>
        </svg>
      </div>
      <CaptionStrip label="fig.04 — both arms 0.000% SLA violations · historical replay, not a guarantee" />
    </figure>
  );
}
