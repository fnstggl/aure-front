import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ============================================================================
   FIG.01 — the predictive control engine, drawn as one memorable idea:
   Aurelius explores an enormous space of possible futures before it decides.

     CURRENT STATE          the cluster inputs the decision starts from
          ↓
     WORLD MODEL            a dense field of cells flickers like a GPU at work
          ↓                 while a counter climbs through ~millions of
                            simulated futures
          ↓                 then the field collapses: every cell fades but one,
                            which brightens and detaches
          ↓
     SELECTED PLAN ✓        that single survivor becomes the committed plan;
                            "all constraints satisfied" resolves a beat later

   Constraint validation and ranking are real but are implementation detail, so
   they are left out of the figure — the memorable claim is millions → one. Pure
   black plate, white ink, no color. Reduced motion shows the resolved state.
   ============================================================================ */

const CURRENT_STATE = ["Cluster telemetry", "Workload queue", "Capacity state", "SLA targets"];

/* Totals the counter settles on, rotated each pass so the number varies on
   every showing while staying in the ~2–3M band. */
const TARGETS = [2_641_882, 2_873_104, 2_487_339, 2_956_018, 2_312_540, 2_805_805];
/* Which cell survives the collapse — rotated so it lands somewhere different. */
const WINNERS = [97, 64, 131, 45, 112, 78];

const CELLS = 192;

const SIMULATE_MS = 4200;
const COLLAPSE_MS = 1900;
const SELECT_MS = 3200;
const CHECK_DELAY = 850; // "all constraints satisfied" resolves a beat into select
const COUNT_MS = 90;

type Phase = "simulate" | "collapse" | "select";

export function WorldModelArchitecture({ className }: { className?: string }) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("select");
  const [cycle, setCycle] = useState(0);
  const [count, setCount] = useState(TARGETS[0]);
  const [checked, setChecked] = useState(true);

  const target = TARGETS[cycle % TARGETS.length];
  const winner = WINNERS[cycle % WINNERS.length];

  // Start a fresh pass when the figure enters view (or each new cycle); the
  // resolved state otherwise. Counting starts ~10% below the target.
  useEffect(() => {
    if (reduced || !inView) {
      setPhase("select");
      setCount(target);
      setChecked(true);
      return;
    }
    setCount(Math.round(target * 0.9));
    setChecked(false);
    setPhase("simulate");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, cycle]);

  // Phase machine: simulate → collapse → select → loop to the next cycle.
  useEffect(() => {
    if (reduced || !inView) return;
    let id: number;
    if (phase === "simulate") {
      id = window.setTimeout(() => {
        setCount(target);
        setPhase("collapse");
      }, SIMULATE_MS);
    } else if (phase === "collapse") {
      id = window.setTimeout(() => setPhase("select"), COLLAPSE_MS);
    } else {
      id = window.setTimeout(() => setCycle((c) => c + 1), SELECT_MS);
    }
    return () => window.clearTimeout(id);
  }, [phase, inView, reduced, target]);

  // Ease the counter up toward its target — decelerating, never frantic.
  useEffect(() => {
    if (reduced || !inView || phase !== "simulate") return;
    const id = window.setInterval(() => {
      setCount((c) => (c >= target ? target : Math.min(target, c + Math.max(1500, Math.round((target - c) * 0.07)))));
    }, COUNT_MS);
    return () => window.clearInterval(id);
  }, [phase, inView, reduced, target]);

  // "All constraints satisfied" resolves a beat after the plan is selected.
  useEffect(() => {
    if (phase !== "select") return;
    if (reduced || !inView) {
      setChecked(true);
      return;
    }
    const id = window.setTimeout(() => setChecked(true), CHECK_DELAY);
    return () => window.clearTimeout(id);
  }, [phase, inView, reduced]);

  const simulating = phase === "simulate";
  const collapsing = phase === "collapse";
  const selected = phase === "select";
  const active = simulating && !reduced; // cells shimmer only while simulating

  return (
    <figure ref={ref} className={cn("relative overflow-hidden border border-white bg-black", className)}>
      {/* figure label */}
      <div className="flex items-center justify-between gap-3 border-b border-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="border border-white px-1.5 py-0.5 font-mono text-[10px] tabular-nums leading-none tracking-[0.14em] text-white">
            FIG.01
          </span>
          <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.2em] text-white">
            Forecast · Simulate · Decide
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase leading-none tracking-[0.18em] text-white/55">
          <span className={cn("inline-block h-1.5 w-1.5", selected ? "bg-white" : "bg-white/70")} aria-hidden />
          {selected ? "Locked" : "Simulating"}
        </span>
      </div>

      <div className="mx-auto flex max-w-[420px] flex-col px-5 py-6">
        {/* ---------------- current state (inputs) ---------------- */}
        <PanelLabel>Current state</PanelLabel>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {CURRENT_STATE.map((x) => (
            <span
              key={x}
              className="border border-white/25 px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.06em] leading-none text-white/70"
            >
              {x}
            </span>
          ))}
        </div>

        <Down />

        {/* ---------------- world model (the engine) ---------------- */}
        <PanelLabel>World model</PanelLabel>
        <div className="mt-2.5 border border-white px-3.5 pb-3 pt-3">
          <div className="flex flex-wrap gap-[3px]">
            {Array.from({ length: CELLS }, (_, i) => {
              const isWinner = i === winner;
              if (active) {
                const delay = (i % 32) * 70 + ((i * 13) % 40) * 6;
                const dur = 2100 + ((i * 29) % 1500);
                return (
                  <span
                    key={i}
                    aria-hidden
                    className="grid-cell-anim h-1.5 w-1.5 bg-white"
                    style={{ animationDelay: `${delay}ms`, animationDuration: `${dur}ms` }}
                  />
                );
              }
              // collapsed / resolved: every cell fades but the one survivor
              return (
                <span
                  key={i}
                  aria-hidden
                  className={cn(
                    "h-1.5 w-1.5 origin-center bg-white transition-all duration-[1100ms] ease-out",
                    isWinner && "scale-[1.7]",
                  )}
                  style={{ opacity: isWinner ? 1 : 0.045 }}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-baseline gap-2 border-t border-white/15 pt-2.5">
            <span className="font-mono text-[15px] font-medium tabular-nums leading-none text-white">
              {count.toLocaleString("en-US")}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/55">
              simulated futures
            </span>
          </div>
        </div>

        <Down dropping={collapsing} />

        {/* ---------------- selected plan (the output, not a card) ---------------- */}
        <div className="flex flex-col items-center pt-1 text-center">
          <PanelLabel>Selected plan</PanelLabel>
          <div
            className={cn(
              "mt-4 transition-all duration-500 ease-out",
              selected ? "scale-100 opacity-100" : "scale-90 opacity-0",
            )}
            aria-hidden
          >
            <Check />
          </div>
          <div
            className={cn(
              "mt-4 font-mono text-[12px] uppercase tracking-[0.12em] text-white transition-opacity duration-500",
              selected ? "opacity-100" : "opacity-0",
            )}
          >
            Lowest-cost admissible plan
          </div>
          <div
            className={cn(
              "mt-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-white/55 transition-opacity duration-700",
              checked ? "opacity-100" : "opacity-0",
            )}
          >
            All constraints satisfied
          </div>
        </div>
      </div>
    </figure>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">{children}</span>;
}

/* Directional connector between stages — a short rule and a downward arrow.
   When `dropping`, a bright cell falls through it: the survivor detaching. */
function Down({ dropping = false }: { dropping?: boolean }) {
  return (
    <div className="relative flex flex-col items-center gap-1 py-3" aria-hidden>
      <span className="h-3 w-px bg-white/20" />
      <span className="font-mono text-[11px] leading-none text-white/35">↓</span>
      {dropping && <span className="detach-dot absolute left-1/2 top-1 h-1.5 w-1.5 bg-white" />}
    </div>
  );
}

/* The committed plan, drawn as a single resolved check — the output of the
   search rather than a UI control. */
function Check() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <path d="M4 13.5L10 19.5 22 6.5" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  );
}
