import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/site/primitives";
import { PageFrame, Band, Grid, Kicker, Action } from "@/components/site/structure";
import { WorldModelArchitecture } from "@/components/diagrams/WorldModelArchitecture";
import { WorldModelState } from "@/components/diagrams/WorldModelState";
import { SearchStrategyLadder } from "@/components/diagrams/SearchStrategyLadder";
import { BenchmarkFigure } from "@/components/diagrams/BenchmarkFigure";
import { ArchitecturePipeline } from "@/components/diagrams/ArchitecturePipeline";

/* /technical-report — a systems technical report about what Aurelius is and the
   central finding behind it: a correct predictive world model and objective
   still leave the economic optimum on the table unless the planner actually
   evaluates the right coupled candidate decisions. Made candidate generation
   physics-guided and searched it under a regret audit, Aurelius recovers a
   Pareto-dominant win during expensive electricity windows. The report explains
   the architecture and reports verified results at a high level — without the
   internal source tree, implementation classes, or tuning values. The web page
   is canonical; a Print → Save as PDF is offered. */

const SECTIONS = [
  { n: "00", id: "abstract", title: "Abstract" },
  { n: "01", id: "problem", title: "Scheduling Starts Too Late" },
  { n: "02", id: "architecture", title: "Forecast → Simulate → Decide" },
  { n: "03", id: "world-model", title: "Predictive World Model" },
  { n: "04", id: "forecasts", title: "Forecasted Constraints" },
  { n: "05", id: "surfaces", title: "Candidate Decision Surfaces" },
  { n: "06", id: "search", title: "Search & Candidate Generation" },
  { n: "07", id: "objective", title: "Objective & Constraint Gates" },
  { n: "08", id: "finding", title: "The Bottleneck Was Candidate Generation" },
  { n: "09", id: "result", title: "Result — Expensive Electricity Windows" },
  { n: "10", id: "methodology", title: "Benchmark Methodology" },
  { n: "11", id: "baselines", title: "Baselines" },
  { n: "12", id: "results", title: "Results" },
  { n: "13", id: "why", title: "Why It Works" },
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

              {/* headline result */}
              <Reveal delay={200}>
                <div className="mt-10 max-w-2xl border-l-2 border-white/35 pl-5">
                  <div className="text-[clamp(1.45rem,3.6vw,2.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
                    Up to +191% higher SLA-safe goodput per dollar
                  </div>
                  <p className="mt-3.5 font-mono text-[11.5px] leading-relaxed text-white/46">
                    +147.85% to +191.41% vs the strongest SLA-aware baseline · bounded Azure/Mooncake
                    replay · public PJM / ERCOT / CAISO price traces · Pareto-safe
                  </p>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/34">
                  <span>Version 0.1</span>
                  <span className="text-white/14">·</span>
                  <span>Bounded historical replay</span>
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
                  Aurelius builds a predictive world model of the future cluster state, forecasts the
                  operational and economic constraints a decision will face, simulates candidate
                  workload decisions against that state, and selects the economic optimum subject to
                  SLA, capacity, power, policy, and safety gates.
                </p>
                <p className={`${P} mt-4`}>
                  This report describes a finding that sharpened the architecture. A correct world
                  model and a correct objective are not enough on their own: the economic optimum is
                  only realized if the planner actually evaluates the <em>right coupled candidate
                  decisions</em>. When candidate generation is made physics-guided — proposing the
                  high-value, coupled bundles the operating regime implies — and searched under a
                  regret audit, Aurelius recovers a Pareto-dominant result during expensive electricity
                  windows: <Em>up to +191% higher SLA-safe goodput per dollar</Em>{" "}
                  (<Em>+147.85% to +191.41%</Em>) versus the strongest SLA-aware baseline, with SLA
                  strictly better and zero search regret against the exhaustive ground truth. The
                  result is a bounded historical replay on public traces — evidence, not a guarantee.
                </p>
              </Sec>

              {/* 01 — Problem */}
              <Sec n="01" id="problem" title="01 · Scheduling Starts Too Late">
                <p className={P}>
                  Most schedulers optimize a current-state or local objective: availability, fairness,
                  utilization, latency, queue state, immediate capacity. Each is reasonable in
                  isolation. But the economic outcome of a placement is decided by constraints that
                  arrive <em>after</em> the placement is made — power and capacity headroom, congestion,
                  memory and topology pressure, demand, and the price of electricity, which on public
                  wholesale markets can swing several-fold within a day.
                </p>
                <p className={`${P} mt-4`}>
                  Once a job lands, those costs are largely locked in. An <Em>observe → decide</Em> loop
                  cannot price a constraint it has not yet seen. Aurelius closes that gap with an{" "}
                  <Em>observe → forecast → simulate → decide</Em> loop — a different control
                  architecture, not another scheduler.
                </p>
              </Sec>

              {/* 02 — Architecture */}
              <Sec n="02" id="architecture" title="02 · Forecast → Simulate → Decide">
                <p className={P}>
                  Each control period, Aurelius forecasts the workload and conditions, generates
                  candidate action bundles, simulates each against the forecasted world state, scores
                  it by risk-adjusted SLA-safe goodput per dollar, rejects anything that fails a hard
                  gate, and recommends the best safe bundle — falling back deterministically when
                  forecast confidence is low.
                </p>
                <p className={`${P} mt-4`}>
                  Crucially, it evaluates <Em>coupled action bundles</Em>, not one knob. Workload
                  timing, placement, routing, capacity, batching, and the precision/speculation/clock
                  policy are scored together, because those decisions interact — and, as this report
                  shows, the interactions are exactly where the economic value lives.
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
                  length), queue dynamics, and infrastructure and pricing conditions — including
                  wholesale electricity price — using specialized forecasting models. Forecasts use
                  only history up to the current period; there is no future-truth leakage into the
                  decision.
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

              {/* 06 — Search & candidate generation */}
              <Sec n="06" id="search" title="06 · Search & Candidate Generation">
                <p className={P}>
                  Because the surfaces interact, Aurelius evaluates coupled decision bundles rather than
                  tuning one knob at a time — and which candidates it evaluates is itself a first-class
                  step, not an afterthought. A physics-guided generator proposes a focused set of
                  high-value coupled bundles implied by the operating regime, always including the
                  known-strong candidates so a high-value option is never silently dropped. The set is
                  then searched in a way that captures cross-surface coupling, expanding to more
                  surfaces only when a decision is close and stopping early when the choice is clear.
                </p>
                <Figure>
                  <SearchStrategyLadder />
                </Figure>
                <p className={`${PT} mt-2`}>
                  Where exact enumeration is tractable, the bounded search is scored against it so any
                  regret is measured rather than assumed — the discipline that surfaced the finding in
                  §8.
                </p>
              </Sec>

              {/* 07 — Objective */}
              <Sec n="07" id="objective" title="07 · Objective & Constraint Gates">
                <p className={P}>
                  The objective is <Em>SLA-safe goodput per operator dollar</Em>: the numerator counts
                  requests that met their SLA deadline; the denominator is infrastructure cost,
                  including energy at the prevailing market price and the cost of holding replicas warm
                  and of migrations. A forecast-uncertainty risk penalty enters the same economic
                  objective.
                </p>
                <p className={`${P} mt-4`}>
                  Gating is two-tier. Hard constraints — SLA, capacity, power, residency, policy —{" "}
                  <Em>reject</Em> a candidate outright; the objective only ranks the feasible ones; and
                  a Pareto gate accepts a recommendation only when it beats the baseline{" "}
                  <em>without regressing SLA</em>. Every headline in this report passed that gate. When
                  forecast confidence is low, Aurelius falls back deterministically to a safe default.
                </p>
              </Sec>

              {/* 08 — The finding */}
              <Sec n="08" id="finding" title="08 · The Bottleneck Was Candidate Generation">
                <p className={P}>
                  The finding behind this report is blunt: with the world model, the simulator, the
                  objective, and the safety gate all unchanged, enabling more decision levers initially
                  made results <em>worse</em>. The cause was not the controller — it was containment.
                  The planner&rsquo;s candidate set had collapsed to a single surface (the GPU clock),
                  so the bundle that actually wins during an expensive window —{" "}
                  <Em>lower precision + aggressive batching + a higher clock</Em>, which packs far more
                  goodput per GPU-hour — was never in the set being evaluated. The optimizer cannot pick
                  what it never sees.
                </p>
                <p className={`${P} mt-4`}>
                  Making candidate generation physics-guided, and searching the coupled set under a
                  regret audit, removes that ceiling. On the same window, simply restoring the right
                  candidate set recovers most of the gain; letting the search reach the coupled
                  combinations the fixed grid misses recovers the rest — and a regret audit confirms it
                  forfeits <Em>nothing</Em> the exhaustive search would have found.
                </p>
              </Sec>

              {/* 09 — Result */}
              <Sec n="09" id="result" title="09 · Result — Expensive Electricity Windows">
                <p className={P}>
                  The result is measured on a bounded Azure/Mooncake serving replay, scored against the
                  strongest deployable SLA-aware baseline, across three independent public electricity
                  markets&rsquo; expensive price windows — PJM, ERCOT, and CAISO — using public price
                  traces. In every market the recovered bundle is Pareto-dominant: more SLA-safe goodput
                  per dollar, at lower GPU-hours and lower cost, with SLA strictly better than the
                  baseline.
                </p>
                <Figure>
                  <BenchmarkFigure />
                </Figure>
                <p className={`${P} mt-2`}>
                  The headline is <Em>+147.85% to +191.41% higher SLA-safe goodput per dollar</Em>,
                  with the bounded search landing exactly on the exhaustive optimum (0 search regret) in
                  all three markets at roughly 40 evaluations per decision. On the primary window, the
                  recovered bundle also cut SLA violations by ~87%, GPU-hours by ~25%, and operator cost
                  by ~24% — a true Pareto win, not goodput bought by spending more.
                </p>
                <Callout tone="warn">
                  Scope: this is a bounded, simulator-inferred result on a primary window with
                  multi-market confirmation — <span className="text-white/75">not</span> a production
                  deployment and not a guarantee. The robust findings are the{" "}
                  <span className="text-white/75">direction</span> and the{" "}
                  <span className="text-white/75">0 search regret</span>; absolute magnitudes depend on
                  the serving model&rsquo;s precision/batching bands. An aggressive low-precision mode
                  can score higher still, but it is excluded from every headline here because its
                  quality risk is not yet modeled.
                </Callout>
              </Sec>

              {/* 10 — Methodology */}
              <Sec n="10" id="methodology" title="10 · Benchmark Methodology">
                <p className={P}>
                  Evaluation is deterministic historical replay: a public production serving trace is
                  replayed against a fixed harness with public wholesale-electricity price traces, and
                  Aurelius&rsquo; decisions are compared against deployable baseline policies on the
                  same window under a single metric — SLA-safe goodput per dollar. No policy sees future
                  arrivals or future prices; per-request execution time is used rather than predicted,
                  so there is no oracle. The simulator, reward, cost model, and Pareto gate were held
                  byte-identical across every arm — the only thing that changed is which candidates the
                  planner evaluates, which is what makes the gain attributable to search rather than to
                  tuning.
                </p>
              </Sec>

              {/* 11 — Baselines */}
              <Sec n="11" id="baselines" title="11 · Baselines">
                <p className={P}>
                  A single integrity rule runs through every result: a baseline that violates SLA on a
                  meaningful fraction of requests is not a valid SLA-safe baseline, and a delta earned
                  by quietly dropping completions is excluded from any headline. Aurelius is therefore
                  always compared against the strongest baseline that itself holds SLA — not a weaker
                  policy that would flatter the result. The prior, containment-limited planner is
                  reported alongside as a reference point: it never passes the Pareto gate, because its
                  SLA is worse than the baseline in every market.
                </p>
              </Sec>

              {/* 12 — Results */}
              <Sec n="12" id="results" title="12 · Results">
                <Caption>Table 1 — Multi-market result (expensive price windows)</Caption>
                <ResultTable
                  head={["Market", "Baseline goodput/$", "Δ goodput/$", "SLA viol. (base → Aurelius)", "Search regret"]}
                  rows={[
                    ["PJM · expensive", "311,659", "+161.31%", "0.34 → 0.04", "0"],
                    ["ERCOT · expensive", "373,538", "+191.41%", "0.48 → 0.01", "0"],
                    ["CAISO · expensive", "406,767", "+147.85%", "0.51 → 0.02", "0"],
                  ]}
                  emph={[2]}
                />
                <Caption className="mt-12">Table 2 — Pareto breakdown (primary window)</Caption>
                <ResultTable
                  head={["Metric", "Baseline", "Aurelius", "Δ"]}
                  rows={[
                    ["SLA-safe goodput / $", "311,659", "814,383", "+161.31%"],
                    ["SLA violation rate", "0.3375", "0.0438", "−87.0%"],
                    ["GPU-hours", "—", "—", "−24.78%"],
                    ["Operator cost", "—", "—", "−23.87%"],
                    ["Candidates evaluated", "—", "~40", "bounded"],
                    ["Search regret vs exhaustive", "—", "0", "0%"],
                  ]}
                  emph={[3]}
                />
                <Caption className="mt-12">Table 3 — Candidate set vs. result (primary window)</Caption>
                <ResultTable
                  head={["Candidate set", "Δ goodput/$", "SLA vs baseline", "Regret vs exhaustive"]}
                  rows={[
                    ["Single-surface (prior)", "−4.47%", "worse — fails gate", "173.5% forfeited"],
                    ["Physics-guided set", "+100.48%", "better", "30.3%"],
                    ["Physics-guided + coupled search", "+161.31%", "better", "0%"],
                  ]}
                  emph={[1]}
                />
              </Sec>

              {/* 13 — Why it works */}
              <Sec n="13" id="why" title="13 · Why It Works">
                <p className={P}>
                  The decomposition in Table 3 tells the whole story. Restoring the right candidate set
                  — without touching the search — already turns a regression into a large Pareto-safe
                  gain, because the moment the high-value bundle is in the set, the unchanged simulator
                  picks it. Letting the search reach the coupled combinations a fixed grid does not
                  contain adds the rest, and it does so while matching the exhaustive optimum exactly.
                  The prior single-surface set, by contrast, forfeited most of the achievable goodput
                  and never held SLA.
                </p>
                <p className={`${P} mt-4`}>
                  Because the simulator, reward, cost model, and Pareto gate were unchanged, the gain is
                  attributable to <Em>search and candidate generation</Em> — not to a model that was
                  quietly made more optimistic. The zero-regret audit against the exhaustive ground
                  truth is the proof.
                </p>
              </Sec>

              {/* 14 — Optimizer validation */}
              <Sec n="14" id="regret" title="14 · Optimizer Validation">
                <p className={P}>
                  Because an approximate search could quietly leave value on the table, its loss is
                  measured wherever exhaustive enumeration is feasible. Here the bounded coupled-bundle
                  search shows <Em>zero regret</Em> against the exhaustive ground truth in all three
                  markets, at roughly 40 evaluations per decision — it finds the exact safe optimum the
                  exhaustive search finds, far more cheaply. The remaining gap to a forecast oracle
                  (~4.5%) is forecast quality, not search: with search solved, request-characteristic
                  forecasting is the next highest-value lever.
                </p>
              </Sec>

              {/* 15 — Safety */}
              <Sec n="15" id="safety" title="15 · Safety & Deployment Path">
                <p className={P}>
                  Aurelius reads only the metadata a scheduler already exposes — job timing, resource
                  requests, constraints — never payloads or model outputs. Candidate scoring runs
                  read-only; unsafe candidates are rejected at the constraint gate before execution; and
                  when confidence is low the controller falls back deterministically. The path from
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
                    "The result is a bounded historical replay on public traces — evidence of achievable savings, not a guarantee for any specific fleet.",
                    "Magnitudes are simulator-inferred and depend on the serving model's precision/batching bands; the robust findings are the direction and the zero search regret.",
                    "It is one primary window with multi-market confirmation, not a long-horizon production deployment.",
                    "Simulator fidelity must still be tested against real operator telemetry — that is the only way to isolate model error.",
                    "An aggressive low-precision mode can score higher but is excluded from every headline because its quality risk is not yet modeled.",
                    "The largest gains appear during expensive electricity windows; quiet, cheap-power periods leave less to recover.",
                    "Some surfaces are modeled but not yet active production levers, and several constraints are represented but not yet forecast inputs.",
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
                  With search no longer the bottleneck, the residual gap to a forecast oracle points the
                  roadmap at forecast quality first — better request-characteristic and arrival
                  forecasting is the largest measured lever. Beyond that: validating world-model
                  fidelity against real operator telemetry, extending the result across more windows,
                  markets, and workloads, promoting modeled-but-not-yet-optimized surfaces into active
                  levers, and modeling precision quality so the aggressive low-precision ceiling can be
                  claimed safely rather than only as a diagnostic.
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
