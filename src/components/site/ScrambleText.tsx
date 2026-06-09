import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/_-.:+*";
const FRAMES = 14;
const FRAME_MS = 28; // ~390ms total — controlled computational decoding

/**
 * Nav-label scramble: on hover/focus the label briefly decodes through
 * matrix-style alphanumeric characters, resolving left-to-right, then settles
 * to the exact original text. Feels like controlled computational decoding.
 *
 * - The real text sits underneath (opacity-0) to reserve width and stay
 *   readable to assistive tech; the animating layer is aria-hidden and
 *   absolutely positioned, so layout width never shifts.
 * - Steps via a short interval only while hovering/focusing.
 * - Under reduced motion the scramble is disabled (plain color transition).
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);
  const timer = useRef<number | null>(null);

  const stop = () => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    setDisplay(text);
  };

  const run = () => {
    if (reduced) return;
    if (timer.current !== null) window.clearInterval(timer.current);
    const len = text.length;
    let frame = 0;
    timer.current = window.setInterval(() => {
      frame += 1;
      const resolved = Math.floor((frame / FRAMES) * len + 1e-6);
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (ch === " " || i < resolved) out += ch;
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      if (frame >= FRAMES) stop();
    }, FRAME_MS);
  };

  useEffect(() => {
    setDisplay(text);
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [text]);

  return (
    <span
      className={cn("relative inline-block whitespace-nowrap", className)}
      onMouseEnter={run}
      onMouseLeave={stop}
      onFocus={run}
      onBlur={stop}
    >
      <span className="opacity-0">{text}</span>
      <span aria-hidden className="absolute inset-0">
        {display}
      </span>
    </span>
  );
}
