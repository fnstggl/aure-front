import { cn } from "@/lib/utils";
import type { WorkloadClass, WorkloadKind } from "./types";

/* ============================================================================
   Workload map — the memo's signature visual.
   Sorts a company's workload classes into three lanes along a single axis that
   runs from the latency-critical path (fixed) to freely schedulable (movable).
   Outline-only, monochrome + brass — same schematic language as the site's
   system diagrams. Fully driven by `classes`; edit the config, not this file.
   ============================================================================ */

const KIND_META: Record<
  WorkloadKind,
  { lane: string; sub: string; dot: string; bar: string; text: string; order: number }
> = {
  "sla-critical": {
    lane: "SLA-critical",
    sub: "on the critical path",
    dot: "bg-white",
    bar: "border-l-white/70",
    text: "text-foreground",
    order: 0,
  },
  flexible: {
    lane: "Flexible",
    sub: "schedulable within bounds",
    dot: "bg-white/45",
    bar: "border-l-white/28",
    text: "text-white/80",
    order: 1,
  },
  shiftable: {
    lane: "Potentially shiftable",
    sub: "movable across time · region · backend",
    dot: "bg-accent-gold",
    bar: "border-accent-gold/55",
    text: "text-accent-gold",
    order: 2,
  },
};

const LANE_ORDER: WorkloadKind[] = ["sla-critical", "flexible", "shiftable"];

function WorkloadChip({ w }: { w: WorkloadClass }) {
  const meta = KIND_META[w.kind];
  return (
    <div
      className={cn(
        "border border-border border-l-2 bg-white/[0.012] px-3.5 py-3 transition-colors duration-300",
        meta.bar,
      )}
    >
      <div className={cn("text-[13.5px] font-medium leading-tight tracking-tight", meta.text)}>
        {w.name}
      </div>
      {w.note && <p className="mt-1.5 text-[11.5px] leading-snug text-white/42">{w.note}</p>}
    </div>
  );
}

function Lane({ kind, classes }: { kind: WorkloadKind; classes: WorkloadClass[] }) {
  const meta = KIND_META[kind];
  const items = classes.filter((c) => c.kind === kind);
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center gap-2.5">
        <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/72">
          {meta.lane}
        </span>
        <span className="font-mono text-[10px] tabular-nums text-white/28">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/28">
        {meta.sub}
      </div>
      <div className="flex flex-col gap-2.5">
        {items.length ? (
          items.map((w) => <WorkloadChip key={w.name} w={w} />)
        ) : (
          <div className="border border-dashed border-border px-3.5 py-3 text-[11.5px] text-white/25">
            none mapped
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkloadMap({
  classes,
  note,
}: {
  classes: WorkloadClass[];
  note?: React.ReactNode;
}) {
  return (
    <figure className="relative overflow-hidden rounded-lg border border-strong bg-card">
      {/* Plate header — matches the site's diagram figures */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-white/[0.015] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="border border-border-strong px-1.5 py-0.5 font-mono text-[10px] tabular-nums leading-none tracking-[0.14em] text-white/60">
            FIG.01
          </span>
          <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.2em] text-white/62">
            workload classification
          </span>
        </div>
        <span className="hidden font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-white/24 sm:inline">
          schematic
        </span>
      </div>

      {/* Axis label: fixed → movable */}
      <div className="flex items-center gap-3 px-5 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
        <span className="text-white/55">critical path · fixed</span>
        <span className="ledger-rule h-px flex-1" aria-hidden />
        <span className="text-accent-gold/80">free to schedule · movable</span>
      </div>

      {/* Three lanes */}
      <div className="grid gap-x-6 gap-y-8 p-5 md:grid-cols-3">
        {LANE_ORDER.map((kind) => (
          <Lane key={kind} kind={kind} classes={classes} />
        ))}
      </div>

      {note && (
        <figcaption className="border-t border-border px-5 py-3 text-[12px] leading-relaxed text-white/45">
          {note}
        </figcaption>
      )}
    </figure>
  );
}
