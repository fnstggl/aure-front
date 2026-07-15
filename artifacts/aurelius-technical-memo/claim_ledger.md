# Claim ledger - Aurelius technical memo

Internal ledger created before drafting. Every claim in the memo maps to a row
here. "Report" means `src/pages/TechnicalReport.tsx` (public technical report
v0.4, 30 June 2026), the canonical published source in this repository.
"Research repo" means `fnstggl/energy2-RESEARCH-DUPE2` checked out at
`/home/user/energy2-RESEARCH-DUPE2`. Underlying artifact paths are recorded
per claim below.

Status legend: VERIFIED (report + underlying artifact), REPORT-ONLY (published
report is the source of record; underlying artifact listed where found),
SOFTENED (wording weakened for the memo), OMITTED (not used).

| # | Claim (memo wording) | Source | Qualification that must accompany it | Status |
|---|---|---|---|---|
| 1 | Aurelius does not replace Kubernetes, Slurm, serving schedulers, fleet-management systems, or existing control planes; it operates above them as a predictive supervisory layer. | Report section 01-02; HowItWorks.tsx ("An advisory control layer, not a scheduler replacement"); Safety.tsx | None; this is positioning, phrased as architecture, not capability. | VERIFIED (positioning) |
| 2 | Uncapped high-load replay: +698.1% (PJM), +717.8% (ERCOT), +755.3% (CAISO); arithmetic mean +723.7%, publicly rounded to +724%. | Report sections 09, 10, 12 (Table 1). Underlying artifact: see "Underlying benchmark artifacts" below. | Simulated replay of selected public-trace windows; load-dependent; not a savings prediction for any fleet; baseline is a constructed composite, not any operator's scheduler. | VERIFIED |
| 3 | Aurelius gp/$: PJM 1,041,842; ERCOT 1,064,602; CAISO 1,111,915. Composite gp/$: 130,539; 130,178; 130,000. | Report Table 1. | Same qualifications as claim 2. gp/$ = SLA-safe goodput per operator dollar under the disclosed harness cost model. | VERIFIED |
| 4 | SLA violation rates: Aurelius 0.0023 / 0.0013 / 0.0018 vs composite 0.0382 / 0.0447 / 0.0458 (PJM / ERCOT / CAISO). | Report Table 1. | Under identical replayed load per market. | VERIFIED |
| 5 | GPU-hours: Aurelius 62.2 / 51.0 / 60.0 vs composite 399.9 / 323.7 / 391.5; totals 173.1 vs 1,115.1; 84.5% fewer. | Report Table 2. | Same served load; totals computed from per-market values ((1115.1-173.1)/1115.1 = 84.48%). | VERIFIED |
| 6 | Replayed requests: 576,912 / 442,716 / 529,621; total 1,549,249 (~1.5M). | Report Table 1 and section 10. | Three selected high-load windows, three control periods each; not the full lifetime of the traces. | VERIFIED |
| 7 | The composite baseline is assembled from established production serving techniques: continuous batching, SLA-aware ordering, KV/prefix-cache-aware routing, topology-aware placement, backlog-driven autoscaling with warm-pool headroom, class-based admission. | Report section 11 with references [1]-[7]. | It is a constructed public-replay composite; explicitly NOT a specific operator's internal scheduler. | VERIFIED |
| 8 | No policy sees future arrivals or future electricity prices; per-request execution time is used rather than predicted (no oracle). | Report section 10. | None. | VERIFIED |
| 9 | Benchmark V1 (frozen, cap-controlled): +161.31% (PJM), +191.41% (ERCOT), +147.85% (CAISO) vs strongest SLA-aware baseline; range stated as +147.85% to +191.41%. | Report Appendix A, Table A1. | Different baseline and different load from the uncapped benchmark; never mixed or averaged with it. | VERIFIED |
| 10 | Zero measured search regret vs exhaustive enumeration, at roughly 40 candidate evaluations per decision. | Report section 13, Appendix A Tables A2/A3. | Applies only where exhaustive enumeration was tractable (Benchmark V1 windows). | VERIFIED |
| 11 | Candidate-set decomposition (V1 primary window): single-surface -4.47% (fails SLA gate, 173.5% forfeited); physics-guided set +100.48% (30.3% regret); physics-guided + coupled search +161.31% (0% regret). | Report Appendix A, Table A3. | V1 primary window only; same simulator, objective, cost model, and Pareto gate in every row. | VERIFIED |
| 12 | Enabling more decision surfaces initially made results worse; cause was candidate-set collapse around a single surface (GPU clock); the winning bundle was lower precision + aggressive batching + higher clock. | Report section 08. | Not summarized as "AI found a better answer"; mechanism stated. | VERIFIED |
| 13 | World model state: replica warm/cold, server and rack capacity, placement and locality, queue dynamics, migrations in flight, operator cost basis (warm-hold + migration penalties). | Report section 03; WorldModelState.tsx FACETS. | Only these fields are claimed; provenance tagging (measured / trace-derived / benchmark-calibrated / modeled) also from section 03. | VERIFIED |
| 14 | Forecasts: arrival rate, request characteristics, queue dynamics, infrastructure and pricing conditions including wholesale electricity price; history-only (causal). | Report section 04. | Cache reuse, emergent queue/SLA pressure, carbon, and network congestion are represented but NOT yet consumed as forecast inputs; stated in the memo's integration-status legend. | VERIFIED |
| 15 | Active decision surfaces: capacity policy, capacity multiplier, ordering, admission, batching, routing, prewarm, placement, migration, precision, clock/DVFS. | Report section 05 SURFACE_GROUPS. | Only wired-and-scored surfaces listed. "Speculative execution" deliberately NOT mentioned anywhere (removed from the report in commit dacd0ef). | VERIFIED |
| 16 | Objective: SLA-safe goodput per operator dollar; energy at prevailing market price, warm-hold and migration cost; forecast-uncertainty risk penalty; two-tier gating (hard constraints reject, then rank); Pareto gate (beat baseline without regressing SLA). | Report section 07. | Only supported cost terms are described. | VERIFIED |
| 17 | Deterministic safe fallback when forecast confidence is insufficient. | Report sections 02, 07; HowItWorks.tsx. | None. | VERIFIED |
| 18 | Reads scheduler metadata only (timing, resource requests, constraints); never payloads, prompts, model outputs, weights, or customer data. | Report section 14; Safety.tsx READS / NOT_ACCESSED. | None. | VERIFIED |
| 19 | Remaining ~4.5% gap to a forecast oracle is forecast quality, not search. | Report section 13. | Used only in passing on page 4 (softened to "the residual gap to a forecast oracle is forecast quality, not search"). | VERIFIED |
| 20 | The +724% gap is wide partly because a fixed-policy scheduler degrades under heavy uncapped load while Aurelius adapts; magnitude also depends on modeled precision/batching bands. | Report section 09 callout, section 15. | Carried into the scope box on page 5. | VERIFIED |
| 21 | Largest gains appear during expensive electricity windows; cheap-power periods leave less to recover. | Report section 15. | Included in memo page 5 scope box ("load-dependent... selected high-load windows"). | VERIFIED |
| 22 | Simulator fidelity must be tested against real operator telemetry; that is the purpose of the proposed evaluation. | Report sections 15, 16. | Framed as the reason for the historical replay, not as a defect being hidden. | VERIFIED |
| 23 | Staged, reversible path: historical replay -> shadow recommendation -> operator review -> optional production integration. | EvaluationSequence.tsx; Safety.tsx. | Production integration is optional and never the default. | VERIFIED |
| 24 | Baseline references: Orca (OSDI 2022), vLLM/PagedAttention (SOSP 2023), Clockwork (OSDI 2020), SGLang/RadixAttention (arXiv:2312.07104), Slurm topology docs, Kubernetes HPA docs, Autopilot (EuroSys 2020). | Report REFERENCES array (n=1..7) with URLs. | Cited for the realism of the baseline mechanisms, not for any Aurelius result. | VERIFIED |
| 25 | Public workload trace: Azure LLM inference traces (Azure Public Dataset); prefix-reuse structure from the Mooncake FAST 2025 trace release; prices: public day-ahead hourly wholesale electricity prices for PJM, ERCOT, CAISO. | Research repo: `aurelius/environment/ingestion/azure.py`, `ingestion/mooncake.py`, `price_series.py`; see artifact section below. | Day-ahead hourly only (no real-time claim); traces cited as primary datasets. | VERIFIED |

## Claims deliberately softened or omitted

- "Millions of simulated futures" (website animation counter in
  WorldModelArchitecture.tsx): OMITTED. The verified search figure is roughly
  40 candidate evaluations per decision under the bounded coupled search; the
  animation counter is a visual flourish, not a benchmark artifact.
- "Speculative execution / speculative decoding": OMITTED everywhere,
  including the page 3 interaction map. Removed from the public report in
  commit dacd0ef ("Remove speculative decoding mentions from technical
  report"). The memo mentions precision and clock policy only.
- "Evaluates every possible decision": NEVER used. Memo says bounded set of
  high-value coupled candidates, with regret measured against exhaustive
  enumeration where tractable.
- Production readiness / deployment: NEVER claimed. The memo repeats
  "simulated replay, not a production deployment" and proposes a read-only
  historical evaluation.
- Any prediction that a specific fleet improves by +724%: NEVER made. The
  scope box states the correct interpretation explicitly.
- The naive SLA-aware baseline timing out under uncapped load: mentioned in
  the report; OMITTED from the memo body (not needed; the memo compares only
  the two policies that completed identical load). The scope box states both
  policies ran identical selected windows and load.
- Aggressive low-precision mode scoring higher but excluded for unmodeled
  quality risk: OMITTED from the memo (report Limitations); subsumed under
  "modeled precision and batching behavior affect the magnitude."
- Carbon intensity forecasting (HowItWorks marketing page): OMITTED; the
  report marks carbon as represented-but-not-forecast, so the memo's
  integration legend lists it as not yet consumed.

## Underlying benchmark artifacts (research repo)

Verified against `fnstggl/energy2-RESEARCH-DUPE2` before drafting.

### Uncapped high-load replay (claims 2-6)
- `data/external/mpc_controller/request_cap_sweep.json` (machine-readable
  ground truth). Per-market uncapped cells:
  - PJM: production `gp_per_dollar 130538.91`, `sla_violation_rate 0.03818`,
    `gpu_hours 399.878`, `actual_requests 576912`; Aurelius
    `gp_per_dollar 1041842.01`, `sla 0.00226`, `gpu_hours 62.217`;
    delta `pct 698.11`, `pareto_pass true`.
  - ERCOT: production `130178.26 / 0.04468 / 323.697 / 442716`; Aurelius
    `1064601.79 / 0.00133 / 50.953`; delta `pct 717.8`.
  - CAISO: production `130000.36 / 0.04584 / 391.525 / 529621`; Aurelius
    `1111915.47 / 0.00181 / 59.964`; delta `pct 755.32`.
  - Harness config: `PR124_benchmark_v1 (run_period_episode, persistent
    world, real diurnal prices)`, `max_decisions: 3` (three control periods).
- `research/BENCHMARK_V1_REQUEST_CAP_SWEEP.md` (human-readable table,
  lines 51/54/57).
- Generator scripts: `scripts/run_request_cap_sweep.py`,
  `scripts/run_ladder_benchmark.py`.

### Benchmark V1 continuity (claims 9-11, 19)
- `data/external/mpc_controller/physics_guided_planner_backtest.json`:
  baselines 311659.1 / 373537.9 / 406766.5; beam 814382.7 / 1088526.5 /
  1008168.2; derived deltas +161.31% / +191.41% / +147.85% match published.
- `research/PHYSICS_GUIDED_PLANNER_RESULTS.md`: decomposition table L33-41
  (clock_only -4.47%; physics-guided set +100.48%; + coupled search
  +161.31%), zero search regret (L23/L37/L73), 40.5 evaluations per decision
  (L22), oracle gap ~4.5% (L82-84).
- Generator: `scripts/run_physics_guided_planner_backtest.py`.

### Baseline composite definition (claim 7)
- `research/PRODUCTION_SCHEDULER_PUBLIC_BENCHMARK_RESEARCH.md` (L20-23,
  capability matrix L32-48); implementation
  `aurelius/environment/production_baselines.py` (pure eval-layer decide_fn,
  not an MPC path).

### Workload trace provenance (claim 25)
- Azure LLM inference traces (Azure Public Dataset): ingestion in
  `aurelius/environment/ingestion/azure.py` (2024 one-week conv/code traces,
  2023 one-hour fallback; release URL
  github.com/Azure/AzurePublicDataset). Wired via
  `aurelius/environment/training.py::build_mpc_inputs`.
- Mooncake FAST 2025 conversation-trace release: prefix/KV-reuse pool,
  `aurelius/environment/ingestion/mooncake.py` (12,000-request pool in
  `run_ladder_benchmark.py`).
- Fleet marginals: `aurelius/environment/fleet_plane_v2026.py`; the replay
  cluster is a TRACE_DERIVED_SAMPLE (24 servers / 4 racks) sampled from
  processed public-trace marginals, preserving distributions rather than
  machine identities.

### Electricity price provenance (claim 25)
- `aurelius/environment/price_series.py` (L20-25): committed hourly
  day-ahead (DAM) CSVs, `data/pjm_us_east_dam.csv`,
  `data/ercot_us_south_dam.csv`, `data/caiso_us_west_dam.csv`; upstream ISO
  sources per `enterprisedocs/benchmark-methodology.md` L28-32 (CAISO OASIS,
  PJM Data Miner, ERCOT public market data).

### World-model supported state (claim 13)
- `aurelius/environment/world_state.py::CanonicalWorldState` (L168-211):
  servers, racks, replicas, migrations, warm state, placement state, queue
  state, network pressure, cost state, electricity state, power state,
  deferrable work, provenance/fidelity tags. Memo lists only the subset the
  published report claims.

## Discrepancies and resolutions

1. **Aggregate roll-ups are derived, not stored.** No repo file stores
   +723.7% / 173.1 vs 1,115.1 GPU-hours / 84.5% / 1,549,249 requests. They
   are exact derivations from the three per-market cells in
   `request_cap_sweep.json`: mean(698.11, 717.8, 755.32) = 723.74;
   62.217+50.953+59.964 = 173.13; 399.878+323.697+391.525 = 1115.10
   ((1115.10-173.13)/1115.10 = 84.5% fewer); 576912+442716+529621 =
   1,549,249. Resolution: memo presents per-market values from the artifact
   and shows the average/total as computed aggregates, stating that the
   headline is the unweighted mean of the three per-market deltas.

2. **Published V1 "before" SLA values mis-sourced for ERCOT/CAISO.** The
   report's "0.48 to 0.01" and "0.51 to 0.02" use the clock_only arm's SLA
   (0.475 / 0.5125) as "before", not the strongest SLA-aware baseline
   (0.20625 / 0.225) that the goodput deltas are measured against. PJM's
   0.34 is correctly the baseline. Resolution: the memo OMITS V1 SLA
   before/after transitions entirely and reports only the verified V1
   goodput-per-dollar deltas, the baseline identity, and the zero-regret
   result. Nothing in the memo depends on the mis-sourced values.

3. **Price basis is day-ahead only.** `price_series.py` wires only hourly
   day-ahead LMP series; real-time and EIA adapters exist but are unwired.
   Resolution: the memo says "public day-ahead hourly wholesale electricity
   prices" and never claims real-time price data.

4. **Uncapped run framed as diagnostic in the research repo.** The research
   note recommends keeping the frozen cap for Benchmark V1 continuity; the
   published report (v0.4) promotes the uncapped replay to the primary
   benchmark with scope attached. Resolution: the memo follows the published
   report's framing and keeps the two benchmarks strictly separated, with
   the V1 continuity result reported under its own baseline and load and the
   uncapped result always carrying its scope box.

5. **Azure trace fidelity note.** An internal research note flags that the
   Azure trace lacks some request-characteristic fields, so parts of the
   serving behavior (precision/batching bands) are modeled. Resolution: the
   memo's scope box carries "modeled precision and batching behavior affect
   the magnitude," and the simulator-fidelity check is an explicit output of
   the proposed evaluation.
