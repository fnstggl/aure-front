import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";

/* Problem-section visual — an energy-price curve over a queue of jobs.
   Naive scheduling runs flexible jobs through the peak window; Aurelius
   proposes safe shifts into the lower-cost window while locked jobs hold. */

const EASE = [0.16, 1, 0.3, 1] as const;

type Job = { label: string; locked: boolean; peak: number; low: number; width: number; row: number };

const JOBS: Job[] = [
  { label: "realtime", locked: true, peak: 8, low: 8, width: 18, row: 0 },
  { label: "batch", locked: false, peak: 30, low: 66, width: 22, row: 1 },
  { label: "training", locked: false, peak: 40, low: 72, width: 16, row: 2 },
  { label: "fine-tune", locked: true, peak: 14, low: 14, width: 14, row: 3 },
];

export function QueueShiftDiagram() {
  const { ref, inView } = useInView();
  // 0 = naive scheduler, 1 = Aurelius proposal
  const mode = useSequence(2, { enabled: inView, interval: 5200, resting: 1 });

  return (
    <div ref={ref} className="w-full p-5 md:p-7">
      {/* price curve */}
      <svg viewBox="0 0 100 26" className="h-16 w-full" preserveAspectRatio="none" role="img" aria-label="Energy price across the scheduling window">
        <defs>
          <linearGradient id="peakfill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(0 0% 100% / 0.12)" />
            <stop offset="100%" stopColor="hsl(0 0% 100% / 0)" />
          </linearGradient>
        </defs>
        {/* expensive hump left-of-centre, cheap valley right */}
        <path d="M0,18 C18,16 26,4 40,5 C54,6 60,20 74,20 C86,20 92,17 100,17 L100,26 L0,26 Z" fill="url(#peakfill)" />
        <path d="M0,18 C18,16 26,4 40,5 C54,6 60,20 74,20 C86,20 92,17 100,17" fill="none" stroke="hsl(0 0% 100% / 0.35)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        {/* low-cost window guide */}
        <line x1="74" x2="74" y1="0" y2="26" stroke="hsl(40 46% 58% / 0.4)" strokeWidth="0.5" strokeDasharray="1.5 2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mb-3 flex justify-between font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/35">
        <span>peak pricing</span>
        <span className="text-signal/70">low-cost window</span>
      </div>

      {/* job tracks */}
      <div className="space-y-2">
        {JOBS.map((job) => {
          const left = mode === 1 ? job.low : job.peak;
          const shifted = !job.locked && mode === 1;
          return (
            <div key={job.label} className="relative h-7 rounded-sm border border-border bg-card-elevated">
              <motion.div
                className={cn(
                  "absolute top-1/2 flex h-5 -translate-y-1/2 items-center justify-center rounded-[3px] font-mono text-[9px] uppercase tracking-wide",
                  job.locked
                    ? "border border-white/15 bg-white/[0.06] text-white/55"
                    : shifted
                      ? "border border-signal/50 bg-signal/15 text-signal"
                      : "border border-white/20 bg-white/[0.08] text-white/70",
                )}
                style={{ width: `${job.width}%` }}
                animate={{ left: `${left}%` }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                {job.label}
              </motion.div>
              {job.locked && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[8.5px] uppercase tracking-wide text-white/28">
                  locked
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* mode readout */}
      <div className="mt-4 flex items-center gap-2.5">
        <span className={cn("inline-block h-1.5 w-1.5 rounded-full", mode === 1 ? "bg-signal" : "bg-white/40", "anim-breathe")} aria-hidden />
        <div className="relative h-4 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className={cn("block font-mono text-[11px] tracking-[0.03em]", mode === 1 ? "text-signal" : "text-white/50")}
            >
              {mode === 1
                ? "aurelius · flexible jobs shifted to low-cost window · locked jobs unchanged"
                : "scheduler · flexible jobs run through peak pricing"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
