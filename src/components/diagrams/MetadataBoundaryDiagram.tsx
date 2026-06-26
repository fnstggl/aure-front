import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, SystemSurface, Annotation, Tag, StatusMark, C, RX, arrow } from "./plate";

/* Plate 07 — Data boundary.
   One idea: the customer environment is a protected boundary. Only metadata
   crosses, over a single thin bridge, into the adjacent Aurelius control
   plane. Payload, model outputs, training data and source code never leave. */

const ENV = [
  { label: "WORKLOAD QUEUE", sub: "jobs · payloads", x: 70, y: 96 },
  { label: "SCHEDULER", sub: "placement state", x: 322, y: 96 },
  { label: "EXECUTION", sub: "model outputs", x: 70, y: 176 },
  { label: "LOGS", sub: "run history", x: 322, y: 176 },
];

const AUR = ["METADATA READER", "FORECASTER", "DECISION ENGINE", "CONSTRAINT FILTER", "AUDIT LOG"];
const BLOCKED = ["prompts", "model outputs", "training data", "source code"];

const BX = 596; // boundary x

export function MetadataBoundaryDiagram({ fig = "fig.08", title = "data boundary" }: { fig?: string; title?: string } = {}) {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={ref}>
      <TopologyPlate fig={fig} title={title} caption="customer environment · metadata boundary" vb={[1000, 440]} minWidth={900}>
        {/* customer environment boundary */}
        <rect x={40} y={44} width={556} height={356} rx={RX} fill="none" stroke="#ffffff" strokeWidth="1.4" strokeDasharray="5 4" />
        <Annotation x={62} y={74} state="white" size={12.5} track={0.8}>CUSTOMER SECURE ENVIRONMENT</Annotation>

        {ENV.map((n) => (
          <g key={n.label}>
            <SystemSurface x={n.x} y={n.y} w={204} h={60} state="neutral" />
            <Annotation x={n.x + 16} y={n.y + 26} state="white" size={11.5} track={0.5}>{n.label}</Annotation>
            <Annotation x={n.x + 16} y={n.y + 44} state="dim" size={10.5}>{n.sub}</Annotation>
          </g>
        ))}

        {/* blocked data — stays inside */}
        <Annotation x={70} y={296} state="dim" size={10.5} track={0.5}>STAYS INSIDE — NEVER CROSSES</Annotation>
        {BLOCKED.map((b, i) => {
          const x = 70 + i * 132;
          return (
            <g key={b}>
              <rect x={x} y={312} width={120} height={28} rx={RX} fill={C.redSoft} stroke={C.redLine} strokeWidth="1.4" />
              <StatusMark x={x + 16} y={326} kind="fail" r={6} />
              <Annotation x={x + 30} y={330} state="rejected" size={10.5}>{b}</Annotation>
            </g>
          );
        })}

        {/* boundary line */}
        <line x1={BX} y1={44} x2={BX} y2={400} stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 4" />

        {/* metadata bridge — the only crossing, straight across */}
        <line x1={526} y1={126} x2={696} y2={126} stroke={C.steelStrong} strokeWidth="2.4" markerEnd={arrow("steel")} />
        <Annotation x={611} y={114} anchor="middle" state="active" size={10.5} track={0.5}>METADATA BRIDGE</Annotation>
        {!reduced && inView && (
          <circle r="3.5" fill={C.steelText}>
            <animateMotion dur="2.4s" repeatCount="indefinite" path="M526 126 H696" />
          </circle>
        )}

        {/* blocked payload attempt — routed in the clear lane below the boxes so
            it never crosses a node; stopped at the boundary */}
        <line x1={276} y1={256} x2={BX - 12} y2={256} stroke={C.redLine} strokeWidth="1.8" strokeDasharray="2 5" opacity={0.9} />
        <StatusMark x={BX} y={256} kind="fail" r={8} />
        <Annotation x={286} y={246} state="rejected" size={10.5}>payload blocked at boundary</Annotation>

        {/* Aurelius control plane */}
        <rect x={680} y={44} width={280} height={356} rx={RX} fill={C.steelFillSoft} stroke={C.steelLine} strokeWidth="1.4" />
        <Annotation x={700} y={74} state="active" size={12} track={0.8}>AURELIUS CONTROL LAYER</Annotation>
        {AUR.map((a, i) => {
          const y = 92 + i * 60;
          const first = i === 0;
          return (
            <g key={a}>
              <SystemSurface x={700} y={y} w={240} h={44} state={first ? "selected" : "active"} />
              <Annotation x={718} y={y + 27} state="active" size={11} track={0.5}>{a}</Annotation>
              {i < AUR.length - 1 && <line x1={820} y1={y + 44} x2={820} y2={y + 60} stroke={C.steelLine} strokeWidth="1" />}
            </g>
          );
        })}
        <Tag x={940} y={392} anchor="end" state="dim">read-only · append-only</Tag>
      </TopologyPlate>
    </div>
  );
}
