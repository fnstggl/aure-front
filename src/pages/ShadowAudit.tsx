import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const whatYouSee = [
  "Approved decisions — optimizations that would have been applied",
  "Skipped decisions — and the specific reason each was rejected",
  "Simulated savings — energy cost and carbon emissions reduction",
  "Latency guarantees preserved — proof that no SLA would be violated",
];

export default function ShadowAudit() {
  return (
    <Layout>
      {/* Header */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Shadow Audit
          </h1>
          <p className="text-lg text-muted-foreground">
            See what would happen without changing anything.
          </p>
        </div>
      </section>

      {/* What Is a Shadow Audit */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            What Is a Shadow Audit
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="leading-relaxed">
              A shadow audit runs Aurelius in dry-run mode against your existing workloads. Nothing changes. No permissions are required beyond read access to job metadata.
            </p>
            <p className="leading-relaxed">
              Aurelius observes your scheduler activity, applies its forecasting and optimization logic, and records what decisions it would have made — without executing any of them.
            </p>
            <p className="leading-relaxed">
              The result is a complete picture of potential savings and safety behavior, with zero risk to your production environment.
            </p>
          </div>
        </div>
      </section>

      {/* What You See */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            What You See
          </h2>
          <div className="glass-panel p-8">
            <ul className="space-y-4">
              {whatYouSee.map((item, index) => (
                <li key={index} className="text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Output Artifact */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Output Artifact
          </h2>
          <div className="space-y-6 text-muted-foreground">
            <p className="leading-relaxed">
              The shadow audit produces a structured report designed for infrastructure teams. The format matches the Aurelius interface — black background, white text, zero clutter.
            </p>
            <div className="glass-panel p-8 my-8">
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Energy delta</span>
                  <span className="text-foreground">-12.4%</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Cost delta</span>
                  <span className="text-foreground">-$4,280/mo</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Carbon delta</span>
                  <span className="text-foreground">-8.2 tCO2e/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency impact</span>
                  <span className="text-foreground">None</span>
                </div>
              </div>
            </div>
            <p className="leading-relaxed">
              Reports include energy, cost, and carbon deltas. Operational notes explain any decisions that were filtered out by safety gates. Every number is auditable.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-8 text-lg text-muted-foreground">
            Run your shadow audit.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact">Request access</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}