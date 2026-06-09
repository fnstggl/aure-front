import { AnimatePresence, motion } from "framer-motion";
import { Node, RailX, RailY, StatusTag, KV } from "./bits";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";

/* Diagram 1 — Scheduler Interception Layer.
   A slow five-stage loop lights the pipeline: ingest, placement, evaluate,
   dispatch, record. Aurelius reads metadata only, ranks candidates, rejects
   the unsafe one, and forwards the selected safe decision. All animation is
   opacity/transform inside reserved-height containers — no layout shift. */

const STAGES = [
  "ingest · reading job metadata",
  "placement · scheduler proposes a slot",
  "evaluate · ranking safe candidates",
  "dispatch · approved schedule, no payload access",
  "record · counterfactual appended to log",
];

const EASE = [0.16, 1, 0.3, 1] as const;

function StageNode({
  active,
  dim,
  className,
  children,
}: {
  active: boolean;
  dim: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ opacity: dim ? 0.4 : 1, y: active ? -2 : 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FlowConnector({ flowing }: { flowing: boolean }) {
  return (
    <>
      <RailY flowing={flowing} className="mx-auto h-5 lg:hidden" />
      <RailX flowing={flowing} className="hidden self-center lg:block" />
    </>
  );
}

export function SchedulerInterceptionDiagram() {
  const { ref, inView } = useInView();
  const step = useSequence(5, { enabled: inView, interval: 3000, resting: 2 });
  const decided = step >= 2;

  return (
    <div ref={ref} className="w-full p-5 md:p-7">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <StageNode active={step === 0} dim={step !== 0} className="lg:flex-1">
          <Node label="Workload Queue" sub="job metadata · timing · resources" active={step === 0} />
        </StageNode>

        <FlowConnector flowing={step === 1} />

        <StageNode active={step === 1} dim={step !== 1} className="lg:flex-1">
          <Node label="Existing Scheduler" sub="availability · fairness · latency" active={step === 1} />
        </StageNode>

        <FlowConnector flowing={step === 2} />

        {/* Control layer — reserved-height decision panel, opacity crossfade */}
        <StageNode active={step === 2} dim={step < 2} className="lg:flex-[1.35]">
          <Node label="Aurelius Control Layer" sub="forecast · decide · filter" active={step >= 2}>
            <div className="relative mt-3 h-[118px] overflow-hidden rounded-sm border border-signal/20 bg-background/50 p-2.5">
              {/* pending */}
              <motion.div
                className="absolute inset-2.5 flex items-center"
                animate={{ opacity: decided ? 0 : 1 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <span className="font-mono text-[11px] text-white/42">evaluating candidates…</span>
              </motion.div>

              {/* decided */}
              <motion.div
                className="absolute inset-2.5 space-y-1.5"
                animate={{ opacity: decided ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <KV k="forecast" v="lower-cost +38m" vClass="text-data" />
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] text-white/42">selected</span>
                  <span className="font-mono text-[11px] text-signal">delay batch job</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] text-white/42">rejected</span>
                  <span className="font-mono text-[11px] text-white/35 line-through">delay 2h · sla</span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-0.5">
                  <span className="font-mono text-[11px] text-white/42">constraint</span>
                  <StatusTag state="pass">sla pass</StatusTag>
                </div>
              </motion.div>
            </div>
          </Node>
        </StageNode>

        <FlowConnector flowing={step === 3} />

        <StageNode active={step === 3} dim={step < 3} className="lg:flex-1">
          <Node label="Execution Layer" sub="approved schedule · no payload access" active={step >= 3} />
        </StageNode>
      </div>

      {/* Branch to the append-only audit log */}
      <div className="mt-1 flex flex-col items-center">
        <RailY flowing={step === 4} className="h-6" />
        <StageNode active={step === 4} dim={step < 4} className="w-full max-w-md">
          <Node
            label="Append-only Log"
            sub="counterfactual savings · rejected decisions · audit trail"
            active={step === 4}
            className="text-center"
          />
        </StageNode>
      </div>

      {/* Live stage narration — fixed height, opacity/transform only */}
      <div className="mt-6 flex items-center justify-center gap-2.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal anim-breathe" aria-hidden />
        <div className="relative h-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="block font-mono text-[11px] uppercase tracking-[0.16em] text-white/45"
            >
              {STAGES[step]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
