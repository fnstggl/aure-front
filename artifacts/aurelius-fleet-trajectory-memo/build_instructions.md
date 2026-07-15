# Build instructions - Aurelius fleet-trajectory memo v2

Standalone, sendable four-page US Letter PDF organized around one idea:
choose the best fleet trajectory, not just the best next action. Independent
of the six-page memo in `artifacts/aurelius-technical-memo/` (unchanged), the
full technical report, and the website.

    artifacts/aurelius-fleet-trajectory-memo/
      Aurelius_Fleet_Trajectory_Memo_v2.pdf   <- attach this
      claim_ledger.md                         claims, language policy, sources (do not send)
      build_instructions.md                   this file
      source/
        memo.html                             single-file source (HTML + inline CSS + inline SVG)
        build.py                              build + QA script
        fonts/                                woff2 copied from /public/fonts (same repo)
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

## Automated checks (build.py fails them loudly)

- Exactly 4 pages; every page footer "Page N of 4" present in the text layer
  (a missing footer means that page overflowed).
- Banned phrases absent (see claim_ledger.md), including em and en dashes.
- "constructed production-informed replay baseline" present on pages 1 and 4.

## Layout gotchas (learned the hard way)

- Each `.page` is a column flex container. Without `flex-shrink: 0` on
  children, an overflowing page silently crushes the SVG figures to zero
  height instead of clipping; keep that rule.
- Do not put `font-variant-numeric: tabular-nums` on body text: Helvetica
  Now's tabular feature gives commas, periods, and hyphens digit-width
  advances, which reads as broken word spacing.
- SVG viewBox width is 744 units across a 7.26in content column
  (1 unit is about 0.70pt). Keep figure text at or above 10.5 units and
  everything inside x = 0..744.

## Design system (do not drift)

- One dominant idea and one meaningful technical visual per page; the
  branching-trajectory motif recurs on pages 1, 2, 3, and page 4's ratio fan.
- Sentence-case headlines with normal tracking; no all-caps section labels.
- No bordered content cards; hierarchy via scale, whitespace, hairlines.
- Gold only for: the selected trajectory, the winning result, the fidelity
  gate marker.
- Page 1 dark; pages 2-4 warm off-white. Two type families only: Helvetica
  Now Display (body, headlines) and IBM Plex Mono (metadata, figure labels,
  exact values). No mono body copy. Body 10.5pt; nothing below technical
  footnote size.
- Fonts are licensed assets already present in this repository at
  /public/fonts; nothing new is downloaded.

## PDF metadata (stamped by build.py)

- Title: Aurelius - Counterfactual Planning for GPU Fleets
- Author: Beckett Zahedi
- Subject: Fleet-Trajectory Architecture, Public-Replay Evidence, and Historical Validation
