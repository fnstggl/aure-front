import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import meta from "./aurelius-control-plane/meta.json";

/* ============================================================================
   Aurelius Control Plane — flagship layered isometric illustration.

   This component is a production wrapper for *authored* layered art. Each layer
   is an opaque asset under /public/diagrams/aurelius-control-plane/ (authored in
   Figma as named layers and exported as SVG). Replace any file with a higher-
   fidelity Figma/Spline render of the same layer at the same 1440x900 canvas and
   nothing here changes — the wrapper only stacks, positions, and animates layers.

   Motion: a one-time reveal that explains the architecture (base → environment →
   pipeline → sidecar → metadata bridge → packet travels → constraint highlight →
   payload blocked once → audit ledger logs → approved path settles in steel).
   Inactive systems dim but never vanish. Honors prefers-reduced-motion by
   rendering the final resolved state statically. Only opacity/transform animate,
   so there is no layout shift and no width/height/top/left animation.
   ========================================================================== */

const SRC = "/diagrams/aurelius-control-plane";
const [VW, VH] = meta.viewBox as [number, number];
const px = (x: number) => `${(x / VW) * 100}%`;
const py = (y: number) => `${(y / VH) * 100}%`;
const EASE = [0.16, 1, 0.3, 1] as const;

/* Visual object layers, in stacking order (first = back). `rest` is the opacity
   each layer settles to after the reveal; inactive systems settle dimmer. */
type Layer = { id: string; rest: number; delay: number; fromY?: number };
const LAYERS: Layer[] = [
  { id: "base_plane", rest: 1, delay: 0 },
  { id: "background_grid", rest: 0.85, delay: 0.12 },
  { id: "customer_environment", rest: 0.8, delay: 0.28 },
  { id: "execution_layer", rest: 0.58, delay: 0.74 }, // unchanged → settles dim
  { id: "workload_queue", rest: 0.7, delay: 0.46 },
  { id: "scheduler", rest: 1, delay: 0.58 },
  { id: "active_paths", rest: 0.72, delay: 0.92 },
  { id: "aurelius_control_plane", rest: 1, delay: 0.86, fromY: 14 },
  { id: "constraint_engine", rest: 0.94, delay: 1.34 },
  { id: "audit_ledger", rest: 0.94, delay: 1.52 },
  { id: "metadata_bridge", rest: 1, delay: 1.12 },
];

const layerVariants = {
  hidden: (c: Layer) => ({ opacity: 0, y: c.fromY ?? 6 }),
  shown: (c: Layer) => ({
    opacity: c.rest,
    y: 0,
    transition: { duration: 0.75, delay: c.delay, ease: EASE },
  }),
};

/* HTML technical tags sitting on the objects (crisp + accessible, like the
   Applied-Compute reference). Positions are in the 1440x900 canvas space. */
type Tag = {
  text: string;
  sub?: string;
  at: [number, number];
  place: "above" | "below" | "left" | "right" | "center";
  tone?: "default" | "steel" | "red" | "dim";
  primary?: boolean;
  mobileHide?: boolean;
};
const TAGS: Tag[] = [
  { text: "EXISTING SCHEDULER", sub: "scheduler remains authority", at: [646, 296], place: "above" },
  { text: "EXECUTION LAYER", sub: "execution unchanged", at: [900, 282], place: "above" },
  { text: "WORKLOAD QUEUE", sub: "job metadata · timing", at: [232, 470], place: "left" },
  { text: "AURELIUS CONTROL PLANE", sub: "forecast · rank · filter · log", at: [560, 726], place: "below", primary: true },
  { text: "CONSTRAINT ENGINE", at: [862, 720], place: "below", mobileHide: true },
  { text: "APPEND-ONLY AUDIT LEDGER", at: [300, 648], place: "below", mobileHide: true },
  { text: "METADATA ONLY", at: [688, 360], place: "above", tone: "steel" },
  { text: "PAYLOAD BLOCKED", at: [meta.payloadTag.at[0] + 14, meta.payloadTag.at[1]], place: "right", tone: "red" },
  { text: "YOUR SECURE ENVIRONMENT", at: [150, 812], place: "right", tone: "dim", mobileHide: true },
];

const toneClass: Record<NonNullable<Tag["tone"]>, string> = {
  default: "text-white/82 border-white/12",
  steel: "text-steel border-steel/30",
  red: "text-[hsl(1_44%_60%)] border-[hsl(1_44%_46%/0.4)]",
  dim: "text-white/45 border-white/10",
};
const placeStyle: Record<Tag["place"], React.CSSProperties> = {
  above: { transform: "translate(-50%, -100%)" },
  below: { transform: "translate(-50%, 0)" },
  left: { transform: "translate(-100%, -50%)" },
  right: { transform: "translate(0, -50%)" },
  center: { transform: "translate(-50%, -50%)" },
};

/* sample a quadratic bezier (from→mid→to) into n+1 points for packet travel */
function sampleBezier([P0, P1, P2]: number[][], n = 18) {
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    xs.push(u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0]);
    ys.push(u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]);
  }
  return { xs, ys };
}

export function AureliusControlPlaneIllustration() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25, rootMargin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();
  const animate = inView ? "shown" : "hidden";

  const packet = sampleBezier([meta.packet.from, meta.packet.mid, meta.packet.to]);
  const packetStart = meta.packet.from as [number, number];

  return (
    <figure className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative overflow-x-auto">
      <div ref={ref} className="relative aspect-[1440/900] w-full min-w-[680px] [container-type:inline-size]">
        {/* ---- stacked authored layers ---- */}
        {LAYERS.map((l) =>
          reduced ? (
            <img
              key={l.id}
              src={`${SRC}/${l.id}.svg`}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none"
              style={{ opacity: l.rest }}
            />
          ) : (
            <motion.img
              key={l.id}
              src={`${SRC}/${l.id}.svg`}
              alt=""
              aria-hidden
              draggable={false}
              loading="eager"
              className="pointer-events-none absolute inset-0 h-full w-full select-none will-change-[transform,opacity]"
              custom={l}
              variants={layerVariants}
              initial="hidden"
              animate={animate}
            />
          ),
        )}

        {/* ---- blocked payload: flashes muted red once, then settles dim ---- */}
        {reduced ? (
          <img
            src={`${SRC}/blocked_payload.svg`}
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            style={{ opacity: 0.5 }}
          />
        ) : (
          <motion.img
            src={`${SRC}/blocked_payload.svg`}
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: [0, 0, 1, 1, 0.5] } : { opacity: 0 }}
            transition={{ duration: 1.1, delay: 1.7, times: [0, 0.35, 0.5, 0.74, 1], ease: "easeOut" }}
          />
        )}

        {/* ---- vector overlay: animated metadata packet (scales with canvas) ---- */}
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        >
          {!reduced && (
            <motion.g
              initial={{ x: packetStart[0], y: packetStart[1], opacity: 0 }}
              animate={
                inView
                  ? { x: packet.xs, y: packet.ys, opacity: [0, 1, 1, 1, 0] }
                  : { x: packetStart[0], y: packetStart[1], opacity: 0 }
              }
              transition={{
                duration: 1.5,
                delay: 1.45,
                ease: "easeInOut",
                opacity: { duration: 1.5, delay: 1.45, times: [0, 0.12, 0.5, 0.85, 1] },
              }}
            >
              <circle r="9" fill="#7f93b6" opacity="0.28" />
              <path d="M0,-5.5 L7,0 L0,5.5 L-7,0 Z" fill="#4d6088" stroke="#7f93b6" strokeWidth="0.8" />
              <circle r="2.2" fill="#cdd7e6" />
            </motion.g>
          )}
        </svg>

        {/* ---- HTML technical tags (type scales with the canvas via cqw) ---- */}
        <div className="pointer-events-none absolute inset-0">
          {TAGS.map((t) => (
            <motion.div
              key={t.text}
              className={`absolute ${t.mobileHide ? "hidden md:block" : ""}`}
              style={{ left: px(t.at[0]), top: py(t.at[1]), ...placeStyle[t.place] }}
              initial={reduced ? false : { opacity: 0 }}
              animate={reduced ? { opacity: 1 } : inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: t.primary ? 1.15 : 0.95, ease: EASE }}
            >
              <div
                className={`whitespace-nowrap rounded-[3px] border bg-[hsl(0_0%_4%/0.74)] font-mono uppercase leading-none backdrop-blur-[1px] ${toneClass[t.tone ?? "default"]} ${t.primary ? "shadow-[0_0_0_1px_hsl(216_23%_46%/0.18)]" : ""}`}
                style={{ fontSize: "clamp(6px, 0.95cqw, 11px)", padding: "0.5em 0.66em", letterSpacing: "0.16em" }}
              >
                {t.text}
              </div>
              {t.sub && (
                <div
                  className={`mt-1 hidden whitespace-nowrap font-mono tracking-[0.08em] text-white/34 lg:block ${
                    t.place === "left" ? "text-right" : t.place === "right" ? "text-left" : "text-center"
                  }`}
                  style={{ fontSize: "clamp(6px, 0.78cqw, 9.5px)" }}
                >
                  {t.sub}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* ---- right-side explanation panel (Applied-Compute style) ---- */}
        <motion.aside
          className="absolute right-[4.5%] top-[7%] hidden w-[24%] max-w-[300px] lg:block"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={reduced ? { opacity: 1, y: 0 } : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
        >
          <h3 className="text-[clamp(1.05rem,1.5vw,1.4rem)] font-medium tracking-tight text-foreground">
            The Control Plane
          </h3>
          <p className="mt-3 text-[12.5px] leading-relaxed text-white/55">
            Aurelius runs beside your scheduler as a sidecar. Only metadata crosses
            the boundary — never payloads, prompts, model outputs, training data, or
            source code. It forecasts, ranks, and filters candidates, returns an
            advisory decision, and appends every counterfactual to a tamper-evident
            ledger.
          </p>
          <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-steel">
            <span className="h-px w-4 bg-steel/50" aria-hidden />
            Metadata-only · advisory
          </div>
        </motion.aside>
      </div>
      </div>

      {/* ---- caption strip (house style) ---- */}
      <figcaption className="flex items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/30">
        <span className="flex items-center gap-2.5">
          <span className="h-px w-4 bg-steel/40" aria-hidden />
          aurelius control plane · authored isometric schematic
        </span>
        <span className="hidden tabular-nums text-white/18 sm:inline">metadata_only</span>
      </figcaption>
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[10px] tabular-nums tracking-[0.16em] text-white/22">
        fig.00
      </span>
    </figure>
  );
}
