/* Hero metadata layer — sparse scheduler tokens resolving quietly behind the
   claim. Product-native fragments (never random characters), placed only in the
   side margins so the centered headline stays fully clear. Brightness-only
   shimmer; no movement, no layout shift; disabled under reduced motion. */

type Token = {
  text: string;
  side: "l" | "r";
  /** vertical position as a % from top */
  top: number;
  /** horizontal inset from the chosen side, in rem */
  inset: number;
  delay: number;
  strong?: boolean;
};

const TOKENS: Token[] = [
  { text: "job_id=8f21a", side: "l", top: 16, inset: 3, delay: 0 },
  { text: "gpu=128", side: "l", top: 27, inset: 7, delay: 1.4, strong: true },
  { text: "deadline=4h", side: "l", top: 40, inset: 2, delay: 2.6 },
  { text: "region=us-west", side: "l", top: 58, inset: 6, delay: 0.8 },
  { text: "capacity=true", side: "l", top: 71, inset: 3, delay: 3.1 },
  { text: "metadata_only", side: "l", top: 84, inset: 8, delay: 1.9 },

  { text: "sla=pass", side: "r", top: 18, inset: 6, delay: 2.2, strong: true },
  { text: "shadow_mode=true", side: "r", top: 31, inset: 2, delay: 0.5 },
  { text: "payload=blocked", side: "r", top: 46, inset: 7, delay: 3.4 },
  { text: "savings=18.4", side: "r", top: 62, inset: 3, delay: 1.1, strong: true },
  { text: "append_only=true", side: "r", top: 76, inset: 6, delay: 2.7 },
  { text: "sla=pass", side: "r", top: 88, inset: 2, delay: 1.6 },
];

export function HeroMetadata() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
      {TOKENS.map((t, i) => (
        <span
          key={i}
          className="hero-token absolute font-mono text-[11px] tracking-[0.04em] tabular-nums"
          style={{
            top: `${t.top}%`,
            [t.side === "l" ? "left" : "right"]: `${t.inset}rem`,
            color: t.strong ? "hsl(var(--steel))" : "hsl(0 0% 100%)",
            ["--tok-base" as string]: t.strong ? "0.4" : "0.12",
            animationDelay: `${t.delay}s`,
          }}
        >
          {t.text}
        </span>
      ))}
    </div>
  );
}
