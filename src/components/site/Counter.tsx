import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Softly counts up to a target when enabled. Writes to a MotionValue so the
 * tween does not trigger React re-renders. Snaps to the final value under
 * reduced motion.
 */
export function Counter({
  to,
  enabled = true,
  duration = 1.4,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  enabled?: boolean;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (reduced || !enabled) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [to, enabled, reduced, duration, value]);

  return <motion.span className={className}>{text}</motion.span>;
}
