import { cn } from "@/lib/utils";
import { PlateHeader, CaptionStrip } from "./plate";

/* ============================================================================
   fig.02 — the predictive world model, drawn as a labelled state schematic.

   This is not an abstraction: every tile is a real dataclass in the research
   repo (aurelius/environment/world_state.py) carried inside CanonicalWorldState.
   The world_simulator advances this state one control period at a time, so a
   candidate decision can be scored against the cluster as it WILL be, not as it
   is now. Pure black plate, white ink, no motion. Names are verbatim from code.
   ============================================================================ */

const TILES: { cls: string; fields: string }[] = [
  { cls: "ReplicaState", fields: "warm · weights_loaded · kv_warm_frac · cold_start_remaining_s" },
  { cls: "ServerState", fields: "gpu_type · available_gpu_slots · active / warm replicas" },
  { cls: "RackState", fields: "macro_network_pressure · gpu_capacity · colocated_replicas" },
  { cls: "PlacementState", fields: "replica_to_server · locality_score · topology_penalty" },
  { cls: "WarmState", fields: "warm_replicas · cold_start_events · warm_hold_gpu_hours" },
  { cls: "QueueState", fields: "pending_requests · queue_delay_p50 / p95 / p99" },
  { cls: "MigrationState", fields: "source → target · migration_cost · capacity_loss" },
  { cls: "CostState", fields: "operator-$ basis · warm-hold + migration penalties" },
];

export function WorldModelState({ className }: { className?: string }) {
  return (
    <figure className={cn("relative overflow-hidden border border-white bg-black", className)}>
      <PlateHeader fig="fig.02" title="canonical world state" />
      <div className="px-4 py-5">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-stretch md:gap-3">
          {/* container label */}
          <div className="md:w-[148px] md:shrink-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              state object
            </span>
            <div className="mt-2.5 border border-white px-3 py-2.5">
              <div className="font-mono text-[11.5px] leading-tight text-white">CanonicalWorldState</div>
              <div className="mt-1.5 font-mono text-[10px] leading-snug text-white/45">
                period · replicas · servers · racks · migrations
              </div>
            </div>
            <div className="mt-2.5 font-mono text-[9.5px] uppercase leading-snug tracking-[0.12em] text-white/40">
              world_state.py
            </div>
          </div>

          {/* component tiles */}
          <div className="grid flex-1 grid-cols-1 gap-1.5 sm:grid-cols-2">
            {TILES.map((t) => (
              <div key={t.cls} className="border border-white/25 px-3 py-2">
                <div className="font-mono text-[11px] leading-none text-white/90">{t.cls}</div>
                <div className="mt-1.5 font-mono text-[9.5px] leading-snug text-white/45">{t.fields}</div>
              </div>
            ))}
          </div>
        </div>

        {/* transition rule */}
        <div className="mt-4 flex flex-col gap-2 border-t border-white/15 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10.5px] leading-tight text-white/70">
            state(t) → simulate_period(bundle, forecast, dt) → state(t+1)
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/40">
            world_simulator.py · read-only clone per candidate
          </span>
        </div>
      </div>
      <CaptionStrip label="fig.02 — persistent cluster state advanced one control period at a time" />
    </figure>
  );
}
