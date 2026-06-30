import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.02 — the predictive world model, drawn as a labelled state schematic.

   A persistent model of the cluster, advanced one control period at a time, so
   a candidate decision can be scored against the state it WILL meet — not the
   state as it is now. The facets shown are conceptual; implementation detail is
   intentionally omitted. Pure black plate, white ink, no motion.
   ============================================================================ */

const FACETS: { name: string; detail: string }[] = [
  { name: "Replica warm / cold state", detail: "warm pool · weights resident · cold-start cost" },
  { name: "Server & rack capacity", detail: "available slots · GPU class · headroom" },
  { name: "Placement & locality", detail: "topology pressure · locality score" },
  { name: "Queue dynamics", detail: "pending work · delay distribution" },
  { name: "Migration in flight", detail: "moves underway · capacity loss · cost" },
  { name: "Cost basis", detail: "operator-$ · warm-hold + migration penalties" },
];

export function WorldModelState({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black uppercase", className)}>
      <PlateHeader fig="fig.02" title="predictive world model" />
      <div className="px-4 py-5">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-stretch md:gap-3">
          {/* container label */}
          <div className="md:w-[150px] md:shrink-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              future state
            </span>
            <div className="mt-2.5 border border-white px-3 py-2.5">
              <div className="font-mono text-[11.5px] leading-tight text-white">Cluster world model</div>
              <div className="mt-1.5 font-mono text-[10px] leading-snug text-white/45">
                a forward model of the fleet, not a snapshot of free GPUs
              </div>
            </div>
          </div>

          {/* facet tiles */}
          <div className="grid flex-1 grid-cols-1 gap-1.5 sm:grid-cols-2">
            {FACETS.map((f) => (
              <div key={f.name} className="border border-white/25 px-3 py-2">
                <div className="font-mono text-[11px] leading-none text-white/90">{f.name}</div>
                <div className="mt-1.5 font-mono text-[9.5px] leading-snug text-white/45">{f.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* transition rule */}
        <div className="mt-4 flex flex-col gap-2 border-t border-white/15 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10.5px] leading-tight text-white/70">
            state(t) → simulate candidate decision → state(t+1)
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/40">
            evaluated read-only, per candidate
          </span>
        </div>
      </div>
      <CaptionStrip label="fig.02 · cluster state advanced one control period at a time" />
    </figure>
  );
}
