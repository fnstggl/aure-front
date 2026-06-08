import { Layout } from "@/components/layout/Layout";

export default function HowItWorks() {
  return (
    <Layout>
      {/* Header */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            How It Works
          </h1>
          <p className="text-lg text-muted-foreground">
            Technical documentation for infrastructure engineers.
          </p>
        </div>
      </section>

      {/* Execution Model */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Execution Model
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="leading-relaxed">
              Aurelius does not replace your scheduler. It does not intercept payloads. It does not modify job execution directly.
            </p>
            <p className="leading-relaxed">
              Instead, Aurelius operates as an advisory layer. It evaluates pending decisions before they reach execution. It observes job metadata, forecasts energy conditions, generates optimization options, and filters risky decisions — all without touching the execution path.
            </p>
            <p className="leading-relaxed">
              Your scheduler remains in full control. Aurelius provides recommendations. Execution remains unchanged.
            </p>

            {/* Minimal Diagram */}
            <div className="my-12 glass-panel p-8">
              <div className="flex items-center justify-between text-sm">
                <div className="text-center">
                  <div className="mb-2 text-muted-foreground">Scheduler</div>
                  <div className="h-12 w-24 border border-border flex items-center justify-center text-foreground">
                    Jobs
                  </div>
                </div>
                <div className="flex-1 mx-4 border-t border-border relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-muted-foreground text-xs">
                    →
                  </span>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-muted-foreground">Aurelius</div>
                  <div className="h-12 w-24 border border-foreground/30 flex items-center justify-center text-foreground">
                    Advise
                  </div>
                </div>
                <div className="flex-1 mx-4 border-t border-border relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-muted-foreground text-xs">
                    →
                  </span>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-muted-foreground">Execution</div>
                  <div className="h-12 w-24 border border-border flex items-center justify-center text-foreground">
                    Run
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forecasting Layer */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Forecasting Layer
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="leading-relaxed">
              Aurelius uses short-horizon forecasting to predict energy cost and carbon intensity. Forecasts are generated using lag-based signals derived from historical patterns and real-time grid data.
            </p>
            <p className="leading-relaxed">
              All forecasts include explicit uncertainty bounds. When uncertainty exceeds acceptable thresholds, Aurelius applies a deterministic fallback — defaulting to conservative assumptions rather than speculative optimization.
            </p>
            <p className="leading-relaxed">
              There is no ML magic here. No black-box models. Forecasts are transparent, auditable, and explainable. If you ask why a decision was made, you will receive a clear answer.
            </p>
          </div>
        </div>
      </section>

      {/* Optimization vs Safety */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Optimization vs Safety
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="glass-panel p-6">
              <h3 className="mb-4 text-lg font-medium text-foreground">
                Optimization
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Finds lower-cost execution windows</li>
                <li>Identifies lower-carbon periods</li>
                <li>Ranks options by expected savings</li>
                <li>Respects resource constraints</li>
              </ul>
            </div>
            <div className="glass-panel p-6">
              <h3 className="mb-4 text-lg font-medium text-foreground">
                Safety
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Quantile-based safety gates</li>
                <li>Latency-safe constraints</li>
                <li>Deterministic fallback</li>
                <li>Conservative defaults</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-lg text-foreground font-medium">
            Safety always wins.
          </p>
        </div>
      </section>

      {/* Latency-Safe Mode */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Latency-Safe Mode
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="leading-relaxed">
              Latency-safe mode enforces a zero-slack requirement. Jobs must complete within their original time bounds. No exceptions.
            </p>
            <p className="leading-relaxed">
              Start-time preservation ensures that scheduled jobs begin exactly when expected. There is no power throttling — CPU and memory allocations remain unchanged. If optimization cannot be achieved within these constraints, an invisible fallback is applied automatically.
            </p>
            <p className="leading-relaxed">
              The goal is simple: workloads behave exactly as they would without Aurelius. The only difference is lower energy cost and carbon emissions — when safe.
            </p>
          </div>
        </div>
      </section>

      {/* Savings Clarification */}
      <section className="border-t border-border px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-muted-foreground leading-relaxed">
            Most savings come from time-shifting batch and training workloads away from peak pricing windows — not from throttling or resource reduction.
          </p>
        </div>
      </section>
    </Layout>
  );
}