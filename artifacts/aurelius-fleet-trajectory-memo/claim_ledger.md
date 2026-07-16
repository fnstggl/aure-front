# Claim ledger - Aurelius fleet-trajectory memo v2

Every numeric claim in `Aurelius_Fleet_Trajectory_Memo_v2.pdf` was verified
against the research repository (`fnstggl/energy2-RESEARCH-DUPE2`). The
underlying artifact verification pass is documented in
`artifacts/aurelius-technical-memo/claim_ledger.md`; this ledger records what
the v2 memo uses, the required benchmark language, and every claim decision.

## Benchmark language policy (enforced by source/build.py on every build)

- Required: "reconstructed production-class baseline" on pages 1 and 3
  (matching the full technical report's terminology; "the baseline"
  thereafter).
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
| 8.24x mean SLA-safe goodput per modeled infrastructure dollar vs the reconstructed production-class baseline | Derived from `data/external/mpc_controller/request_cap_sweep.json`: per-market gp/$ ratios 1041842.01/130538.91 = 7.98x, 1064601.79/130178.26 = 8.18x, 1111915.47/130000.36 = 8.55x; unweighted mean 8.237x, identically 1 + 723.7% (mean of deltas 698.11 / 717.8 / 755.32). | Page 1 scope line and page 4 "what this does not establish": simulated, load-dependent, selected public-trace windows, not a production result, not an estimate for a particular fleet or internal scheduler; magnitude materially affected by the benchmark's batching, precision, service-time, and modeled cost assumptions. |
| PJM 7.98x / +698.1%, ERCOT 8.18x / +717.8%, CAISO 8.55x / +755.3%, unweighted mean 8.24x / +723.7% | Same artifact. | Shown on one axis against the reconstructed production-class baseline at 1.00x; never merged with V1. |
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

| Uncapped search-strategy ablation (page 2): fixed grid 3.62x / +261.9%; regime-specific candidate set without coupled search 3.62x; exhaustive search of the fixed grid 4.84x / +383.6%; bounded coupled search 4.85x / +385.4%; hierarchical coupled-policy search 8.29x / +728.6%; clock-only arm cannot be scored within the standard 300 s harness budget in any market; at an extended 1800 s budget it completes but lands below the baseline (0.68x-0.70x, mean 0.69x) with a ~0.43 SLA violation rate; SLA violation rates fall from 0.038-0.046 (baseline) to 0.0022-0.0026 (hierarchical) | New artifact `data/external/mpc_controller/uncapped_search_ablation.json` produced by `scripts/run_uncapped_search_ablation.py` (research repo, 07.2026): identical harness, windows, and load to `request_cap_sweep.json` uncapped cells; production anchors reproduced published gp/$ byte-identically in all three markets (130,538.91 / 130,178.26 / 130,000.36); hierarchical arm reproduced published headline cells within +0.58% / +1.22% / -0.003%. Summary in `research/UNCAPPED_SEARCH_ABLATION_RESULTS.md`. | Page 2 footnote: independent rerun; ratios are unweighted means across markets; hierarchical reproduces the published headline within 1.2 percent per market; the V1 zero-regret audit remains the only regret measurement; neither validates the simulator or establishes production savings. |

## Page 1 search-compression figure (FIG 01, v4)

| Claim (figure wording) | Source | Qualification |
|---|---|---|
| ~4.7M possible coupled-policy configurations per decision | `CandidateBundleGenerator.theoretical_combinations()` in `aurelius/environment/candidate_search.py` = product of `ACTION_SPECS[s].options` over the connected surfaces = 3*2*2*3*3*3*3*3*3*3*5*4*3*3 = 4,723,920. | "~4.7M" is the connected-surface space actually searched by the benchmark arm. Including the four SIMULATED_ONLY surfaces (opt-in, not varied in the reported replay) the product is 340,122,240 (~340M). Not the ~23M first assumed. |
| 72-75 candidate trajectories scored per decision (PJM 75, ERCOT 72, CAISO 72) | `candidate_bundles_evaluated` recorded per uncapped cell in `data/external/mpc_controller/request_cap_sweep.json` for `aurelius_mpc_hierarchical_search` (pjm/ercot/caiso|uncapped): 75 / 72 / 72; `theoretical_bundles` (the method's own generated set) = 74. | Per-decision figure (the controller stores `last_decision_diag`); `config.max_decisions = 3`. Simulated, load-dependent. |
| 1 highest-scoring feasible policy returned | The controller returns one `best_cand` per decision (`controller.py` decide path). | Mechanism statement, not a benchmark number. |
| "Where exhaustive enumeration was tractable, bounded search selected the same optimum." | Frozen V1 zero-regret audit (`PHYSICS_GUIDED_PLANNER_RESULTS.md`): bounded search matched the exhaustive optimum where enumeration was tractable (regret 0.0). | Stated as scoped, not as proof of global optimality over the ~4.7M space. The memo does NOT claim zero regret across the full space; the funnel note and page-1 lead both scope it to "separately tractable spaces". |

## Claims softened, removed, or changed

- Page 2's primary evidence changed from the frozen V1 ablation to the new
  uncapped search-strategy ablation (07.2026), which measures the same
  single-variable question at the headline benchmark's own load. The V1
  zero-regret audit moved to the page 2 footnote. The V1 percentages
  (-4.47% / +100.48% / +161.31%) no longer appear in the memo; they remain in
  the full technical report.
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
- Later revision (page-copy pass): the baseline label was renamed from
  "constructed production-informed replay baseline" to "reconstructed
  production-class baseline" on every page, to match the full technical
  report's terminology; the build.py required-phrase check was updated to
  match. Page 2's ablation is now framed accurately as varying "the
  planner's representable policy space and search procedure" (not a single
  variable) while the simulator, objective, cost model, constraints, and
  inputs stay fixed; the FIG 02 label reads "fixed harness · policy space +
  search". Page 1's motif line became "one live fleet state · many
  candidate sequences · one feasible next action returned" (Aurelius
  returns one next action, it does not execute a whole trajectory). Page 3's
  heading was simplified to "Validating the benchmark result on operator
  data" and the redundant "supporting full technical report" line was
  dropped from the closing contact row.
- Page-2 8.24x/8.29x handling: 8.24x stays the canonical headline
  everywhere (cover, page-1 hero, page-3 chart, page-2 opening). 8.29x
  appears only in the independent-rerun ablation, and its table row is now
  explicitly labeled "(independent rerun)". A concise note directly under
  the FIG 02 table states the rerun reached 8.29x vs the canonical 8.24x
  (0.6% mean difference; per-market within 1.2%) and that 8.24x is retained
  as canonical; the long footnote's duplicate reproducibility clause was
  removed. The right-column control sentence ("forecast, simulator,
  objective, cost model, and constraint gates were unchanged") was dropped
  as redundant with the opening paragraph's held-fixed statement.

- Design pass (figures + page-2 structure): page 1's FIG 01 was rebuilt from
  a search-compression funnel into a predictive control cycle diagram
  (observe -> fork -> advance across t+1..t+4 -> hard constraint gate ->
  return first action; live fleet stays authoritative). Page 2's 7-row
  ablation table was reorganized into a three-state mechanism figure
  (reactive baseline 1.00x -> fixed joint posture 3.62x -> adaptive coupled
  planning 8.29x) with the "representable policy space, not harder search"
  argument made visual, plus a compact proof box carrying the remaining arm
  values (GPU clock only 0.69x; exhaustive fixed grid 4.84x = bounded coupled
  search 4.85x; regime-specific set 3.62x) and the SLA rates. No benchmark
  value was changed; the per-arm delta percentages (equal to multiplier - 1)
  were folded into the multipliers. Added the operator-scope sentence up
  front: the benchmark validates the architecture on four implemented serving
  controls (batching, capacity, precision, clock policy); operator replay
  would test the broader fleet controls. An editable Excalidraw version of
  FIG 01 lives at source/fig01-predictive-control-cycle.excalidraw.
