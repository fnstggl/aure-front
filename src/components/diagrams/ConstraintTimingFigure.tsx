import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.03 — economic autopsy.

   Not a ledger. A causal flow drawn as a diverging-path schematic:

     COMMIT (T=0) ──┬─▶ committed path ── sinks under shifting constraints ──▶ LOSS
                    └ ─ ─ forecast path ─ ─ ─ (world model) ─ ─ ─▶ OPTIMUM

   The decision looks reasonable when locked: the pre-commit path is flat and
   white. Then future constraints (power ↑, queue ↑, capacity ↓, demand ↑) press
   down on the LOCKED path — it cannot react, so it accelerates into red economic
   loss. A faint dashed forecast path, the predictive world model, anticipated
   those same constraints and routed to the economic optimum instead.

   Monochrome dominant; red reserved for the deteriorating path + loss. Motion is
   CSS-only (flow-dash, anim-breathe) and is neutralized by the global
   prefers-reduced-motion rule in index.css — the figure stays fully legible
   frozen.
   ============================================================================ */

const W = "#ffffff";
const R = "#D2564E"; // muted red — deterioration / loss only

// committed (locked) path — flat at commit, then accelerating downward
const COMMIT_PATH = "M250 200 L292 212 L338 234 L384 262 L426 288 L460 300";
// forecast (world-model) path — straight rise, then level to the optimum
const FORECAST_PATH = "M250 200 L292 96 L460 96";

// pressure columns: where each constraint presses onto the committed path
const PRESSURE = [
  { x: 292, label: "POWER", trend: "↑", ly: 138, ty: 206 },
  { x: 338, label: "QUEUE", trend: "↑", ly: 158, ty: 228 },
  { x: 384, label: "CAPACITY", trend: "↓", ly: 138, ty: 256 },
  { x: 426, label: "DEMAND", trend: "↑", ly: 158, ty: 282 },
];

const LOSS_ROWS = ["GOODPUT / $ ↓", "GPU-HOURS ↑", "ENERGY COST ↑", "SLA RISK ↑"];

export function ConstraintTimingFigure({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.03" title="economic autopsy" />
      <div className="relative">
        <svg
          viewBox="0 0 612 400"
          className="relative block w-full"
          role="img"
          aria-label="Economic autopsy. At T=0 a scheduling decision is committed while the current cluster state looks reasonable — power, queue, capacity and deadline all clear. By T plus delta, future constraints shift: power cost rises, queue pressure rises, capacity tightens, demand spikes. These forces press on the locked decision, which cannot react and sinks into economic loss — goodput per dollar down, GPU-hours up, energy cost up, SLA risk up. A faint dashed forecast path, the predictive world model, anticipated those constraints and routed to the economic optimum instead."
        >
          <defs>
            {/* committed stroke fades white → red across its run */}
            <linearGradient id="autopsy-loss" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={W} stopOpacity={0.85} />
              <stop offset="50%" stopColor={W} stopOpacity={0.7} />
              <stop offset="100%" stopColor={R} stopOpacity={1} />
            </linearGradient>
            <marker id="autopsy-ah-loss" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto">
              <path d="M1 1L7 4.5L1 8" fill="none" stroke={R} strokeWidth="1.7" strokeLinecap="square" />
            </marker>
            <marker id="autopsy-ah-fore" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto">
              <path d="M1 1L7 4.5L1 8" fill="none" stroke={W} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="square" />
            </marker>
            <marker id="autopsy-ah-press" markerWidth="8" markerHeight="8" refX="4" refY="6.5" orient="auto">
              <path d="M1 1L4 7L7 1" fill="none" stroke={R} strokeWidth="1.5" strokeLinecap="square" />
            </marker>
            <marker id="autopsy-ah-time" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M1 1L6 4L1 7" fill="none" stroke={W} strokeOpacity="0.4" strokeWidth="1.3" strokeLinecap="square" />
            </marker>
          </defs>

          {/* ============ column headers (the three acts) ============ */}
          <text x={96} y={34} textAnchor="middle" fontSize={11} letterSpacing="0.14em" fill={W} className="font-mono">
            T=0
          </text>
          <text x={96} y={49} textAnchor="middle" fontSize={9.5} letterSpacing="0.12em" fill={W} fillOpacity={0.5} className="font-mono">
            DECISION COMMITTED
          </text>

          <text x={359} y={34} textAnchor="middle" fontSize={11} letterSpacing="0.14em" fill={W} className="font-mono">
            T+Δ
          </text>
          <text x={359} y={49} textAnchor="middle" fontSize={9.5} letterSpacing="0.12em" fill={W} fillOpacity={0.5} className="font-mono">
            FUTURE CONSTRAINTS SHIFT
          </text>

          <text x={529} y={34} textAnchor="middle" fontSize={11} letterSpacing="0.14em" fill={W} fillOpacity={0.5} className="font-mono">
            OUTCOME
          </text>

          {/* ============ left — current state visible (all clear) ============ */}
          <text x={28} y={86} fontSize={9} letterSpacing="0.14em" fill={W} fillOpacity={0.45} className="font-mono">
            CURRENT STATE VISIBLE
          </text>
          {["POWER", "QUEUE", "CAPACITY", "DEADLINE"].map((s, i) => (
            <g key={s}>
              <text x={28} y={106 + i * 16} fontSize={9.5} letterSpacing="0.06em" fill={W} fillOpacity={0.6} className="font-mono">
                {s}
              </text>
              <text x={150} y={106 + i * 16} textAnchor="end" fontSize={10} fill={W} fillOpacity={0.55} className="font-mono">
                ✓
              </text>
            </g>
          ))}

          {/* ============ forecast (world-model) path — dashed, flowing ============ */}
          <path
            d={FORECAST_PATH}
            fill="none"
            stroke={W}
            strokeOpacity={0.5}
            strokeWidth={1.4}
            markerEnd="url(#autopsy-ah-fore)"
            className="flow-dash"
          />
          <text x={300} y={86} fontSize={9} letterSpacing="0.16em" fill={W} fillOpacity={0.55} className="font-mono">
            FORECASTED PATH
          </text>

          {/* ============ committed (locked) path — flat, then sinks to red ============ */}
          {/* pre-commit: flat + white = looked reasonable when locked */}
          <line x1={96} y1={200} x2={250} y2={200} stroke={W} strokeWidth={2} />
          <rect x={90} y={194} width={12} height={12} fill={W} />
          <text x={96} y={228} textAnchor="middle" fontSize={9} letterSpacing="0.12em" fill={W} fillOpacity={0.55} className="font-mono">
            LOCKED
          </text>
          {/* the doomed path */}
          <path
            d={COMMIT_PATH}
            fill="none"
            stroke="url(#autopsy-loss)"
            strokeWidth={2.2}
            markerEnd="url(#autopsy-ah-loss)"
          />

          {/* ============ constraint pressure — forces pushing the path down ============ */}
          {PRESSURE.map((p) => (
            <g key={p.label} className="anim-breathe" style={{ animationDelay: `${(p.x % 5) * 0.5}s` }}>
              <text x={p.x} y={p.ly} textAnchor="middle" fontSize={9.5} letterSpacing="0.04em" fill={W} fillOpacity={0.75} className="font-mono">
                {p.label}
                <tspan dx="3" fill={R}>{p.trend}</tspan>
              </text>
              <line x1={p.x} y1={p.ly + 8} x2={p.x} y2={p.ty} stroke={R} strokeOpacity={0.85} strokeWidth={1.3} markerEnd="url(#autopsy-ah-press)" />
            </g>
          ))}

          {/* ============ right — economic optimum (faint) ============ */}
          <rect x={466} y={62} width={126} height={64} fill="none" stroke={W} strokeOpacity={0.4} strokeWidth={1.2} />
          <text x={478} y={84} fontSize={10.5} letterSpacing="0.08em" fill={W} fillOpacity={0.7} className="font-mono">
            ECONOMIC OPTIMUM
            <tspan dx="4" fill={W} fillOpacity={0.7}>✓</tspan>
          </text>
          <text x={478} y={100} fontSize={9} letterSpacing="0.1em" fill={W} fillOpacity={0.4} className="font-mono">
            via world model
          </text>
          <text x={478} y={116} fontSize={9.5} letterSpacing="0.05em" fill={W} fillOpacity={0.5} className="font-mono">
            GOODPUT / $ ↑
          </text>

          {/* ============ right — economic loss (the climax, red) ============ */}
          <rect x={466} y={240} width={126} height={108} fill="none" stroke={R} strokeWidth={1.6} />
          <text x={478} y={262} fontSize={11} letterSpacing="0.1em" fill={R} className="font-mono">
            ECONOMIC LOSS
          </text>
          {LOSS_ROWS.map((row, i) => (
            <text key={row} x={478} y={284 + i * 18} fontSize={10} letterSpacing="0.04em" fill={R} fillOpacity={0.92} className="font-mono">
              {row}
            </text>
          ))}

          {/* ============ time axis ============ */}
          <line x1={70} y1={374} x2={452} y2={374} stroke={W} strokeOpacity={0.35} strokeWidth={1} markerEnd="url(#autopsy-ah-time)" />
          <text x={96} y={390} textAnchor="middle" fontSize={9} letterSpacing="0.12em" fill={W} fillOpacity={0.4} className="font-mono">
            T=0
          </text>
          <text x={300} y={390} textAnchor="middle" fontSize={9} letterSpacing="0.12em" fill={W} fillOpacity={0.4} className="font-mono">
            T+Δ
          </text>
          <text x={462} y={378} fontSize={9} letterSpacing="0.16em" fill={W} fillOpacity={0.4} className="font-mono">
            TIME
          </text>
        </svg>
      </div>
      <CaptionStrip label="fig.03 — future constraints turn reasonable decisions into economic loss" />
    </figure>
  );
}
