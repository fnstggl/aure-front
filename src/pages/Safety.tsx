import { Layout } from "@/components/layout/Layout";
import {
  Container,
  Section,
  SectionEyebrow,
  SectionHeader,
  DiagramCard,
  Reveal,
} from "@/components/site/primitives";
import { ConstraintEngineDiagram } from "@/components/diagrams/ConstraintEngineDiagram";
import { MetadataBoundaryDiagram } from "@/components/diagrams/MetadataBoundaryDiagram";

const cannotDoList = [
  "Cannot delay jobs beyond specified bounds",
  "Cannot reduce CPU or memory allocations",
  "Cannot access job data, payloads, or outputs",
  "Cannot modify scheduler state or configuration",
  "Cannot override operator decisions",
  "Cannot execute commands on your infrastructure",
];

const allowedMetadata = [
  "Job timing windows",
  "Requested resources",
  "Workload class",
  "Scheduler state",
  "Capacity availability",
  "Operator-defined constraints",
  "Regional placement options",
  "Historical run metadata",
];

const blockedData = [
  "Prompts",
  "Model outputs",
  "Training data",
  "Customer payloads",
  "Source code",
  "Secrets",
  "User data",
  "Proprietary datasets",
  "Application contents",
];

const trustCopy = [
  "Reads scheduler metadata only — never prompts, outputs, training data, payloads, or code.",
  "Metadata is not sold, shared, or used to train external models.",
  "Designed to deploy inside your environment, so workload data does not leave it.",
  "Shadow mode is read-only by default.",
  "Operators control thresholds, constraints, and rollout mode.",
];

function Check() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-0.5 shrink-0">
      <path d="M2 7.5L5.5 11 12 3.5" stroke="hsl(var(--steel))" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

function Cross() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-0.5 shrink-0">
      <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="hsl(var(--destructive))" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export default function Safety() {
  return (
    <Layout>
      {/* Page header */}
      <section className="relative overflow-hidden pb-12 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
        <Container className="relative">
          <Reveal>
            <SectionEyebrow>Safety</SectionEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-balance text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-tight text-foreground">
              Safe by default, by construction
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/68 md:text-base">
              Operational and data boundaries. Aurelius is constrained in what it can do —
              metadata-only, deterministic, auditable, and reversible — so teams can evaluate
              savings without exposing payloads or risking production.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Safe by default = two things */}
      <Section>
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/42">
              Safe by default means two things
            </p>
          </Reveal>
          <div className="mt-7 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            <Reveal className="bg-card p-7">
              <div className="font-mono text-[12px] tabular-nums text-steel">01 / Operational safety</div>
              <p className="mt-3 text-[14px] leading-relaxed text-white/68">
                Candidates must pass hard constraints — SLA, capacity, power, residency, policy —
                before they can ever be recommended.
              </p>
            </Reveal>
            <Reveal delay={120} className="bg-card p-7">
              <div className="font-mono text-[12px] tabular-nums text-steel">02 / Data safety</div>
              <p className="mt-3 text-[14px] leading-relaxed text-white/68">
                Aurelius evaluates scheduler metadata, not customer payloads. Workload data stays
                inside your environment.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Operational safety — constraint engine */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Operational safety"
              title="Optimization stops at the constraint boundary"
              intro="Every candidate is checked against hard operational gates. If it violates SLA, capacity, power, residency, or policy, it is rejected before execution — and the rejection is recorded."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <ConstraintEngineDiagram fig="fig.01" />
          </Reveal>
        </Container>
      </Section>

      {/* Data boundary */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Data boundary"
              title="Metadata only. Customer data stays inside your environment."
              revealIntro
              intro="Aurelius reads the scheduler metadata required to evaluate timing, placement, constraints, and expected economic outcome. It does not inspect prompts, model outputs, training data, customer payloads, or application code."
            />
          </Reveal>

          <Reveal delay={140} className="mt-12">
            <MetadataBoundaryDiagram fig="fig.02" />
          </Reveal>

          {/* Allowed / blocked split */}
          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            <Reveal className="bg-card p-7">
              <div className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
                <span className="h-px w-5 bg-signal/60" aria-hidden />
                Allowed · metadata
              </div>
              <ul className="grid gap-2.5">
                {allowedMetadata.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-white/68">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="bg-card p-7">
              <div className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-destructive/80">
                <span className="h-px w-5 bg-destructive/50" aria-hidden />
                Blocked · customer data
              </div>
              <ul className="grid gap-2.5">
                {blockedData.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-white/55">
                    <Cross />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Trust posture */}
          <Reveal delay={160}>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {trustCopy.map((item) => (
                <li key={item} className="flex items-start gap-3 py-3.5 text-[14px] leading-relaxed text-white/68">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal/80" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* What Aurelius cannot do */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Boundaries" title="What Aurelius cannot do" />
          </Reveal>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {cannotDoList.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 60} className="flex items-center gap-4 py-4">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
                  <circle cx="7" cy="7" r="6" stroke="hsl(0 0% 100% / 0.2)" strokeWidth="1" />
                  <path d="M4.5 4.5l5 5" stroke="hsl(0 72% 51% / 0.8)" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span className="text-[14px] text-white/62">{item}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Determinism + kill switch */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Determinism"
              title="Same inputs, same decisions"
              intro="No randomness in the decision pipeline. No stochastic sampling. Every optimization recommendation, safety-gate trigger, and fallback activation is logged with full context — auditable and exportable. If you ask why a decision was made, the system provides a traceable answer."
            />
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            <Reveal className="bg-card p-6">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
                Kill switch &amp; control
              </div>
              <p className="text-[13.5px] leading-relaxed text-white/60">
                Aurelius can be disabled instantly via a single environment variable — no code
                changes, no deployment. Dry-run mode is the default; live mode is opt-in, explicitly
                enabled. Operators retain full ownership of every threshold and mode switch.
              </p>
            </Reveal>
            <Reveal delay={120} className="bg-card p-6">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                Deployment model
              </div>
              <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-white/60">
{`Aurelius (sidecar / control layer)
  ├─ Reads scheduler metadata
  ├─ Evaluates future conditions
  ├─ Produces decisions
  └─ Logs outcomes (append-only)`}
              </pre>
            </Reveal>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
