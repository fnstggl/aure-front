import { cn } from "@/lib/utils";

/* Shared building blocks for the Aurelius system diagrams.
   Grayscale by default; amber (signal) reserved for active / selected state. */

/** A node in a control-flow diagram. */
export function Node({
  label,
  sub,
  active = false,
  className,
  children,
}: {
  label: string;
  sub?: string;
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative rounded-md border bg-card-elevated px-3.5 py-3 transition-all duration-500 ease-premium",
        active
          ? "border-signal/60 bg-signal/[0.06] shadow-[0_12px_40px_-22px_hsl(38_92%_50%/0.55)]"
          : "border-border",
        className,
      )}
    >
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-md ring-1 ring-signal/30"
        />
      )}
      <div
        className={cn(
          "font-mono text-[10.5px] uppercase tracking-[0.16em]",
          active ? "text-signal" : "text-white/72",
        )}
      >
        {label}
      </div>
      {sub && <div className="mt-1 text-[11px] leading-snug text-white/42">{sub}</div>}
      {children}
    </div>
  );
}

/** Horizontal connector rail with an optional travelling amber flow. */
export function RailX({
  flowing = true,
  delay = 0,
  className,
}: {
  flowing?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("h-px min-w-6 flex-1", flowing ? "rail-x" : "bg-border", className)}
      style={{ "--rail-delay": `${delay}ms` } as React.CSSProperties}
      aria-hidden
    />
  );
}

/** Vertical connector rail with an optional travelling amber flow. */
export function RailY({
  flowing = true,
  delay = 0,
  className,
}: {
  flowing?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("w-px", flowing ? "rail-y" : "bg-border", className)}
      style={{ "--rail-delay": `${delay}ms` } as React.CSSProperties}
      aria-hidden
    />
  );
}

type GateState = "pass" | "fail" | "idle";

/** Pass / fail / idle status tag used by the constraint + decision diagrams. */
export function StatusTag({
  state,
  children,
  className,
}: {
  state: GateState;
  children: React.ReactNode;
  className?: string;
}) {
  const styles: Record<GateState, string> = {
    pass: "border-signal/40 text-signal",
    fail: "border-destructive/50 text-destructive",
    idle: "border-border text-white/42",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        styles[state],
        className,
      )}
    >
      <Glyph state={state} />
      {children}
    </span>
  );
}

function Glyph({ state }: { state: GateState }) {
  if (state === "fail") {
    return (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
        <path d="M2 2l5 5M7 2l-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }
  if (state === "pass") {
    return (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
        <path d="M1.5 4.8L3.4 6.8 7.5 2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return <span className="inline-block h-1 w-1 rounded-full bg-current opacity-60" />;
}

/** A small key/value line rendered in mono — for metadata + log readouts. */
export function KV({
  k,
  v,
  vClass,
}: {
  k: string;
  v: string;
  vClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
      <span className="text-white/42">{k}</span>
      <span className={cn("tabular-nums text-white/72", vClass)}>{v}</span>
    </div>
  );
}
