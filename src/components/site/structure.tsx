import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Arrow } from "./primitives";

/* ============================================================================
   Structural grid — the page is composed on a visible 12-column ruled frame,
   the way a systems paper or an infrastructure console is laid out, not a
   stack of marketing blocks. Hairline rails run the full height of the page;
   horizontal rules divide the bands; content is placed asymmetrically but
   always aligned to the rails. Sharp corners only. Negative space is content.
   ============================================================================ */

/* PageFrame — the outer ruled column. Left/right border closes the sides; the
   first band's top rule and the last band's bottom rule close the frame.
   Registration ticks at the four corners read as an authored canvas. */
export function PageFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-content border-x border-border", className)}>
      <CornerTick className="left-0 top-0 border-l border-t" />
      <CornerTick className="right-0 top-0 border-r border-t" />
      <CornerTick className="bottom-0 left-0 border-b border-l" />
      <CornerTick className="bottom-0 right-0 border-b border-r" />
      {children}
    </div>
  );
}

function CornerTick({ className }: { className?: string }) {
  return <span aria-hidden className={cn("absolute z-30 h-2.5 w-2.5 border-gold/40", className)} />;
}

/* Rails — three continuous interior hairlines at 25 / 50 / 75 %. Rendered per
   band at the same positions so they read as one set running the full page.
   Desktop only; mobile collapses to a single column. */
export function Rails({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 hidden md:block", className)}>
      <span className="absolute inset-y-0 left-1/4 w-px bg-border" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
      <span className="absolute inset-y-0 left-3/4 w-px bg-border" />
    </div>
  );
}

/* Band — a horizontal section of the composition. Divides from the next band
   with a hairline rule, carries the interior rails, and lifts its content above
   them. Content is laid on the same 12-col grid via <Grid>. */
export function Band({
  children,
  className,
  id,
  divide = true,
  rails = true,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  divide?: boolean;
  rails?: boolean;
}) {
  return (
    <section id={id} className={cn("relative", divide && "border-b border-border", className)}>
      {rails && <Rails className="z-10" />}
      <div className="relative z-20">{children}</div>
    </section>
  );
}

/* Grid — the 12-column row used inside a band. Single column on mobile. */
export function Grid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 md:grid-cols-12", className)}>{children}</div>;
}

/* Kicker — mono section label. Optional index reads as a paper figure number;
   the index is the one place a thread of antique gold marks hierarchy. */
export function Kicker({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-[10.5px] uppercase leading-none tracking-[0.24em] text-white/42",
        className,
      )}
    >
      {index && <span className="tabular-nums text-gold/75">{index}</span>}
      <span className="h-px w-6 bg-white/16" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/* Action — the single button style for the redesigned surfaces. Sharp corners,
   restrained. Primary = solid; secondary = hairline ghost with a gold hover. */
const actionBase =
  "group inline-flex h-11 items-center justify-center gap-2 px-6 text-[13.5px] font-medium tracking-tight transition-all duration-200 ease-premium active:translate-y-px focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50";

export function Action({
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
      : "border border-border-strong bg-transparent text-foreground hover:border-gold/45 hover:bg-white/[0.025]";

  const content = (
    <>
      {children}
      {withArrow && <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  );
  const classes = cn(actionBase, styles, className);

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
