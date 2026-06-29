import type { CompanyResearchData } from "@/components/research/types";

/* ============================================================================
   COMPANY RESEARCH TEMPLATE — copy this file to build a new outbound page.
   ----------------------------------------------------------------------------
   1. Duplicate → src/data/companies/<company>.tsx, rename the export, fill it in.
   2. Add a thin page wrapper → src/pages/research/<Company>Research.tsx
      (copy FireworksResearch.tsx).
   3. Register routes in src/App.tsx + add the path to PRIVATE_ROUTES in
      src/lib/seo.ts (keeps it noindex + out of the sitemap), and a Disallow
      line in public/robots.txt if you change the campaign suffix.

   TONE — concise executive memo, not marketing. Confident, precise, analytical.
   Say "hypothesis", "we'd test", "the backtest confirms or kills it". Never
   "interested in…?", "book a demo", "we can help you save money". Keep total
   copy under ~1,800 words; let the diagrams carry the weight. Replace every
   [BRACKETED] placeholder with real, researched content.
   ============================================================================ */

export const templateResearch: CompanyResearchData = {
  slug: "company-template",
  company: "[Company Name]",
  docRef: "AUR-RES-0000-XX",
  preparedOn: "2026-01-01", // YYYY-MM-DD
  disclaimer:
    "Based on public information and stated assumptions. Not a claim of savings; does not imply an existing relationship. Corrections welcome.",

  hero: {
    eyebrow: "Economic Analysis for",
    // Real company mark, or rely on the structural fallback below.
    logo: (
      <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden>
        <rect x="6" y="6" width="24" height="24" />
      </svg>
    ),
    // Pre-rendered cover (text baked in, 90° sharp). Drop the PNG in /public.
    coverImage: "/research_company.png",
    gradient: {
      base: "hsl(225 28% 9%)",
      blooms: [
        { color: "hsl(220 24% 60% / 0.30)", at: "22% 68%", size: "60% 55%" },
        { color: "hsl(222 40% 34% / 0.55)", at: "46% 44%", size: "78% 78%" },
        { color: "hsl(220 18% 70% / 0.18)", at: "84% 36%", size: "52% 64%" },
      ],
    },
  },

  memo: {
    preparedFor: "Prepared for [Company Name]",
    title: "Aurelius infrastructure hypothesis",
    note: "Private · unlisted · not indexed",
  },

  /* 1 · Thesis — 2 short paragraphs, personalized. */
  thesis: {
    eyebrow: "Thesis",
    body: (
      <>
        <p>[One sharp paragraph: what the company runs, and why utilization may be an incomplete objective.]</p>
        <p>[One sentence tying a public datapoint to the economic gap you'd investigate.]</p>
      </>
    ),
    // Skimmable public-evidence chips.
    signals: [
      { label: "[serving model]" },
      { label: "[inference engine]" },
      { label: "[batch / flexible work]" },
      { label: "[regions / providers]" },
      { label: "[key public datapoint]" },
    ],
  },

  /* 2 · What surprised us — one large number. */
  surprise: {
    eyebrow: "What surprised us",
    value: "~X×",
    label: "[the striking, sourced number — e.g. per-token cost spread]",
    body: <>[Two sentences: the public fact, then the non-obvious economic insight it implies.]</>,
  },

  /* 4 · Hypotheses — 3–4 cards, ranked by conviction (highest first). */
  hypotheses: {
    eyebrow: "Hypotheses",
    title: "[N] hypotheses, ranked by conviction",
    intro: "Ranked by how strongly public evidence supports them. The backtest confirms or kills each.",
    cards: [
      {
        conviction: "highest",
        title: "[Operating-point mismatch, etc.]",
        hypothesis: "[One sentence.]",
        matters: "[Why it matters economically — one line.]",
        test: "[What Aurelius would test — one line.]",
        metadata: "[metadata · needed · to · settle it]",
      },
      {
        conviction: "medium",
        title: "[Warm headroom, etc.]",
        hypothesis: "[…]",
        matters: "[…]",
        test: "[…]",
        metadata: "[…]",
      },
      {
        conviction: "medium",
        title: "[Flexible trough filling, etc.]",
        hypothesis: "[…]",
        matters: "[…]",
        test: "[…]",
        metadata: "[…]",
      },
      {
        conviction: "lower",
        title: "[Cross-region routing, etc.]",
        hypothesis: "[…]",
        matters: "[…]",
        test: "[…]",
        metadata: "[…]",
      },
    ],
  },

  /* 5 · Workload flexibility matrix. yes ✓ | partial • | no — */
  workload: {
    eyebrow: "Workload flexibility",
    title: "What's fixed, what's flexible",
    intro: "How tightly each class is bound to the latency-critical path.",
    rows: [
      { name: "Real-time inference", tag: "fixed / SLA-critical", latencyBound: "yes", deadlineBound: "no", regionShiftable: "no", economicallySchedulable: "no" },
      { name: "Agents / interactive apps", tag: "mostly fixed", latencyBound: "yes", deadlineBound: "no", regionShiftable: "partial", economicallySchedulable: "partial" },
      { name: "Batch inference", tag: "flexible", latencyBound: "no", deadlineBound: "yes", regionShiftable: "yes", economicallySchedulable: "yes" },
      { name: "Evaluations", tag: "flexible", latencyBound: "no", deadlineBound: "yes", regionShiftable: "yes", economicallySchedulable: "yes" },
      { name: "RL / fine-tuning", tag: "flexible", latencyBound: "no", deadlineBound: "partial", regionShiftable: "yes", economicallySchedulable: "yes" },
      { name: "Internal data processing", tag: "flexible", latencyBound: "no", deadlineBound: "partial", regionShiftable: "yes", economicallySchedulable: "yes" },
    ],
  },

  /* 6 · Backtest — usually unchanged across companies. */
  backtest: {
    eyebrow: "The backtest",
    title: "Observed baseline vs economic counterfactual",
    intro: "Run entirely on data you already have. The backtest confirms or kills each hypothesis.",
    steps: [
      { title: "Export 7–30 days of metadata", detail: "Timing, resources, serving path, SLA class, region, deadlines, outcomes. No payloads." },
      { title: "Replay the current policy", detail: "Reconstruct the scheduler's actual decisions as the observed baseline." },
      { title: "Replay the Aurelius policy", detail: "Economic decisions under the same hard constraints, decision for decision." },
      { title: "Return the report", detail: "Goodput/$, GPU-hours, and proof every SLA held." },
    ],
    trust: ["No production changes", "No model payloads", "Metadata only", "Historical logs"],
  },

  /* 7 · Metrics — usually unchanged. */
  metrics: {
    eyebrow: "What we'd report",
    title: "Six numbers, baseline vs counterfactual",
    items: [
      { name: "SLA-safe goodput / $", detail: "The primary objective.", unit: "tok/$" },
      { name: "GPU-hours", detail: "Total and by workload class.", unit: "GPU·h" },
      { name: "Queue / wait time", detail: "Incl. overload incidence.", unit: "ms" },
      { name: "SLA violation rate", detail: "Must not regress.", unit: "%" },
      { name: "Regional cost exposure", detail: "Flexible hours in costlier regions.", unit: "$" },
      { name: "Migration / deferral impact", detail: "Net effect of each shift.", unit: "Δ$" },
    ],
  },

  /* 8 · Reference benchmark — PLACEHOLDER values; keep clearly a reference. */
  benchmark: {
    eyebrow: "Reference benchmark",
    title: "What the same approach did on public traces",
    stats: [
      { value: "+XX%", label: "SLA-safe goodput / $" },
      { value: "−YY%", label: "GPU-hours" },
    ],
    source: "Public LLM inference traces",
    disclaimer: "A reference result on public traces — not a forecast for [Company]. Only a backtest on your own logs can establish that.",
  },

  /* 9 · Key assumptions — 4 cards. */
  assumptions: {
    eyebrow: "Key assumptions",
    title: "Key assumptions to validate",
    items: [
      { assumption: "A meaningful share of work is deadline-tolerant", validate: "Measure deadline-minus-runtime slack across job classes." },
      { assumption: "Marginal cost varies by time, region, provider, or operating point", validate: "Join a per-region-hour-backend cost signal to actual placement." },
      { assumption: "Some requests finish with unused SLA headroom", validate: "Compute realized latency versus SLA budget per request." },
      { assumption: "Current scheduling optimizes utilization/latency more directly than economic output", validate: "Measure goodput-per-dollar dispersion across pools at similar utilization." },
    ],
  },

  /* CTA — confident, assumptive. No question mark. */
  cta: {
    title: "Quantify it on your fleet",
    body: "Everything above can be tested directly against historical scheduler metadata. We replay 7–30 days of decisions, compare the current policy against an economic counterfactual, and return a savings/SLA report — with no production changes and no model payloads.",
    primary: { label: "Run the historical backtest", href: "/contact" },
    secondary: { label: "Send corrections to the assumptions", href: "/contact" },
    trustLine: "Metadata only · Shadow replay · No production changes",
  },
};
