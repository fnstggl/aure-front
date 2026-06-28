import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/site/primitives";
import { PageFrame, Band, Grid, Kicker, Action } from "@/components/site/structure";
import { WorldModelArchitecture } from "@/components/diagrams/WorldModelArchitecture";
import { WorldModelState } from "@/components/diagrams/WorldModelState";
import { SearchStrategyLadder } from "@/components/diagrams/SearchStrategyLadder";
import { BenchmarkFigure } from "@/components/diagrams/BenchmarkFigure";
import { ArchitecturePipeline } from "@/components/diagrams/ArchitecturePipeline";

/* /technical-report — a systems technical report, not a whitepaper.
   Every number, file path, class name, and surface listed here is grounded in
   the Aurelius research repository (aurelius/environment, aurelius/forecasting,
   aurelius/optimization, aurelius/traces) and its audit documents (research/).
   Two result families are reported separately and never mixed: the Alibaba
   GenAI 2026 trace case study and the full-action-layer MPC validation. The web
   page is the canonical report; a browser Print → Save as PDF is offered. */

const SECTIONS = [
  { n: "00", id: "abstract", title: "Abstract" },
  { n: "01", id: "problem", title: "Scheduling Starts Too Late" },
  { n: "02", id: "architecture", title: "Forecast → Simulate → Decide" },
  { n: "03", id: "world-model", title: "Predictive World Model" },
  { n: "04", id: "forecasts", title: "Forecasted Constraints" },
  { n: "05", id: "surfaces", title: "Candidate Decision Surfaces" },
  { n: "06", id: "search", title: "Search & Optimization" },
  { n: "07", id: "objective", title: "Objective & Constraint Gates" },
  { n: "08", id: "case-study", title: "Case Study — Alibaba GenAI 2026" },
  { n: "09", id: "mpc-validation", title: "Full Aurelius MPC Validation" },
  { n: "10", id: "methodology", title: "Benchmark Methodology" },
  { n: "11", id: "baselines", title: "Baselines" },
  { n: "12", id: "results", title: "Results" },
  { n: "13", id: "ablations", title: "Contribution Analysis" },
  { n: "14", id: "regret", title: "Search Regret & Optimizer Validation" },
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
                  How Aurelius builds a predictive world model of AI infrastructure, forecasts future
                  constraints, simulates candidate workload decisions, and chooses the economic
                  optimum — subject to SLA, capacity, power, policy, and safety gates — before
                  execution.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-white/40">
                  Aurelius is not a scheduler or a one-knob optimizer. It is a predictive control
                  architecture: current cluster state → predictive world model → forecast future
                  constraints → simulate candidate decisions → score economic outcomes → constraint
                  gate → recommend / execute.
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
                  simulates candidate workload decisions against that forecasted state, and selects
                  the economic optimum subject to SLA, capacity, power, policy, and safety gates.
                </p>
                <p className={`${P} mt-4`}>
                  Two result families are reported here, kept strictly separate. As a workload
                  generalization <em>case study</em>, the Alibaba GenAI 2026 stable-diffusion LoRA
                  trace yields <Em>+38.2% SLA-safe goodput per dollar</Em> and <Em>−27.6% GPU-hours</Em>{" "}
                  against an SLA-safe baseline, with both arms at 0.000% SLA violations. As the{" "}
                  <em>current-architecture validation</em>, the full Aurelius MPC — every implemented
                  action surface live — reaches <Em>+82.1% SLA-safe goodput/$</Em> over the strongest
                  SLA-aware baseline on a bounded serving window. The first is trace-backed and
                  attributed; the second is directionally robust with a simulator-inferred magnitude.
                  Neither is a production deployment, and neither is a guarantee for any specific
                  fleet.
                </p>
                <Callout>
                  A widely-quoted <code className="text-white/70">+86.9% / +89%</code> figure compares
                  against an <code className="text-white/70">sla_aware</code> baseline that violates
                  SLA on 6.214% of requests. The repository flags that baseline as invalid, so it is
                  deliberately <span className="text-white/75">not</span> the headline here. See §8 and §11.
                </Callout>
              </Sec>

              {/* 01 — Problem */}
              <Sec n="01" id="problem" title="01 · Scheduling Starts Too Late">
                <p className={P}>
                  Most schedulers optimize a current-state or local objective: availability, fairness,
                  utilization, latency, queue state, immediate capacity. Each is reasonable in
                  isolation. But the economic outcome of a placement is decided by constraints that
                  arrive <em>after</em> the placement is made — power and capacity headroom,
                  congestion, memory and topology pressure, demand and pricing, cache locality, model
                  affinity, the warm/cold state of a replica, migration cost, and the way batching,
                  precision, and speculative decoding interact under load.
                </p>
                <p className={`${P} mt-4`}>
                  Once a job lands, those costs are largely locked in. An <Em>observe → decide</Em>{" "}
                  loop cannot price a constraint it has not yet seen. Aurelius closes that gap with an{" "}
                  <Em>observe → forecast → simulate → decide</Em> loop: it advances a model of the
                  cluster forward in time, prices each candidate decision against the state it will
                  actually meet, and commits the economic optimum ahead of execution.
                </p>
              </Sec>

              {/* 02 — Architecture */}
              <Sec n="02" id="architecture" title="02 · Forecast → Simulate → Decide">
                <p className={P}>
                  Aurelius is an advisory predictive controller. The control loop is implemented as{" "}
                  <Path>ModelPredictiveEconomicController</Path> in{" "}
                  <Path>aurelius/environment/controller.py</Path>: each control period it forecasts the
                  workload, enumerates candidate action bundles, simulates each against the forecasted
                  world state on a read-only clone, scores it by risk-adjusted SLA-safe goodput per
                  dollar, rejects anything that fails a hard gate, and returns the best safe bundle —
                  or falls back deterministically when forecast confidence is low.
                </p>
                <p className={`${P} mt-4`}>
                  It evaluates <Em>coupled action bundles</Em>, not one knob. A bundle spans capacity,
                  ordering, admission, routing, batching, prewarm, placement, migration, precision,
                  speculative decoding, and clock at once, because those surfaces interact.
                </p>
                <Figure>
                  <WorldModelArchitecture />
                </Figure>
              </Sec>

              {/* 03 — World model */}
              <Sec n="03" id="world-model" title="03 · Predictive World Model">
                <p className={P}>
                  The world model is a persistent, canonical representation of the cluster —{" "}
                  <Path>CanonicalWorldState</Path> in <Path>aurelius/environment/world_state.py</Path>{" "}
                  — not a snapshot of free GPUs. It carries replica, server, rack, placement, warm,
                  queue, migration, and cost sub-states, each a typed dataclass:
                </p>
                <Figure>
                  <WorldModelState />
                </Figure>
                <p className={`${P} mt-2`}>
                  The transition model is <Path>simulate_period()</Path> in{" "}
                  <Path>world_simulator.py</Path>, which advances the state one control period
                  (<code className="text-white/70">period_seconds = 60</code>) at a time — planning
                  prewarm, placement, and migration, then folding in cold-start, warm-capacity, and
                  topology effects to produce a <Path>PeriodOutcome</Path> (SLA-safe goodput,
                  GPU-hours, warm-hold and migration cost). Each candidate is scored on a{" "}
                  <Path>clone_world_state_for_candidate()</Path> copy, so scoring never mutates the
                  real state. Inputs are fidelity-tagged in code —{" "}
                  <code className="text-white/70">TRACE_EXACT</code>,{" "}
                  <code className="text-white/70">TRACE_DERIVED_SAMPLE</code>,{" "}
                  <code className="text-white/70">BENCHMARK_DERIVED</code>,{" "}
                  <code className="text-white/70">INFERRED</code> — so no result silently treats a
                  modeled value as measured.
                </p>
              </Sec>

              {/* 04 — Forecasts */}
              <Sec n="04" id="forecasts" title="04 · Forecasted Constraints">
                <p className={P}>
                  Forecasting lives in <Path>aurelius/forecasting/</Path>. The planner consumes five
                  forecasts today — <code className="text-white/70">arrival_rate</code>,{" "}
                  <code className="text-white/70">output_length</code>,{" "}
                  <code className="text-white/70">prompt_length</code>,{" "}
                  <code className="text-white/70">interarrival_cv</code>, and{" "}
                  <code className="text-white/70">electricity_price</code> — produced by forecasters
                  including <Path>CaraOutputLengthForecaster</Path>,{" "}
                  <Path>CaraLatencyForecaster</Path>, <Path>CaraQueueForecaster</Path>,{" "}
                  <Path>CachePrefixForecaster</Path>, <Path>PriceModel</Path>, and{" "}
                  <Path>CarbonModel</Path>. Forecasts use only history up to the current period — no
                  future-truth leakage.
                </p>
                <p className={`${PT} mt-4`}>
                  Honest scope: several constraints are represented in the world model but are{" "}
                  <span className="text-white/60">not yet consumed as planner-input forecasts</span> —
                  KV-reuse (planning uses synthetic unique prefixes), queue pressure and SLA pressure
                  (emergent from arrival + service, not forecast inputs), and carbon, weather, and
                  network congestion (not wired into the MPC objective). These are stated as absent in{" "}
                  <Path>mpc_attribution.json</Path> rather than implied.
                </p>
              </Sec>

              {/* 05 — Surfaces */}
              <Sec n="05" id="surfaces" title="05 · Candidate Decision Surfaces">
                <p className={P}>
                  The action space is the single source of truth in{" "}
                  <Path>aurelius/environment/actions.py</Path>, governed by{" "}
                  <Path>action_registry.py</Path>. Every surface is tagged by status, and the planner
                  may only optimize <code className="text-white/70">CONNECTED</code> surfaces — those
                  that actually change the scored reward. A bundle that tries to set a{" "}
                  <code className="text-white/70">PLANNED</code> surface is rejected by{" "}
                  <Path>validate_action_bundle()</Path>, so the report cannot claim a knob that is not
                  wired.
                </p>
                <SurfaceTable />
                <p className={`${PT} mt-5`}>
                  Routing reaches the reward through a KV-service-factor channel (Mooncake prefix
                  reuse); prewarm, placement, and migration reach it through the world simulator;
                  precision, speculative decoding, and clock reach it through the roofline serving
                  model.
                </p>
              </Sec>

              {/* 06 — Search */}
              <Sec n="06" id="search" title="06 · Search & Optimization">
                <p className={P}>
                  A full bundle space is too large to brute-force, but most windows are small enough
                  that exhaustive enumeration is tractable — and where it is, the loss of any
                  approximate search is <Em>measured</Em>, never assumed away. This is{" "}
                  <Path>AdaptiveSearchPlanner</Path> in{" "}
                  <Path>aurelius/environment/search_planner.py</Path>. It chooses a strategy from the
                  raw candidate count and emits a per-decision <Path>SearchPlan</Path> record (raw
                  count, strategy, candidates evaluated, best reward, estimated regret, selected
                  bundle, runtime).
                </p>
                <Figure>
                  <SearchStrategyLadder />
                </Figure>
                <ul className="mt-2 grid max-w-[68ch] gap-y-2.5">
                  {[
                    ["exhaustive_cartesian", "full product when raw count ≤ 4096 · deterministic · regret 0 by construction · the basis for regret audits."],
                    ["beam_search (+ local)", "the default medium-space optimizer: keep the top-6 partial bundles, add one surface at a time, then coordinate-polish the winner — captures coupled interactions (precision×batching, routing×cache, capacity×batching)."],
                    ["coordinate_descent", "cheap local search; moves one surface at a time, so it has measured regret on coupled cases — demoted to a fallback / local-improvement step."],
                    ["cross_entropy / random_restart", "seeded, deterministic global search reserved for very high-interaction spaces; bought nothing on the audited fixtures, so they stay optional."],
                  ].map(([k, v]) => (
                    <li key={k} className="flex max-w-[68ch] flex-col gap-1 border-l border-white/20 pl-4 sm:flex-row sm:gap-3">
                      <span className="shrink-0 font-mono text-[12px] text-white/80 sm:w-[200px]">{k}</span>
                      <span className="text-[13px] leading-relaxed text-white/52">{v}</span>
                    </li>
                  ))}
                </ul>
                <p className={`${PT} mt-5`}>
                  The candidate generator is roofline-pruned: each roofline surface is restricted to
                  the regime where it can help (e.g. speculative decoding only when memory-bandwidth
                  bound), and co-location / prefill-decode disaggregation are frozen off with a
                  recorded reason. Pruning the search space never changes the reward — a pruned
                  candidate would score neutral or worse through the physics.
                </p>
              </Sec>

              {/* 07 — Objective */}
              <Sec n="07" id="objective" title="07 · Objective & Constraint Gates">
                <p className={P}>
                  The canonical reward is <Em>SLA-safe goodput per operator dollar</Em>: the numerator
                  counts requests that met their SLA deadline; the denominator is infrastructure cost
                  — base GPU cost plus warm-hold and migration penalties. The cost decomposition lives
                  in <Path>ObjectiveFunction</Path> (<Path>aurelius/optimization/objective.py</Path>),
                  whose components include energy cost (with PUE), carbon cost, a forecast-uncertainty
                  risk penalty, SLA-penalty cost, inter-region data-transfer cost, queue-delay cost,
                  and GPU-health cost.
                </p>
                <p className={`${P} mt-4`}>
                  Gating is two-tier. Hard constraints — SLA, capacity, power, residency, policy —{" "}
                  <Em>reject</Em> a candidate outright; the objective only ranks feasible candidates;
                  a Pareto gate records whether the chosen bundle beats each baseline without
                  regressing SLA (<code className="text-white/70">pareto_safe_vs</code>). When forecast
                  confidence drops below <code className="text-white/70">confidence_min = 0.15</code>,
                  the controller falls back deterministically to the SLA-aware action
                  (<code className="text-white/70">backlog_aware · abs_conformal · off</code>).
                </p>
              </Sec>

              {/* 08 — Case study */}
              <Sec n="08" id="case-study" title="08 · Case Study — Alibaba GenAI 2026">
                <p className={P}>
                  To test whether the gains generalize beyond text-generation traces, Aurelius was
                  replayed on the Alibaba <Path>cluster-trace-v2026-GenAI</Path>{" "}
                  (<Path>lora_request_trace.csv</Path>) — stable-diffusion LoRA serving, a materially
                  different, multi-model, image-generation workload. 26,824 raw rows filter to 26,392
                  valid requests across 553 sixty-second ticks, priced at $3.00/GPU-hr, with{" "}
                  <code className="text-white/70">SLA = 2.0 × exec_time + 30s</code> and Erlang-C
                  M/M/c provisioning at ρ = 0.65. Harness:{" "}
                  <Path>aurelius/traces/genai_ablation.py</Path>.
                </p>
                <Figure>
                  <BenchmarkFigure />
                </Figure>
                <p className={`${P} mt-2`}>
                  The honest headline compares two SLA-safe arms:{" "}
                  <code className="text-white/70">constraint_aware</code> at 9.8514 gp/$ (893 GPU-hrs)
                  versus <code className="text-white/70">constraint_aware_no_affinity</code> at 7.1291
                  gp/$ (1,234 GPU-hrs) — <Em>+38.2% goodput/$</Em> and <Em>−27.6% GPU-hours</Em>, both
                  at 0.000% timeout (26,392/26,392 SLA-safe). The decision being optimized is
                  infrastructure-level: adapter prewarming / model-affinity routing and anticipatory
                  Erlang-C sizing — not tenant-side arbitrage. A Shapley decomposition attributes{" "}
                  <Em>61.7%</Em> of the gain to model affinity / prewarming (cold start falls from
                  ~22.85s without affinity to ~2.79s with it) and 38.3% to anticipatory sizing, with
                  ~0% interaction.
                </p>
                <Callout tone="warn">
                  Scope of this case study: it is a standalone simulation
                  (<code className="text-white/70">genai_backtest.py</code>) and is{" "}
                  <span className="text-white/75">not yet routed through AureliusOptimizer</span>. It
                  is benchmark-realism evidence of the affinity/sizing mechanism on a new workload, not
                  a claim that the production controller has been run on this trace. On a single-model
                  stream the affinity benefit shrinks toward zero.
                </Callout>
              </Sec>

              {/* 09 — MPC validation */}
              <Sec n="09" id="mpc-validation" title="09 · Full Aurelius MPC Validation">
                <p className={P}>
                  Separately, the complete controller was validated with every implemented surface
                  live — routing, batching, capacity, placement, migration, prewarm, precision,
                  speculative decoding, GPU clock, admission, ordering — on a bounded Azure + Mooncake
                  serving window (hybrid cost, Pareto gate). Artifact:{" "}
                  <Path>data/external/mpc_controller/mpc_attribution.json</Path>; write-up:{" "}
                  <Path>research/MPC_VALIDATION_REPORT.md</Path>.
                </p>
                <p className={`${P} mt-4`}>
                  The full Aurelius MPC reaches <Em>183,152 SLA-safe goodput/$</Em> against the
                  strongest SLA-aware baseline (<code className="text-white/70">sla_aware</code>) at
                  100,555 — <Em>+82.1%</Em> — over 120 evaluation periods. No knobs were disabled; the
                  adaptive beam + local search ran over the full connected space with online
                  diagnostics on.
                </p>
                <Callout>
                  Honesty, per the artifact: the <span className="text-white/75">direction</span> — the
                  MPC substantially beats the SLA-aware baseline with all surfaces live — is the robust
                  finding. The <span className="text-white/75">magnitude</span> is simulator-inferred on
                  a bounded window. Baselines are deployable fixed policies with no oracle and no future
                  information.
                </Callout>
              </Sec>

              {/* 10 — Methodology */}
              <Sec n="10" id="methodology" title="10 · Benchmark Methodology">
                <p className={P}>
                  Evaluation is deterministic historical replay: a public production trace is replayed
                  step-for-step against a fixed harness, and Aurelius&rsquo; decisions are compared
                  against deployable baseline policies on the same trace under a single metric —
                  SLA-safe goodput per dollar. Serving physics is queue-aware M/M/c with Erlang-C
                  provisioning. No policy sees future arrivals; anticipatory sizing uses EWMA arrival
                  forecasts, and per-request execution time is used rather than predicted (no token
                  oracle). The Alibaba run additionally satisfies a same-conditions checklist (same
                  trace, SLA, cost denominator, serving physics, KPI; baseline passes the SLA gate; p99
                  well under the SLA ceiling).
                </p>
              </Sec>

              {/* 11 — Baselines */}
              <Sec n="11" id="baselines" title="11 · Baselines">
                <p className={P}>
                  An integrity rule runs through the repository: a baseline with &gt; 0% SLA violations
                  is not a valid SLA-safe baseline, and a large delta earned by dropping completions is
                  excluded from any headline. The full Alibaba factorial makes this concrete:
                </p>
                <AblationTable />
                <p className={`${PT} mt-4`}>
                  The MPC validation (§9) compares against <code className="text-white/70">fifo</code>{" "}
                  (98,842 gp/$), <code className="text-white/70">greedy</code> (94,054), and the
                  SLA-safe <code className="text-white/70">sla_aware</code> (100,555). The two{" "}
                  <code className="text-white/70">sla_aware</code> baselines belong to different traces
                  and are never compared across experiments.
                </p>
              </Sec>

              {/* 12 — Results */}
              <Sec n="12" id="results" title="12 · Results">
                <Caption>Table 1 — Headline result (two experiments, kept separate)</Caption>
                <ResultTable
                  head={["Experiment", "Trace / workload", "Baseline", "Metric", "Δ", "Notes"]}
                  rows={[
                    ["Alibaba GenAI 2026", "lora_request_trace · SD-LoRA serving", "constraint_aware_no_affinity (SLA-safe)", "SLA-safe goodput/$", "+38.2%", "9.8514 vs 7.1291 · 0% violations both arms"],
                    ["Full Aurelius MPC", "bounded Azure + Mooncake window", "sla_aware (best SLA-safe)", "SLA-safe goodput/$", "+82.1%", "183,152 vs 100,555 · direction robust, magnitude simulator-inferred"],
                  ]}
                  emph={[4]}
                />
                <Caption className="mt-12">Table 2 — Resource efficiency</Caption>
                <ResultTable
                  head={["Experiment", "GPU-hours baseline", "GPU-hours Aurelius", "Δ", "Energy", "Notes"]}
                  rows={[
                    ["Alibaba GenAI 2026", "1,234", "893", "−27.6%", "not separately reported", "−341 GPU-hrs · both arms SLA-safe"],
                    ["Full Aurelius MPC", "not reported in artifact", "—", "—", "price in objective; no shifting action", "headline reported as goodput/$, not GPU-hours"],
                  ]}
                  emph={[3]}
                />
              </Sec>

              {/* 13 — Ablations */}
              <Sec n="13" id="ablations" title="13 · Contribution Analysis">
                <Caption>Table 3 — Where the gain comes from</Caption>
                <ResultTable
                  head={["Experiment", "Component", "Contribution", "Evidence source", "Notes"]}
                  rows={[
                    ["Alibaba GenAI", "Model affinity / prewarming", "61.7%", "genai_ablation.py · Shapley", "cold start 22.85s → 2.79s"],
                    ["Alibaba GenAI", "Anticipatory sizing", "38.3%", "genai_ablation.py · Shapley", "EWMA arrival forecast, no oracle"],
                    ["Alibaba GenAI", "Interaction", "~0%", "Shapley", "contributions are additive"],
                    ["Full MPC", "output_length forecast", "62.8%", "mpc_attribution.json · leave-one-out", "share of measured forecast regret"],
                    ["Full MPC", "prompt_length forecast", "24.7%", "leave-one-out", ""],
                    ["Full MPC", "interarrival_cv forecast", "12.3%", "leave-one-out", ""],
                    ["Full MPC", "arrival_rate forecast", "0.3%", "leave-one-out", ""],
                  ]}
                  emph={[2]}
                />
              </Sec>

              {/* 14 — Regret */}
              <Sec n="14" id="regret" title="14 · Search Regret & Optimizer Validation">
                <p className={P}>
                  Regret is defined as{" "}
                  <code className="text-white/70">exhaustive_best − chosen_reward</code>, scored on the
                  full evaluator and reported on every decision where exhaustive enumeration fits
                  (<Path>research/MPC_SEARCH_REGRET_AUDIT.md</Path>).
                </p>
                <Caption className="mt-8">Table 4 — Search regret audit (selected experiments)</Caption>
                <ResultTable
                  head={["Experiment", "Exhaustive feasible", "Beam regret", "Coordinate regret", "Finding"]}
                  rows={[
                    ["Independent-action fixture", "yes", "0", "0", "both find the separable optimum"],
                    ["Coupled precision + batching", "yes (raw 81–486)", "0", "> 0", "beam captures fp8×aggressive; coordinate misses it"],
                    ["Coupled routing + cache", "yes", "0", "may miss", "beam keeps both hypotheses"],
                    ["Azure sampled decisions (dt=60)", "no (raw ≈ 2·10⁵)", "beam + local", "—", "local improved 3/32 decisions; residual is planning/eval parity, not search"],
                    ["Small dt=60, reduced surfaces", "yes", "≈ 0", "> 0 on coupled periods", "confirms beam matches exhaustive"],
                  ]}
                  emph={[2]}
                />
                <p className={`${P} mt-6`}>
                  Beam search has ≈ zero regret versus exhaustive on every fixture where exhaustive is
                  feasible, including the coupled cases that defeat coordinate descent — so beam + local
                  improvement is the right default. Coordinate descent has real, measured regret on
                  coupled fixtures. CEM / random-restart bought nothing on these spaces. The MPC
                  regret decomposition attributes <Em>100%</Em> of the remaining planner regret (24,897
                  gp/$) to forecast quality, <Em>0%</Em> to search, and <Em>0%</Em> to the objective;
                  world-model fidelity is explicitly marked unmeasurable in pure simulation.
                </p>
              </Sec>

              {/* 15 — Safety */}
              <Sec n="15" id="safety" title="15 · Safety & Deployment Path">
                <p className={P}>
                  Aurelius reads only the metadata a scheduler already exposes — job timing, resource
                  requests, constraints — never payloads or model outputs. Candidate scoring runs on a
                  read-only clone; unsafe candidates are rejected at the constraint gate before
                  execution; and when confidence is low the controller falls back deterministically.
                  The path from telemetry to any production change is staged and reversible:
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
                    "The full-MPC +82.1% magnitude is simulator-inferred on a bounded window; only its direction is robust.",
                    "World-model fidelity is unmeasurable in pure simulation — isolating simulator error requires real serving telemetry.",
                    "The Alibaba GenAI case study is a standalone harness, not yet routed through AureliusOptimizer.",
                    "Several constraints (KV-reuse, queue/SLA pressure, carbon, weather, congestion) are modeled but not yet consumed as planner-input forecasts.",
                    "Model-affinity gains are workload-dependent: on a single-model stream the benefit approaches zero.",
                    "Energy shifting is PLANNED, not connected — electricity price is in the objective, but there is no temporal-shift action yet.",
                    "Co-location and prefill/decode disaggregation are SIMULATED_ONLY: modeled in the roofline, not live reward actions.",
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
                  The regret decomposition makes the roadmap concrete, ordered by measured impact: a
                  better <Em>output_length</Em> forecaster (62.8% of the measured forecast regret),
                  then <Em>prompt_length</Em> (24.7%) and <Em>interarrival_cv</Em> (12.3%); real
                  serving telemetry to attribute world-model fidelity (the only way to isolate
                  simulator error); wiring the SIMULATED_ONLY surfaces into the reward path; and adding
                  the temporal energy-shift action so electricity price becomes an actionable lever,
                  not only an objective term. Additional public trace families and multi-region
                  rollouts under live constraints follow.
                </p>
              </Sec>

              {/* 18 — CTA */}
              <Sec n="18" id="evaluation" title="18 · Run It On Your Fleet">
                <p className={P}>
                  Aurelius can start with read-only scheduler metadata, replay your historical
                  decisions, simulate the counterfactual outcomes, and produce an audited savings
                  report — without payload access or production impact. The same evaluation in this
                  report runs on your traces.
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

/* Inline code/path callout — file paths, class names, function names. */
function Path({ children }: { children: React.ReactNode }) {
  return (
    <code className="whitespace-nowrap rounded-[2px] border border-white/12 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12px] text-white/72">
      {children}
    </code>
  );
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
      <table className="w-full min-w-[640px] border-collapse text-left">
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

/* Candidate surface table — status-grouped, grounded in actions.py. */
const SURFACES: { status: string; surfaces: string; reach: string }[] = [
  {
    status: "CONNECTED",
    surfaces:
      "capacity · ordering · admission · routing · capacity_multiplier · batching · prewarm · placement · migration · precision · spec_decode · clock",
    reach: "changes the scored reward — optimized by default",
  },
  {
    status: "SIMULATED_ONLY",
    surfaces: "colocation · prefill_decode · kv_routing · topology",
    reach: "modeled in the physics, not yet a live reward action — opt-in",
  },
  {
    status: "PLANNED",
    surfaces: "kv_placement · energy",
    reach: "never enumerated — represented, not actuatable today",
  },
];

function SurfaceTable() {
  return (
    <div className="mt-7 grid gap-2.5">
      {SURFACES.map((s) => (
        <div key={s.status} className="border border-white/20 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span
              className={
                "font-mono text-[11px] uppercase tracking-[0.12em] " +
                (s.status === "CONNECTED" ? "text-white" : "text-white/55")
              }
            >
              {s.status}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/35">{s.reach}</span>
          </div>
          <div className="mt-2 font-mono text-[12px] leading-relaxed text-white/62">{s.surfaces}</div>
        </div>
      ))}
    </div>
  );
}

/* Alibaba full-factorial ablation table (verbatim from the trace report). */
function AblationTable() {
  const rows: [string, string, string, string, string, boolean][] = [
    ["constraint_aware", "9.8514", "26,392", "0.000%", "893", true],
    ["constraint_aware_no_affinity", "7.1291", "26,392", "0.000%", "1,234", true],
    ["fifo_plus_affinity", "3.1817", "26,392", "0.000%", "2,765", true],
    ["fifo", "1.7676", "26,392", "0.000%", "4,977", true],
    ["sla_aware", "5.2720", "17,888", "6.214%", "1,131", false],
    ["queue_aware", "5.3823", "16,147", "8.746%", "1,000", false],
    ["utilization_aware", "6.9265", "18,182", "8.890%", "875", false],
  ];
  return (
    <div className="mt-6 -mx-1 overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/30">
            {["Config", "gp/$", "SLA-safe", "Timeout%", "GPU-hrs", "Valid?"].map((h) => (
              <th key={h} className="px-3 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/50">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-white/10">
              <td className="px-3 py-2.5 font-mono text-[12px] text-white/72">{r[0]}</td>
              <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-white/85">{r[1]}</td>
              <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-white/55">{r[2]}</td>
              <td className={"px-3 py-2.5 font-mono text-[12px] tabular-nums " + (r[5] ? "text-white/55" : "text-destructive/90")}>
                {r[3]}
              </td>
              <td className="px-3 py-2.5 font-mono text-[12px] tabular-nums text-white/55">{r[4]}</td>
              <td className={"px-3 py-2.5 font-mono text-[12px] " + (r[5] ? "text-white/70" : "text-destructive/90")}>
                {r[5] ? "SLA-safe" : "rejected"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 max-w-[68ch] font-mono text-[11px] leading-relaxed text-white/38">
        Rows with timeout &gt; 0% are not valid SLA-safe baselines (Aurelius integrity rule). Source:
        aurelius/traces/genai_ablation.py · 26,392 requests.
      </p>
    </div>
  );
}

/* Print → Save as PDF. The webpage is the canonical report; this triggers the
   browser's native print-to-PDF rather than shipping a fabricated file. */
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
