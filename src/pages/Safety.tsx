import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Reveal, Arrow } from "@/components/site/primitives";
import { PageFrame, Band, Grid, Kicker, Action } from "@/components/site/structure";

/* /safety — a restrained safety brief for technical pilot clients. Two kinds of
   safety, stated plainly: data safety (read-only, metadata-only, never used to
   train a model) and scheduler safety (constraint-gated recommendations,
   baseline comparison, human-approved rollout). Same systems-paper design
   language as the home page and technical report — ruled grid, mono kickers,
   hairline spec rows. Monochrome by intent: no decorative color. */

const DATA_SAFETY: Spec[] = [
  {
    term: "Read-only by default",
    body: "Evaluation runs on historical telemetry and exported logs. Aurelius does not require production write access to produce a savings analysis.",
  },
  {
    term: "Historical replay before control",
    body: "Decisions are first measured by replaying your own recorded scheduler history — not by acting on live workloads.",
  },
  {
    term: "Shadow recommendations",
    body: "In shadow mode Aurelius observes live metadata and emits recommendations only. It does not mutate the live scheduler during evaluation.",
  },
  {
    term: "Metadata, not payloads",
    body: "Aurelius reads scheduling metadata — timing, resources, capacity, constraints. It does not read prompts, model outputs, training data, or customer payloads.",
  },
  {
    term: "Not used to train a model",
    body: "Your telemetry is used to evaluate your scheduling decisions. It is not used to train a foundation model and is not shared across customers.",
  },
];

const SCHEDULER_SAFETY: Spec[] = [
  {
    term: "Constraint gates, not metrics",
    body: "SLA, latency, capacity, placement, and policy limits are explicit gates evaluated before a candidate can be recommended — not numbers reported after the fact.",
  },
  {
    term: "Unsafe candidates are rejected",
    body: "A candidate that violates any gate is discarded before it reaches a recommendation. Economic optimization cannot override an explicit safety constraint.",
  },
  {
    term: "Compared against your baseline",
    body: "Every recommendation is measured against your current production scheduler before it is surfaced, so you see the counterfactual rather than a claim.",
  },
  {
    term: "Degrades safely under uncertainty",
    body: "When forecasts are low-confidence, Aurelius falls back to the conservative decision instead of acting on a weak prediction.",
  },
  {
    term: "Human-approved rollout",
    body: "Moving from recommendation to live execution is an explicit, operator-approved step. Nothing rolls out on its own.",
  },
];

const ADOPTION = [
  { n: "01", label: "Historical backtest", note: "your recorded traces" },
  { n: "02", label: "Shadow run", note: "live metadata · read-only" },
  { n: "03", label: "Bounded recommendation", note: "human-approved" },
  { n: "04", label: "Controlled execution", note: "optional · opt-in" },
];

const WILL_NOT = [
  "Take write access to production schedulers for an initial evaluation.",
  "Mutate live workloads during historical backtests or shadow runs.",
  "Improve economics by violating an explicit SLA, latency, capacity, or placement constraint.",
  "Use your telemetry to train a general-purpose model.",
];

export default function Safety() {
  return (
    <Layout>
      <PageFrame>
        {/* ============================== Masthead ============================== */}
        <Band className="border-t border-border">
          <Grid>
            <div className="col-span-1 px-6 pb-14 pt-32 sm:px-8 md:col-span-11 md:pt-36 lg:px-10">
              <Reveal>
                <Kicker index="—">Safety</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="mt-7 max-w-3xl text-balance text-[clamp(2rem,4.6vw,3.2rem)] font-medium leading-[1.04] tracking-[-0.03em] text-foreground">
                  Read-only by default. Constraint-gated by design.
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/58">
                  Aurelius evaluates infrastructure decisions before it controls them. Historical
                  replay and shadow recommendations come first; live execution is opt-in and
                  human-approved.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-white/40">
                  Every recommendation is checked against explicit SLA, capacity, placement, and
                  policy constraints before it is surfaced — economic optimization cannot override
                  them. Aurelius reads scheduler metadata to evaluate decisions, never customer
                  payloads, and never to train a foundation model. Workload data stays inside your
                  environment.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/34">
                  <span>Read-only by default</span>
                  <span className="text-white/14" aria-hidden>·</span>
                  <span>Shadow-first</span>
                  <span className="text-white/14" aria-hidden>·</span>
                  <span>Human-approved rollout</span>
                  <span className="text-white/14" aria-hidden>·</span>
                  <span>Reversible</span>
                </div>
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ============================== Data safety ============================== */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-10 lg:px-10">
              <Reveal>
                <Kicker index="01">Data safety</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 max-w-2xl text-balance text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                  Your data is evaluated, not absorbed.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-white/52">
                  Aurelius keeps historical replay, shadow recommendation, and live execution
                  separate. The first two never touch your production control plane, and what they
                  read is scheduler metadata — not the work itself.
                </p>
              </Reveal>
              <Reveal delay={160} className="mt-10">
                <SpecList items={DATA_SAFETY} />
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ============================ Scheduler safety ============================ */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-10 lg:px-10">
              <Reveal>
                <Kicker index="02">Scheduler safety</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 max-w-2xl text-balance text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                  Economics never override constraints.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-white/52">
                  A recommendation only exists if it passes the operator&rsquo;s hard constraints and
                  beats the current baseline. Safety means a cheaper decision that breaks latency,
                  SLA, placement, or capacity is not a valid decision.
                </p>
              </Reveal>
              <Reveal delay={160} className="mt-10">
                <SpecList items={SCHEDULER_SAFETY} />
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ============================== Adoption path ============================== */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-11 lg:px-10">
              <Reveal>
                <Kicker index="03">Adoption path</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 max-w-2xl text-balance text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                  Historical replay before control.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-white/52">
                  Each stage is gated by the one before it. You can stop at any stage, and live
                  execution is never the default.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <div className="mt-10 flex flex-col gap-y-4 md:flex-row md:flex-wrap md:items-center md:gap-x-4">
                  {ADOPTION.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-4">
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <span className="font-mono text-[11px] tabular-nums text-white/55">{s.n}</span>
                        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/72">
                          {s.label}
                        </span>
                        <span className="ml-1 border border-border-strong px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                          {s.note}
                        </span>
                      </div>
                      {i < ADOPTION.length - 1 && (
                        <Arrow className="hidden shrink-0 text-white/22 md:block" />
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ============================== Boundaries ============================== */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-10 lg:px-10">
              <Reveal>
                <Kicker index="04">Boundaries</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 max-w-2xl text-balance text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                  What Aurelius will not do by default.
                </h2>
              </Reveal>
              <Reveal delay={120} className="mt-9">
                <ul>
                  {WILL_NOT.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-4 border-t border-border py-4 first:border-t-0"
                    >
                      <span className="mt-2 h-px w-4 shrink-0 bg-white/40" aria-hidden />
                      <span className="max-w-2xl text-[14.5px] leading-relaxed text-white/70">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ============================== CTA ============================== */}
        <Band divide={false} className="py-24 md:py-32 lg:py-40">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-10 lg:px-10">
              <Reveal>
                <Kicker index="05">Request access</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-7 max-w-3xl text-balance text-[clamp(2rem,5.4vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em] text-foreground">
                  Start with a read-only evaluation.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/55">
                  Run Aurelius against your recorded scheduler metadata. Historical replay first,
                  shadow mode next, control only if and when you decide. Metadata only. No payload
                  access. No production changes.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Action to="/contact" variant="primary" withArrow>
                    Request a shadow-mode evaluation
                  </Action>
                  <Action to="/technical-report" variant="secondary">
                    Read Technical Report
                  </Action>
                </div>
              </Reveal>
              <div className="mt-12">
                <Link
                  to="/"
                  className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/80"
                >
                  ← Back to home
                </Link>
              </div>
            </div>
          </Grid>
        </Band>
      </PageFrame>
    </Layout>
  );
}

/* ------------------------------------------------------------------ */
/* Local presentation helpers                                          */
/* ------------------------------------------------------------------ */

type Spec = { term: string; body: string };

/* Spec-sheet rows: mono-weight term on the left rail, plain-English clause on
   the right. Hairline-divided, the way a systems paper lists properties. */
function SpecList({ items }: { items: Spec[] }) {
  return (
    <div>
      {items.map((it) => (
        <div
          key={it.term}
          className="grid grid-cols-1 gap-1.5 border-t border-border py-5 first:border-t-0 md:grid-cols-12 md:gap-6"
        >
          <div className="md:col-span-4">
            <span className="text-[14px] font-medium tracking-tight text-foreground">{it.term}</span>
          </div>
          <p className="text-[13.5px] leading-relaxed text-white/52 md:col-span-8">{it.body}</p>
        </div>
      ))}
    </div>
  );
}
