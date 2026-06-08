import { Layout } from "@/components/layout/Layout";

const cannotDoList = [
  "Cannot delay jobs beyond specified bounds",
  "Cannot reduce CPU or memory allocations",
  "Cannot access job data, payloads, or outputs",
  "Cannot modify scheduler state or configuration",
  "Cannot override operator decisions",
  "Cannot execute commands on your infrastructure",
];

export default function Safety() {
  return (
    <Layout>
      {/* Header */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Safety
          </h1>
          <p className="text-lg text-muted-foreground">
            Security and operational constraints.
          </p>
        </div>
      </section>

      {/* What Aurelius Cannot Do */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            What Aurelius Cannot Do
          </h2>
          <div className="glass-panel p-8">
            <ul className="space-y-4">
              {cannotDoList.map((item, index) => (
                <li key={index} className="text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Deterministic Behavior */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Deterministic Behavior
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg font-mono text-foreground/90">
              Given the same inputs, Aurelius produces the same decisions.
            </p>
            <p className="leading-relaxed">
              There is no randomness in the decision pipeline. No stochastic sampling. No non-deterministic behavior.
            </p>
            <p className="leading-relaxed">
              All decisions are logged. Every optimization recommendation, every safety gate trigger, every fallback activation is recorded with full context. Logs are auditable and exportable.
            </p>
            <p className="leading-relaxed">
              Outcomes are explainable. If you ask why a specific decision was made, the system will provide a clear, traceable answer. No black boxes. No hidden logic.
            </p>
          </div>
        </div>
      </section>

      {/* Kill Switch & Control */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Kill Switch & Control
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="leading-relaxed">
              Aurelius can be disabled instantly via a single environment variable. No code changes. No deployment. One configuration toggle.
            </p>
            <p className="leading-relaxed">
              Dry-run mode is the default. Aurelius observes and recommends without taking action. Live mode must be explicitly enabled. This is an opt-in, not opt-out.
            </p>
            <p className="leading-relaxed">
              Operators retain full ownership. Every configuration decision, every mode switch, every threshold adjustment is under your control. Aurelius is a tool, not an authority.
            </p>
          </div>
        </div>
      </section>

      {/* Deployment Model */}
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
    </Layout>
  );
}
