import { useEffect, useState } from "react";

/**
 * Tracks the user's reduced-motion preference so JS-driven loops (e.g. SMIL,
 * cycling state) can be skipped. CSS animations are additionally guarded by a
 * global @media (prefers-reduced-motion) rule in index.css.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener?.("change", handler);
    return () => query.removeEventListener?.("change", handler);
  }, []);

  return reduced;
}
