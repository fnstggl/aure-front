import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.01 — the evaluation pipeline. Simplified to read in five seconds.

   A single spine, five stages, one micro-label each. No braces, gates, or
   legends. Pure white ink on black; a subtle antique-gold accent marks only the
   final committed step (Controlled rollout). No motion.
   ============================================================================ */

const W = "#ffffff";
const GOLD = "hsl(40 34% 58%)";
const GOLD_SOFT = "hsl(40 34% 58% / 0.16)";

const SX = 64; // spine x
const Y = [38, 108, 178, 248, 318]; // stage centers

const STAGES = [
  { n: "01", t: "Operator telemetry", m: "metadata only" },
  { n: "02", t: "Offline replay", m: "historical replay" },
  { n: "03", t: "Shadow mode", m: "read-only" },
  { n: "04", t: "Savings report", m: "audited counterfactual" },
  { n: "05", t: "Controlled rollout", m: "gradual + reversible", committed: true },
];

export function ArchitecturePipeline({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.01" title="evaluation pipeline" />
      <div className="relative">
        <svg
          viewBox="0 0 600 348"
          className="relative block w-full"
          role="img"
          aria-label="Evaluation pipeline: operator telemetry, offline replay, shadow mode, savings report, then controlled rollout."
        >
          {/* spine */}
          <line x1={SX} y1={Y[0]} x2={SX} y2={Y[4]} stroke={W} strokeWidth={1.3} />
          {/* committed segment (04 → 05) in gold */}
          <line x1={SX} y1={Y[3]} x2={SX} y2={Y[4]} stroke={GOLD} strokeWidth={2.2} />

          {/* chevrons between stages */}
          {[0, 1, 2, 3].map((i) => {
            const my = (Y[i] + Y[i + 1]) / 2;
            return (
              <path
                key={i}
                d={`M${SX - 4} ${my - 3} L${SX} ${my + 1} L${SX + 4} ${my - 3}`}
                fill="none"
                stroke={i === 3 ? GOLD : W}
                strokeWidth={1.2}
                strokeLinecap="square"
              />
            );
          })}

          {/* stages */}
          {STAGES.map((st, i) => {
            const committed = !!st.committed;
            const ink = committed ? GOLD : W;
            return (
              <g key={st.n}>
                <rect
                  x={SX - 5.5}
                  y={Y[i] - 5.5}
                  width={11}
                  height={11}
                  fill={committed ? GOLD_SOFT : "none"}
                  stroke={ink}
                  strokeWidth={committed ? 2 : 1.3}
                />
                <text x={SX + 22} y={Y[i] + 4.5} fontSize={13} letterSpacing="0.06em" fill={ink} className="font-mono">
                  {st.n}
                </text>
                <text x={SX + 54} y={Y[i] + 4.5} fontSize={13.5} letterSpacing="0.12em" fill={ink} className="font-mono">
                  {st.t.toUpperCase()}
                </text>
                <text x={584} y={Y[i] + 4} textAnchor="end" fontSize={11} letterSpacing="0.04em" fill={ink} className="font-mono">
                  {st.m}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <CaptionStrip label="fig.01 — telemetry → replay → shadow → savings → rollout" />
    </figure>
  );
}
