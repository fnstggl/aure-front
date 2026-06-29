import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ============================================================================
   fig.01 — the predictive control architecture, drawn as a live instrument.

   A proper input → process → output diagram, not a black box:

     CURRENT STATE            WORLD MODEL                 EXECUTION
     (cluster inputs)   →     simulates & forecasts   →  economic optimum
                              the constraints each        → constraint gate
                              decision will face          → recommend / execute

   The world model is the active core: it works through the named constraints
   it is optimizing (compute, memory, energy, electricity markets, KV cache, …)
   while a counter reports how many candidate combinations it has tried. The
   pace is deliberately calm — a new constraint set every ~1.8s, the counter
   settling on a different total each pass. Pure black plate, white ink, no
   gold. Reduced motion collapses to the resolved state.
   ============================================================================ */

const INPUTS = ["cluster telemetry", "GPU utilization", "workload queue", "power & thermal"];

const CONSTRAINTS = [
  "Compute", "Memory", "Network", "Storage", "Queueing", "Latency", "Throughput",
  "Energy", "Electricity Markets", "Cooling", "Capacity", "Placement", "Model Affinity",
  "KV Cache", "Routing", "Migration", "Batching", "Replicas", "Precision",
  "Speculative Decoding", "Clock / DVFS", "Scheduling", "Prewarming", "Forecasts",
  "Reliability", "Availability", "Multi-tenancy", "Economics", "Carbon",
  "Data Constraints", "Hardware Constraints", "Operational Constraints", "Safety Constraints",
];

const TARGETS = [3247, 5812, 4196]; // combinations tried — rotates each pass

const WINDOW = 6;
const SIMULATE_MS = 6400;
const FOUND_MS = 1300;
const EXEC_MS = 2800;
const SET_MS = 1800; // constraint set cadence (calm)
const COUNT_MS = 340; // counter cadence (calm, eased)

type Phase = "simulate" | "found" | "exec";

export function WorldModelArchitecture({ className }: { className?: string }) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("found");
  const [cycle, setCycle] = useState(0);
  const [set, setSet] = useState(0);
  const [count, setCount] = useState(TARGETS[0]);

  const target = TARGETS[cycle % TARGETS.length];

  // Begin a fresh pass when the figure enters view; resolved state otherwise.
  useEffect(() => {
    if (reduced || !inView) {
      setPhase("found");
      setCount(target);
      return;
    }
    setCount(0);
    setPhase("simulate");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  // Phase machine — each phase schedules the next; the loop rotates the total.
  useEffect(() => {
    if (reduced || !inView) return;
    let id: number;
    if (phase === "simulate") {
      id = window.setTimeout(() => {
        setCount(target);
        setPhase("found");
      }, SIMULATE_MS);
    } else if (phase === "found") {
      id = window.setTimeout(() => setPhase("exec"), FOUND_MS);
    } else {
      id = window.setTimeout(() => {
        setCycle((c) => c + 1);
        setCount(0);
        setPhase("simulate");
      }, EXEC_MS);
    }
    return () => window.clearTimeout(id);
  }, [phase, inView, reduced, target]);

  // Advance the visible constraint set, slowly, while simulating.
  useEffect(() => {
    if (reduced || !inView || phase !== "simulate") return;
    const id = window.setInterval(() => setSet((s) => s + 1), SET_MS);
    return () => window.clearInterval(id);
  }, [phase, inView, reduced]);

  // Ease the counter toward its target — decelerating, never frantic.
  useEffect(() => {
    if (reduced || !inView || phase !== "simulate") return;
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= target) return target;
        return Math.min(target, c + Math.max(37, Math.round((target - c) * 0.16)));
      });
    }, COUNT_MS);
    return () => window.clearInterval(id);
  }, [phase, inView, reduced, target]);

  const resolved = phase !== "simulate";
  const base = set * WINDOW;
  const visible = Array.from({ length: WINDOW }, (_, i) => {
    const idx = (base + i) % CONSTRAINTS.length;
    return { name: CONSTRAINTS[idx], idx };
  });

  return (
    <figure ref={ref} className={cn("relative overflow-hidden border border-white bg-black", className)}>
      {/* figure label */}
      <div className="flex items-center justify-between gap-3 border-b border-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="border border-white px-1.5 py-0.5 font-mono text-[10px] tabular-nums leading-none tracking-[0.14em] text-white">
            FIG.01
          </span>
          <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.2em] text-white">
            forecast · simulate · decide
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase leading-none tracking-[0.18em] text-white/55">
          <span className={cn("inline-block h-1.5 w-1.5", resolved ? "bg-white" : "bg-white/70")} aria-hidden />
          {resolved ? "locked" : "searching"}
        </span>
      </div>

      <div className="flex flex-col gap-3 px-4 py-5 md:flex-row md:items-stretch md:gap-2.5">
        {/* ---------------- current state (inputs) ---------------- */}
        <div className="md:w-[150px] md:shrink-0">
          <PanelLabel>current state</PanelLabel>
          <div className="mt-2.5 grid grid-cols-2 gap-1.5 md:grid-cols-1">
            {INPUTS.map((x) => (
              <div
                key={x}
                className="border border-white/25 px-2.5 py-1.5 font-mono text-[10.5px] leading-tight text-white/70"
              >
                {x}
              </div>
            ))}
          </div>
        </div>

        <Flow />

        {/* ---------------- world model (the active core) ---------------- */}
        <div className="md:flex-1">
          <PanelLabel>world model</PanelLabel>
          <div className="mt-2.5 border border-white">
            <div className="border-b border-white/25 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/60">
              simulating forecast constraints
            </div>
            <div className="divide-y divide-white/10">
              {visible.map(({ name, idx }, i) => {
                const optimizing = !resolved && (idx + set) % WINDOW === i % 3;
                const fill = resolved ? 86 : 58 + ((idx * 37) % 40);
                return (
                  <div key={`${name}-${i}`} className="flex items-center gap-2.5 px-3 py-[7px]">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0",
                        optimizing ? "animate-pulse border border-white/80" : "bg-white",
                      )}
                      aria-hidden
                    />
                    <span className="flex-1 truncate font-mono text-[11px] leading-none text-white/85">
                      {name}
                    </span>
                    <span className="relative hidden h-1.5 w-14 shrink-0 bg-white/[0.06] sm:block">
                      <span
                        className="absolute inset-y-0 left-0 bg-white/45 transition-[width] duration-700 ease-out"
                        style={{ width: `${fill}%` }}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2.5 font-mono text-[11.5px] tabular-nums text-white/55">
            <span className="text-white">{count.toLocaleString("en-US")}</span> combinations tried
          </div>
        </div>

        <Flow />

        {/* ---------------- execution ---------------- */}
        <div className="md:w-[150px] md:shrink-0">
          <PanelLabel>execution</PanelLabel>
          <div className="mt-2.5 grid gap-1.5">
            <ExecBox active={resolved}>
              economic optimum{resolved && <span className="ml-1.5 text-white">✓</span>}
            </ExecBox>
            <ExecBox active={resolved}>constraint gate</ExecBox>
            <ExecBox active={phase === "exec"} strong>
              recommend / execute
            </ExecBox>
          </div>
          <div className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
            {resolved ? "optimum committed" : "awaiting optimum"}
          </div>
        </div>
      </div>
    </figure>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">{children}</span>
  );
}

/* directional connector — horizontal on desktop, vertical on mobile */
function Flow() {
  return (
    <div className="flex shrink-0 items-center justify-center font-mono text-white/35 md:px-0.5">
      <span className="hidden md:inline">→</span>
      <span className="md:hidden">↓</span>
    </div>
  );
}

function ExecBox({
  active,
  strong = false,
  children,
}: {
  active: boolean;
  strong?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border px-2.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-colors duration-500",
        active ? cn("border-white text-white", strong && "bg-white/[0.08]") : "border-white/20 text-white/40",
      )}
    >
      {children}
    </div>
  );
}
