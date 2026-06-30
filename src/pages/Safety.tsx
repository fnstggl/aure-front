import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Reveal, Arrow } from "@/components/site/primitives";
import { PageFrame, Band, Grid, Kicker } from "@/components/site/structure";
import { EvaluationSequence } from "@/components/site/EvaluationSequence";

/* /safety. A calm, architecture-first safety brief for infrastructure
   engineers evaluating a pilot. The message the reader should leave with:
   Aurelius begins as an analysis tool, not a control system. It reads recorded
   scheduler metadata, replays the operator's own traces offline, and never
   modifies production unless the operator explicitly enables it.

   Deliberately quieter than the Technical Report: no interior rails, no
   figure-number kickers, generous whitespace. One architectural figure (a
   one-way metadata flow), one access table, one evaluation sequence. Behaviour
   is described, not promised; constraint language stays factual. Monochrome by
   intent. Short declarative sentences, no em dashes. */

/* What read-only means, concretely. Operator confidence rests on the contrast
   between these two columns. */
const READS = [
  "Queue state and depth",
  "GPU and resource availability",
  "Historical job events",
  "Timestamps and durations",
  "Placement history",
  "Resource utilization",
];

const NOT_ACCESSED = [
  "Prompts",
  "Model outputs",
  "Training datasets",
  "Customer payloads",
  "Secrets",
  "Credentials",
];

export default function Safety() {
  return (
    <Layout>
      <PageFrame>
        {/* ============================== Masthead ============================== */}
        <Band rails={false} className="border-t border-border">
          <Grid>
            <div className="col-span-1 px-6 pb-16 pt-32 sm:px-8 md:col-span-10 md:pb-20 md:pt-40 lg:px-10">
              <Reveal>
                <Kicker>Safety</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="mt-7 max-w-[20ch] text-balance text-[clamp(2rem,4.6vw,3.2rem)] font-normal leading-[1.05] tracking-[-0.03em] text-foreground">
                  Aurelius begins as an analysis tool, not a control system.
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-7 max-w-2xl text-[15.5px] leading-relaxed text-white/60">
                  Every evaluation begins as a historical replay against recorded scheduler traces.
                  Aurelius evaluates scheduling decisions entirely offline before any shadow mode or
                  optional production integration.
                </p>
              </Reveal>
              <Reveal delay={170}>
                <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-white/45">
                  Unlike systems that immediately participate in production scheduling, Aurelius is
                  designed to begin entirely offline, on your own recorded workloads, before any
                  interaction with a live control plane.
                </p>
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ===================== 1 · Initial evaluation (figure) ===================== */}
        <Band rails={false} className="py-24 md:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-10 lg:px-10">
              <Reveal>
                <Kicker>Initial evaluation</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 max-w-2xl text-balance text-[clamp(1.55rem,3vw,2.1rem)] font-normal leading-[1.1] tracking-[-0.03em] text-foreground">
                  Metadata flows in. Nothing flows back.
                </h2>
              </Reveal>
              <Reveal delay={110}>
                <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-white/52">
                  During an evaluation, Aurelius reads recorded scheduler metadata, replays it
                  offline, and produces a savings report. It does not write to your scheduler, move
                  workloads, or read the contents of your jobs.
                </p>
              </Reveal>
              <Reveal delay={150} className="mt-12">
                <InitialEvaluationFigure />
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ===================== 2 · What Aurelius can access (table) ===================== */}
        <Band rails={false} className="py-24 md:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-10 lg:px-10">
              <Reveal>
                <Kicker>What Aurelius can access</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 max-w-2xl text-balance text-[clamp(1.55rem,3vw,2.1rem)] font-normal leading-[1.1] tracking-[-0.03em] text-foreground">
                  Read-only means scheduler metadata, not the work itself.
                </h2>
              </Reveal>
              <Reveal delay={110}>
                <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-white/52">
                  Aurelius reads scheduler metadata such as queue state, capacity, and job history.
                  During evaluation it does not access prompts, model outputs, training data, or
                  customer payloads, and that telemetry is not used to train a foundation model.
                </p>
              </Reveal>
              <Reveal delay={150} className="mt-11">
                <AccessTable />
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ===================== 3 · How evaluation works (sequence) ===================== */}
        <Band rails={false} className="py-24 md:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-10 lg:px-10">
              <Reveal>
                <Kicker>How evaluation works</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="mt-6 max-w-2xl text-balance text-[clamp(1.55rem,3vw,2.1rem)] font-normal leading-[1.1] tracking-[-0.03em] text-foreground">
                  Constraints are checked before a recommendation exists.
                </h2>
              </Reveal>
              <Reveal delay={110}>
                <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-white/52">
                  A recommendation is the output of a sequence that runs mostly offline.
                  Recommendations that violate configured hard constraints, such as latency, SLA,
                  placement, or capacity limits, are filtered before presentation.
                </p>
              </Reveal>
              <Reveal delay={150} className="mt-12">
                <EvaluationSequence />
              </Reveal>
            </div>
          </Grid>
        </Band>

        {/* ===================== Operator control (no CTA) ===================== */}
        <Band rails={false} divide={false} className="py-24 md:py-32">
          <Grid>
            <div className="col-span-1 px-6 sm:px-8 md:col-span-10 lg:px-10">
              <Reveal>
                <Kicker>Operator control</Kicker>
              </Reveal>
              <Reveal delay={60}>
                <p className="mt-7 max-w-2xl text-balance text-[clamp(1.25rem,2.4vw,1.7rem)] font-normal leading-[1.3] tracking-[-0.03em] text-white/88">
                  By default, Aurelius evaluates historical scheduler behavior and produces
                  recommendations. It does not modify production infrastructure unless an operator
                  explicitly enables production integration.
                </p>
              </Reveal>
              <Reveal delay={110}>
                <p className="mt-6 max-w-2xl text-[14.5px] leading-relaxed text-white/50">
                  Historical replay precedes shadow recommendations. Shadow recommendations precede
                  any optional production integration. Operators remain in control throughout every
                  stage.
                </p>
              </Reveal>
              <div className="mt-14">
                <Link
                  to="/"
                  className="font-mono text-[12px] uppercase tracking-[0.07em] text-white/35 transition-colors hover:text-white/75"
                >
                  ← Back to home
                </Link>
              </div>
            </div>
          </Grid>
        </Band>
      </PageFrame>
    </Layout>
  );
}

/* ------------------------------------------------------------------ */
/* Figure. One-way metadata flow.                                      */
/* ------------------------------------------------------------------ */

/* The single architectural figure. Metadata moves in one direction, from the
   operator's scheduler into Aurelius. Aurelius's outputs stay on its own side.
   The footer states, plainly, what never crosses back. */
function InitialEvaluationFigure() {
  return (
    <figure className="max-w-xl">
      <div className="border border-border">
        <div className="flex flex-col items-center px-6 py-11 sm:py-12">
          {/* Operator side */}
          <Node label="Your infrastructure" title="Scheduler" sub="queue state · capacity · job history" />

          {/* the one and only connection. Read-only, inbound to Aurelius. */}
          <div className="flex flex-col items-center py-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-white/45">
              read-only metadata
            </span>
            <Arrow className="mt-2 rotate-90 text-white/35" />
          </div>

          {/* Aurelius side. Produces analysis that stays on its side. */}
          <Node
            label="Aurelius"
            title="Offline evaluation"
            lines={["Offline replay", "Baseline comparison", "Savings report"]}
          />
        </div>

        <figcaption className="flex flex-col gap-1 border-t border-border px-6 py-4 text-center font-mono text-[10.5px] uppercase tracking-[0.06em] text-white/42 sm:flex-row sm:justify-center sm:gap-0">
          <span>No production changes</span>
          <span className="hidden px-2 text-white/16 sm:inline" aria-hidden>·</span>
          <span>No workload movement</span>
          <span className="hidden px-2 text-white/16 sm:inline" aria-hidden>·</span>
          <span>No payload access</span>
        </figcaption>
      </div>
    </figure>
  );
}

function Node({
  label,
  title,
  sub,
  lines,
}: {
  label: string;
  title: string;
  sub?: string;
  lines?: string[];
}) {
  return (
    <div className="w-full max-w-[18rem] border border-border-strong px-5 py-4 text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">{label}</div>
      <div className="mt-1.5 text-[15px] font-medium tracking-tight text-foreground">{title}</div>
      {sub && <div className="mt-2 font-mono text-[11px] leading-relaxed text-white/45">{sub}</div>}
      {lines && (
        <div className="mt-2.5 grid gap-1 text-[13px] text-white/68">
          {lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Access table. Reads / Does not access during evaluation.            */
/* ------------------------------------------------------------------ */

function AccessTable() {
  return (
    <div className="grid grid-cols-1 border border-border md:grid-cols-2">
      <div className="px-6 py-7 md:px-8">
        <div className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.07em] text-white/60">
          <Check />
          Reads · scheduler metadata
        </div>
        <ul className="mt-6 grid gap-3.5">
          {READS.map((r) => (
            <li key={r} className="text-[14px] leading-snug text-white/82">
              {r}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-border px-6 py-7 md:border-l md:border-t-0 md:px-8">
        <div className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.07em] text-white/38">
          <Cross />
          Does not access during evaluation
        </div>
        <ul className="mt-6 grid gap-3.5">
          {NOT_ACCESSED.map((r) => (
            <li key={r} className="text-[14px] leading-snug text-white/42">
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
      <path d="M2 7.5L5.5 11 12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

function Cross() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
      <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}


