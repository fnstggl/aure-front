import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const docSections = [
  {
    title: "Architecture",
    description: "System design, component overview, and integration points.",
    href: "#architecture",
  },
  {
    title: "Configuration",
    description: "Environment variables, settings, and deployment options.",
    href: "#configuration",
  },
  {
    title: "Execution Modes",
    description: "Dry-run, live mode, and latency-safe configurations.",
    href: "#execution-modes",
  },
  {
    title: "Security",
    description: "Access controls, audit logging, and compliance.",
    href: "#security",
  },
];

export default function Docs() {
  return (
    <Layout>
      {/* Header */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Documentation
          </h1>
          <p className="text-lg text-muted-foreground">
            Technical reference for Aurelius.
          </p>
        </div>
      </section>

      {/* Doc Sections */}
      <section className="border-t border-border px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-1">
            {docSections.map((section) => (
              <Link
                key={section.href}
                to={section.href}
                className="block border-b border-border py-6 transition-colors duration-150 hover:bg-accent/50"
              >
                <h2 className="mb-2 text-lg font-medium text-foreground">
                  {section.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-lg text-foreground">
            Documentation coming soon.
          </p>
          <p className="text-sm text-muted-foreground">
            Pilot participants receive early technical docs.
          </p>
        </div>
      </section>
    </Layout>
  );
}
