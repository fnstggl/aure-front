# Claim ledger - Aurelius fleet-trajectory memo v2

Every numeric claim in `Aurelius_Fleet_Trajectory_Memo_v2.pdf` was verified
against the research repository (`fnstggl/energy2-RESEARCH-DUPE2`). The
underlying artifact verification pass is documented in
`artifacts/aurelius-technical-memo/claim_ledger.md`; this ledger records what
the v2 memo uses, the required benchmark language, and every claim decision.

## Benchmark language policy (enforced by source/build.py on every build)

- Required: "constructed production-informed replay baseline" on pages 1
  and 4 ("constructed baseline" thereafter).
- Banned and machine-checked as absent: "production-class scheduler",
  "production-class composite", "what a competent operator already runs",
  "production-scale replay", "production-comparable", "economic posture",
  "common anticipated future", "physics-guided", "safe default",
  "operator dollar", em dashes, en dashes.
- Replacements used: "modeled infrastructure dollar", "coupled policy",
  "fleet trajectory", "state-transition model", "regime-specific candidate
  set", "shared planning horizon", "configured deterministic fallback
  policy", "baseline-reconstruction fidelity".

## Figures used and their sources

| Claim (memo wording) | Source | Qualification carried in the memo |
|---|---|---|
| 8.24x mean SLA-safe goodput per modeled infrastructure dollar vs the constructed production-informed replay baseline | Derived from `data/external/mpc_controller/request_cap_sweep.json`: per-market gp/$ ratios 1041842.01/130538.91 = 7.98x, 1064601.79/130178.26 = 8.18x, 1111915.47/130000.36 = 8.55x; unweighted mean 8.237x, identically 1 + 723.7% (mean of deltas 698.11 / 717.8 / 755.32). | Page 1 scope line and page 4 "what this does not establish": simulated, load-dependent, selected public-trace windows, not a production result, not an estimate for a particular fleet or internal scheduler; magnitude materially affected by the benchmark's batching, precision, service-time, and modeled cost assumptions. |
| PJM 7.98x / +698.1%, ERCOT 8.18x / +717.8%, CAISO 8.55x / +755.3%, unweighted mean 8.24x / +723.7% | Same artifact. | Shown on one axis against the constructed baseline at 1.00x; never merged with V1. |
| 84.5% fewer total GPU-hours; 1,549,249 total input requests; lower SLA violation rates in all three windows; identical input request sets | Same artifact: GPU-hours 173.13 vs 1,115.10; requests 576,912 + 442,716 + 529,621; SLA 0.0023 vs 0.0382, 0.0013 vs 0.0447, 0.0018 vs 0.0458; both arms replay the same windows. | "Under identical input request sets" stated on pages 1 and 4. |
| V1 ablation: GPU clock only -4.47% (SLA gate failed, exhaustive optimum not matched); regime-specific candidate set +100.48% (passed, not matched); coupled-policy search +161.31% (passed, matched), approximately 40 candidate evaluations per decision | `data/external/mpc_controller/physics_guided_planner_backtest.json`; `research/PHYSICS_GUIDED_PLANNER_RESULTS.md` L33-41 (clock_only -4.47%; fixed_24_grid/candidates +100.48%; beam +161.31%, regret 0.0, 40.5 evals). | Page 2 footnote: frozen Benchmark V1, primary market window; different load and comparison policy from the uncapped replay; validates search inside enumerated spaces only; does not validate the simulator or establish production savings. |
| "Held constant: forecast, simulator, objective, cost model, constraint gates; only the policy set changed" | Same ablation artifacts (single-variable arm design). | None needed. |
| Winning permitted policy = lower precision + more aggressive batching + higher GPU clock | `PHYSICS_GUIDED_PLANNER_RESULTS.md` narrative; report section 08. | Scoped to "within the frozen V1 primary window". |
| Controls listed on page 1 (batching, routing, placement, capacity, prewarming, admission, migration, precision, speculative decoding, GPU clock policy) | `aurelius/environment/actions.py`: all ten are CONNECTED ActionSpecs, including `spec_decode_policy` (L190, roofline reward channel, default off). | Hedged as "the controls implemented for that workload". Note: the public website report deliberately omits speculative decoding (commit dacd0ef); this memo includes it on explicit instruction, supported by the CONNECTED ActionSpec in code. It is not claimed as a benchmarked headline lever. |
| Trajectory state advanced: queue progression, capacity use, placement and topology pressure, replica warm state, SLA outcomes, modeled infrastructure cost | `aurelius/environment/world_state.py` (QueueState, ServerState/RackState/NetworkPressureState, PlacementState, WarmState, CostState; SLA via objective and gates). | None needed. |
| Read-only isolated simulation; causal forecasts (no future arrivals, prices, or outcomes); hard constraint rejection before economic ranking; configured deterministic fallback policy below a configured confidence threshold | Report sections 02-07; harness config in `request_cap_sweep.json` ("no future truth", persistent world). | Fallback and threshold described as configured, not as a named guarantee. |
| Baseline definition (continuous batching, deadline-aware ordering and admission, prefix-cache-aware routing, topology-aware placement, backlog-driven capacity control; stronger than the naive SLA-aware reference; not an operator's internal scheduler) | `research/PRODUCTION_SCHEDULER_PUBLIC_BENCHMARK_RESEARCH.md` L20-48; `aurelius/environment/production_baselines.py`; report section 11. | Explicitly "does not reproduce a particular fleet's adaptive logic, internal signals, or cost model". |
| Page 3 trajectory annotations (A rejected at t+2 on SLA tolerance; B feasible, lower-ranked; C selected, highest modeled gp/$) | Illustrative schematic of the mechanism, not benchmark data; consistent with gate-then-rank design in report sections 02/07. | Labeled as schematic reasons, all "configured"/"modeled". |
| Evaluation protocol (reconstruct, fidelity gate, freeze, held-out counterfactual evaluation, shadow-mode decision; pre-registered primary metric; stop rule) | Proposal language for the requested evaluation, extending report section 17 and the Safety staged path. States what WOULD be done; claims no existing simulator fidelity. | "Counterfactual improvements are scored only if that baseline-reconstruction fidelity gate passes." |

## Claims softened, removed, or changed

- "173.5% value forfeited" and "30.3% regret" were removed from page 2's
  primary presentation per the design brief; the same information is carried
  as "Exhaustive optimum: not matched / matched", which is strictly weaker
  and artifact-consistent.
- The V1 SLA before/after transitions remain omitted entirely (mis-sourced
  for ERCOT/CAISO in the published report; see the six-page memo ledger).
- All banned phrases above were removed; in particular the former
  "production-class composite" is now "constructed production-informed
  replay baseline", and "physics-guided" is replaced by "regime-specific"
  with a concrete definition on page 3 ("proposes a bounded set of policies
  based on the workload, operating conditions, implemented controls, and
  configured constraints").
- The memo nowhere claims the V1 ablation attributes the uncapped result;
  page 2's footnote states the two benchmarks differ in load and comparison
  policy, and no bridge multiplier between them is drawn.
