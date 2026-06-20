import type { CompanyResearchData } from "@/components/research/types";

/* ============================================================================
   Fireworks AI — completed research memo (concise executive version).
   Rendered at /company-template-FH37X and /fireworks-ai-FH37X.

   Genuinely researched from Fireworks' public material (blog, docs, Series C)
   and credible third-party benchmarks. Point-in-time as of June 2026; the memo
   invites correction. Framed as hypotheses to validate — never claims.
   To build a different company, copy `_TEMPLATE.tsx`.
   ============================================================================ */

/* Inline "spark" mark — used only by the structural-cover fallback (the real
   cover ships as /research_fireworksai.png with text baked in). Swap for the
   company's mark when reusing. */
function sparkle(cx: number, cy: number, r: number, inner = 0.32): string {
  const i = r * inner;
  return [
    `M${cx} ${cy - r}`, `L${cx + i} ${cy - i}`, `L${cx + r} ${cy}`, `L${cx + i} ${cy + i}`,
    `L${cx} ${cy + r}`, `L${cx - i} ${cy + i}`, `L${cx - r} ${cy}`, `L${cx - i} ${cy - i}`, "Z",
  ].join(" ");
}
const fireworksMark = (
  <svg viewBox="0 0 36 36" fill="currentColor" role="img" aria-label="Fireworks AI">
    <path d={sparkle(14, 19, 13)} />
    <path d={sparkle(28, 8, 6.5)} />
  </svg>
);

export const fireworksResearch: CompanyResearchData = {
  slug: "fireworks-ai",
  company: "Fireworks AI",
  docRef: "AUR-RES-2606-FW",
  preparedOn: "2026-06-20",
  disclaimer:
    "Based on public information and stated assumptions. Not a claim of savings; does not imply an existing relationship with Fireworks AI. Corrections welcome.",

  /* Hero — pre-rendered cover (text baked in, 90° sharp). Replace the file at
     public/research_fireworksai.png to swap the art; the path stays the same.
     If the image is missing, the gradient + logo fallback renders instead. */
  hero: {
    eyebrow: "Economic Analysis for",
    logo: fireworksMark,
    coverImage: "/research_fireworksai.png",
    gradient: {
      base: "hsl(224 56% 11%)",
      blooms: [
        { color: "hsl(210 50% 72% / 0.42)", at: "16% 70%", size: "55% 55%" },
        { color: "hsl(222 75% 44% / 0.55)", at: "44% 46%", size: "82% 82%" },
        { color: "hsl(6 78% 52% / 0.50)", at: "82% 38%", size: "55% 70%" },
        { color: "hsl(18 85% 56% / 0.34)", at: "92% 72%", size: "46% 52%" },
      ],
    },
  },

  memo: {
    preparedFor: "Prepared for Fireworks AI",
    title: "Aurelius infrastructure hypothesis",
    note: "Private · unlisted · not indexed",
  },

  /* 1 · Thesis — tight. */
  thesis: {
    eyebrow: "Thesis",
    body: (
      <>
        <p>
          Fireworks runs its fleet hard — FireAttention, ~100% utilization stated as the ideal, RL
          backfilling production troughs. So the question isn&rsquo;t whether utilization is high.
          It&rsquo;s whether utilization is the right objective.
        </p>
        <p>
          On identical hardware, the cost of a token can swing several-fold with the operating
          point. Utilization can&rsquo;t see that — and that gap is where we&rsquo;d look.
        </p>
      </>
    ),
    signals: [
      { label: "Serverless · on-demand · BYOC" },
      { label: "FireAttention" },
      { label: "Batch < serverless price" },
      { label: "multi-LoRA · RL · eval" },
      { label: "18+ regions · 8 providers" },
      { label: "RL fills production troughs" },
      { label: "4× per-token spread, same 8 GPUs" },
      { label: "No cold starts → warm capacity" },
    ],
  },

  /* 2 · What surprised us. */
  surprise: {
    eyebrow: "What surprised us",
    value: "~4×",
    label: "per-token cost spread on the same hardware",
    body: (
      <>
        Fireworks has shown publicly that the same Llama-70B on the same eight GPUs can cost roughly
        4× more per token when tuned for single-request latency than for volume throughput. The
        biggest opportunity may not be &ldquo;raise utilization.&rdquo; It may be matching each
        workload to the cheapest operating point that still satisfies its SLA.
      </>
    ),
  },

  /* 4 · Hypotheses — conviction-ranked. */
  hypotheses: {
    eyebrow: "Hypotheses",
    title: "Four hypotheses, ranked by conviction",
    intro: "Ranked by how strongly Fireworks' public footprint supports them. The backtest confirms or kills each.",
    cards: [
      {
        conviction: "highest",
        title: "Operating-point mismatch",
        hypothesis:
          "Some pools are pinned to a latency-optimized operating point for traffic that doesn't need it, leaving the marginal token several times more expensive than necessary.",
        matters: "On identical hardware the spread reaches ~4× — the single largest lever.",
        test: "Re-point relaxed-SLA traffic to a volume-optimized point and measure goodput/$ at held SLA.",
        metadata: "serving path · SLA class · realized-vs-budget latency · operating point per pool",
      },
      {
        conviction: "medium",
        title: "Warm headroom for latency guarantees",
        hypothesis:
          "No-cold-start serverless plus multi-minute model loads imply warm replicas held below saturation to absorb bursts.",
        matters: "That headroom reads as healthy utilization but is idle at the margin — flexible work may consume it.",
        test: "Check whether warm-idle capacity tracks real burst arrivals or a worst-case envelope.",
        metadata: "warm-idle GPU-seconds · 503/overload events · TTFT percentiles · replica spin-up",
      },
      {
        conviction: "medium",
        title: "Flexible-workload trough filling",
        hypothesis:
          "Batch, evals, fine-tuning, and RL backfill quiet periods — but possibly on static schedules rather than a forecast of the next interval of demand.",
        matters: "Static backfill leaves the trough unfilled or evicts work mid-flight, wasting spent compute.",
        test: "Compare a forecast-driven admission policy for flexible work against the current rule.",
        metadata: "flexible job start + GPU allocation · real-time demand curve · pre-emption events",
      },
      {
        conviction: "lower",
        title: "Cross-region / provider economic routing",
        hypothesis:
          "Across 18+ regions and 8 providers, deferrable jobs could route to the cheapest admissible region-hour.",
        matters: "Real savings hinge on residency, data locality, egress, and contract pricing — hence lower conviction.",
        test: "Quantify the deferrable share with slack and the cost delta of routing within constraints.",
        metadata: "per-job region · deadline · residency constraints · per-region-hour cost / egress",
      },
    ],
  },

  /* 5 · Workload flexibility matrix. */
  workload: {
    eyebrow: "Workload flexibility",
    title: "What's fixed, what's flexible",
    intro: "How tightly each class is bound to the latency-critical path. The brass columns are where Aurelius looks first.",
    rows: [
      { name: "Real-time inference", tag: "fixed / SLA-critical", latencyBound: "yes", deadlineBound: "no", regionShiftable: "no", economicallySchedulable: "no" },
      { name: "Agents / interactive apps", tag: "mostly fixed", latencyBound: "yes", deadlineBound: "no", regionShiftable: "partial", economicallySchedulable: "partial" },
      { name: "Batch inference", tag: "flexible", latencyBound: "no", deadlineBound: "yes", regionShiftable: "yes", economicallySchedulable: "yes" },
      { name: "Evaluations", tag: "flexible", latencyBound: "no", deadlineBound: "yes", regionShiftable: "yes", economicallySchedulable: "yes" },
      { name: "RL / fine-tuning", tag: "flexible", latencyBound: "no", deadlineBound: "partial", regionShiftable: "yes", economicallySchedulable: "yes" },
      { name: "Internal data processing", tag: "flexible", latencyBound: "no", deadlineBound: "partial", regionShiftable: "yes", economicallySchedulable: "yes" },
    ],
  },

  /* 6 · Backtest. */
  backtest: {
    eyebrow: "The backtest",
    title: "Observed baseline vs economic counterfactual",
    intro: "Run entirely on data Fireworks already has. The backtest confirms or kills each hypothesis.",
    steps: [
      { title: "Export 7–30 days of metadata", detail: "Timing, resources, serving path, SLA class, region, deadlines, outcomes. No payloads." },
      { title: "Replay the current policy", detail: "Reconstruct the scheduler's actual decisions as the observed baseline." },
      { title: "Replay the Aurelius policy", detail: "Economic decisions under the same hard constraints, decision for decision." },
      { title: "Return the report", detail: "Goodput/$, GPU-hours, and proof every SLA held." },
    ],
    trust: ["No production changes", "No model payloads", "Metadata only", "Historical logs"],
  },

  /* 7 · Metrics. */
  metrics: {
    eyebrow: "What we'd report",
    title: "Six numbers, baseline vs counterfactual",
    items: [
      { name: "SLA-safe goodput / $", detail: "The primary objective.", unit: "tok/$" },
      { name: "GPU-hours", detail: "Total and by workload class.", unit: "GPU·h" },
      { name: "Queue / wait time", detail: "Incl. 503 / overload incidence.", unit: "ms" },
      { name: "SLA violation rate", detail: "Must not regress.", unit: "%" },
      { name: "Regional cost exposure", detail: "Flexible hours in costlier regions.", unit: "$" },
      { name: "Migration / deferral impact", detail: "Net effect of each shift.", unit: "Δ$" },
    ],
  },

  /* 8 · Reference benchmark. */
  benchmark: {
    eyebrow: "Reference benchmark",
    title: "What the same approach did on public traces",
    stats: [
      { value: "+42%", label: "SLA-safe goodput / $" },
      { value: "−21%", label: "GPU-hours" },
    ],
    source: "Public LLM inference traces",
    disclaimer:
      "Reference result on public Azure traces under SLA-safe constraints — not a forecast for Fireworks. Only a backtest on your own logs can establish that.",
  },

  /* 9 · Key assumptions. */
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

  /* CTA — confident, assumptive. */
  cta: {
    title: "Quantify it on your fleet",
    body: "Everything above can be tested directly against historical scheduler metadata. We replay 7–30 days of decisions, compare Fireworks' current policy against an economic counterfactual, and return a savings/SLA report — with no production changes and no model payloads.",
    primary: { label: "Run the historical backtest", href: "/contact" },
    secondary: { label: "Send corrections to the assumptions", href: "/contact" },
    trustLine: "Metadata only · Shadow replay · No production changes",
  },
};
