# Build instructions - Aurelius fleet-trajectory memo (v4)

Standalone, sendable three-page US Letter PDF organized around one idea:
choose the best fleet trajectory, not just the best next action. Independent
of the six-page memo in `artifacts/aurelius-technical-memo/` (unchanged), the
full technical report, and the website.

    artifacts/aurelius-fleet-trajectory-memo/
      Aurelius_Fleet_Trajectory_Memo_v4.pdf   <- attach this (current)
      Aurelius_Fleet_Trajectory_Memo_v3.pdf   <- prior version, kept for reference
      Aurelius_Fleet_Trajectory_Memo_v2.pdf   <- prior version, kept for reference
      claim_ledger.md                         claims, language policy, sources (do not send)
      build_instructions.md                   this file
      source/
        memo.html                             single-file source (HTML + inline CSS + inline SVG) — v4
        memo_v3.html                          v3 source snapshot (reference only)
        memo_v2.html                          v2 source snapshot (reference only)
        build.py                              build + QA script (emits v4)
        fonts/                                Helvetica Now Display woff2 (copied from /public/fonts)
      rendered/                               page-1..3.png, contact-sheet.png,
                                              text-layer.txt, links.txt (regenerated per build)

## Rebuild

    pip install pymupdf pillow
    cd artifacts/aurelius-fleet-trajectory-memo/source
    python3 build.py        # auto-finds Chromium; asserts exactly 3 pages

Pipeline: headless Chromium print-to-PDF (`--no-pdf-header-footer`,
`@page { size: Letter; margin: 0 }`, fixed 8.5in x 11in flex-column pages
with `overflow: hidden` and `flex-shrink: 0` on every direct child), then
PyMuPDF stamps metadata, optimizes, renders per-page PNGs plus a 2x2 contact
sheet, extracts the text layer and links, and runs the language checks below.
To emit v2 or v3 instead, set `PDF_NAME` in build.py and point `print_pdf` at
`memo_v2.html` / `memo_v3.html`.

## Automated checks (build.py fails them loudly)

- Exactly 3 pages; "PAGE 0N / 03" present twice per page in the text layer
  (header and footer; one occurrence means the footer overflowed off-page).
- Banned phrases absent (see claim_ledger.md), including em and en dashes.
- "constructed production-informed replay baseline" present on pages 1 and 3.

## v4 figure grammar (the change from v3)

v3 fixed the palette and type. v4 rebuilds the figure *geometry* so every
diagram reads as one designed system rather than a plotted chart. Do not drift
from this grammar; do not "just thicken lines."

- **One coordinate system.** Every inline SVG uses `viewBox="0 0 520 H"`, so
  one user unit is about one point (the plate content column is ~520pt wide).
  Stroke widths are therefore literal point values. Do **not** use
  `vector-effect: non-scaling-stroke` (it renders too thin at this scale).
  Nodes and turns land on an 8pt grid; routing is orthogonal (right angles),
  never free diagonals.
- **Four semantic line weights, one meaning each:**
  - Selected trajectory / result: **1.5pt `#111110`** (a single unbroken heavy
    spine; also the FIG 03b sequence spine and the FIG 03a bars in solid fill).
  - Feasible, lower-ranked: **0.75pt `#8C8C8C`** (~45%).
  - Rejected: **0.75pt `#BDBDBD`** (~25%), terminated by a clean black **x**
    (two 1.5pt strokes).
  - Structural guide (header rules, axes): **0.5pt `#D2D2D2`** (~18%).
- **No node squares.** Trajectories are clean lines only. Branches fork from a
  single flush vertical; rejection is a black x; the returned trajectory ends in
  one consistent arrowhead (10x10). The actuation boundary is a dashed vertical
  `#111110` 0.75pt line (`stroke-dasharray="2 3"`).
- **Rendering.** Every SVG root group sets `shape-rendering="geometricPrecision"`,
  `text-rendering="geometricPrecision"`, `stroke-linecap="butt"`,
  `stroke-linejoin="miter"`. Colors are literal hex in presentation attributes
  (CSS `var()` does not resolve inside SVG attributes).
- **All figure text is uppercase Helvetica**, tracked, secondary `#6E6A62` /
  emphasis `#111110`. This includes the page-2 figure, now a comparison matrix.

The memo is three pages (three ideas): architecture, controlled ablation,
result + validation. Page 1 leads with the search-compression figure and a
single lead paragraph; the earlier branching-trajectory diagrams (both the page-1
lane tree and the redundant page-3 schematic) were dropped in favour of the
compression story, which is the stronger and more honest engineering claim.

### Per figure
- **FIG 01** (page 1): a **search-compression funnel**. ~4.7M possible
  coupled-policy configurations per decision (connected-surface product,
  `theoretical_combinations()` = 4,723,920) narrow through constraint-aware
  generation and hierarchical search to **72-75** candidate trajectories scored
  per decision (PJM 75 / ERCOT 72 / CAISO 72, `candidate_bundles_evaluated`) to
  **1** returned. Light envelope, bold numbers; the numbers carry the story, not
  a dense field implying millions. Note scopes the zero-regret claim to
  separately tractable spaces.
- **FIG 02** (page 2): the search-strategy ablation is an uppercase comparison
  matrix (SEARCH SPACE / COMPLETION / RELATIVE GP/$ / DELTA / MECHANISM). The
  baseline row is separated by a major rule; the hierarchical row is the
  selected result (top major rule, black, larger ratio).
- **FIG 03a** (page 3): three market bars in solid black measured from the
  1.00x baseline axis, with a dashed mean 8.24x reference.
- **FIG 03b** (page 3): a single spine with plain vertical stage ticks (recorded
  baseline, reconstruct, fidelity gate, freeze, held-out counterfactual,
  shadow-mode decision); counterfactuals are scored only if the fidelity gate
  passes.

## Divider system (standardized in v4)

- Major rule (header underline, section rules, matrix header/emphasis):
  **0.75pt solid `#111110`**.
- Figure frame (plate border): **0.75pt `rgba(17,17,16,0.62)`** — quieter than
  the content lines on purpose, so the selected spine is the heaviest mark.
- Minor rule (plate header/caption, footer, soft separators):
  **0.5pt `rgba(17,17,16,0.20)`**.
- Table row rule: **0.5pt `rgba(17,17,16,0.15)`**.

## Design invariants (unchanged since v3)

- **Black and white only.** No accent color of any kind (grayscale-safe: the
  only chromatic content is the warm paper tone itself). Selection is shown
  through weight, solid black fill, black nodes, and gray suppression, never
  color.
- **One type family: Helvetica Now Display** (400 + 500). No monospace, no
  second family. Body and headline copy stay sentence case; all labels and
  figure text are uppercase.
- Warm off-white page (`#F1F0EC`) on all three pages; plates on `#FBFAF8`.
- Fonts are licensed assets already present in this repository at
  `/public/fonts`; nothing new is downloaded.

## Layout gotchas (learned the hard way)

- Each `.page` is a column flex container. Without `flex-shrink: 0` on
  children, an overflowing page silently crushes the SVG figures to zero
  height instead of clipping; keep that rule.
- Do not put `font-variant-numeric: tabular-nums` on Helvetica Now text: its
  tabular feature gives commas, periods, and hyphens digit-width advances,
  which reads as `3 . 62 x`. Right-align cells instead.
- Because the SVG viewBox width (~520) now matches the content column, figures
  are no longer downscaled the way the v3 744-unit figures were, so a taller
  viewBox costs real page height. Keep figure viewBox heights tight (FIG 01
  160, FIG 03a 84, FIG 03b 56) or pages 2 and 3 overflow their
  footers.

## PDF metadata (stamped by build.py)

- Title: Aurelius - Counterfactual Planning for GPU Fleets
- Author: Beckett Zahedi
- Subject: Fleet-Trajectory Architecture, Public-Replay Evidence, and Historical Validation
