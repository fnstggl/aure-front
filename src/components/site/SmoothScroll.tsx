import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

/* Premium smooth-scroll inertia (the "high-class" scroll feel), driven by Lenis.
   Disabled entirely under prefers-reduced-motion — native scroll is used then.
   IntersectionObserver-based reveals and framer's useScroll keep working because
   Lenis dispatches native scroll events as it animates scrollTop. */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Smoothly scroll to in-page anchors (e.g. the Docs sidebar links)
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id && document.getElementById(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -96 });
      }
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset to top on route change (both Lenis and native fallback).
  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
