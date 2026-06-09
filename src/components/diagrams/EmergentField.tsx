import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* "Order emerging from complexity."
   A canvas field of dim telemetry points that slowly organizes into a fleet
   topology; a soft blue→violet glow reveals forecast structure; a gold path
   resolves the selected safe decision. Then it dissolves back to noise.

   - Drawn into a fixed-size canvas (absolute inset-0): zero layout impact.
   - Pauses when off-screen; renders one resolved frame under reduced motion.
   - Subtle by design so hero copy stays fully readable. */

const CYCLE = 17000; // ms — slow, elegant loop

const SPINE: [number, number][] = [
  [0.06, 0.66],
  [0.2, 0.57],
  [0.35, 0.63],
  [0.5, 0.5],
  [0.65, 0.56],
  [0.8, 0.45],
  [0.94, 0.53],
];

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// rise 0→1 across [inA,inB], hold, fall 1→0 across [outA,outB]
function pulse(p: number, inA: number, inB: number, outA: number, outB: number) {
  return smoothstep(inA, inB, p) * (1 - smoothstep(outA, outB, p));
}

export function EmergentField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // seeded PRNG for a stable composition
    let seed = 20260608;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    type Pt = { nx: number; ny: number; tx: number; ty: number; ph: number; sp: number; cool: boolean };
    let points: Pt[] = [];
    let edges: Array<[number, number]> = [];

    const buildModel = () => {
      seed = 20260608;
      const count = W < 680 ? 120 : 210;
      const cols = 20;
      const rows = 11;
      points = [];
      for (let i = 0; i < count; i++) {
        const c = i % cols;
        const r = Math.floor(i / cols) % rows;
        const tx = (c + 0.5) / cols + (rnd() - 0.5) * 0.03;
        const ty = (r + 0.5) / rows + (rnd() - 0.5) * 0.06;
        points.push({ nx: rnd(), ny: rnd(), tx, ty, ph: rnd() * Math.PI * 2, sp: 0.3 + rnd() * 0.7, cool: tx > 0.52 });
      }
      edges = [];
      for (let i = 0; i < points.length && edges.length < 90; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].tx - points[j].tx;
          const dy = points[i].ty - points[j].ty;
          if (Math.hypot(dx, dy) < 0.085 && rnd() < 0.16) {
            edges.push([i, j]);
            if (edges.length >= 90) break;
          }
        }
      }
    };

    const resize = () => {
      W = parent.clientWidth;
      H = parent.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildModel();
    };

    const draw = (p: number, structure: number, forecast: number, gold: number) => {
      ctx.clearRect(0, 0, W, H);
      const easeStruct = smoothstep(0, 1, structure);
      const driftAmp = (1 - easeStruct) * 0.05;

      const px = (pt: Pt, t: number) => {
        const nx = pt.nx + Math.sin(t * 0.00018 * pt.sp + pt.ph) * driftAmp;
        const ny = pt.ny + Math.cos(t * 0.00016 * pt.sp + pt.ph) * driftAmp;
        return [(nx * (1 - easeStruct) + pt.tx * easeStruct) * W, (ny * (1 - easeStruct) + pt.ty * easeStruct) * H];
      };

      const now = reduced ? 0 : performance.now();

      // forecast glow (blue → violet) revealing structure on the right field
      if (forecast > 0.01) {
        const g = ctx.createRadialGradient(W * 0.66, H * 0.5, 0, W * 0.66, H * 0.5, Math.max(W, H) * 0.5);
        g.addColorStop(0, `hsla(213,100%,74%,${0.1 * forecast})`);
        g.addColorStop(0.5, `hsla(248,56%,60%,${0.07 * forecast})`);
        g.addColorStop(1, "hsla(248,56%,60%,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // lattice edges (topology emerging) — fade in with structure
      if (structure > 0.02) {
        ctx.lineWidth = 1;
        const edgeA = 0.09 * structure * structure;
        for (const [a, b] of edges) {
          const [ax, ay] = px(points[a], now);
          const [bx, by] = px(points[b], now);
          const cool = points[a].cool && points[b].cool && forecast > 0.05;
          ctx.strokeStyle = cool
            ? `hsla(213,100%,74%,${edgeA * (0.6 + forecast * 0.6)})`
            : `hsla(0,0%,100%,${edgeA})`;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }

      // telemetry points
      for (const pt of points) {
        const [x, y] = px(pt, now);
        const flick = 0.82 + 0.18 * Math.sin(now * 0.0008 * pt.sp + pt.ph);
        const baseA = (0.12 + 0.28 * structure) * flick;
        if (pt.cool && forecast > 0.05) {
          ctx.fillStyle = `hsla(208,100%,80%,${baseA * (0.55 + forecast * 0.6)})`;
        } else {
          ctx.fillStyle = `hsla(0,0%,100%,${baseA})`;
        }
        ctx.beginPath();
        ctx.arc(x, y, 1.15 + 0.35 * structure, 0, Math.PI * 2);
        ctx.fill();
      }

      // gold selected-decision path through the spine
      if (gold > 0.01) {
        const pts = SPINE.map(([sx, sy]) => [sx * W, sy * H] as [number, number]);
        ctx.save();
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        // build smooth path
        const path = new Path2D();
        path.moveTo(pts[0][0], pts[0][1]);
        for (let i = 0; i < pts.length - 1; i++) {
          const [x0, y0] = pts[i];
          const [x1, y1] = pts[i + 1];
          const mx = (x0 + x1) / 2;
          const my = (y0 + y1) / 2;
          path.quadraticCurveTo(x0, y0, mx, my);
        }
        path.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);

        // approximate length for dash reveal
        let len = 0;
        for (let i = 0; i < pts.length - 1; i++) len += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
        ctx.setLineDash([len, len]);
        ctx.lineDashOffset = len * (1 - gold);

        ctx.shadowColor = `hsla(40,46%,58%,${0.55 * gold})`;
        ctx.shadowBlur = 11 * gold;
        ctx.strokeStyle = `hsla(43,54%,66%,${0.92 * gold})`;
        ctx.lineWidth = 1.8;
        ctx.stroke(path);
        ctx.restore();

        // gold nodes appear as the path reaches them
        ctx.shadowColor = `hsla(40,46%,58%,${0.6 * gold})`;
        ctx.shadowBlur = 8 * gold;
        for (let i = 0; i < pts.length; i++) {
          const reach = smoothstep(i / pts.length - 0.15, i / pts.length + 0.05, gold);
          if (reach <= 0.02) continue;
          ctx.fillStyle = `hsla(45,58%,78%,${reach * gold})`;
          ctx.beginPath();
          ctx.arc(pts[i][0], pts[i][1], 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
    };

    let raf = 0;
    let running = false;
    const start = performance.now();

    const frame = () => {
      const elapsed = performance.now() - start;
      const p = (elapsed % CYCLE) / CYCLE;
      const structure = pulse(p, 0.05, 0.46, 0.82, 0.99);
      const forecast = pulse(p, 0.5, 0.62, 0.82, 0.93);
      const gold = pulse(p, 0.6, 0.78, 0.87, 0.96);
      draw(p, structure, forecast, gold);
      raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0.72, 1, 0.75, 0.82); // resolved static frame
    });
    ro.observe(parent);

    if (reduced) {
      draw(0.72, 1, 0.75, 0.82);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? startLoop() : stopLoop()));
        },
        { threshold: 0 },
      );
      io.observe(canvas);
      return () => {
        stopLoop();
        ro.disconnect();
        io.disconnect();
      };
    }

    return () => {
      stopLoop();
      ro.disconnect();
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
