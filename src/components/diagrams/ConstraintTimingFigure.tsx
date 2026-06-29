import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.03 — economic autopsy.

   One read, nothing else: a decision's economic value over time. It is LOCKED
   at T=0 while it appears optimal — a flat white line. At T+Δ the constraints
   it could not see shift (power ↑, queue ↑, capacity ↓, demand ↑). The locked
   decision cannot react, so its value drops on a single knee, fading white →
   red, into one ECONOMIC LOSS readout.

   Deliberately spare: no forecast path, no alternate optimum, no decorative
   motion. Monochrome dominant; red reserved for the decline and the loss. The
   constraint list sits directly above the knee — alignment, not arrows, is the
   cause. Fully static, so it is identical with or without reduced motion.
   ============================================================================ */

const W = "#ffffff";
const R = "#D2564E"; // muted red — decline / loss only

const CONSTRAINTS = [
  { label: "POWER", trend: "↑" },
  { label: "QUEUE", trend: "↑" },
  { label: "CAPACITY", trend: "↓" },
  { label: "DEMAND", trend: "↑" },
];

const LOSS_ROWS = ["GOODPUT / $ ↓", "GPU-HOURS ↑", "ENERGY COST ↑", "SLA RISK ↑"];

export function ConstraintTimingFigure({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.03" title="economic autopsy" />
      <div className="relative">
        <svg
          viewBox="0 0 580 310"
          className="relative block w-full"
          role="img"
          aria-label="A scheduling decision's economic value over time. At T=0 it is locked while it appears optimal — a flat line. At T plus delta the constraints it could not see shift: power up, queue up, capacity down, demand up. The locked decision cannot react and its value drops into economic loss — goodput per dollar down, GPU-hours up, energy cost up, SLA risk up."
        >
          <defs>
            {/* the knee fades white → red as value is lost */}
            <linearGradient id="autopsy-decline" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={W} stopOpacity={0.85} />
              <stop offset="45%" stopColor={W} stopOpacity={0.6} />
              <stop offset="100%" stopColor={R} stopOpacity={1} />
            </linearGradient>
            <marker id="autopsy-ah" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto">
              <path d="M1 1L7 4.5L1 8" fill="none" stroke={R} strokeWidth="1.8" strokeLinecap="square" />
            </marker>
            <marker id="autopsy-time" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M1 1L6 4L1 7" fill="none" stroke={W} strokeOpacity="0.4" strokeWidth="1.3" strokeLinecap="square" />
            </marker>
          </defs>

          {/* ---------- T=0 · the locked decision (looks optimal) ---------- */}
          <text x={96} y={110} textAnchor="middle" fontSize={11} letterSpacing="0.16em" fill={W} className="font-mono">
            T=0
          </text>
          <text x={96} y={126} textAnchor="middle" fontSize={9.5} letterSpacing="0.12em" fill={W} fillOpacity={0.5} className="font-mono">
            DECISION LOCKED
          </text>
          <rect x={90} y={142} width={12} height={12} fill={W} />
          {/* flat, white = value intact while it appears optimal */}
          <line x1={96} y1={148} x2={250} y2={148} stroke={W} strokeWidth={2} />
          <text x={173} y={167} textAnchor="middle" fontSize={9} letterSpacing="0.14em" fill={W} fillOpacity={0.4} className="font-mono">
            APPEARS OPTIMAL
          </text>

          {/* ---------- T+Δ · the constraints that shift (the cause) ---------- */}
          <text x={250} y={54} textAnchor="middle" fontSize={11} letterSpacing="0.14em" fill={W} className="font-mono">
            T+Δ
          </text>
          <text x={250} y={70} textAnchor="middle" fontSize={9.5} letterSpacing="0.12em" fill={W} fillOpacity={0.5} className="font-mono">
            CONSTRAINTS SHIFT
          </text>
          <line x1={206} y1={80} x2={300} y2={80} stroke={W} strokeOpacity={0.25} strokeWidth={1} />
          {CONSTRAINTS.map((c, i) => (
            <g key={c.label}>
              <text x={206} y={98 + i * 16} fontSize={10} letterSpacing="0.06em" fill={W} fillOpacity={0.62} className="font-mono">
                {c.label}
              </text>
              <text x={300} y={98 + i * 16} textAnchor="end" fontSize={11} fill={R} className="font-mono">
                {c.trend}
              </text>
            </g>
          ))}
          {/* faint tick: cause (list) → effect (knee), alignment not arrows */}
          <line x1={250} y1={150} x2={250} y2={166} stroke={W} strokeOpacity={0.22} strokeWidth={1} />

          {/* ---------- the knee · value drops into loss ---------- */}
          <path
            d="M250 148 L420 244"
            fill="none"
            stroke="url(#autopsy-decline)"
            strokeWidth={2.4}
            markerEnd="url(#autopsy-ah)"
          />

          {/* ---------- the loss · single red readout (the point) ---------- */}
          <rect x={438} y={196} width={128} height={106} fill="none" stroke={R} strokeWidth={1.6} />
          <text x={450} y={218} fontSize={11} letterSpacing="0.1em" fill={R} className="font-mono">
            ECONOMIC LOSS
          </text>
          {LOSS_ROWS.map((row, i) => (
            <text key={row} x={450} y={242 + i * 18} fontSize={10} letterSpacing="0.04em" fill={R} fillOpacity={0.92} className="font-mono">
              {row}
            </text>
          ))}

          {/* ---------- time baseline (direction only) ---------- */}
          <line x1={70} y1={286} x2={356} y2={286} stroke={W} strokeOpacity={0.28} strokeWidth={1} markerEnd="url(#autopsy-time)" />
          <text x={366} y={290} fontSize={9} letterSpacing="0.18em" fill={W} fillOpacity={0.4} className="font-mono">
            TIME
          </text>
        </svg>
      </div>
      <CaptionStrip label="fig.03 — future constraints turn reasonable decisions into economic loss" />
    </figure>
  );
}
