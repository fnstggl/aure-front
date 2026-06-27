import { Layout } from "@/components/layout/Layout";
import { Reveal, Arrow } from "@/components/site/primitives";
import { PageFrame, Band, Grid, Rails, Kicker, Action } from "@/components/site/structure";
import { ArchitecturePipeline } from "@/components/diagrams/ArchitecturePipeline";

/* Aurelius — landing page.
   A systems-paper title page on a visible structural grid, not a marketing
   stack. Five bands: hero, architecture, validation, evaluation, CTA. One
   architecture diagram, one benchmark figure, one secondary destination
   (the technical report), one action. Subtraction over addition. */

const VALIDATION = [
  "Azure public production traces",
  "Historical replay",
  "Shadow mode before deployment",
  "Read-only evaluation",
  "Deterministic fallback",
];

const EVAL_STEPS = [
  "Upload telemetry",
  "Offline replay",
  "Savings estimate",
  "Shadow deployment",
  "Production rollout",
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
                  <h1 className="text-[clamp(1.1rem,1.6vw,1.35rem)] font-medium leading-[1.3] tracking-[-0.01em] text-foreground">
                    The optimal scheduling decision depends on constraints that haven&rsquo;t emerged yet.
                  </h1>
                </Reveal>
                <Reveal delay={120}>
                  <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Action to="/technical-report" variant="primary" withArrow>
                      Read Technical Report
                    </Action>
                    <Action to="/contact" variant="secondary">
                      See how much your fleet could have saved
                    </Action>
                  </div>
                </Reveal>
                <Reveal delay={200}>
                  <p className="mt-6 text-[13px] leading-relaxed text-white/80">
                    Working with a small batch of infrastructure operators.
                  </p>
                </Reveal>
                <Reveal delay={260}>
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

        {/* ========================== Validation ========================== */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-7 lg:px-10">
              <Reveal>
                <StatMoment />
              </Reveal>
            </div>
            <div className="col-span-1 mt-12 px-6 sm:px-8 md:col-span-4 md:col-start-9 md:mt-0 lg:px-10">
              <Reveal>
                <Kicker index="01">Validation</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 text-balance text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                  Measured against your own scheduler.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <ul className="mt-8 grid gap-y-3">
                  {VALIDATION.map((item) => (
                    <li key={item} className="flex items-center gap-3 font-mono text-[12.5px] text-white/62">
                      <span className="inline-block h-px w-4 shrink-0 bg-white/45" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-8 max-w-sm text-[12.5px] leading-relaxed text-white/38">
                  A backtest on public production traces — evidence, not a guaranteed universal
                  result.
                </p>
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ========================= Architecture ========================= */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-4 lg:px-10">
              <Reveal>
                <Kicker index="02">Architecture</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 text-balance text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                  Decided in advance, not in hindsight.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-white/52">
                  Aurelius forecasts the constraints each scheduling decision will face — power,
                  capacity, congestion, demand — and simulates its economic outcome before the
                  decision is made, choosing the optimal one. The policy is then proven in offline
                  replay and read-only shadow mode before any rollout.
                </p>
              </Reveal>
            </div>
            <div className="col-span-1 mt-12 px-6 sm:px-8 md:col-span-7 md:col-start-6 md:mt-0 md:px-0 md:pr-8 lg:pr-10">
              <Reveal delay={120}>
                <ArchitecturePipeline />
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
                  From upload to rollout. Read-only until you decide otherwise.
                </h2>
              </Reveal>
              <Reveal delay={120}>
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
                  See how much you would&rsquo;ve saved.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/55">
                  Start with a read-only shadow-mode evaluation against your scheduler metadata. No
                  payload access. No execution impact.
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
        Measured on public Azure traces · SLA-safe · −21% GPU-hours
      </p>
    </div>
  );
}
