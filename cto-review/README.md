# CTO-review deliverables

Materials prepared for sharing the Aurelius technical story with a
hyperscale-infrastructure CTO. Self-contained; the live site is unchanged.

| File | What it is |
|---|---|
| `AUDIT.md` | Critical read of the prior report from a skeptical CTO's seat: what would not fly, what is strong, and what the rewrite changed. |
| `Aurelius_Technical_Report.pdf` | The technical report, same design as `/technical-report`, rewritten copy. Headlines the +724% result and arms it with the zero-regret ablation. |
| `Aurelius_Memo.pdf` | One-page memo: the shift in the unit of optimization. Light editorial companion to the dark report. |
| `report.html` / `memo.html` | Source for the two PDFs. `/*FONTS*/` is filled at build time. |
| `report_preview.png` / `memo_preview.png` | Full-page renders for quick reference. |
| `build.mjs` | Rebuilds the self-contained HTML (and PDFs where Chromium is available). |

## Rebuild

```
cd cto-review
node build.mjs         # -> report.built.html, memo.built.html (fonts inlined from ../public/fonts)
node build.mjs --pdf   # also renders the PDFs when a Chromium binary is present
```

Typography matches the site: Helvetica Now Display (headings/body) and IBM Plex
Mono (labels/tables), embedded as base64 so the documents carry no external
dependencies.

## Design notes

- Report: off-black `#050505` surface, hairline 12-column frame, corner ticks,
  the FIG.01 "fork, simulate, select" convergence field, mono hairline tables.
  Byte-faithful to the site's technical-report design.
- Memo: warm off-white editorial page, same type system, a single gold hairline
  accent, and the fork-to-one schematic. Deliberately the light counterpart to
  the dark report so the two read as one set.
- No em dashes anywhere in the copy.
