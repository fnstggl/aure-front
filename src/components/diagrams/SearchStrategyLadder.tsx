import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.03 — the adaptive search planner, drawn as a decision ladder.

   The action space is too large to brute-force, but small windows are not — so
   the strategy is chosen from the RAW candidate count, and the loss of any
   approximate search is MEASURED against exhaustive enumeration, not assumed
   away. Thresholds and strategy names are verbatim from
   aurelius/environment/search_planner.py (AdaptiveSearchPlanner). No motion.
   ============================================================================ */

const RUNGS: { cond: string; strategy: string; note: string; strong?: boolean }[] = [
  {
    cond: "raw ≤ 4096",
    strategy: "exhaustive_cartesian",
    note: "full product · deterministic · regret = 0 by construction",
    strong: true,
  },
  {
    cond: "4096 < raw ≤ 20000",
    strategy: "beam_search + local",
    note: "top-6 beam, coordinate polish · exhaustive re-run scores the regret",
    strong: true,
  },
  {
    cond: "raw > 20000",
    strategy: "beam_search",
    note: "top-6 beam · audit skipped for runtime · raw count still reported",
  },
];

export function SearchStrategyLadder({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.03" title="adaptive search planner" />
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
              <span className="w-[152px] shrink-0 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/55">
                {r.cond}
              </span>
              <span
                className={cn(
                  "w-[176px] shrink-0 font-mono text-[12px] leading-none",
                  r.strong ? "text-white" : "text-white/70",
                )}
              >
                {r.strategy}
              </span>
              <span className="font-mono text-[10px] leading-snug text-white/45">{r.note}</span>
            </div>
          ))}
        </div>

        {/* why beam, not coordinate descent */}
        <div className="mt-4 grid gap-2 border-t border-white/15 pt-3.5 sm:grid-cols-2">
          <div className="font-mono text-[10px] leading-snug text-white/55">
            <span className="text-white/85">beam</span> keeps coupled hypotheses — precision×batching,
            routing×cache — so cross-surface optima survive.
          </div>
          <div className="font-mono text-[10px] leading-snug text-white/45">
            <span className="text-white/70">coordinate_descent</span> moves one surface at a time → measured
            regret on coupled cases → demoted to fallback / polish.
          </div>
        </div>
      </div>
      <CaptionStrip label="fig.03 — strategy chosen by candidate count · regret measured, never hidden" />
    </figure>
  );
}
