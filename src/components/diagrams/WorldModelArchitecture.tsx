import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ============================================================================
   FIG.01 — the predictive control engine, drawn as a vertical pipeline.

   The story, top to bottom, is the product's differentiator:

     CURRENT STATE          the cluster inputs the decision starts from
          ↓
     WORLD MODEL            simulates a very large space of candidate futures
          ↓                 (a live counter reports ~millions explored)
     CONSTRAINT VALIDATION  infeasible futures are filtered out; the set shrinks
          ↓
     ECONOMIC RANKING       the survivors are ranked by economic outcome
          ↓
     SELECTED PLAN ✓        the lowest-cost, constraint-valid plan is committed

   It is deliberately a compute engine, not a spreadsheet: a dense field of
   cells flickers while the counter climbs through a few million simulated
   futures, settling on a different total each pass. Pure black plate, white
   ink, no color. Reduced motion collapses to the resolved state.
   ============================================================================ */

const CURRENT_STATE = ["Cluster telemetry", "Workload queue", "Capacity state", "SLA targets"];

/* Totals the counter settles on, rotated each pass so the number varies on
   every showing while staying in the ~2–3M band. */
const TARGETS = [2_641_882, 2_873_104, 2_487_339, 2_956_018, 2_312_540, 2_744_667];

const CELLS = 192; // world-model search field
const FILTER_ROWS = [26, 11, 3]; // candidate set shrinking under constraints
const RANKS = [
  { n: "#1", w: 100 },
  { n: "#2", w: 66 },
  { n: "#3", w: 41 },
];

const SIMULATE_MS = 5200;
const LOCKED_MS = 2600;
const COUNT_MS = 90;

type Phase = "simulate" | "locked";

export function WorldModelArchitecture({ className }: { className?: string }) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("locked");
  const [cycle, setCycle] = useState(0);
  const [count, setCount] = useState(TARGETS[0]);

  const target = TARGETS[cycle % TARGETS.length];

  // Begin a fresh pass when the figure enters view (or each new cycle); the
  // resolved/locked state otherwise. Counting starts ~10% below the target.
  useEffect(() => {
    if (reduced || !inView) {
      setPhase("locked");
      setCount(target);
      return;
    }
    setCount(Math.round(target * 0.9));
    setPhase("simulate");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, cycle]);

  // Phase machine: simulate for a beat, lock the result, then loop to the next
  // cycle (which rotates the target and restarts the count via the effect above).
  useEffect(() => {
    if (reduced || !inView) return;
    let id: number;
    if (phase === "simulate") {
      id = window.setTimeout(() => {
        setCount(target);
        setPhase("locked");
      }, SIMULATE_MS);
    } else {
      id = window.setTimeout(() => setCycle((c) => c + 1), LOCKED_MS);
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

  const locked = phase === "locked";
  const active = !locked && !reduced;

  return (
    <figure ref={ref} className={cn("relative overflow-hidden border border-white bg-black uppercase", className)}>
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
          <span className={cn("inline-block h-1.5 w-1.5", locked ? "bg-white" : "bg-white/70")} aria-hidden />
          {locked ? "Locked" : "Simulating"}
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
              const baseOp = 0.16 + ((i * 41) % 50) / 100; // 0.16–0.65, deterministic
              const delay = (i % 32) * 70 + ((i * 13) % 40) * 6;
              const dur = 2100 + ((i * 29) % 1500);
              return (
                <span
                  key={i}
                  aria-hidden
                  className={cn("h-1.5 w-1.5 bg-white", active && "grid-cell-anim")}
                  style={
                    active
                      ? { animationDelay: `${delay}ms`, animationDuration: `${dur}ms` }
                      : { opacity: locked ? baseOp * 0.7 : baseOp }
                  }
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

        <Down />

        {/* ---------------- constraint validation (the set shrinks) ---------------- */}
        <PanelLabel>Constraint validation</PanelLabel>
        <div className="mt-2.5 grid gap-[5px]">
          {FILTER_ROWS.map((n, r) => (
            <div key={r} className="flex flex-wrap gap-[3px]">
              {Array.from({ length: n }, (_, i) => (
                <span key={i} aria-hidden className="h-1.5 w-1.5 bg-white" style={{ opacity: 0.8 - r * 0.2 }} />
              ))}
            </div>
          ))}
        </div>

        <Down />

        {/* ---------------- economic ranking ---------------- */}
        <PanelLabel>Economic ranking</PanelLabel>
        <div className="mt-2.5 grid gap-2">
          {RANKS.map((r, i) => (
            <div key={r.n} className="flex items-center gap-3">
              <span className={cn("font-mono text-[11px] tabular-nums leading-none", i === 0 ? "text-white" : "text-white/55")}>
                {r.n}
              </span>
              <span className="relative h-1.5 w-full max-w-[180px] bg-white/[0.06]">
                <span
                  className={cn("absolute inset-y-0 left-0", i === 0 ? "bg-white/70" : "bg-white/35")}
                  style={{ width: `${r.w}%` }}
                />
              </span>
            </div>
          ))}
        </div>

        <Down />

        {/* ---------------- selected plan ---------------- */}
        <div
          className={cn(
            "border px-4 py-3.5 transition-colors duration-500",
            locked ? "border-white bg-white/[0.06]" : "border-white/35",
          )}
        >
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
            Selected plan
            <span className={cn("transition-opacity duration-500", locked ? "opacity-100" : "opacity-30")} aria-hidden>
              ✓
            </span>
          </div>
          <div className="mt-2.5 grid gap-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-white/62">
            <span>Lowest-cost admissible plan</span>
            <span>All constraints satisfied</span>
          </div>
          <div className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">
            Recommend / Execute
          </div>
        </div>
      </div>
    </figure>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">{children}</span>;
}

/* Directional connector between stages — a short rule and a downward arrow. */
function Down() {
  return (
    <div className="flex flex-col items-center gap-1 py-3" aria-hidden>
      <span className="h-3 w-px bg-white/20" />
      <span className="font-mono text-[11px] leading-none text-white/35">↓</span>
    </div>
  );
}
