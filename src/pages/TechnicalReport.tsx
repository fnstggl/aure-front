import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/site/primitives";
import { PageFrame, Band, Grid, Kicker, Action } from "@/components/site/structure";
import { ArchitecturePipeline } from "@/components/diagrams/ArchitecturePipeline";
import { BenchmarkFigure } from "@/components/diagrams/BenchmarkFigure";

/* /technical-report — the single secondary destination from the landing page.
   Structured as a systems paper. Sections are mapped here; validated material
   is written conservatively and figures are embedded. Sections not yet backed
   by published results are marked forthcoming rather than fabricated. The web
   page is the canonical destination — there is no PDF. */

const SECTIONS = [
  { n: "01", id: "executive-summary", title: "Executive Summary" },
  { n: "02", id: "problem-statement", title: "Problem Statement" },
  { n: "03", id: "architecture", title: "Aurelius Architecture" },
  { n: "04", id: "methodology", title: "Optimization Methodology" },
  { n: "05", id: "experimental-setup", title: "Experimental Setup" },
  { n: "06", id: "results", title: "Benchmark Results" },
  { n: "07", id: "validation", title: "Validation" },
  { n: "08", id: "ablations", title: "Ablation Studies" },
  { n: "09", id: "limitations", title: "Limitations" },
  { n: "10", id: "future-work", title: "Future Work" },
];

const P = "max-w-[64ch] text-[14.5px] leading-[1.7] text-white/62";
const FORTHCOMING =
  "max-w-[64ch] text-[13.5px] leading-[1.7] text-white/40";

export default function TechnicalReport() {
  return (
    <Layout>
      <PageFrame>
        {/* ============================== Masthead ============================== */}
        <Band className="border-t border-border">
          <Grid>
            <div className="col-span-1 px-6 pb-14 pt-32 sm:px-8 md:col-span-10 md:pt-36 lg:px-10">
              <Reveal>
                <Kicker index="—">Technical Report</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="mt-7 max-w-3xl text-balance text-[clamp(2rem,4.6vw,3.2rem)] font-medium leading-[1.04] tracking-[-0.03em] text-foreground">
                  Constraint-aware orchestration for AI infrastructure
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/55">
                  How Aurelius increases SLA-safe goodput per dollar — and how those results are
                  measured against an operator&rsquo;s own scheduler on public production traces.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/34">
                  <span>Aurelius</span>
                  <span className="text-white/14">·</span>
                  <span>Draft</span>
                  <span className="text-white/14">·</span>
                  <span>Backtested on public traces</span>
                  <span className="text-white/14">·</span>
                  <span>Web — no PDF</span>
                </div>
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ============================== Body ============================== */}
        <Band divide={false} rails={false}>
          <Grid>
            {/* Sticky contents */}
            <aside className="col-span-1 hidden border-r border-border px-6 py-14 md:col-span-3 md:block lg:px-10">
              <div className="sticky top-24">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/32">
                  Contents
                </div>
                <nav className="mt-5">
                  <ol className="space-y-2.5">
                    {SECTIONS.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="group flex items-baseline gap-3 text-[12.5px] tracking-tight text-white/50 transition-colors hover:text-white/90"
                        >
                          <span className="font-mono text-[10.5px] tabular-nums text-white/28 group-hover:text-gold/70">
                            {s.n}
                          </span>
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </aside>

            {/* Sections */}
            <div className="col-span-1 px-6 py-14 sm:px-8 md:col-span-9 md:px-12 md:py-16 lg:px-16">
              <Sec n="01" id="executive-summary" title="Executive Summary">
                <p className={P}>
                  Aurelius is a constraint-aware orchestration layer for GPU fleets. It sits beside an
                  existing scheduler, reads job metadata, and forecasts power, capacity, congestion,
                  and demand constraints before execution to produce safer, lower-cost workload
                  decisions — scheduling, placement, admission, routing, capacity, and energy.
                </p>
                <p className={`${P} mt-4`}>
                  On public production traces, replayed historically and compared against the
                  operator&rsquo;s own scheduler, Aurelius improves SLA-safe goodput per dollar by
                  +26% and reduces GPU-hours by −21%. Every decision is evaluated against hard
                  constraints, runs read-only in shadow mode before any rollout, and falls back
                  deterministically. These figures are backtest evidence, not a guaranteed universal
                  result.
                </p>
              </Sec>

              <Sec n="02" id="problem-statement" title="Problem Statement">
                <p className={P}>
                  Modern schedulers optimize for availability, fairness, and utilization — not
                  economic outcome. Once a job is placed, its energy cost, regional constraints, and
                  timing trade-offs are largely locked in. Utilization is not the same as economic
                  efficiency, schedulers do not see future grid or demand conditions, and teams lack
                  audit-grade counterfactuals to justify changing production behavior.
                </p>
              </Sec>

              <Sec n="03" id="architecture" title="Aurelius Architecture">
                <p className={P}>
                  Aurelius is an advisory layer. It reads only the metadata a scheduler already
                  exposes — job timing, resource requests, constraints — never payloads or model
                  outputs. Candidates that violate SLA, residency, capacity, power, or policy
                  boundaries are rejected at the constraint gate before execution, and the rejection
                  is recorded. The evaluation pipeline runs end to end: telemetry, offline replay,
                  shadow mode, savings report, controlled rollout.
                </p>
                <div className="mt-9 max-w-[560px]">
                  <ArchitecturePipeline />
                </div>
              </Sec>

              <Sec n="04" id="methodology" title="Optimization Methodology">
                <p className={P}>
                  For each workload, Aurelius generates candidate decisions — run now, delay, or
                  relocate — scores each on expected cost under forecasted conditions, and filters any
                  candidate that violates a hard constraint. The selected candidate is returned with
                  its reasons, not a black-box verdict.
                </p>
                <p className={`${FORTHCOMING} mt-4`}>
                  Forthcoming: formal objective, forecasting models and uncertainty bounds, and the
                  constraint formulation will be detailed here as they are published.
                </p>
              </Sec>

              <Sec n="05" id="experimental-setup" title="Experimental Setup">
                <p className={P}>
                  Evaluation uses public production traces replayed against a deterministic harness.
                  Aurelius&rsquo; decisions are compared, step for step, against the behavior of the
                  operator&rsquo;s own scheduler on the same trace, under an SLA-safe goodput metric.
                </p>
                <p className={`${FORTHCOMING} mt-4`}>
                  Forthcoming: exact trace families, workload classes, hardware assumptions, and the
                  precise metric definitions used to produce the figures below.
                </p>
              </Sec>

              <Sec n="06" id="results" title="Benchmark Results">
                <p className={P}>
                  Against the operator&rsquo;s scheduler on public production traces, Aurelius delivers
                  +26% SLA-safe goodput per dollar and −21% GPU-hours. Both deltas are relative to the
                  baseline scheduler on the same replayed trace.
                </p>
                <div className="mt-9 max-w-[620px]">
                  <BenchmarkFigure />
                </div>
                <p className={`${FORTHCOMING} mt-6`}>
                  These are backtest results on public traces and should be read as evidence of
                  achievable savings, not a guarantee for any specific fleet.
                </p>
              </Sec>

              <Sec n="07" id="validation" title="Validation">
                <p className={P}>Aurelius is validated under conservative, read-only conditions:</p>
                <ul className="mt-6 grid max-w-[60ch] gap-y-3">
                  {[
                    "Azure public production traces",
                    "Historical replay",
                    "Shadow mode before deployment",
                    "Read-only evaluation",
                    "Deterministic fallback",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-mono text-[12.5px] text-white/62">
                      <span className="inline-block h-px w-4 shrink-0 bg-gold/55" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Sec>

              <Sec n="08" id="ablations" title="Ablation Studies">
                <p className={FORTHCOMING}>
                  Forthcoming: per-component contribution — scheduling, placement, admission, routing,
                  capacity, and energy decisions evaluated under controlled removal — to attribute the
                  measured savings. No ablation numbers are reported until they are published.
                </p>
              </Sec>

              <Sec n="09" id="limitations" title="Limitations">
                <p className={P}>
                  Reported figures are backtests on public production traces and do not guarantee
                  identical savings on any specific fleet. Results depend on the fidelity of the
                  metadata an operator exposes and on the constraint set in force. Aurelius is advisory
                  and read-only until an operator chooses a controlled rollout; it never inspects
                  payloads or model outputs.
                </p>
              </Sec>

              <Sec n="10" id="future-work" title="Future Work">
                <p className={FORTHCOMING}>
                  Forthcoming: additional public trace families, multi-region rollouts under live
                  constraints, energy and carbon accounting, and expanded uncertainty reporting.
                </p>
              </Sec>

              {/* quiet closing action */}
              <div className="mt-16 border-t border-border pt-10">
                <p className="max-w-[60ch] text-[14px] leading-relaxed text-white/50">
                  Want this run against your own telemetry? Start with a read-only shadow-mode
                  evaluation — no payload access, no execution impact.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Action to="/contact" variant="primary" withArrow>
                    See how much your fleet could have saved
                  </Action>
                  <Link
                    to="/"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/80"
                  >
                    ← Back to home
                  </Link>
                </div>
              </div>
            </div>
          </Grid>
        </Band>
      </PageFrame>
    </Layout>
  );
}

function Sec({
  n,
  id,
  title,
  children,
}: {
  n: string;
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-12 first:border-t-0 first:pt-0 md:py-14">
      <div className="mb-7 flex items-baseline gap-4">
        <span className="font-mono text-[12px] tabular-nums text-gold/70">{n}</span>
        <h2 className="text-[clamp(1.3rem,2.6vw,1.8rem)] font-medium tracking-[-0.02em] text-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
