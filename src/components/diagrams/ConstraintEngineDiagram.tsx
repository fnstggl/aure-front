import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, Annotation, StatusMark, C, EASE } from "./plate";

/* Plate 06 — Constraint gates.
   One idea: safety is structural. A candidate signal passes physically
   through hard gates; if one fails, it stops at a red boundary and the
   rejection is recorded. */

const GATES = ["SLA", "CAPACITY", "POWER", "RESIDENCY", "POLICY", "AVAILABILITY", "CONFIDENCE"];
const GX = GATES.map((_, i) => 140 + i * 116);
const RAIL_Y = 140;
const FRAMES = 13; // 0-7 approve, 8-12 reject (fails at POWER = index 2)

type GS = "idle" | "active" | "pass" | "fail";

function frame(f: number) {
  if (f <= 7) {
    const gate = (g: number): GS => (g < f ? "pass" : g === f && f <= 6 ? "active" : "idle");
    const pos = f <= 6 ? GX[f] : GX[6] + 70;
    return { gate, pos, verdict: f === 7 ? ("approved" as const) : null };
  }
  const l = f - 8; // 0..4 ; fail at gate 2
  const gate = (g: number): GS => {
    if (g === 2 && l >= 2) return "fail";
    if (g < Math.min(l, 2)) return "pass";
    if (g === l && l < 2) return "active";
    return "idle";
  };
  const pos = l < 2 ? GX[l] : GX[2];
  return { gate, pos, verdict: l >= 2 ? ("rejected" as const) : null };
}

const FILL: Record<GS, string> = { idle: C.surface, active: C.steelFillSoft, pass: C.steelFill, fail: C.redSoft };
const STROKE: Record<GS, string> = { idle: C.surfaceStroke, active: C.steelLine, pass: C.steelStrong, fail: C.redLine };

export function ConstraintEngineDiagram() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const f = useSequence(FRAMES, { enabled: inView, interval: 1150, resting: 7 });
  const { gate, pos, verdict } = frame(f);

  return (
    <div ref={ref}>
      <TopologyPlate fig="fig.06" caption="hard constraint gates" vb={[1000, 360]} minWidth={840}>
        {/* rail */}
        <line x1={50} y1={RAIL_Y} x2={950} y2={RAIL_Y} stroke={C.rail} strokeWidth="1.3" />

        {/* gates as vertical boundary plates */}
        {GATES.map((name, i) => {
          const s = gate(i);
          return (
            <g key={name} style={{ transition: "opacity 0.4s" }} opacity={s === "idle" ? 0.55 : 1}>
              <rect x={GX[i] - 9} y={RAIL_Y - 64} width={18} height={128} rx={4} fill={FILL[s]} stroke={STROKE[s]} strokeWidth="1" style={{ transition: "fill 0.4s, stroke 0.4s" }} />
              {s === "pass" && <StatusMark x={GX[i]} y={RAIL_Y - 80} kind="pass" r={6} />}
              {s === "fail" && <StatusMark x={GX[i]} y={RAIL_Y - 80} kind="fail" r={6} />}
              <Annotation x={GX[i]} y={RAIL_Y + 92} anchor="middle" state={s === "fail" ? "rejected" : s === "idle" ? "dim" : "active"} size={9.5} track={0.4}>{name}</Annotation>
            </g>
          );
        })}

        {/* candidate packet on the rail */}
        {!reduced && (
          <motion.circle r="5" cy={RAIL_Y} fill={verdict === "rejected" ? C.red : C.steelText} animate={{ cx: pos }} transition={{ type: "spring", stiffness: 180, damping: 24 }} />
        )}

        {/* verdict + ledger */}
        <foreignObject x={50} y={250} width={900} height={40}>
          <div className="flex h-full items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={verdict ?? "eval"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="rounded-sm border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em]"
                style={
                  verdict === "approved"
                    ? { borderColor: C.steelLine, color: C.steelText }
                    : verdict === "rejected"
                      ? { borderColor: C.redLine, color: C.red }
                      : { borderColor: "transparent", color: C.dim }
                }
              >
                {verdict === "approved" ? "approved candidate" : verdict === "rejected" ? "rejected · failed at power" : "evaluating gates…"}
              </motion.span>
            </AnimatePresence>
            {verdict === "rejected" && (
              <span className="font-mono text-[11px] text-white/45">
                <span className="text-white/28">append · </span>
                <span style={{ color: C.red }}>constraint.power.fail</span> rejection_logged=true
              </span>
            )}
          </div>
        </foreignObject>
        <line x1={50} y1={300} x2={950} y2={300} stroke={C.rail} strokeWidth="1" />
        <Annotation x={50} y={326} state="dim" size={10.5} track={0.5}>HARD CONSTRAINTS ARE NOT PREFERENCES · UNSAFE SAVINGS DO NOT COUNT · EVERY REJECTION RECORDED</Annotation>
      </TopologyPlate>
    </div>
  );
}
