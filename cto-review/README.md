# CTO-review deliverables

Materials prepared for sharing the Aurelius technical story with a
hyperscale-infrastructure CTO. Self-contained; the live site is unchanged.

| File | What it is |
|---|---|
| `AUDIT.md` | Critical read of the prior report from a skeptical CTO's seat: what would not fly, what is strong, and what the rewrite changed. |
| `Aurelius_Technical_Report.pdf` | The technical report, same design as `/technical-report`, rewritten copy. Headlines the +724% result and arms it with the zero-regret ablation. |
| `Aurelius_Memo.pdf` | One-page memo: the shift in the unit of optimization. Light editorial companion to the dark report. |
| `report.html` / `memo.html` | Source for the two PDFs. `/*FONTS*/` and `LOGO_SRC` are filled at build time. |
| `report_preview.jpg` / `memo_preview.png` | Full-page renders for quick reference. |
| `build.mjs` | Rebuilds the self-contained HTML (and PDFs where Chromium is available). |

## Rebuild

```
cd cto-review
node build.mjs         # -> report.built.html, memo.built.html (fonts + logo inlined from ../public)
node build.mjs --pdf   # also renders the PDFs when a Chromium binary is present
```

Typography is a single typeface, Helvetica Now Display, embedded as base64 from
`../public/fonts`; labels and tables reuse it uppercase. The Aurelius wordmark is
inlined from `../public/aure_logo.png`. No external dependencies.

## Design notes

- Report: off-black `#050505` surface, hairline 12-column frame, corner ticks,
  the FIG.01 "fork, simulate, select" convergence field, hairline tables.
  Faithful to the site's technical-report design. Strictly black and white.
- Memo: warm off-white editorial page, same type system, the fork-to-one
  schematic. Deliberately the light counterpart to the dark report so the two
  read as one set. `runaurelius.com` in the footer.
- One typeface, no accent color, no em dashes. §05 carries the PR #128 uncapped
  search ablation (1.00x -> 3.62x -> 4.85x -> 8.24x), which attributes the
  headline to the search.
