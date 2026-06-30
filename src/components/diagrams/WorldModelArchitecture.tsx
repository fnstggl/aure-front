import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ============================================================================
   FIG.01 — the planning cycle, told almost entirely through the search:
   Aurelius evaluates millions of possible futures before one decision, then
   does it again. The figure loops, slowly, like an instrument left running.

     CURRENT STATE     the cluster inputs the decision starts from
          ↓
     WORLD MODEL       1. SIMULATING  a dense field drifts in brightness, like
                          stars, while a counter climbs through ~millions of
                          simulated futures.
                       2. CONVERGING  the field's entropy collapses from the
                          edges inward (a JS progress value drives each cell by
                          distance from centre) until one square dominates.
                       3. DECIDED     the survivor emits a single soft pulse;
                          the outcome fades in beneath.
                       4. HOLD        the decision rests for a beat.
                       5. RESET       the full candidate field softly returns,
                          and the cycle restarts with a new total.
          ↓
     SELECTED PLAN     stated, not illustrated. No check, no card.

   Slow and restrained; no spinners, bars, bounce, or glow. Pure black plate,
   white ink, no color. Reduced motion shows the static resolved state.
   ============================================================================ */

const CURRENT_STATE = ["Cluster telemetry", "Workload queue", "Capacity state", "SLA targets"];

const GRID_COLS = 24;
const GRID_ROWS = 8;
const CELLS = GRID_COLS * GRID_ROWS; // 192
const WIN_ROW = Math.floor(GRID_ROWS / 2); // 4
const WIN_COL = Math.floor(GRID_COLS / 2); // 12
const WINNER_OP = 0.92;

/* Deterministic pseudo-random in [0,1) — stable across SSR and client. */
const rand = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/* Diagonal anisotropy: measuring distance along rotated (diagonal) axes with
   unequal weights turns the iso-distance contours into tilted ellipses, so the
   collapse reads as diagonal rather than as perfectly concentric rings. */
const DIAG_U = 0.62; // main diagonal (row + col)
const DIAG_V = 1.18; // anti-diagonal (row - col)

const CELL_RAW = Array.from({ length: CELLS }, (_, i) => {
  const dRow = Math.floor(i / GRID_COLS) - WIN_ROW;
  const dCol = (i % GRID_COLS) - WIN_COL;
  const distD = Math.hypot((dRow + dCol) * DIAG_U, (dRow - dCol) * DIAG_V);
  return { i, dRow, dCol, cheb: Math.max(Math.abs(dRow), Math.abs(dCol)), distD };
});
const MAX_D = Math.max(...CELL_RAW.map((c) => c.distD));

/* Per-cell geometry, precomputed once. `deathPoint` is where in the convergence
   (0→1) a cell winks out. Distance sets the base (far goes first, the survivor's
   neighbours last); per-cell noise roughens the front and a gentle diagonal
   sweep makes it asymmetric, so the collapse never looks like a uniform circle.
   The twinkle `delay` follows a diagonal wave so the simulating field already
   moves along the same axis the collapse will. */
const CELL_META = CELL_RAW.map((c) => {
  const nd = c.distD / MAX_D; // 0 at survivor, ~1 at the diagonal extremes
  const isWinner = c.cheb === 0;
  const noise = rand(c.i * 3.17 + 1) - 0.5; // -0.5..0.5
  const sweep = (c.dRow + c.dCol) / 40; // mild directional (diagonal) bias
  const deathPoint = isWinner ? 2 : Math.min(0.95, Math.max(0.04, 1 - nd + noise * 0.17 + sweep * 0.12));
  return {
    isWinner,
    isNeighbor: c.cheb === 1,
    ortho: c.dRow === 0 || c.dCol === 0,
    deathPoint,
    base: 0.22 + (1 - nd) * 0.45,
    delay: Math.round((c.dRow + c.dCol) * 95 + 1700 + rand(c.i * 1.7) * 600),
    dur: Math.round(3600 + rand(c.i * 2.3) * 1700),
  };
});

/* Simulated-future totals, rotated each cycle so the number varies pass to pass
   while staying in the ~2–3M band. */
const TARGETS = [2_641_882, 2_873_104, 2_487_339, 2_956_018, 2_312_540, 2_744_667];

const ALIVE_MS = 4500;
const CONVERGE_MS = 2600;
const DECIDED_MS = 3200; // single pulse + label fade-in + ~2s hold
const RESET_MS = 1300;
const COUNT_MS = 90;
const PROG_MS = 55;

type Phase = "simulate" | "converge" | "decided" | "reset";

export function WorldModelArchitecture({ className }: { className?: string }) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("decided");
  const [cycle, setCycle] = useState(0);
  const [count, setCount] = useState(TARGETS[0]);
  const [progress, setProgress] = useState(1);

  const target = TARGETS[cycle % TARGETS.length];

  // Start (or restart, each cycle) a pass when in view; static resolved state
  // for reduced motion / SSR.
  useEffect(() => {
    if (reduced || !inView) {
      setPhase("decided");
      setCount(target);
      setProgress(1);
      return;
    }
    setCount(Math.round(target * 0.9));
    setProgress(0);
    setPhase("simulate");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, cycle]);

  // Phase machine: simulate → converge → decided → reset → (next cycle). Loops.
  useEffect(() => {
    if (reduced || !inView) return;
    let id: number;
    if (phase === "simulate") {
      id = window.setTimeout(() => {
        setCount(target);
        setProgress(0);
        setPhase("converge");
      }, ALIVE_MS);
    } else if (phase === "converge") {
      id = window.setTimeout(() => setPhase("decided"), CONVERGE_MS);
    } else if (phase === "decided") {
      id = window.setTimeout(() => setPhase("reset"), DECIDED_MS);
    } else {
      id = window.setTimeout(() => setCycle((c) => c + 1), RESET_MS);
    }
    return () => window.clearTimeout(id);
  }, [phase, inView, reduced, target]);

  // Ease the counter up toward the total while the field is alive.
  useEffect(() => {
    if (reduced || !inView || phase !== "simulate") return;
    const id = window.setInterval(() => {
      setCount((c) => (c >= target ? target : Math.min(target, c + Math.max(1500, Math.round((target - c) * 0.07)))));
    }, COUNT_MS);
    return () => window.clearInterval(id);
  }, [phase, inView, reduced, target]);

  // Drive the collapse: progress 0→1 across the converge phase. Each cell winks
  // out as progress passes its deathPoint, so the field caves in from the edges.
  useEffect(() => {
    if (reduced || !inView || phase !== "converge") return;
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(1, p + PROG_MS / CONVERGE_MS);
        if (next >= 1) window.clearInterval(id);
        return next;
      });
    }, PROG_MS);
    return () => window.clearInterval(id);
  }, [phase, inView, reduced]);

  const decided = phase === "decided";

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
          <span className={cn("inline-block h-1.5 w-1.5", decided ? "bg-white" : "bg-white/70")} aria-hidden />
          {decided ? "Decided" : "Simulating"}
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

        <Connector />

        {/* ---------------- world model (the engine) ---------------- */}
        <PanelLabel>World model</PanelLabel>
        <div className="mt-2.5 border border-white px-3.5 pb-3 pt-3.5">
          <div className="mx-auto grid w-fit gap-[3px]" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 6px)` }}>
            {CELL_META.map((m, i) => {
              const { className: cellClass, style } = cellState(m, phase, progress, reduced);
              return <span key={i} aria-hidden className={cn("h-1.5 w-1.5 bg-white", cellClass)} style={style} />;
            })}
          </div>
          <div className="mt-3.5 flex items-baseline gap-2 border-t border-white/15 pt-2.5">
            <span className="font-mono text-[15px] font-medium tabular-nums leading-none text-white">
              {count.toLocaleString("en-US")}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/55">
              simulated futures
            </span>
          </div>
        </div>

        <Connector />

        {/* ---------------- selected plan (stated, fades in after the pulse) -------- */}
        <div
          className={cn(
            "flex flex-col items-center gap-1.5 pt-1 text-center transition-opacity",
            decided ? "opacity-100" : "opacity-0",
          )}
          style={{
            transitionDuration: decided ? "700ms" : "400ms",
            transitionDelay: decided ? "700ms" : "0ms",
          }}
        >
          <span className="font-mono text-[11px] uppercase leading-none tracking-[0.28em] text-white">
            Selected plan
          </span>
          <span className="font-mono text-[10px] uppercase leading-none tracking-[0.14em] text-white/72">
            Highest projected goodput / $
          </span>
          <span className="font-mono text-[10px] uppercase leading-none tracking-[0.14em] text-white/48">
            SLA constraints satisfied
          </span>
        </div>
      </div>
    </figure>
  );
}

type CellMeta = (typeof CELL_META)[number];

/* Per-cell appearance by phase. Simulate: drift like stars. Converge: hold
   `base` until progress passes `deathPoint`, then fade — edges first, so the
   field caves inward with no motion. Decided: the survivor pulses once and its
   neighbours illuminate once. Reset: every cell eases back to `base`, the full
   candidate field softly returning before the next pass. */
function cellState(m: CellMeta, phase: Phase, progress: number, reduced: boolean): {
  className: string;
  style: React.CSSProperties;
} {
  if (reduced) {
    return { className: "", style: { opacity: m.isWinner ? WINNER_OP : 0 } };
  }

  const twinkle = {
    className: "grid-cell-anim",
    style: { animationDelay: `${m.delay}ms`, animationDuration: `${m.dur}ms` },
  };

  if (phase === "simulate") return twinkle;

  if (phase === "converge") {
    // The survivor settles to a steady bright as the field caves in around it.
    if (m.isWinner) return { className: "transition-opacity duration-300 ease-out", style: { opacity: WINNER_OP } };
    // Where the collapse front has passed, the cell fades out; everywhere else
    // it keeps twinkling, uninterrupted, so the ripple flows into the collapse.
    if (progress >= m.deathPoint) {
      return { className: "transition-opacity ease-out", style: { opacity: 0, transitionDuration: "450ms" } };
    }
    return twinkle;
  }

  if (phase === "decided") {
    if (m.isWinner) return { className: "survivor-pulse-once origin-center", style: {} };
    if (m.isNeighbor) {
      return { className: "cell-pulse-once", style: { "--pulse-peak": m.ortho ? 0.3 : 0.16 } as React.CSSProperties };
    }
    return { className: "", style: { opacity: 0 } };
  }

  // reset: the candidate field softly returns
  return {
    className: "transition-opacity ease-in-out",
    style: { opacity: m.base, transitionDuration: `${RESET_MS}ms` },
  };
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">{children}</span>;
}

/* Quiet structural connector between stages — a hairline, no UI arrow. */
function Connector() {
  return (
    <div className="flex justify-center py-3.5" aria-hidden>
      <span className="h-5 w-px bg-white/18" />
    </div>
  );
}
