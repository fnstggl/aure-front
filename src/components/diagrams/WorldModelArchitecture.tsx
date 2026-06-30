import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ============================================================================
   FIG.01 — one idea, told almost entirely through the search:
   Aurelius evaluates millions of possible futures before one decision.

     CURRENT STATE     the cluster inputs the decision starts from
          ↓
     WORLD MODEL       a dense field drifts in brightness, like stars, while a
                       counter climbs through ~millions of simulated futures.
                       Then it does not "select" — it CONVERGES: the field's
                       entropy collapses from the edges inward (a JS progress
                       value drives each cell, by distance from centre) until a
                       single square is all that remains. Nothing moves;
                       everything else simply disappears. The survivor then
                       emits one soft, restrained pulse every few seconds.
          ↓
     SELECTED PLAN     stated, not illustrated. No check, no card, no list.

   95% of the figure is search; selection is left implicit. Pure black plate,
   white ink, no color. Reduced motion shows the resolved survivor.
   ============================================================================ */

const CURRENT_STATE = ["Cluster telemetry", "Workload queue", "Capacity state", "SLA targets"];

const GRID_COLS = 24;
const GRID_ROWS = 8;
const CELLS = GRID_COLS * GRID_ROWS; // 192
const WIN_ROW = Math.floor(GRID_ROWS / 2); // 4
const WIN_COL = Math.floor(GRID_COLS / 2); // 12
const MAX_D = Math.hypot(WIN_ROW, WIN_COL);
const WINNER_OP = 0.92;

/* Per-cell geometry, precomputed once. `deathPoint` is where in the convergence
   (0→1) a cell winks out: far cells (near 0) go first, the survivor's
   neighbours (near 1) go last. `base` brightens toward the centre. */
const CELL_META = Array.from({ length: CELLS }, (_, i) => {
  const row = Math.floor(i / GRID_COLS);
  const col = i % GRID_COLS;
  const dRow = row - WIN_ROW;
  const dCol = col - WIN_COL;
  const cheb = Math.max(Math.abs(dRow), Math.abs(dCol));
  const nd = Math.hypot(dRow, dCol) / MAX_D; // 0 at survivor, ~1 at corners
  return {
    isWinner: cheb === 0,
    isNeighbor: cheb === 1,
    ortho: dRow === 0 || dCol === 0,
    deathPoint: 1 - nd,
    base: 0.22 + (1 - nd) * 0.45,
    delay: (i % GRID_COLS) * 90 + ((i * 17) % 30) * 8,
    dur: 4200 + ((i * 53) % 2800),
  };
});

const TARGET = 2_641_882; // simulated futures explored before the decision

const ALIVE_MS = 4800;
const CONVERGE_MS = 2600;
const COUNT_MS = 90;
const PROG_MS = 55;

type Phase = "alive" | "converge" | "decided";

export function WorldModelArchitecture({ className }: { className?: string }) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("decided");
  const [count, setCount] = useState(TARGET);
  const [progress, setProgress] = useState(1);

  // One pass when the figure enters view: alive -> converge -> decided. The
  // resolved survivor otherwise (and for reduced motion / SSR).
  useEffect(() => {
    if (reduced || !inView) {
      setPhase("decided");
      setCount(TARGET);
      setProgress(1);
      return;
    }
    setCount(Math.round(TARGET * 0.9));
    setProgress(0);
    setPhase("alive");
  }, [inView, reduced]);

  // Phase machine. "decided" is terminal: the answer is inevitable, it stays.
  useEffect(() => {
    if (reduced || !inView) return;
    let id: number;
    if (phase === "alive") {
      id = window.setTimeout(() => {
        setCount(TARGET);
        setProgress(0);
        setPhase("converge");
      }, ALIVE_MS);
    } else if (phase === "converge") {
      id = window.setTimeout(() => setPhase("decided"), CONVERGE_MS);
    }
    return () => window.clearTimeout(id);
  }, [phase, inView, reduced]);

  // Ease the counter up toward the total while the field is alive.
  useEffect(() => {
    if (reduced || !inView || phase !== "alive") return;
    const id = window.setInterval(() => {
      setCount((c) => (c >= TARGET ? TARGET : Math.min(TARGET, c + Math.max(1500, Math.round((TARGET - c) * 0.07)))));
    }, COUNT_MS);
    return () => window.clearInterval(id);
  }, [phase, inView, reduced]);

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

        {/* ---------------- selected plan (stated, not illustrated) ---------------- */}
        <div className="flex justify-center pt-1">
          <span
            className={cn(
              "font-mono text-[11px] uppercase leading-none tracking-[0.28em] text-white transition-opacity duration-700",
              decided ? "opacity-100" : "opacity-0",
            )}
          >
            Selected plan
          </span>
        </div>
      </div>
    </figure>
  );
}

type CellMeta = (typeof CELL_META)[number];

/* Per-cell appearance by phase. Alive: drift like stars. Converge: hold `base`
   until progress passes `deathPoint`, then fade to nothing — edges first, so
   the field caves inward with no motion. Decided: only the survivor, its
   immediate neighbours pulsing faintly. */
function cellState(m: CellMeta, phase: Phase, progress: number, reduced: boolean): {
  className: string;
  style: React.CSSProperties;
} {
  if (phase === "alive" && !reduced) {
    return {
      className: "grid-cell-anim",
      style: { animationDelay: `${m.delay}ms`, animationDuration: `${m.dur}ms` },
    };
  }

  if (phase === "converge" && !reduced) {
    const op = m.isWinner ? WINNER_OP : progress >= m.deathPoint ? 0 : m.base;
    return { className: "transition-opacity duration-300 ease-out", style: { opacity: op } };
  }

  // decided (or reduced / SSR): the lone survivor, neighbours pulsing faintly.
  if (m.isWinner) return { className: "", style: { opacity: WINNER_OP } };
  if (!reduced && m.isNeighbor) {
    return { className: "cell-pulse", style: { "--pulse-peak": m.ortho ? 0.3 : 0.16 } as React.CSSProperties };
  }
  return { className: "", style: { opacity: 0 } };
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
