import { Layout } from "@/components/layout/Layout";
import { Reveal, Arrow } from "@/components/site/primitives";
import { PageFrame, Band, Grid, Rails, Kicker, Action } from "@/components/site/structure";
import { WorldModelArchitecture } from "@/components/diagrams/WorldModelArchitecture";

/* Aurelius — landing page.
   A systems-paper title page on a visible structural grid, not a marketing
   stack. The page teaches one idea: the optimal scheduling decision depends on
   constraints that haven't emerged yet — so Aurelius forecasts the future
   cluster state, simulates candidate decisions, and commits the economic
   optimum before execution. Architecture is the reason; savings are the
   consequence. Four bands: architecture, evidence, evaluation, CTA. */

const EVAL_STEPS = [
  "Upload telemetry",
  "Offline replay",
  "Savings estimate",
  "Shadow deployment",
  "Controlled rollout",
];

export default function Index() {
  return (
    <Layout>
      <PageFrame>
        {/* ============================== Hero ============================== */}
        <section className="relative overflow-hidden border-t border-border">
          {/* preserved dotted horn field */}
          <div className="hero-field z-0" aria-hidden />
          <div className="hero-field-shimmer z-0" aria-hidden />
          <div className="hero-field-vignette z-0" aria-hidden />
          {/* the structural rails cross the horn, as in a plate */}
          <Rails className="z-10" />

          <div className="relative z-20 flex min-h-[100dvh] flex-col">
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto w-full max-w-[72rem] px-6 pb-16 pt-32 text-center sm:px-8 -translate-y-[13px]">
                <Reveal>
                  <h1 className="mx-auto max-w-[22ch] text-[clamp(1.35rem,2.5vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.015em] text-foreground sm:max-w-none sm:whitespace-nowrap">
                    The optimal scheduling decision depends on constraints that haven&rsquo;t emerged yet.
                  </h1>
                </Reveal>
                <Reveal delay={120}>
                  <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Action to="/contact" variant="primary" withArrow>
                      See how much your fleet could have saved
                    </Action>
                    <Action to="/technical-report" variant="secondary">
                      Read Technical Report
                    </Action>
                  </div>
                </Reveal>
                <Reveal delay={180}>
                  <p className="mt-6 text-[13px] leading-relaxed text-white/80">
                    Working with a small batch of infrastructure operators.
                  </p>
                </Reveal>
                <Reveal delay={240}>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 font-mono text-[10.5px] tracking-[0.12em] text-white/32">
                    <span><span className="text-white/50">+26%</span> SLA-safe goodput / $</span>
                    <span className="text-white/18">·</span>
                    <span><span className="text-white/50">−21%</span> GPU-hours</span>
                    <span className="text-white/18">·</span>
                    <span><span className="text-white/50">−25%</span> energy cost</span>
                    <span className="text-white/18">·</span>
                    <span className="uppercase tracking-[0.16em]">Measured on public Azure traces</span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ========================= Architecture ========================= */}
        {/* The thesis, made visible. Lead with the world-model control loop —
            this is the reason to read the Technical Report. */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-4 lg:px-10">
              <Reveal>
                <Kicker index="01">Architecture</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 text-balance text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                  Forecast. Simulate. Decide.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-white/52">
                  Aurelius builds a predictive world model of the cluster state, forecasts future
                  constraints, and simulates candidate workload decisions before they are made.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-white/52">
                  Scheduling is the final step. The economic optimum is chosen ahead of time, subject
                  to the constraints each decision will actually face.
                </p>
              </Reveal>
            </div>
            <div className="col-span-1 mt-12 px-6 sm:px-8 md:col-span-7 md:col-start-6 md:mt-0 md:px-0 md:pr-8 lg:pr-10">
              <Reveal delay={120}>
                <WorldModelArchitecture />
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ============================ Evidence =========================== */}
        {/* The consequence. Kept concise and secondary to the architecture. */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-7 lg:px-10">
              <Reveal>
                <StatMoment />
              </Reveal>
            </div>
            <div className="col-span-1 mt-12 px-6 sm:px-8 md:col-span-4 md:col-start-9 md:mt-0 lg:px-10">
              <Reveal>
                <Kicker index="02">Evidence</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 text-balance text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                  Backtested on public production traces.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-white/52">
                  Validated through offline replay and read-only shadow mode before any rollout —
                  measured against the operator&rsquo;s own scheduler.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <ul className="mt-7 grid gap-y-3">
                  {["Offline replay", "Read-only shadow mode", "Public Azure production traces"].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-mono text-[12.5px] text-white/62">
                      <span className="inline-block h-px w-4 shrink-0 bg-white/45" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-7 max-w-sm text-[12.5px] leading-relaxed text-white/38">
                  Evidence, not a guaranteed universal result.
                </p>
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ========================== Evaluation ========================== */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-12 lg:px-10">
              <Reveal>
                <Kicker index="03">Evaluation</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 max-w-2xl text-balance text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                  Read-only until you decide otherwise.
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-white/52">
                  Start with scheduler metadata. Aurelius replays historical decisions, simulates
                  counterfactual outcomes, and produces an audited savings report before any
                  production rollout.
                </p>
              </Reveal>
              <Reveal delay={140}>
                <div className="mt-10 flex flex-col gap-y-4 md:flex-row md:flex-wrap md:items-center md:gap-x-4">
                  {EVAL_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-mono text-[11px] tabular-nums text-white/55">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/72">
                          {step}
                        </span>
                        {i === 0 && (
                          <span className="ml-1 border border-border-strong px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                            Week 1
                          </span>
                        )}
                      </div>
                      {i < EVAL_STEPS.length - 1 && (
                        <Arrow className="hidden shrink-0 text-white/22 md:block" />
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ============================== CTA ============================== */}
        <Band divide={false} className="py-24 md:py-32 lg:py-40">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-10 lg:px-10">
              <Reveal>
                <Kicker index="04">Request access</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-7 max-w-3xl text-balance text-[clamp(2rem,5.4vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em] text-foreground">
                  See what your scheduler missed.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/55">
                  Run a read-only evaluation against historical scheduler metadata. No payload
                  access. No execution impact.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-9">
                  <Action to="/contact" variant="primary" withArrow>
                    See how much your fleet could have saved
                  </Action>
                </div>
              </Reveal>
            </div>
          </Grid>
        </Band>
      </PageFrame>
    </Layout>
  );
}

/* Headline result — the savings as a single large number, immediately legible.
   Restrained: one number, one line, one measured-provenance caption. */
function StatMoment() {
  return (
    <div className="text-center md:text-left">
      <div className="text-[clamp(3.6rem,8.5vw,6.8rem)] font-medium leading-[0.9] tracking-[-0.04em] text-foreground">
        +26%
      </div>
      <p className="mt-4 text-[clamp(1.05rem,2.4vw,1.6rem)] font-medium tracking-tight text-white/80">
        higher SLA-safe goodput per dollar
      </p>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/42">
        Measured on public Azure traces · SLA-safe · −21% GPU-hours · −25% energy cost
      </p>
    </div>
  );
}
