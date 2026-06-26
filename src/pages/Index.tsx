import { Layout } from "@/components/layout/Layout";
import { Reveal, Arrow } from "@/components/site/primitives";
import { PageFrame, Band, Grid, Rails, Kicker, Action } from "@/components/site/structure";
import { ArchitecturePipeline } from "@/components/diagrams/ArchitecturePipeline";
import { BenchmarkFigure } from "@/components/diagrams/BenchmarkFigure";

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
            <div className="flex flex-1 items-center">
              <Grid className="w-full">
                <div className="col-span-1 px-6 pb-12 pt-32 sm:px-8 md:col-span-10 md:pt-28 lg:px-10">
                  <Reveal>
                    <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/42">
                      <span className="inline-block h-1.5 w-1.5 bg-gold/70" aria-hidden />
                      Control plane for GPU fleets
                    </p>
                  </Reveal>
                  <Reveal delay={60}>
                    <h1 className="mt-6 text-[clamp(3.2rem,10vw,7rem)] font-medium leading-[0.92] tracking-[-0.04em] text-foreground">
                      Aurelius
                    </h1>
                  </Reveal>
                  <Reveal delay={120}>
                    <p className="mt-6 max-w-2xl text-balance text-[clamp(1.1rem,2.6vw,1.7rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white/82">
                      Constraint-aware orchestration for AI infrastructure.
                    </p>
                  </Reveal>
                  <Reveal delay={180}>
                    <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-white/52 md:text-[15px]">
                      Increase SLA-safe goodput per dollar by optimizing scheduling, placement,
                      admission, routing, capacity, and energy decisions.
                    </p>
                  </Reveal>
                  <Reveal delay={240}>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                      <Action to="/contact" variant="primary" withArrow>
                        See how much your fleet could have saved
                      </Action>
                      <Action to="/technical-report" variant="secondary">
                        Read Technical Report
                      </Action>
                    </div>
                  </Reveal>
                </div>
              </Grid>
            </div>

            {/* console metrics bar — aligned to the rails */}
            <Reveal delay={300} className="border-t border-border">
              <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
                <Metric value="+26%" label="SLA-safe goodput / $" gold />
                <Metric value="−21%" label="GPU-hours" />
                <Console title="Evidence" body="Backtested on public production traces" />
                <Console title="Posture" body="Shadow-mode first · constraint-gated" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ========================= Architecture ========================= */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-4 lg:px-10">
              <Reveal>
                <Kicker index="01">Architecture</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 text-balance text-[clamp(1.6rem,3.2vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
                  Proven before it acts.
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-white/52">
                  Aurelius sits beside your scheduler. Metadata in, offline replay, read-only shadow,
                  an audited savings report — then a gradual, reversible rollout under hard
                  constraints.
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

        {/* ========================== Validation ========================== */}
        <Band className="py-20 md:py-28 lg:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-7 md:px-0 md:pl-8 lg:pl-10">
              <Reveal>
                <BenchmarkFigure />
              </Reveal>
            </div>
            <div className="col-span-1 mt-12 px-6 sm:px-8 md:col-span-4 md:col-start-9 md:mt-0 lg:px-10">
              <Reveal>
                <Kicker index="02">Validation</Kicker>
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
                      <span className="inline-block h-px w-4 shrink-0 bg-gold/55" aria-hidden />
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
                        <span className="font-mono text-[11px] tabular-nums text-gold/70">
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

/* A single console metric — large mono value over a quiet label. */
function Metric({ value, label, gold = false }: { value: string; label: string; gold?: boolean }) {
  return (
    <div className="bg-background px-6 py-6 sm:px-8 lg:px-10">
      <div
        className={`font-mono text-[clamp(1.7rem,3.4vw,2.4rem)] leading-none tracking-tight tabular-nums ${
          gold ? "text-gold" : "text-foreground"
        }`}
      >
        {value}
      </div>
      <div className="mt-3 text-[12.5px] tracking-tight text-white/48">{label}</div>
    </div>
  );
}

/* A console field — uppercase title over a short value. */
function Console({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-background px-6 py-6 sm:px-8 lg:px-10">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/32">{title}</div>
      <div className="mt-3 text-[12.5px] leading-snug text-white/55">{body}</div>
    </div>
  );
}
