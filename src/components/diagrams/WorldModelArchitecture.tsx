import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ============================================================================
   fig.01 — the predictive control loop, drawn as a live instrument.

   The thesis is shown happening, not diagrammed statically: a world model
   forecasts the future cluster state, then Aurelius searches the decision
   space — simulating thousands of candidate decisions, rejecting the ones that
   violate forecast constraints — until it locks the economic optimum and
   commits it. Pure black plate, pure white ink. No gold. Reduced motion
   collapses to the resolved state.

       current state → world model → future constraints
       simulate candidate decisions  (N combinations tried)
       → economic optimum found → constraint gate → recommend / execute
   ============================================================================ */

const ROWS = 5;
const WINNER = 2; // the candidate that wins the search
const TARGET = 4391; // combinations tried, settled value
const SEARCH_MS = 2600;
const FOUND_MS = 1100;
const EXEC_MS = 2200;
const TICK_MS = 120;

type Phase = "search" | "found" | "exec";

export function WorldModelArchitecture({ className }: { className?: string }) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("found");
  const [frame, setFrame] = useState(0);
  const [tried, setTried] = useState(TARGET);

  // Start a fresh search when the figure scrolls into view; collapse to the
  // resolved state when off-screen or under reduced motion.
  useEffect(() => {
    if (reduced || !inView) {
      setPhase("found");
      setTried(TARGET);
      return;
    }
    setFrame(0);
    setTried(0);
    setPhase("search");
  }, [inView, reduced]);

  // Phase machine — each phase schedules the next, then the loop restarts.
  useEffect(() => {
    if (reduced || !inView) return;
    let id: number;
    if (phase === "search") {
      id = window.setTimeout(() => {
        setTried(TARGET);
        setPhase("found");
      }, SEARCH_MS);
    } else if (phase === "found") {
      id = window.setTimeout(() => setPhase("exec"), FOUND_MS);
    } else {
      id = window.setTimeout(() => {
        setFrame(0);
        setTried(0);
        setPhase("search");
      }, EXEC_MS);
    }
    return () => window.clearTimeout(id);
  }, [phase, inView, reduced]);

  // Flicker + counter — runs only during the search phase.
  useEffect(() => {
    if (reduced || !inView || phase !== "search") return;
    const id = window.setInterval(() => {
      setFrame((f) => f + 1);
      setTried((t) => Math.min(TARGET, t + 173 + (t % 41)));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [phase, inView, reduced]);

  const resolved = phase !== "search";

  // Per-row state. During the search the rows flicker pass/reject and their
  // scores jump; once resolved only the winner passes, at full score.
  const rowState = (i: number) => {
    if (resolved) {
      const win = i === WINNER;
      return { pass: win, width: win ? 96 : 26 + ((i * 17) % 22), dim: !win };
    }
    const pass = (i * 5 + frame * 3) % 6 === 0;
    const width = 34 + ((i * 13 + frame * 23) % 58);
    return { pass, width, dim: false };
  };

  return (
    <figure
      ref={ref}
      className={cn("relative overflow-hidden border border-white bg-black", className)}
    >
      {/* slim monospace figure label */}
      <div className="flex items-center justify-between gap-3 border-b border-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="border border-white px-1.5 py-0.5 font-mono text-[10px] tabular-nums leading-none tracking-[0.14em] text-white">
            FIG.01
          </span>
          <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.22em] text-white">
            forecast · simulate · decide
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase leading-none tracking-[0.18em] text-white/55">
          <span
            className={cn("inline-block h-1.5 w-1.5", resolved ? "bg-white" : "animate-pulse bg-white/70")}
            aria-hidden
          />
          {resolved ? "locked" : "searching"}
        </span>
      </div>

      <div className="px-5 py-6 sm:px-6">
        {/* forecast lead-in — one linear reading, no side branch */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11.5px] leading-none text-white/60">
          <span>current state</span>
          <span className="text-white/35">→</span>
          <span>world model</span>
          <span className="text-white/35">→</span>
          <span className="text-white">future constraints</span>
        </div>

        {/* simulate — the live search over candidate decisions */}
        <div className="mt-6 flex items-baseline justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
            simulate candidate decisions
          </span>
        </div>

        <div className="mt-3 border border-white/25">
          {Array.from({ length: ROWS }).map((_, i) => {
            const r = rowState(i);
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 px-3 py-2",
                  i > 0 && "border-t border-white/12",
                  resolved && r.pass && "bg-white/[0.06]",
                )}
              >
                <span className="w-7 shrink-0 font-mono text-[10px] tabular-nums text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative h-2 flex-1 bg-white/[0.06]">
                  <span
                    className="absolute inset-y-0 left-0 transition-[width] duration-150 ease-out"
                    style={{
                      width: `${r.width}%`,
                      background: r.dim ? "hsl(0 0% 100% / 0.22)" : r.pass ? "#ffffff" : "hsl(0 0% 100% / 0.5)",
                    }}
                  />
                </span>
                <span
                  className={cn(
                    "w-4 text-center font-mono text-[12px] leading-none",
                    r.pass ? "text-white" : "text-white/30",
                  )}
                >
                  {r.pass ? "✓" : "✕"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 font-mono text-[11.5px] tabular-nums text-white/55">
          <span className="text-white">{tried.toLocaleString("en-US")}</span> combinations tried
        </div>

        {/* decide — resolution + commit, all inline (no sideways arrows) */}
        <div className="mt-6 flex items-center gap-2 font-mono text-[12px] tracking-[0.02em]">
          <span className={cn("inline-block h-1.5 w-1.5", resolved ? "bg-white" : "bg-white/30")} aria-hidden />
          <span className={resolved ? "text-white" : "text-white/45"}>
            {resolved ? "economic optimum found" : "searching configuration space"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.12em]">
          <Chip active={phase === "exec"}>economic optimum</Chip>
          <span className="text-white/35">→</span>
          <Chip active={phase === "exec"}>constraint gate</Chip>
          <span className="text-white/35">→</span>
          <Chip active={phase === "exec"} strong>
            recommend / execute
          </Chip>
        </div>
      </div>
    </figure>
  );
}

function Chip({
  active,
  strong = false,
  children,
}: {
  active: boolean;
  strong?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "border px-2 py-1 transition-colors duration-300",
        active
          ? cn("border-white text-white", strong && "bg-white/[0.08]")
          : "border-white/20 text-white/45",
      )}
    >
      {children}
    </span>
  );
}
