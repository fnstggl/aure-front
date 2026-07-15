# Claim ledger - Aurelius four-page trajectory memo

Every figure in this memo was verified against the research repository
(`fnstggl/energy2-RESEARCH-DUPE2`) during the verification pass documented in
`artifacts/aurelius-technical-memo/claim_ledger.md`. This ledger records only
what this memo uses and anything new.

## Figures used and their sources

| Claim (memo wording) | Source | Qualification carried in the memo |
|---|---|---|
| 8.24x SLA-safe goodput per dollar vs a production-class composite, uncapped public replay | Derived from `data/external/mpc_controller/request_cap_sweep.json`: per-market gp/$ ratios 7.98x / 8.18x / 8.55x, mean 8.237x; identically 1 + 723.7% (mean of per-market deltas 698.11 / 717.8 / 755.32). | Page 1 one-line qualifier and page 4 scope columns: simulated, load-dependent, selected public-trace windows, not a production result or an estimate for a particular fleet. |
| PJM +698.1%, ERCOT +717.8%, CAISO +755.3%, average +723.7% | Same artifact, summary delta blocks. | Same as above; "avg +723.7% · 8.24x baseline" always shown against the named composite baseline. |
| 84.5% fewer GPU-hours at identical replayed load | Same artifact: 173.13 vs 1,115.10 GPU-hours summed over the three markets. | Same replayed load per window stated next to the figure. |
| 1,549,249 replayed requests | Same artifact: 576,912 + 442,716 + 529,621. | Three selected market windows, not full trace lifetime. |
| "3 of 3 market windows with better SLA outcomes" / "better SLA in all three windows" | Same artifact: 0.0023 vs 0.0382, 0.0013 vs 0.0447, 0.0018 vs 0.0458. | Stated as outcome under identical replayed load; per-window rates live in the full report, not repeated here. |
| Ablation: single-surface -4.47%, SLA gate failed, 173.5% value forfeited; physics-guided +100.48%, 30.3% regret; coupled search +161.31%, 0% measured regret; ~40 evaluations per decision | `data/external/mpc_controller/physics_guided_planner_backtest.json`; `research/PHYSICS_GUIDED_PLANNER_RESULTS.md` L33-41. | Page 2 footnote: Benchmark V1 frozen cap-controlled continuity harness, primary market window; regret measured against exhaustive enumeration where tractable. |
| "Held constant: simulator, forecast, objective, cost model, safety gates; only the candidate set changed" | Same ablation doc (single-variable arm design). | None needed. |
| Winning bundle = lower precision + aggressive batching + higher clock | Report section 08; `PHYSICS_GUIDED_PLANNER_RESULTS.md` narrative. | Described as the V1 finding, not a universal prescription. |
| Trajectory state advanced: queues, topology pressure, warm state, capacity, SLA risk, cost | `aurelius/environment/world_state.py` (QueueState, RackState/NetworkPressureState, WarmState, ServerState, CostState; SLA risk via objective/gates). | None needed. |
| Read-only simulation; hard SLA/capacity/power/policy gates; deterministic fallback; causal forecasts (no future truth) | Report sections 02-07; harness config in `request_cap_sweep.json`. | None needed. |
| Integration boundary (sits above Kubernetes, Slurm, serving schedulers, routing, autoscalers, fleet management; metadata only, no payloads/outputs/weights) | Report sections 01, 14; Safety page. | Kept secondary per brief; "predictive supervisory layer" used only as category line under the wordmark. |
| Evaluation proposal (input / process / output / ask) | Mirrors report section 17 and Safety/EvaluationSequence staged path. | Bounded, read-only, protocol fixed before data moves. |

## Notes

- The V1 SLA before/after transitions remain omitted (mis-sourced in the
  published report for ERCOT/CAISO; see the six-page memo ledger,
  discrepancy 2).
- Electricity prices are not described in this memo at all beyond the market
  window names; the full report and six-page memo carry the day-ahead-only
  detail.
- No citation list is reproduced here by design; the memo points to the
  supporting full technical report for methodology, citations, limitations,
  and version history.
