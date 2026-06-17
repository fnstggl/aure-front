import { Link } from "react-router-dom";
import { motion, useTime, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ScrollWordReveal } from "./ScrollWordReveal";

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mx-auto w-full max-w-content px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({
  className,
  divider = true,
  alt = false,
  children,
  id,
}: {
  className?: string;
  divider?: boolean;
  alt?: boolean;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-[60px] md:py-[84px] lg:py-[104px]",
        divider && "border-t border-border",
        alt && "bg-background-alt",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}

/* ------------------------------------------------------------------ */
/* Reveal — entrance, transform/opacity only (no layout shift)         */
/* ------------------------------------------------------------------ */

export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: React.ElementType;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView();
  return (
    <Tag
      ref={ref}
      className={cn("reveal", inView && "is-visible", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Eyebrow + section header                                            */
/* ------------------------------------------------------------------ */

export function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.24em] text-white/35",
        className,
      )}
    >
      <span className="h-px w-7 bg-white/15" aria-hidden />
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  className,
  align = "left",
  revealIntro = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  revealIntro?: boolean;
}) {
  const introClass = "mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-white/64 md:text-[16px]";
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <SectionEyebrow className={cn("mb-6", align === "center" && "justify-center")}>
          {eyebrow}
        </SectionEyebrow>
      )}
      <h2 className="text-balance text-[clamp(1.75rem,3.6vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      {intro &&
        (revealIntro && typeof intro === "string" ? (
          <ScrollWordReveal as="p" text={intro} className={introClass} />
        ) : (
          <p className={introClass}>{intro}</p>
        ))}
    </div>
  );
}

/* ShadowFlow — ONE dot travels the whole path: Workloads → Shadow mode →
   Counterfactual report. The two rail segments share a single clock so the dot
   is only ever on one segment at a time (never two dots); it disappears at the
   Shadow-mode stage and re-emerges on the far side. Transform/opacity only;
   reduced motion holds a single static dot at the start. */
const FLOW_T = 4200;

function FlowRail({ phase }: { phase: 0 | 1 }) {
  const reduced = usePrefersReducedMotion();
  const time = useTime();
  const cycle = useTransform(time, (t) => (t % FLOW_T) / FLOW_T);
  const [a, b] = phase === 0 ? [0.06, 0.42] : [0.54, 0.9];
  const x = useTransform(cycle, [a, b], [0, 38], { clamp: true });
  const opacity = useTransform(cycle, [a - 0.02, a + 0.02, b - 0.01, b + 0.04], [0, 1, 1, 0]);
  return (
    <span className="relative inline-block h-px w-11 bg-white/15" aria-hidden>
      <motion.span
        className="absolute left-0 top-1/2 h-1.5 w-1.5 rounded-full bg-white"
        style={reduced ? { x: 0, y: "-50%", opacity: phase === 0 ? 1 : 0 } : { x, y: "-50%", opacity }}
      />
    </span>
  );
}

export function ShadowFlow() {
  return (
    <div className="flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">
      <span>Workloads</span>
      <FlowRail phase={0} />
      <span className="text-white/55">Shadow mode</span>
      <FlowRail phase={1} />
      <span>Counterfactual report</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTA buttons                                                         */
/* ------------------------------------------------------------------ */

const baseCta =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md px-6 text-[14px] font-medium tracking-tight transition-all duration-200 ease-premium active:translate-y-px focus-visible:outline-none";

export function CTAButton({
  to,
  href,
  variant = "primary",
  withArrow = false,
  className,
  children,
  ...rest
}: {
  to?: string;
  href?: string;
  variant?: "primary" | "secondary";
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const styles =
    variant === "primary"
      ? "bg-foreground text-background hover:bg-white"
      : "border border-border-strong bg-transparent text-foreground hover:border-signal/40 hover:bg-white/[0.03]";

  const content = (
    <>
      {children}
      {withArrow && <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  );

  const classes = cn(baseCta, "group", styles, className);

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...rest}>
      {content}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Metric chip — mono value, sans label, restrained                   */
/* ------------------------------------------------------------------ */

export function MetricChip({
  value,
  label,
  emphasis = false,
  className,
}: {
  value: string;
  label: string;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline gap-2 rounded-md border border-white/[0.06] bg-white/[0.015] px-3.5 py-1.5",
        className,
      )}
    >
      <span className={cn("font-mono text-[13px] tabular-nums", emphasis ? "text-steel" : "text-foreground/90")}>
        {value}
      </span>
      <span className="text-[12px] tracking-tight text-white/42">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram card — dark surface, hairline border, refined caption       */
/* ------------------------------------------------------------------ */

export function DiagramCard({
  label,
  coord,
  grid = true,
  children,
  className,
}: {
  label?: string;
  coord?: string;
  grid?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("relative overflow-hidden rounded-lg border border-border bg-card", className)}>
      {grid && <DiagramGrid coord={coord} />}
      <div className="relative">{children}</div>
      {label && (
        <figcaption className="relative flex items-center justify-between gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/32">
          <span className="flex items-center gap-2.5">
            <span className="h-px w-4 bg-steel/40" aria-hidden />
            {label}
          </span>
          <span className="hidden tabular-nums text-white/20 sm:inline">metadata_only</span>
        </figcaption>
      )}
    </figure>
  );
}

/* A faint blueprint canvas behind every diagram: a coordinate grid that fades
   toward the edges plus registration ticks in two corners — so each diagram
   reads as an authored system schematic rather than floating UI boxes. */
function DiagramGrid({ coord }: { coord?: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="diagram-grid absolute inset-0" />
      <Tick className="left-3 top-3" />
      <Tick className="bottom-3 right-3 rotate-180" />
      {coord && (
        <span className="absolute right-3 top-3 font-mono text-[9px] tabular-nums tracking-[0.18em] text-white/14">
          {coord}
        </span>
      )}
    </div>
  );
}

function Tick({ className }: { className?: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" className={cn("absolute text-white/18", className)} aria-hidden>
      <path d="M0 0.5H4M0.5 0V4" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Small inline arrow (no icon library / no emoji)                     */
/* ------------------------------------------------------------------ */

export function Arrow({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path
        d="M3 7h8M7.5 3.5 11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
