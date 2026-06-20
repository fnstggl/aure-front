import { useInView } from "@/hooks/useInView";
import { Container, Section } from "@/components/site/primitives";
import { Counter } from "@/components/site/Counter";

/* The economic gap — one calm, positive proof point. Aurelius adds the economic
   layer on top of the existing scheduler, so the metric reads forward
   (1.42× goodput / $) rather than as a scary negative. Monochrome, restrained,
   no flashing — the section is a natural continuation of the hero, not a second
   one. */

const SCHEDULER = ["Places workloads", "Enforces capacity", "Balances availability, fairness, and latency"];
const AURELIUS = ["Scores economic tradeoffs", "Forecasts bottlenecks before execution", "Recommends the highest-value safe decision"];

export function ProblemSection() {
  const { ref, inView } = useInView();

  return (
    <Section>
      <Container>
        <div ref={ref} className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-[clamp(1.8rem,3.8vw,2.7rem)] font-medium leading-[1.1] tracking-[-0.025em] text-foreground">
            Your GPU fleet is overspending.
            <br />
            <span className="text-white/50">Your scheduler wasn’t built to stop it alone.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/62 md:text-[16px]">
            Most schedulers optimize for availability, fairness, utilization, and latency. Aurelius
            adds the economic layer: forecasting when, where, and how workloads should run to
            maximize useful output per dollar while respecting hard constraints.
          </p>

          {/* positive proof — goodput per dollar, forward framing only */}
          <div className="mt-10 flex flex-col items-center gap-3.5">
            <div className="inline-flex items-center gap-3 border border-border px-4 py-2.5 font-mono text-[13px]">
              <span className="h-2 w-2 bg-foreground" aria-hidden />
              <span className="text-white/55">Goodput / $</span>
              <span className="tabular-nums text-foreground">
                <Counter to={1.42} enabled={inView} decimals={2} suffix="×" />
              </span>
            </div>
            <p className="font-mono text-[11px] leading-relaxed tracking-tight text-white/32">
              Measured on public Azure traces · −21% GPU-hours · SLA-safe. Not a guaranteed universal result.
            </p>
          </div>
        </div>

        {/* scheduler vs aurelius — placement vs economics */}
        <div className="mx-auto mt-14 grid max-w-3xl gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <div className="bg-background p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Scheduler</div>
            <ul className="mt-4 space-y-2.5">
              {SCHEDULER.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-white/62">
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 bg-white/30" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel">Aurelius</div>
            <ul className="mt-4 space-y-2.5">
              {AURELIUS.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-white/62">
                  <span className="mt-2 inline-block h-1 w-1 shrink-0 bg-signal" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
