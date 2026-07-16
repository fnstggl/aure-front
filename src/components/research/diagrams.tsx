import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { Arrow } from "@/components/site/primitives";
import type { MatrixFlag, WorkloadRow } from "./types";

/* ============================================================================
   Reusable Aurelius research diagrams.
   Sharp-cornered (90°), outline-only, thin lines, white = structure, brass =
   the Aurelius / selected path. No loud icons, minimal motion. Built to be
   reused across every company memo. A, C, D are generic; B is data-driven.
   ============================================================================ */

/** Shared figure frame: labeled header bar + sharp border + caption strip. */
function PlateFrame({
  fig,
  title,
  caption,
  children,
  className,
}: {
  fig: string;
  title: string;
  caption?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("relative overflow-hidden border border-strong bg-card", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-border bg-white/[0.015] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="border border-border-strong px-1.5 py-0.5 font-mono text-[10px] tabular-nums leading-none tracking-[0.14em] text-white/60">
            {fig}
          </span>
          <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.2em] text-white/62">
            {title}
          </span>
        </div>
        <span className="hidden font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-white/24 sm:inline">
          schematic
        </span>
      </header>
      <div className="relative">{children}</div>
      {caption && (
        <figcaption className="border-t border-border px-4 py-2.5 text-[11.5px] leading-relaxed text-white/45">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram A — Fleet Economics Map                                     */
/* Where Aurelius fits: a value pipeline, not a scheduler replacement. */
/* ------------------------------------------------------------------ */

type StationKind = "neutral" | "aurelius" | "outcome";

function Station({ label, kind = "neutral" }: { label: string; kind?: StationKind }) {
  return (
    <div
      className={cn(
        "flex min-h-[60px] flex-1 items-center justify-center border px-3 py-2.5 text-center",
        kind === "aurelius"
          ? "border-accent-gold/55 bg-accent-gold-faint"
          : kind === "outcome"
            ? "border-white/40 bg-white/[0.025]"
            : "border-border bg-white/[0.012]",
      )}
    >
      <span
        className={cn(
          "text-[12px] font-medium leading-snug tracking-tight",
          kind === "aurelius"
            ? "text-accent-gold"
            : kind === "outcome"
              ? "text-foreground"
              : "text-white/70",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex shrink-0 items-center justify-center py-0.5 md:px-1.5">
      <Arrow className="h-3.5 w-3.5 rotate-90 text-white/28 md:rotate-0" />
    </div>
  );
}

export function FleetEconomicsMap() {
  const stations: { label: string; kind?: StationKind }[] = [
    { label: "Latency-critical demand" },
    { label: "Reserved headroom" },
    { label: "Flexible workloads" },
    { label: "Economic scheduler", kind: "aurelius" },
    { label: "Higher SLA-safe goodput / $", kind: "outcome" },
  ];
  return (
    <PlateFrame
      fig="FIG.A"
      title="Fleet economics map"
      caption="Aurelius does not replace the scheduler. It identifies which scheduling decisions create more economic value."
    >
      <div className="flex flex-col gap-2 p-5 md:flex-row md:items-stretch md:gap-0">
        {stations.map((s, i) => (
          <Fragment key={s.label}>
            <Station label={s.label} kind={s.kind} />
            {i < stations.length - 1 && <FlowArrow />}
          </Fragment>
        ))}
      </div>
    </PlateFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram B — Workload Flexibility Matrix (data-driven)              */
/* ------------------------------------------------------------------ */

function Flag({ v }: { v: MatrixFlag }) {
  if (v === "yes") {
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-label="yes" className="text-accent-gold">
        <path d="M2.5 6.8 5 9.2 10.5 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      </svg>
    );
  }
  if (v === "partial") {
    return <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" aria-label="partial" />;
  }
  return <span className="inline-block h-px w-3 bg-white/18" aria-label="no" />;
}

const MATRIX_COLS = ["Latency", "Deadline", "Region", "Economic"] as const;
// Tight enough that all five columns fit a phone; expands to fill on desktop.
const GRID = "grid-cols-[minmax(94px,1.25fr)_repeat(4,minmax(46px,1fr))]";

export function WorkloadFlexibilityMatrix({ rows }: { rows: WorkloadRow[] }) {
  return (
    <PlateFrame
      fig="FIG.B"
      title="Workload flexibility matrix"
      caption="✓ applies · • partial · — does not apply.  Columns: latency-bound, deadline-bound, region-shiftable, economically schedulable."
    >
      <div className="overflow-x-auto">
        <div className="min-w-[294px]">
          {/* header */}
          <div className={cn("grid border-b border-border bg-white/[0.015]", GRID)}>
            <div className="px-3 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/45 sm:px-4 sm:text-[10px]">
              Workload
            </div>
            {MATRIX_COLS.map((c) => (
              <div
                key={c}
                className="border-l border-border px-1 py-2.5 text-center font-mono text-[8px] uppercase tracking-normal text-white/45 sm:text-[10px] sm:tracking-[0.12em]"
              >
                {c}
              </div>
            ))}
          </div>
          {/* rows */}
          {rows.map((r) => (
            <div key={r.name} className={cn("grid border-b border-border last:border-b-0", GRID)}>
              <div className="px-3 py-3 sm:px-4">
                <div className="text-[12.5px] font-medium leading-tight tracking-tight text-foreground sm:text-[13px]">
                  {r.name}
                </div>
                <div className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-white/36 sm:text-[10px] sm:tracking-[0.1em]">
                  {r.tag}
                </div>
              </div>
              {[r.latencyBound, r.deadlineBound, r.regionShiftable, r.economicallySchedulable].map(
                (v, i) => (
                  <div key={i} className="flex items-center justify-center border-l border-border px-1 py-3">
                    <Flag v={v} />
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </PlateFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram C — Current Objective vs Economic Objective                */
/* ------------------------------------------------------------------ */

function UtilBar({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 w-full bg-white/[0.06]">
      <div className="h-full bg-white/55" style={{ width: `${pct}%` }} />
    </div>
  );
}

function PoolRow({ label, pct, cost, costTone }: { label: string; pct: number; cost: string; costTone: "brass" | "white" }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3">
      <div className="min-w-0">
        <div className="truncate font-mono text-[10.5px] tracking-tight text-white/50">{label}</div>
        <div className="mt-1.5 flex items-center gap-2">
          <UtilBar pct={pct} />
          <span className="shrink-0 font-mono text-[10px] tabular-nums text-white/40">{pct}%</span>
        </div>
      </div>
      <span
        className={cn(
          "shrink-0 font-mono text-[13px] tabular-nums",
          costTone === "brass" ? "text-accent-gold" : "text-foreground",
        )}
      >
        {cost}
      </span>
    </div>
  );
}

function LockTag() {
  return (
    <span className="inline-flex items-center gap-1.5 border border-white/25 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/60">
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
        <rect x="1.5" y="4" width="6" height="4" stroke="currentColor" strokeWidth="1" />
        <path d="M3 4V3a1.5 1.5 0 0 1 3 0v1" stroke="currentColor" strokeWidth="1" />
      </svg>
      SLA locked
    </span>
  );
}

export function ObjectiveComparison() {
  return (
    <PlateFrame
      fig="FIG.C"
      title="Objective: utilization vs economics"
      caption="Utilization can read healthy while marginal tokens stay economically inefficient. Same SLAs, cheaper admissible operating point."
    >
      <div className="grid md:grid-cols-2">
        {/* Current */}
        <div className="border-b border-border p-5 md:border-b-0 md:border-r">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            Current objective
          </div>
          <div className="mt-1 text-[14px] font-medium tracking-tight text-foreground">
            Keep utilization high
          </div>
          <div className="mt-5 space-y-3.5">
            <PoolRow label="pool · latency-tuned" pct={91} cost="×1.0" costTone="white" />
            <PoolRow label="pool · mixed" pct={88} cost="×2.3" costTone="brass" />
            <PoolRow label="pool · latency-tuned" pct={90} cost="×4.0" costTone="brass" />
          </div>
          <p className="mt-5 text-[11.5px] leading-relaxed text-white/42">
            Similar utilization, up to ~4× marginal-cost spread on identical hardware.
          </p>
        </div>
        {/* Aurelius */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-gold/80">
                Aurelius objective
              </div>
              <div className="mt-1 text-[14px] font-medium tracking-tight text-foreground">
                Maximize SLA-safe goodput / $
              </div>
            </div>
            <LockTag />
          </div>
          <div className="mt-5 space-y-3.5">
            <PoolRow label="pool · latency-tuned" pct={91} cost="×1.0" costTone="white" />
            <PoolRow label="pool → cheaper point" pct={89} cost="×1.3" costTone="white" />
            <PoolRow label="pool → cheaper point" pct={90} cost="×1.4" costTone="white" />
          </div>
          <p className="mt-5 flex items-center gap-2 text-[11.5px] leading-relaxed text-white/52">
            <Arrow className="h-3 w-3 text-accent-gold" />
            Relaxed-SLA traffic re-pointed to cheaper operating points. Constraints unchanged.
          </p>
        </div>
      </div>
    </PlateFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram D — Shadow Replay Flow                                      */
/* ------------------------------------------------------------------ */

function FlowNode({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "brass" | "source" }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border px-3 py-2.5 text-center text-[11.5px] font-medium leading-snug tracking-tight",
        tone === "brass"
          ? "border-accent-gold/50 bg-accent-gold-faint text-accent-gold"
          : tone === "source"
            ? "border-white/40 bg-white/[0.025] text-foreground"
            : "border-border bg-white/[0.012] text-white/72",
      )}
    >
      {label}
    </div>
  );
}

function Branch({ a, b, tone }: { a: string; b: string; tone: "neutral" | "brass" }) {
  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-0">
      <div className="flex-1">
        <FlowNode label={a} tone={tone} />
      </div>
      <Arrow className="mx-auto h-3.5 w-3.5 rotate-90 text-white/28 sm:mx-1.5 sm:rotate-0" />
      <div className="flex-1">
        <FlowNode label={b} tone={tone === "brass" ? "brass" : "source"} />
      </div>
    </div>
  );
}

export function ShadowReplayFlow() {
  const metrics = [
    "SLA-safe goodput / $",
    "GPU-hours",
    "Queue time",
    "SLA violations",
    "Regional cost exposure",
  ];
  return (
    <PlateFrame
      fig="FIG.D"
      title="Shadow replay flow"
      caption="One source of truth, two policies, one comparison. Nothing is re-executed in production."
    >
      <div className="grid gap-4 p-5 lg:grid-cols-[180px_1fr_220px] lg:items-center lg:gap-5">
        <FlowNode label="Historical scheduler logs" tone="source" />

        <div className="flex flex-col gap-3">
          <Branch a="Current scheduler replay" b="Observed baseline" tone="neutral" />
          <Branch a="Aurelius counterfactual" b="Economic policy result" tone="brass" />
        </div>

        <div className="border border-border bg-white/[0.012] p-3.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Compare</div>
          <ul className="mt-2.5 space-y-1.5">
            {metrics.map((m) => (
              <li key={m} className="flex items-center gap-2 text-[11.5px] text-white/62">
                <span className="h-1 w-1 shrink-0 bg-accent-gold/80" aria-hidden />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PlateFrame>
  );
}
