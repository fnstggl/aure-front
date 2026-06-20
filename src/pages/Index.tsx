import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout/Layout";
import {
  Container,
  Section,
  SectionEyebrow,
  SectionHeader,
  CTAButton,
  Reveal,
  ShadowFlow,
} from "@/components/site/primitives";
import { ScrollWordReveal } from "@/components/site/ScrollWordReveal";
import { ProblemSection } from "@/components/site/ProblemSection";
import { AureliusSchematicDiagram } from "@/components/diagrams/AureliusSchematicDiagram";
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
      <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pb-24 pt-28 md:pt-32">
        {/* Quiet mathematical structure behind the claim — static PNG + subtle shimmer */}
        <div className="hero-field" aria-hidden />
        <div className="hero-field-shimmer" aria-hidden />
        <div className="hero-field-vignette" aria-hidden />
        <div className="hero-glow" aria-hidden />

        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal delay={80}>
              <h1 className="text-balance text-[clamp(2.4rem,6vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.035em] text-foreground">
                Supercharge your scheduler.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mx-auto mt-7 max-w-xl text-balance text-[clamp(1.05rem,2.4vw,1.4rem)] leading-snug tracking-[-0.01em]">
                <span className="text-white/45">Your scheduler places workloads. </span>
                <span className="text-white/85">Aurelius helps it make more profitable decisions.</span>
              </p>
            </Reveal>
            <Reveal delay={320}>
              <p className="mx-auto mt-6 max-w-md font-mono text-[11.5px] leading-relaxed tracking-tight text-white/38">
                Metadata-only. Constraint-gated. Shadow-mode first. Your scheduler stays in control.
              </p>
            </Reveal>

            <Reveal delay={440}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton to="/contact" variant="primary" withArrow>
                  See how much you could save
                </CTAButton>
                <CTAButton to="/how-it-works" variant="secondary">
                  View technical overview
                </CTAButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============ The economic gap — overspending + positive proof ========= */}
      <ProblemSection />

      {/* ===================== How it fits (sits beside) ================== */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="How it fits"
              title="Aurelius sits beside your scheduler, not in place of it."
              intro="Aurelius reads scheduler metadata, forecasts cost and constraint conditions, ranks candidate decisions, and recommends the option with the best economics that still clears every hard gate. Your scheduler remains the system of record for execution."
            />
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 md:text-[16px]">
              Your scheduler decides where workloads run.{" "}
              <span className="text-foreground">Aurelius decides which decisions make the most economic sense.</span>
            </p>
          </Reveal>
          <Reveal delay={160} className="mt-12">
            <AureliusSchematicDiagram />
          </Reveal>
        </Container>
      </Section>

      {/* ============================ Problem ============================ */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="The problem"
              title="What your scheduler can't see"
              intro="Modern schedulers optimize availability, fairness, and latency — not economic outcome. Once a job is placed, its energy cost, regional constraints, and timing tradeoffs are often locked in before anyone weighs the economics."
            />
          </Reveal>
          <Reveal delay={120}>
            <ul className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
              {[
                "Schedulers see placement. They rarely see future economic conditions.",
                "Utilization is not the same as economic efficiency.",
                "Without counterfactuals, teams cannot prove which scheduling decisions would have created more value.",
              ].map((point, i) => (
                <li key={point} className="bg-background p-5">
                  <span className="font-mono text-[12px] tabular-nums text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/62">{point}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={160} className="mt-12">
            <QueueShiftDiagram />
          </Reveal>
        </Container>
      </Section>

      {/* ==================== Stat moment (typography) ================= */}
      <Section className="py-[84px] md:py-[124px] lg:py-[148px]">
        <Container>
          <Reveal className="mx-auto max-w-4xl text-center">
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
              revealIntro
              intro="Observe, forecast, decide, filter, log. Aurelius reads scheduler metadata, predicts conditions with uncertainty bounds, ranks options, rejects unsafe candidates under hard constraints, and records every outcome — append-only."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <ControlLoopDiagram />
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
            <FleetTopologyDiagram />
          </Reveal>
        </Container>
      </Section>

      {/* ===================== Optimization Decision ==================== */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Decision logic"
              title="Every recommendation is ranked, filtered, and explainable"
              intro="For each workload, Aurelius evaluates candidate decisions — run now, delay, relocate, or leave unchanged — then scores each against expected economics and hard constraints. Unsafe savings are rejected. The selected recommendation includes the reason, the tradeoff, and the audit trail."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <OptimizationDecisionDiagram />
          </Reveal>
        </Container>
      </Section>

      {/* ======================= Constraint Engine ====================== */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Safety"
              title="Optimization stops at the constraint boundary"
              intro="Aurelius only recommends actions that pass hard operational constraints. SLA, residency, capacity, policy, and confidence gates are enforced before any recommendation is accepted. In shadow mode, these decisions are logged without changing execution."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <ConstraintEngineDiagram />
          </Reveal>
        </Container>
      </Section>

      {/* ============== Manifesto — Apple-style scroll word reveal ============= */}
      <Section className="py-[84px] md:py-[120px] lg:py-[144px]">
        <Container>
          <ScrollWordReveal
            as="h2"
            text={"No payload access.\nNo execution risk.\nNo blind decisions."}
            className="max-w-4xl text-[clamp(1.9rem,5vw,3.5rem)] font-medium leading-[1.12] tracking-[-0.025em] text-foreground"
          />
          <ScrollWordReveal
            as="p"
            text={
              "Aurelius reads only the metadata a scheduler already exposes, proves every decision against hard constraints, and records the counterfactual before anything runs."
            }
            className="mt-11 max-w-2xl text-[clamp(1rem,2.1vw,1.4rem)] font-medium leading-[1.5] tracking-[-0.01em] text-foreground"
          />
        </Container>
      </Section>

      {/* ===================== Shadow Mode / Audit ====================== */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Shadow mode"
              title="Prove the economics before changing execution"
              intro="Run Aurelius in shadow mode against real scheduler metadata. Aurelius compares what happened against what it would have recommended, showing where lower-cost, SLA-safe decisions were available — without touching production behavior."
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
              title="Designed to improve scheduler decisions without seeing the work itself"
              revealIntro
              intro="Aurelius reads job and scheduler metadata only — no prompts, payloads, model outputs, training data, or customer code. It can start read-only, produce an append-only counterfactual audit, and graduate to advisory or gated execution only after validation."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <MetadataBoundaryDiagram />
          </Reveal>
          <Reveal delay={200}>
            <ul className="mt-8 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
              {[
                "Reads job and scheduler metadata only",
                "No payload or model-output access",
                "Runs read-only in shadow mode",
                "Append-only audit logs",
                "Sits beside your scheduler as a sidecar / control layer",
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
              No scheduler migration. No payload access. No production behavior change until the
              economics and constraints are proven against your real scheduler metadata.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-y-10 md:grid-cols-3 md:gap-0">
            {[
              { n: "01", t: "Connect scheduler metadata", d: "Aurelius reads scheduler metadata only — job timing, resources, constraints. No payloads, no model outputs, no customer code." },
              { n: "02", t: "Run shadow-mode economics", d: "Counterfactual decisions are recorded read-only, in parallel with your scheduler, with zero execution impact." },
              { n: "03", t: "Review validated decision lift", d: "Audit-grade counterfactual savings, rejected unsafe candidates, and proof that SLAs would have held." },
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
                See what better scheduler decisions would have saved
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/62">
                Start with a shadow-mode analysis against your existing scheduler metadata. Aurelius
                shows which decisions could have improved fleet economics — with no execution impact
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
              <ShadowFlow />
            </Reveal>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
