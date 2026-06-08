import { Layout } from "@/components/layout/Layout";
import {
  Container,
  Section,
  SectionEyebrow,
  SectionHeader,
  CTAButton,
  MetricChip,
  DiagramCard,
  Reveal,
} from "@/components/site/primitives";
import { SchedulerInterceptionDiagram } from "@/components/diagrams/SchedulerInterceptionDiagram";
import { QueueShiftDiagram } from "@/components/diagrams/QueueShiftDiagram";
import { ControlLoopDiagram } from "@/components/diagrams/ControlLoopDiagram";
import { FleetTopologyDiagram } from "@/components/diagrams/FleetTopologyDiagram";
import { OptimizationDecisionDiagram } from "@/components/diagrams/OptimizationDecisionDiagram";
import { ConstraintEngineDiagram } from "@/components/diagrams/ConstraintEngineDiagram";
import { ShadowModeAuditDiagram } from "@/components/diagrams/ShadowModeAuditDiagram";
import { MetadataBoundaryDiagram } from "@/components/diagrams/MetadataBoundaryDiagram";

export default function Index() {
  return (
    <Layout>
      {/* ============================== Hero ============================== */}
      <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pb-20 pt-28 md:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-60" aria-hidden />
        <div className="pointer-events-none absolute inset-0 hero-vignette" aria-hidden />

        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <SectionEyebrow className="justify-center">Aurelius Control Layer</SectionEyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-6 text-balance text-[clamp(2rem,5.2vw,3.4rem)] font-medium leading-[1.05] tracking-tight text-foreground">
                The control layer for economically efficient GPU fleets
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/62 md:text-lg">
                Aurelius evaluates when workloads should run, where they should run, and when
                optimization is safe — before execution.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mx-auto mt-4 max-w-xl font-mono text-[12px] leading-relaxed text-white/42">
                Shadow-mode first. Constraint-aware by default. Built for schedulers, platform
                teams, and GPU fleet operators.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton to="/shadow-audit" variant="primary" withArrow>
                  See what you would have saved
                </CTAButton>
                <CTAButton to="/how-it-works" variant="secondary">
                  How it works
                </CTAButton>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <MetricChip value="+42%" label="goodput / $" emphasis />
                <MetricChip value="−21%" label="GPU-hours" emphasis />
                <MetricChip value="Public" label="Azure traces" />
                <MetricChip value="SLA-safe" label="benchmark" />
              </div>
              <p className="mt-3 font-mono text-[11px] text-white/28">
                Benchmark evidence on public traces — not a guaranteed universal result.
              </p>
            </Reveal>
          </div>

          {/* Hero diagram — Scheduler Interception Layer */}
          <Reveal delay={400} className="mt-14 md:mt-16">
            <DiagramCard label="Scheduler interception layer">
              <SchedulerInterceptionDiagram />
            </DiagramCard>
          </Reveal>
        </Container>
      </section>

      {/* ============================ Problem ============================ */}
      <Section>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeader
                  eyebrow="The problem"
                  title="Your scheduler is costing you money"
                  intro="Modern schedulers optimize for availability, fairness, and latency — not economic outcome. Once a job is placed, its energy cost, regional constraints, and timing tradeoffs are often locked in."
                />
              </Reveal>
              <Reveal delay={120}>
                <ul className="mt-8 divide-y divide-border border-y border-border">
                  {[
                    "Schedulers do not see future grid conditions.",
                    "Utilization does not equal economic efficiency.",
                    "Teams lack audit-grade counterfactuals before changing production behavior.",
                  ].map((point, i) => (
                    <li key={point} className="flex gap-4 py-4">
                      <span className="font-mono text-[12px] tabular-nums text-signal/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[14px] leading-relaxed text-white/62">{point}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={160}>
                <DiagramCard label="Queue · energy price window">
                  <QueueShiftDiagram />
                </DiagramCard>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ======================= System Overview ======================== */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="System overview"
              title="A deterministic control loop"
              intro="Observe, forecast, decide, filter, log. Aurelius reads scheduler metadata, predicts conditions with uncertainty bounds, ranks options, rejects unsafe candidates under hard constraints, and records every outcome — append-only."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <DiagramCard label="Forecast / control loop">
              <ControlLoopDiagram />
            </DiagramCard>
          </Reveal>
        </Container>
      </Section>

      {/* ======================== Fleet Topology ======================== */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Fleet topology"
              title="Built for real GPU fleet topology"
              intro="Aurelius reasons across regions, clusters, GPU pools, workload classes, timing windows, and operational constraints — without inspecting payloads or model outputs."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <DiagramCard label="Region · cluster · pool placement">
              <FleetTopologyDiagram />
            </DiagramCard>
          </Reveal>
        </Container>
      </Section>

      {/* ===================== Optimization Decision ==================== */}
      <Section alt>
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="order-2 lg:order-1 lg:col-span-7">
              <Reveal delay={120}>
                <DiagramCard label="Live optimization decision">
                  <OptimizationDecisionDiagram />
                </DiagramCard>
              </Reveal>
            </div>
            <div className="order-1 lg:order-2 lg:col-span-5">
              <Reveal>
                <SectionHeader
                  eyebrow="Decision logic"
                  title="Every optimization is ranked, filtered, and explainable"
                  intro="For each workload, Aurelius generates candidate decisions — run now, delay, or relocate — scores each on expected cost, and filters anything that violates a constraint. The selected candidate comes with its reasons, not a black-box verdict."
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ======================= Constraint Engine ====================== */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Safety"
              title="Optimization stops at the constraint boundary"
              intro="Aurelius only recommends actions that pass hard operational constraints. If a candidate violates SLA, residency, capacity, power, or policy boundaries, it is rejected before execution — and the rejection is recorded."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <DiagramCard label="Constraint gates">
              <ConstraintEngineDiagram />
            </DiagramCard>
          </Reveal>
        </Container>
      </Section>

      {/* ===================== Shadow Mode / Audit ====================== */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Shadow mode"
              title="Prove savings before changing execution"
              intro="Run Aurelius in shadow mode to compare actual scheduler behavior against counterfactual decisions. Aurelius records what it would have done, why, and whether the decision stayed safe — with no execution impact."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <ShadowModeAuditDiagram />
          </Reveal>
        </Container>
      </Section>

      {/* ====================== Security / Boundary ===================== */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Integration"
              title="Designed to integrate without seeing the work itself"
              intro="Aurelius reads job metadata only — no payloads, no model outputs, no customer code. It deploys as a sidecar control layer, runs read-only in shadow mode, and writes an append-only audit log."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <DiagramCard label="Metadata boundary">
              <MetadataBoundaryDiagram />
            </DiagramCard>
          </Reveal>
          <Reveal delay={200}>
            <ul className="mt-8 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
              {[
                "Reads job metadata only",
                "No payload or model-output access",
                "Runs read-only in shadow mode",
                "Append-only audit logs",
                "Deploys as sidecar / control layer",
                "Gradual rollout after validation",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 font-mono text-[12px] text-white/55">
                  <span className="inline-block h-1 w-1 shrink-0 bg-signal" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* ============================== CTA ============================= */}
      <Section alt>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <SectionEyebrow className="justify-center">Get started</SectionEyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-balance text-[clamp(1.6rem,3.4vw,2.5rem)] font-medium leading-tight tracking-tight text-foreground">
                See what Aurelius would have saved on your fleet
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/62">
                Start with shadow-mode analysis against scheduler metadata. No execution impact
                required.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton to="/contact" variant="primary" withArrow>
                  Run a shadow-mode analysis
                </CTAButton>
                <CTAButton to="/how-it-works" variant="secondary">
                  Read the technical overview
                </CTAButton>
              </div>
            </Reveal>

            <Reveal delay={260} className="mt-12">
              <div className="flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">
                <span>Workloads</span>
                <span className="h-px w-8 rail-x" aria-hidden />
                <span className="text-signal">Shadow mode</span>
                <span className="h-px w-8 rail-x" style={{ ["--rail-delay" as string]: "600ms" }} aria-hidden />
                <span>Counterfactual report</span>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
