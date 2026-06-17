import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Container, SectionEyebrow, Reveal } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

/* ============================================================================
   Technical reference — a real, dense documentation surface (Stripe-style):
   a sticky grouped sidebar + scroll-spy, spec tables, and code blocks. The
   content is representative of the integration an infra team would evaluate,
   so the page reads as an authored reference rather than a placeholder.
   ========================================================================== */

const NAV: { group: string; items: { id: string; label: string }[] }[] = [
  {
    group: "Getting started",
    items: [
      { id: "overview", label: "Overview" },
      { id: "architecture", label: "Architecture" },
      { id: "quickstart", label: "Quickstart" },
    ],
  },
  {
    group: "Integration",
    items: [
      { id: "deployment", label: "Deployment" },
      { id: "configuration", label: "Configuration" },
      { id: "execution-modes", label: "Execution modes" },
    ],
  },
  {
    group: "Operations",
    items: [
      { id: "constraints", label: "Constraints & safety" },
      { id: "audit-log", label: "Audit log schema" },
      { id: "observability", label: "Observability" },
    ],
  },
  {
    group: "Reference",
    items: [
      { id: "environment", label: "Environment variables" },
      { id: "cli", label: "CLI" },
    ],
  },
];
const ALL_IDS = NAV.flatMap((g) => g.items.map((i) => i.id));

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -72% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/* ---- primitives --------------------------------------------------------- */

function DocSection({ id, n, title, lead, children }: { id: string; n: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border pt-12 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[12px] tabular-nums text-white/28">{n}</span>
        <h2 className="font-display text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium tracking-[-0.02em] text-foreground">{title}</h2>
      </div>
      {lead && <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/64">{lead}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CodeBlock({ file, children }: { file: string; children: string }) {
  return (
    <div className="overflow-hidden border border-strong bg-[hsl(0_0%_4%)]">
      <div className="flex items-center justify-between border-b border-border bg-white/[0.015] px-4 py-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45">{file}</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/28">
          <span className="h-1.5 w-1.5 bg-white/25" aria-hidden />
          copy
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed text-white/72">{children}</pre>
    </div>
  );
}

function SpecTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto border border-strong bg-card">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b border-border/50 last:border-0">
              {r.map((cell, ci) => (
                <td key={ci} className={cn("px-4 py-2.5 align-top text-[13px] leading-relaxed", ci === 0 ? "font-mono text-white/80" : "text-white/58")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Mono = ({ children }: { children: React.ReactNode }) => <code className="font-mono text-[12px] text-steel">{children}</code>;

/* ---- page --------------------------------------------------------------- */

export default function Docs() {
  const active = useScrollSpy(ALL_IDS);

  return (
    <Layout>
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-border pb-12 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
        <Container className="relative">
          <Reveal>
            <SectionEyebrow>Documentation</SectionEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-[-0.025em] text-foreground">
              Technical reference for Aurelius
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/62 md:text-base">
              Integration reference for infrastructure engineers. Aurelius deploys as a read-only
              control layer beside your scheduler, evaluates pending decisions against forecasts and
              hard constraints, and writes an append-only audit log. Metadata only — no payloads.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-white/40">
              <span><span className="text-white/65">v1.4</span> · stable</span>
              <span className="text-white/15">·</span>
              <span>API surface: read-only</span>
              <span className="text-white/15">·</span>
              <span>Updated 2026-06-12</span>
            </div>
          </Reveal>
        </Container>
      </section>

      <Container className="py-14 md:py-20">
        <div className="grid gap-x-14 lg:grid-cols-[212px_minmax(0,1fr)]">
          {/* sticky sidebar nav */}
          <aside className="hidden lg:block">
            <nav className="sticky top-28 self-start" aria-label="Documentation">
              {NAV.map((g) => (
                <div key={g.group} className="mb-7">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/32">{g.group}</div>
                  <ul className="space-y-0.5 border-l border-border">
                    {g.items.map((it) => {
                      const on = active === it.id;
                      return (
                        <li key={it.id}>
                          <a
                            href={`#${it.id}`}
                            className={cn(
                              "-ml-px flex border-l py-1.5 pl-4 text-[13px] tracking-tight transition-colors duration-200",
                              on ? "border-steel text-foreground" : "border-transparent text-white/45 hover:text-white/80",
                            )}
                          >
                            {it.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* content */}
          <div className="max-w-3xl space-y-12">
            <DocSection id="overview" n="01" title="Overview" lead="Aurelius is an advisory control layer for GPU fleets. It does not replace your scheduler — it reads the metadata your scheduler already exposes, forecasts cost/power/carbon, ranks alternatives, rejects anything that violates a hard constraint, and records the counterfactual. Your scheduler stays the authority; execution is unchanged.">
              <SpecTable
                head={["Property", "Value"]}
                rows={[
                  ["data scope", "scheduler metadata only — never payloads, model outputs, or code"],
                  ["control model", "advisory; scheduler retains authority over execution"],
                  ["determinism", "same inputs produce the same decision — no sampling"],
                  ["default mode", <>shadow (read-only) — <Mono>live</Mono> is opt-in</>],
                  ["audit", "append-only log of every decision, rejection, and fallback"],
                  ["rollback", <>instant kill switch via <Mono>AURELIUS_MODE=off</Mono> — no redeploy</>],
                ]}
              />
            </DocSection>

            <DocSection id="architecture" n="02" title="Architecture" lead="A deterministic control loop. Each stage is observable and produces a logged artifact; the constraint filter is the last gate before any advice is surfaced.">
              <SpecTable
                head={["Component", "Responsibility"]}
                rows={[
                  [<>metadata reader</>, "Pulls job timing, resources, class, and constraints from the scheduler. Read-only."],
                  [<>forecaster</>, "Short-horizon cost/carbon forecasts with explicit uncertainty bounds."],
                  [<>decision engine</>, "Ranks run / delay / relocate candidates by expected economics."],
                  [<>constraint filter</>, "Rejects any candidate violating SLA, capacity, power, residency, or policy."],
                  [<>audit log</>, "Appends the selected decision, its reasons, and every rejection."],
                ]}
              />
              <p className="mt-5 text-[13.5px] leading-relaxed text-white/55">
                The full observe → forecast → decide → filter → log cycle is illustrated on the{" "}
                <a href="/how-it-works" className="text-steel underline-offset-2 hover:underline">How it works</a> page.
              </p>
            </DocSection>

            <DocSection id="quickstart" n="03" title="Quickstart" lead="Start in shadow mode against recent scheduler history. No execution impact, no permissions beyond read access to job metadata.">
              <CodeBlock file="shell">{`# 1 · install the control layer beside your scheduler
helm repo add aurelius https://charts.aurelius.systems
helm install aurelius aurelius/control-layer \\
  --set mode=shadow \\
  --set scheduler=kubernetes

# 2 · confirm it is reading metadata only
aurelius status
#   mode      shadow (read-only)
#   scheduler kubernetes · connected
#   scope     metadata · payload access = denied

# 3 · run a shadow audit over the last 7 days
aurelius shadow --since 7d --report ./audit.csv`}</CodeBlock>
            </DocSection>

            <DocSection id="deployment" n="04" title="Deployment" lead="Aurelius runs as a sidecar / control-plane process. It mounts read-only and never requires write access to scheduler state or workloads.">
              <CodeBlock file="aurelius.deployment.yaml">{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: aurelius-control
spec:
  template:
    spec:
      containers:
        - name: aurelius
          image: aurelius/control-layer:1.4
          env:
            - { name: AURELIUS_MODE, value: shadow }
            - { name: AURELIUS_SCHEDULER, value: kubernetes }
            - { name: AURELIUS_RESIDENCY, value: strict }
          securityContext:
            readOnlyRootFilesystem: true   # metadata scope only
            allowPrivilegeEscalation: false`}</CodeBlock>
            </DocSection>

            <DocSection id="configuration" n="05" title="Configuration" lead="Configuration is environment-driven so it is auditable in your existing GitOps flow. Operators own every threshold; conservative defaults apply when a value is unset.">
              <SpecTable
                head={["Setting", "Effect"]}
                rows={[
                  [<Mono>AURELIUS_MODE</Mono>, <>Execution mode: <Mono>off</Mono> · <Mono>dry-run</Mono> · <Mono>shadow</Mono> · <Mono>live</Mono>. Default <Mono>shadow</Mono>.</>],
                  [<Mono>AURELIUS_MAX_DELAY</Mono>, "Hard ceiling on how far a job may be time-shifted. Default 0 (no shift)."],
                  [<Mono>AURELIUS_CONFIDENCE_MIN</Mono>, "Forecast confidence below which the conservative fallback applies. Default 0.80."],
                  [<Mono>AURELIUS_RESIDENCY</Mono>, <>Data-residency enforcement: <Mono>strict</Mono> · <Mono>region-pinned</Mono>. Default <Mono>strict</Mono>.</>],
                ]}
              />
            </DocSection>

            <DocSection id="execution-modes" n="06" title="Execution modes" lead="Modes are a strict ladder of capability. You can stop at any rung; nothing escalates without an explicit configuration change.">
              <SpecTable
                head={["Mode", "Writes", "Risk", "Use"]}
                rows={[
                  [<Mono>dry-run</Mono>, "none", "none", "local validation against sample traces"],
                  [<Mono>shadow</Mono>, "append-only log", "none", "prove savings on real traffic, read-only"],
                  [<Mono>live</Mono>, "advisory to scheduler", <span className="text-steel">constraint-gated</span>, "apply optimizations the scheduler accepts"],
                  [<Mono>off</Mono>, "none", "none", "instant kill switch — disabled, still installed"],
                ]}
              />
            </DocSection>

            <DocSection id="constraints" n="07" title="Constraints & safety" lead="Hard constraints are not preferences. A candidate that violates any gate is rejected before it can be surfaced, and the rejection is recorded. Unsafe savings do not count.">
              <CodeBlock file="constraints.policy">{`# every candidate must clear all gates, in order
gate sla        { deadline_slack >= 0 }        # never miss the deadline
gate capacity   { fits_pool == true }          # the pool can hold it
gate power      { draw <= envelope }            # within the power envelope
gate residency  { region in allowed_regions }  # data stays in-region
gate policy     { matches operator_rules }     # operator overrides win

on_violation: reject + append(audit, reason)   # cheapest-safe candidate wins`}</CodeBlock>
            </DocSection>

            <DocSection id="audit-log" n="08" title="Audit log schema" lead="Every decision is one append-only record: what the scheduler did, what Aurelius would have done, the expected delta, the constraints checked, and a reference to the full explanation trace.">
              <CodeBlock file="audit.log.jsonl">{`{
  "ts": "2026-06-17T14:01:22Z",
  "decision_id": "dec_8f21a3",
  "observed": "run_now",
  "counterfactual": "delay_38m",
  "expected_delta": { "cost": -0.184, "carbon": -0.082 },
  "constraints": ["sla", "capacity", "residency"],
  "verdict": "selected",
  "explanation_ref": "trace_8f21a3"
}`}</CodeBlock>
            </DocSection>

            <DocSection id="observability" n="09" title="Observability" lead="Aurelius exports Prometheus metrics for every stage of the loop, so its behavior is visible in the dashboards you already run.">
              <CodeBlock file="metrics">{`aurelius_decisions_total{verdict="selected"}    1284
aurelius_decisions_total{verdict="rejected"}      96
aurelius_expected_cost_delta_ratio               -0.181
aurelius_forecast_confidence                       0.91
aurelius_fallback_activations_total                 14`}</CodeBlock>
            </DocSection>

            <DocSection id="environment" n="10" title="Environment variables" lead="The complete environment surface. All values are optional except the scheduler binding.">
              <SpecTable
                head={["Variable", "Default", "Description"]}
                rows={[
                  [<Mono>AURELIUS_SCHEDULER</Mono>, "—", "Scheduler binding: kubernetes · slurm · ray · nomad"],
                  [<Mono>AURELIUS_MODE</Mono>, "shadow", "off · dry-run · shadow · live"],
                  [<Mono>AURELIUS_MAX_DELAY</Mono>, "0", "Max time-shift, e.g. 90m"],
                  [<Mono>AURELIUS_CONFIDENCE_MIN</Mono>, "0.80", "Fallback threshold for forecast confidence"],
                  [<Mono>AURELIUS_RESIDENCY</Mono>, "strict", "Data-residency enforcement"],
                  [<Mono>AURELIUS_LOG_SINK</Mono>, "stdout", "Append-only audit destination"],
                ]}
              />
            </DocSection>

            <DocSection id="cli" n="11" title="CLI" lead="A small surface for evaluation and day-two operations.">
              <CodeBlock file="shell">{`aurelius status               # connection, mode, and data scope
aurelius shadow --since 7d    # run a shadow audit over recent history
aurelius report --format csv  # export the counterfactual ledger
aurelius constraints list     # show the active hard constraints
aurelius disable              # instant kill switch — no redeploy`}</CodeBlock>
              <div className="mt-10 flex flex-col gap-3 border border-strong bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[12px] leading-relaxed text-white/55">
                  Pilot participants receive the full reference, the integration SDK, and a dedicated engineer.
                </p>
                <a
                  href="/contact"
                  className="inline-flex h-9 shrink-0 items-center justify-center border border-border-strong px-4 text-[13px] tracking-tight text-foreground transition-colors duration-200 hover:border-signal/45 hover:bg-white/[0.03]"
                >
                  Request access
                </a>
              </div>
            </DocSection>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
