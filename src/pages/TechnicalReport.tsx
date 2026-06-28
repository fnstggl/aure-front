import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/site/primitives";
import { PageFrame, Band, Grid, Kicker, Action } from "@/components/site/structure";
import { WorldModelArchitecture } from "@/components/diagrams/WorldModelArchitecture";
import { WorldModelState } from "@/components/diagrams/WorldModelState";
import { SearchStrategyLadder } from "@/components/diagrams/SearchStrategyLadder";
import { BenchmarkFigure } from "@/components/diagrams/BenchmarkFigure";
import { ArchitecturePipeline } from "@/components/diagrams/ArchitecturePipeline";

/* /technical-report — a systems technical report about what Aurelius is: the
   discovery, the architecture, and the evidence. It deliberately explains the
   high-level control architecture and reports verified results without exposing
   the internal source tree, implementation classes, exact heuristics, or tuning
   values. Two result families are reported separately and never mixed: the
   Alibaba GenAI 2026 public-workload case study and the full-architecture MPC
   validation. The web page is canonical; a Print → Save as PDF is offered. */

const SECTIONS = [
  { n: "00", id: "abstract", title: "Abstract" },
  { n: "01", id: "problem", title: "Scheduling Starts Too Late" },
  { n: "02", id: "architecture", title: "Forecast → Simulate → Decide" },
  { n: "03", id: "world-model", title: "Predictive World Model" },
  { n: "04", id: "forecasts", title: "Forecasted Constraints" },
  { n: "05", id: "surfaces", title: "Candidate Decision Surfaces" },
  { n: "06", id: "search", title: "Search & Optimization" },
  { n: "07", id: "objective", title: "Objective & Constraint Gates" },
  { n: "08", id: "case-study", title: "Public Workload Case Study" },
  { n: "09", id: "mpc-validation", title: "Full Aurelius MPC Validation" },
  { n: "10", id: "methodology", title: "Benchmark Methodology" },
  { n: "11", id: "baselines", title: "Baselines" },
  { n: "12", id: "results", title: "Results" },
  { n: "13", id: "contribution", title: "Contribution Analysis" },
  { n: "14", id: "regret", title: "Optimizer Validation" },
  { n: "15", id: "safety", title: "Safety & Deployment Path" },
  { n: "16", id: "limitations", title: "Limitations" },
  { n: "17", id: "future-work", title: "Future Work" },
  { n: "18", id: "evaluation", title: "Run It On Your Fleet" },
];

const P = "max-w-[68ch] text-[14.5px] leading-[1.7] text-white/64";
const PT = "max-w-[68ch] text-[13.5px] leading-[1.7] text-white/44";

export default function TechnicalReport() {
  return (
    <Layout>
      <PageFrame>
        {/* ============================== Masthead ============================== */}
        <Band className="border-t border-border">
          <Grid>
            <div className="col-span-1 px-6 pb-14 pt-32 sm:px-8 md:col-span-11 md:pt-36 lg:px-10">
              <Reveal>
                <Kicker index="—">Aurelius Technical Report</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="mt-7 max-w-3xl text-balance text-[clamp(2rem,4.6vw,3.2rem)] font-medium leading-[1.04] tracking-[-0.03em] text-foreground">
                  Predictive World Models for AI Infrastructure
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/58">
                  Forecasting future cluster state to optimize workload decisions before execution.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-white/40">
                  Aurelius introduces a predictive control architecture for AI infrastructure. Rather than optimizing only the current cluster state, it forecasts future infrastructure constraints, simulates candidate decisions against those predicted conditions, and selects the economically optimal action subject to SLA, capacity, power, policy, and safety constraints.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/34">
                  <span>Version 0.1</span>
                  <span className="text-white/14">·</span>
                  <span>Historical replay on public traces</span>
                  <span className="text-white/14">·</span>
                  <span>Evidence, not a guarantee</span>
                  <span className="text-white/14">·</span>
                  <PrintButton />
                </div>
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ============================== Body ============================== */}
        <Band divide={false} rails={false}>
          <Grid>
            {/* Sticky contents */}
            <aside className="col-span-1 hidden border-r border-border px-6 py-14 md:col-span-3 md:block lg:px-10">
              <div className="sticky top-24">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/32">
                  Contents
                </div>
                <nav className="mt-5">
                  <ol className="space-y-2">
                    {SECTIONS.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="group flex items-baseline gap-3 text-[12px] leading-snug tracking-tight text-white/50 transition-colors hover:text-white/90"
                        >
                          <span className="font-mono text-[10px] tabular-nums text-white/28 group-hover:text-white">
                            {s.n}
                          </span>
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </aside>

            {/* Sections */}
            <div className="col-span-1 px-6 py-14 sm:px-8 md:col-span-9 md:px-12 md:py-16 lg:px-16">
              {/* 00 — Abstract */}
              <Sec n="00" id="abstract" title="Abstract">
                <p className={P}>
                  The optimal scheduling decision depends on constraints that have not emerged yet.
                  Aurelius tests that premise directly: it builds a predictive world model of the
                  future cluster state, forecasts the operational constraints a decision will face,
                  simulates candidate workload decisions against that state, and selects the economic
                  optimum subject to SLA, capacity, power, policy, and safety gates.
                </p>
                <p className={`${P} mt-4`}>
                  The architecture is the result; the numbers support it. As an external workload{" "}
                  <em>case study</em>, the public Alibaba GenAI 2026 trace yields{" "}
                  <Em>+38.2% SLA-safe goodput per dollar</Em> and <Em>−27.6% GPU-hours</Em> against an
                  SLA-safe baseline, with both arms at 0.000% SLA violations — evidence that the
                  mechanism is not an artifact of a single internal simulator. As the{" "}
                  <em>current-architecture validation</em>, enabling the full predictive world model
                  and its connected decision surfaces reaches <Em>+82.1% SLA-safe goodput/$</Em> over
                  the strongest SLA-safe baseline on a bounded historical replay. Neither is a
                  production deployment, and neither is a guarantee for any specific fleet.
                </p>
              </Sec>

              {/* 01 — Problem */}
              <Sec n="01" id="problem" title="01 · Scheduling Starts Too Late">
                <p className={P}>
                  Most schedulers optimize a current-state or local objective: availability, fairness,
                  utilization, latency, queue state, immediate capacity. Each is reasonable in
                  isolation. But the economic outcome of a placement is decided by constraints that
                  arrive <em>after</em> the placement is made — power and capacity headroom,
                  congestion, memory and topology pressure, demand and pricing, cache locality, model
                  affinity, the warm or cold state of a replica, migration cost, and the way batching,
                  precision, and speculative decoding interact under load.
                </p>
                <p className={`${P} mt-4`}>
                  Once a job lands, those costs are largely locked in. An <Em>observe → decide</Em>{" "}
                  loop cannot price a constraint it has not yet seen. Aurelius closes that gap with an{" "}
                  <Em>observe → forecast → simulate → decide</Em> loop — a different control
                  architecture, not another scheduler.
                </p>
              </Sec>

              {/* 02 — Architecture */}
              <Sec n="02" id="architecture" title="02 · Forecast → Simulate → Decide">
                <p className={P}>
                  Each control period, Aurelius forecasts the workload, generates candidate action
                  bundles, simulates each against the forecasted world state, scores it by
                  risk-adjusted SLA-safe goodput per dollar, rejects anything that fails a hard gate,
                  and recommends the best safe bundle — falling back deterministically when forecast
                  confidence is low.
                </p>
                <p className={`${P} mt-4`}>
                  Crucially, it evaluates <Em>coupled action bundles</Em>, not one knob. Workload
                  timing, placement, routing, capacity, batching, prewarm, and the
                  precision/speculation/clock policy are scored together, because those decisions
                  interact.
                </p>
                <Figure>
                  <WorldModelArchitecture />
                </Figure>
              </Sec>

              {/* 03 — World model */}
              <Sec n="03" id="world-model" title="03 · Predictive World Model">
                <p className={P}>
                  Aurelius maintains a persistent world model of the cluster — a forward model of the
                  fleet, not a snapshot of free GPUs. It carries the replica warm/cold state, server
                  and rack capacity, placement and locality, queue dynamics, in-flight migrations, and
                  the operator-cost basis, and it advances that state one control period at a time so a
                  candidate decision can be scored against the state it will actually meet.
                </p>
                <Figure>
                  <WorldModelState />
                </Figure>
                <p className={`${P} mt-2`}>
                  Candidate decisions are evaluated on read-only simulated future states, so scoring
                  never mutates the live cluster. Inputs are tagged by provenance — measured,
                  trace-derived, benchmark-calibrated, or modeled — so no result silently treats a
                  modeled value as a measured one.
                </p>
              </Sec>

              {/* 04 — Forecasts */}
              <Sec n="04" id="forecasts" title="04 · Forecasted Constraints">
                <p className={P}>
                  Aurelius forecasts arrival rate, request characteristics (such as prompt and output
                  length), queue dynamics, and infrastructure and pricing conditions using specialized
                  forecasting models. Forecasts use only history up to the current period — there is no
                  future-truth leakage into the decision.
                </p>
                <p className={`${PT} mt-4`}>
                  Honest scope: several constraints are represented in the world model but are not yet
                  consumed as planner-input forecasts — among them cache-reuse, emergent queue and SLA
                  pressure, and carbon and network-congestion conditions. They are treated as
                  out-of-scope inputs today rather than implied.
                </p>
              </Sec>

              {/* 05 — Surfaces */}
              <Sec n="05" id="surfaces" title="05 · Candidate Decision Surfaces">
                <p className={P}>
                  A candidate is a bundle of decisions across several surfaces. Aurelius distinguishes
                  surfaces that are <Em>active decision levers today</Em> — they change the scored
                  economic outcome and are optimized — from surfaces that are{" "}
                  <Em>modeled but not yet optimized</Em>, and <Em>future surfaces</Em> that are
                  represented but not actuated. A decision can only be recommended on an active lever,
                  so the report cannot claim a surface that is not wired.
                </p>
                <SurfaceGroups />
              </Sec>

              {/* 06 — Search */}
              <Sec n="06" id="search" title="06 · Search & Optimization">
                <p className={P}>
                  Because the surfaces interact, Aurelius evaluates coupled decision bundles rather
                  than tuning one knob at a time. The search method scales with the size of the space:
                  exhaustive evaluation where it is tractable, a structured beam-style search with
                  local improvement for medium spaces, and bounded exploration for larger or
                  strongly-coupled spaces. Where exact enumeration is feasible, the approximate search
                  is scored against it so any regret is measured rather than assumed.
                </p>
                <Figure>
                  <SearchStrategyLadder />
                </Figure>
                <p className={`${PT} mt-2`}>
                  The candidate space is pruned by the operating regime — a surface is only proposed
                  where it can plausibly help — which narrows the search without changing the score a
                  candidate would receive.
                </p>
              </Sec>

              {/* 07 — Objective */}
              <Sec n="07" id="objective" title="07 · Objective & Constraint Gates">
                <p className={P}>
                  The objective is <Em>SLA-safe goodput per operator dollar</Em>: the numerator counts
                  requests that met their SLA deadline; the denominator is infrastructure cost,
                  including the cost of holding replicas warm and of migrations. Energy and carbon
                  cost, queue delay, and a forecast-uncertainty risk penalty enter the same economic
                  objective.
                </p>
                <p className={`${P} mt-4`}>
                  Gating is two-tier. Hard constraints — SLA, capacity, power, residency, policy —{" "}
                  <Em>reject</Em> a candidate outright; the objective only ranks the feasible ones; and
                  a safety gate records whether the chosen bundle beats the baseline without regressing
                  SLA. When forecast confidence is low, Aurelius falls back deterministically to a safe
                  default action.
                </p>
              </Sec>

              {/* 08 — Case study */}
              <Sec n="08" id="case-study" title="08 · Public Workload Case Study">
                <p className={P}>
                  To test whether the gains generalize beyond text-generation traces — and beyond a
                  closed internal simulator — Aurelius was replayed on the public Alibaba GenAI 2026
                  trace: stable-diffusion LoRA serving, a materially different, multi-model,
                  image-generation workload (26,392 valid requests over a one-week window, priced and
                  provisioned with a queue-aware model).
                </p>
                <Figure>
                  <BenchmarkFigure />
                </Figure>
                <p className={`${P} mt-2`}>
                  The honest headline compares two SLA-safe arms and reports{" "}
                  <Em>+38.2% goodput/$</Em> and <Em>−27.6% GPU-hours</Em>, both at 0.000% SLA
                  violations. The decision being optimized is infrastructure-level — adapter
                  prewarming, model-affinity routing, and anticipatory capacity sizing — and the
                  dominant mechanism is affinity: cold-start latency falls roughly 8× when related
                  requests are kept warm together.
                </p>
                <Callout tone="warn">
                  Scope: this is a public-trace case study, run as a standalone evaluation to validate
                  the mechanism on an external workload — <span className="text-white/75">not</span> a
                  production deployment and not a guarantee. A larger headline against an
                  SLA-violating baseline exists in the literature; it is excluded here because a
                  baseline that drops completions is not a valid SLA-safe comparison (see §11). On a
                  single-model stream the affinity benefit shrinks toward zero.
                </Callout>
              </Sec>

              {/* 09 — MPC validation */}
              <Sec n="09" id="mpc-validation" title="09 · Full Aurelius MPC Validation">
                <p className={P}>
                  The flagship validation enables the full predictive world model with every connected
                  decision surface live — workload timing, placement and routing, capacity and
                  batching, prewarm, and the precision/speculation/clock policy — on a bounded
                  historical serving window, scored against the strongest deployable SLA-safe baseline.
                </p>
                <p className={`${P} mt-4`}>
                  With the full architecture enabled, Aurelius reaches <Em>+82.1% SLA-safe goodput/$</Em>{" "}
                  over the best SLA-safe baseline. No surfaces were disabled, and the baselines are
                  deployable fixed policies with no oracle and no future information.
                </p>
                <Callout>
                  Honesty: the <span className="text-white/75">direction</span> — the full architecture
                  substantially beats the SLA-safe baseline with all surfaces live — is the robust
                  finding. The <span className="text-white/75">magnitude</span> is a bounded-replay
                  result inferred in simulation, not a production measurement.
                </Callout>
              </Sec>

              {/* 10 — Methodology */}
              <Sec n="10" id="methodology" title="10 · Benchmark Methodology">
                <p className={P}>
                  Evaluation is deterministic historical replay: a public production trace is replayed
                  step-for-step against a fixed harness, and Aurelius&rsquo; decisions are compared
                  against deployable baseline policies on the same trace under a single metric —
                  SLA-safe goodput per dollar. Serving is modeled with queue-aware physics. No policy
                  sees future arrivals; anticipatory sizing uses forecast inputs only, and per-request
                  execution time is used rather than predicted, so there is no token oracle.
                </p>
              </Sec>

              {/* 11 — Baselines */}
              <Sec n="11" id="baselines" title="11 · Baselines">
                <p className={P}>
                  A single integrity rule runs through every result: a baseline that violates SLA on
                  any meaningful fraction of requests is not a valid SLA-safe baseline, and a large
                  delta earned by quietly dropping completions is excluded from any headline. Aurelius
                  is therefore always compared against the strongest baseline that itself holds SLA —
                  not against a weaker policy that would flatter the result. Baselines range from
                  first-come-first-served through queue- and SLA-aware disciplines.
                </p>
              </Sec>

              {/* 12 — Results */}
              <Sec n="12" id="results" title="12 · Results">
                <Caption>Table 1 — Evidence summary (two validations, kept separate)</Caption>
                <ResultTable
                  head={["Validation", "Purpose", "Setting", "Baseline", "Result", "Caveat"]}
                  rows={[
                    ["Public workload case study", "Generalizes beyond an internal simulator", "Alibaba GenAI 2026 · public trace", "SLA-safe baseline", "+38.2% goodput/$", "standalone replay · not production"],
                    ["Full Aurelius MPC", "Full architecture + connected surfaces", "bounded historical replay", "best SLA-safe baseline", "+82.1% goodput/$", "direction robust · magnitude simulator-inferred"],
                  ]}
                  emph={[4]}
                />
                <Caption className="mt-12">Table 2 — Public workload case study</Caption>
                <ResultTable
                  head={["Metric", "Result", "Baseline", "Caveat"]}
                  rows={[
                    ["SLA-safe goodput / $", "+38.2%", "SLA-safe baseline", "public trace · external workload"],
                    ["GPU-hours", "−27.6%", "SLA-safe baseline", "same completions held"],
                    ["SLA violations", "0.000% (both arms)", "—", "valid SLA-safe comparison"],
                  ]}
                  emph={[1]}
                />
                <Caption className="mt-12">Table 3 — Full Aurelius MPC</Caption>
                <ResultTable
                  head={["Metric", "Result", "Baseline", "Setting", "Caveat"]}
                  rows={[
                    ["SLA-safe goodput / $", "+82.1%", "best SLA-safe baseline", "bounded historical replay", "magnitude simulator-inferred; direction robust"],
                  ]}
                  emph={[1]}
                />
              </Sec>

              {/* 13 — Contribution */}
              <Sec n="13" id="contribution" title="13 · Contribution Analysis">
                <p className={P}>
                  In the public-workload case study, a contribution analysis attributes roughly{" "}
                  <Em>62%</Em> of the gain to model affinity and prewarming and roughly <Em>38%</Em> to
                  anticipatory capacity sizing, with negligible interaction between them — the two
                  effects are largely additive. In the full-architecture validation, an internal audit
                  finds that the remaining headroom is dominated by forecast quality, especially the
                  forecasts of request characteristics, rather than by the search or the objective.
                </p>
              </Sec>

              {/* 14 — Optimizer validation */}
              <Sec n="14" id="regret" title="14 · Optimizer Validation">
                <p className={P}>
                  Because an approximate search could quietly leave value on the table, its loss is
                  measured wherever exhaustive enumeration is feasible. The structured beam-style
                  search shows essentially zero regret against exhaustive evaluation on the coupled
                  fixtures — including the cases that defeat a one-knob-at-a-time search, which is why
                  that cheaper method is kept only as a fallback. A regret audit attributes essentially
                  all of the remaining planner shortfall to forecast quality rather than to the search
                  itself.
                </p>
              </Sec>

              {/* 15 — Safety */}
              <Sec n="15" id="safety" title="15 · Safety & Deployment Path">
                <p className={P}>
                  Aurelius reads only the metadata a scheduler already exposes — job timing, resource
                  requests, constraints — never payloads or model outputs. Candidate scoring runs
                  read-only; unsafe candidates are rejected at the constraint gate before execution;
                  and when confidence is low the controller falls back deterministically. The path from
                  telemetry to any production change is staged and reversible:
                </p>
                <Figure>
                  <ArchitecturePipeline fig="fig.05" title="deployment path" />
                </Figure>
              </Sec>

              {/* 16 — Limitations */}
              <Sec n="16" id="limitations" title="16 · Limitations">
                <ul className="grid max-w-[70ch] gap-y-3">
                  {[
                    "Reported deltas are historical replays / backtests on public traces — evidence of achievable savings, not a guarantee for any specific fleet.",
                    "Public-trace results may not transfer directly to a given fleet; the magnitude depends on workload mix, exposed metadata, constraints, and rollout policy.",
                    "The full-architecture +82.1% is a bounded historical validation inferred in simulation, not a production deployment; only its direction is robust.",
                    "Simulator fidelity must still be tested against real operator telemetry — that is the only way to isolate model error.",
                    "The public-workload case study is a standalone evaluation, not the full production control path.",
                    "Some surfaces are modeled but not yet active production levers, and several constraints are represented but not yet forecast inputs.",
                    "Model-affinity gains are workload-dependent: on a single-model stream the benefit approaches zero.",
                  ].map((item) => (
                    <li key={item} className="flex max-w-[70ch] items-start gap-3 text-[13.5px] leading-relaxed text-white/56">
                      <span className="mt-2 inline-block h-px w-4 shrink-0 bg-white/40" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Sec>

              {/* 17 — Future work */}
              <Sec n="17" id="future-work" title="17 · Future Work">
                <p className={P}>
                  The contribution analysis points the roadmap at forecast quality first — better
                  request-characteristic forecasting is the largest measured lever — followed by
                  validating world-model fidelity against real serving telemetry, promoting the
                  modeled-but-not-yet-optimized surfaces into active levers, and making energy and cost
                  signals actionable rather than only objective terms. Additional public trace families
                  and multi-region replays under live constraints follow.
                </p>
              </Sec>

              {/* 18 — CTA */}
              <Sec n="18" id="evaluation" title="18 · Run It On Your Fleet">
                <p className={P}>
                  Aurelius can start with read-only scheduler metadata, replay your historical
                  decisions, simulate the counterfactual outcomes, and produce an audited savings
                  report — without payload access or production impact.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Action to="/contact" variant="primary" withArrow>
                    See how much your fleet could have saved
                  </Action>
                  <Link
                    to="/"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/80"
                  >
                    ← Back to home
                  </Link>
                </div>
              </Sec>
            </div>
          </Grid>
        </Band>
      </PageFrame>
    </Layout>
  );
}

/* ------------------------------------------------------------------ */
/* Local presentation helpers                                          */
/* ------------------------------------------------------------------ */

function Sec({
  n,
  id,
  title,
  children,
}: {
  n: string;
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-12 first:border-t-0 first:pt-0 md:py-14">
      <div className="mb-7 flex items-baseline gap-4">
        <span className="font-mono text-[12px] tabular-nums text-white/70">{n}</span>
        <h2 className="text-[clamp(1.3rem,2.6vw,1.8rem)] font-medium tracking-[-0.02em] text-foreground">
          {title.replace(/^\d+\s·\s/, "")}
        </h2>
      </div>
      {children}
    </section>
  );
}

/* Emphasised inline value — restrained, white. */
function Em({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-white/90">{children}</span>;
}

/* Caveat / note box. */
function Callout({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "warn" }) {
  return (
    <div
      className={
        "mt-6 max-w-[68ch] border-l-2 py-1 pl-4 text-[13px] leading-relaxed text-white/55 " +
        (tone === "warn" ? "border-destructive/55" : "border-white/30")
      }
    >
      {children}
    </div>
  );
}

function Figure({ children }: { children: React.ReactNode }) {
  return <div className="my-9 max-w-[680px]">{children}</div>;
}

function Caption({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 " + (className ?? "")}>
      {children}
    </div>
  );
}

/* Result table — mono, hairline, horizontal scroll on mobile. */
function ResultTable({
  head,
  rows,
  emph = [],
}: {
  head: string[];
  rows: string[][];
  emph?: number[];
}) {
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/30">
            {head.map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/50"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-white/10 align-top">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={
                    "px-3 py-3 text-[12.5px] leading-relaxed " +
                    (emph.includes(ci) ? "font-mono tabular-nums text-white/90" : "text-white/58")
                  }
                >
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

/* Candidate surfaces — public-facing categories only (no field-level detail). */
const SURFACE_GROUPS: { tier: string; tierNote: string; groups: string[] }[] = [
  {
    tier: "Active decision levers",
    tierNote: "optimized today — change the scored economic outcome",
    groups: [
      "Workload timing — admission, ordering, deferral",
      "Placement & routing",
      "Capacity & batching",
      "Cache & prewarm state",
      "Precision / speculation / clock policy",
    ],
  },
  {
    tier: "Modeled, not yet optimized",
    tierNote: "represented in the physics, not yet a live lever",
    groups: ["Co-location of background work", "Prefill / decode allocation"],
  },
  {
    tier: "Future surfaces",
    tierNote: "represented, not actuated today",
    groups: ["Energy- & cost-aware timing", "Cache placement"],
  },
];

function SurfaceGroups() {
  return (
    <div className="mt-7 grid gap-2.5">
      {SURFACE_GROUPS.map((s) => (
        <div key={s.tier} className="border border-white/20 px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={
                "font-mono text-[11px] uppercase tracking-[0.12em] " +
                (s.tier === "Active decision levers" ? "text-white" : "text-white/55")
              }
            >
              {s.tier}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/35">{s.tierNote}</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1.5">
            {s.groups.map((g) => (
              <span key={g} className="font-mono text-[11px] leading-relaxed text-white/62">
                {g}
                <span className="px-1.5 text-white/18" aria-hidden>
                  ·
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Print → Save as PDF. The webpage is the canonical report; this triggers the
   browser's native print-to-PDF (the dark surface is preserved via print CSS in
   index.css) rather than shipping a fabricated file. */
function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45 underline-offset-4 transition-colors hover:text-white/80 hover:underline"
    >
      Print / Save as PDF
    </button>
  );
}
