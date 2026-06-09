import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { RailY } from "./bits";

/* Diagram 7 — Metadata Boundary.
   Only job metadata crosses into Aurelius. The payload / data path circulates
   inside the customer environment and is blocked at the boundary. */

const ENV_NODES = [
  { label: "Workload Queue", sub: "jobs · payloads" },
  { label: "Scheduler", sub: "placement state" },
  { label: "Execution Layer", sub: "model outputs" },
  { label: "Logs", sub: "run history" },
];

const AURELIUS_NODES = [
  { label: "Metadata Reader", sub: "read-only" },
  { label: "Forecaster", sub: "cost · carbon" },
  { label: "Decision Engine", sub: "ranked candidates" },
  { label: "Constraint Filter", sub: "hard gates" },
  { label: "Audit Log", sub: "append-only" },
];

function MiniNode({ label, sub, tone }: { label: string; sub: string; tone: "neutral" | "gold" }) {
  return (
    <div
      className={cn(
        "rounded-md border bg-card-elevated px-3 py-2",
        tone === "gold" ? "border-signal/25" : "border-border",
      )}
    >
      <div className={cn("font-mono text-[10px] uppercase tracking-[0.12em]", tone === "gold" ? "text-steel/90" : "text-white/72")}>
        {label}
      </div>
      <div className="mt-0.5 font-mono text-[10px] text-white/40">{sub}</div>
    </div>
  );
}

const BLOCKED = ["prompts", "model outputs", "training data", "payloads", "source code"];

export function MetadataBoundaryDiagram() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={ref} className="w-full p-5 md:p-7">
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
        {/* Customer environment */}
        <div className="flex-1 rounded-md border border-border bg-card/40 p-4">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/42">
            Your secure environment
          </div>
          <div className="relative grid grid-cols-2 gap-2.5">
            {ENV_NODES.map((n) => (
              <MiniNode key={n.label} {...n} tone="neutral" />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-white/42">
            <span className={cn("inline-block h-1.5 w-1.5 rounded-full bg-white/40", !reduced && inView && "anim-breathe")} />
            payload &amp; data path — stays inside
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
            {BLOCKED.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 rounded-sm border border-destructive/30 px-1.5 py-0.5 font-mono text-[9.5px] text-destructive/75"
              >
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none" aria-hidden>
                  <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Boundary with crossings */}
        <div className="relative flex shrink-0 items-center justify-center py-3 md:w-32 md:py-0">
          {/* boundary line */}
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-transparent md:left-1/2 md:top-0 md:h-full md:w-px">
            <div className="h-full w-full border-t border-dashed border-white/15 md:border-l md:border-t-0" />
          </div>

          <div className="relative z-10 flex w-full flex-col items-center gap-4">
            {/* metadata crosses — the approved gold path */}
            <div className="flex w-full items-center gap-2">
              <div className="relative h-px flex-1 rail-x rail-gold" aria-hidden>
                {!reduced && inView && (
                  <motion.span
                    className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-signal"
                    initial={{ left: "0%", opacity: 0 }}
                    animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>
            </div>
            <span className="rounded-sm border border-signal/40 bg-signal/[0.06] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-steel">
              metadata only
            </span>

            {/* payload blocked */}
            <div className="flex w-full items-center gap-1.5">
              <div className="h-px flex-1 bg-white/10" aria-hidden />
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <circle cx="6" cy="6" r="5" stroke="hsl(1 44% 44% / 0.7)" strokeWidth="1" />
                <path d="M3 3l6 6" stroke="hsl(1 44% 44% / 0.7)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/40">payload blocked</span>
          </div>
        </div>

        {/* Aurelius */}
        <div className="flex-1 rounded-md border border-signal/20 bg-signal/[0.03] p-4">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-steel/80">
            Aurelius control layer
          </div>
          <div className="flex flex-col items-stretch gap-0">
            {AURELIUS_NODES.map((n, i) => (
              <div key={n.label}>
                <MiniNode {...n} tone="gold" />
                {i < AURELIUS_NODES.length - 1 && <RailY flowing={inView} gold className="mx-auto h-2.5" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
