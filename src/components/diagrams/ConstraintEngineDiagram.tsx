import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";

/* Diagram 5 — Constraint Engine.
   A candidate is checked gate by gate. One run clears every gate and is
   approved; the next fails at a hard constraint and is rejected — and still
   recorded. A shared-layout packet slides between gates. */

const EASE = [0.16, 1, 0.3, 1] as const;
const GATES = ["SLA", "Capacity", "Power", "Residency", "Policy", "Availability", "Confidence"];
const FRAMES = 12; // 0-7 approve scenario, 8-11 reject scenario

type GateState = "idle" | "active" | "pass" | "fail";

function deriveFrame(f: number) {
  if (f <= 7) {
    const gate = (g: number): GateState => (g < f ? "pass" : g === f && f <= 6 ? "active" : "idle");
    const cleared = Math.min(f, 7);
    const activeIndex = f <= 6 ? f : -1;
    const verdict = f === 7 ? ("approved" as const) : null;
    return { gate, cleared, activeIndex, verdict, scenario: "approve" as const };
  }
  const local = f - 8; // 0..3
  const gate = (g: number): GateState => {
    if (g === 2 && local >= 3) return "fail";
    if (g < local && g < 2) return "pass";
    if (g === local && local < 3) return "active";
    if (g === 2 && local === 2) return "active";
    return "idle";
  };
  const cleared = Math.min(local, 2);
  const activeIndex = local < 3 ? local : 2;
  const verdict = local >= 3 ? ("rejected" as const) : null;
  return { gate, cleared, activeIndex, verdict, scenario: "reject" as const };
}

export function ConstraintEngineDiagram() {
  const { ref, inView } = useInView();
  const f = useSequence(FRAMES, { enabled: inView, interval: 1300, resting: 7 });
  const { gate, cleared, activeIndex, verdict } = deriveFrame(f);

  return (
    <div ref={ref} className="w-full p-5 md:p-7">
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[560px]">
          {/* candidate token + gate row */}
          <div className="flex items-stretch gap-1.5">
            {GATES.map((name, i) => {
              const state = gate(i);
              return (
                <div key={name} className="relative flex min-w-0 flex-1 flex-col items-center">
                  {/* packet hovers above the active gate; slides via layout */}
                  <div className="mb-1.5 h-2">
                    {activeIndex === i && verdict === null && (
                      <motion.span
                        layoutId="constraint-packet"
                        transition={{ type: "spring", stiffness: 220, damping: 26 }}
                        className="block h-2 w-2 rounded-full bg-signal shadow-[0_0_8px_hsl(218_45%_66%/0.6)]"
                      />
                    )}
                  </div>
                  <div
                    className={cn(
                      "flex h-12 w-full flex-col items-center justify-center rounded-md border px-1 text-center transition-all duration-500",
                      state === "pass" && "border-signal/35 bg-signal/[0.04]",
                      state === "fail" && "border-destructive/55 bg-destructive/[0.08]",
                      state === "active" && "border-signal/55 bg-signal/[0.06]",
                      state === "idle" && "border-border bg-card-elevated opacity-55",
                    )}
                  >
                    <GateGlyph state={state} />
                    <span
                      className={cn(
                        "mt-1 truncate font-mono text-[9px] uppercase tracking-[0.08em]",
                        state === "pass" ? "text-white/72" : state === "fail" ? "text-destructive" : "text-white/60",
                      )}
                    >
                      {name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* progress rail */}
          <div className="mt-2 h-px w-full bg-border">
            <motion.div
              className={cn("h-full", verdict === "rejected" ? "bg-destructive/60" : "bg-signal")}
              animate={{ width: `${(cleared / GATES.length) * 100}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
        </div>
      </div>

      {/* verdict + rejection logging */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <AnimatePresence mode="wait">
          {verdict ? (
            <motion.div
              key={verdict}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE }}
              className={cn(
                "inline-flex items-center gap-2 rounded-sm border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em]",
                verdict === "approved" ? "border-signal/50 text-signal" : "border-destructive/55 text-destructive",
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", verdict === "approved" ? "bg-signal" : "bg-destructive")} />
              {verdict === "approved" ? "approved candidate" : "rejected · failed at power"}
            </motion.div>
          ) : (
            <motion.div
              key="evaluating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-signal/85"
            >
              evaluating · gate {Math.max(activeIndex, 0) + 1}/{GATES.length}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {verdict === "rejected" && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="font-mono text-[11px] text-white/45"
            >
              <span className="text-white/28">append · </span>
              <span className="text-destructive/90">constraint.power.fail</span> rejection_logged=true
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 space-y-1.5 border-t border-border pt-4">
        {["Hard constraints are not optimization preferences.", "Unsafe savings do not count.", "Every rejection is recorded."].map((t) => (
          <p key={t} className="font-mono text-[11px] text-white/42">
            <span className="mr-2 text-white/30">—</span>
            {t}
          </p>
        ))}
      </div>
    </div>
  );
}

function GateGlyph({ state }: { state: GateState }) {
  const color =
    state === "pass" ? "hsl(218 45% 66%)" : state === "fail" ? "hsl(0 72% 51%)" : state === "active" ? "hsl(218 50% 74%)" : "hsl(0 0% 40%)";
  if (state === "fail") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M3 3l6 6M9 3l-6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (state === "pass") {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M2.5 6.5L5 9l4.5-5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return <span className="block h-1.5 w-1.5 rounded-full" style={{ background: color }} aria-hidden />;
}
