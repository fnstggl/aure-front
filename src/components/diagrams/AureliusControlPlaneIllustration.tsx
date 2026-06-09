import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import meta from "./aurelius-control-plane/meta.json";

/* ============================================================================
   Aurelius Control Plane — flagship layered isometric illustration (v2).

   Two stacked planes tell the architecture at a glance: the SECURE ENVIRONMENT
   (workload queue -> scheduler -> execution) and the AURELIUS CONTROL PLANE
   sidecar (core + constraint gate + audit ledger), joined only by a thin steel
   METADATA-ONLY bridge. Payloads are blocked at the boundary; an advisory
   recommendation returns to the scheduler.

   Each layer is an opaque asset under /public/diagrams/aurelius-control-plane/.
   Swap any file for a Spline/Figma render at the same 1440x900 canvas and this
   component is unchanged. Flow paths are drawn/animated in an overlay SVG (so
   the bridge can "draw in", the packet can travel, the payload can flash once)
   and fall back to the static exported path layers under reduced motion.
   Only opacity / transform / SVG pathLength animate — no layout shift.
   ========================================================================== */

const SRC = "/diagrams/aurelius-control-plane";
const [VW, VH] = meta.viewBox as [number, number];
const px = (x: number) => `${(x / VW) * 100}%`;
const py = (y: number) => `${(y / VH) * 100}%`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* opaque object/floor layers, back -> front; `rest` = settled opacity */
type Layer = { id: string; rest: number; delay: number; fromY?: number };
const LAYERS: Layer[] = [
  { id: "base_plane", rest: 1, delay: 0 },
  { id: "background_grid", rest: 0.72, delay: 0.1 },
  { id: "customer_environment", rest: 0.95, delay: 0.26 },
  { id: "execution_layer", rest: 0.6, delay: 0.74 }, // downstream, settles dim
  { id: "scheduler", rest: 1, delay: 0.52 },
  { id: "workload_queue", rest: 0.86, delay: 0.4 },
  { id: "sidecar_boundary", rest: 0.95, delay: 0.92 },
  { id: "aurelius_control_plane", rest: 1, delay: 1.06, fromY: 16 },
  { id: "constraint_engine", rest: 0.95, delay: 1.5 },
  { id: "audit_ledger", rest: 0.95, delay: 1.66 },
];
const layerVariants = {
  hidden: (c: Layer) => ({ opacity: 0, y: c.fromY ?? 6 }),
  shown: (c: Layer) => ({ opacity: c.rest, y: 0, transition: { duration: 0.75, delay: c.delay, ease: EASE } }),
};

/* HTML technical tags (crisp + accessible); positions in 1440x900 canvas space */
type Tag = { text: string; sub?: string; at: [number, number]; place: "above" | "below" | "left" | "right"; tone?: "default" | "steel" | "red" | "dim"; primary?: boolean; mobileHide?: boolean };
const C = meta.centers as Record<string, [number, number]>;
const TAGS: Tag[] = [
  { text: "EXISTING SCHEDULER", sub: "scheduler remains authority", at: [C.scheduler[0], C.scheduler[1] - 14], place: "above" },
  { text: "EXECUTION LAYER", sub: "execution unchanged", at: [C.execution[0] + 12, C.execution[1] - 12], place: "above" },
  { text: "WORKLOAD QUEUE", sub: "job metadata · timing", at: [C.queue[0] - 14, C.queue[1] - 6], place: "left" },
  { text: "AURELIUS CONTROL PLANE", sub: "forecast · rank · filter · log", at: [C.aurelius[0], C.aurelius[1] + 36], place: "below", primary: true },
  { text: "CONSTRAINT ENGINE", at: [C.constraint[0] + 10, C.constraint[1] + 24], place: "below", mobileHide: true },
  { text: "APPEND-ONLY AUDIT LEDGER", at: [C.ledger[0] - 8, C.ledger[1] + 26], place: "below", mobileHide: true },
  { text: "METADATA ONLY", at: meta.metaTag as [number, number], place: "above", tone: "steel" },
  { text: "PAYLOAD BLOCKED", at: meta.payloadTag as [number, number], place: "right", tone: "red" },
  { text: "YOUR SECURE ENVIRONMENT", at: [84, 808], place: "right", tone: "dim", mobileHide: true },
];
const toneClass: Record<NonNullable<Tag["tone"]>, string> = {
  default: "text-white/82 border-white/12",
  steel: "text-[hsl(217_30%_72%)] border-[hsl(216_28%_50%/0.4)]",
  red: "text-[hsl(1_44%_62%)] border-[hsl(1_44%_46%/0.42)]",
  dim: "text-white/42 border-white/10",
};
const placeStyle: Record<Tag["place"], React.CSSProperties> = {
  above: { transform: "translate(-50%, -100%)" },
  below: { transform: "translate(-50%, 0)" },
  left: { transform: "translate(-100%, -50%)" },
  right: { transform: "translate(0, -50%)" },
};

function sampleBezier([P0, P1, P2]: number[][], n = 20) {
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; xs.push(u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0]); ys.push(u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]); }
  return { xs, ys };
}

export function AureliusControlPlaneIllustration() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25, rootMargin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();
  const animate = inView ? "shown" : "hidden";
  const on = inView; // animation gate

  const packet = sampleBezier([meta.packet.from, meta.packet.mid, meta.packet.to]);
  const start = meta.packet.from as [number, number];
  const [bx, by] = meta.barrier as [number, number];
  const bridgeD = meta.paths.bridge as string;
  const advD = meta.paths.advisory as string;
  const blkD = meta.paths.blocked as string;

  return (
    <figure className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative overflow-x-auto">
        <div ref={ref} className="relative aspect-[1440/900] w-full min-w-[700px] [container-type:inline-size]">
          {/* ---- stacked authored layers ---- */}
          {LAYERS.map((l) =>
            reduced ? (
              <img key={l.id} src={`${SRC}/${l.id}.svg`} alt="" aria-hidden draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none" style={{ opacity: l.rest }} />
            ) : (
              <motion.img key={l.id} src={`${SRC}/${l.id}.svg`} alt="" aria-hidden draggable={false} loading="eager" className="pointer-events-none absolute inset-0 h-full w-full select-none will-change-[transform,opacity]" custom={l} variants={layerVariants} initial="hidden" animate={animate} />
            ),
          )}

          {/* ---- flow paths ---- */}
          {reduced ? (
            <>
              {["metadata_bridge", "advisory_return_path", "blocked_payload"].map((id) => (
                <img key={id} src={`${SRC}/${id}.svg`} alt="" aria-hidden draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none" style={{ opacity: id === "blocked_payload" ? 0.5 : 1 }} />
              ))}
            </>
          ) : (
            <svg viewBox={`0 0 ${VW} ${VH}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <filter id="acp-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" /></filter>
              </defs>

              {/* metadata bridge: glow + draw-in line + dashed */}
              <motion.path d={bridgeD} fill="none" stroke="#41557a" strokeWidth={14} strokeLinecap="round" filter="url(#acp-soft)" initial={{ opacity: 0 }} animate={on ? { opacity: 0.28 } : { opacity: 0 }} transition={{ duration: 0.6, delay: 1.12 }} />
              <motion.path d={bridgeD} fill="none" stroke="#56688f" strokeWidth={3.4} strokeLinecap="round" initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 0.7, delay: 1.12, ease: EASE }} />
              <motion.path d={bridgeD} fill="none" stroke="#cdd9f1" strokeWidth={1.3} strokeDasharray="1.5 7" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }} transition={{ duration: 0.7, delay: 1.2, ease: EASE }} />
              {[meta.packet.from, meta.packet.to].map((e, i) => (
                <motion.circle key={i} cx={e[0]} cy={e[1]} r={4.4} fill="#41557a" stroke="#9fb1d0" strokeWidth={1.3} initial={{ opacity: 0 }} animate={on ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4, delay: i === 0 ? 1.12 : 1.7 }} />
              ))}

              {/* constraint engine: brief activation ring */}
              <motion.circle cx={C.constraint[0]} cy={C.constraint[1]} r={20} fill="none" stroke="#7488ad" strokeWidth={2}
                initial={{ opacity: 0, scale: 0.4 }} animate={on ? { opacity: [0, 0.7, 0], scale: [0.4, 1.2, 1.5] } : { opacity: 0 }}
                transition={{ duration: 1.0, delay: 1.55, ease: "easeOut" }} style={{ transformOrigin: "center", transformBox: "fill-box" } as React.CSSProperties} />

              {/* metadata packet travels the bridge */}
              <motion.g initial={{ x: start[0], y: start[1], opacity: 0 }} animate={on ? { x: packet.xs, y: packet.ys, opacity: [0, 1, 1, 1, 0] } : { x: start[0], y: start[1], opacity: 0 }} transition={{ duration: 1.4, delay: 1.5, ease: "easeInOut", opacity: { duration: 1.4, delay: 1.5, times: [0, 0.12, 0.5, 0.85, 1] } }}>
                <circle r={9} fill="#7f93b6" opacity={0.26} />
                <path d="M0,-5.5 L7,0 L0,5.5 L-7,0 Z" fill="#4a608c" stroke="#9fb1d0" strokeWidth={0.8} />
                <circle r={2.2} fill="#e6eefb" />
              </motion.g>

              {/* blocked payload: draws then flashes red once, stops at barrier */}
              <motion.path d={blkD} fill="none" stroke="rgba(170,72,69,0.85)" strokeWidth={2.4} strokeDasharray="7 5" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={on ? { pathLength: 1, opacity: [0, 1, 1, 0.5] } : { pathLength: 0, opacity: 0 }} transition={{ duration: 0.9, delay: 1.95, times: [0, 0.5, 0.75, 1], ease: "easeOut" }} />
              <motion.g initial={{ opacity: 0 }} animate={on ? { opacity: [0, 1, 1, 0.6] } : { opacity: 0 }} transition={{ duration: 0.9, delay: 2.1, times: [0, 0.4, 0.7, 1] }}>
                <polygon points={`${bx - 6},${by - 26} ${bx + 13},${by - 15} ${bx + 13},${by + 15} ${bx - 6},${by + 6}`} fill="rgba(170,72,69,0.16)" stroke="rgba(170,72,69,0.85)" strokeWidth={1.5} />
                <circle cx={bx} cy={by} r={12.5} fill="rgba(10,11,14,0.92)" stroke="#b5524f" strokeWidth={1.8} />
                <path d={`M${bx - 5.2},${by - 5.2} L${bx + 5.2},${by + 5.2} M${bx + 5.2},${by - 5.2} L${bx - 5.2},${by + 5.2}`} stroke="#b5524f" strokeWidth={2} strokeLinecap="round" />
              </motion.g>

              {/* advisory recommendation returns to scheduler */}
              <motion.path d={advD} fill="none" stroke="#56688f" strokeWidth={1.8} strokeDasharray="2 5" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={on ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }} transition={{ duration: 0.7, delay: 2.5, ease: EASE }} />
            </svg>
          )}

          {/* ---- HTML technical tags (type scales with canvas via cqw) ---- */}
          <div className="pointer-events-none absolute inset-0">
            {TAGS.map((t) => (
              <motion.div key={t.text} className={`absolute ${t.mobileHide ? "hidden md:block" : ""}`} style={{ left: px(t.at[0]), top: py(t.at[1]), ...placeStyle[t.place] }}
                initial={reduced ? false : { opacity: 0 }} animate={reduced ? { opacity: 1 } : on ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.5, delay: t.primary ? 1.2 : 1.0, ease: EASE }}>
                <div className={`whitespace-nowrap rounded-[3px] border bg-[hsl(0_0%_4%/0.76)] font-mono uppercase leading-none backdrop-blur-[1px] ${toneClass[t.tone ?? "default"]} ${t.primary ? "shadow-[0_0_0_1px_hsl(216_28%_52%/0.2)]" : ""}`} style={{ fontSize: "clamp(6px, 0.95cqw, 11px)", padding: "0.5em 0.66em", letterSpacing: "0.16em" }}>
                  {t.text}
                </div>
                {t.sub && (
                  <div className={`mt-1 hidden whitespace-nowrap font-mono tracking-[0.08em] text-white/34 lg:block ${t.place === "left" ? "text-right" : t.place === "right" ? "text-left" : "text-center"}`} style={{ fontSize: "clamp(6px, 0.78cqw, 9.5px)" }}>
                    {t.sub}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* ---- right-side explanation panel ---- */}
          <motion.aside className="absolute right-[4.5%] top-[6%] hidden w-[24%] max-w-[300px] lg:block"
            initial={reduced ? false : { opacity: 0, y: 8 }} animate={reduced ? { opacity: 1, y: 0 } : on ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }} transition={{ duration: 0.7, delay: 0.4, ease: EASE }}>
            <h3 className="text-[clamp(1.05rem,1.5vw,1.4rem)] font-medium tracking-tight text-foreground">The Control Plane</h3>
            <p className="mt-3 text-[12.5px] leading-relaxed text-white/55">
              Aurelius runs beside your scheduler as a sidecar. Only metadata crosses the boundary —
              never payloads, prompts, model outputs, training data, or source code. It forecasts,
              ranks, and filters candidates, returns an advisory decision, and appends every
              counterfactual to a tamper-evident ledger.
            </p>
            <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(217_30%_72%)]">
              <span className="h-px w-4 bg-[hsl(216_28%_52%/0.6)]" aria-hidden />
              Metadata-only · advisory
            </div>
          </motion.aside>
        </div>
      </div>

      {/* ---- caption strip ---- */}
      <figcaption className="flex items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/30">
        <span className="flex items-center gap-2.5">
          <span className="h-px w-4 bg-[hsl(216_28%_52%/0.5)]" aria-hidden />
          aurelius control plane · authored isometric schematic
        </span>
        <span className="hidden tabular-nums text-white/18 sm:inline">metadata_only</span>
      </figcaption>
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[10px] tabular-nums tracking-[0.16em] text-white/22">fig.00</span>
    </figure>
  );
}
