# Build instructions - Aurelius four-page trajectory memo

Standalone, sendable four-page US Letter PDF organized around one idea:
choose the best fleet trajectory, not just the best next action. Built from
scratch; independent of the six-page memo in
`artifacts/aurelius-technical-memo/` (kept unchanged) and of the website.

    artifacts/aurelius-trajectory-memo/
      Aurelius_Fleet_Trajectory_Memo.pdf    <- attach this
      claim_ledger.md                       figure-to-source ledger (do not send)
      build_instructions.md                 this file
      source/
        memo.html                           single-file source (HTML + inline CSS + inline SVG)
        build.py                            build + QA script
        fonts/                              woff2 copied from /public/fonts (same repo)
      qa_renders/                           page PNGs, text layer, links (regenerated per build)

## Rebuild

    pip install pymupdf
    cd artifacts/aurelius-trajectory-memo/source
    python3 build.py        # auto-finds Chromium; asserts exactly 4 pages

Pipeline: headless Chromium print-to-PDF (`--no-pdf-header-footer`,
`@page { size: Letter; margin: 0 }`, fixed 8.5in x 11in pages with
overflow: hidden), then PyMuPDF metadata stamp + optimization + QA renders.
After any edit, confirm `qa_renders/text-layer.txt` contains all four
"Page N of 4" footers (a missing footer means overflow) and re-inspect the
page PNGs.

## Design system (do not drift)

- One dominant idea per page; branching-trajectory motif recurs on pages 1,
  2 (column glyphs), 3, and as the average marker on page 4.
- Sentence-case claim headlines; no all-caps section labels.
- Almost no bordered boxes; hierarchy via scale, whitespace, and hairlines.
- Gold marks only the selected trajectory or the winning result.
- Page 1 dark; pages 2-4 light. No text below 8pt. No paragraph over ~75
  words. No em or en dashes (verify: `grep -c $'—\|–' qa_renders/text-layer.txt`).
- Fonts: Helvetica Now Display 400/500 + IBM Plex Mono 400/500, already
  licensed and present in this repository; nothing new downloaded.

## PDF metadata (stamped by build.py)

- Title: Aurelius - Choose the Best Fleet Trajectory, Not Just the Best Next Action
- Author: Beckett Zahedi
- Subject: Fleet-trajectory simulation, public-replay evidence, and a bounded historical evaluation proposal
