import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { StatusTag, KV } from "./bits";

/* Diagram 4 — Live Optimization Decision.
   The evaluator scans each candidate in turn, then settles a verdict: the
   unsafe candidate is rejected, the safe economic improvement is selected,
   and the reasoning is appended to the log. */

const EASE = [0.16, 1, 0.3, 1] as const;

type Verdict = "pass" | "fail" | "select";

const CANDIDATES: {
  id: string;
  action: string;
  cost: number;
  risk: string;
  tags: { state: "pass" | "fail"; label: string }[];
  verdict: Verdict;
}[] = [
  { id: "A", action: "run now", cost: 1.0, risk: "low", tags: [{ state: "pass", label: "sla" }, { state: "pass", label: "capacity" }], verdict: "pass" },
  { id: "B", action: "delay 38m", cost: 0.81, risk: "low", tags: [{ state: "pass", label: "sla" }, { state: "pass", label: "capacity" }], verdict: "select" },
  { id: "C", action: "move region", cost: 0.74, risk: "medium", tags: [{ state: "pass", label: "residency" }, { state: "pass", label: "capacity" }], verdict: "pass" },
  { id: "D", action: "delay 2h", cost: 0.62, risk: "—", tags: [{ state: "fail", label: "sla" }], verdict: "fail" },
];

const LOG_LINES = [
  "decision_candidate.selected delay_38m",
  "constraint.sla.pass",
  "shadow_mode.no_action_taken",
];

export function OptimizationDecisionDiagram() {
  const { ref, inView } = useInView();
  // steps 0-3 scan each candidate; step 4 settles the verdict
  const step = useSequence(5, { enabled: inView, interval: 2200, resting: 4 });
  const settled = step === 4;

  return (
    <div ref={ref} className="w-full p-5 md:p-7">
      {/* incoming workload */}
      <div className="mb-4 rounded-md border border-border bg-card-elevated p-3.5">
        <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/72">
          Batch inference job
        </div>
        <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          <KV k="deadline" v="4h" />
          <KV k="gpus" v="128 × H100" />
          <KV k="duration" v="42m" />
          <KV k="region" v="us only" />
          <KV k="priority" v="flexible" />
          <KV k="access" v="metadata only" vClass="text-white/65" />
        </div>
      </div>

      {/* ranked candidates */}
      <div className="space-y-2">
        {CANDIDATES.map((c, i) => {
          const scanning = step < 4 && step === i;
          const rejected = settled && c.verdict === "fail";
          const selected = settled && c.verdict === "select";

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: rejected ? 0.55 : 1, y: 0 }}
              transition={{ duration: 0.5, delay: inView ? i * 0.08 : 0, ease: EASE }}
              className={cn(
                "rounded-md border px-3 py-2.5 transition-all duration-500",
                selected
                  ? "border-signal/55 bg-signal/[0.05] shadow-[0_12px_36px_-24px_hsl(40_46%_58%/0.5)]"
                  : scanning
                    ? "border-white/22 bg-white/[0.03]"
                    : "border-border bg-card-elevated",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 shrink-0 font-mono text-[11px] text-white/30">{c.id}</span>
                <span className={cn("w-24 shrink-0 font-mono text-[12px]", rejected ? "text-white/40 line-through" : "text-white/80")}>
                  {c.action}
                </span>

                {/* cost index bar */}
                <div className="hidden h-1.5 min-w-12 flex-1 overflow-hidden rounded-full bg-white/5 sm:block">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.cost * 100}%` }}
                    transition={{ duration: 0.7, delay: inView ? i * 0.08 + 0.1 : 0, ease: EASE }}
                    className={cn("h-full rounded-full", selected ? "bg-signal" : rejected ? "bg-destructive/40" : "bg-white/25")}
                  />
                </div>
                <span className={cn("w-12 shrink-0 text-right font-mono text-[11px] tabular-nums", selected ? "text-signal" : "text-white/55")}>
                  {c.cost.toFixed(2)}x
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-8">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">risk {c.risk}</span>
                {(settled || scanning) &&
                  c.tags.map((t) => (
                    <StatusTag key={t.label} state={t.state}>
                      {t.label} {t.state}
                    </StatusTag>
                  ))}
                <AnimatePresence>
                  {selected && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto"
                    >
                      <StatusTag state="gold">selected</StatusTag>
                    </motion.span>
                  )}
                  {rejected && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto">
                      <StatusTag state="fail">rejected</StatusTag>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* explanation + log — reserved fixed height, opacity crossfade only */}
      <div className="relative mt-4 h-[132px]">
        {/* scanning placeholder */}
        <motion.div
          className="absolute inset-0 flex items-center gap-2.5"
          animate={{ opacity: settled ? 0 : 1 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/50 anim-breathe" aria-hidden />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
            scanning candidates · gate checks running
          </span>
        </motion.div>

        {/* resolved verdict */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: settled ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          aria-hidden={!settled}
        >
          <p className="mb-3 text-[12.5px] leading-relaxed text-white/64">
            Selected delay candidate — lower expected cost, SLA-safe, no migration risk.
          </p>
          <div className="rounded-sm border border-border bg-background/60 p-3 font-mono text-[11px] leading-relaxed">
            {LOG_LINES.map((line, i) => (
              <motion.div
                key={line}
                animate={{ opacity: settled ? 1 : 0, x: settled ? 0 : -6 }}
                transition={{ duration: 0.4, delay: settled ? 0.2 + i * 0.18 : 0, ease: EASE }}
                className="text-white/55"
              >
                <span className="text-white/28">append · </span>
                <span className="text-signal">{line}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
