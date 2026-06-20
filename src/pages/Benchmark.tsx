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
import { StatusTag } from "@/components/diagrams/bits";

/* Public technical report. Grounded in one open dataset — the Azure LLM
   Inference Trace 2024 — so the inputs are inspectable and the run is
   reproducible. The trace supplies request arrivals and token counts only;
   GPU-hours and dollars are modeled on top and labelled as such. No customer
   data and no live infrastructure are involved, and the headline figures are
   stated as counterfactual deltas, not mechanisms. */

const LINKS = {
  dataset: "https://github.com/Azure/AzurePublicDataset/blob/master/AzureLLMInferenceDataset2024.md",
  codeCsv:
    "https://github.com/Azure/AzurePublicDataset/releases/download/dataset-llm-2024/AzureLLMInferenceTrace_code_1week.csv",
  convCsv:
    "https://github.com/Azure/AzurePublicDataset/releases/download/dataset-llm-2024/AzureLLMInferenceTrace_conv_1week.csv",
  paper: "https://arxiv.org/abs/2408.00741",
};

const dataset = [
  { k: "Dataset", v: "Azure LLM Inference Trace 2024", mono: true },
  { k: "Source", v: "Microsoft Azure Public Dataset" },
  { k: "Collected", v: "May 10–19, 2024" },
  { k: "Workload", v: "Sampled production LLM inference services — code and conversation traces, one week each" },
  { k: "Fields", v: "TIMESTAMP, ContextTokens, GeneratedTokens", mono: true },
  { k: "Prompt content", v: "Not included — token counts only, by privacy requirement (GDPR)" },
  { k: "License", v: "CC-BY Attribution" },
];

const distinction = [
  {
    label: "The trace establishes",
    tone: "steel" as const,
    body: "A realistic, public record of LLM inference demand — request arrival times and per-request input/output token counts over one week of production services. This is the workload shape, not a cost.",
  },
  {
    label: "Aurelius modeled",
    tone: "steel" as const,
    body: "A counterfactual cost comparison over that demand: a price- and timing-aware policy against a price-agnostic baseline, under identical completion constraints. GPU-hours and dollars are modeled from the token-level compute — they are not fields in the trace.",
  },
  {
    label: "Stays fleet-dependent",
    tone: "muted" as const,
    body: "The size of the gain. It moves with how much of your workload is deferrable, how much capacity headroom you hold, and how volatile your pricing is — none of which a public trace can settle for you.",
  },
];

const methodology = [
  {
    k: "Demand — from the trace",
    v: "Request arrival timestamps and per-request context / generated token counts define when work arrives and how heavy each request is. Taken directly from the Azure LLM Inference Trace 2024; nothing is invented.",
  },
  {
    k: "Cost model — Aurelius",
    v: "GPU-hours and dollar cost are modeled from the token-level compute and a stated energy/price profile — the trace carries token counts, not costs. The identical model is applied to both the baseline and the counterfactual.",
  },
  {
    k: "Counterfactual policy — Aurelius",
    v: "Aurelius schedules deferrable demand into lower-cost windows and leaves latency-bound requests in place, recording what it would have done. Nothing is executed: the trace is replayed offline, never run on live infrastructure.",
  },
  {
    k: "Completion constraint",
    v: "Every deferral is bounded by the request's completion window. Any decision that would breach it is rejected and recorded as rejected — it does not count toward the result.",
  },
];

const results = [
  { k: "goodput / $", v: "+42%", vClass: "text-steel", note: "counterfactual vs. price-agnostic baseline — same demand, same constraints, modeled cost" },
  { k: "GPU-hours", v: "−21%", vClass: "text-steel", note: "21% lower in this counterfactual run under the same completion constraints" },
  { k: "completion-constraint violations", v: "0", note: "no request exceeds its completion window" },
  { k: "latency-bound requests deferred", v: "0", note: "only demand marked deferrable is shifted" },
  { k: "data used", v: "token metadata", note: "TIMESTAMP, ContextTokens, GeneratedTokens — no prompt content" },
  { k: "execution impact", v: "none", note: "offline replay over a public trace — nothing run live" },
];

const limitations = [
  "Public trace, not your telemetry. The Azure LLM Inference Trace 2024 is an open, anonymized sample of Azure inference services — not customer-specific data, and not your fleet's behavior.",
  "Token-level demand, not scheduler internals. The trace carries arrivals and token counts only. Placement, capacity, pricing, and scheduler state are modeled on top — not observed in the data.",
  "The gain is conditional. It depends on workload flexibility, capacity headroom, and price volatility, all of which vary by fleet. A different workload mix can move the figure in either direction.",
  "Validate in shadow mode. Treat this as evidence the approach is sound, then reproduce it on your own metadata — with your own baseline and price profile — before any deployment.",
];

function NEArrow({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className={className}>
      <path d="M3 7L7 3M3.4 3H7v3.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 text-[13px] text-steel/90 underline decoration-white/20 underline-offset-[3px] transition-colors hover:text-foreground hover:decoration-white/45"
    >
      {children}
      <NEArrow className="text-white/30 transition-colors group-hover:text-white/55" />
    </a>
  );
}

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
              The economic case, evaluated on an open trace
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/62 md:text-base">
              Aurelius's economics, evaluated by counterfactual replay over the Azure LLM Inference
              Trace 2024 — a public dataset from Microsoft Azure. No customer data, no live
              infrastructure. This page states what the trace contains, what Aurelius modeled on top
              of it, and what stays specific to your fleet.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Trace source — the dataset, fully cited */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Trace source"
              title="One open dataset, fully cited"
              intro="Every figure on this page derives from a single public trace, so the inputs are inspectable and the run is reproducible. The dataset, both CSVs, and the paper that describes it are linked directly below."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <div className="overflow-hidden rounded-md border border-border bg-card">
              <div className="border-b border-border px-6 py-4">
                <div className="font-mono text-[13px] text-foreground">Azure LLM Inference Trace 2024</div>
                <div className="mt-1 text-[12.5px] text-white/45">Microsoft Azure Public Dataset</div>
              </div>
              <dl className="divide-y divide-border">
                {dataset.map((row) => (
                  <div key={row.k} className="grid grid-cols-1 gap-1 px-6 py-3.5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">{row.k}</dt>
                    <dd className={cn("text-[13.5px] leading-relaxed text-white/72", row.mono && "font-mono text-[12.5px] text-steel/90")}>
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-x-7 gap-y-3 border-t border-border px-6 py-4">
                <ExtLink href={LINKS.dataset}>Dataset page</ExtLink>
                <ExtLink href={LINKS.codeCsv}>Code trace (CSV)</ExtLink>
                <ExtLink href={LINKS.convCsv}>Conversation trace (CSV)</ExtLink>
                <ExtLink href={LINKS.paper}>DynamoLLM — HPCA 2025</ExtLink>
              </div>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-3xl text-[12.5px] leading-relaxed text-white/45">
              Trace published by Microsoft Azure under a CC-BY Attribution License and described in:
              Jovan Stojkovic, Chaojie Zhang, Íñigo Goiri, Josep Torrellas, and Esha Choukse,
              “DynamoLLM: Designing LLM Inference Clusters for Performance and Energy Efficiency,”
              HPCA 2025.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Headline result — the two numbers, framed */}
      <Section alt>
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
            <StatusTag state="pass">Azure LLM Inference Trace 2024</StatusTag>
            <StatusTag state="gold">counterfactual replay</StatusTag>
            <StatusTag state="pass">completion-constrained</StatusTag>
            <StatusTag state="pass">no live infrastructure</StatusTag>
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto mt-6 max-w-xl text-center text-[12.5px] leading-relaxed text-white/40">
              Counterfactual deltas against a price-agnostic baseline on the same trace. GPU-hours and
              dollars are modeled from token-level compute, not read from the dataset.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Reading the result — what the trace proves vs. what Aurelius modeled */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Reading the result"
              title="What the trace shows, what Aurelius modeled, what stays yours"
              intro="The honest division of labor between an open dataset and a counterfactual run. Keep these three apart and the figures read for exactly what they are."
            />
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
            {distinction.map((d, i) => (
              <Reveal key={d.label} delay={i * 80} className="bg-card p-6">
                <div className={cn("font-mono text-[11px] uppercase tracking-[0.16em]", d.tone === "steel" ? "text-steel" : "text-white/45")}>
                  {d.label}
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-white/62">{d.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Methodology */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Method"
              title="How the counterfactual is computed"
              intro="The trace supplies the demand; Aurelius supplies a cost model and a policy, applied identically to baseline and counterfactual. Each is stated so the run can be reproduced and disputed."
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
              <span className="text-white/75">Stated assumptions, not trace data.</span> The baseline
              policy, the energy/price profile, and which requests are treated as deferrable are
              parameters Aurelius applies on top of the trace — held identical across baseline and
              counterfactual. They are the first things to re-derive from your own metadata in shadow
              mode.
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
              intro="The full readout from the counterfactual run, including the constraint figures — because a savings number without its constraint record is not auditable."
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
                  <li key={r.k} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 px-6 py-4 sm:grid-cols-[14rem_1fr_auto]">
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
                Useful output — generated tokens served — per dollar of modeled energy and compute.
                It rises when the same demand is served in cheaper windows; it is a ratio between two
                policies on one trace, not an absolute fleet figure.
              </p>
            </Reveal>
            <Reveal delay={100} className="rounded-md border border-border bg-card p-6">
              <div className="font-mono text-[12px] tracking-tight text-foreground">GPU-hours</div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">
                Modeled GPU-hours to serve the same demand under the stated cost model. Reported as a
                relative delta between the two policies under identical completion constraints —
                21% lower in this run, without attributing the reduction to any single mechanism.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Scope & limitations */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Scope & limitations"
              title="What this is — and what it is not"
              intro="An open-trace counterfactual is evidence that the approach holds on realistic demand. It is not a guarantee for your fleet, and it is not pretending to be."
            />
          </Reveal>
          <Reveal delay={120}>
            <ul className="policy-prose mt-8 max-w-2xl text-[13.5px] leading-relaxed text-white/60">
              {limitations.map((l) => (
                <li key={l}>{l}</li>
              ))}
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
                Read your own number, on your own metadata
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/62">
                A shadow-mode analysis runs the same counterfactual against your fleet's metadata,
                with your baseline and price profile — no execution impact required.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTAButton to="/contact" variant="primary" withArrow beam>
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
