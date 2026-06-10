import { Layout } from "@/components/layout/Layout";
import { Container, Section, SectionEyebrow, Reveal } from "@/components/site/primitives";

const LAST_UPDATED = "June 10, 2026";

type PolicySection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

const policySections: PolicySection[] = [
  {
    id: "01",
    title: "Overview",
    body: (
      <>
        <p>
          Aurelius provides a control layer for economically efficient GPU fleets. This Privacy
          Policy explains what information we collect, how we use it, and the choices you have when
          you use our website, documentation, and the Aurelius software (collectively, the
          &ldquo;Services&rdquo;). We designed Aurelius to be metadata-only and shadow-mode first, and
          that same restraint guides how we handle data about you.
        </p>
        <p>
          By using the Services, you agree to the collection and use of information in accordance
          with this policy. If you do not agree, please do not use the Services.
        </p>
      </>
    ),
  },
  {
    id: "02",
    title: "Information we collect",
    body: (
      <>
        <p>We collect a limited set of information, grouped as follows:</p>
        <ul>
          <li>
            <span className="text-foreground/90">Information you provide.</span> When you contact us,
            request a pilot, or sign up for updates, we collect the details you submit — typically your
            name, work email, company, and the contents of your message.
          </li>
          <li>
            <span className="text-foreground/90">Usage and device data.</span> When you visit our
            website we automatically receive standard log data such as IP address, browser type,
            referring pages, and timestamps, used to keep the site secure and reliable.
          </li>
          <li>
            <span className="text-foreground/90">Scheduler metadata.</span> Where the Aurelius
            software is deployed inside your environment, it reads operational scheduler metadata —
            job timing windows, requested resources, workload class, capacity availability, and
            operator-defined constraints. It does not read prompts, model outputs, training data,
            customer payloads, source code, secrets, or other application contents.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "03",
    title: "What we do not collect",
    body: (
      <>
        <p>
          Aurelius is constrained by construction. The software evaluates scheduler metadata, not the
          data your workloads process. We do not collect, inspect, sell, or use the following to train
          external models:
        </p>
        <ul>
          <li>Prompts, model outputs, or inference results</li>
          <li>Training data, customer payloads, or proprietary datasets</li>
          <li>Source code, secrets, or credentials</li>
          <li>End-user or application contents that pass through your fleet</li>
        </ul>
        <p>
          When deployed inside your environment, workload data does not leave it. Shadow mode is
          read-only by default.
        </p>
      </>
    ),
  },
  {
    id: "04",
    title: "How we use information",
    body: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, operate, maintain, and improve the Services</li>
          <li>Respond to your inquiries, support requests, and pilot applications</li>
          <li>Produce counterfactual reports and economic-efficiency analysis for your fleet</li>
          <li>Monitor, secure, and troubleshoot the Services and prevent abuse</li>
          <li>Send service-related communications and, where you opt in, product updates</li>
          <li>Comply with legal obligations and enforce our agreements</li>
        </ul>
        <p>
          We do not sell your personal information, and we do not use scheduler metadata to train
          models for any party other than to serve your own deployment.
        </p>
      </>
    ),
  },
  {
    id: "05",
    title: "How we share information",
    body: (
      <>
        <p>We share information only in limited circumstances:</p>
        <ul>
          <li>
            <span className="text-foreground/90">Service providers.</span> With vendors who process
            data on our behalf — such as hosting, analytics, and email — under contractual obligations
            to protect it and use it only for the services they provide to us.
          </li>
          <li>
            <span className="text-foreground/90">Legal and safety.</span> When required by law, legal
            process, or to protect the rights, property, or safety of Aurelius, our users, or the
            public.
          </li>
          <li>
            <span className="text-foreground/90">Business transfers.</span> In connection with a
            merger, acquisition, or sale of assets, in which case we will continue to protect your
            information consistent with this policy.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "06",
    title: "Data retention",
    body: (
      <p>
        We retain personal information for as long as needed to provide the Services, comply with our
        legal obligations, resolve disputes, and enforce our agreements. Operational logs and
        scheduler metadata are retained according to the configuration of your deployment; you control
        thresholds and retention windows within your environment. When information is no longer needed,
        we delete or anonymize it.
      </p>
    ),
  },
  {
    id: "07",
    title: "Security",
    body: (
      <p>
        We use administrative, technical, and physical safeguards designed to protect information
        against loss, misuse, and unauthorized access. Aurelius is designed to deploy inside your
        environment so that workload data does not leave it, and the software can be disabled instantly
        via a single environment variable. No method of transmission or storage is completely secure,
        so we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: "08",
    title: "Your rights and choices",
    body: (
      <>
        <p>
          Depending on your location, you may have rights to access, correct, delete, or port your
          personal information, or to object to or restrict certain processing. To exercise these
          rights, contact us using the details below. You can also:
        </p>
        <ul>
          <li>Unsubscribe from product emails using the link in any message</li>
          <li>Control cookies through your browser settings</li>
          <li>Request a copy or deletion of the personal information we hold about you</li>
        </ul>
        <p>We will respond to verified requests within the timeframe required by applicable law.</p>
      </>
    ),
  },
  {
    id: "09",
    title: "Cookies and analytics",
    body: (
      <p>
        Our website uses essential cookies to function and may use privacy-respecting analytics to
        understand aggregate usage. These help us keep the site secure and improve it over time. You
        can disable non-essential cookies through your browser; some features may not work as intended
        if you do.
      </p>
    ),
  },
  {
    id: "10",
    title: "International transfers",
    body: (
      <p>
        We may process and store information in countries other than the one in which you reside. Where
        we transfer personal information across borders, we use appropriate safeguards consistent with
        applicable law to ensure your information remains protected.
      </p>
    ),
  },
  {
    id: "11",
    title: "Children's privacy",
    body: (
      <p>
        The Services are intended for businesses and are not directed to children under 16. We do not
        knowingly collect personal information from children. If you believe a child has provided us
        information, please contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "12",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Last
        updated&rdquo; date above and, for material changes, provide a more prominent notice. Your
        continued use of the Services after an update constitutes acceptance of the revised policy.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <Layout>
      {/* Page header */}
      <section className="relative overflow-hidden pb-12 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
        <Container className="relative">
          <Reveal>
            <SectionEyebrow>Legal</SectionEyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-balance text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-tight text-foreground">
              Privacy Policy
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/62 md:text-base">
              How Aurelius collects, uses, and protects information. Metadata-only by design,
              shadow-mode first — the same restraint that governs the product governs your data.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
              Last updated · {LAST_UPDATED}
            </p>
          </Reveal>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <ul className="divide-y divide-border border-y border-border">
              {policySections.map((section, i) => (
                <Reveal as="li" key={section.id} delay={Math.min(i, 6) * 50}>
                  <article className="flex gap-5 py-9 sm:gap-7">
                    <span className="shrink-0 pt-1 font-mono text-[12px] tabular-nums text-steel/70">
                      {section.id}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-[17px] font-medium tracking-tight text-foreground">
                        {section.title}
                      </h2>
                      <div className="policy-prose mt-3 space-y-3.5 text-[14px] leading-relaxed text-white/64">
                        {section.body}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
