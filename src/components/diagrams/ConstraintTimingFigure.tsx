import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.03 — current-state control vs predictive control.

   The hypothesis is a comparison, not a one-path timeline: optimizing without
   future constraints produces systematically worse decisions than optimizing
   with them. So the figure forks one shared starting point into two control
   loops that face the SAME future constraints and diverge only in whether they
   reason about those constraints before committing:

     SAME CURRENT STATE
        ├─ CURRENT-STATE CONTROL   observe → schedule → constraints emerge →
        │                          decision degrades → economic loss   (red)
        └─ PREDICTIVE CONTROL      observe → forecast → world model →
                                   simulate → choose optimum → safe   (white)

   The difference is the control loop, not the environment. Restrained red marks
   the degraded path and the loss; brighter white marks the chosen optimum and
   the safe decision. Black plate, monochrome dominant, sharp geometry, static.
   ============================================================================ */

const RED = "#D2564E"; // restrained red — degraded path / loss only

const LEFT_STEPS: Step[] = [
  { label: "Observe" },
  { label: "Schedule" },
  { label: "Future constraints emerge" },
  { label: "Decision degrades", tone: "loss" },
  { label: "Economic loss", tone: "loss", strong: true },
];

const RIGHT_STEPS: Step[] = [
  { label: "Observe" },
  { label: "Forecast future constraints" },
  { label: "World model" },
  { label: "Simulate candidates" },
  { label: "Choose economic optimum", tone: "optimum" },
  { label: "Safe decision selected", tone: "optimum", strong: true, check: true },
];

type Step = {
  label: string;
  tone?: "neutral" | "loss" | "optimum";
  strong?: boolean;
  check?: boolean;
};

export function ConstraintTimingFigure({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.03" title="current-state control" />

      <div className="px-4 py-5">
        {/* shared origin — both loops face the same future */}
        <div className="mx-auto max-w-[300px] border border-white/45 px-3 py-2 text-center">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/85">
            same current state
          </div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">
            same future constraints ahead
          </div>
        </div>

        {/* fork into the two control loops — drawn on desktop, ↓ on mobile */}
        <svg
          className="mx-auto hidden h-6 w-full max-w-[560px] md:block"
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M200 0 V8 M100 8 H300 M100 8 V22 M300 8 V22"
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.3}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="flex justify-center py-1 font-mono text-[11px] text-white/30 md:hidden" aria-hidden>
          ↓
        </div>

        {/* the two control loops, side by side on desktop, stacked on mobile */}
        <div className="mt-1 flex flex-col gap-8 md:flex-row md:gap-5">
          <ControlColumn title="current-state control" steps={LEFT_STEPS} />
          {/* divider — vertical hairline on desktop, label gap on mobile */}
          <div className="hidden w-px shrink-0 self-stretch bg-white/12 md:block" aria-hidden />
          <ControlColumn title="aurelius predictive control" steps={RIGHT_STEPS} />
        </div>
      </div>

      <CaptionStrip label="same future constraints · different control loop" />
    </figure>
  );
}

function ControlColumn({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <div className="md:flex-1">
      <div className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
        {title}
      </div>
      <div className="grid gap-1.5">
        {steps.map((s, i) => (
          <div key={s.label} className="grid gap-1.5">
            <StepBox step={s} />
            {i < steps.length - 1 && <DownTick tone={steps[i + 1].tone} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepBox({ step }: { step: Step }) {
  const tone = step.tone ?? "neutral";
  return (
    <div
      className={cn(
        "border px-3 py-2 text-center font-mono text-[11px] uppercase tracking-[0.08em] leading-none",
        tone === "loss" && "text-[#D2564E]",
        tone === "optimum" && "text-white",
        tone === "neutral" && "border-white/25 text-white/62",
      )}
      style={
        tone === "loss"
          ? { borderColor: step.strong ? RED : `${RED}99`, backgroundColor: step.strong ? `${RED}1a` : undefined }
          : tone === "optimum"
            ? { borderColor: "#ffffff", backgroundColor: step.strong ? "rgba(255,255,255,0.08)" : undefined }
            : undefined
      }
    >
      {step.label}
      {step.check && <span className="ml-1.5">✓</span>}
    </div>
  );
}

function DownTick({ tone }: { tone?: Step["tone"] }) {
  return (
    <div
      className={cn(
        "flex justify-center font-mono text-[10px] leading-none",
        tone === "loss" ? "text-[#D2564E]/70" : tone === "optimum" ? "text-white/70" : "text-white/25",
      )}
      aria-hidden
    >
      ↓
    </div>
  );
}
