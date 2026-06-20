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

/* ------------------------------------------------------------------ */
/* Source material — Azure LLM Inference Trace 2024                     */
/* All links resolve to the public Microsoft Azure Public Dataset repo */
/* ------------------------------------------------------------------ */

const DATASET_URL =
  "https://github.com/Azure/AzurePublicDataset/blob/master/AzureLLMInferenceDataset2024.md";
const CODE_TRACE_URL =
  "https://github.com/Azure/AzurePublicDataset/releases/download/dataset-llm-2024/AzureLLMInferenceTrace_code_1week.csv";
const CONV_TRACE_URL =
  "https://github.com/Azure/AzurePublicDataset/releases/download/dataset-llm-2024/AzureLLMInferenceTrace_conv_1week.csv";
const PAPER_URL = "https://arxiv.org/abs/2408.00741";

const datasetFacts = [
  { k: "dataset", v: "Azure LLM Inference Trace 2024" },
  { k: "source", v: "Microsoft Azure Public Dataset" },
  { k: "collected", v: "May 10–19, 2024" },
  { k: "workload", v: "Multiple Azure LLM inference services" },
  { k: "traces", v: "Code · Conversation (1 week each)" },
  { k: "fields", v: "TIMESTAMP · ContextTokens · GeneratedTokens" },
  { k: "prompt content", v: "Not included (privacy)" },
  { k: "license", v: "CC-BY Attribution" },
];

const sources = [
  {
    label: "Azure LLM Inference Dataset 2024",
    sub: "Dataset documentation",
    href: DATASET_URL,
  },
  {
    label: "AzureLLMInferenceTrace_code_1week.csv",
    sub: "Code trace · direct download",
    href: CODE_TRACE_URL,
  },
  {
    label: "AzureLLMInferenceTrace_conv_1week.csv",
    sub: "Conversation trace · direct download",
    href: CONV_TRACE_URL,
  },
  {
    label: "DynamoLLM (HPCA 2025) — arXiv:2408.00741",
    sub: "Paper describing the trace",
    href: PAPER_URL,
  },
];

const suppliedByTrace = [
  "Per-request invocation timestamps",
  "Context token counts (input size)",
  "Generated token counts (output size)",
  "Two workload types — code and conversation",
];

const suppliedByModel = [
  "Token-count → GPU-time serving model",
  "Energy / price schedule over the window",
  "Fleet capacity and headroom",
  "Completion-constraint definitions",
];

const limitations = [
  "Public trace, not customer-specific telemetry.",
  "Token-level inference trace, not full scheduler internals.",
  "Results depend on workload flexibility, capacity headroom, and price volatility.",
  "Shadow mode should be run on the customer’s own metadata before deployment.",
];

/* Inline external reference — the only outbound links on the site, so the
   styling is local to this page rather than promoted to a shared primitive. */
function Ref({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-steel underline decoration-steel/30 underline-offset-[3px] transition-colors duration-200 hover:decoration-steel"
    >
      {children}
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
            <SectionEyebrow>Benchmark</SectionEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-balance text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-tight text-foreground">
              Benchmarked on the Azure LLM Inference Trace 2024
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/68 md:text-base">
              A counterfactual replay on a public, production-derived inference trace. We report
              what changed when Aurelius’s advisory decisions were applied to the same workload
              under the same completion constraints — and we are explicit about what the trace
              proves, what we modeled, and what stays fleet-dependent.
            </p>
          </Reveal>

          {/* Headline figures, stated as the result of one run — not a guarantee */}
          <Reveal delay={200}>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] tracking-tight text-white/45">
              <span>
                <span className="text-foreground">−21%</span> GPU-hours
              </span>
              <span className="text-white/15">·</span>
              <span>
                <span className="text-foreground">+42%</span> goodput / $
              </span>
              <span className="text-white/15">·</span>
              <span>same completion constraints</span>
            </div>
            <p className="mt-3 font-mono text-[11px] text-white/26">
              Counterfactual replay on public data — not a run on live Azure infrastructure or
              private customer telemetry.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Trace source / dataset — the auditable data sheet, near the top */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Trace source"
              title="Azure LLM Inference Trace 2024"
              intro="A public trace of LLM inference requests sampled from multiple Azure inference services over one week. It records request timing and token sizes only — prompt content is excluded for privacy, so just the token counts are available."
            />
          </Reveal>

          {/* Data sheet */}
          <Reveal delay={120} className="mt-10">
            <div className="rounded-md border border-border bg-card p-6 sm:p-7">
              <div className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal anim-breathe" aria-hidden />
                dataset record
              </div>
              <div className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
                {datasetFacts.map((f) => (
                  <KV key={f.k} k={f.k} v={f.v} />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Downloads & sources */}
          <Reveal delay={160} className="mt-6">
            <ul className="divide-y divide-border border-y border-border">
              {sources.map((s) => (
                <li
                  key={s.href}
                  className="flex flex-col gap-0.5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Ref href={s.href}>
                    <span className="font-mono text-[13px]">{s.label}</span>
                  </Ref>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">
                    {s.sub}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Attribution */}
          <Reveal delay={200}>
            <p className="mt-8 max-w-3xl border-l border-steel/40 pl-5 text-[13.5px] leading-relaxed text-white/55">
              The trace is described and analyzed in: Jovan Stojkovic, Chaojie Zhang, Íñigo Goiri,
              Josep Torrellas, Esha Choukse,{" "}
              <Ref href={PAPER_URL}>
                “DynamoLLM: Designing LLM Inference Clusters for Performance and Energy
                Efficiency,”
              </Ref>{" "}
              HPCA 2025. Dataset released under a CC-BY Attribution License via the{" "}
              <Ref href={DATASET_URL}>Microsoft Azure Public Dataset</Ref> repository.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* What the trace proves vs what we measured vs what is fleet-dependent */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Reading the result"
              title="Three claims, kept separate"
              intro="The credibility of a benchmark depends on not conflating the data with the conclusion. We keep three things apart: what the public trace establishes, what Aurelius measured against it, and what only your own fleet can settle."
            />
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
            <Reveal className="bg-card p-7">
              <div className="font-mono text-[12px] tabular-nums text-steel">
                01 / The trace proves
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-white/68">
                A real, production-derived workload shape: arrival timing and input/output token
                distributions from live Azure inference services over one week.
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-white/40">
                It does not include scheduler internals, GPU placement, energy prices, or
                per-customer telemetry.
              </p>
            </Reveal>

            <Reveal delay={100} className="bg-card p-7">
              <div className="font-mono text-[12px] tabular-nums text-steel">
                02 / Aurelius measured
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-white/68">
                Replaying that workload through a modeled fleet, GPU-hours were 21% lower and
                goodput per dollar 42% higher in this counterfactual run — under the same completion
                constraints.
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-white/40">
                A replay on public data, not a run on live Azure infrastructure or private customer
                data.
              </p>
            </Reveal>

            <Reveal delay={200} className="bg-card p-7">
              <div className="font-mono text-[12px] tabular-nums text-white/45">
                03 / Stays fleet-dependent
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-white/68">
                How much transfers to your environment. The magnitude moves with workload
                flexibility, capacity headroom, and price volatility.
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-white/40">
                The honest number for your fleet comes from shadow mode on your own metadata.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Method — how the counterfactual was constructed */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Method"
              title="How the counterfactual was run"
              intro="The Azure trace supplies the workload — arrival timing and per-request token sizes. A modeled fleet supplies the cost surface. The same trace is then replayed twice: once with the scheduler alone, once with Aurelius’s advisory decisions applied, holding every completion constraint identical between runs. The reported deltas are the difference between those two runs."
            />
          </Reveal>

          {/* Grounded vs assumed — an explicit ledger */}
          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            <Reveal className="bg-card p-7">
              <div className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
                <span className="h-px w-5 bg-signal/60" aria-hidden />
                Supplied by the trace
              </div>
              <ul className="grid gap-2.5">
                {suppliedByTrace.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[13.5px] text-white/68">
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-steel" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="bg-card p-7">
              <div className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                <span className="h-px w-5 bg-white/25" aria-hidden />
                Supplied by the fleet model · assumptions
              </div>
              <ul className="grid gap-2.5">
                {suppliedByModel.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[13.5px] text-white/55">
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-white/30" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <p className="mt-8 max-w-2xl border-l border-signal/40 pl-5 text-[14px] leading-relaxed text-white/55">
              We do not attribute the deltas to a single mechanism. The run varied only whether
              Aurelius’s advisory decisions were applied; workload, fleet model, and completion
              constraints were held fixed between the two replays.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Results — the two figures, precisely worded */}
      <Section alt>
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Results"
              title="What changed in the replay"
              intro="Goodput per dollar is SLA-meeting completed work per dollar of compute. Both figures describe this single counterfactual run on the Azure trace — not a guaranteed result for any other fleet."
            />
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            <Reveal className="bg-card p-7">
              <div className="font-mono text-[clamp(2.4rem,6vw,3.4rem)] font-medium leading-none tracking-tight text-foreground">
                −21%
              </div>
              <div className="mt-3 text-[15px] font-medium tracking-tight text-white/80">
                GPU-hours
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">
                GPU-hours were 21% lower in this counterfactual run under the same completion
                constraints.
              </p>
            </Reveal>
            <Reveal delay={120} className="bg-card p-7">
              <div className="font-mono text-[clamp(2.4rem,6vw,3.4rem)] font-medium leading-none tracking-tight text-foreground">
                +42%
              </div>
              <div className="mt-3 text-[15px] font-medium tracking-tight text-white/80">
                goodput / $
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">
                Goodput per dollar was 42% higher in the same run, with no SLA or completion
                constraint relaxed.
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
              title="What this benchmark does not claim"
              intro="The result is a bounded, reproducible counterfactual on public data. It is evidence, not a forecast for your fleet."
            />
          </Reveal>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {limitations.map((item, i) => (
              <Reveal
                as="li"
                key={item}
                delay={i * 60}
                className="flex items-start gap-4 py-4"
              >
                <span className="mt-0.5 font-mono text-[12px] tabular-nums text-steel/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] leading-relaxed text-white/62">{item}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* CTA — the honest number comes from the customer's own metadata */}
      <Section alt>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <h2 className="text-balance text-[clamp(1.5rem,3.2vw,2.2rem)] font-medium tracking-tight text-foreground">
                Run the same counterfactual on your own metadata
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/62">
                Shadow mode replays your real scheduler behavior the way this benchmark replays the
                Azure trace — read-only, with no execution impact.
              </p>
            </Reveal>
            <Reveal delay={180} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTAButton to="/contact" variant="primary" withArrow>
                Run a shadow-mode analysis
              </CTAButton>
              <CTAButton to="/shadow-audit" variant="secondary">
                How shadow audit works
              </CTAButton>
            </Reveal>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
