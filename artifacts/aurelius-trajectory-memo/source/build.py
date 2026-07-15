#!/usr/bin/env python3
"""Build the four-page Aurelius trajectory memo PDF from memo.html.

Headless Chromium print-to-PDF -> PyMuPDF metadata stamp + optimization ->
per-page PNG renders and text-layer extraction for QA.

Usage: python3 build.py [--chromium /path/to/chrome]
Outputs land in the parent directory (artifacts/aurelius-trajectory-memo/).
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
PDF_NAME = "Aurelius_Fleet_Trajectory_Memo.pdf"
EXPECTED_PAGES = 4

METADATA = {
    "title": "Aurelius - Choose the Best Fleet Trajectory, Not Just the Best Next Action",
    "author": "Beckett Zahedi",
    "subject": "Fleet-trajectory simulation, public-replay evidence, and a bounded historical evaluation proposal",
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
    (png_dir / "text-layer.txt").write_text(
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
    status = "OK" if doc.page_count == EXPECTED_PAGES else f"EXPECTED {EXPECTED_PAGES}"
    print(f"pages={doc.page_count} ({status}) size={size_kb:.0f}KB -> {final_pdf}")
    for k, v in doc.metadata.items():
        if k in ("title", "author", "subject"):
            print(f"meta {k}: {v}")
    doc.close()


if __name__ == "__main__":
    main()
