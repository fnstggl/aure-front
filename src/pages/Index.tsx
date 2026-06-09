import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout/Layout";
import {
  Container,
  Section,
  SectionEyebrow,
  SectionHeader,
  CTAButton,
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
import { HeroMetadata } from "@/components/site/HeroMetadata";

export default function Index() {
  return (
    <Layout>
      {/* ============================== Hero ============================== */}
      <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pb-24 pt-28 md:pt-32">
        {/* Quiet mathematical structure behind the claim — static PNG + subtle shimmer */}
        <div className="hero-field" aria-hidden />
        <div className="hero-field-shimmer" aria-hidden />
        <HeroMetadata />
        <div className="hero-field-vignette" aria-hidden />

        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <SectionEyebrow className="justify-center">Aurelius Control Layer</SectionEyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-7 text-balance text-[clamp(2rem,5.2vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.025em]">
                <span className="text-white/52">Your scheduler optimizes utilization.</span>
                <br />
                <span className="text-foreground">Aurelius optimizes economics.</span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/68 md:text-[17px]">
                Forecast cost, power, carbon, and capacity constraints before execution. Generate
                safer workload decisions. Prove savings in shadow mode before deployment.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-white/42">
                Metadata-only. Constraint-gated. Built for GPU fleet operators.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton to="/contact" variant="primary" withArrow>
                  Run a shadow-mode assessment
                </CTAButton>
                <CTAButton to="/how-it-works" variant="secondary">
                  View technical overview
                </CTAButton>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-11 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[12px] tracking-tight text-white/45">
                <span><span className="text-foreground">+42%</span> goodput / $</span>
                <span className="text-white/15">·</span>
                <span><span className="text-foreground">−21%</span> GPU-hours</span>
                <span className="text-white/15">·</span>
                <span>public Azure traces</span>
                <span className="text-white/15">·</span>
                <span>SLA-safe benchmark</span>
              </div>
              <p className="mt-3.5 font-mono text-[11px] text-white/26">
                Benchmark evidence on public traces — not a guaranteed universal result.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ===================== Scheduler interception ================== */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="How it fits"
              title="An advisory layer between your scheduler and execution"
              intro="Aurelius reads scheduler metadata, forecasts conditions, and filters candidates before they run — then advises. Your scheduler stays in control and execution is unchanged."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <DiagramCard label="Scheduler interception layer" coord="fig.01">
              <SchedulerInterceptionDiagram />
            </DiagramCard>
          </Reveal>
        </Container>
      </Section>

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
                      <span className="font-mono text-[12px] tabular-nums text-white/25">
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
                <DiagramCard label="Queue · energy price window" coord="fig.02">
                  <QueueShiftDiagram />
                </DiagramCard>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ==================== Stat moment (typography) ================= */}
      <Section className="py-[120px] md:py-[180px] lg:py-[216px]">
        <Container>
          <Reveal className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 h-px w-10 bg-signal/70" aria-hidden />
            <div className="text-[clamp(4.5rem,15vw,11rem)] font-medium leading-[0.84] tracking-[-0.05em] text-foreground">
              42%
            </div>
            <p className="mt-5 text-[clamp(1.1rem,2.6vw,1.7rem)] font-medium tracking-tight text-white/72">
              higher goodput per dollar
            </p>
            <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.22em] text-white/32">
              Measured on public Azure traces · SLA-safe · −21% GPU-hours
            </p>
          </Reveal>
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
            <DiagramCard label="Forecast / control loop" coord="fig.03">
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
            <DiagramCard label="Region · cluster · pool placement" coord="fig.04">
              <FleetTopologyDiagram />
            </DiagramCard>
          </Reveal>
        </Container>
      </Section>

      {/* ===================== Optimization Decision ==================== */}
      <Section alt>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="order-2 lg:order-1 lg:col-span-7">
              <Reveal delay={120}>
                <DiagramCard label="Live optimization decision" coord="fig.05">
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
            <DiagramCard label="Constraint gates" coord="fig.06">
              <ConstraintEngineDiagram />
            </DiagramCard>
          </Reveal>
        </Container>
      </Section>

      {/* ==================== Statement (typography) =================== */}
      <Section className="py-[110px] md:py-[160px] lg:py-[200px]">
        <Container>
          <Reveal>
            <p className="max-w-4xl text-[clamp(1.9rem,5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.025em] text-foreground">
              No payload access.
              <br />
              No execution risk.
              <br />
              <span className="text-white/38">No blind decisions.</span>
            </p>
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
            <DiagramCard label="Metadata boundary" coord="fig.07">
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
                  <span className="inline-block h-1 w-1 shrink-0 bg-white/25" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* ===================== Adoption (light relief) ================== */}
      <section className="section-light border-t border-border">
        <Container className="py-[76px] md:py-[108px] lg:py-[124px]">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.24em] text-foreground/50">
              <span className="h-px w-7 bg-black/20" aria-hidden />
              Adoption
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 max-w-2xl text-balance text-[clamp(1.7rem,3.4vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.02em] text-foreground">
              From metadata to validated savings, in three steps
            </h2>
          </Reveal>
          <Reveal delay={130}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              No execution risk to start. Aurelius proves its economics against your real scheduler
              behavior before it ever changes a decision.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-y-10 md:grid-cols-3 md:gap-0">
            {[
              { n: "01", t: "Connect metadata", d: "Aurelius reads scheduler metadata only — job timing, resources, constraints. No payloads, no model outputs, no customer code." },
              { n: "02", t: "Run shadow mode", d: "Counterfactual decisions are recorded read-only, in parallel with your scheduler, with zero execution impact." },
              { n: "03", t: "Review the report", d: "Audit-grade counterfactual savings, rejected unsafe candidates, and proof that SLAs would have held." },
            ].map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 90}
                className={cn("md:px-7", i > 0 && "md:border-l md:border-black/10", i === 0 && "md:pl-0")}
              >
                <div className="font-mono text-[13px] tabular-nums text-foreground/30">{s.n}</div>
                <h3 className="mt-4 text-[17px] font-medium tracking-tight text-foreground">{s.t}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

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
                <span className="text-white/55">Shadow mode</span>
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
