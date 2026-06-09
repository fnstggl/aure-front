import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { Counter } from "@/components/site/Counter";
import { CaptionStrip, C, EASE } from "./plate";

/* Plate 08 — Shadow audit ledger.
   One idea: an append-only, timestamped record of what Aurelius would have
   done — observed action, counterfactual, expected delta, constraints,
   status. Mostly white/gray; one selected in steel, one rejected in red.
   No execution impact: the record is the deliverable. */

type Status = "selected" | "rejected" | "logged";
type Row = { t: string; observed: string; counter: string; delta: string; constraints: string; status: Status };

const ROWS: Row[] = [
  { t: "14:01:22", observed: "run now", counter: "delay 38m", delta: "−18.4%", constraints: "sla · capacity · residency", status: "selected" },
  { t: "14:07:05", observed: "run now", counter: "move region", delta: "−12.1%", constraints: "residency", status: "rejected" },
  { t: "14:22:41", observed: "delay 1h", counter: "delay 38m", delta: "−9.6%", constraints: "sla · capacity", status: "logged" },
  { t: "14:42:10", observed: "run now", counter: "delay 24m", delta: "−7.2%", constraints: "sla · power", status: "logged" },
];

const COLS = "96px 1.1fr 1.1fr 76px 1.4fr 104px";

const statusStyle: Record<Status, { label: string; color: string }> = {
  selected: { label: "selected", color: C.steelText },
  rejected: { label: "rejected", color: C.red },
  logged: { label: "logged", color: "hsl(0 0% 100% / 0.5)" },
};

export function ShadowModeAuditDiagram() {
  const { ref, inView } = useInView();
  const step = useSequence(ROWS.length, { enabled: inView, interval: 1500, resting: ROWS.length - 1 });

  return (
    <figure ref={ref} className="relative overflow-hidden rounded-lg border border-border bg-card">
      <span className="pointer-events-none absolute right-4 top-3 z-10 font-mono text-[10px] tracking-[0.16em] text-white/22">fig.08</span>
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          {/* header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3 pr-16">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">audit.log — counterfactual ledger</span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/35">
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" /> append-only
            </span>
          </div>

          {/* column header */}
          <div className="grid gap-x-4 border-b border-border/70 px-5 py-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/30" style={{ gridTemplateColumns: COLS }}>
            <span>time</span><span>observed</span><span>counterfactual</span><span>Δ exp.</span><span>constraints</span><span className="text-right">status</span>
          </div>

          {/* rows — all slots are always rendered so the ledger height is fixed
              and the section never pushes the rest of the page as rows reveal */}
          <div className="px-5">
            {ROWS.map((r, i) => {
              const st = statusStyle[r.status];
              const visible = i <= step;
              return (
                <motion.div
                  key={r.t}
                  initial={false}
                  animate={{ opacity: visible ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="grid items-center gap-x-4 border-b border-border/40 py-2.5 font-mono text-[12px]"
                  style={{ gridTemplateColumns: COLS }}
                >
                  <span className="text-white/30 tabular-nums">{r.t}</span>
                  <span className="text-white/55">{r.observed}</span>
                  <span style={{ color: r.status === "selected" ? C.steelText : r.status === "rejected" ? C.red : "hsl(0 0% 100% / 0.78)" }}>{r.counter}</span>
                  <span className="tabular-nums" style={{ color: r.status === "rejected" ? C.red : "hsl(0 0% 92%)" }}>{r.delta}</span>
                  <span className="text-white/42">{r.constraints}</span>
                  <span className="flex items-center justify-end gap-1.5 uppercase tracking-wider" style={{ color: st.color }}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: st.color }} />
                    {st.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* summary ledger strip */}
          <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4">
            <Stat label="Counterfactual savings" value={<Counter to={18.4} enabled={inView} decimals={1} prefix="−" suffix="%" />} sub="$4,280 / mo" />
            <Stat label="Rejected unsafe" value={<Counter to={14} enabled={inView} />} />
            <Stat label="SLA violations avoided" value={<Counter to={6} enabled={inView} />} />
            <Stat label="Forecast confidence" value={<span style={{ color: C.steelText }}><Counter to={0.91} enabled={inView} decimals={2} /></span>} />
          </div>
        </div>
      </div>
      <CaptionStrip label="shadow-mode counterfactual audit" />
    </figure>
  );
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="bg-card-elevated px-5 py-3.5">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">{label}</div>
      <div className="mt-1 font-mono text-xl tabular-nums text-foreground">{value}</div>
      {sub && <div className="mt-0.5 font-mono text-[11px] text-white/40">{sub}</div>}
    </div>
  );
}
