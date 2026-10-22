#!/usr/bin/env python3
"""Rebuild committed responsive WebP assets from the original JPEGs.

Optional maintenance tool: Python 3 and Pillow with WebP support are required.
Normal app installation/build uses the committed outputs and needs no Python.
"""

from pathlib import Path

from PIL import Image, ImageOps


IMAGE_DIR = Path(__file__).resolve().parents[1] / "public" / "images"
WIDTHS = (640, 960, 1376)


def main() -> None:
    for name in ("hero-bike", "bike-banner"):
        source = IMAGE_DIR / f"{name}.jpg"
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            for width in WIDTHS:
                if width > image.width:
                    continue
                height = round(image.height * width / image.width)
                output = IMAGE_DIR / f"{name}-{width}.webp"
                image.resize((width, height), Image.Resampling.LANCZOS).save(
                    output, "WEBP", quality=76, method=6
                )
                print(f"{output.name}: {width}x{height}, {output.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
