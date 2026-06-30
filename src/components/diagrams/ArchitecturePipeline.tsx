import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.01 — the evaluation pipeline, drawn as a 1-bit instrument.

   Pure black plate, pure white ink — no gray, no gold. A single spine carries
   five stages top to bottom. A brace marks the read-only phase (≤ 03); a tick
   marks the constraint gate; the committed stage (05) is the one filled node,
   on a heavier spine. Hierarchy is weight and fill, never value. No motion.
   ============================================================================ */

const W = "#ffffff";
const SX = 88; // spine x
const Y = [56, 143, 230, 317, 404]; // stage centers

const STAGES = [
  { n: "01", t: "Operator telemetry", s: "scheduler metadata · no payloads" },
  { n: "02", t: "Offline replay", s: "historical production traces" },
  { n: "03", t: "Shadow mode", s: "read-only · alongside live" },
  { n: "04", t: "Savings report", s: "audited counterfactual" },
  { n: "05", t: "Controlled rollout", s: "gradual · reversible", committed: true },
];

export function ArchitecturePipeline({
  className,
  fig = "fig.01",
  title = "evaluation pipeline",
}: {
  className?: string;
  fig?: string;
  title?: string;
}) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig={fig} title={title} />
      <div className="relative">
        <svg
          viewBox="0 0 580 452"
          className="relative block w-full"
          role="img"
          aria-label="Evaluation pipeline: operator telemetry, offline replay, shadow mode, savings report, controlled rollout. Stages one through three are read-only; a constraint gate precedes the committed rollout."
        >
          {/* spine */}
          <line x1={SX} y1={Y[0]} x2={SX} y2={Y[4]} stroke={W} strokeWidth={1.2} />
          {/* committed segment (04 → 05) — heavier */}
          <line x1={SX} y1={Y[3]} x2={SX} y2={Y[4]} stroke={W} strokeWidth={2.4} />

          {/* read-only brace over 01–03 */}
          <path d={`M58 ${Y[0]} H50 V${Y[2]} H58`} stroke={W} strokeWidth={1.2} fill="none" />
          <text
            x={44}
            y={(Y[0] + Y[2]) / 2}
            fontSize={10.5}
            letterSpacing="0.2em"
            fill={W}
            className="font-mono"
            transform={`rotate(-90 44 ${(Y[0] + Y[2]) / 2})`}
            textAnchor="middle"
          >
            READ-ONLY
          </text>

          {/* constraint gate tick between 04 and 05 */}
          <line x1={SX - 12} y1={360} x2={SX + 12} y2={360} stroke={W} strokeWidth={1.6} />
          <text x={SX + 150} y={356} fontSize={10.5} letterSpacing="0.16em" fill={W} className="font-mono">
            CONSTRAINT GATE
          </text>
          <text x={SX + 150} y={371} fontSize={10.5} letterSpacing="0.04em" fill={W} className="font-mono">
            unsafe candidates rejected
          </text>

          {/* stage chevrons */}
          {[0, 1, 2, 3].map((i) => {
            const my = (Y[i] + Y[i + 1]) / 2;
            return (
              <path
                key={i}
                d={`M${SX - 4} ${my - 3} L${SX} ${my + 1} L${SX + 4} ${my - 3}`}
                fill="none"
                stroke={W}
                strokeWidth={i === 3 ? 1.6 : 1.1}
                strokeLinecap="square"
              />
            );
          })}

          {/* nodes + labels */}
          {STAGES.map((st, i) => {
            const committed = !!st.committed;
            return (
              <g key={st.n}>
                <rect
                  x={SX - 5.5}
                  y={Y[i] - 5.5}
                  width={11}
                  height={11}
                  fill={committed ? W : "none"}
                  stroke={W}
                  strokeWidth={committed ? 2 : 1.3}
                />
                <text x={SX + 22} y={Y[i] - 2} fontSize={12} letterSpacing="0.08em" fill={W} className="font-mono">
                  {st.n}
                </text>
                <text x={SX + 52} y={Y[i] - 2} fontSize={12.5} letterSpacing="0.14em" fill={W} className="font-mono">
                  {st.t.toUpperCase()}
                </text>
                <text x={SX + 52} y={Y[i] + 14} fontSize={11.5} letterSpacing="0.02em" fill={W} className="font-mono">
                  {st.s}
                </text>
              </g>
            );
          })}

          {/* legend */}
          <g transform="translate(88 438)">
            <rect x={0} y={-7} width={9} height={9} fill={W} stroke={W} strokeWidth={1.3} />
            <text x={16} y={1} fontSize={10} letterSpacing="0.12em" fill={W} className="font-mono">
              COMMITTED
            </text>
            <rect x={118} y={-7} width={9} height={9} fill="none" stroke={W} strokeWidth={1.3} />
            <text x={134} y={1} fontSize={10} letterSpacing="0.12em" fill={W} className="font-mono">
              STAGE
            </text>
          </g>
        </svg>
      </div>
      <CaptionStrip label={`${fig} · telemetry → replay → shadow → savings → rollout`} />
    </figure>
  );
}
