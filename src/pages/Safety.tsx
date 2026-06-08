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
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/62 md:text-base">
              Security and operational constraints. Aurelius is constrained in what it can do —
              deterministic, auditable, and reversible — so it can be deployed without risk to
              production.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Constraint boundary */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Constraint engine"
              title="Optimization stops at the constraint boundary"
              intro="Every candidate is checked against hard operational gates. If it violates SLA, capacity, power, residency, or policy, it is rejected before execution — and the rejection is recorded."
            />
          </Reveal>
          <Reveal delay={140} className="mt-12">
            <DiagramCard label="Constraint gates">
              <ConstraintEngineDiagram />
            </DiagramCard>
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

      {/* Deterministic behavior */}
      <Section>
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeader
                  eyebrow="Determinism"
                  title="Same inputs, same decisions"
                  intro="No randomness in the decision pipeline. No stochastic sampling. Every optimization recommendation, safety-gate trigger, and fallback activation is logged with full context — auditable and exportable. If you ask why a decision was made, the system provides a traceable answer."
                />
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={140}>
                <DiagramCard label="Metadata boundary">
                  <MetadataBoundaryDiagram />
                </DiagramCard>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Kill switch & deployment */}
      <Section alt>
        <Container>
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
            <Reveal className="bg-card p-6">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
                Kill switch &amp; control
              </div>
              <p className="text-[13.5px] leading-relaxed text-white/55">
                Aurelius can be disabled instantly via a single environment variable — no code
                changes, no deployment. Dry-run mode is the default; live mode is opt-in, explicitly
                enabled. Operators retain full ownership of every threshold and mode switch.
              </p>
            </Reveal>
            <Reveal delay={120} className="bg-card p-6">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                Deployment model
              </div>
              <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-white/55">
{`Aurelius (sidecar / control layer)
  ├─ Reads scheduler state
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
