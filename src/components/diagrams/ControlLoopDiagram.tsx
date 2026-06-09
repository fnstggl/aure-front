import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, Annotation, C, EASE } from "./plate";

/* Plate 03 — Control loop.
   One idea: a deterministic closed loop. A single packet travels
   observe → forecast → decide → filter → log; the active station drives the
   evidence plane below. */

const STATIONS = [
  { key: "observe", label: "OBSERVE", cx: 120, cy: 116 },
  { key: "forecast", label: "FORECAST", cx: 350, cy: 66 },
  { key: "decide", label: "DECIDE", cx: 650, cy: 66 },
  { key: "filter", label: "FILTER", cx: 880, cy: 116 },
  { key: "log", label: "LOG", cx: 500, cy: 196 },
];

const LOOP =
  "M120 116 C170 78 255 58 350 66 C470 76 540 58 650 66 C770 74 845 82 880 116 C800 176 640 196 500 196 C360 196 175 176 120 116 Z";

const NOTE = [
  "read scheduler metadata only",
  "predict cost & carbon with uncertainty bounds",
  "rank run / delay / region / capacity options",
  "reject unsafe candidates under hard constraints",
  "record decisions & outcomes, append-only",
];

export function ControlLoopDiagram() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const step = useSequence(STATIONS.length, { enabled: inView, interval: 2400, resting: 1 });

  return (
    <div ref={ref}>
      <TopologyPlate fig="fig.03" caption="deterministic control loop" vb={[1000, 420]} minWidth={760}>
        {/* loop rail */}
        <path d={LOOP} fill="none" stroke={C.rail} strokeWidth="1.3" />
        {!reduced && inView && (
          <path d={LOOP} fill="none" stroke={C.steelLine} strokeWidth="1.3" strokeDasharray="3 9" className="flow-dash" opacity={0.7} />
        )}

        {/* stations */}
        {STATIONS.map((s, i) => {
          const active = i === step;
          return (
            <g key={s.key} style={{ transition: "opacity 0.5s" }} opacity={active ? 1 : 0.5}>
              <rect x={s.cx - 62} y={s.cy - 17} width={124} height={34} rx={5} fill={active ? C.steelFill : C.surface} stroke={active ? C.steelStrong : C.surfaceStroke} strokeWidth="1" style={{ transition: "fill 0.5s, stroke 0.5s" }} />
              <Annotation x={s.cx} y={s.cy + 4} anchor="middle" state={active ? "active" : "neutral"} size={12} track={1}>
                {String(i + 1).padStart(2, "0")} {s.label}
              </Annotation>
            </g>
          );
        })}

        {/* traveling packet */}
        {!reduced && inView && (
          <circle r="4" fill={C.steelText}>
            <animateMotion dur={`${STATIONS.length * 2.4}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#loop-rail" />
            </animateMotion>
          </circle>
        )}
        <path id="loop-rail" d={LOOP} fill="none" stroke="none" />

        {/* evidence plane */}
        <rect x={150} y={250} width={700} height={146} rx={7} fill={C.surface} stroke={C.surfaceStroke} strokeWidth="1" />
        <foreignObject x={150} y={250} width={700} height={146}>
          <div className="flex h-full flex-col p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: C.steelText }}>
                {STATIONS[step].label}
              </span>
              <span className="font-mono text-[10px] text-white/28">stage {step + 1}/5</span>
            </div>
            <p className="mb-2.5 font-mono text-[11.5px] text-white/45">{NOTE[step]}</p>
            <div className="min-h-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: EASE }}>
                  {step === 0 && (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 font-mono text-[11.5px]">
                      <Row k="job" v="batch_inference" /><Row k="gpus" v="128 × H100" />
                      <Row k="deadline" v="4h" /><Row k="access" v="metadata only" steel />
                    </div>
                  )}
                  {step === 1 && (
                    <svg viewBox="0 0 600 60" className="h-[52px] w-full">
                      <path d="M6 40 C80 30 130 18 200 34 C280 52 330 30 600 16" fill="none" stroke={C.steelLine} strokeWidth="1.6" />
                      <line x1="360" y1="6" x2="360" y2="54" stroke={C.steelLine} strokeDasharray="2 3" strokeWidth="1" opacity="0.6" />
                      <circle cx="360" cy="29" r="3" fill={C.steelText} />
                      <text x="372" y="20" className="font-mono" fontSize="11" fill={C.steelText}>−38m</text>
                    </svg>
                  )}
                  {step === 2 && (
                    <div className="space-y-1.5">
                      {[["delay 38m", 0.81, true], ["move region", 0.74, false], ["run now", 1.0, false]].map(([n, w, sel]) => (
                        <div key={n as string} className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="w-24 text-white/55">{n as string}</span>
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                            <span className="block h-full rounded-full" style={{ width: `${(w as number) * 100}%`, background: sel ? C.steelStrong : "hsl(0 0% 100% / 0.22)" }} />
                          </span>
                          <span className="w-10 text-right tabular-nums text-white/55">{(w as number).toFixed(2)}x</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {step === 3 && (
                    <div className="flex flex-wrap gap-2 font-mono text-[10.5px] uppercase tracking-wider">
                      {["sla", "capacity", "residency", "power"].map((t) => (
                        <span key={t} className="rounded-sm border px-2 py-0.5" style={{ borderColor: C.steelLine, color: C.steelText }}>✓ {t}</span>
                      ))}
                      <span className="rounded-sm border px-2 py-0.5" style={{ borderColor: C.redLine, color: C.red }}>✕ delay 2h · sla</span>
                    </div>
                  )}
                  {step === 4 && (
                    <div className="rounded-sm border border-border bg-background/60 p-2.5 font-mono text-[11px] text-white/55">
                      <span className="text-white/30">14:01:23 </span>
                      <span style={{ color: C.steelText }}>candidate.delay </span>expected_savings=18.4% sla=pass
                      <span className="anim-cursor" style={{ color: C.steelText }}>▍</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </foreignObject>
      </TopologyPlate>
    </div>
  );
}

function Row({ k, v, steel }: { k: string; v: string; steel?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/38">{k}</span>
      <span className={cn("tabular-nums", !steel && "text-white/70")} style={steel ? { color: C.steelText } : undefined}>{v}</span>
    </div>
  );
}
