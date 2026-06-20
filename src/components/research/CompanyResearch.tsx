import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Container, Reveal, CTAButton, Arrow } from "@/components/site/primitives";
import {
  MemoEyebrow,
  MemoSectionHeader,
  MemoSection,
  FieldLabel,
  ConvictionTag,
  SignalChip,
  TrustChip,
} from "./memo-primitives";
import {
  FleetEconomicsMap,
  WorkloadFlexibilityMatrix,
  ObjectiveComparison,
  ShadowReplayFlow,
} from "./diagrams";
import type { CompanyResearchData, Conviction, HypothesisCard } from "./types";

/* ============================================================================
   CompanyResearch — concise executive infrastructure memo (v2).

   Renders an entire personalized outbound page from ONE CompanyResearchData
   object. Composition only — author a config, never edit this file. Tighter,
   more visual, more skimmable than v1: diagrams carry the weight, copy stays
   under ~1,800 words, disclaimers appear once at top and once in the footer.

   The page carries its own minimal, link-free chrome (no public nav/footer) so
   it reads as a confidential internal artifact and is never wired into public
   navigation.
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

function Dot() {
  return <span className="text-white/15" aria-hidden>·</span>;
}

/* ------------------------------------------------------------------ */
/* Minimal private chrome (no links into the public site)             */
/* ------------------------------------------------------------------ */

function PrivateHeader({ docRef }: { docRef: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 glass-nav">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-3">
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
/* Hero cover — pre-rendered image (sharp, full-bleed) with a          */
/* structural gradient fallback so the page is never broken.           */
/* ------------------------------------------------------------------ */

function HeroCover({ data }: { data: CompanyResearchData }) {
  const { hero, company } = data;
  const [imgFailed, setImgFailed] = useState(false);
  const eyebrow = hero.eyebrow ?? "Economic Analysis for";

  if (hero.coverImage && !imgFailed) {
    return (
      <section className="relative isolate w-full overflow-hidden bg-background pt-14">
        {/* 90° sharp edges, full hero width, text baked into the image. */}
        <img
          src={hero.coverImage}
          alt={`Economic analysis for ${company} — research by Aurelius`}
          className="block w-full"
          onError={() => setImgFailed(true)}
        />
      </section>
    );
  }

  // Structural fallback: recreate the cover from config (gradient + logo + title).
  const gradient = hero.gradient ?? DEFAULT_GRADIENT;
  const field = [
    ...gradient.blooms.map(
      (b) => `radial-gradient(${b.size ?? "60% 60%"} at ${b.at}, ${b.color}, transparent 72%)`,
    ),
    gradient.base,
  ].join(", ");

  return (
    <section className="relative isolate flex min-h-[68vh] w-full flex-col overflow-hidden pt-14 md:min-h-[74vh]">
      <div className="absolute inset-0" style={{ background: field }} aria-hidden />
      <div className="research-grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(125% 95% at 50% 42%, transparent 38%, hsl(0 0% 2% / 0.58) 100%)" }}
        aria-hidden
      />
      <Container className="relative flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
          <h1 className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-balance text-[clamp(1.85rem,5vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.025em] text-white">
            <span className="text-white/92">{eyebrow}</span>
            <span className="inline-flex items-center gap-3 whitespace-nowrap">
              <span className="inline-flex items-center [&_img]:h-[0.74em] [&_img]:w-auto [&_svg]:h-[0.74em] [&_svg]:w-auto" aria-hidden>
                {hero.logo}
              </span>
              <span>{company}</span>
            </span>
          </h1>
        </div>
        <div className="relative pb-12 text-center">
          <div className="inline-flex items-center gap-2.5 text-[13px] tracking-tight text-white/72">
            <span>Research by</span>
            <img src="/aure_logo.png" alt="Aurelius" className="h-4 w-auto opacity-90" />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Memo metadata strip + the single top disclaimer                     */
/* ------------------------------------------------------------------ */

function MemoMetaStrip({ data }: { data: CompanyResearchData }) {
  const { memo } = data;
  return (
    <section className="border-b border-border bg-background-alt">
      <Container className="py-8 md:py-9">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <MemoEyebrow>Confidential infrastructure memo</MemoEyebrow>
            <h1 className="mt-4 text-[clamp(1.45rem,3.2vw,2.1rem)] font-medium leading-[1.06] tracking-[-0.02em] text-foreground">
              {memo.preparedFor}
            </h1>
            <p className="mt-1.5 text-[14px] tracking-tight text-white/55">{memo.title}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/42">
            <span className="tabular-nums">{data.docRef}</span>
            <Dot />
            <span>{formatDate(data.preparedOn)}</span>
            <Dot />
            <span className="text-accent-gold/80">{memo.note}</span>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-[12px] leading-relaxed text-white/40">{data.disclaimer}</p>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · Opening thesis                                                  */
/* ------------------------------------------------------------------ */

function ThesisSection({ data }: { data: CompanyResearchData }) {
  const { thesis } = data;
  return (
    <MemoSection id="thesis" className="!border-t-0">
      <Container>
        <Reveal>
          <MemoEyebrow index="01">{thesis.eyebrow ?? "Thesis"}</MemoEyebrow>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-7 max-w-3xl space-y-4 text-pretty text-[clamp(1.05rem,1.9vw,1.3rem)] font-light leading-[1.5] text-white/82">
            {thesis.body}
          </div>
        </Reveal>
        {thesis.signals && (
          <Reveal delay={140}>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                Signals read
              </span>
              {thesis.signals.map((s) => (
                <SignalChip key={s.label}>{s.label}</SignalChip>
              ))}
            </div>
          </Reveal>
        )}
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · What surprised us (+ Diagram C visualizes it)                  */
/* ------------------------------------------------------------------ */

function SurpriseSection({ data }: { data: CompanyResearchData }) {
  const { surprise } = data;
  return (
    <MemoSection id="surprise" alt grain>
      <Container>
        <Reveal>
          <MemoEyebrow index="02">{surprise.eyebrow ?? "What surprised us"}</MemoEyebrow>
        </Reveal>
        <Reveal delay={80} className="mt-7">
          <div className="border border-accent-gold/35 bg-accent-gold-faint p-7 md:p-9">
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
              <div className="text-center md:text-left">
                <div className="text-[clamp(3.4rem,9vw,5.2rem)] font-medium leading-none tracking-[-0.04em] text-accent-gold">
                  {surprise.value}
                </div>
                <div className="mt-3 max-w-[16rem] font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.14em] text-white/55">
                  {surprise.label}
                </div>
              </div>
              <p className="text-[14.5px] leading-relaxed text-white/74">{surprise.body}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={140} className="mt-6">
          <ObjectiveComparison />
        </Reveal>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Where Aurelius fits (Diagram A)                                 */
/* ------------------------------------------------------------------ */

function FitSection() {
  return (
    <MemoSection id="fit">
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="03"
            eyebrow="Where Aurelius fits"
            title="An economic layer over the scheduler — not a replacement"
          />
        </Reveal>
        <Reveal delay={120} className="mt-10">
          <FleetEconomicsMap />
        </Reveal>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Hypotheses — conviction-ranked cards                           */
/* ------------------------------------------------------------------ */

const CONVICTION_BORDER: Record<Conviction, string> = {
  highest: "border-l-2 border-l-accent-gold",
  medium: "border-l border-l-white/25",
  lower: "border-l border-l-white/12",
};

function HField({ label, mono, children }: { label: string; mono?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <FieldLabel tone={mono ? "muted" : "steel"}>{label}</FieldLabel>
      <div
        className={cn(
          "mt-2 leading-relaxed text-white/58",
          mono ? "font-mono text-[11.5px] text-white/46" : "text-[12.5px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function HypothesisCardView({ c, n }: { c: HypothesisCard; n: number }) {
  return (
    <div className={cn("border border-border bg-card p-6 lg:p-7", CONVICTION_BORDER[c.conviction])}>
      <div className="flex items-center justify-between gap-3">
        <ConvictionTag level={c.conviction} />
        <span className="font-mono text-[11px] tabular-nums text-white/22">H{String(n).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-4 text-[17px] font-medium leading-snug tracking-tight text-foreground">{c.title}</h3>
      <p className="mt-2.5 max-w-3xl text-[14px] leading-relaxed text-white/72">{c.hypothesis}</p>
      <div className="mt-5 grid gap-x-8 gap-y-4 border-t border-border pt-5 sm:grid-cols-3">
        <HField label="Why it matters">{c.matters}</HField>
        <HField label="What we'd test">{c.test}</HField>
        <HField label="Metadata needed" mono>{c.metadata}</HField>
      </div>
    </div>
  );
}

function HypothesesSection({ data }: { data: CompanyResearchData }) {
  const { hypotheses } = data;
  return (
    <MemoSection id="hypotheses" alt>
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="04"
            eyebrow={hypotheses.eyebrow ?? "Hypotheses"}
            title={hypotheses.title}
            intro={hypotheses.intro}
          />
        </Reveal>
        <div className="mt-10 space-y-4">
          {hypotheses.cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 60}>
              <HypothesisCardView c={c} n={i + 1} />
            </Reveal>
          ))}
        </div>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · Workload flexibility (Diagram B)                               */
/* ------------------------------------------------------------------ */

function WorkloadSection({ data }: { data: CompanyResearchData }) {
  const { workload } = data;
  return (
    <MemoSection id="workload">
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="05"
            eyebrow={workload.eyebrow ?? "Workload flexibility"}
            title={workload.title}
            intro={workload.intro}
          />
        </Reveal>
        <Reveal delay={120} className="mt-10">
          <WorkloadFlexibilityMatrix rows={workload.rows} />
        </Reveal>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · The backtest (Diagram D + steps + trust)                       */
/* ------------------------------------------------------------------ */

function BacktestSection({ data }: { data: CompanyResearchData }) {
  const { backtest } = data;
  return (
    <MemoSection id="backtest" alt grain>
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="06"
            eyebrow={backtest.eyebrow ?? "The backtest"}
            title={backtest.title}
            intro={backtest.intro}
          />
        </Reveal>
        <Reveal delay={120} className="mt-10">
          <ShadowReplayFlow />
        </Reveal>
        <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {backtest.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 70} className="bg-card p-5">
              <div className="font-mono text-[12px] tabular-nums text-accent-gold/80">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 text-[14px] font-medium leading-snug tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-white/52">{s.detail}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="mt-7 flex flex-wrap gap-2.5">
          {backtest.trust.map((t) => (
            <TrustChip key={t}>{t}</TrustChip>
          ))}
        </Reveal>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 07 · Metrics                                                         */
/* ------------------------------------------------------------------ */

function MetricsSection({ data }: { data: CompanyResearchData }) {
  const { metrics } = data;
  return (
    <MemoSection id="metrics">
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="07"
            eyebrow={metrics.eyebrow ?? "What we'd report"}
            title={metrics.title}
            intro={metrics.intro}
          />
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {metrics.items.map((m, i) => (
            <Reveal key={m.name} delay={(i % 3) * 60} className="flex items-start justify-between gap-3 bg-card p-5">
              <div>
                <h3 className="text-[13.5px] font-medium leading-snug tracking-tight text-foreground">
                  {m.name}
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/48">{m.detail}</p>
              </div>
              {m.unit && (
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-accent-gold/70">{m.unit}</span>
              )}
            </Reveal>
          ))}
        </div>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 08 · Reference benchmark                                             */
/* ------------------------------------------------------------------ */

function BenchmarkSection({ data }: { data: CompanyResearchData }) {
  const { benchmark } = data;
  return (
    <MemoSection id="benchmark" alt>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <MemoEyebrow index="08" className="justify-center">
              {benchmark.eyebrow ?? "Reference benchmark"}
            </MemoEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 text-balance text-[clamp(1.5rem,3vw,2.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
              {benchmark.title}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={120} className="mx-auto mt-10 max-w-3xl">
          <div
            className={cn(
              "grid gap-px overflow-hidden border border-border bg-border",
              benchmark.stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
            )}
          >
            {benchmark.stats.map((s) => (
              <div key={s.label} className="bg-card px-6 py-8 text-center">
                <div className="text-[clamp(2.2rem,6vw,3rem)] font-medium leading-none tracking-[-0.03em] text-foreground">
                  {s.value}
                </div>
                <div className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col items-center gap-2 text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-gold/75">
              {benchmark.source}
            </span>
            <p className="max-w-xl text-[11.5px] leading-relaxed text-white/36">{benchmark.disclaimer}</p>
          </div>
        </Reveal>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* 09 · Key assumptions (4 cards, not a table)                         */
/* ------------------------------------------------------------------ */

function AssumptionsSection({ data }: { data: CompanyResearchData }) {
  const { assumptions } = data;
  return (
    <MemoSection id="assumptions">
      <Container>
        <Reveal>
          <MemoSectionHeader
            index="09"
            eyebrow={assumptions.eyebrow ?? "Key assumptions"}
            title={assumptions.title}
            intro={assumptions.intro}
          />
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {assumptions.items.map((a, i) => (
            <Reveal key={a.assumption} delay={(i % 2) * 70} className="flex flex-col bg-card p-6">
              <div className="flex gap-3">
                <span className="font-mono text-[11px] tabular-nums text-accent-gold/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[14.5px] font-medium leading-snug tracking-tight text-foreground">
                  {a.assumption}
                </h3>
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <FieldLabel tone="steel">How we validate it</FieldLabel>
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/56">{a.validate}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* CTA — confident, assumptive                                         */
/* ------------------------------------------------------------------ */

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
            <h2 className="text-balance text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.025em] text-foreground">
              {cta.title}
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="mx-auto mt-5 max-w-xl text-[14.5px] leading-relaxed text-white/64">{cta.body}</p>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <MemoCta link={cta.primary} variant="primary" withArrow />
              <MemoCta link={cta.secondary} variant="secondary" />
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 flex items-center justify-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/38">
              <span className="h-1 w-1 rounded-full bg-accent-gold/80" aria-hidden />
              {cta.trustLine}
            </div>
          </Reveal>
        </div>
      </Container>
    </MemoSection>
  );
}

/* ------------------------------------------------------------------ */
/* Private footer — self-contained, single closing disclaimer          */
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
          Prepared for {data.company} from public information and stated assumptions. Not a claim of
          savings; does not imply an existing relationship between Aurelius and {data.company}.
          Corrections welcome. © {new Date().getFullYear()} Aurelius.
        </p>
      </Container>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function CompanyResearch({ data }: { data: CompanyResearchData }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data.slug]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <PrivateHeader docRef={data.docRef} />
      <HeroCover data={data} />
      <MemoMetaStrip data={data} />
      <main>
        <ThesisSection data={data} />
        <SurpriseSection data={data} />
        <FitSection />
        <HypothesesSection data={data} />
        <WorkloadSection data={data} />
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
