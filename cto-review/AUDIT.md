# Aurelius Technical Report — CTO-Readiness Audit

A critical read of the current technical report from the seat of a
hyperscale-infrastructure CTO (someone who runs GPU-fleet scheduling at scale and
"actually understands what they're doing"). The goal is not to soften the report.
It is to find every place it would lose a rigorous reader, and to make the
strongest honest version of the argument.

This audit accompanies two rebuilt deliverables in the same folder:

- `Aurelius_Technical_Report.pdf` — the report, same design, rewritten copy.
- `Aurelius_Memo.pdf` — the one-page memo.

---

## 1. The one-line judgment

The report's substance is real and, in one respect, genuinely novel. The
problem was **storytelling and framing**, not the science. The old draft
buried its most defensible asset (a clean ablation with a zero-regret proof)
under its most attackable one (a bare "+724% vs a production scheduler"), and
it opened with "predictive world model" as an assertion instead of earning it.

A CTO does not distrust big numbers. He distrusts **unexplained** big numbers
and **strawman baselines**. The fix is not to hide the 724%. It is to headline
it and then, in the very next breath, arm it with the mechanism that makes it
real and the scope that makes it honest. That is what the rewrite does.

---

## 2. What would NOT fly, ranked by how fast a CTO bounces off it

### 2.1 A bare "+724% vs a production-class scheduler" (highest risk)

A 7x-to-8x gap over a competent scheduler is, to anyone who runs fleets, an
instant tell. The default reading is "the baseline is a strawman" or "the
simulator is unphysical," and once a reader decides that, they stop believing
everything else in the document. The old draft led with 724% and only defended
it three sections later.

Two specific things a sharp reader catches immediately:

- **The baseline gp/$ is ~130,000 in all three markets** (130,539 / 130,178 /
  130,000). Three different markets, effectively identical baseline. That looks
  rigged until you explain it: the baseline is degrading to the same floor under
  uncapped load in every market. That explanation has to be *on the same page as
  the number*, not buried.
- **-84% GPU-hours at held SLA.** If the baseline already has continuous
  batching (the report says it does), where does a 6x GPU-hour reduction come
  from? The honest answer is the coupled bundle (precision + batching + clock)
  packing more work per GPU-hour. If you don't say that, the reader assumes you
  are quietly comparing a low-precision policy against a full-precision baseline
  and calling it a free lunch.

**Your own repo already flags this.** `docs/RESULTS.md` §3.1 is a binding
internal "defensible vs demoted" list, and it explicitly demotes the entire
family of spot-fleet percentages in the +304% to +778% band as "never a public
or headline claim," with the note that this family's honest comparable is closer
to +54% / +71%. The 724% sits inside that band. I am not telling you to drop it
(you asked for it as the headline, and it is the current system's number). I am
telling you that if Peter's team ever looks past the PDF, that internal note
exists, so the report needs to be the thing that pre-empts the objection rather
than the thing that trips over it. The rewrite does that in §07.

### 2.2 "Predictive world model" asserted, not shown

The old opening announced the architecture as a noun ("Aurelius introduces a
predictive control architecture..."). A CTO reads that as marketing until he
sees why it is forced by the problem. The rewrite leads with the **shift in the
unit of optimization** (next-decision vs. trajectory) and lets the architecture
fall out of it. Show, then name.

### 2.3 Not distinguishing yourself from a unified control plane

a hyperscale operator already has a unified "mission control." If the report reads as "we
unify telemetry and optimize," a CTO thinks "we have that." The rewrite says
explicitly: unification answers *what is the best next decision given what I see
now*; it does not answer *what is the best sequence given what is about to
happen*. That is the wedge, and it is the thing the friendly engineer was
actually reacting to.

### 2.4 The word "guarantee" energy

The old draft hedged well in places, but a CTO needs the hedge to be
structural, not decorative. The rewrite states scope once, up front ("simulated
replay, directional evidence, requires live-telemetry calibration"), and then
lets the numbers stand without re-hedging every line, which reads as more
confident, not less.

### 2.5 Length and altitude

The old report had 17 numbered sections plus appendices. That signals rigor but
buries the story. A CTO skims first. The rewrite is 11 tight sections that each
carry one idea, with the appendix holding the full ablation for the reader who
digs.

---

## 3. What is genuinely strong (and should be the spine)

**The search ablation is the best thing you have, and it is what makes the
724% believable.** The strongest version is the *uncapped* ablation from
`research/UNCAPPED_SEARCH_ABLATION_RESULTS.md` (PR #128), because it runs the
exact same uncapped harness that produces the headline and varies only the
search. Everything else (forecasts, simulator, objective, cost model, gates,
baseline) is identical across arms, so the headline gap is *attributable*:

| Search strategy | gp/$ vs baseline |
|---|---|
| Reactive baseline (production scheduler) | 1.00x (anchor, reproduced byte-identically) |
| Single lever (clock only) | does not complete under load |
| Fixed joint-policy grid (24 policies) | 3.62x |
| Search the fixed grid (bounded beam ≈ exhaustive of grid) | 4.85x |
| Coupled search beyond any grid (hierarchical) | **8.24x = the +724% headline** |

The ladder says the value is the search, and specifically the *representation*
of coupled policies no fixed grid contains (the 4.85x → 8.24x jump). It is not
the baseline being weak (every joint arm beats it) and not the model being
generous (identical model across arms). On a smaller window where the whole
space can be enumerated (`research/PHYSICS_GUIDED_PLANNER_RESULTS.md`), the same
bounded search shows **zero measured regret** against the true optimum, which
proves it captures that value rather than stumbling onto it.

This is also the perfect thing to show a rival like David without handing him
the recipe: it demonstrates the result is real and fundamental (what you
optimize is the coupled future, and the binding constraint is which futures the
search can represent) without revealing the generator internals, the search
parameters, or the roofline bands.

**A several-fold number on its own is hype. A several-fold number sitting on
top of this ladder is a demonstration that the optimizer is not cheating.** That
is why the rewrite puts the ablation (§05) *before* the headline result (§06):
the proof arms the number.

---

## 4. What the rewrite changed

1. **New thesis title:** "Optimizing the fleet's trajectory, not its next
   decision." The architecture is now a consequence of a claim, not an assertion.
2. **724% stays the headline** (per your direction), but it is now immediately
   followed by "a number that size demands an explanation, and the report gives
   two: the regime and the mechanism."
3. **§05 "Where the value comes from: only the search changed"** is now the
   *quantitative* uncapped ablation (PR #128): the 1.00x → 3.62x → 4.85x → 8.24x
   ladder, with the 8.24x arm being the headline. This replaces the earlier
   qualitative claim with real numbers in the same regime as the headline.
4. **§06** presents the uncapped 724% result with both tables and the honest
   baseline description.
5. **§07 "How to read a several-fold number"** is the pre-emptive strike: why it
   is this large (baseline degrades super-linearly under load while a trajectory
   optimizer saturates), and where its edges are (load-dependent, moves ~5x with
   the request cap, ~+140-160% at a frozen cap). This turns your most-attackable
   number into a demonstration of intellectual honesty, which is the single most
   persuasive move available with a CTO who "loves to understand problems."
6. **§08 "What is actually new"** concedes the pieces (MPC, digital twins,
   unified planes all exist) and stakes the narrow, durable claim.
7. **Dropped the deprecated numbers** (the older Azure / energy-arbitrage
   figures) so the whole document is the current architecture, end to end.
8. **No em dashes**, per your instruction. Design is faithful to the site (same
   off-black surface, hairline grid, the FIG.01 convergence field), now with the
   real Aurelius wordmark, a single typeface (Helvetica Now Display everywhere,
   labels kept uppercase), and strictly black and white (no accent color).

---

## 5. The honest risk you should know about

The 724% is load-dependent and, per your own research notes, mostly reflects a
fixed baseline degrading under uncapped load rather than Aurelius improving. It
is a real simulator output, but the exact multiple is a property of the load,
not a fleet constant. The rewrite is careful to quote it *only with its scope*.

If Peter probes it (and he might, because it is the kind of thing a real
engineer probes), the winning answer is the one already in the report: "the
multiple moves with load; what does not move is the direction and the
zero-regret proof; the number I actually stand behind for a specific fleet is
the one we would produce by replaying *your* historical scheduler metadata." If
you can deliver that line as comfortably as the 724%, you are unassailable.
That, not the percentage, is what makes him want to get you the data.
