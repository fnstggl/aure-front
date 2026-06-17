import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useSequence } from "@/hooks/useSequence";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, Annotation, StatusMark, C, EASE, RX } from "./plate";

/* Plate 06 — Hard constraint gates.
   One idea: safety is structural. A candidate passes physically through a row
   of hard gates; if one fails it stops at a red boundary and the rejection is
   recorded. Optimization stops at the boundary. */

const GATES = ["SLA", "CAPACITY", "RESIDENCY", "POLICY", "CONFIDENCE"];
const N = GATES.length;
const FAIL_AT = 2; // residency
const GX = GATES.map((_, i) => 150 + i * 178);
const RAIL_Y = 132;
const APPROVE = N + 1;
const FRAMES = APPROVE + (FAIL_AT + 1);

type GS = "idle" | "active" | "pass" | "fail";

function frame(f: number) {
  if (f < APPROVE) {
    const k = f;
    const gate = (g: number): GS => (g < k ? "pass" : g === k && k < N ? "active" : "idle");
    const pos = k < N ? GX[k] : GX[N - 1] + 76;
    return { gate, pos, verdict: k === N ? ("approved" as const) : null };
  }
  const k = f - APPROVE;
  const gate = (g: number): GS => {
    if (g === FAIL_AT && k >= FAIL_AT) return "fail";
    if (g < k) return "pass";
    if (g === k && k < FAIL_AT) return "active";
    return "idle";
  };
  const pos = GX[Math.min(k, FAIL_AT)];
  return { gate, pos, verdict: k >= FAIL_AT ? ("rejected" as const) : null };
}

const FILL: Record<GS, string> = { idle: C.surface, active: C.steelFillSoft, pass: C.steelFill, fail: C.redSoft };
const STROKE: Record<GS, string> = { idle: C.surfaceStroke, active: C.steelLine, pass: C.steelStrong, fail: C.redLine };

export function ConstraintEngineDiagram({ fig = "fig.06", title = "constraint gates" }: { fig?: string; title?: string } = {}) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();
  const f = useSequence(FRAMES, { enabled: inView, interval: 1250, resting: N });
  const { gate, pos, verdict } = frame(f);

  return (
    <div ref={ref}>
      <TopologyPlate fig={fig} title={title} caption="hard constraint gates" vb={[1000, 320]} minWidth={760}>
        {/* rail */}
        <line x1={70} y1={RAIL_Y} x2={GX[N - 1] + 76} y2={RAIL_Y} stroke={C.rail} strokeWidth="1.6" />

        {/* gates as vertical boundary plates */}
        {GATES.map((name, i) => {
          const s = gate(i);
          return (
            <g key={name} style={{ transition: "opacity 0.4s" }} opacity={s === "idle" ? 0.55 : 1}>
              <rect
                x={GX[i] - 11}
                y={RAIL_Y - 66}
                width={22}
                height={132}
                rx={RX}
                fill={FILL[s]}
                stroke={STROKE[s]}
                strokeWidth={s === "idle" ? 1.2 : 1.8}
                style={{ transition: "fill 0.4s, stroke 0.4s" }}
              />
              {s === "pass" && <StatusMark x={GX[i]} y={RAIL_Y - 84} kind="pass" r={6} />}
              {s === "fail" && <StatusMark x={GX[i]} y={RAIL_Y - 84} kind="fail" r={6} />}
              <Annotation x={GX[i]} y={RAIL_Y + 92} anchor="middle" state={s === "fail" ? "rejected" : s === "idle" ? "dim" : "active"} size={10.5} track={0.4}>
                {name}
              </Annotation>
            </g>
          );
        })}

        {/* candidate packet on the rail */}
        {!reduced && (
          <motion.circle r="5" cx={GX[0]} cy={RAIL_Y} fill={verdict === "rejected" ? C.red : C.steelText} initial={false} animate={{ cx: pos }} transition={{ type: "spring", stiffness: 180, damping: 24 }} />
        )}
        {reduced && <circle r="5" cy={RAIL_Y} cx={pos} fill={C.steelText} />}

        {/* verdict + ledger */}
        <foreignObject x={70} y={228} width={880} height={34}>
          <div className="flex h-full items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={verdict ?? "eval"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em]"
                style={
                  verdict === "approved"
                    ? { borderColor: C.steelLine, color: C.steelText }
                    : verdict === "rejected"
                      ? { borderColor: C.redLine, color: C.red }
                      : { borderColor: "transparent", color: C.dim }
                }
              >
                {verdict === "approved" ? "approved candidate" : verdict === "rejected" ? "rejected · failed at residency" : "evaluating gates…"}
              </motion.span>
            </AnimatePresence>
            {verdict === "rejected" && (
              <span className="font-mono text-[11px] text-white/45">
                <span className="text-white/28">append · </span>
                <span style={{ color: C.red }}>constraint.residency.fail</span> rejection_logged=true
              </span>
            )}
          </div>
        </foreignObject>
        <line x1={70} y1={280} x2={GX[N - 1] + 76} y2={280} stroke={C.rail} strokeWidth="1" />
        <Annotation x={70} y={304} state="dim" size={10.5} track={0.5}>
          HARD CONSTRAINTS ARE NOT PREFERENCES · UNSAFE SAVINGS DO NOT COUNT · EVERY REJECTION RECORDED
        </Annotation>
      </TopologyPlate>
    </div>
  );
}
