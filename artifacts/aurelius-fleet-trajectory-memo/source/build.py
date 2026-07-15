#!/usr/bin/env python3
"""Build the four-page Aurelius fleet-trajectory memo v2 from memo.html.

Headless Chromium print-to-PDF -> PyMuPDF metadata stamp + optimization ->
per-page PNG renders, a contact sheet, text-layer extraction, and automated
claim-language checks.

Usage: python3 build.py [--chromium /path/to/chrome]
Outputs land in the parent directory (artifacts/aurelius-fleet-trajectory-memo/).
"""
import argparse
import pathlib
import shutil
import subprocess
import sys
import tempfile

import fitz  # PyMuPDF

HERE = pathlib.Path(__file__).resolve().parent
OUT_DIR = HERE.parent
PDF_NAME = "Aurelius_Fleet_Trajectory_Memo_v3.pdf"
EXPECTED_PAGES = 4

METADATA = {
    "title": "Aurelius - Counterfactual Planning for GPU Fleets",
    "author": "Beckett Zahedi",
    "subject": "Fleet-Trajectory Architecture, Public-Replay Evidence, and Historical Validation",
}

BANNED_PHRASES = [
    "production-class scheduler",
    "production-class composite",
    "what a competent operator already runs",
    "production-scale replay",
    "production-comparable",
    "economic posture",
    "common anticipated future",
    "physics-guided",
    "safe default",
    "operator dollar",
    "—",  # em dash
    "–",  # en dash
]
REQUIRED_ON_PAGES = {"constructed production-informed replay baseline": [1, 4]}

DEFAULT_CHROMIUM_CANDIDATES = [
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    shutil.which("chromium") or "",
    shutil.which("chromium-browser") or "",
    shutil.which("google-chrome") or "",
]


def find_chromium(explicit: str | None) -> str:
    candidates = [explicit] if explicit else DEFAULT_CHROMIUM_CANDIDATES
    for c in candidates:
        if c and pathlib.Path(c).exists():
            return c
    sys.exit("No Chromium binary found; pass --chromium /path/to/chrome")


def print_pdf(chromium: str, raw_pdf: pathlib.Path) -> None:
    with tempfile.TemporaryDirectory() as profile:
        cmd = [
            chromium,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            f"--user-data-dir={profile}",
            "--force-color-profile=srgb",
            "--no-pdf-header-footer",
            f"--print-to-pdf={raw_pdf}",
            f"file://{HERE / 'memo.html'}",
        ]
        subprocess.run(cmd, check=True, capture_output=True, timeout=120)


def stamp_and_optimize(raw_pdf: pathlib.Path, final_pdf: pathlib.Path) -> fitz.Document:
    doc = fitz.open(raw_pdf)
    meta = doc.metadata or {}
    meta.update(METADATA)
    doc.set_metadata(meta)
    doc.save(final_pdf, garbage=4, deflate=True)
    doc.close()
    return fitz.open(final_pdf)


def qa_renders(doc: fitz.Document) -> None:
    out = OUT_DIR / "rendered"
    out.mkdir(exist_ok=True)
    for old in out.glob("*.png"):
        old.unlink()

    page_pngs = []
    for i, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=fitz.Matrix(2.2, 2.2))  # ~158 dpi
        path = out / f"page-{i}.png"
        pix.save(path)
        page_pngs.append(path)

    # contact sheet: 2x2 grid at reduced scale
    from PIL import Image

    thumbs = [Image.open(p) for p in page_pngs]
    w, h = thumbs[0].size
    tw, th = w // 2, h // 2
    thumbs = [t.resize((tw, th), Image.LANCZOS) for t in thumbs]
    gap = 24
    sheet = Image.new("RGB", (tw * 2 + gap * 3, th * 2 + gap * 3), (233, 231, 225))
    for idx, t in enumerate(thumbs):
        x = gap + (idx % 2) * (tw + gap)
        y = gap + (idx // 2) * (th + gap)
        sheet.paste(t, (x, y))
    sheet.save(out / "contact-sheet.png")

    (out / "text-layer.txt").write_text(
        "\n\n".join(
            f"===== PAGE {i} =====\n{page.get_text()}" for i, page in enumerate(doc, start=1)
        ),
        encoding="utf-8",
    )
    links = []
    for i, page in enumerate(doc, start=1):
        for l in page.get_links():
            if l.get("uri"):
                links.append(f"page {i}: {l['uri']}")
    (out / "links.txt").write_text("\n".join(links), encoding="utf-8")


def language_checks(doc: fitz.Document) -> list[str]:
    problems = []
    pages_text = [p.get_text() for p in doc]
    full = "\n".join(pages_text).lower()
    for phrase in BANNED_PHRASES:
        if phrase.lower() in full:
            problems.append(f"banned phrase present: {phrase!r}")
    for phrase, pages in REQUIRED_ON_PAGES.items():
        for pno in pages:
            if phrase.lower() not in pages_text[pno - 1].lower().replace("\n", " "):
                problems.append(f"required phrase missing on page {pno}: {phrase!r}")
    for i, t in enumerate(pages_text, start=1):
        if t.upper().count(f"PAGE 0{i} / 04") < 2:
            problems.append(f"footer missing on page {i} (overflow?)")
    return problems


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--chromium", default=None)
    args = ap.parse_args()

    chromium = find_chromium(args.chromium)
    raw_pdf = HERE / "_raw.pdf"
    final_pdf = OUT_DIR / PDF_NAME

    print_pdf(chromium, raw_pdf)
    doc = stamp_and_optimize(raw_pdf, final_pdf)
    raw_pdf.unlink()

    qa_renders(doc)
    problems = language_checks(doc)
    size_kb = final_pdf.stat().st_size / 1024
    status = "OK" if doc.page_count == EXPECTED_PAGES else f"EXPECTED {EXPECTED_PAGES}"
    print(f"pages={doc.page_count} ({status}) size={size_kb:.0f}KB -> {final_pdf}")
    for k, v in doc.metadata.items():
        if k in ("title", "author", "subject"):
            print(f"meta {k}: {v}")
    if problems:
        print("LANGUAGE/LAYOUT PROBLEMS:")
        for p in problems:
            print(f"  - {p}")
    else:
        print("language checks: all clear")
    doc.close()


if __name__ == "__main__":
    main()
