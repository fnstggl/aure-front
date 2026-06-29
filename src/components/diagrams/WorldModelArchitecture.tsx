import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.01 — the predictive control loop, drawn as a live instrument.

   Answers one question in five seconds: how does Aurelius decide using future
   constraints? Three reads, left to right:

     CURRENT STATE  →  PREDICTIVE WORLD MODEL  →  DECISION
     (cluster inputs)  forecasts the future state   the economic optimum
                       and branches into candidate   passes the constraint
                       decisions, each simulated      gate and is executed
                       inside that future and ranked

   The centre is the active part: the world model forecasts forward in time
   (T+1 → T+2 → T+3) and forks into candidate decisions. While SIMULATING it
   scans the candidates being evaluated in the predicted future; it then RANKS
   them by economic outcome, selects the #1 safe candidate (bright white, ✓),
   and lights the decision chain — economic optimum → constraint gate →
   recommend / execute — before looping. No constraint checklist, no exact
   search count. Calm pacing, transform/opacity + width only. Reduced motion
   collapses to the resolved state.
   ============================================================================ */

const INPUTS = ["cluster telemetry", "GPU utilization", "workload queue", "power / thermal"];
const HORIZON = ["T+1", "T+2", "T+3"];

/* candidate simulations, shown in A/B/C order; rank + bar carry the economic
   ranking, the #1 safe candidate is the selected economic optimum. */
const CANDIDATES = [
  { id: "A", score: 54, rank: 2, selected: false },
  { id: "B", score: 92, rank: 1, selected: true },
  { id: "C", score: 33, rank: 3, selected: false },
];

const SIMULATE_MS = 4200;
const RANKED_MS = 1700;
const EXECUTE_MS = 2600;
const TICK_MS = 880; // scan cadence while simulating (calm)

type Phase = "simulate" | "ranked" | "execute";

export function WorldModelArchitecture({ className }: { className?: string }) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("ranked");
  const [tick, setTick] = useState(0);
  const [filled, setFilled] = useState(true);

  // Begin a fresh pass when the figure enters view; resolved state otherwise.
  useEffect(() => {
    if (reduced || !inView) {
      setPhase("ranked");
      setFilled(true);
      return;
    }
    setFilled(false);
    setPhase("simulate");
    const id = window.setTimeout(() => setFilled(true), 80); // 0 → score fill
    return () => window.clearTimeout(id);
  }, [inView, reduced]);

  // Phase machine — simulate → ranked → execute → loop.
  useEffect(() => {
    if (reduced || !inView) return;
    let id: number;
    if (phase === "simulate") {
      id = window.setTimeout(() => setPhase("ranked"), SIMULATE_MS);
    } else if (phase === "ranked") {
      id = window.setTimeout(() => setPhase("execute"), RANKED_MS);
    } else {
      id = window.setTimeout(() => setPhase("simulate"), EXECUTE_MS);
    }
    return () => window.clearTimeout(id);
  }, [phase, inView, reduced]);

  // Scan the candidates being evaluated, and advance the forecast horizon.
  useEffect(() => {
    if (reduced || !inView || phase !== "simulate") return;
    const id = window.setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => window.clearInterval(id);
  }, [phase, inView, reduced]);

  const resolved = phase !== "simulate";
  const activeCandidate = phase === "simulate" ? tick % CANDIDATES.length : -1;
  const horizonLit = resolved ? HORIZON.length : (tick % HORIZON.length) + 1;

  return (
    <figure ref={ref} className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.01" title="predictive control loop" />

      <div className="flex flex-col gap-3 px-4 py-5 md:flex-row md:items-stretch md:gap-2.5">
        {/* ---------------- current state (inputs) ---------------- */}
        <div className="md:w-[132px] md:shrink-0">
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

        {/* ---------------- predictive world model (the active core) ---------------- */}
        <div className="md:flex-1">
          <PanelLabel>predictive world model</PanelLabel>
          <div className="mt-2.5 border border-white">
            {/* forecast forward in time — chips light as the horizon advances */}
            <div className="flex items-center justify-between gap-2 border-b border-white/25 px-3 py-1.5">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/60">
                forecast future state
              </span>
              <span className="flex items-center gap-1 font-mono text-[9.5px] tabular-nums leading-none">
                {HORIZON.map((t, i) => (
                  <span key={t} className="flex items-center gap-1">
                    {i > 0 && <span className="text-white/30">→</span>}
                    <span
                      className={cn(
                        "border px-1 py-0.5 leading-none transition-colors duration-500",
                        i < horizonLit ? "border-white/55 text-white/85" : "border-white/15 text-white/30",
                      )}
                    >
                      {t}
                    </span>
                  </span>
                ))}
              </span>
            </div>

            {/* branch into candidate decisions, each simulated + ranked */}
            <div className="px-3 py-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/55">
                  candidate decisions
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">
                  {resolved ? "economic ranking" : "simulating"}
                </span>
              </div>
              <div className="mt-2.5 space-y-2 border-l border-white/30">
                {CANDIDATES.map((c, i) => {
                  const scanning = i === activeCandidate;
                  const win = resolved && c.selected;
                  return (
                    <div key={c.id} className="flex items-center gap-2.5">
                      {/* branch tick — fork from the world model */}
                      <span
                        className={cn(
                          "h-px w-3 shrink-0 transition-colors duration-300",
                          win ? "bg-white" : scanning ? "bg-white/70" : "bg-white/30",
                        )}
                        aria-hidden
                      />
                      <span
                        className={cn(
                          "w-[84px] shrink-0 font-mono text-[11px] leading-none transition-colors duration-300",
                          win ? "text-white" : scanning ? "text-white/80" : "text-white/45",
                        )}
                      >
                        Candidate {c.id}
                      </span>
                      <ScoreBar className="flex-1" value={filled ? c.score : 0} selected={win} scanning={scanning} />
                      <span
                        className={cn(
                          "w-[50px] shrink-0 text-right font-mono text-[9.5px] uppercase tracking-[0.06em] leading-none transition-colors duration-300",
                          win ? "text-white" : "text-white/35",
                        )}
                      >
                        {resolved ? (c.selected ? "#1 ✓" : `#${c.rank}`) : scanning ? "···" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div
                className={cn(
                  "mt-3 font-mono text-[9.5px] leading-tight transition-colors duration-500",
                  resolved ? "text-white/40" : "text-white/60",
                )}
              >
                candidate decisions evaluated in the predicted future
              </div>
            </div>
          </div>
        </div>

        <Flow />

        {/* ---------------- decision ---------------- */}
        <div className="md:w-[150px] md:shrink-0">
          <PanelLabel>decision</PanelLabel>
          <div className="mt-2.5 grid gap-1.5">
            <DecisionBox active={resolved}>
              economic optimum{resolved && <span className="ml-1.5">✓</span>}
            </DecisionBox>
            <DownTick />
            <DecisionBox active={resolved}>constraint gate</DecisionBox>
            <DownTick />
            <DecisionBox active={phase === "execute"} strong>
              recommend / execute
            </DecisionBox>
          </div>
          <div className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
            {phase === "execute" ? "optimum committed" : resolved ? "ranking candidates" : "evaluating candidates"}
          </div>
        </div>
      </div>

      <CaptionStrip label="current state → future state → candidate simulations → economic optimum" />
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

/* economic-outcome bar — selected candidate is bright, the rest muted; the
   candidate currently being simulated gets a faint pulse. */
function ScoreBar({
  value,
  selected,
  scanning,
  className,
}: {
  value: number;
  selected?: boolean;
  scanning?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative block h-1.5 bg-white/[0.07]", className)} aria-hidden>
      <span
        className={cn(
          "absolute inset-y-0 left-0 transition-[width] duration-700 ease-out",
          selected ? "bg-white" : scanning ? "bg-white/55 animate-pulse" : "bg-white/35",
        )}
        style={{ width: `${value}%` }}
      />
    </span>
  );
}

function DownTick() {
  return (
    <div className="flex justify-center font-mono text-[10px] leading-none text-white/30" aria-hidden>
      ↓
    </div>
  );
}

function DecisionBox({
  active = false,
  strong = false,
  children,
}: {
  active?: boolean;
  strong?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border px-2.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-colors duration-500",
        active
          ? cn("border-white text-white", strong && "bg-white/[0.08]")
          : "border-white/25 text-white/40",
      )}
    >
      {children}
    </div>
  );
}
