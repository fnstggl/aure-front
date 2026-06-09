import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { StatusTag, KV } from "./bits";
import { MiniForecastChart } from "./MiniForecastChart";

/* Diagram 2 — Forecast / Control Loop.
   A deterministic loop: Observe, Forecast, Decide, Filter, Log. The active
   stage drives a detail panel below; a dashed arc shows the loop closing. */

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { key: "observe", label: "Observe", note: "Read scheduler metadata only" },
  { key: "forecast", label: "Forecast", note: "Predict cost and carbon with uncertainty bounds" },
  { key: "decide", label: "Decide", note: "Rank run, delay, region, and capacity options" },
  { key: "filter", label: "Filter", note: "Reject unsafe candidates under hard constraints" },
  { key: "log", label: "Log", note: "Record decisions and outcomes, append-only" },
];

export function ControlLoopDiagram() {
  const { ref, inView } = useInView();
  const step = useSequence(STEPS.length, { enabled: inView, interval: 3000, resting: 1 });

  return (
    <div ref={ref} className="w-full p-5 md:p-7">
      {/* Pipeline rail */}
      <div className="relative flex items-stretch gap-1.5">
        {STEPS.map((s, i) => {
          const active = i === step;
          const passed = i < step;
          return (
            <div key={s.key} className="flex min-w-0 flex-1 items-center gap-1.5">
              <motion.div
                animate={{ opacity: active ? 1 : passed ? 0.7 : 0.42, y: active ? -2 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className={cn(
                  "min-w-0 flex-1 rounded-md border px-2 py-2.5 text-center transition-all duration-500",
                  active
                    ? "border-white/22 bg-white/[0.05] shadow-[0_12px_36px_-24px_hsl(0_0%_100%/0.18)]"
                    : "border-border bg-card-elevated",
                )}
              >
                <div className="font-mono text-[10px] tabular-nums text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className={cn(
                    "mt-0.5 truncate font-mono text-[10.5px] uppercase tracking-[0.12em]",
                    active ? "text-white/85" : "text-white/72",
                  )}
                >
                  {s.label}
                </div>
              </motion.div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn("h-px w-3 shrink-0 md:w-5", i + 1 === step ? "rail-x" : "bg-border")}
                  aria-hidden
                />
              )}
            </div>
          );
        })}

        {/* loop-return arc */}
        <svg
          className="pointer-events-none absolute -bottom-3 left-0 h-5 w-full"
          viewBox="0 0 100 6"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M97,1 C97,5 97,5 50,5 C3,5 3,5 3,1"
            fill="none"
            stroke="hsl(0 0% 100% / 0.26)"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
            className={inView ? "flow-dash" : ""}
          />
        </svg>
      </div>

      <div className="mt-2 flex items-center gap-2 pl-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/28">loop</span>
        <span className="h-px flex-1 bg-transparent" />
      </div>

      {/* Detail panel for the active stage */}
      <div className="mt-5 h-[176px] overflow-hidden rounded-md border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/85">
            {STEPS[step].label}
          </span>
          <span className="font-mono text-[10px] text-white/30">stage {step + 1}/5</span>
        </div>
        <p className="mb-3 text-[12.5px] text-white/55">{STEPS[step].note}</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={STEPS[step].key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {step === 0 && (
              <div className="grid gap-1.5 sm:grid-cols-2">
                <KV k="job" v="batch_inference" />
                <KV k="gpus" v="128 × H100" />
                <KV k="deadline" v="4h" />
                <KV k="access" v="metadata only" vClass="text-white/65" />
              </div>
            )}
            {step === 1 && <MiniForecastChart active className="h-[96px] w-full" />}
            {step === 2 && (
              <div className="space-y-2">
                {[
                  { name: "delay 38m", cost: 0.81, w: "81%" },
                  { name: "move region", cost: 0.74, w: "74%" },
                  { name: "run now", cost: 1.0, w: "100%" },
                ].map((o, idx) => (
                  <div key={o.name} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 font-mono text-[11px] text-white/60">{o.name}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: o.w }}
                        transition={{ duration: 0.7, delay: idx * 0.08, ease: EASE }}
                        className={cn("h-full rounded-full", idx === 0 ? "bg-signal" : "bg-white/25")}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-white/60">
                      {o.cost.toFixed(2)}x
                    </span>
                  </div>
                ))}
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-wrap gap-2">
                <StatusTag state="pass">sla</StatusTag>
                <StatusTag state="pass">capacity</StatusTag>
                <StatusTag state="pass">residency</StatusTag>
                <StatusTag state="pass">power</StatusTag>
                <StatusTag state="fail">delay 2h · sla</StatusTag>
              </div>
            )}
            {step === 4 && (
              <div className="rounded-sm border border-border bg-background/60 p-2.5 font-mono text-[11px] leading-relaxed text-white/55">
                <span className="text-white/30">14:01:23 </span>
                <span className="text-signal">candidate.delay </span>
                expected_savings=18.4% sla=pass
                <span className="anim-cursor text-signal">▍</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
