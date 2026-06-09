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
        "py-[88px] md:py-[128px] lg:py-[160px]",
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
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
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
      {intro && (
        <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-white/64 md:text-[16px]">
          {intro}
        </p>
      )}
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
      <span className={cn("font-mono text-[13px] tabular-nums", emphasis ? "text-signal" : "text-foreground/90")}>
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
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("relative overflow-hidden rounded-lg border border-border bg-card", className)}>
      <div>{children}</div>
      {label && (
        <figcaption className="flex items-center gap-2.5 border-t border-border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/32">
          <span className="h-px w-4 bg-white/20" aria-hidden />
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
