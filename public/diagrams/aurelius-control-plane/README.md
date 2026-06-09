# Aurelius Control Plane — flagship layered isometric diagram

A layered, authored isometric technical illustration of the Aurelius control
plane. Each layer is an independent asset on a shared **1440×900** canvas, stacked
and animated by `src/components/diagrams/AureliusControlPlaneIllustration.tsx`.

## Layer system

The component treats every layer as an **opaque asset**. Layers share the exact
canvas size and registration, so they stack pixel-perfectly with absolute
positioning. To upgrade fidelity, replace any single file with a higher-quality
Figma/Spline render of the **same layer at the same 1440×900 canvas** — no
component changes are required.

| File | Role |
| --- | --- |
| `base_plane.svg` | Charcoal backdrop + isometric platform (only opaque layer) |
| `background_grid.svg` | Faint isometric reference grid, fading at the edges |
| `customer_environment.svg` | Dashed secure-environment boundary |
| `workload_queue.svg` | Queued job cards |
| `scheduler.svg` | Existing scheduler (the authority) |
| `execution_layer.svg` | GPU execution racks (settles dimmed — unchanged) |
| `aurelius_control_plane.svg` | Aurelius sidecar — the hero steel control surface |
| `constraint_engine.svg` | Constraint gates (SLA / capacity / residency / power) |
| `audit_ledger.svg` | Append-only audit ledger drum |
| `metadata_bridge.svg` | Steel metadata-only conduit (scheduler → Aurelius) |
| `active_paths.svg` | Execution flow rails + advisory return |
| `blocked_payload.svg` | Muted-red blocked payload path + barrier |
| `metadata_packet.svg` | Travelling metadata packet glyph |
| `labels.svg`, `annotations.svg` | Exported label/annotation assets (Figma source of truth; the live component renders crisp HTML tags from `meta.json`) |

`../../../src/components/diagrams/aurelius-control-plane/meta.json` holds the
label anchors and animation paths (packet + blocked path), keeping the React
wrapper locked to the art.

## Source of truth

- **Figma:** "Aurelius Control Plane Diagram" (`DG2fIqvo2ydDAGxI7tuGMu`) — the
  same named layers live in the parent frame `Aurelius Control Plane`.
- **Generator:** `scripts/gen-aurelius-diagram.mjs` authors the geometry and
  emits these SVGs + `meta.json`. Regenerate with:

  ```bash
  node scripts/gen-aurelius-diagram.mjs
  ```

## QA

`scripts/qa.mjs` (Playwright) captures the live component at desktop, mobile,
and reduced-motion. Run against `vite preview`:

```bash
npm run build && npx vite preview --host 127.0.0.1 --port 5188 &
node scripts/qa.mjs   # writes to .qa/
```
