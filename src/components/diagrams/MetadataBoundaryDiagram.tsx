import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TopologyPlate, SystemSurface, Annotation, Tag, StatusMark, C } from "./plate";

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

export function MetadataBoundaryDiagram() {
  const { ref, inView } = useInView();
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={ref}>
      <TopologyPlate fig="fig.07" caption="customer environment · metadata boundary" vb={[1000, 440]} minWidth={900}>
        {/* customer environment boundary */}
        <rect x={40} y={44} width={556} height={356} rx={8} fill="hsl(0 0% 100% / 0.012)" stroke="hsl(0 0% 100% / 0.12)" strokeDasharray="5 4" />
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
              <rect x={x} y={312} width={120} height={28} rx={4} fill={C.redSoft} stroke={C.redLine} strokeWidth="1" />
              <StatusMark x={x + 16} y={326} kind="fail" r={6} />
              <Annotation x={x + 30} y={330} state="rejected" size={10.5}>{b}</Annotation>
            </g>
          );
        })}

        {/* boundary line */}
        <line x1={BX} y1={44} x2={BX} y2={400} stroke="hsl(0 0% 100% / 0.16)" strokeWidth="1.2" strokeDasharray="3 4" />

        {/* metadata bridge — the only crossing */}
        <path d={`M526 122 C580 122 600 110 700 110`} fill="none" stroke={C.steelStrong} strokeWidth="1.8" />
        <Annotation x={612} y={98} state="active" size={10.5} track={0.5}>METADATA BRIDGE</Annotation>
        {!reduced && inView && (
          <circle r="3.5" fill={C.steelText}>
            <animateMotion dur="2.4s" repeatCount="indefinite" path="M526 122 C580 122 600 110 700 110" />
          </circle>
        )}

        {/* blocked payload attempt at the boundary */}
        <path d={`M276 206 C420 206 500 212 ${BX - 14} 212`} fill="none" stroke={C.redLine} strokeWidth="1.3" strokeDasharray="3 4" opacity={0.8} />
        <StatusMark x={BX} y={212} kind="fail" r={8} />
        <Annotation x={430} y={196} state="rejected" size={10.5}>payload blocked</Annotation>

        {/* Aurelius control plane */}
        <rect x={680} y={44} width={280} height={356} rx={8} fill={C.steelFillSoft} stroke={C.steelLine} strokeWidth="1" />
        <Annotation x={700} y={74} state="active" size={12} track={0.8}>AURELIUS CONTROL LAYER</Annotation>
        {AUR.map((a, i) => {
          const y = 92 + i * 60;
          const first = i === 0;
          return (
            <g key={a}>
              <SystemSurface x={700} y={y} w={240} h={44} state={first ? "selected" : "active"} />
              <Annotation x={718} y={y + 27} state="active" size={11} track={0.5}>{a}</Annotation>
              {i < AUR.length - 1 && <line x1={820} y1={y + 44} x2={820} y2={y + 60} stroke={C.steelLine} strokeWidth="1" opacity={0.4} />}
            </g>
          );
        })}
        <Tag x={940} y={392} anchor="end" state="dim">read-only · append-only</Tag>
      </TopologyPlate>
    </div>
  );
}
