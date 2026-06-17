import { Layout } from "@/components/layout/Layout";
import {
  Container,
  Section,
  SectionEyebrow,
  SectionHeader,
  CTAButton,
  Reveal,
} from "@/components/site/primitives";
import { KV } from "@/components/diagrams/bits";
import { ShadowModeAuditDiagram } from "@/components/diagrams/ShadowModeAuditDiagram";

const whatYouSee = [
  { k: "Approved decisions", v: "optimizations that would have been applied" },
  { k: "Skipped decisions", v: "and the specific reason each was rejected" },
  { k: "Simulated savings", v: "energy cost and carbon reduction" },
  { k: "Latency preserved", v: "proof that no SLA would be violated" },
];

export default function ShadowAudit() {
  return (
    <Layout>
      {/* Page header */}
      <section className="relative overflow-hidden pb-12 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
        <Container className="relative">
          <Reveal>
            <SectionEyebrow>Shadow audit</SectionEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-[-0.025em] text-foreground">
              See what would happen — without changing anything
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/62 md:text-base">
              A shadow audit runs Aurelius in dry-run mode against your existing workloads. Nothing
              changes. No permissions beyond read access to job metadata. Aurelius records the
              decisions it would have made — without executing any of them.
            </p>
          </Reveal>
          <Reveal delay={220} className="mt-10">
            <ShadowModeAuditDiagram fig="fig.01" />
          </Reveal>
        </Container>
      </section>

      {/* What you see */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="The report"
              title="A complete picture of savings and safety behavior"
              revealIntro
              intro="Zero risk to your production environment. The output is a structured report designed for infrastructure teams."
            />
          </Reveal>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {whatYouSee.map((item, i) => (
              <Reveal as="li" key={item.k} delay={i * 60} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-foreground">
                  {item.k}
                </span>
                <span className="text-[13.5px] text-white/55">{item.v}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Output artifact */}
      <Section alt>
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeader
                  eyebrow="Output artifact"
                  title="Every number is auditable"
                  intro="Reports include energy, cost, and carbon deltas, plus operational notes explaining any decisions filtered out by safety gates."
                />
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={140}>
                <div className="rounded-md border border-border bg-card p-6">
                  <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal anim-breathe" aria-hidden />
                    counterfactual report
                  </div>
                  <div className="space-y-2.5">
                    <KV k="energy delta" v="−12.4%" vClass="text-steel" />
                    <KV k="cost delta" v="−$4,280 / mo" vClass="text-steel" />
                    <KV k="carbon delta" v="−8.2 tCO₂e / mo" vClass="text-steel" />
                    <KV k="latency impact" v="none" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <h2 className="text-balance font-display text-[clamp(1.5rem,3.2vw,2.2rem)] font-medium tracking-[-0.025em] text-foreground">
                Run your shadow audit
              </h2>
            </Reveal>
            <Reveal delay={120} className="mt-8 flex justify-center">
              <CTAButton to="/contact" variant="primary" withArrow>
                Request access
              </CTAButton>
            </Reveal>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
