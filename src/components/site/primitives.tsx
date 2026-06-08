import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

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
  return (
    <div className={cn("mx-auto w-full max-w-content px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function Section({
  className,
  divider = true,
  alt = false,
  children,
  id,
}: {
  className?: string;
  /** thin top hairline between major sections */
  divider?: boolean;
  /** subtly lighter surface for alternating rhythm */
  alt?: boolean;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-[88px] md:py-[140px] lg:py-[168px]",
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
/* Reveal — staggered entrance, transform/opacity only                 */
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
        "flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/42",
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 bg-signal anim-breathe" aria-hidden />
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
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <SectionEyebrow className={cn("mb-5", align === "center" && "justify-center")}>
          {eyebrow}
        </SectionEyebrow>
      )}
      <h2 className="text-balance text-[clamp(1.6rem,3.2vw,2.4rem)] font-medium leading-[1.1] tracking-tight text-foreground">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 text-[15px] leading-relaxed text-white/62 md:text-base">
          {intro}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTA buttons — primary (light) / secondary (ghost) with tactile push */
/* ------------------------------------------------------------------ */

const baseCta =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md px-6 text-sm font-medium tracking-tight transition-all duration-200 ease-premium active:translate-y-px focus-visible:outline-none";

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
      : "border border-border-strong bg-transparent text-foreground hover:border-white/30 hover:bg-white/[0.04]";

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
/* Metric chip — mono, monochrome with optional amber emphasis         */
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
        "flex items-baseline gap-2 border border-border bg-card/40 px-3.5 py-2",
        className,
      )}
    >
      <span
        className={cn(
          "font-mono text-sm tabular-nums",
          emphasis ? "text-signal" : "text-foreground",
        )}
      >
        {value}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-wider text-white/42">
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram card — dark surface, hairline border, mono caption label    */
/* ------------------------------------------------------------------ */

export function DiagramCard({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-md border border-border bg-card",
        className,
      )}
    >
      <div className="bg-dotgrid">{children}</div>
      {label && (
        <figcaption className="flex items-center gap-2 border-t border-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/42">
          <span className="inline-block h-1 w-1 bg-signal" aria-hidden />
          {label}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Small inline arrow (no icon library / no emoji)                     */
/* ------------------------------------------------------------------ */

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={className}
    >
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
