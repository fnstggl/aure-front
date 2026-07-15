# Build instructions - Aurelius fleet-trajectory memo (v3)

Standalone, sendable four-page US Letter PDF organized around one idea:
choose the best fleet trajectory, not just the best next action. Independent
of the six-page memo in `artifacts/aurelius-technical-memo/` (unchanged), the
full technical report, and the website.

    artifacts/aurelius-fleet-trajectory-memo/
      Aurelius_Fleet_Trajectory_Memo_v3.pdf   <- attach this (current)
      Aurelius_Fleet_Trajectory_Memo_v2.pdf   <- prior version, kept for reference
      claim_ledger.md                         claims, language policy, sources (do not send)
      build_instructions.md                   this file
      source/
        memo.html                             single-file source (HTML + inline CSS + inline SVG) — v3
        memo_v2.html                          v2 source snapshot (reference only)
        build.py                              build + QA script (emits v3)
        fonts/                                Helvetica Now Display woff2 (copied from /public/fonts)
      rendered/                               page-1..4.png, contact-sheet.png,
                                              text-layer.txt, links.txt (regenerated per build)

## Rebuild

    pip install pymupdf pillow
    cd artifacts/aurelius-fleet-trajectory-memo/source
    python3 build.py        # auto-finds Chromium; asserts exactly 4 pages

Pipeline: headless Chromium print-to-PDF (`--no-pdf-header-footer`,
`@page { size: Letter; margin: 0 }`, fixed 8.5in x 11in flex-column pages
with `overflow: hidden` and `flex-shrink: 0` on every direct child), then
PyMuPDF stamps metadata, optimizes, renders per-page PNGs plus a 2x2 contact
sheet, extracts the text layer and links, and runs the language checks below.
To emit v2 instead, set `PDF_NAME` in build.py and point it at `memo_v2.html`.

## Automated checks (build.py fails them loudly)

- Exactly 4 pages; "PAGE 0N / 04" present twice per page in the text layer
  (header and footer; one occurrence means the footer overflowed off-page).
- Banned phrases absent (see claim_ledger.md), including em and en dashes.
- "constructed production-informed replay baseline" present on pages 1 and 4.

## v3 design system (do not drift)

- **Black and white only.** No accent color of any kind. The selected
  trajectory and the winning result are shown through heavier line weight,
  solid black fill, black square markers, and gray suppression of
  non-selected paths — never color.
- **One type family: Helvetica Now Display** (400 + 500). No monospace, no
  second family. IBM Plex Mono was removed from this artifact.
- **All figure labels, metadata, table labels, and page markers are
  uppercase Helvetica**, cleanly tracked (~0.14em), not excessively. Body
  and headline copy stay sentence case.
- **Unified figure grammar.** Every figure is a bordered plate with a
  Helvetica uppercase header rule (`FIG NN · title` left, qualifier right)
  and a matching caption strip. Same line weights by role: selected 2.6pt
  black; secondary/rejected 1.2pt gray (`#97948C`); rejection = clean black
  X; selected node = filled black square; feasible-lower = gray square.
- **Hard geometry only.** Straight lines, exact node placement, crisp
  90-degree/consistent-slope turns, dashed actuation boundary. No curves, no
  soft fan-outs, no ornamental micro-lines, no registration crosses, no
  figure-tag boxes.
- Warm off-white page (`#F1F0EC`) on all four pages; plates on `#FBFAF8`.
- Fonts are licensed assets already present in this repository at
  `/public/fonts`; nothing new is downloaded.

## Layout gotchas (learned the hard way)

- Each `.page` is a column flex container. Without `flex-shrink: 0` on
  children, an overflowing page silently crushes the SVG figures to zero
  height instead of clipping; keep that rule.
- Do not put `font-variant-numeric: tabular-nums` on Helvetica Now text:
  its tabular feature gives commas, periods, and hyphens digit-width
  advances, which reads as `3 . 62 ×`. Right-align cells instead.
- SVG viewBox width is 744 units across a ~520pt content column
  (1 unit is about 0.70pt). Keep figure label font-size at or above 9.4
  units (about 6.6pt effective) and everything inside x = 0..744.

## PDF metadata (stamped by build.py)

- Title: Aurelius - Counterfactual Planning for GPU Fleets
- Author: Beckett Zahedi
- Subject: Fleet-Trajectory Architecture, Public-Replay Evidence, and Historical Validation
