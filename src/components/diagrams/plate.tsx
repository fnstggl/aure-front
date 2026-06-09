import { useId } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   Aurelius diagram language — authored infrastructure topology plates.

   One coherent visual system across every diagram: a dark plate, a faint
   reference plane, recessed system surfaces, precise rails and flow paths,
   gates and boundaries, an audit ledger, and engineering annotations.

   Semantics (restrained):
     white  = truth / primary
     gray   = inactive / neutral
     steel  = selected / approved / active control + metadata path
     red    = rejected / blocked / unsafe
   No gold, no glow, no bright blue, no decorative gradients.
   ============================================================================ */

export const C = {
  grid: "hsl(0 0% 100% / 0.038)",
  gridStrong: "hsl(0 0% 100% / 0.07)",
  plane: "hsl(0 0% 100% / 0.016)",
  planeStroke: "hsl(0 0% 100% / 0.07)",
  surface: "hsl(0 0% 100% / 0.028)",
  surfaceStroke: "hsl(0 0% 100% / 0.10)",
  rail: "hsl(0 0% 100% / 0.13)",
  faint: "hsl(0 0% 100% / 0.22)",
  dim: "hsl(0 0% 100% / 0.34)",
  label: "hsl(0 0% 100% / 0.50)",
  text: "hsl(0 0% 100% / 0.66)",
  white: "hsl(0 0% 95%)",
  /* deep navy steel — selected / active control path */
  steelFill: "hsl(216 21% 29% / 0.5)",
  steelFillSoft: "hsl(216 21% 29% / 0.22)",
  steelLine: "hsl(216 23% 40%)",
  steelStrong: "hsl(216 23% 46%)",
  steelText: "hsl(217 16% 62%)",
  /* muted red — rejected / blocked */
  red: "hsl(1 44% 46%)",
  redSoft: "hsl(1 44% 42% / 0.16)",
  redLine: "hsl(1 44% 42% / 0.6)",
} as const;

export const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* TopologyPlate — figure wrapper: reference plane + figure label +    */
/* caption strip. Children are SVG drawn in the given viewBox.         */
/* ------------------------------------------------------------------ */

export function TopologyPlate({
  fig,
  caption,
  vb,
  minWidth = 760,
  plane = true,
  className,
  children,
}: {
  fig: string;
  caption: string;
  vb: [number, number];
  minWidth?: number;
  plane?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const id = useId().replace(/:/g, "");
  const [w, h] = vb;
  return (
    <figure className={cn("relative overflow-hidden rounded-lg border border-border bg-card", className)}>
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="block w-full"
          style={{ minWidth }}
          role="img"
          aria-label={caption}
        >
          {plane && <ReferencePlane id={id} w={w} h={h} />}
          {children}
        </svg>
      </div>
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[10px] tabular-nums tracking-[0.16em] text-white/22">
        {fig}
      </span>
      <CaptionStrip label={caption} />
    </figure>
  );
}

export function CaptionStrip({ label }: { label: string }) {
  return (
    <figcaption className="flex items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/30">
      <span className="flex items-center gap-2.5">
        <span className="h-px w-4 bg-steel/40" aria-hidden />
        {label}
      </span>
      <span className="hidden tabular-nums text-white/18 sm:inline">metadata_only</span>
    </figcaption>
  );
}

/* ------------------------------------------------------------------ */
/* ReferencePlane — faint coordinate grid, fading toward the edges.    */
/* ------------------------------------------------------------------ */

export function ReferencePlane({ id, w, h }: { id: string; w: number; h: number }) {
  return (
    <g aria-hidden>
      <defs>
        <pattern id={`grid-${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={C.grid} strokeWidth="1" />
        </pattern>
        <radialGradient id={`fade-${id}`} cx="50%" cy="42%" r="72%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="62%" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`mask-${id}`}>
          <rect x="0" y="0" width={w} height={h} fill={`url(#fade-${id})`} />
        </mask>
      </defs>
      <rect x="0" y="0" width={w} height={h} fill={`url(#grid-${id})`} mask={`url(#mask-${id})`} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* SystemSurface — a recessed infrastructure plane (not a card).       */
/* ------------------------------------------------------------------ */

export function SystemSurface({
  x,
  y,
  w,
  h,
  state = "neutral",
  rx = 6,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  state?: "neutral" | "active" | "selected" | "rejected" | "dim";
  rx?: number;
}) {
  const map = {
    neutral: { fill: C.surface, stroke: C.surfaceStroke, opacity: 1 },
    dim: { fill: C.plane, stroke: C.planeStroke, opacity: 0.5 },
    active: { fill: C.steelFillSoft, stroke: C.steelLine, opacity: 1 },
    selected: { fill: C.steelFill, stroke: C.steelStrong, opacity: 1 },
    rejected: { fill: C.redSoft, stroke: C.redLine, opacity: 0.7 },
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
      strokeWidth="1"
      opacity={map.opacity}
      style={{ transition: "opacity 0.5s, fill 0.5s, stroke 0.5s" }}
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
  track = 0.4,
  mono = true,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  state?: "neutral" | "active" | "selected" | "rejected" | "dim" | "white";
  size?: number;
  track?: number;
  mono?: boolean;
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
      className={mono ? "font-mono" : "font-sans"}
      style={{ transition: "fill 0.5s" }}
    >
      {children}
    </text>
  );
}

/* Tiny uppercase engineering tag on a plate (e.g. region code). */
export function Tag({
  x,
  y,
  children,
  state = "neutral",
  anchor = "start",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  state?: "neutral" | "active" | "selected" | "rejected" | "dim" | "white";
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <Annotation x={x} y={y} anchor={anchor} state={state} size={11} track={1.4}>
      {children}
    </Annotation>
  );
}

/* ------------------------------------------------------------------ */
/* StatusMark — check / cross / dot                                    */
/* ------------------------------------------------------------------ */

export function StatusMark({ x, y, kind, r = 7 }: { x: number; y: number; kind: "pass" | "fail" | "idle"; r?: number }) {
  if (kind === "fail") {
    const k = r * 0.5;
    return (
      <g style={{ transition: "opacity 0.4s" }}>
        <circle cx={x} cy={y} r={r} fill="none" stroke={C.red} strokeWidth="1.2" />
        <path d={`M${x - k} ${y - k}L${x + k} ${y + k}M${x + k} ${y - k}L${x - k} ${y + k}`} stroke={C.red} strokeWidth="1.3" strokeLinecap="round" />
      </g>
    );
  }
  if (kind === "pass") {
    return (
      <g style={{ transition: "opacity 0.4s" }}>
        <circle cx={x} cy={y} r={r} fill="none" stroke={C.steelStrong} strokeWidth="1.2" />
        <path d={`M${x - r * 0.42} ${y}L${x - r * 0.08} ${y + r * 0.4}L${x + r * 0.5} ${y - r * 0.42}`} fill="none" stroke={C.steelText} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }
  return <circle cx={x} cy={y} r={2} fill={C.dim} />;
}
