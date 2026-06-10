import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ============================================================================
   ScrollWordReveal — Apple-style manifesto reveal.

   As the block scrolls through the viewport, words resolve from muted gray to
   bright white, one by one. Only opacity is animated (the base text is white,
   so low opacity over the off-black surface reads as gray) — no color tween, no
   layout shift, transform/opacity only. Reduced motion renders the final, fully
   legible state immediately.

   Usage:
     <ScrollWordReveal as="p" text={"No payload access.\nNo execution risk."} />
   Newlines become line breaks; words within a line reveal left-to-right, top to
   bottom across the whole block.
   ========================================================================== */

const DIM = 0.16; // resting opacity of an un-revealed word (reads as gray)

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [DIM, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}

type RevealTag = "p" | "h2" | "h3" | "div";

export function ScrollWordReveal({
  text,
  as = "p",
  className,
  /* The scroll band over which the reveal happens. Defaults tuned so the block
     is fully lit by the time it reaches the reading zone (upper-middle). */
  offset = ["start 0.85", "start 0.46"],
}: {
  text: string;
  as?: RevealTag;
  className?: string;
  offset?: [string, string];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as never,
  });

  const lines = text.split("\n");

  // Reduced motion: emit a plain, fully-legible block (no MotionValues at all).
  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className}>
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const total = lines.reduce((n, l) => n + l.trim().split(/\s+/).length, 0);
  const MotionTag = motion[as];
  let counter = 0;

  return (
    <MotionTag ref={ref} className={className}>
      {lines.map((line, li) => {
        const words = line.trim().split(/\s+/);
        return (
          <span key={li} className="block">
            {words.map((word, wi) => {
              const i = counter++;
              // Each word reveals over a short window; windows overlap slightly
              // and are spread across the first ~80% of scroll progress so the
              // sentence is fully lit before it leaves the reading zone.
              const start = (i / total) * 0.7;
              const end = Math.min(start + 1 / total + 0.1, 1);
              return (
                <span key={wi} className="inline-block">
                  <Word progress={scrollYProgress} range={[start, end]}>
                    {word}
                  </Word>
                  {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
                </span>
              );
            })}
          </span>
        );
      })}
    </MotionTag>
  );
}
