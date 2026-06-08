import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Drives an orchestrated, low-frequency step machine for the system diagrams
 * (one advance every few seconds — not a per-frame loop). Pauses when off
 * screen and collapses to a meaningful resting frame under reduced motion.
 */
export function useSequence(
  length: number,
  {
    interval = 2600,
    enabled = true,
    resting = 0,
  }: { interval?: number; enabled?: boolean; resting?: number } = {},
): number {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(resting);

  useEffect(() => {
    if (reduced || !enabled || length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, interval);
    return () => window.clearInterval(id);
  }, [reduced, enabled, length, interval]);

  return reduced ? resting : index;
}
