import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Container, Reveal, CTAButton } from "@/components/site/primitives";
import {
  MemoEyebrow,
  MemoSectionHeader,
  MemoSection,
  FieldLabel,
  MetaRow,
  TrustChip,
} from "./memo-primitives";
import { WorkloadMap } from "./WorkloadMap";
import type { CompanyResearchData } from "./types";

/* ============================================================================
   CompanyResearch — the reusable private research-memo template.

   Renders an entire personalized outbound page from ONE `CompanyResearchData`
   object. Composition only: every word, number, logo, and accent comes from the
   config (see `src/data/companies/`). To make a page for a new company, author a
   config and a thin page wrapper — never edit this file.

   The page deliberately does NOT use the public <Layout> (site nav + footer):
   it carries its own minimal, link-free chrome so it reads as a confidential
   internal artifact and is never wired into public navigation.
   ============================================================================ */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** Neutral steel cover gradient used when a config omits `hero.gradient`. */
const DEFAULT_GRADIENT = {
  base: "hsl(225 28% 9%)",
  blooms: [
    { color: "hsl(220 24% 60% / 0.30)", at: "22% 68%", size: "60% 55%" },
    { color: "hsl(222 40% 34% / 0.55)", at: "46% 44%", size: "78% 78%" },
    { color: "hsl(220 18% 70% / 0.18)", at: "84% 36%", size: "52% 64%" },
  ],
};

/* ------------------------------------------------------------------ */
/* Minimal private chrome (no links into the public site)             */
/* ------------------------------------------------------------------ */

function PrivateHeader({ docRef }: { docRef: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 glass-nav">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Logo is intentionally not a link — this page stands alone. */}
          <img src="/aure_logo.png" alt="Aurelius" className="h-4 w-auto" />
          <span className="hidden h-3.5 w-px bg-border-strong sm:block" aria-hidden />
          <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40 sm:block">
            Private research
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
          <span className="h-1 w-1 rounded-full bg-accent-gold/80" aria-hidden />
          <span>Confidential</span>
          <span className="hidden text-white/20 sm:inline">·</span>
          <span className="hidden tabular-nums sm:inline">{docRef}</span>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero cover — recreates the report cover page from config            */
/* ------------------------------------------------------------------ */

function HeroCover({ data }: { data: CompanyResearchData }) {
  const { hero, company } = data;
  const eyebrow = hero.eyebrow ?? "Economic Analysis for";

  // If a pre-rendered cover image is supplied, the title is already baked in —
  // show it edge-to-edge and skip the structural overlay.
  if (hero.coverImage) {
    return (
      <section className="relative isolate w-full overflow-hidden pt-14">
        <img
          src={hero.coverImage}
          alt={`Economic analysis for ${company} — research by Aurelius`}
          className="block w-full"
        />
      </section>
    );
  }

  const gradient = hero.gradient ?? DEFAULT_GRADIENT;
  const field = [
    ...gradient.blooms.map(
      (b) => `radial-gradient(${b.size ?? "60% 60%"} at ${b.at}, ${b.color}, transparent 72%)`,
    ),
    gradient.base,
  ].join(", ");

  return (
    <section className="relative isolate flex min-h-[72vh] w-full flex-col overflow-hidden pt-14 md:min-h-[80vh]">
      <div className="absolute inset-0" style={{ background: field }} aria-hidden />
      <div
        className="research-grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        aria-hidden
      />
      {/* Subtle scrim so overlaid text stays readable on the gradient. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 95% at 50% 42%, transparent 38%, hsl(0 0% 2% / 0.58) 100%)",
        }}
        aria-hidden
      />

      <Container className="relative flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
          <Reveal>
            <h1 className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-balance text-[clamp(1.85rem,5vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-white">
              <span className="text-white/92">{eyebrow}</span>
              <span className="inline-flex items-center gap-3 whitespace-nowrap">
                <span
                  className="inline-flex items-center [&_img]:h-[0.74em] [&_img]:w-auto [&_svg]:h-[0.74em] [&_svg]:w-auto"
                  aria-hidden
                >
                  {hero.logo}
                </span>
                <span>{company}</span>
              </span>
            </h1>
          </Reveal>
        </div>

        <Reveal delay={160} className="relative pb-12 text-center">
          <div className="inline-flex items-center gap-2.5 text-[13px] tracking-tight text-white/72">
            <span>Research by</span>
            <img src="/aure_logo.png" alt="Aurelius" className="h-4 w-auto opacity-90" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 1 · Private memo header / colophon                                  */
/* ------------------------------------------------------------------ */

function MemoHeaderBlock({ data }: { data: CompanyResearchData }) {
  const { memo } = data;
  return (
    <MemoSection className="!border-t-0 pt-12 md:pt-16 lg:pt-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
          <Reveal>
            <MemoEyebrow>Confidential infrastructure memo</MemoEyebrow>
            <h2 className="mt-6 text-balance text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.02em] text-foreground">
              {memo.preparedFor}
            </h2>
            <p className="mt-3 text-[clamp(1.05rem,2.2vw,1.4rem)] font-medium tracking-tight text-white/55">
              {memo.title}
            </p>
            <p className="mt-6 max-w-xl text-[12.5px] leading-relaxed text-white/40">{memo.note}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-lg border border-border bg-card p-5">
              <FieldLabel tone="gold">Document</FieldLabel>
              <div className="mt-4">
                <MetaRow k="Reference" v={data.docRef} />
                <MetaRow k="Prepared" v={formatDate(data.preparedOn)} />
                <MetaRow k="Prepared by" v="Aurelius" />
                <MetaRow
                  k="Classification"
                  v={<span className="text-accent-gold">Private · unlisted</span>}
                />
                <MetaRow k="Basis" v="Public information" />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · Opening thesis                                                  */
/* ------------------------------------------------------------------ */

function ThesisSection({ data }: { data: CompanyResearchData }) {
  const { thesis } = data;
  return (
    <MemoSection id="thesis" alt grain>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          <Reveal>
            <MemoEyebrow index="01">{thesis.eyebrow ?? "Opening thesis"}</MemoEyebrow>
            <div className="mt-7 max-w-2xl space-y-5 text-pretty text-[clamp(1.05rem,2vw,1.3rem)] font-light leading-[1.55] text-white/82">
              {thesis.body}
            </div>
          </Reveal>

          {thesis.basis && (
            <Reveal delay={120}>
              <div className="rounded-lg border border-border bg-card/60 p-5">
                <FieldLabel tone="gold">What informed this read</FieldLabel>
                <div className="mt-4">
                  {thesis.basis.map((b) => (
                    <MetaRow key={b.label} k={b.label} v={b.value} />
                  ))}
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-white/32">
                  Public / stated figures, point-in-time. Corrections welcome.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · Why this may matter — insight cards                             */
/* ------------------------------------------------------------------ */

function InsightsSection({ data }: { data: CompanyResearchData }) {
  const { insights, company } = data;
  return (
    <MemoSection id="why">
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="02"
            eyebrow={insights.eyebrow ?? `Why this may matter for ${company}`}
            title={insights.title}
            intro={insights.intro}
          />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
          {insights.cards.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 90} className="flex flex-col bg-card p-6 lg:p-7">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[12px] tabular-nums text-accent-gold/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[16.5px] font-medium leading-snug tracking-tight text-foreground">
                  {c.title}
                </h3>
              </div>
              <div className="mt-5 space-y-2">
                <FieldLabel>Hypothesis</FieldLabel>
                <p className="text-[13.5px] leading-relaxed text-white/64">{c.hypothesis}</p>
              </div>
              <div className="mt-5 space-y-2 border-t border-border pt-5">
                <FieldLabel tone="steel">What Aurelius would test</FieldLabel>
                <p className="text-[13.5px] leading-relaxed text-white/64">{c.test}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · Workload map                                                    */
/* ------------------------------------------------------------------ */

function WorkloadSection({ data }: { data: CompanyResearchData }) {
  const { workloadMap } = data;
  return (
    <MemoSection id="workload-map" alt>
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="03"
            eyebrow={workloadMap.eyebrow ?? "Workload map"}
            title={workloadMap.title}
            intro={workloadMap.intro}
          />
        </Reveal>
        <Reveal delay={120} className="mt-12">
          <WorkloadMap classes={workloadMap.classes} note={workloadMap.note} />
        </Reveal>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · Where savings may exist                                         */
/* ------------------------------------------------------------------ */

function SavingsSection({ data }: { data: CompanyResearchData }) {
  const { savings } = data;
  return (
    <MemoSection id="savings">
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="04"
            eyebrow={savings.eyebrow ?? "Where savings may exist"}
            title={savings.title}
            intro={savings.intro}
          />
        </Reveal>
        <div className="mt-12 overflow-hidden rounded-lg border border-border">
          {savings.items.map((s, i) => (
            <Reveal
              key={s.title}
              delay={i * 60}
              className={cn(
                "grid gap-5 bg-card p-6 md:grid-cols-[1fr_1.45fr] lg:gap-10 lg:p-7",
                i > 0 && "border-t border-border",
              )}
            >
              <div className="flex gap-4">
                <span className="font-mono text-[12px] tabular-nums text-accent-gold/80">
                  H{String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[15.5px] font-medium leading-snug tracking-tight text-foreground">
                  {s.title}
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel>Hypothesis</FieldLabel>
                  <p className="text-[13.5px] leading-relaxed text-white/64">{s.hypothesis}</p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel tone="steel">Validated or invalidated by</FieldLabel>
                  <p className="text-[13px] leading-relaxed text-white/52">{s.validate}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 6 · Backtest plan                                                   */
/* ------------------------------------------------------------------ */

function BacktestSection({ data }: { data: CompanyResearchData }) {
  const { backtest } = data;
  return (
    <MemoSection id="backtest" alt grain>
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="05"
            eyebrow={backtest.eyebrow ?? "The backtest"}
            title={backtest.title}
            intro={backtest.intro}
          />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {backtest.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 80} className="flex flex-col bg-card p-6">
              <div className="font-mono text-[12px] tabular-nums text-accent-gold/80">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-4 text-[15px] font-medium leading-snug tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-white/55">{s.detail}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={130} className="mt-8 flex flex-wrap gap-2.5">
          {backtest.trust.map((t) => (
            <TrustChip key={t}>{t}</TrustChip>
          ))}
        </Reveal>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 7 · Metrics                                                         */
/* ------------------------------------------------------------------ */

function MetricsSection({ data }: { data: CompanyResearchData }) {
  const { metrics } = data;
  return (
    <MemoSection id="metrics">
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="06"
            eyebrow={metrics.eyebrow ?? "What we would report"}
            title={metrics.title}
            intro={metrics.intro}
          />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {metrics.items.map((m, i) => (
            <Reveal key={m.name} delay={(i % 3) * 70} className="flex flex-col bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[14px] font-medium leading-snug tracking-tight text-foreground">
                  {m.name}
                </h3>
                {m.unit && (
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-accent-gold/70">
                    {m.unit}
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-white/50">{m.detail}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 8 · Reference benchmark                                             */
/* ------------------------------------------------------------------ */

function BenchmarkSection({ data }: { data: CompanyResearchData }) {
  const { benchmark } = data;
  return (
    <MemoSection id="benchmark" alt>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <MemoEyebrow index="07" className="justify-center">
              {benchmark.eyebrow ?? "Reference benchmark"}
            </MemoEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 text-balance text-[clamp(1.55rem,3.2vw,2.3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
              {benchmark.title}
            </h2>
          </Reveal>
          {benchmark.intro && (
            <Reveal delay={120}>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
                {benchmark.intro}
              </p>
            </Reveal>
          )}
        </div>

        <Reveal delay={140} className="mx-auto mt-12 max-w-3xl">
          <div
            className={cn(
              "grid gap-px overflow-hidden rounded-lg border border-border bg-border",
              benchmark.stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
            )}
          >
            {benchmark.stats.map((s) => (
              <div key={s.label} className="bg-card px-6 py-8 text-center">
                <div className="text-[clamp(2.2rem,6vw,3.1rem)] font-medium leading-none tracking-[-0.03em] text-foreground">
                  {s.value}
                </div>
                <div className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col items-center gap-2 text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-gold/75">
              {benchmark.source}
            </span>
            <p className="max-w-xl text-[12px] leading-relaxed text-white/38">
              {benchmark.disclaimer}
            </p>
          </div>
        </Reveal>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 9 · Assumptions table                                               */
/* ------------------------------------------------------------------ */

function AssumptionsSection({ data }: { data: CompanyResearchData }) {
  const { assumptions } = data;
  const cols = "grid-cols-[1.1fr_1.3fr_1.3fr]";
  return (
    <MemoSection id="assumptions">
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="08"
            eyebrow={assumptions.eyebrow ?? "Assumptions"}
            title={assumptions.title}
            intro={assumptions.intro}
          />
        </Reveal>

        <Reveal delay={120} className="mt-12">
          {/* Desktop: a real 3-column ledger table */}
          <div className="hidden overflow-hidden rounded-lg border border-border md:block">
            <div
              className={cn(
                "grid bg-white/[0.015] font-mono text-[10px] uppercase tracking-[0.16em] text-white/45",
                cols,
              )}
            >
              <div className="px-5 py-3">Assumption</div>
              <div className="border-l border-border px-5 py-3">Why it may be true</div>
              <div className="border-l border-border px-5 py-3">How we would validate it</div>
            </div>
            {assumptions.rows.map((r, i) => (
              <div key={i} className={cn("grid border-t border-border", cols)}>
                <div className="px-5 py-5 text-[13.5px] font-medium leading-snug text-foreground">
                  {r.assumption}
                </div>
                <div className="border-l border-border px-5 py-5 text-[13px] leading-relaxed text-white/58">
                  {r.why}
                </div>
                <div className="border-l border-border px-5 py-5 text-[13px] leading-relaxed text-white/58">
                  {r.validate}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: stacked cards */}
          <div className="overflow-hidden rounded-lg border border-border md:hidden">
            {assumptions.rows.map((r, i) => (
              <div key={i} className={cn("bg-card p-5", i > 0 && "border-t border-border")}>
                <h3 className="text-[14.5px] font-medium leading-snug text-foreground">
                  {r.assumption}
                </h3>
                <div className="mt-4 space-y-1.5">
                  <FieldLabel>Why it may be true</FieldLabel>
                  <p className="text-[13px] leading-relaxed text-white/58">{r.why}</p>
                </div>
                <div className="mt-4 space-y-1.5">
                  <FieldLabel tone="steel">How we would validate it</FieldLabel>
                  <p className="text-[13px] leading-relaxed text-white/58">{r.validate}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 10 · CTA                                                            */
/* ------------------------------------------------------------------ */

/** Picks <Link>-style internal nav vs <a> for mailto/external links. */
function MemoCta({
  link,
  variant,
  withArrow,
}: {
  link: { label: string; href: string };
  variant: "primary" | "secondary";
  withArrow?: boolean;
}) {
  const internal = link.href.startsWith("/");
  return (
    <CTAButton
      to={internal ? link.href : undefined}
      href={internal ? undefined : link.href}
      variant={variant}
      withArrow={withArrow}
    >
      {link.label}
    </CTAButton>
  );
}

function CtaSection({ data }: { data: CompanyResearchData }) {
  const { cta } = data;
  return (
    <MemoSection id="cta" alt grain>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <MemoEyebrow index="09" className="justify-center">
              Next step
            </MemoEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 text-balance text-[clamp(1.6rem,3.4vw,2.5rem)] font-medium leading-tight tracking-[-0.02em] text-foreground">
              {cta.title}
            </h2>
          </Reveal>
          {cta.body && (
            <Reveal delay={130}>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/62">
                {cta.body}
              </p>
            </Reveal>
          )}
          <Reveal delay={190}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MemoCta link={cta.primary} variant="primary" withArrow />
              {cta.secondary && <MemoCta link={cta.secondary} variant="secondary" />}
            </div>
          </Reveal>
          {cta.footnote && (
            <Reveal delay={240}>
              <p className="mx-auto mt-8 max-w-md font-mono text-[11px] leading-relaxed text-white/30">
                {cta.footnote}
              </p>
            </Reveal>
          )}
        </div>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* Private footer — self-contained, no links into the public site     */
/* ------------------------------------------------------------------ */

function PrivateFooter({ data }: { data: CompanyResearchData }) {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/aure_logo.png" alt="Aurelius" className="h-4 w-auto opacity-80" />
            <span className="h-3 w-px bg-border-strong" aria-hidden />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/35">
              Private research · {data.company}
            </span>
          </div>
          <p className="font-mono text-[10.5px] tracking-tight text-white/26">{data.memo.note}</p>
        </div>
        <p className="mt-6 max-w-2xl text-[11px] leading-relaxed text-white/24">
          Prepared for {data.company} from public information and stated assumptions. This is a
          hypothesis, not a claim of savings, and does not imply an existing relationship between
          Aurelius and {data.company}. © {new Date().getFullYear()} Aurelius.
        </p>
      </Container>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function CompanyResearch({ data }: { data: CompanyResearchData }) {
  // Long memo reached by direct link — always open at the cover.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data.slug]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <PrivateHeader docRef={data.docRef} />
      <HeroCover data={data} />
      <main>
        <MemoHeaderBlock data={data} />
        <ThesisSection data={data} />
        <InsightsSection data={data} />
        <WorkloadSection data={data} />
        <SavingsSection data={data} />
        <BacktestSection data={data} />
        <MetricsSection data={data} />
        <BenchmarkSection data={data} />
        <AssumptionsSection data={data} />
        <CtaSection data={data} />
      </main>
      <PrivateFooter data={data} />
    </div>
  );
}
