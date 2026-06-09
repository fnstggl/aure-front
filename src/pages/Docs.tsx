import { Layout } from "@/components/layout/Layout";
import { Container, Section, SectionEyebrow, Reveal } from "@/components/site/primitives";

const docSections = [
  { id: "01", title: "Architecture", description: "System design, component overview, and integration points." },
  { id: "02", title: "Configuration", description: "Environment variables, settings, and deployment options." },
  { id: "03", title: "Execution modes", description: "Dry-run, live mode, and latency-safe configurations." },
  { id: "04", title: "Security", description: "Access controls, audit logging, and compliance." },
];

export default function Docs() {
  return (
    <Layout>
      {/* Page header */}
      <section className="relative overflow-hidden pb-12 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
        <Container className="relative">
          <Reveal>
            <SectionEyebrow>Documentation</SectionEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-balance text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-tight text-foreground">
              Technical reference for Aurelius
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/62 md:text-base">
              Reference for infrastructure engineers integrating the control layer. Pilot
              participants receive the full technical documentation set.
            </p>
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container>
          <ul className="divide-y divide-border border-y border-border">
            {docSections.map((section, i) => (
              <Reveal as="li" key={section.id} delay={i * 60}>
                <div className="group flex items-center gap-5 py-6">
                  <span className="font-mono text-[12px] tabular-nums text-steel/70">{section.id}</span>
                  <div>
                    <h2 className="text-[16px] font-medium tracking-tight text-foreground">
                      {section.title}
                    </h2>
                    <p className="mt-1 text-[13.5px] text-white/55">{section.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={200} className="mt-12 flex items-center gap-3 rounded-md border border-border bg-card px-5 py-4">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal anim-breathe" aria-hidden />
            <p className="font-mono text-[12px] text-white/55">
              Documentation coming soon — pilot participants receive early technical docs.
            </p>
          </Reveal>
        </Container>
      </Section>
    </Layout>
  );
}
