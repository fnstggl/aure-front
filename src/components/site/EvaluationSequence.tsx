/* How an evaluation actually runs. The first stages are offline or read-only;
   production is the optional terminal, never the default. Shared between the
   Safety page and the technical report so the staged, reversible path is
   described in exactly one place. */
const STAGES: { name: string; desc: string }[] = [
  {
    name: "Historical replay",
    desc: "Your own recorded traces are replayed offline. No live system is involved.",
  },
  {
    name: "Constraint validation",
    desc: "Candidates that violate your configured hard constraints, such as SLA, capacity, or placement limits, are filtered before they become a recommendation.",
  },
  {
    name: "Baseline comparison",
    desc: "Each remaining candidate is measured against your current scheduler, so a recommendation is grounded in your own recorded results rather than a generic claim.",
  },
  {
    name: "Shadow recommendation",
    desc: "Aurelius observes live metadata and emits recommendations only. It does not act on the live scheduler.",
  },
  {
    name: "Operator review",
    desc: "A person evaluates and approves before anything changes.",
  },
  {
    name: "Optional production integration",
    desc: "Enabled only if you choose to. It is never the default, and it remains under your control.",
  },
];

export function EvaluationSequence() {
  return (
    <ol className="max-w-xl">
      {STAGES.map((s, i) => {
        const last = i === STAGES.length - 1;
        return (
          <li key={s.name} className="relative flex gap-5 pb-9 last:pb-0">
            {!last && <span className="absolute left-[3.5px] top-3 h-full w-px bg-border" aria-hidden />}
            <span
              className={
                "relative mt-[5px] h-2 w-2 shrink-0 rounded-full " +
                (last ? "border border-white/45 bg-background" : "bg-white/70")
              }
              aria-hidden
            />
            <div>
              <div className="text-[15px] font-medium tracking-tight text-foreground">{s.name}</div>
              <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-white/50">{s.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
