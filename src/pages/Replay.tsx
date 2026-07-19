import { Layout } from "@/components/layout/Layout";
import {
  Container,
  Section,
  SectionEyebrow,
  SectionHeader,
  CTAButton,
  Reveal,
} from "@/components/site/primitives";

const steps = [
  {
    n: "01",
    title: "Export a slice of history",
    body: "Any tabular export works — Slurm sacct, Kubernetes job dumps, gateway or vLLM request logs. CSV, TSV, or JSON-lines; 7–30 days is plenty. Job metadata only: timestamps, resource shapes, token counts. No payloads, no model weights.",
  },
  {
    n: "02",
    title: "Run the replay locally",
    body: "One command opens a local page on 127.0.0.1. The tool maps your columns onto the replay schema, shows you the mapping for confirmation, and refuses to compute anything your data can't support. It makes no network calls — nothing leaves your machine.",
  },
  {
    n: "03",
    title: "Read the counterfactual",
    body: "The same arrivals and the same work are re-run through Aurelius's scheduling decisions and the strongest realistic baselines, scored on SLA-safe goodput per infrastructure dollar. What was measured, what was simulated, and what was assumed are labelled — line by line.",
  },
];

const reportRows = [
  { k: "Schema mapping", v: "how each of your columns was read, with unit inference shown" },
  { k: "Readiness verdict", v: "ready / degraded / insufficient — and what unlocks each disabled lever" },
  { k: "Your cluster, as logged", v: "queue waits, burstiness, idle share, failure rates — measured, not simulated" },
  { k: "Counterfactual replay", v: "goodput per dollar vs the strongest safe baseline, with safety gates applied" },
  { k: "Assumptions, openly", v: "every default and inference the replay relied on, and how to replace it" },
];

const privacyRows = [
  { k: "Execution", v: "entirely local — served from 127.0.0.1" },
  { k: "Network", v: "no outbound requests, no telemetry, no phone-home" },
  { k: "Inputs", v: "job metadata only; payloads are never required" },
  { k: "Shareable artifact", v: "an anonymized schema fingerprint — column names and shapes, never log rows — shared only if you choose to send it" },
];

export default function Replay() {
  return (
    <Layout>
      {/* Page header */}
      <section className="relative overflow-hidden pb-12 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
        <Container className="relative">
          <Reveal>
            <SectionEyebrow>Aurelius Replay</SectionEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-balance text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-tight text-foreground">
              Don't believe us. Replay your own logs.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/62 md:text-base">
              Aurelius Replay is a read-only tool that reruns your historical scheduler or serving
              logs through Aurelius's decision layer — same workloads, same arrivals, same
              constraints — and reports what would have changed. It runs on your machine, touches no
              production system, and sends nothing anywhere.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Steps */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="The flow"
              title="From log export to evidence in one sitting"
              revealIntro
              intro="No meeting, no data transfer, no production access. The replay is the pilot guide's first phase, packaged to run without us in the room."
            />
          </Reveal>
          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80} className="bg-background p-6 md:p-8">
                <div className="font-mono text-[12px] tracking-[0.3em] text-signal">{s.n}</div>
                <h3 className="mt-4 text-[17px] font-medium text-foreground">{s.title}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-white/62">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* What the report contains */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="The report"
              title="Every number labelled: measured, simulated, or assumed"
              revealIntro
              intro="The output is a single self-contained page an infrastructure engineer can forward internally. It leads with what your own log proves before any counterfactual appears."
            />
          </Reveal>
          <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {reportRows.map((item, i) => (
              <Reveal
                as="li"
                key={item.k}
                delay={i * 60}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-foreground">
                  {item.k}
                </span>
                <span className="max-w-xl text-[13.5px] text-white/70 sm:text-right">{item.v}</span>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={120}>
            <p className="mt-8 max-w-2xl text-[13px] leading-relaxed text-white/50">
              Replay results are directional, not production savings: they are a historical
              simulation on your own data, against the strongest realistic safe baseline — never
              against naive FIFO. If the replay can't support a number, it refuses to print one and
              tells you which fields would change that. The figure a deployment decision is made on
              comes later, from shadow mode against live telemetry.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Privacy posture */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Data posture"
              title="Built for teams that can't ship logs to a vendor"
              revealIntro
              intro="Scheduler logs encode tenants, models, and utilization — commercially sensitive by default. Replay is designed so trying Aurelius requires trusting nothing."
            />
          </Reveal>
          <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {privacyRows.map((item, i) => (
              <Reveal
                as="li"
                key={item.k}
                delay={i * 60}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-foreground">
                  {item.k}
                </span>
                <span className="max-w-xl text-[13.5px] text-white/70 sm:text-right">{item.v}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* CTA */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Get the tool"
              title="Guided first runs, while Replay is in early access"
              revealIntro
              intro="We onboard a small number of teams at a time: you run Replay on your side, we stay on the line, and if a column doesn't map we ship support for your export format — usually same-day. Your logs never leave your machine at any stage."
            />
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <CTAButton to="/contact" withArrow>
              Request a replay session
            </CTAButton>
          </Reveal>
        </Container>
      </Section>
    </Layout>
  );
}
