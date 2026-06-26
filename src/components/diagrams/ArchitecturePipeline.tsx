import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.01 — the one architecture diagram.

   The evaluation pipeline, top to bottom: operator telemetry → offline replay
   → shadow mode → savings report → controlled rollout. Outline-only stations,
   sharp corners, monospace labels. Antique gold marks only the committed path
   (the final, reversible rollout) — the single place color earns its place.
   No motion: a systems-paper figure, not an animation.
   ============================================================================ */

type Stage = {
  n: string;
  title: string;
  sub: string;
  tag?: string;
  committed?: boolean;
};

const STAGES: Stage[] = [
  { n: "01", title: "Operator telemetry", sub: "Scheduler metadata in — no payloads, no model outputs", tag: "ingest" },
  { n: "02", title: "Offline replay", sub: "Historical production traces, deterministic", tag: "offline" },
  { n: "03", title: "Shadow mode", sub: "Read-only, alongside the live scheduler", tag: "read-only" },
  { n: "04", title: "Savings report", sub: "Audited counterfactual: goodput/$, GPU-hours", tag: "report" },
  { n: "05", title: "Controlled rollout", sub: "Gradual, reversible, constraint-gated", tag: "committed", committed: true },
];

function Chevron({ gold }: { gold?: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      aria-hidden
      className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", gold ? "text-gold/70" : "text-white/30")}
    >
      <path d="M1.5 3L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

export function ArchitecturePipeline({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-strong bg-card", className)}>
      <PlateHeader fig="fig.01" title="evaluation pipeline" />
      <div className="relative">
        <div className="diagram-grid pointer-events-none absolute inset-0" aria-hidden />
        <ol className="relative mx-auto flex w-full max-w-[460px] flex-col px-5 py-9 sm:px-7 md:py-11">
          {STAGES.map((s, i) => {
            const nextCommitted = STAGES[i + 1]?.committed;
            return (
              <li key={s.n}>
                <div
                  className={cn(
                    "relative flex items-start gap-4 border px-4 py-3.5",
                    s.committed ? "border-gold/45" : "border-white/12",
                  )}
                >
                  {/* left registration tick */}
                  <span
                    aria-hidden
                    className={cn("absolute -left-px top-3.5 h-3 w-px", s.committed ? "bg-gold/70" : "bg-white/30")}
                  />
                  <span
                    className={cn(
                      "mt-px font-mono text-[11px] tabular-nums leading-none",
                      s.committed ? "text-gold/90" : "text-white/35",
                    )}
                  >
                    {s.n}
                  </span>
                  <div className="min-w-0">
                    <div
                      className={cn(
                        "font-mono text-[11.5px] uppercase leading-none tracking-[0.16em]",
                        s.committed ? "text-gold" : "text-white/88",
                      )}
                    >
                      {s.title}
                    </div>
                    <div className="mt-2 text-[12.5px] leading-snug text-white/46">{s.sub}</div>
                  </div>
                  {s.tag && (
                    <span className="ml-auto hidden self-center whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/22 sm:inline">
                      {s.tag}
                    </span>
                  )}
                </div>
                {i < STAGES.length - 1 && (
                  <div className="relative flex h-8 items-center justify-center" aria-hidden>
                    <span className={cn("block h-full w-px", nextCommitted ? "bg-gold/40" : "bg-white/14")} />
                    <Chevron gold={nextCommitted} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <CaptionStrip label="telemetry → replay → shadow → savings → rollout" />
    </figure>
  );
}
