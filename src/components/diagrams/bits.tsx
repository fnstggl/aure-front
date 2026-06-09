import { cn } from "@/lib/utils";

/* Shared building blocks for the Aurelius system diagrams.
   Semantics: BLUE = reasoning / evaluation (thinking). GOLD = the selected,
   approved, committed decision. RED = hard constraint failure. Everything
   else stays neutral so emphasis is reserved for what changed. */

type Tone = "think" | "gold";

/** A node in a control-flow diagram. */
export function Node({
  label,
  sub,
  active = false,
  tone = "think",
  className,
  children,
}: {
  label: string;
  sub?: string;
  active?: boolean;
  tone?: Tone;
  className?: string;
  children?: React.ReactNode;
}) {
  const strong = tone === "gold"; // primary control layer reads slightly stronger
  return (
    <div
      className={cn(
        "relative rounded-md border bg-card-elevated px-3.5 py-3 transition-all duration-500 ease-premium",
        active && strong && "border-signal/55 bg-signal/[0.07] shadow-[0_10px_34px_-24px_hsl(218_45%_66%/0.45)]",
        active && !strong && "border-signal/35 bg-signal/[0.04]",
        !active && "border-border",
        className,
      )}
    >
      <div
        className={cn(
          "font-mono text-[10.5px] uppercase tracking-[0.16em]",
          active ? "text-steel" : "text-white/68",
        )}
      >
        {label}
      </div>
      {sub && <div className="mt-1 text-[11px] leading-snug text-white/40">{sub}</div>}
      {children}
    </div>
  );
}

/** Horizontal connector rail. Blue by default; gold for the selected path. */
export function RailX({
  flowing = true,
  gold = false,
  delay = 0,
  className,
}: {
  flowing?: boolean;
  gold?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("h-px min-w-6 flex-1", flowing ? "rail-x" : "bg-border", gold && "rail-gold", className)}
      style={{ "--rail-delay": `${delay}ms` } as React.CSSProperties}
      aria-hidden
    />
  );
}

/** Vertical connector rail. Blue by default; gold for the selected path. */
export function RailY({
  flowing = true,
  gold = false,
  delay = 0,
  className,
}: {
  flowing?: boolean;
  gold?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("w-px", flowing ? "rail-y" : "bg-border", gold && "rail-gold", className)}
      style={{ "--rail-delay": `${delay}ms` } as React.CSSProperties}
      aria-hidden
    />
  );
}

type GateState = "pass" | "fail" | "idle" | "gold";

/** Status tag. pass = blue (evaluation), gold = selected/approved, fail = red. */
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
    pass: "border-signal/35 text-steel/85",
    gold: "border-signal/55 bg-signal/10 text-steel",
    fail: "border-destructive/50 text-destructive",
    idle: "border-border text-white/40",
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
  if (state === "pass" || state === "gold") {
    return (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
        <path d="M1.5 4.8L3.4 6.8 7.5 2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return <span className="inline-block h-1 w-1 rounded-full bg-current opacity-60" />;
}

/** A small key/value line rendered in mono — for metadata + log readouts. */
export function KV({ k, v, vClass }: { k: string; v: string; vClass?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
      <span className="text-white/40">{k}</span>
      <span className={cn("tabular-nums text-white/68", vClass)}>{v}</span>
    </div>
  );
}
