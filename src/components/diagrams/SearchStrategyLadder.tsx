import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.03 — coupled-bundle search, drawn as a decision ladder.

   Aurelius evaluates coupled decision bundles rather than tuning one knob at a
   time. The search method scales with the size of the space, and where exact
   enumeration is tractable the approximate search is checked against it. Exact
   thresholds and tuning are intentionally omitted. No motion.
   ============================================================================ */

const RUNGS: { cond: string; strategy: string; note: string; strong?: boolean }[] = [
  {
    cond: "Small spaces",
    strategy: "exhaustive evaluation",
    note: "every coupled bundle scored · exact · the basis for regret audits",
    strong: true,
  },
  {
    cond: "Structured medium spaces",
    strategy: "beam-style search + local improvement",
    note: "keeps coupled hypotheses alive — captures cross-surface interactions",
    strong: true,
  },
  {
    cond: "Large / strongly-coupled spaces",
    strategy: "bounded exploration",
    note: "seeded, deterministic, runtime-bounded local search",
  },
];

export function SearchStrategyLadder({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.03" title="coupled-bundle search" />
      <div className="px-4 py-5">
        <div className="grid gap-2.5">
          {RUNGS.map((r) => (
            <div
              key={r.strategy}
              className={cn(
                "flex flex-col gap-2 border px-3.5 py-3 sm:flex-row sm:items-center sm:gap-4",
                r.strong ? "border-white" : "border-white/25",
              )}
            >
              <span className="w-[176px] shrink-0 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/55">
                {r.cond}
              </span>
              <span
                className={cn(
                  "w-[210px] shrink-0 font-mono text-[12px] leading-snug",
                  r.strong ? "text-white" : "text-white/70",
                )}
              >
                {r.strategy}
              </span>
              <span className="font-mono text-[10px] leading-snug text-white/45">{r.note}</span>
            </div>
          ))}
        </div>

        {/* regret audit — the discipline, not the internals */}
        <div className="mt-4 border-t border-white/15 pt-3.5">
          <span className="font-mono text-[10px] leading-snug text-white/55">
            Where exact enumeration is tractable, the approximate search is scored against it —{" "}
            <span className="text-white/85">regret is measured, not assumed.</span>
          </span>
        </div>
      </div>
      <CaptionStrip label="fig.03 — coupled decision bundles, evaluated by a size-aware search" />
    </figure>
  );
}
