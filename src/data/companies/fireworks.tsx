import type { CompanyResearchData } from "@/components/research/types";

/* ============================================================================
   Fireworks AI — first completed research memo.
   Rendered at /company-template-FH37X (template preview) and /fireworks-ai-FH37X.

   This is GENUINELY researched, not placeholder copy. Every figure below is
   drawn from Fireworks' own public material (blog, docs, Series C announcement)
   or credible third-party benchmarks, and is framed as a hypothesis to validate
   — never as a claim. Point-in-time as of June 2026; Fireworks' model menu,
   pricing, and scale numbers rotate, so the memo invites correction throughout.

   To build a different company: copy `_TEMPLATE.tsx`, not this file.
   ============================================================================ */

/* ------------------------------------------------------------------ */
/* Company logo — a clean geometric "spark" mark for the cover.        */
/* Swap `hero.logo` below for the company's real <svg> or <img>.       */
/* ------------------------------------------------------------------ */

/** Build a four-point sparkle (concave star) path centered at (cx, cy). */
function sparkle(cx: number, cy: number, r: number, inner = 0.32): string {
  const i = r * inner;
  return [
    `M${cx} ${cy - r}`,
    `L${cx + i} ${cy - i}`,
    `L${cx + r} ${cy}`,
    `L${cx + i} ${cy + i}`,
    `L${cx} ${cy + r}`,
    `L${cx - i} ${cy + i}`,
    `L${cx - r} ${cy}`,
    `L${cx - i} ${cy - i}`,
    "Z",
  ].join(" ");
}

/** Inline "fireworks" burst — a large spark plus a small one. */
const fireworksMark = (
  <svg viewBox="0 0 36 36" fill="currentColor" role="img" aria-label="Fireworks AI">
    <path d={sparkle(14, 19, 13)} />
    <path d={sparkle(28, 8, 6.5)} />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Memo configuration                                                  */
/* ------------------------------------------------------------------ */

export const fireworksResearch: CompanyResearchData = {
  slug: "fireworks-ai",
  company: "Fireworks AI",
  docRef: "AUR-RES-2606-FW",
  preparedOn: "2026-06-20",

  /* ---- Hero / cover (recreates the report cover page) ------------- */
  hero: {
    eyebrow: "Economic Analysis for",
    logo: fireworksMark,
    // To use a pre-rendered cover with text already baked in, drop it in
    // /public and set:  coverImage: "/research/fireworks-ai-cover.png",
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

  /* ---- 1 · Private memo header ------------------------------------ */
  memo: {
    preparedFor: "Prepared for Fireworks AI",
    title: "Aurelius infrastructure hypothesis",
    note: "Private research page · Not indexed · Based on public information and stated assumptions",
  },

  /* ---- 2 · Opening thesis ----------------------------------------- */
  thesis: {
    eyebrow: "Opening thesis",
    body: (
      <>
        <p>
          I looked at Fireworks&rsquo; business and infrastructure model — the serverless,
          on-demand, and enterprise/BYOC split; FireAttention&rsquo;s software-utilization moat;
          the Batch API priced at half of serverless; multi-LoRA; and your own public statements
          about scaling RL up when production traffic is low. By every public signal, this is a
          fleet that is already run hard, toward the ~100% utilization Lin Qiao has described as
          the ideal.
        </p>
        <p>
          So my hypothesis is not that the fleet is poorly utilized. It is that utilization is an
          incomplete objective. Fireworks has itself published that the same Llama-70B on the same
          eight GPUs can be roughly 4&times; cheaper per token in a volume-optimized configuration
          than in one tuned for single-request latency. A pool can therefore read &ldquo;healthy&rdquo;
          on a utilization dashboard while its marginal token costs several times more than it needs
          to — purely because it is pinned to a latency operating point. Aurelius tests whether
          flexible work can be shifted across time, regions, and backends, and whether relaxed-SLA
          traffic can move toward cheaper operating points, while preserving every SLA constraint.
        </p>
      </>
    ),
    basis: [
      { label: "Serving model", value: "Serverless · on-demand · enterprise / BYOC" },
      { label: "Stated scale", value: ">10T tokens/day · ~200k req/s" },
      { label: "Inference engine", value: "FireAttention · ~3.5× vLLM/GPU" },
      { label: "Deferrable surface", value: "Batch @ 50% · fine-tune · RL · eval" },
      { label: "Footprint", value: "18+ regions · 8 providers" },
      { label: "Key datapoint", value: "4× per-token spread, same 8 GPUs" },
    ],
  },

  /* ---- 3 · Why this may matter ------------------------------------ */
  insights: {
    eyebrow: "Why this may matter for Fireworks AI",
    title: "Four places where economics and utilization may have quietly diverged",
    intro:
      "Each is a hypothesis from public information — written to be argued with, and designed so a historical backtest could confirm or kill it.",
    cards: [
      {
        title: "Latency SLAs are paid for in warm, idle-at-the-margin headroom",
        hypothesis:
          "Fireworks markets “no cold starts” on serverless, and its own scale-out path loads 800GB+ models in 2–3 minutes per replica — longer under storage contention. A replica cannot be raised from cold inside the time-to-first-token budget of a coding or voice request. To keep the Priority path shedding last (a published 0% shed rate over 14 days, versus 0.082% on Standard), some share of the fleet must sit warm and below saturation, waiting for bursts that may not arrive.",
        test:
          "Whether the warm headroom held for latency actually tracks realized burst arrivals, or is sized to a worst-case envelope — and whether deferrable work can consume that headroom without moving the shed rate or TTFT on the latency paths. Read from warm-idle GPU-seconds set against concurrent 503 events and TTFT percentiles by serving path.",
      },
      {
        title: "A second, deferrable economy already runs on the same GPUs",
        hypothesis:
          "Fireworks co-locates real-time inference with batch (priced at 50% of serverless), fine-tuning, evaluation, and RL, and has described scaling RL up when production traffic is low and down when it is high. That is trough-filling. But if the hand-off is governed by static schedules rather than a forecast of the next interval of inference demand, the fleet either leaves trough capacity on the floor or evicts flexible work mid-flight, wasting the partial compute already spent.",
        test:
          "Whether a forecast-driven admission policy for batch / eval / RL captures more of the diurnal trough than the current rule while never colliding with a latency burst. Validated against job-start timestamps and GPU allocation for flexible work laid over the real-time demand curve on the same pool, plus pre-emption events.",
      },
      {
        title: "18+ regions, 8 providers — and almost certainly non-uniform marginal cost",
        hypothesis:
          "Across a stated 18+ regions and 8 providers (including BYOC), energy price, carbon intensity, spot and committed GPU availability, and egress cost are not uniform at a given hour. Latency-bound traffic is pinned to a region by the caller — but batch, evaluation, distillation-data generation, and fine-tuning, which Fireworks itself lists as Batch API use-cases, treat region and time as free variables.",
        test:
          "How much deferrable volume is currently pinned to the region and hour it was submitted versus routed to the cheapest admissible window inside its deadline, and the realized dollar and gCO₂ delta of economic routing. Read from per-job region, submit time, deadline, and GPU-hours joined to a per-region-hour cost signal.",
      },
      {
        title: "Utilization can read “healthy” while the marginal token is several times too expensive",
        hypothesis:
          "Because the same eight GPUs can be ~4× cheaper per token volume-optimized than latency-optimized, a pool can be near-fully utilized and still serve tokens far from their efficient cost — utilization is blind to which operating point produced it. The objective that actually matters is SLA-safe goodput per dollar, not utilization percent.",
        test:
          "Whether some pools are pinned to a latency-optimized operating point for traffic that does not need it — relaxed-SLA or flexible requests riding a Fast / Priority path — and whether re-pointing that subset to a volume-optimized point preserves SLA while moving cost toward the cheaper end. Validated against per-request serving path and SLA class versus the latency headroom each request actually finished with.",
      },
    ],
  },

  /* ---- 4 · Workload map ------------------------------------------- */
  workloadMap: {
    eyebrow: "Workload map",
    title: "What is fixed, what is flexible, and what could move",
    intro:
      "A first-pass classification of Fireworks' workload classes by how tightly each is bound to the latency-critical path. It is a hypothesis from public information — the backtest would replace it with your actual job mix.",
    classes: [
      {
        name: "Real-time inference",
        kind: "sla-critical",
        note: "Coding (~1k tok/s), voice (~200ms TTFT), chat, agents. Region pinned by the caller.",
      },
      {
        name: "Batch inference",
        kind: "shiftable",
        note: "Batch API at 50% of serverless, up to 24h turnaround — large deadline slack.",
      },
      {
        name: "Evaluations",
        kind: "shiftable",
        note: "Benchmarking and model eval; a named Batch use-case. No user waiting on the result.",
      },
      {
        name: "Fine-tuning & RL",
        kind: "flexible",
        note: "RL already scaled into low-traffic troughs. Deadline-bound, not latency-bound.",
      },
      {
        name: "Internal data processing",
        kind: "shiftable",
        note: "Distillation-data generation, augmentation, ETL — offline by nature.",
      },
      {
        name: "Maintenance / background",
        kind: "flexible",
        note: "Weight loading, cache warming, quantization, autoscale churn.",
      },
    ],
    note: (
      <>
        White sits on the critical path. Brass is movable across time, region, or backend with no
        user waiting — and is where Aurelius looks first. Your logs would re-draw these lanes.
      </>
    ),
  },

  /* ---- 5 · Where savings may exist -------------------------------- */
  savings: {
    eyebrow: "Where savings may exist",
    title: "Four mechanisms, each a hypothesis to validate — not a claim",
    intro:
      "None of these is a promise. Each is a lever the backtest would either confirm on your logs or rule out.",
    items: [
      {
        title: "Delay-tolerant work shifted off the expensive hours",
        hypothesis:
          "Batch, evaluation, distillation-data generation, and RL carry real deadline slack — Batch alone allows up to 24h. If they run when capacity is cheapest inside that deadline rather than when submitted, the marginal cost of those tokens is set by the cheapest admissible window, not by where the job happened to land.",
        validate:
          "The distribution of deadline-minus-runtime slack per job class, and the share of flexible GPU-hours currently landing in higher-cost periods that had a cheaper admissible window.",
      },
      {
        title: "Region-aware routing for jobs that aren't pinned",
        hypothesis:
          "For deferrable work, region is a free variable across the stated 18+ regions and 8 providers. Routing to the cheapest admissible region-hour — subject to residency and data constraints — lowers per-token cost without touching any latency-bound request.",
        validate:
          "Per-job residency constraints and eligible regions, a per-region-hour cost / carbon signal, and the realized delta of economic routing versus submit-region placement.",
      },
      {
        title: "Queue-aware admission control instead of binary load-shedding",
        hypothesis:
          "Today the serverless fleet sheds (503) under saturation and tiers admission by price (Priority sheds last). An economic admission policy could defer or relocate low-value or relaxed-SLA requests before they consume a latency-optimized slot — reducing low-value GPU burn during contention rather than dropping requests outright.",
        validate:
          "503 / overload events and their timing, request value and SLA class by serving path, and the GPU-seconds spent on relaxed-SLA work during contended intervals.",
      },
      {
        title: "Economic scheduling rather than pure utilization maximization",
        hypothesis:
          "With a ~4× per-token spread between operating points on identical hardware, the highest-leverage move may be re-pointing relaxed-SLA traffic from a latency-optimized to a volume-optimized point — lifting SLA-safe goodput per dollar even when utilization is already high.",
        validate:
          "Goodput-per-dollar dispersion across pools at similar utilization, and the latency headroom each request finished with versus its SLA budget.",
      },
    ],
  },

  /* ---- 6 · Backtest plan ------------------------------------------ */
  backtest: {
    eyebrow: "The backtest",
    title: "A no-cost historical backtest, entirely in shadow",
    intro:
      "Everything above can be tested on data Fireworks already has, without touching production. We replay your own scheduler decisions and compare policies offline.",
    steps: [
      {
        title: "Export 7–30 days of scheduler metadata",
        detail:
          "Job timing, resources, serving path, SLA class, region, deadlines, and outcomes. No payloads, no model inputs or outputs.",
      },
      {
        title: "Replay historical decisions in shadow mode",
        detail:
          "We reconstruct what the scheduler actually did, decision by decision, as a baseline — nothing is re-executed.",
      },
      {
        title: "Compare current policy vs Aurelius policy",
        detail:
          "Against the same history, Aurelius proposes economic decisions under your hard constraints, and we diff the two.",
      },
      {
        title: "Deliver a savings / SLA report",
        detail:
          "SLA-safe goodput per dollar, GPU-hours, and proof that every constraint held — with the counterfactual for each decision.",
      },
    ],
    trust: ["No production changes", "No model payloads", "Metadata only", "Runs against historical logs"],
  },

  /* ---- 7 · Metrics ------------------------------------------------ */
  metrics: {
    eyebrow: "What we would report",
    title: "What the report would put a number on",
    intro:
      "Each metric computed on the baseline and on the Aurelius counterfactual, side by side — so nothing rests on a claim.",
    items: [
      {
        name: "SLA-safe goodput per dollar",
        detail: "Useful tokens delivered within SLA, per dollar of GPU spend — the primary objective.",
        unit: "tok / $",
      },
      {
        name: "GPU-hours consumed",
        detail: "Total and by workload class, baseline versus counterfactual.",
        unit: "GPU·h",
      },
      {
        name: "Queue / wait time",
        detail: "Time to admission and time in queue, including 503 / overload incidence.",
        unit: "ms · %",
      },
      {
        name: "SLA violation rate",
        detail: "TTFT and throughput breaches under each policy — which must not regress.",
        unit: "%",
      },
      {
        name: "Regional cost exposure",
        detail: "Share of flexible GPU-hours landing in higher-cost region-hours.",
        unit: "$",
      },
      {
        name: "Migration / deferral impact",
        detail: "Net effect of every shift and deferral the policy proposed.",
        unit: "Δ$ · ΔgCO₂",
      },
    ],
  },

  /* ---- 8 · Reference benchmark ------------------------------------ */
  benchmark: {
    eyebrow: "Reference benchmark",
    title: "What the same approach did on public traces",
    intro:
      "A reference result, not a prediction. It is evidence the method works — the only way to know what holds for Fireworks is to run it on your logs.",
    stats: [
      { value: "+42%", label: "SLA-safe goodput / $" },
      { value: "−21%", label: "GPU-hours" },
    ],
    source: "Public LLM inference traces",
    disclaimer:
      "Measured on public Azure inference traces under SLA-safe constraints. This is a reference result for a different workload — not a guarantee or forecast of Fireworks' savings, which only a backtest on your own scheduler metadata can establish.",
  },

  /* ---- 9 · Assumptions -------------------------------------------- */
  assumptions: {
    eyebrow: "Assumptions",
    title: "Every assumption this rests on — and how we'd check it",
    intro:
      "If any of these is wrong for Fireworks, the matching hypothesis weakens. We would rather find that out on your logs than assume it.",
    rows: [
      {
        assumption: "A meaningful share of jobs are delay-tolerant",
        why: "Batch is priced at 50% with up to 24h turnaround; RL is described as filling low-traffic troughs; eval, distillation, and ETL are offline by nature.",
        validate: "Measure deadline-minus-runtime slack across job classes; quantify the deferrable GPU-hour share.",
      },
      {
        assumption: "Marginal cost varies by time, region, and backend",
        why: "18+ regions across 8 providers (incl. BYOC); energy, spot/committed availability, carbon, and egress differ by region-hour; H100 / H200 / B200 / MI300 differ in $/GPU-hour and tokens/$.",
        validate: "Join a per-region-hour-backend cost signal to actual job placement; measure the realized spread.",
      },
      {
        assumption: "SLA headroom exists in parts of the workload",
        why: "Priority sheds last at a published 0% over 14 days; many requests finish well inside their TTFT budget; not all Fast / Priority traffic genuinely needs that tier.",
        validate: "Compute realized latency versus SLA budget per request; report the headroom distribution by path.",
      },
      {
        assumption: "Cold-start cost forces warm, idle-at-the-margin headroom",
        why: "800GB+ weights load in 2–3 minutes per replica (longer under contention) — a replica cannot be raised from cold inside a TTFT budget during a burst.",
        validate: "Compare replica spin-up time to burst inter-arrival; measure warm-idle GPU-seconds against concurrent 503s.",
      },
      {
        assumption: "Scheduling optimizes utilization / latency more than dollar outcome",
        why: "Fireworks' own datapoint: the same 8 GPUs can be ~4× cheaper per token volume-optimized than latency-optimized; ~100% utilization is stated as the ideal.",
        validate: "Measure goodput-per-dollar dispersion across pools at similar utilization.",
      },
    ],
  },

  /* ---- 10 · CTA --------------------------------------------------- */
  cta: {
    title: "Interested in seeing whether this is real on your logs?",
    body: "Everything here is a hypothesis drawn from public information. The only way to know what holds for Fireworks is to replay your own scheduler metadata — and we'll do it at no cost, in shadow, against historical logs. No production change, no payloads, metadata only.",
    // Both route to the contact channel; swap `secondary.href` to a
    // mailto: if these pages are sent as a direct email thread.
    primary: { label: "Run a no-cost historical backtest", href: "/contact" },
    secondary: { label: "Reply with corrections to these assumptions", href: "/contact" },
    footnote: "If a number here is stale or wrong, tell us — the assumptions table is meant to be argued with.",
  },
};
