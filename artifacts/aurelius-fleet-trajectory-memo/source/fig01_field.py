#!/usr/bin/env python3
"""Generate FIG 01's field and write it into memo.html in place.

FIG 01 ("The space of one decision") is a light-mode adaptation of the site's
world-model graphic: one large field of the ~4.7M representable coupled-policy
configurations, a bloom of the 72-75 configurations the bounded search actually
scores (outer #8C8C8C, inner-finalist #6E6A62), and a single ink cell for the
one configuration returned to the control plane, marked with registration ticks.

The field is deterministic (a sine hash), so rebuilds are stable, and it is
drawn from the memo's own grayscale system so it reads as one designed system
with the other figures. This script is the editable source for that field: run
it to regenerate the inline <svg class="fig01-field"> group inside memo.html
after changing any parameter below, then rebuild with build.py.

    python3 fig01_field.py      # rewrites the field group in ./memo.html
"""
import math
import pathlib
import re
from collections import defaultdict

MEMO = pathlib.Path(__file__).with_name("memo.html")

# ---- grid geometry (520-unit coordinate system, ~1 unit = 1pt) ----
COLS, ROWS = 50, 14
PITCH = 10.0
CELL = 7.8
X0, Y0 = 11.0, 9.0

# winner (the one returned decision): vertically centred, right of centre, so the
# focal mark sits in diagonal tension with the bottom-left hero number.
WIN_C, WIN_R = 31, 6
SCORED = 72           # nearest cells toned as "scored"; +1 ink winner = 73
FINALIST = 15         # innermost of the scored set, one step darker (convergence)

# diagonal anisotropy (same idea as the site collapse): tilted-ellipse bloom
DIAG_U, DIAG_V = 0.62, 1.18

# quiet field palette (all lighter than the #8C8C8C scored tone), warm-neutral,
# then the two bloom weights and the ink decision.
FIELD_TONES = ["#DBDAD5", "#D0CFCA", "#C6C5BF", "#BCBBB5"]
FIELD_W = [0.40, 0.30, 0.19, 0.11]
SCORED_TONE = "#8C8C8C"    # feasible / scored (outer bloom)
FINALIST_TONE = "#6E6A62"  # higher-scoring finalists (inner bloom)
INK = "#111110"            # the one returned decision


def rand(n: float) -> float:
    x = math.sin(n * 12.9898 + 78.233) * 43758.5453
    return x - math.floor(x)


def pick_tone(i: int) -> str:
    r = rand(i * 3.17 + 1.0)
    acc = 0.0
    for tone, w in zip(FIELD_TONES, FIELD_W):
        acc += w
        if r <= acc:
            return tone
    return FIELD_TONES[-1]


def build_field() -> str:
    is_winner = lambda r, c: (r == WIN_R and c == WIN_C)

    cells = []
    for r in range(ROWS):
        for c in range(COLS):
            dr, dc = r - WIN_R, c - WIN_C
            dist = math.hypot((dr + dc) * DIAG_U, (dr - dc) * DIAG_V)
            cells.append((dist, r, c))
    ordered = sorted((x for x in cells if not is_winner(x[1], x[2])),
                     key=lambda t: (t[0], t[1], t[2]))
    scored_list = [(r, c) for _, r, c in ordered[:SCORED]]
    finalist_set = set(scored_list[:FINALIST])
    scored_set = set(scored_list[FINALIST:])

    paths_by_tone = defaultdict(list)
    for r in range(ROWS):
        for c in range(COLS):
            if is_winner(r, c):
                continue  # drawn last, with registration marks
            x, y = X0 + c * PITCH, Y0 + r * PITCH
            if (r, c) in finalist_set:
                tone = FINALIST_TONE
            elif (r, c) in scored_set:
                tone = SCORED_TONE
            else:
                tone = pick_tone(r * COLS + c)
            paths_by_tone[tone].append(f"M{x:g} {y:g}h{CELL:g}v{CELL:g}h-{CELL:g}z")

    lines = []
    for tone in FIELD_TONES + [SCORED_TONE, FINALIST_TONE]:
        if paths_by_tone.get(tone):
            note = "  <!-- scored -->" if tone == SCORED_TONE else (
                "  <!-- finalists -->" if tone == FINALIST_TONE else "")
            lines.append(f'<path fill="{tone}" d="{"".join(paths_by_tone[tone])}"/>{note}')

    wx, wy = X0 + WIN_C * PITCH, Y0 + WIN_R * PITCH
    cx, cy = wx + CELL / 2, wy + CELL / 2
    g, tk = 3.6, 5.0  # gap from cell, tick length
    lines += [
        f'<rect x="{wx:g}" y="{wy:g}" width="{CELL:g}" height="{CELL:g}" fill="{INK}"/>',
        f'<g stroke="{INK}" stroke-width="0.75">',
        f'<line x1="{cx:g}" y1="{wy-g:g}" x2="{cx:g}" y2="{wy-g-tk:g}"/>',
        f'<line x1="{cx:g}" y1="{wy+CELL+g:g}" x2="{cx:g}" y2="{wy+CELL+g+tk:g}"/>',
        f'<line x1="{wx-g:g}" y1="{cy:g}" x2="{wx-g-tk:g}" y2="{cy:g}"/>',
        f'<line x1="{wx+CELL+g:g}" y1="{cy:g}" x2="{wx+CELL+g+tk:g}" y2="{cy:g}"/>',
        '</g>',
    ]
    return "\n    ".join(lines)


def main() -> None:
    field = build_field()
    html = MEMO.read_text()
    pat = re.compile(
        r'(<svg class="fig01-field"[^>]*>\s*<g[^>]*>\n)    .*?(\n    </g>\s*</svg>)',
        re.DOTALL,
    )
    m = pat.search(html)
    if not m:
        raise SystemExit("fig01-field <svg> group not found in memo.html")
    MEMO.write_text(html[:m.start()] + m.group(1) + "    " + field + m.group(2) + html[m.end():])
    print(f"FIG 01 field written to {MEMO.name}: {COLS}x{ROWS} cells, "
          f"{SCORED} scored ({FINALIST} finalists) + 1 returned.")


if __name__ == "__main__":
    main()
