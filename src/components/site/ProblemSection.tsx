import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Container, Section } from "@/components/site/primitives";
import { Counter } from "@/components/site/Counter";

/* The cost reality — a live grid of fleet failures that fire while a core
   economic metric stays underwater. Toggling Aurelius calms the grid and
   recovers the metric. Monochrome + red only; outline-only; sharp corners. */

const TILES = [
  "Idle GPUs", "Stranded capacity", "Fragmentation", "Underutilized clusters",
  "Peak pricing", "Reservation waste", "Regional imbalance", "Overprovisioning",
  "Queue backlog", "Forecasting errors", "Cold starts", "SLA risk",
  "Capacity bottlenecks", "Demand spikes", "Placement mistakes", "Timing windows",
];

function Triangle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 3L18.5 17.5H1.5L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" />
      <path d="M10 8.5V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      <rect x="9.2" y="13.6" width="1.6" height="1.6" fill="currentColor" />
    </svg>
  );
}

function Server() {
  return (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" aria-hidden>
      <rect x="1" y="1" width="18" height="5.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="8.6" width="18" height="5.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4" y="3.2" width="1.5" height="1.5" fill="currentColor" />
      <rect x="4" y="10.8" width="1.5" height="1.5" fill="currentColor" />
    </svg>
  );
}

export function ProblemSection() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const mode = useSequence(2, { enabled: inView, interval: 5200, resting: 0 }); // 0 without · 1 with Aurelius
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduced || !inView || mode !== 0) return;
    const id = window.setInterval(() => setFrame((f) => f + 1), 1300);
    return () => window.clearInterval(id);
  }, [reduced, inView, mode]);

  const on = mode === 1;
  const fires = (i: number) => !on && (i * 7 + frame * 3) % 5 < 3; // ~60% firing, shuffles per frame

  return (
    <Section>
      <Container>
        <div ref={ref} className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-[clamp(1.8rem,3.8vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.025em] text-foreground md:whitespace-nowrap">
            Your GPU fleet bleeds money.
            <br />
            <span className="text-white/50">Your scheduler wasn’t built to stop it.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/60 md:text-[16px]">
            Most schedulers optimize for availability, fairness, and latency.
            Aurelius finds the best economic outcome.
          </p>
        </div>

        {/* core metric + Aurelius toggle */}
        <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <div className="inline-flex items-center gap-3 border border-border px-4 py-2.5 font-mono text-[13px]">
            <span
              className="h-2 w-2 transition-colors duration-500"
              style={{ background: on ? "hsl(0 0% 96%)" : "hsl(var(--destructive))" }}
              aria-hidden
            />
            <span className="text-white/55">Goodput / $</span>
            <span
              className="tabular-nums transition-colors duration-500"
              style={{ color: on ? "hsl(0 0% 98%)" : "hsl(var(--destructive))" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={mode}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  <Counter to={on ? 1.42 : 0.61} enabled={inView} decimals={2} suffix="×" />
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <div className="inline-flex items-center gap-2.5 border border-border px-4 py-2.5">
            <span className={`relative h-4 w-7 border transition-colors duration-500 ${on ? "border-white/80" : "border-white/30"}`} aria-hidden>
              <motion.span
                className="absolute top-1/2 h-2.5 w-2.5"
                initial={false}
                animate={{ left: on ? 14 : 2, backgroundColor: on ? "hsl(0 0% 96%)" : "hsl(0 0% 100% / 0.3)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ y: "-50%" }}
              />
            </span>
            <span className="font-mono text-[13px] text-white/70">Aurelius</span>
          </div>
        </div>

        {/* failure grid */}
        <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
          {TILES.map((t, i) => {
            const firing = fires(i);
            return (
              <div
                key={t}
                className="flex aspect-square flex-col items-center justify-center gap-2.5 border px-2 text-center transition-colors duration-500"
                style={{
                  borderColor: firing ? "hsl(var(--destructive) / 0.75)" : "hsl(0 0% 100% / 0.09)",
                }}
              >
                <span
                  className="transition-colors duration-500"
                  style={{ color: firing ? "hsl(var(--destructive))" : "hsl(0 0% 100% / 0.22)" }}
                >
                  {firing ? <Triangle /> : <Server />}
                </span>
                <span
                  className="font-mono text-[10.5px] leading-tight tracking-tight transition-colors duration-500"
                  style={{ color: firing ? "hsl(var(--destructive))" : "hsl(0 0% 100% / 0.28)" }}
                >
                  {t}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-7 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/30">
          {on ? "Aurelius optimizes · cost · energy · capacity · timing · region · constraints" : "Without Aurelius · thousands of microdecisions compound into excess costs"}
        </p>
      </Container>
    </Section>
  );
}
