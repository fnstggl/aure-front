import type { ReactNode } from "react";

/* ============================================================================
   Company research memo — data model (v2: concise executive memo)
   ----------------------------------------------------------------------------
   A single private outbound page (/{company-slug}-FH37X) is generated from ONE
   `CompanyResearchData` object. To make a new company page, author a new config
   — no layout code changes. See `src/data/companies/fireworks.tsx` for a fully
   worked example and `_TEMPLATE.tsx` for a blank to copy.

   Tone: confident, precise, analytical, founder-led, infrastructure-native.
   Say "hypothesis", "we would test", "the backtest confirms or kills it".
   Never "interested in…?", "book a demo", or "we can help you save money".
   Keep total page copy under ~1,800 words — let the diagrams carry the weight.
   ============================================================================ */

/** Conviction tier for a hypothesis — drives the confidence label + accent. */
export type Conviction = "highest" | "medium" | "lower";

/** Cell state in the workload flexibility matrix. */
export type MatrixFlag = "yes" | "partial" | "no";

/** A workload row in the flexibility matrix (Diagram B). */
export interface WorkloadRow {
  name: string;
  /** Short classification, e.g. "fixed / SLA-critical" or "flexible". */
  tag: string;
  latencyBound: MatrixFlag;
  deadlineBound: MatrixFlag;
  regionShiftable: MatrixFlag;
  economicallySchedulable: MatrixFlag;
}

/** A single concise hypothesis card (≤ ~150 words). */
export interface HypothesisCard {
  conviction: Conviction;
  title: string;
  /** One-sentence hypothesis. */
  hypothesis: ReactNode;
  /** Why it matters economically (one line). */
  matters: ReactNode;
  /** What Aurelius would test (one line). */
  test: ReactNode;
  /** Scheduler metadata needed to settle it (short). */
  metadata: string;
}

/** A backtest step (kept terse). */
export interface BacktestStep {
  title: string;
  detail: ReactNode;
}

/** A metric Aurelius would report. */
export interface MetricRow {
  name: string;
  detail: string;
  unit?: string;
}

/** A reference-benchmark stat. */
export interface BenchmarkStat {
  value: string;
  label: string;
}

/** A key assumption + how it's validated (replaces the long table). */
export interface AssumptionItem {
  assumption: string;
  validate: string;
}

/** A compact public-signal chip shown under the thesis. */
export interface Signal {
  label: string;
}

export interface CompanyResearchData {
  /* --- Identity ----------------------------------------------------------- */
  slug: string;
  company: string;
  docRef: string;
  /** ISO date the memo was prepared (YYYY-MM-DD). */
  preparedOn: string;
  /** The single top-of-page disclaimer (kept quiet; not repeated per section). */
  disclaimer: string;

  /* --- Hero / cover ------------------------------------------------------- */
  hero: {
    eyebrow?: string;
    /** Company logo node (used by the structural-cover fallback). */
    logo: ReactNode;
    /**
     * Pre-rendered full-bleed cover image with the title baked in. Shown
     * edge-to-edge, sharp-cornered. If it fails to load, the structural cover
     * (gradient + logo + title) renders instead, so the page is never broken.
     */
    coverImage?: string;
    /** Colors for the structural-cover fallback. */
    gradient?: {
      base: string;
      blooms: { color: string; at: string; size?: string }[];
    };
  };

  /* --- Memo metadata strip ------------------------------------------------ */
  memo: {
    preparedFor: string;
    title: string;
    /** Short classification note, e.g. "Private · unlisted · not indexed". */
    note: string;
  };

  /* --- Opening thesis ----------------------------------------------------- */
  thesis: {
    eyebrow?: string;
    body: ReactNode;
    /** Skimmable public-signal chips (Fireworks-specific evidence). */
    signals?: Signal[];
  };

  /* --- "What surprised us" highlight card --------------------------------- */
  surprise: {
    eyebrow?: string;
    /** The one large number, e.g. "~4×". */
    value: string;
    /** Its label, e.g. "per-token cost spread on the same hardware". */
    label: string;
    /** Two-sentence explanation + the insight. */
    body: ReactNode;
  };

  /* --- Hypotheses (3–4 cards with conviction) ----------------------------- */
  hypotheses: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    cards: HypothesisCard[];
  };

  /* --- Workload flexibility (Diagram B data) ------------------------------ */
  workload: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    rows: WorkloadRow[];
  };

  /* --- Backtest plan ------------------------------------------------------ */
  backtest: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    steps: BacktestStep[];
    trust: string[];
  };

  /* --- Metrics ------------------------------------------------------------ */
  metrics: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    items: MetricRow[];
  };

  /* --- Reference benchmark ------------------------------------------------ */
  benchmark: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    stats: BenchmarkStat[];
    source: string;
    disclaimer: string;
  };

  /* --- Key assumptions (4 cards) ------------------------------------------ */
  assumptions: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    items: AssumptionItem[];
  };

  /* --- CTA ---------------------------------------------------------------- */
  cta: {
    title: string;
    body: ReactNode;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    /** Trust line, e.g. "Metadata only · Shadow replay · No production changes". */
    trustLine: string;
  };
}
