import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import heroBackground from "@/assets/hero-background.png";

const preExecutionSteps = [
  {
    title: "Predicts future grid conditions",
    description: "Price, carbon intensity, congestion forecasts with explicit uncertainty bounds.",
  },
  {
    title: "Evaluates which jobs are safe to move",
    description: "Latency requirements, deadlines, restart cost analysis.",
  },
  {
    title: "Applies strict safety and latency constraints",
    description: "No SLA violations. Conservative fallback by default.",
  },
  {
    title: "Produces auditable, explainable decisions",
    description: "Dry-run or live. Every decision logged with full context.",
  },
];

const systemSteps = [
  {
    number: "1",
    title: "Observe",
    description:
      "Aurelius reads job metadata only. No code. No payloads. No outputs. It inspects what your scheduler already knows — job type, resource requirements, timing constraints — without accessing the work itself.",
  },
  {
    number: "2",
    title: "Forecast",
    description:
      "Energy cost and carbon intensity are predicted using deterministic models with explicit uncertainty bounds. Short-horizon forecasts with lag-based signals. No black boxes. No ML magic.",
  },
  {
    number: "3",
    title: "Decide",
    description:
      "Optimization decisions are generated under strict constraints. Every decision respects latency requirements, resource availability, and operational boundaries. Options are ranked by expected savings.",
  },
  {
    number: "4",
    title: "Filter",
    description:
      "Quantile-based safety gates remove risky decisions. If a decision falls outside acceptable bounds, it is discarded. Conservative fallback is applied automatically.",
  },
  {
    number: "5",
    title: "Execute",
    description:
      "Jobs run through your existing schedulers — unchanged. Aurelius does not replace or intercept execution. It advises. Your infrastructure remains in control.",
  },
];

const safetyPoints = [
  "Default dry-run mode",
  "Deterministic decisions",
  "Kill switch via environment variable",
  "No scheduler replacement",
  "No execution throttling in latency-safe mode",
  "No payload access",
  "Auditable decision logs",
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section with Background Image */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        {/* Background Image with fade-in */}
        <div 
          className="absolute inset-0 z-0 animate-fade-in"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-8 animate-fade-in">
          <h1 className="mb-6 text-4xl font-normal leading-tight text-foreground md:text-5xl lg:text-6xl whitespace-nowrap" style={{ letterSpacing: '-0.03em' }}>
            The predictive control layer for energy
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Reduce energy cost and carbon emissions by predicting grid conditions before workloads run—without changing execution.
          </p>
          
          {/* Trust Line */}
          <p className="mx-auto mb-12 max-w-2xl text-sm text-muted-foreground/70">
            Deterministic. Auditable. Safe-by-default. Designed for shadow execution.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Operating Mode Indicator */}
            <div className="mb-4 sm:mb-0 sm:absolute sm:top-0 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-32">
              <span className="inline-block border border-border px-3 py-1 text-xs font-mono text-muted-foreground">
                Mode: Dry-run (default)
              </span>
            </div>
            
            <Button
              variant="default"
              size="lg"
              asChild
              className="rounded-lg px-8 h-12 bg-foreground text-background hover:bg-foreground/90"
            >
              <Link to="/contact">See what you would have saved</Link>
            </Button>
            <Button variant="link" size="lg" className="text-foreground" asChild>
              <Link to="/how-it-works">How it works</Link>
            </Button>
          </div>
          
          {/* Zero-Impact Signal */}
          <p className="mt-6 text-xs text-muted-foreground/60 font-mono">
            Dry-run by default. No execution impact.
          </p>
        </div>
      </section>

      {/* System Boundary Diagram Strip */}
      <section className="border-t border-border px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-4 text-sm font-mono text-muted-foreground">
            <span>Workloads</span>
            <span className="text-muted-foreground/50">→</span>
            <span className="text-foreground">Aurelius</span>
            <span className="text-muted-foreground/50">→</span>
            <span>Scheduler</span>
            <span className="text-muted-foreground/50">→</span>
            <span>Execution</span>
          </div>
        </div>
      </section>

      {/* Why This Exists Section */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Your scheduler is costing you money
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Modern schedulers optimize for availability, fairness, and latency — not energy.
            </p>
            <p>
              Once a job is scheduled, its energy cost is effectively locked in.
            </p>
            <p>
              The scheduler does not know:
            </p>
            <ul className="space-y-2 pl-6 text-muted-foreground">
              <li>what electricity will cost in 4 hours</li>
              <li>when renewable generation will surge</li>
              <li>when grids enter peak congestion pricing</li>
            </ul>
            <p>
              This makes energy optimization reactive at best and impossible at scale.
            </p>
            <p className="text-foreground">
              Aurelius exposes the savings your scheduler cannot see — before execution, not after.
            </p>
          </div>
        </div>
      </section>

      {/* What Happens Before Execution Section */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-16 text-2xl font-semibold tracking-tight text-foreground">
            What Aurelius does before your workload runs
          </h2>
          <div className="grid gap-16 md:grid-cols-2">
            {preExecutionSteps.map((step, index) => (
              <div key={index}>
                <h3 className="mb-3 text-lg font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Model Section */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Deployment model
          </h2>
          <pre className="text-sm font-mono text-muted-foreground leading-loose">
{`Aurelius (sidecar / control layer)
  ├─ Reads scheduler state
  ├─ Evaluates future energy conditions
  ├─ Produces decisions
  └─ Logs outcomes (append-only)`}
          </pre>
        </div>
      </section>

      {/* Positioning Section */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Aurelius sits between your scheduler and execution layer, evaluating when energy-aware optimization is safe — and when it is not.
          </p>
          <p className="mt-6 text-sm text-muted-foreground/70">
            Designed for platform, infra, and energy teams.
          </p>
        </div>
      </section>

      {/* System Overview Section */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-16 text-2xl font-semibold tracking-tight text-foreground">
            System Overview
          </h2>
          <div className="space-y-16">
            {systemSteps.map((step) => (
              <div key={step.number} className="flex gap-8">
                <span className="flex-shrink-0 text-sm font-medium text-muted-foreground">
                  {step.number}.
                </span>
                <div>
                  <h3 className="mb-3 text-lg font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Determinism Statement */}
      <section className="border-t border-border px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg text-muted-foreground font-mono">
            Every decision is reproducible, explainable, and auditable.
If you replay the same inputs, you get the same outcome every time.
          </p>
        </div>
      </section>

      {/* Safety by Design Section */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Why this can be deployed without risk
          </h2>
          <div className="glass-panel p-8">
            <ul className="space-y-3">
              {safetyPoints.map((point, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-8 text-lg text-muted-foreground">
            Run a shadow audit on your workloads.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/shadow-audit">Request access</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
