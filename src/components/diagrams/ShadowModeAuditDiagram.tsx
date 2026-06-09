import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { Counter } from "@/components/site/Counter";

/* Diagram 6 — Shadow Mode Audit Trail.
   An append-only log writes one line at a time while the side ledger counts
   up. Nothing is executed — the record is the deliverable. */

const EASE = [0.16, 1, 0.3, 1] as const;

type Seg = { t: string; c?: "time" | "key" | "amber" | "body" };
const LINES: { segs: Seg[] }[] = [
  { segs: [{ t: "14:01:22", c: "time" }, { t: "observed.job", c: "key" }, { t: "batch_inference gpu=128 deadline=4h", c: "body" }] },
  { segs: [{ t: "14:01:23", c: "time" }, { t: "forecast.window", c: "key" }, { t: "lower_cost_in=38m", c: "body" }, { t: "confidence=0.91", c: "amber" }] },
  { segs: [{ t: "14:01:23", c: "time" }, { t: "candidate.delay", c: "key" }, { t: "expected_savings=18.4%", c: "amber" }, { t: "sla=pass", c: "body" }] },
  { segs: [{ t: "14:01:23", c: "time" }, { t: "constraint.residency", c: "key" }, { t: "pass region=us-west", c: "body" }] },
  { segs: [{ t: "14:01:23", c: "time" }, { t: "shadow_mode", c: "key" }, { t: "no_action_taken", c: "amber" }] },
  { segs: [{ t: "14:42:10", c: "time" }, { t: "outcome.counterfactual", c: "key" }, { t: "savings_validated=true", c: "amber" }] },
];

const colorClass: Record<NonNullable<Seg["c"]>, string> = {
  time: "text-white/28",
  key: "text-white/80",
  amber: "text-signal",
  body: "text-white/50",
};

export function ShadowModeAuditDiagram() {
  const { ref, inView } = useInView();
  const step = useSequence(LINES.length, { enabled: inView, interval: 1700, resting: LINES.length - 1 });
  const visible = LINES.slice(0, step + 1);

  return (
    <div ref={ref} className="grid w-full gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-[1.7fr_1fr]">
      {/* terminal */}
      <div className="bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">audit.log</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal anim-breathe" /> append-only
          </span>
        </div>
        <div className="h-[208px] overflow-hidden space-y-1 p-4 font-mono text-[11.5px] leading-relaxed">
          <AnimatePresence initial={false}>
            {visible.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex flex-wrap gap-x-2"
              >
                {line.segs.map((s, si) => (
                  <span key={si} className={colorClass[s.c ?? "body"]}>
                    {s.t}
                  </span>
                ))}
                {i === visible.length - 1 && <span className="anim-cursor text-signal">▍</span>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* side ledger */}
      <div className="bg-card-elevated">
        <div className="border-b border-border px-4 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">ledger</span>
        </div>
        <div className="divide-y divide-border">
          <Stat label="Counterfactual savings" value={<><span className="text-signal"><Counter to={18.4} enabled={inView} decimals={1} prefix="−" suffix="%" /></span></>} sub="$4,280 / mo" />
          <Stat label="Rejected unsafe candidates" value={<Counter to={14} enabled={inView} />} />
          <Stat label="SLA violations avoided" value={<Counter to={6} enabled={inView} />} />
          <Stat label="Forecast confidence" value={<Counter to={0.91} enabled={inView} decimals={2} />} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="px-4 py-3.5">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/42">{label}</div>
      <div className="mt-1 font-mono text-xl tabular-nums text-foreground">{value}</div>
      {sub && <div className="mt-0.5 font-mono text-[11px] text-white/42">{sub}</div>}
    </div>
  );
}
