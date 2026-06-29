import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Counter } from "@/components/site/Counter";
import { CaptionStrip, PlateHeader, C, EASE } from "./plate";

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
  logged: { label: "logged", color: "#ffffff" },
};

export function ShadowModeAuditDiagram({ fig = "fig.07", title = "shadow audit" }: { fig?: string; title?: string } = {}) {
  const { ref, inView } = useInView();

  return (
    <figure ref={ref} className="relative overflow-hidden border border-white bg-black">
      <PlateHeader fig={fig} title={title} />
      <MobileScaleFit width={760}>
          {/* ledger header */}
          <div className="flex items-center justify-between border-b border-white px-5 py-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white">audit.log — counterfactual ledger</span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white">
              <span className="h-1.5 w-1.5 bg-white" /> append-only
            </span>
          </div>

          {/* column header */}
          <div className="grid gap-x-4 border-b border-white px-5 py-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white" style={{ gridTemplateColumns: COLS }}>
            <span>time</span><span>observed</span><span>counterfactual</span><span>Δ exp.</span><span>constraints</span><span className="text-right">status</span>
          </div>

          {/* rows — all slots are always rendered so the ledger height is fixed
              and the section never pushes the rest of the page as rows reveal */}
          <div className="px-5">
            {ROWS.map((r, i) => {
              const st = statusStyle[r.status];
              return (
                <motion.div
                  key={r.t}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: inView ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: i * 0.12, ease: EASE }}
                  className="grid items-center gap-x-4 border-b border-white py-2.5 font-mono text-[12px]"
                  style={{ gridTemplateColumns: COLS }}
                >
                  <span className="text-white tabular-nums">{r.t}</span>
                  <span className="text-white">{r.observed}</span>
                  <span style={{ color: r.status === "selected" ? C.steelText : r.status === "rejected" ? C.red : "#ffffff" }}>{r.counter}</span>
                  <span className="tabular-nums" style={{ color: r.status === "rejected" ? C.red : "#ffffff" }}>{r.delta}</span>
                  <span className="text-white">{r.constraints}</span>
                  <span className="flex items-center justify-end gap-1.5 uppercase tracking-wider" style={{ color: st.color }}>
                    <span className="inline-block h-1.5 w-1.5" style={{ background: st.color }} />
                    {st.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* summary ledger strip */}
          <div className="grid grid-cols-2 gap-px border-t border-white bg-white sm:grid-cols-4">
            <Stat label="Counterfactual savings" value={<Counter to={18.4} enabled={inView} decimals={1} prefix="−" suffix="%" />} sub="$4,280 / mo" />
            <Stat label="Rejected unsafe" value={<Counter to={14} enabled={inView} />} />
            <Stat label="SLA violations avoided" value={<Counter to={6} enabled={inView} />} />
            <Stat label="Forecast confidence" value={<span style={{ color: C.steelText }}><Counter to={0.91} enabled={inView} decimals={2} /></span>} />
          </div>
      </MobileScaleFit>
      <CaptionStrip label="shadow-mode counterfactual audit" />
    </figure>
  );
}

/* The ledger needs a fixed pixel width to keep its columns legible. On desktop
   (md+) it keeps that width and the row scrolls if the viewport is narrower.
   On mobile we scale the whole block down to the available width so it fits the
   screen with no side-scroll, and collapse the wrapper height to match. The
   desktop DOM (overflow-x-auto + fixed min-width) is left exactly as before. */
function MobileScaleFit({ width, children }: { width: number; children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (!isMobile) {
        setFit((prev) => (prev === null ? prev : null));
        return;
      }
      const scale = Math.min(1, outer.clientWidth / width);
      const height = inner.offsetHeight * scale;
      setFit((prev) =>
        prev && Math.abs(prev.scale - scale) < 0.001 && Math.abs(prev.height - height) < 0.5
          ? prev
          : { scale, height },
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(inner);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [width]);

  return (
    <div
      ref={outerRef}
      className={fit ? "overflow-hidden" : "overflow-x-auto"}
      style={fit ? { height: fit.height } : undefined}
    >
      <div
        ref={innerRef}
        style={
          fit
            ? { width, transformOrigin: "top left", transform: `scale(${fit.scale})` }
            : { minWidth: width }
        }
      >
        {children}
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="bg-black px-5 py-3.5">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white">{label}</div>
      <div className="mt-1 font-mono text-xl tabular-nums text-white">{value}</div>
      {sub && <div className="mt-0.5 font-mono text-[11px] text-white">{sub}</div>}
    </div>
  );
}
