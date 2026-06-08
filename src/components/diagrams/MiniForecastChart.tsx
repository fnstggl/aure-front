import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* A restrained cost-forecast sparkline: confidence band, a forecast line that
   draws itself in, and an amber marker on the lower-cost window. */

const EASE = [0.16, 1, 0.3, 1] as const;

// Forecast curve (cost index) across the horizon — dips into a cheaper window.
const LINE = "M6,30 C40,22 58,18 86,40 C112,60 130,74 158,70 C184,66 210,44 254,52";
const BAND =
  "M6,22 C40,14 58,10 86,30 C112,50 130,64 158,60 C184,56 210,34 254,40 L254,64 C210,56 184,78 158,82 C130,86 112,72 86,52 C58,30 40,26 6,42 Z";

// Approx position of the lower-cost window on the curve.
const MARK_X = 158;
const MARK_Y = 70;

export function MiniForecastChart({
  active = true,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const draw = reduced ? 1 : active ? 1 : 0;

  return (
    <svg
      viewBox="0 0 260 96"
      className={className}
      role="img"
      aria-label="Cost forecast with a lower-cost window highlighted"
    >
      {/* baseline grid */}
      {[24, 48, 72].map((y) => (
        <line key={y} x1="6" x2="254" y1={y} y2={y} stroke="hsl(0 0% 100% / 0.05)" strokeWidth="1" />
      ))}

      {/* confidence band */}
      <motion.path
        d={BAND}
        fill="hsl(38 92% 50% / 0.07)"
        stroke="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0.25 }}
        transition={{ duration: 0.8, ease: EASE }}
      />

      {/* forecast line — draws in */}
      <motion.path
        d={LINE}
        fill="none"
        stroke="hsl(0 0% 100% / 0.45)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: draw }}
        transition={{ duration: 1.4, ease: EASE }}
      />

      {/* lower-cost window marker */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0.3 }}
        transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
      >
        <line x1={MARK_X} x2={MARK_X} y1="8" y2="88" stroke="hsl(38 92% 50% / 0.4)" strokeWidth="1" strokeDasharray="2 3" />
        <circle cx={MARK_X} cy={MARK_Y} r="6" fill="hsl(38 92% 50% / 0.18)" className={active && !reduced ? "anim-breathe" : ""} />
        <circle cx={MARK_X} cy={MARK_Y} r="2.5" fill="hsl(38 92% 50%)" />
        <text x={MARK_X + 8} y="20" className="font-mono" fontSize="9" fill="hsl(38 92% 50%)">
          +38m
        </text>
      </motion.g>
    </svg>
  );
}
