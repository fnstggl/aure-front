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
   Pareto-dominant win during expensive electricity windows, and at uncapped
   production-scale load that advantage widens against a production-class
   scheduler baseline. The report explains the architecture and reports verified
   results at a high level, without the internal source tree, implementation
   classes, or tuning values. The web page is canonical; a Print to PDF is
   offered. */

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
  { n: "09", id: "result", title: "Result: Uncapped High-Load Replay" },
  { n: "10", id: "methodology", title: "How the +724% Is Computed" },
  { n: "11", id: "baselines", title: "The Production-Class Scheduler Baseline" },
  { n: "12", id: "results", title: "Results" },
  { n: "13", id: "regret", title: "Optimizer Validation" },
  { n: "14", id: "safety", title: "Safety & Deployment Path" },
  { n: "15", id: "limitations", title: "Limitations" },
  { n: "16", id: "future-work", title: "Future Work" },
  { n: "17", id: "evaluation", title: "See How This Translates to Your Fleet" },
  { n: "A", id: "appendix-v1", title: "Benchmark Continuity (V1)" },
  { n: "B", id: "appendix-why", title: "Why It Works (Benchmark V1)" },
  { n: "·", id: "version-history", title: "Version History" },
  { n: "·", id: "references", title: "References" },
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
                <Kicker index="·">Aurelius Technical Report</Kicker>
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
                    +724% average SLA-safe goodput per dollar
                  </div>
                  <p className="mt-3.5 font-mono text-[11.5px] leading-relaxed text-white/46">
                    Mean of +698% / +718% / +755% (PJM / ERCOT / CAISO) vs a production-class
                    scheduler baseline · uncapped replay of public production traces (~1.5M
                    replayed requests) · Pareto-safe at ~84% fewer GPU-hours
                  </p>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/34">
                  <span>Version 0.2</span>
                  <span className="text-white/14">·</span>
                  <span>Updated 30 June 2026</span>
                  <span className="text-white/14">·</span>
                  <span>Simulated high-load replay</span>
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
                  decisions</em>. When candidate generation is made physics-guided, proposing the
                  high-value, coupled bundles the operating regime implies, and searched under a
                  regret audit, Aurelius recovers a Pareto-dominant result during expensive electricity
                  windows, at <Em>zero search regret</Em> against the exhaustive ground truth.
                </p>
                <p className={`${P} mt-4`}>
                  Earlier versions of Aurelius were evaluated under a capped replay harness to isolate
                  algorithmic behavior. This report instead evaluates uncapped, production-scale replay,
                  which better reflects the operating regime of real serving systems and is therefore
                  the primary benchmark going forward. Replaying the full selected public-trace
                  benchmark windows with no per-period request limit (roughly 1.5M requests across PJM,
                  ERCOT, and CAISO), Aurelius averages <Em>+724% higher SLA-safe goodput per dollar</Em>{" "}
                  than a production-class scheduler baseline (per-market <Em>+698% / +718% / +755%</Em>),
                  while holding SLA strictly better and using <Em>~84% fewer GPU-hours</Em>. The number
                  is a simple arithmetic mean of the three per-market deltas; §10 derives it from the
                  underlying values, and §11 describes the baseline. This is a simulated replay on
                  public trace windows: evidence, not a guarantee, and not a production deployment.
                </p>
              </Sec>

              {/* 01 — Problem */}
              <Sec n="01" id="problem" title="01 · Scheduling Starts Too Late">
                <p className={P}>
                  Most schedulers optimize a current-state or local objective: availability, fairness,
                  utilization, latency, queue state, immediate capacity. Each is reasonable in
                  isolation. But the economic outcome of a placement is decided by constraints that
                  arrive <em>after</em> the placement is made: power and capacity headroom, congestion,
                  memory and topology pressure, demand, and the price of electricity, which on public
                  wholesale markets can swing several-fold within a day.
                </p>
                <p className={`${P} mt-4`}>
                  Once a job lands, those costs are largely locked in. An <Em>observe → decide</Em> loop
                  cannot price a constraint it has not yet seen. Aurelius closes that gap with an{" "}
                  <Em>observe → forecast → simulate → decide</Em> loop, a different control
                  architecture, not another scheduler.
                </p>
              </Sec>

              {/* 02 — Architecture */}
              <Sec n="02" id="architecture" title="02 · Forecast → Simulate → Decide">
                <p className={P}>
                  Each control period, Aurelius forecasts the workload and conditions, generates
                  candidate action bundles, simulates each against the forecasted world state, scores
                  it by risk-adjusted SLA-safe goodput per dollar, rejects anything that fails a hard
                  gate, and recommends the best safe bundle, falling back deterministically when
                  forecast confidence is low.
                </p>
                <p className={`${P} mt-4`}>
                  Crucially, it evaluates <Em>coupled action bundles</Em>, not one knob. Workload
                  timing, placement, routing, capacity, batching, and the precision/speculation/clock
                  policy are scored together, because those decisions interact, and, as this report
                  shows, the interactions are exactly where the economic value lives.
                </p>
                <Figure>
                  <WorldModelArchitecture />
                </Figure>
              </Sec>

              {/* 03 — World model */}
              <Sec n="03" id="world-model" title="03 · Predictive World Model">
                <p className={P}>
                  Aurelius maintains a persistent world model of the cluster: a forward model of the
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
                  never mutates the live cluster. Inputs are tagged by provenance (measured,
                  trace-derived, benchmark-calibrated, or modeled), so no result silently treats a
                  modeled value as a measured one.
                </p>
              </Sec>

              {/* 04 — Forecasts */}
              <Sec n="04" id="forecasts" title="04 · Forecasted Constraints">
                <p className={P}>
                  Aurelius forecasts arrival rate, request characteristics (such as prompt and output
                  length), queue dynamics, and infrastructure and pricing conditions, including
                  wholesale electricity price, using specialized forecasting models. Forecasts use
                  only history up to the current period; there is no future-truth leakage into the
                  decision.
                </p>
                <p className={`${PT} mt-4`}>
                  Honest scope: several constraints are represented in the world model but are not yet
                  consumed as planner-input forecasts. Among them are cache-reuse, emergent queue and
                  SLA pressure, and carbon and network-congestion conditions. They are treated as
                  out-of-scope inputs today rather than implied.
                </p>
              </Sec>

              {/* 05 — Surfaces */}
              <Sec n="05" id="surfaces" title="05 · Candidate Decision Surfaces">
                <p className={P}>
                  A candidate is a bundle of decisions across several surfaces. Aurelius distinguishes
                  surfaces that are <Em>active decision levers today</Em> (they change the scored
                  economic outcome and are optimized) from surfaces that are{" "}
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
                  tuning one knob at a time, and which candidates it evaluates is itself a first-class
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
                  regret is measured rather than assumed, the discipline that surfaced the finding in
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
                  Gating is two-tier. Hard constraints (SLA, capacity, power, residency, policy){" "}
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
                  made results <em>worse</em>. The cause was not the controller; it was containment.
                  The planner&rsquo;s candidate set had collapsed to a single surface (the GPU clock),
                  so the bundle that actually wins during an expensive window (
                  <Em>lower precision + aggressive batching + a higher clock</Em>, which packs far more
                  goodput per GPU-hour) was never in the set being evaluated. The optimizer cannot pick
                  what it never sees.
                </p>
                <p className={`${P} mt-4`}>
                  Making candidate generation physics-guided, and searching the coupled set under a
                  regret audit, removes that ceiling. On the same window, simply restoring the right
                  candidate set recovers most of the gain; letting the search reach the coupled
                  combinations the fixed grid misses recovers the rest, and a regret audit confirms it
                  forfeits <Em>nothing</Em> the exhaustive search would have found.
                </p>
              </Sec>

              {/* 09 — Result */}
              <Sec n="09" id="result" title="09 · Result: Uncapped High-Load Replay">
                <p className={P}>
                  The headline result replays the full selected benchmark windows with the per-period
                  request limit removed: the same public serving trace and the same three independent
                  electricity markets&rsquo; expensive price windows (PJM, ERCOT, CAISO), each running
                  at its natural, production-scale volume of roughly 442k–577k requests across three
                  control periods, about 1.5M requests in total. It is the full selected windows at full
                  load, not a sample and not the entire lifetime of the public traces.
                </p>
                <p className={`${P} mt-4`}>
                  At that volume the naive SLA-aware baseline does not complete: its no-batching,
                  no-admission replay cost grows super-linearly and times out, so it is reported as a
                  reference only. Both the <Em>production-class scheduler baseline</Em> (§11) and
                  Aurelius complete at full load, which makes <Em>Aurelius vs the production-class
                  scheduler</Em> the primary, production-comparable comparison: two policies run the
                  identical load, and the one built from real serving-stack components is the bar.
                </p>
                <Figure>
                  <BenchmarkFigure />
                </Figure>
                <p className={`${P} mt-2`}>
                  Across the three markets Aurelius delivers <Em>+724% higher SLA-safe goodput per dollar
                  on average</Em> (per-market +698% / +718% / +755%; full values in §12), with SLA
                  violations cut from ~3.8–4.6% to ~0.1–0.2% and <Em>~84% fewer GPU-hours</Em> at the
                  same served load. That is a Pareto win, not goodput bought by spending more.
                </p>
                <Callout tone="warn">
                  Scope: this is a <span className="text-white/75">simulated</span> replay on public
                  trace windows, <span className="text-white/75">not</span> a production deployment and
                  not a guarantee. The gap is wide in part because a fixed-policy production scheduler
                  degrades under heavy load while Aurelius adapts its economic posture to it; that
                  asymmetry is exactly why high load is more production-like than a small capped sample,
                  but it also means the percentage is load-dependent and must always be quoted with its
                  scope. Magnitudes depend on the serving model&rsquo;s precision/batching bands. A
                  frozen, cap-controlled continuity benchmark (Benchmark V1) is reported in Appendix A so
                  the result can be compared against the prior published numbers.
                </Callout>
              </Sec>

              {/* 10 — Methodology */}
              <Sec n="10" id="methodology" title="10 · How the +724% Is Computed">
                <p className={P}>
                  Evaluation is deterministic simulated replay: a public production serving trace is
                  replayed against a fixed harness with public wholesale-electricity price traces, and
                  every policy is scored on the same windows under a single metric,{" "}
                  <Em>SLA-safe goodput per operator dollar</Em> (gp/$): SLA-meeting requests in the
                  numerator, and infrastructure cost (energy at the prevailing market price plus
                  warm-hold and migration cost) in the denominator. No policy sees future arrivals or
                  future prices; per-request execution time is used rather than predicted, so there is
                  no oracle. The simulator, reward, cost model, and Pareto gate are held identical across
                  every arm.
                </p>
                <p className={`${P} mt-4`}>
                  The headline is built bottom-up, never asserted:
                </p>
                <ol className="mt-4 grid max-w-[70ch] gap-y-2.5">
                  {[
                    ["Uncapped high-load replay.", "Each market's selected window is replayed with the per-period request cap removed, so it runs at its full production-scale volume (PJM ~577k, ERCOT ~443k, CAISO ~530k requests across three control periods)."],
                    ["Per-market gp/$.", "For each market we read Aurelius' gp/$ and the production-class scheduler's gp/$ directly from the run output, with no intermediate rounding."],
                    ["Per-market percent delta.", "Computed straight from those two values as (Aurelius − production) ÷ production: PJM +698.1%, ERCOT +717.8%, CAISO +755.3%."],
                    ["Arithmetic mean across markets.", "The +724% headline is the simple unweighted average of the three per-market deltas: (698.1 + 717.8 + 755.3) ÷ 3 = 723.7%, each market weighted equally, not pooled or request-weighted."],
                  ].map(([h, b]) => (
                    <li key={h as string} className="flex max-w-[70ch] items-start gap-3 text-[13.5px] leading-relaxed text-white/58">
                      <span className="mt-2 inline-block h-px w-4 shrink-0 bg-white/40" aria-hidden />
                      <span><Em>{h}</Em> {b}</span>
                    </li>
                  ))}
                </ol>
                <p className={`${PT} mt-5`}>
                  The naive SLA-aware baseline times out uncapped on all three markets and is therefore
                  excluded from the headline; the production-class scheduler and Aurelius both complete,
                  so the +724% is strictly an Aurelius-vs-production-class-scheduler comparison on
                  identical load. Because the metric is a ratio of equally-weighted per-market deltas,
                  the figure moves with the request volume, and is reported only with its uncapped,
                  full-window scope attached.
                </p>
              </Sec>

              {/* 11 — Baselines */}
              <Sec n="11" id="baselines" title="11 · The Production-Class Scheduler Baseline">
                <p className={P}>
                  The headline bar is a <Em>production-class scheduler baseline</Em>: a single,
                  deterministic, causal heuristic that reacts to recent observable load and sets the
                  serving-stack levers a real modern GPU-fleet deployment runs. It is not a strawman and
                  it is not an Aurelius component; it sees no future prices, no future workload, and
                  none of Aurelius&rsquo; economic, precision, clock, migration, or speculative-decoding
                  arbitrage. It is assembled, in general terms, from the controls that production serving
                  stacks and cluster schedulers actually expose:
                </p>
                <ul className="mt-5 grid max-w-[72ch] gap-y-2.5">
                  {[
                    <>
                      <Em>Continuous (iteration-level) batching</Em>, always on, the defining throughput
                      feature of modern LLM serving.<Ref n={1} /><Ref n={2} />
                    </>,
                    <>
                      <Em>SLA-aware request ordering</Em> with deadline protection, the discipline behind
                      predictable, SLO-driven inference serving.<Ref n={3} />
                    </>,
                    <>
                      <Em>KV / prefix-cache-aware routing</Em>, so requests sharing a prefix reuse cached
                      computation instead of recomputing it.<Ref n={4} />
                    </>,
                    <>
                      <Em>Topology-aware placement</Em> (rack/locality-aware), the standard way cluster
                      schedulers keep communicating work on nearby hardware.<Ref n={5} />
                    </>,
                    <>
                      <Em>Backlog-driven autoscaling with a modest warm-pool headroom</Em> (a standard
                      ~80%-utilization target), never under- or blanket-over-provisioning.<Ref n={6} /><Ref n={7} />
                    </>,
                    <>
                      <Em>Class-based admission</Em> that defers best-effort work only under genuine
                      pressure: overload control, not free shedding.<Ref n={3} />
                    </>,
                  ].map((item, i) => (
                    <li key={i} className="flex max-w-[72ch] items-start gap-3 text-[13.5px] leading-relaxed text-white/58">
                      <span className="mt-2 inline-block h-px w-4 shrink-0 bg-white/40" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className={`${P} mt-5`}>
                  Each lever maps to an established production technique, so the composite is as close to
                  a deployed scheduler as a public replay allows: it is deliberately{" "}
                  <Em>stronger</Em> than the naive SLA-aware policy, and it runs the deployed model
                  as-is. The economic arbitrage Aurelius adds on top is the only difference being
                  measured; the baseline is what a competent operator already runs, not a handicapped
                  reference.
                </p>
                <p className={`${P} mt-4`}>
                  One integrity rule governs every comparison: a baseline that violates SLA on a
                  meaningful fraction of requests is not a valid SLA-safe baseline, and a delta earned by
                  quietly dropping completions is excluded from any headline. The production-class
                  scheduler holds SLA (uncapped violation rate ~3.8–4.6%), so the +724% is a real
                  goodput-per-dollar gap, not completions shed to flatter the ratio.
                </p>
              </Sec>

              {/* 12 — Results */}
              <Sec n="12" id="results" title="12 · Results">
                <Caption>
                  Table 1 · Uncapped high-load replay · Aurelius vs production-class scheduler
                </Caption>
                <ResultTable
                  minW="min-w-[760px]"
                  head={["Market", "Aurelius gp/$", "Production gp/$", "Δ gp/$", "Δ %", "SLA (Aurelius)", "SLA (Production)", "Requests"]}
                  rows={[
                    ["PJM · expensive", "1,041,842", "130,539", "+911,303", "+698.1%", "0.0023", "0.0382", "576,912"],
                    ["ERCOT · expensive", "1,064,602", "130,178", "+934,424", "+717.8%", "0.0013", "0.0447", "442,716"],
                    ["CAISO · expensive", "1,111,915", "130,000", "+981,915", "+755.3%", "0.0018", "0.0458", "529,621"],
                    ["Average / total", "–", "–", "–", "+723.7%", "–", "–", "1,549,249"],
                  ]}
                  emph={[4]}
                />
                <p className={`${PT} mt-3`}>
                  gp/$ and SLA-violation rates are read directly from the run output; the SLA-aware
                  baseline timed out uncapped and is not shown. Δ % is per-market (Aurelius − production)
                  ÷ production; the +724% headline is the average of the three (723.7%, shown unrounded).
                </p>
                <Caption className="mt-12">
                  Table 2 · GPU-hours at the same uncapped load
                </Caption>
                <ResultTable
                  head={["Market", "Aurelius GPU-h", "Production GPU-h", "Δ GPU-hours"]}
                  rows={[
                    ["PJM · expensive", "62.2", "399.9", "−84.4%"],
                    ["ERCOT · expensive", "51.0", "323.7", "−84.3%"],
                    ["CAISO · expensive", "60.0", "391.5", "−84.7%"],
                    ["Total", "173.1", "1,115.1", "−84.5%"],
                  ]}
                  emph={[3]}
                />
                <p className={`${PT} mt-3`}>
                  GPU-hours are reported by each run for the same served requests, so the reduction is
                  computed per market as (production − Aurelius) ÷ production and totals to −84.5%, the
                  ~84% fewer GPU-hours quoted in the headline. This GPU-hours figure belongs to the
                  uncapped high-load replay and must not be mixed with the Benchmark V1 continuity
                  number in Appendix A.
                </p>
              </Sec>

              {/* 13 — Optimizer validation */}
              <Sec n="13" id="regret" title="13 · Optimizer Validation">
                <p className={P}>
                  Because an approximate search could quietly leave value on the table, its loss is
                  measured wherever exhaustive enumeration is feasible. There the bounded coupled-bundle
                  search shows <Em>zero regret</Em> against the exhaustive ground truth in all three
                  markets, at roughly 40 evaluations per decision; it finds the exact safe optimum the
                  exhaustive search finds, far more cheaply. The remaining gap to a forecast oracle
                  (~4.5%) is forecast quality, not search: with search solved, request-characteristic
                  forecasting is the next highest-value lever.
                </p>
              </Sec>

              {/* 14 — Safety */}
              <Sec n="14" id="safety" title="14 · Safety & Deployment Path">
                <p className={P}>
                  Aurelius reads only the metadata a scheduler already exposes (job timing, resource
                  requests, constraints), never payloads or model outputs. Candidate scoring runs
                  read-only; unsafe candidates are rejected at the constraint gate before execution; and
                  when confidence is low the controller falls back deterministically. The path from
                  telemetry to any production change is staged and reversible:
                </p>
                <Figure>
                  <ArchitecturePipeline fig="fig.05" title="deployment path" />
                </Figure>
              </Sec>

              {/* 15 — Limitations */}
              <Sec n="15" id="limitations" title="15 · Limitations">
                <ul className="grid max-w-[70ch] gap-y-3">
                  {[
                    "The headline is a simulated, uncapped replay of selected public-trace windows: evidence of achievable savings, not a guarantee for any specific fleet, and not a production deployment.",
                    "The +724% figure is load-dependent: part of the gap is a fixed-policy production scheduler degrading under heavy uncapped load while Aurelius adapts, so it is reported only with its uncapped, full-window scope, never as a fleet constant.",
                    "Magnitudes are simulator-inferred and depend on the serving model's precision/batching bands; the robust findings are the direction and the zero search regret.",
                    "It replays the selected benchmark windows across three markets, not the entire lifetime of the public traces and not a long-horizon production deployment.",
                    "Simulator fidelity must still be tested against real operator telemetry, the only way to isolate model error.",
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

              {/* 16 — Future work */}
              <Sec n="16" id="future-work" title="16 · Future Work">
                <p className={P}>
                  With search no longer the bottleneck, the residual gap to a forecast oracle points the
                  roadmap at forecast quality first: better request-characteristic and arrival
                  forecasting is the largest measured lever. Beyond that: validating world-model
                  fidelity against real operator telemetry, extending the result across more windows,
                  markets, and workloads, promoting modeled-but-not-yet-optimized surfaces into active
                  levers, and modeling precision quality so the aggressive low-precision ceiling can be
                  claimed safely rather than only as a diagnostic.
                </p>
              </Sec>

              {/* 17 — CTA */}
              <Sec n="17" id="evaluation" title="17 · See How This Translates to Your Fleet">
                <p className={P}>
                  Replay your historical scheduler telemetry, simulate the counterfactual outcomes, and
                  produce an audited savings estimate, without production changes or payload access.
                  Aurelius starts from read-only scheduler metadata and never touches payloads or model
                  outputs.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Action to="/contact" variant="primary" withArrow>
                    Evaluate Aurelius using historical telemetry
                  </Action>
                  <Link
                    to="/"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white/80"
                  >
                    ← Back to home
                  </Link>
                </div>
              </Sec>

              {/* Appendix A — Benchmark Continuity (V1) */}
              <Sec n="A" id="appendix-v1" title="Benchmark Continuity (V1)">
                <p className={P}>
                  Benchmark V1 is the prior, frozen, cap-controlled harness: a small fixed per-period
                  request cap, scored against the strongest SLA-aware baseline. It is a different
                  baseline and a different load from the uncapped result in §9, so the two are reported
                  separately and never averaged together. The numbers below are unchanged from the prior
                  published report, retained for continuity and to support the candidate-generation
                  finding in Appendix B.
                </p>
                <Caption className="mt-8">Table A1 · Benchmark V1, vs strongest SLA-aware baseline</Caption>
                <ResultTable
                  head={["Market", "Baseline goodput/$", "Δ goodput/$", "SLA viol. (base → Aurelius)", "Search regret"]}
                  rows={[
                    ["PJM · expensive", "311,659", "+161.31%", "0.34 → 0.04", "0"],
                    ["ERCOT · expensive", "373,538", "+191.41%", "0.48 → 0.01", "0"],
                    ["CAISO · expensive", "406,767", "+147.85%", "0.51 → 0.02", "0"],
                  ]}
                  emph={[2]}
                />
                <Caption className="mt-12">Table A2 · Benchmark V1 Pareto breakdown (primary window)</Caption>
                <ResultTable
                  head={["Metric", "Baseline", "Aurelius", "Δ"]}
                  rows={[
                    ["SLA-safe goodput / $", "311,659", "814,383", "+161.31%"],
                    ["SLA violation rate", "0.3375", "0.0438", "−87.0%"],
                    ["GPU-hours", "–", "–", "−24.78%"],
                    ["Operator cost", "–", "–", "−23.87%"],
                    ["Candidates evaluated", "–", "~40", "bounded"],
                    ["Search regret vs exhaustive", "–", "0", "0%"],
                  ]}
                  emph={[3]}
                />
                <Caption className="mt-12">Table A3 · Benchmark V1 candidate set vs. result (primary window)</Caption>
                <ResultTable
                  head={["Candidate set", "Δ goodput/$", "SLA vs baseline", "Regret vs exhaustive"]}
                  rows={[
                    ["Single-surface (prior)", "−4.47%", "worse, fails gate", "173.5% forfeited"],
                    ["Physics-guided set", "+100.48%", "better", "30.3%"],
                    ["Physics-guided + coupled search", "+161.31%", "better", "0%"],
                  ]}
                  emph={[1]}
                />
              </Sec>

              {/* Appendix B — Why It Works (Benchmark V1) */}
              <Sec n="B" id="appendix-why" title="Why It Works (Benchmark V1)">
                <p className={`${P} mb-4`}>
                  The mechanism behind the headline is clearest on Benchmark V1, where exhaustive
                  enumeration is tractable and the gain can be attributed exactly. The same mechanism
                  drives the uncapped result in §9; it simply has more load to work against there.
                </p>
                <p className={P}>
                  The decomposition in Table A3 tells the whole story. Restoring the right candidate set,
                  without touching the search, already turns a regression into a large Pareto-safe gain,
                  because the moment the high-value bundle is in the set, the unchanged simulator picks
                  it. Letting the search reach the coupled combinations a fixed grid does not contain
                  adds the rest, and it does so while matching the exhaustive optimum exactly. The prior
                  single-surface set, by contrast, forfeited most of the achievable goodput and never
                  held SLA.
                </p>
                <p className={`${P} mt-4`}>
                  Because the simulator, reward, cost model, and Pareto gate were unchanged, the gain is
                  attributable to <Em>search and candidate generation</Em>, not to a model that was
                  quietly made more optimistic. The zero-regret audit against the exhaustive ground
                  truth is the proof.
                </p>
              </Sec>

              {/* Version history — methodology, not headline numbers */}
              <Sec n="·" id="version-history" title="Version History">
                <p className={`${PT} max-w-[68ch]`}>
                  This documents how the evaluation evolved, not how the headline number moved. Each
                  revision records a methodological change.
                </p>
                <div className="mt-6 grid max-w-[72ch] gap-y-8">
                  {VERSION_HISTORY.map((rel) => (
                    <div key={rel.v}>
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[12px] text-white/80">{rel.v}</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                          {rel.date}
                        </span>
                      </div>
                      <ul className="mt-3 grid gap-y-2">
                        {rel.items.map((it) => (
                          <li key={it} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-white/58">
                            <span className="mt-2 inline-block h-px w-4 shrink-0 bg-white/40" aria-hidden />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Sec>

              {/* References */}
              <Sec n="·" id="references" title="References">
                <p className={`${PT} max-w-[68ch]`}>
                  The production-class scheduler baseline (§11) is assembled from established production
                  serving and cluster-scheduling techniques. These are the primary sources for each
                  component; they are cited for the realism of the baseline&rsquo;s mechanisms, not for
                  any Aurelius result.
                </p>
                <ol className="mt-6 grid max-w-[80ch] gap-y-3">
                  {REFERENCES.map((r) => (
                    <li key={r.n} id={`ref-${r.n}`} className="scroll-mt-24 flex max-w-[80ch] items-baseline gap-3">
                      <span className="font-mono text-[11px] tabular-nums text-white/45">[{r.n}]</span>
                      <span className="text-[13px] leading-relaxed text-white/58">
                        {r.cite}{" "}
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[11.5px] text-white/45 underline-offset-4 transition-colors hover:text-white/80 hover:underline"
                        >
                          {r.host}
                        </a>
                      </span>
                    </li>
                  ))}
                </ol>
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

/* Inline citation marker → jumps to the References section. */
function Ref({ n }: { n: number }) {
  return (
    <a
      href={`#ref-${n}`}
      className="ml-0.5 align-super font-mono text-[9.5px] text-white/45 no-underline transition-colors hover:text-white/85"
      aria-label={`Reference ${n}`}
    >
      [{n}]
    </a>
  );
}

/* References for the production-class scheduler baseline (§11). Primary/credible
   sources only; each is cited for the realism of a specific baseline mechanism. */
const REFERENCES: { n: number; cite: string; url: string; host: string }[] = [
  {
    n: 1,
    cite: "Yu et al. “Orca: A Distributed Serving System for Transformer-Based Generative Models.” OSDI 2022. Iteration-level (continuous) batching.",
    url: "https://www.usenix.org/conference/osdi22/presentation/yu",
    host: "usenix.org",
  },
  {
    n: 2,
    cite: "Kwon et al. “Efficient Memory Management for Large Language Model Serving with PagedAttention” (vLLM). SOSP 2023. Continuous batching and KV-cache management.",
    url: "https://dl.acm.org/doi/10.1145/3600006.3613165",
    host: "dl.acm.org",
  },
  {
    n: 3,
    cite: "Gujarati et al. “Serving DNNs like Clockwork: Performance Predictability from the Bottom Up.” OSDI 2020. SLO-aware scheduling and admission for predictable serving.",
    url: "https://www.usenix.org/conference/osdi20/presentation/gujarati",
    host: "usenix.org",
  },
  {
    n: 4,
    cite: "Zheng et al. “SGLang: Efficient Execution of Structured Language Model Programs” (RadixAttention). 2024. Prefix/KV-cache-aware scheduling and reuse.",
    url: "https://arxiv.org/abs/2312.07104",
    host: "arxiv.org",
  },
  {
    n: 5,
    cite: "SchedMD. “Slurm Workload Manager, Topology Guide.” Topology-aware (switch/locality) placement in production cluster schedulers.",
    url: "https://slurm.schedmd.com/topology.html",
    host: "slurm.schedmd.com",
  },
  {
    n: 6,
    cite: "Kubernetes. “Horizontal Pod Autoscaling.” Utilization-target autoscaling, the standard reactive capacity control.",
    url: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/",
    host: "kubernetes.io",
  },
  {
    n: 7,
    cite: "Rzadca et al. “Autopilot: Workload Autoscaling at Google.” EuroSys 2020. Autoscaling with utilization headroom at production scale.",
    url: "https://dl.acm.org/doi/10.1145/3342195.3387524",
    host: "dl.acm.org",
  },
];

/* Version history — methodology changes only, deliberately not a log of headline
   percentages (a benchmark that became more realistic, not a number that grew). */
const VERSION_HISTORY: { v: string; date: string; items: string[] }[] = [
  {
    v: "v0.2",
    date: "30 June 2026",
    items: [
      "Introduced uncapped, production-scale replay (~1.5M requests) as the primary benchmark.",
      "Added the production-class scheduler baseline, assembled from real serving-stack components.",
      "Added a candidate-regret audit against exhaustive ground truth.",
      "Reported per-market deltas and GPU-hours from the same uncapped replay.",
    ],
  },
  {
    v: "v0.1",
    date: "Initial",
    items: [
      "Initial capped replay benchmark, scored against the strongest SLA-aware baseline.",
    ],
  },
];

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
  minW = "min-w-[560px]",
}: {
  head: string[];
  rows: string[][];
  emph?: number[];
  minW?: string;
}) {
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className={"w-full border-collapse text-left " + minW}>
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
    tierNote: "optimized today; changes the scored economic outcome",
    groups: [
      "Workload timing (admission, ordering, deferral)",
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
