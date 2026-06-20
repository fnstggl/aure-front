import type { CompanyResearchData } from "@/components/research/types";

/* ============================================================================
   COMPANY RESEARCH TEMPLATE — copy this file to build a new outbound page.
   ----------------------------------------------------------------------------
   HOW TO USE
     1. Duplicate this file → src/data/companies/<company>.tsx
     2. Rename the export (e.g. `acmeResearch`) and fill every field below.
        Everything you see on the page comes from this object — there is no
        layout to touch.
     3. Add a thin page wrapper → src/pages/research/<Company>Research.tsx
        (copy src/pages/research/FireworksResearch.tsx).
     4. Register routes in src/App.tsx and add the path to PRIVATE_ROUTES in
        src/lib/seo.ts (keeps it noindex + out of the sitemap), plus a
        Disallow line in public/robots.txt if you change the campaign suffix.

   TONE — keep it a research memo, not marketing:
     • Say "hypothesis", "we would test", "we would validate", "based on
       public information". Never "we will save you X%".
     • Make the reader feel a founder actually studied their infrastructure.
     • Replace the [BRACKETED] placeholders below with real, researched content.
   ============================================================================ */

export const templateResearch: CompanyResearchData = {
  slug: "company-template",
  company: "[Company Name]",
  docRef: "AUR-RES-0000-XX",
  preparedOn: "2026-01-01", // YYYY-MM-DD

  /* Hero / cover. Either provide a pre-rendered `coverImage` (title baked in)
     or let the cover be recreated from `gradient` + `logo`. */
  hero: {
    eyebrow: "Economic Analysis for",
    // Replace with the company's real <svg> mark or <img src="/…" alt="" />.
    logo: (
      <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden>
        <rect x="6" y="6" width="24" height="24" rx="3" />
      </svg>
    ),
    // coverImage: "/research/<company>-cover.png",
    gradient: {
      base: "hsl(225 28% 9%)",
      blooms: [
        { color: "hsl(220 24% 60% / 0.30)", at: "22% 68%", size: "60% 55%" },
        { color: "hsl(222 40% 34% / 0.55)", at: "46% 44%", size: "78% 78%" },
        { color: "hsl(220 18% 70% / 0.18)", at: "84% 36%", size: "52% 64%" },
      ],
    },
  },

  /* 1 · Private memo header */
  memo: {
    preparedFor: "Prepared for [Company Name]",
    title: "Aurelius infrastructure hypothesis",
    note: "Private research page · Not indexed · Based on public information and stated assumptions",
  },

  /* 2 · Opening thesis — personalize heavily. */
  thesis: {
    eyebrow: "Opening thesis",
    body: (
      <>
        <p>
          I looked at [Company]&rsquo;s business, workload profile, and infrastructure model. My
          hypothesis is that economic inefficiencies may exist not because the fleet is poorly
          utilized, but because utilization alone is an incomplete objective.
        </p>
        <p>
          Aurelius tests whether flexible workloads can be shifted across time, regions, and
          backends while preserving SLA constraints. [Add 1–2 sentences of company-specific
          reasoning — a public datapoint, a workload, a stated architecture choice.]
        </p>
      </>
    ),
    // Optional — public signals that informed the read. Delete if unused.
    basis: [
      { label: "Serving model", value: "[e.g. serverless · dedicated]" },
      { label: "Stated scale", value: "[public figure]" },
      { label: "Deferrable surface", value: "[batch · eval · fine-tune]" },
    ],
  },

  /* 3 · Why this may matter — 3–4 insight cards. */
  insights: {
    eyebrow: "Why this may matter for [Company]",
    title: "[A specific, non-generic framing of the opportunity]",
    intro: "Each is a hypothesis from public information, written to be argued with.",
    cards: [
      {
        title: "[Latency-critical inference likely requires headroom]",
        hypothesis: "[Why this may be true for this company, and why it matters economically.]",
        test: "[What Aurelius would test, and the scheduler metadata that would settle it.]",
      },
      {
        title: "[Flexible workloads may exist behind the critical path]",
        hypothesis: "[…]",
        test: "[…]",
      },
      {
        title: "[Regional/time-based cost variance may create scheduling opportunities]",
        hypothesis: "[…]",
        test: "[…]",
      },
      {
        title: "[Current utilization targets may hide economic inefficiency]",
        hypothesis: "[…]",
        test: "[…]",
      },
    ],
  },

  /* 4 · Workload map — classify each class: sla-critical | flexible | shiftable. */
  workloadMap: {
    eyebrow: "Workload map",
    title: "What is fixed, what is flexible, and what could move",
    intro: "A first-pass classification — the backtest would replace it with the real job mix.",
    classes: [
      { name: "Real-time inference", kind: "sla-critical", note: "[why]" },
      { name: "Batch inference", kind: "shiftable", note: "[why]" },
      { name: "Evaluations", kind: "shiftable", note: "[why]" },
      { name: "Fine-tuning", kind: "flexible", note: "[why]" },
      { name: "Internal data processing", kind: "shiftable", note: "[why]" },
      { name: "Maintenance / background jobs", kind: "flexible", note: "[why]" },
    ],
    note: "White = critical path. Brass = movable across time, region, or backend.",
  },

  /* 5 · Where savings may exist — frame each as a hypothesis. */
  savings: {
    eyebrow: "Where savings may exist",
    title: "Mechanisms to validate — not claims",
    intro: "Each is a lever the backtest would confirm on your logs or rule out.",
    items: [
      {
        title: "Delay-tolerant work shifted away from expensive periods",
        hypothesis: "[…]",
        validate: "[the metadata signal that confirms or denies it]",
      },
      {
        title: "Region-aware routing for flexible jobs",
        hypothesis: "[…]",
        validate: "[…]",
      },
      {
        title: "Queue-aware admission control to reduce low-value GPU burn",
        hypothesis: "[…]",
        validate: "[…]",
      },
      {
        title: "Economic scheduling instead of pure utilization maximization",
        hypothesis: "[…]",
        validate: "[…]",
      },
    ],
  },

  /* 6 · Backtest plan — usually unchanged across companies. */
  backtest: {
    eyebrow: "The backtest",
    title: "A no-cost historical backtest, entirely in shadow",
    intro: "Everything above can be tested on data you already have, without touching production.",
    steps: [
      { title: "Export 7–30 days of scheduler metadata", detail: "Timing, resources, SLA class, region, deadlines, outcomes. No payloads." },
      { title: "Replay historical decisions in shadow mode", detail: "Reconstruct what the scheduler did, decision by decision. Nothing re-executed." },
      { title: "Compare current policy vs Aurelius policy", detail: "Aurelius proposes economic decisions under your hard constraints; we diff the two." },
      { title: "Deliver a savings / SLA report", detail: "Goodput per dollar, GPU-hours, and proof every constraint held." },
    ],
    trust: ["No production changes", "No model payloads", "Metadata only", "Runs against historical logs"],
  },

  /* 7 · Metrics — usually unchanged. */
  metrics: {
    eyebrow: "What we would report",
    title: "What the report would put a number on",
    items: [
      { name: "SLA-safe goodput per dollar", detail: "Useful tokens within SLA, per dollar of GPU spend.", unit: "tok / $" },
      { name: "GPU-hours consumed", detail: "Total and by workload class, baseline vs counterfactual.", unit: "GPU·h" },
      { name: "Queue / wait time", detail: "Time to admission and time in queue.", unit: "ms" },
      { name: "SLA violation rate", detail: "Latency/throughput breaches under each policy.", unit: "%" },
      { name: "Regional cost exposure", detail: "Flexible GPU-hours landing in higher-cost region-hours.", unit: "$" },
      { name: "Migration / deferral impact", detail: "Net effect of every shift and deferral proposed.", unit: "Δ$" },
    ],
  },

  /* 8 · Reference benchmark — PLACEHOLDER values. Keep clearly a reference. */
  benchmark: {
    eyebrow: "Reference benchmark",
    title: "What the same approach did on public traces",
    intro: "A reference result, not a prediction.",
    stats: [
      { value: "+XX%", label: "SLA-safe goodput / $" },
      { value: "−YY%", label: "GPU-hours" },
    ],
    source: "Public LLM inference traces",
    disclaimer:
      "A reference result on public traces — not a guarantee or forecast for [Company], which only a backtest on your own scheduler metadata can establish.",
  },

  /* 9 · Assumptions table. */
  assumptions: {
    eyebrow: "Assumptions",
    title: "Every assumption this rests on — and how we'd check it",
    rows: [
      { assumption: "Some jobs are delay-tolerant", why: "[why it may be true]", validate: "[how we'd validate]" },
      { assumption: "Costs vary by time/region/backend", why: "[…]", validate: "[…]" },
      { assumption: "SLA headroom exists in parts of the workload", why: "[…]", validate: "[…]" },
      { assumption: "Current scheduling optimizes utilization more than economic outcome", why: "[…]", validate: "[…]" },
    ],
  },

  /* 10 · CTA — soft, research-oriented. */
  cta: {
    title: "Interested in seeing whether this is real on your logs?",
    body: "Everything here is a hypothesis from public information. The only way to know is to replay your own scheduler metadata — at no cost, in shadow, against historical logs.",
    primary: { label: "Run a no-cost historical backtest", href: "/contact" },
    secondary: { label: "Reply with corrections to these assumptions", href: "/contact" },
    footnote: "If a number here is wrong, tell us — the assumptions are meant to be argued with.",
  },
};
