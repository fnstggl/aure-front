#!/usr/bin/env python3
"""Build the Aurelius technical memo PDF from memo.html.

Pipeline: headless Chromium print-to-PDF (exact page control, embedded fonts,
selectable text) -> PyMuPDF metadata stamp + optimization -> per-page PNG
renders for visual QA -> text-layer extraction for content QA.

Usage: python3 build.py [--chromium /path/to/chrome]
Outputs land in the parent directory (artifacts/aurelius-technical-memo/).
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
PDF_NAME = "Aurelius_Predictive_Supervisory_Layer_Technical_Memo.pdf"

METADATA = {
    "title": "Aurelius - A Predictive Supervisory Layer for GPU Fleet Control",
    "author": "Beckett Zahedi",
    "subject": "Architecture, Public-Replay Evidence, and a Historical Validation Proposal",
}

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
    png_dir = OUT_DIR / "qa_renders"
    png_dir.mkdir(exist_ok=True)
    for old in png_dir.glob("page-*.png"):
        old.unlink()
    for i, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=fitz.Matrix(2.2, 2.2))  # ~158 dpi
        pix.save(png_dir / f"page-{i}.png")
    text_path = png_dir / "text-layer.txt"
    text_path.write_text(
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
    (png_dir / "links.txt").write_text("\n".join(links), encoding="utf-8")


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
    size_kb = final_pdf.stat().st_size / 1024
    print(f"pages={doc.page_count} size={size_kb:.0f}KB -> {final_pdf}")
    for k, v in doc.metadata.items():
        if k in ("title", "author", "subject"):
            print(f"meta {k}: {v}")
    doc.close()


if __name__ == "__main__":
    main()
