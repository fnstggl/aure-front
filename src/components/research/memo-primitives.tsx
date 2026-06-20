import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/primitives";

/* ============================================================================
   Memo primitives — shared atoms for the private research page.
   These extend the site's existing design language (mono eyebrows, hairline
   borders, off-black surfaces) with the restrained "analyst memo" treatment:
   numbered sections (§NN) and a muted brass accent. Reused across every
   section so a company config never touches layout.
   ============================================================================ */

/** Numbered section eyebrow: "§02 · Why this may matter". Brass tick + index. */
export function MemoEyebrow({
  index,
  children,
  className,
}: {
  /** Two-digit section index, e.g. "02". Renders the §NN marker. */
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.24em] text-white/42",
        className,
      )}
    >
      {index && <span className="tabular-nums text-accent-gold">§{index}</span>}
      <span className="h-px w-7 accent-gold-rule" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/** Section header: numbered eyebrow + title + optional intro. */
export function MemoSectionHeader({
  index,
  eyebrow,
  title,
  intro,
  className,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <MemoEyebrow index={index} className="mb-6">
        {eyebrow}
      </MemoEyebrow>
      <h2 className="text-balance text-[clamp(1.55rem,3.2vw,2.3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-white/62 md:text-[15.5px]">
          {intro}
        </p>
      )}
    </div>
  );
}

/** Tiny field label used inside cards/tables ("Hypothesis", "What we'd test"). */
export function FieldLabel({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "gold" | "steel";
  className?: string;
}) {
  const toneClass =
    tone === "gold" ? "text-accent-gold/90" : tone === "steel" ? "text-steel/80" : "text-white/38";
  return (
    <div
      className={cn(
        "font-mono text-[10px] uppercase leading-none tracking-[0.18em]",
        toneClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A mono key/value ledger row — used in the colophon + basis lists. */
export function MetaRow({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border/70 py-2.5 last:border-b-0">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/36">{k}</span>
      <span className="text-right font-mono text-[12px] tabular-nums text-white/72">{v}</span>
    </div>
  );
}

/** A small reassurance / trust pill with a brass node. */
export function TrustChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.015] px-3 py-1.5 font-mono text-[11px] tracking-tight text-white/58">
      <span className="h-1 w-1 rounded-full bg-accent-gold/80" aria-hidden />
      {children}
    </span>
  );
}

/** Standard memo section shell: top border, generous rhythm, optional alt band. */
export function MemoSection({
  id,
  alt = false,
  grain = false,
  className,
  children,
}: {
  id?: string;
  alt?: boolean;
  grain?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative border-t border-border py-[58px] md:py-[80px] lg:py-[96px]",
        alt && "bg-background-alt",
        className,
      )}
    >
      {grain && (
        <div className="research-grain pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay" aria-hidden />
      )}
      <div className="relative">{children}</div>
    </section>
  );
}

/** Re-export Reveal so section files import everything memo-related from here. */
export { Reveal };
