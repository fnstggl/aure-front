import { Layout } from "@/components/layout/Layout";
import {
  Container,
  Section,
  SectionEyebrow,
  SectionHeader,
  DiagramCard,
  Reveal,
} from "@/components/site/primitives";
import { SchedulerInterceptionDiagram } from "@/components/diagrams/SchedulerInterceptionDiagram";
import { ControlLoopDiagram } from "@/components/diagrams/ControlLoopDiagram";
import { StatusTag } from "@/components/diagrams/bits";

export default function HowItWorks() {
  return (
    <Layout>
      {/* Page header */}
      <section className="relative overflow-hidden pb-12 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
        <Container className="relative">
          <Reveal>
            <SectionEyebrow>How it works</SectionEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-balance text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-tight text-foreground">
              An advisory control layer, not a scheduler replacement
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/62 md:text-base">
              Technical documentation for infrastructure engineers. Aurelius evaluates pending
              decisions before they reach execution — observing metadata, forecasting conditions,
              and filtering risk — without touching the execution path.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Execution model */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Execution model"
              title="Your scheduler stays in control"
              intro="Aurelius does not replace your scheduler, intercept payloads, or modify execution. It operates as an advisory layer: it observes job metadata, forecasts energy conditions, generates options, and filters risky decisions. Execution remains unchanged."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <SchedulerInterceptionDiagram />
          </Reveal>
        </Container>
      </Section>

      {/* Forecasting layer */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Forecasting layer"
              title="Short-horizon forecasts with explicit uncertainty"
              revealIntro
              intro="Aurelius predicts energy cost and carbon intensity using lag-based signals derived from historical patterns and real-time grid data. Every forecast carries uncertainty bounds — and when uncertainty exceeds threshold, a deterministic conservative fallback applies. No black-box models."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <ControlLoopDiagram fig="fig.02" />
          </Reveal>
        </Container>
      </Section>

      {/* Optimization vs safety */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Optimization vs safety"
              title="When the two conflict, safety wins"
            />
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
            <Reveal className="bg-card p-6">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                Optimization
              </div>
              <ul className="space-y-2.5">
                {[
                  "Finds lower-cost execution windows",
                  "Identifies lower-carbon periods",
                  "Ranks options by expected savings",
                  "Respects resource constraints",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[13.5px] text-white/62">
                    <span className="inline-block h-1 w-1 shrink-0 bg-white/30" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="bg-card p-6">
              <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
                Safety
              </div>
              <ul className="space-y-2.5">
                {[
                  "Quantile-based safety gates",
                  "Latency-safe constraints",
                  "Deterministic fallback",
                  "Conservative defaults",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[13.5px] text-white/62">
                    <span className="inline-block h-1 w-1 shrink-0 bg-signal" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={160} className="mt-6">
            <StatusTag state="pass">safety always wins</StatusTag>
          </Reveal>
        </Container>
      </Section>

      {/* Latency-safe mode */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Latency-safe mode"
              title="Workloads behave exactly as they would without Aurelius"
              intro="Latency-safe mode enforces a zero-slack requirement: jobs complete within their original bounds, start times are preserved, and there is no power throttling. If optimization cannot be achieved within these constraints, an invisible fallback applies. The only difference is lower cost and carbon — when safe."
            />
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-8 max-w-2xl border-l border-signal/40 pl-5 text-[14px] leading-relaxed text-white/55">
              Most savings come from time-shifting batch and training workloads away from peak
              pricing windows — not from throttling or resource reduction.
            </p>
          </Reveal>
        </Container>
      </Section>
    </Layout>
  );
}
