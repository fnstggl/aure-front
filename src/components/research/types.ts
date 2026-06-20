import type { ReactNode } from "react";

/* ============================================================================
   Company research memo — data model
   ----------------------------------------------------------------------------
   A single private outbound page (/{company-slug}-FH37X) is generated entirely
   from ONE `CompanyResearchData` object. To produce a new company page you only
   author a new config — no layout code changes. See
   `src/data/companies/fireworks.tsx` for a fully-worked, genuinely-researched
   example and `src/data/companies/_TEMPLATE.tsx` for a blank to copy.

   Rich-text fields accept `ReactNode` so a config (authored as .tsx) can add
   light emphasis (<strong>, <span className="text-accent-gold">…). Keep copy in
   the research register: "hypothesis", "we would test", "we would validate",
   "based on public information". Never promise a specific saving.
   ============================================================================ */

/** Where a workload class sits relative to the latency-critical path. */
export type WorkloadKind = "sla-critical" | "flexible" | "shiftable";

export interface WorkloadClass {
  /** e.g. "Real-time inference". */
  name: string;
  /** Classification that drives the visual treatment + legend. */
  kind: WorkloadKind;
  /** One short clause on why it sits where it does (company-specific). */
  note?: string;
}

/** An insight card — "Why this may matter for [Company]". */
export interface InsightCard {
  /** Short, specific, infrastructure-literate title. */
  title: string;
  /** The hypothesis itself — what may be true and why. */
  hypothesis: ReactNode;
  /** What Aurelius would actually test to confirm / reject it. */
  test: ReactNode;
}

/** A specific savings hypothesis — framed to validate, never to claim. */
export interface SavingsHypothesis {
  /** Short mechanism label, e.g. "Delay-tolerant work shifted off-peak". */
  title: string;
  /** Why the economic opportunity may exist. */
  hypothesis: ReactNode;
  /** The metadata signal that would confirm or deny it. */
  validate: ReactNode;
}

/** A step in the no-cost historical backtest. */
export interface BacktestStep {
  title: string;
  detail: ReactNode;
}

/** A metric Aurelius would report back. */
export interface MetricRow {
  /** Metric name, e.g. "SLA-safe goodput per dollar". */
  name: string;
  /** One clause on what it captures. */
  detail: string;
  /** Optional unit / mono tag, e.g. "$ / 1M tok". */
  unit?: string;
}

/** A reference-benchmark stat. Clearly a reference result, not a guarantee. */
export interface BenchmarkStat {
  /** e.g. "+XX%" or a concrete public figure. */
  value: string;
  /** e.g. "SLA-safe goodput / $". */
  label: string;
}

/** A row in the assumptions table. */
export interface AssumptionRow {
  assumption: string;
  why: ReactNode;
  validate: ReactNode;
}

/** Optional "what informed this" line item shown under the thesis. */
export interface SourceNote {
  label: string;
  value: string;
}

export interface CompanyResearchData {
  /* --- Identity ----------------------------------------------------------- */
  /** URL slug, e.g. "fireworks-ai" → /fireworks-ai-FH37X. */
  slug: string;
  /** Display name, e.g. "Fireworks AI". */
  company: string;
  /** Internal document reference shown in the memo header, e.g. "AUR-2406-FW". */
  docRef: string;
  /** ISO date the memo was prepared (YYYY-MM-DD). */
  preparedOn: string;

  /* --- Hero / cover ------------------------------------------------------- */
  hero: {
    /** Small line above the title. Defaults to "Economic Analysis for". */
    eyebrow?: string;
    /** Company logo node (inline SVG preferred) shown in the cover + header. */
    logo: ReactNode;
    /**
     * Optional pre-rendered full-bleed cover image (text already baked in). If
     * set, it is shown edge-to-edge and the structural title overlay is skipped.
     * If omitted, the cover is recreated in CSS from `gradient` below — fully
     * data-driven and reusable, no per-company art required.
     */
    coverImage?: string;
    /** Tailwind/CSS color stops for the recreated cover gradient. */
    gradient?: {
      /** Base field color (deep). */
      base: string;
      /** Layered radial blooms (CSS color + position). */
      blooms: { color: string; at: string; size?: string }[];
    };
  };

  /* --- 1. Private memo header --------------------------------------------- */
  memo: {
    /** "Prepared for [Company]". */
    preparedFor: string;
    /** "Aurelius infrastructure hypothesis". */
    title: string;
    /** Small note: "Private research page · Not indexed · …". */
    note: string;
  };

  /* --- 2. Opening thesis -------------------------------------------------- */
  thesis: {
    eyebrow?: string;
    /** The personalized opening paragraph(s). */
    body: ReactNode;
    /** Optional "what informed this read" list (public sources, observations). */
    basis?: SourceNote[];
  };

  /* --- 3. Why this may matter for [Company] ------------------------------- */
  insights: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    cards: InsightCard[];
  };

  /* --- 4. Workload map ---------------------------------------------------- */
  workloadMap: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    classes: WorkloadClass[];
    /** Optional caption under the map. */
    note?: ReactNode;
  };

  /* --- 5. Where savings may exist ----------------------------------------- */
  savings: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    items: SavingsHypothesis[];
  };

  /* --- 6. Backtest plan --------------------------------------------------- */
  backtest: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    steps: BacktestStep[];
    /** Trust guarantees ("No production changes", "Metadata only", …). */
    trust: string[];
  };

  /* --- 7. Metrics --------------------------------------------------------- */
  metrics: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    items: MetricRow[];
  };

  /* --- 8. Reference benchmark --------------------------------------------- */
  benchmark: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    stats: BenchmarkStat[];
    /** e.g. "Public LLM inference traces". */
    source: string;
    /** Makes clear this is a reference result, not a company guarantee. */
    disclaimer: string;
  };

  /* --- 9. Assumptions ----------------------------------------------------- */
  assumptions: {
    eyebrow?: string;
    title: string;
    intro?: ReactNode;
    rows: AssumptionRow[];
  };

  /* --- 10. CTA ------------------------------------------------------------ */
  cta: {
    title: ReactNode;
    body?: ReactNode;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
    /** Small reassurance under the buttons. */
    footnote?: ReactNode;
  };
}
