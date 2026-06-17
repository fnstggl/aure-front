import { cn } from "@/lib/utils";

/* ============================================================================
   Aurelius diagram language — enterprise infrastructure schematics.

   HARD RULES (monochrome):
     • Color is ONLY black / white / red. White = structure + active/selected.
       Red = error / rejected / blocked. Nothing else.
     • OUTLINE ONLY. No fill backgrounds on boxes — ever. State is carried by
       stroke brightness + weight, not by fill.
     • 100% sharp corners (rx = 0). No rounding anywhere.
     • Straight / orthogonal connectors only. No curved lines (the single
       exception across the whole site is the fig.02 price curve).
   ============================================================================ */

export const C = {
  /* monochrome line system — lifted for legibility on near-black plates */
  line: "hsl(0 0% 100% / 0.66)",
  lineDim: "hsl(0 0% 100% / 0.44)",
  lineFaint: "hsl(0 0% 100% / 0.22)",
  rail: "hsl(0 0% 100% / 0.34)",
  hair: "hsl(0 0% 100% / 0.14)",
  faint: "hsl(0 0% 100% / 0.4)",
  dim: "hsl(0 0% 100% / 0.56)",
  label: "hsl(0 0% 100% / 0.74)",
  text: "hsl(0 0% 100% / 0.88)",
  white: "hsl(0 0% 99%)",

  /* "selected / active" == bright white. Fills are none (outline only). */
  steelFill: "none",
  steelFillSoft: "none",
  steelLine: "hsl(0 0% 100% / 0.9)",
  steelStrong: "hsl(0 0% 100%)",
  steelText: "hsl(0 0% 100%)",

  /* red — error / rejected / blocked */
  red: "hsl(2 62% 58%)",
  redSoft: "none",
  redLine: "hsl(2 60% 56%)",

  /* legacy structural aliases — all fills collapse to none */
  surface: "none",
  surfaceStroke: "hsl(0 0% 100% / 0.44)",
  surfaceDim: "none",
  plane: "none",
  planeStroke: "hsl(0 0% 100% / 0.28)",
  grid: "hsl(0 0% 100% / 0.14)",
  gridStrong: "hsl(0 0% 100% / 0.26)",
} as const;

export const EASE = [0.16, 1, 0.3, 1] as const;
export const RX = 0; // 100% sharp — no rounding anywhere

/* markerEnd helper — fixed global ids so any diagram can point a connector. */
export function arrow(tone: "steel" | "red" | "rail" = "steel") {
  return `url(#ah-${tone})`;
}

/* ------------------------------------------------------------------ */
/* TopologyPlate — flat figure wrapper. No grid, no ticks, no fills.   */
/* ------------------------------------------------------------------ */

export function TopologyPlate({
  fig,
  title,
  caption,
  vb,
  minWidth = 760,
  className,
  children,
}: {
  fig: string;
  title?: string;
  caption: string;
  vb: [number, number];
  minWidth?: number;
  plane?: boolean; // accepted for compat; intentionally unused
  className?: string;
  children: React.ReactNode;
}) {
  const [w, h] = vb;
  return (
    <figure className={cn("relative overflow-hidden border border-strong bg-card", className)}>
      <PlateHeader fig={fig} title={title ?? caption} />
      <div className="relative overflow-x-auto">
        {/* On desktop (md+) the SVG holds its authored min-width and the row
            scrolls if needed. On mobile we drop the min-width so the SVG scales
            down to the screen width (viewBox keeps it crisp) — no side-scroll. */}
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="block w-full md:[min-width:var(--plate-min-w)]"
          style={{ "--plate-min-w": `${minWidth}px` } as React.CSSProperties}
          role="img"
          aria-label={caption}
        >
          <defs>
            <marker id="ah-steel" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto">
              <path d="M1 1L7 4.5L1 8" fill="none" stroke={C.steelStrong} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" />
            </marker>
            <marker id="ah-red" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto">
              <path d="M1 1L7 4.5L1 8" fill="none" stroke={C.red} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" />
            </marker>
            <marker id="ah-rail" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto">
              <path d="M1 1L7 4.5L1 8" fill="none" stroke={C.rail} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" />
            </marker>
          </defs>
          {children}
        </svg>
      </div>
      <CaptionStrip label={caption} />
    </figure>
  );
}

/* PlateHeader — the labeled top bar of every figure. A monospace FIG chip plus
   a short uppercase title, framed by a hairline. Replaces the old floating
   corner label (which overlapped content on mobile and on dense plates) and
   makes each diagram read as an authored technical figure. */
export function PlateHeader({ fig, title }: { fig: string; title: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-white/[0.015] px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span className="border border-border-strong px-1.5 py-0.5 font-mono text-[10px] tabular-nums leading-none tracking-[0.14em] text-white/60">
          {fig.toUpperCase()}
        </span>
        <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.2em] text-white/62">
          {title}
        </span>
      </div>
      <span className="hidden font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-white/24 sm:inline">
        schematic
      </span>
    </div>
  );
}

export function CaptionStrip({ label }: { label: string }) {
  return (
    <figcaption className="flex items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/42">
      <span className="flex items-center gap-2.5">
        <span className="h-px w-4 bg-white/40" aria-hidden />
        {label}
      </span>
      <span className="hidden tabular-nums text-white/22 sm:inline">metadata_only</span>
    </figcaption>
  );
}

/* Kept for compat — intentionally renders nothing (no blueprint grid). */
export function ReferencePlane() {
  return null;
}

/* ------------------------------------------------------------------ */
/* SystemSurface — an OUTLINE-ONLY block. No fill, sharp corners.      */
/* State lives entirely in stroke brightness + weight.                 */
/* ------------------------------------------------------------------ */

export function SystemSurface({
  x,
  y,
  w,
  h,
  state = "neutral",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  state?: "neutral" | "active" | "selected" | "rejected" | "dim";
  rx?: number;
}) {
  const map = {
    neutral: { stroke: C.lineDim, sw: 1.4 },
    dim: { stroke: C.lineFaint, sw: 1.2 },
    active: { stroke: C.steelLine, sw: 1.8 },
    selected: { stroke: C.steelStrong, sw: 2.4 },
    rejected: { stroke: C.redLine, sw: 1.8 },
  }[state];
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={0}
      fill="none"
      stroke={map.stroke}
      strokeWidth={map.sw}
      style={{ transition: "stroke 0.5s, stroke-width 0.5s" }}
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
    active: C.white,
    selected: C.white,
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
/* StatusMark — check (white) / cross (red). Sharp, square caps.       */
/* ------------------------------------------------------------------ */

export function StatusMark({ x, y, kind, r = 7 }: { x: number; y: number; kind: "pass" | "fail" | "idle"; r?: number }) {
  if (kind === "fail") {
    const k = r * 0.5;
    return (
      <g style={{ transition: "opacity 0.4s" }}>
        <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill="none" stroke={C.red} strokeWidth="1.6" />
        <path d={`M${x - k} ${y - k}L${x + k} ${y + k}M${x + k} ${y - k}L${x - k} ${y + k}`} stroke={C.red} strokeWidth="1.7" strokeLinecap="square" />
      </g>
    );
  }
  if (kind === "pass") {
    return (
      <g style={{ transition: "opacity 0.4s" }}>
        <rect x={x - r} y={y - r} width={r * 2} height={r * 2} fill="none" stroke={C.steelStrong} strokeWidth="1.6" />
        <path d={`M${x - r * 0.42} ${y}L${x - r * 0.06} ${y + r * 0.4}L${x + r * 0.5} ${y - r * 0.44}`} fill="none" stroke={C.steelStrong} strokeWidth="1.7" strokeLinecap="square" strokeLinejoin="miter" />
      </g>
    );
  }
  return <rect x={x - 2} y={y - 2} width={4} height={4} fill={C.dim} />;
}
