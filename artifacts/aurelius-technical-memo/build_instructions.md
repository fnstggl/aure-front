# Build instructions - Aurelius technical memo

Standalone, sendable six-page US Letter PDF. Not a website route; nothing here
is deployed. The deliverable is:

    artifacts/aurelius-technical-memo/
      Aurelius_Predictive_Supervisory_Layer_Technical_Memo.pdf   <- attach this
      claim_ledger.md          internal claim-to-source ledger (do not send)
      build_instructions.md    this file
      source/
        memo.html              editable single-file source (HTML + inline CSS + inline SVG)
        build.py               build + QA script
        fonts/                 woff2 files copied from /public/fonts (same repo)
      qa_renders/              per-page PNGs, extracted text layer, link list
                               (regenerated on every build)

## Pipeline

Print-optimized HTML rendered by headless Chromium (exact page control,
embedded font subsets, selectable text, vector SVG diagrams), then PyMuPDF
stamps Document metadata (Title / Author / Subject), garbage-collects and
deflates the file, renders per-page QA PNGs at ~158 dpi, and extracts the
text layer plus link list.

## Rebuild

    pip install pymupdf              # once
    cd artifacts/aurelius-technical-memo/source
    python3 build.py                 # auto-finds Chromium
    # or: python3 build.py --chromium /path/to/chrome

Chromium flags used: --headless=new --no-pdf-header-footer (no browser
headers, footers, timestamps, or URLs) with @page { size: Letter; margin: 0 }
in the CSS. Each .page element is exactly 8.5in x 11in with overflow: hidden,
so the PDF is always exactly six pages; if edits overflow a page, content is
clipped at that page's footer rather than spilling to a seventh page. After
any edit, check qa_renders/text-layer.txt contains all six "PAGE N OF 6"
footers (a missing footer means that page overflowed) and re-inspect the
qa_renders/page-*.png files.

## Fonts

Helvetica Now Display (Regular/Medium, licensed, already present in this
repository at /public/fonts) and IBM Plex Mono (OFL, same location). The
copies in source/fonts/ were duplicated from /public/fonts so the artifact
builds without touching website assets; no new font files were downloaded or
added. The Greek Delta in three table headers falls back to DejaVu Sans Mono
Bold (system font, embedded as a subset in the PDF), because the Plex Mono
latin subset lacks that glyph.

## Editing guardrails

- Exactly six pages; never let content push a seventh.
- Body text at or above 9.5pt; captions/endnotes are the only smaller text.
- No em or en dashes anywhere (hyphens only); verify with
  `grep -c $'—\|–' qa_renders/text-layer.txt` (expect 0).
- Every benchmark number must stay in sync with claim_ledger.md and its
  underlying artifact in the research repository
  (`data/external/mpc_controller/request_cap_sweep.json` and
  `physics_guided_planner_backtest.json`).
- The scope box on page 5 travels with the +724% figure; do not separate
  them.
- No company names, personal names, or logos of any prospective recipient.

## PDF metadata (stamped by build.py)

- Title: Aurelius - A Predictive Supervisory Layer for GPU Fleet Control
- Author: Beckett Zahedi
- Subject: Architecture, Public-Replay Evidence, and a Historical Validation Proposal
