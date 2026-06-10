import { cn } from "@/lib/utils";

/* ============================================================================
   Aurelius diagram language — enterprise infrastructure schematics.

   Design rules (anti-"vibe-coded"):
     • Sharp corners. Square blocks read as engineered, not consumer UI.
     • SOLID flat fills with real tonal steps — never a faint fill behind a
       bright hairline (that "glass card" look is the giveaway).
     • Confident, weighted strokes (2px primary flow, 1.4px structure) with
       arrowheads for direction. No timid hairlines everywhere.
     • High-contrast labels: crisp white truth, one decisive steel accent,
       red only for blocked. No decorative blueprint grid or registration ticks.

   Semantics:
     white  = truth / primary       steel = selected / approved / active
     gray   = neutral / inactive     red   = rejected / blocked / unsafe
   ============================================================================ */

export const C = {
  /* structure */
  plate: "#0b0c0f",
  rail: "hsl(220 8% 100% / 0.18)",
  hair: "hsl(220 8% 100% / 0.10)",
  faint: "hsl(0 0% 100% / 0.32)",
  dim: "hsl(0 0% 100% / 0.46)",
  label: "hsl(0 0% 100% / 0.66)",
  text: "hsl(0 0% 100% / 0.80)",
  white: "hsl(0 0% 97%)",

  /* neutral solid blocks — flat fill, same-family edge (NOT a bright outline) */
  surface: "hsl(222 9% 12%)",
  surfaceStroke: "hsl(220 8% 24%)",
  surfaceDim: "hsl(222 10% 8%)",

  /* deep steel — selected / active control + metadata path. Solid fills. */
  steelFill: "hsl(214 32% 32%)",
  steelFillSoft: "hsl(216 26% 19%)",
  steelLine: "hsl(214 30% 54%)",
  steelStrong: "hsl(213 36% 64%)",
  steelText: "hsl(212 34% 78%)",

  /* muted red — rejected / blocked. Solid fill. */
  red: "hsl(2 54% 58%)",
  redSoft: "hsl(2 46% 17%)",
  redLine: "hsl(2 50% 50%)",

  /* legacy aliases (kept so older call sites keep compiling) */
  grid: "hsl(220 8% 100% / 0.10)",
  gridStrong: "hsl(220 8% 100% / 0.18)",
  plane: "hsl(222 10% 8%)",
  planeStroke: "hsl(220 8% 24%)",
} as const;

export const EASE = [0.16, 1, 0.3, 1] as const;
export const RX = 2; // the only corner radius — sharp, deliberate

/* markerEnd helper — fixed global ids so any diagram can point a connector. */
export function arrow(tone: "steel" | "red" | "rail" = "steel") {
  return `url(#ah-${tone})`;
}

/* ------------------------------------------------------------------ */
/* TopologyPlate — flat figure wrapper. No grid, no ticks.            */
/* Provides shared arrowhead markers scoped to this plate's id.        */
/* ------------------------------------------------------------------ */

export function TopologyPlate({
  fig,
  caption,
  vb,
  minWidth = 760,
  className,
  children,
}: {
  fig: string;
  caption: string;
  vb: [number, number];
  minWidth?: number;
  plane?: boolean; // accepted for compat; intentionally unused
  className?: string;
  children: React.ReactNode;
}) {
  const [w, h] = vb;
  return (
    <figure className={cn("relative overflow-hidden rounded-md border border-border bg-card", className)}>
      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${w} ${h}`} className="block w-full" style={{ minWidth }} role="img" aria-label={caption}>
          <defs>
            <marker id="ah-steel" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
              <path d="M1 1L6.5 4.5L1 8" fill="none" stroke={C.steelStrong} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
            <marker id="ah-red" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
              <path d="M1 1L6.5 4.5L1 8" fill="none" stroke={C.red} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
            <marker id="ah-rail" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
              <path d="M1 1L6.5 4.5L1 8" fill="none" stroke={C.rail} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          {children}
        </svg>
      </div>
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[10px] tabular-nums tracking-[0.16em] text-white/30">
        {fig}
      </span>
      <CaptionStrip label={caption} />
    </figure>
  );
}

export function CaptionStrip({ label }: { label: string }) {
  return (
    <figcaption className="flex items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/34">
      <span className="flex items-center gap-2.5">
        <span className="h-px w-4 bg-steel/50" aria-hidden />
        {label}
      </span>
      <span className="hidden tabular-nums text-white/20 sm:inline">metadata_only</span>
    </figcaption>
  );
}

/* Kept for compat — intentionally renders nothing (no blueprint grid). */
export function ReferencePlane() {
  return null;
}

/* ------------------------------------------------------------------ */
/* SystemSurface — a SOLID system block. State lives in the fill.      */
/* ------------------------------------------------------------------ */

export function SystemSurface({
  x,
  y,
  w,
  h,
  state = "neutral",
  rx = RX,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  state?: "neutral" | "active" | "selected" | "rejected" | "dim";
  rx?: number;
}) {
  const map = {
    neutral: { fill: C.surface, stroke: C.surfaceStroke, sw: 1.4 },
    dim: { fill: C.surfaceDim, stroke: C.surfaceStroke, sw: 1.2 },
    active: { fill: C.steelFillSoft, stroke: C.steelLine, sw: 1.6 },
    selected: { fill: C.steelFill, stroke: C.steelStrong, sw: 2 },
    rejected: { fill: C.redSoft, stroke: C.redLine, sw: 1.6 },
  }[state];
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rx}
      fill={map.fill}
      stroke={map.stroke}
      strokeWidth={map.sw}
      style={{ transition: "fill 0.5s, stroke 0.5s" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Annotation / Label text helpers                                     */
/* ------------------------------------------------------------------ */

export function Annotation({
  x,
  y,
  children,
  anchor = "start",
  state = "neutral",
  size = 13,
  track = 0.2,
  mono = true,
  weight,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  state?: "neutral" | "active" | "selected" | "rejected" | "dim" | "white";
  size?: number;
  track?: number;
  mono?: boolean;
  weight?: number;
}) {
  const fill = {
    neutral: C.text,
    dim: C.dim,
    active: C.steelText,
    selected: C.steelText,
    rejected: C.red,
    white: C.white,
  }[state];
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      letterSpacing={track}
      fill={fill}
      fontWeight={weight}
      className={mono ? "font-mono" : "font-sans"}
      style={{ transition: "fill 0.5s" }}
    >
      {children}
    </text>
  );
}

/* Tiny uppercase engineering tag (e.g. region code). */
export function Tag({
  x,
  y,
  children,
  state = "neutral",
  anchor = "start",
  size = 11,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  state?: "neutral" | "active" | "selected" | "rejected" | "dim" | "white";
  anchor?: "start" | "middle" | "end";
  size?: number;
}) {
  return (
    <Annotation x={x} y={y} anchor={anchor} state={state} size={size} track={1.2}>
      {children}
    </Annotation>
  );
}

/* ------------------------------------------------------------------ */
/* StatusMark — check / cross / dot, drawn with confident weight.      */
/* ------------------------------------------------------------------ */

export function StatusMark({ x, y, kind, r = 7 }: { x: number; y: number; kind: "pass" | "fail" | "idle"; r?: number }) {
  if (kind === "fail") {
    const k = r * 0.5;
    return (
      <g style={{ transition: "opacity 0.4s" }}>
        <circle cx={x} cy={y} r={r} fill="none" stroke={C.red} strokeWidth="1.6" />
        <path d={`M${x - k} ${y - k}L${x + k} ${y + k}M${x + k} ${y - k}L${x - k} ${y + k}`} stroke={C.red} strokeWidth="1.7" strokeLinecap="round" />
      </g>
    );
  }
  if (kind === "pass") {
    return (
      <g style={{ transition: "opacity 0.4s" }}>
        <circle cx={x} cy={y} r={r} fill="none" stroke={C.steelStrong} strokeWidth="1.6" />
        <path d={`M${x - r * 0.42} ${y}L${x - r * 0.08} ${y + r * 0.4}L${x + r * 0.5} ${y - r * 0.42}`} fill="none" stroke={C.steelText} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }
  return <circle cx={x} cy={y} r={2} fill={C.dim} />;
}
