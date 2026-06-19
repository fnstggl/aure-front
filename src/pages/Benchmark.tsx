import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout/Layout";
import {
  Container,
  Section,
  SectionEyebrow,
  SectionHeader,
  CTAButton,
  Reveal,
  SpectrumRule,
} from "@/components/site/primitives";
import { KV, StatusTag } from "@/components/diagrams/bits";

/* Public technical report substantiating the homepage claims (+42% goodput/$,
   −21% GPU-hours). Written to exactly the specificity the rest of the site
   commits to — shadow-mode counterfactual on public Azure traces, SLA-safe —
   and no further. The honest caveat is kept front and center. */

const methodology = [
  {
    k: "Workload model",
    v: "Jobs are taken from public Azure production traces and split into flexible (deferrable batch / training) and locked (latency-bound, interactive) classes. Only flexible jobs are candidates for time-shifting; locked jobs are never moved.",
  },
  {
    k: "Baseline",
    v: "The scheduler's own placement and timing as recorded in the trace. Aurelius is measured against this real behavior — not an idealized scheduler.",
  },
  {
    k: "Counterfactual",
    v: "Aurelius runs in shadow mode: it reads metadata only, generates price-aware time-shift decisions for flexible jobs, and records what it would have done. Nothing in the trace is executed differently.",
  },
  {
    k: "Constraint gate",
    v: "Every candidate is checked against SLA, capacity, and timing bounds before it counts. Any decision that would breach a constraint is rejected and recorded as rejected — not applied.",
  },
];

const results = [
  { k: "goodput / $", v: "+42%", vClass: "text-steel", note: "useful work completed per dollar of energy + compute" },
  { k: "GPU-hours", v: "−21%", vClass: "text-steel", note: "total GPU-hours consumed across the trace window" },
  { k: "SLA violations", v: "0", note: "no job exceeds its original completion bound" },
  { k: "locked jobs moved", v: "0", note: "latency-bound work is never time-shifted" },
  { k: "payload access", v: "none", note: "metadata only — no model inputs or outputs" },
  { k: "execution impact", v: "none", note: "shadow mode — decisions recorded, not applied" },
];

export default function Benchmark() {
  return (
    <Layout>
      {/* Page header */}
      <section className="relative overflow-hidden pb-12 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
        <Container className="relative">
          <Reveal>
            <SectionEyebrow tone="spectrum">Benchmark</SectionEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-balance text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-tight text-foreground">
              The economic case, measured before a single change to execution
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/62 md:text-base">
              Aurelius was run in shadow mode against public Azure traces — counterfactual decisions
              recorded against the scheduler's real behavior, with zero execution impact. This page
              states exactly what was measured, how, and what it does and does not prove.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Headline result — the two numbers, lit */}
      <Section>
        <Container>
          <Reveal className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden py-8">
              <div aria-hidden className="stat-grid pointer-events-none absolute inset-0" />
              <div className="relative grid gap-12 sm:grid-cols-2 sm:gap-8">
                {[
                  { n: "+42%", l: "higher goodput per dollar" },
                  { n: "−21%", l: "fewer GPU-hours" },
                ].map((s) => (
                  <div key={s.n} className="text-center">
                    <div className="text-[clamp(3.2rem,9vw,6rem)] font-medium leading-[0.86] tracking-[-0.04em] text-foreground">
                      {s.n}
                    </div>
                    <div className="mx-auto mt-6 flex justify-center">
                      <SpectrumRule className="w-28" />
                    </div>
                    <p className="mt-6 text-[15px] font-medium tracking-tight text-white/72">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={120} className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <StatusTag state="pass">public Azure traces</StatusTag>
            <StatusTag state="gold">SLA-safe</StatusTag>
            <StatusTag state="pass">0 SLA violations</StatusTag>
            <StatusTag state="pass">metadata only</StatusTag>
          </Reveal>
        </Container>
      </Section>

      {/* Methodology */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Methodology"
              title="What was measured, and how"
              intro="The result is a counterfactual: what the same workloads would have cost had Aurelius advised on timing, with every decision gated by the same constraints a production fleet runs under."
            />
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
            {methodology.map((m, i) => (
              <Reveal key={m.k} delay={i * 70} className="bg-card p-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel">{m.k}</div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-white/62">{m.v}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={160} className="mt-6">
            <p className="max-w-2xl border-l border-signal/40 pl-5 text-[13.5px] leading-relaxed text-white/55">
              Most of the gain comes from time-shifting flexible batch and training workloads out of
              peak pricing windows — not from throttling, resource reduction, or touching latency-bound
              work.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Results table */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Results"
              title="Every number, in one place"
              intro="The full readout from the shadow-mode run, including the safety figures — because a savings number without its constraint record is not auditable."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <div className="overflow-hidden rounded-md border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal anim-breathe" aria-hidden />
                counterfactual readout
              </div>
              <ul className="divide-y divide-border">
                {results.map((r) => (
                  <li key={r.k} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 px-6 py-4 sm:grid-cols-[10rem_1fr_auto]">
                    <span className="font-mono text-[12px] text-white/45">{r.k}</span>
                    <span className="order-3 col-span-2 text-[12.5px] text-white/40 sm:order-2 sm:col-span-1">
                      {r.note}
                    </span>
                    <span className={cn("order-2 justify-self-end font-mono text-[14px] tabular-nums text-white/85 sm:order-3", r.vClass)}>
                      {r.v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Definitions */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Definitions" title="The two metrics, defined" />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal className="rounded-md border border-border bg-card p-6">
              <div className="font-mono text-[12px] tracking-tight text-foreground">goodput / $</div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">
                Useful work completed per dollar of energy and compute spent. Rises when the same work
                lands in cheaper windows — not by counting wasted or speculative cycles.
              </p>
            </Reveal>
            <Reveal delay={100} className="rounded-md border border-border bg-card p-6">
              <div className="font-mono text-[12px] tracking-tight text-foreground">GPU-hours</div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">
                Total GPU-hours consumed across the trace window. Falls when better timing removes
                redundant retries, cold starts, and contention — at equal or better completion.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* How to read this — honest caveats */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="How to read this"
              title="Benchmark evidence — not a guaranteed universal result"
              intro="This is a real measurement on public traces, stated plainly. It is not a promise that every fleet sees the same number."
            />
          </Reveal>
          <Reveal delay={120}>
            <ul className="policy-prose mt-8 max-w-2xl text-[13.5px] leading-relaxed text-white/60">
              <li>The gain scales with how much of your workload is genuinely flexible. Fleets that are mostly latency-bound will see less.</li>
              <li>It scales with price volatility. Flatter energy and capacity pricing leaves less room to shift into.</li>
              <li>Topology matters — regions, pools, and capacity headroom set the ceiling on safe time-shifting.</li>
              <li>Shadow mode is the point: you reproduce this on your own fleet before anything changes, and read your own number.</li>
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* CTA */}
      <Section alt>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <h2 className="text-balance text-[clamp(1.5rem,3.2vw,2.2rem)] font-medium tracking-tight text-foreground">
                Read your own number, on your own traces
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/62">
                A shadow-mode analysis runs the same measurement against your scheduler metadata — no
                execution impact required.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton to="/contact" variant="primary" withArrow>
                  Run a shadow-mode analysis
                </CTAButton>
                <CTAButton to="/how-it-works" variant="secondary">
                  See how it works
                </CTAButton>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
