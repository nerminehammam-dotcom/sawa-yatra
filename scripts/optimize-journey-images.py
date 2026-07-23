#!/usr/bin/env python3
"""Create web-ready journey photographs from the founder-owned HD originals."""

from __future__ import annotations

import re
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageCms, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_ROOT = ROOT / "public/assets/images/departures/andean/gallery"
MAX_EDGE = 2400
JPEG_QUALITY = 78

PHOTO_GROUPS: dict[str, tuple[str, ...]] = {
    "desert-coast": (
        "peru 2025 Web/lima 01.png",
        "peru 2025 Web/lima 02.png",
        "peru 2025 Web/lima 05.png",
        "peru 2025 Web/lima 08.png",
        "peru 2025 Web/lima 017a.png",
        "peru 2025 Web/lima 017ae.png",
    ),
    "white-city-deep-canyon": (
        "peru 2025 Web/_Z8N0729-Enhanced-NR copy.png",
        "peru 2025 Web/_Z8N0934.png",
        "peru 2025 Web/_Z8N7811 copy.png",
        "peru 2025 Web/london 0j.png",
        "peru 2025 Web/london 0ps.png",
        "peru 2025 Web/london 02.png",
    ),
    "the-stone-road": (
        "peru 2025 Web/cuscco 01.png",
        "peru 2025 Web/cusco 13.png",
        "peru 2025 Web/cusco 15.png",
        "peru 2025 Web/cusco 19.png",
        "peru 2025 Web/_Z8N9873 copy.png",
    ),
    "both-shores": (
        "peru 2025 Web/drive-la-paz-puno-05.png",
        "peru 2025 Web/drive la paz puno 09.png",
        "peru 2025 Web/drive la paz puno 10.png",
        "bolivia 2025 Web/drive la paz puno 01.png",
        "bolivia 2025 Web/drive la paz puno 04.png",
        "bolivia 2025 Web/drive la paz puno 05.png",
    ),
    "thin-air-cloud-forest": (
        "bolivia 2025 Web/la paz 05.png",
        "bolivia 2025 Web/la paz 09 copy 2.png",
        "bolivia 2025 Web/drive uyuni lapaz 03.png",
        "bolivia 2025 Web/drive uyuni lapaz 04.png",
        "bolivia 2025 Web/drive uyuni lapaz 010.png",
        "bolivia 2025 Web/drive uyuni lapaz 011.png",
        "bolivia 2025 Web/drive uyuni lapaz 300.png",
    ),
    "silver-and-bone": (
        "bolivia 2025 Web/bolivia 01 3.png",
        "bolivia 2025 Web/bolivia 01a.png",
        "bolivia 2025 Web/bolivia 02a.png",
        "bolivia 2025 Web/bolivia 03a.png",
        "bolivia 2025 Web/bolivia 04a.png",
        "bolivia 2025 Web/bolivia 07a.png",
        "bolivia 2025 Web/drive uyuni lapaz 09.png",
        "bolivia 2025 Web/drive uyuni lapaz 012.png",
        "bolivia 2025 Web/drive uyuni lapaz 013 2.png",
        "bolivia 2025 Web/drive uyuni lapaz 29.png",
    ),
    "the-mirror": (
        "atacama/uyuni 01.png",
        "atacama/uyuni 04.png",
        "atacama/uyuni 05.png",
        "atacama/bolivia 11a.png",
        "atacama/drive uyuni lapaz 07 2.png",
    ),
    "atacama": (
        "atacama/astro 01.png",
        "atacama/astro 02.png",
        "atacama/_Z8N5462.png",
        "atacama/_DSC536ح6.png",
    ),
    "the-end-of-the-road": (
        "chile 2025 Web/patagonia 62.png",
        "chile 2025 Web/patagonia 13.png",
        "chile 2025 Web/patagonia 10.png",
        "chile 2025 Web/patagonia 8.png",
        "chile 2025 Web/patagonia 04.tif",
        "chile 2025 Web/paragonia 02.tif",
        "chile 2025 Web/patagoina-01.jpg",
        "chile 2025 Web/patagonia 03.tif",
        "chile 2025 Web/patagonia 41.png",
        "chile 2025 Web/_Z8N7627-copy.jpg",
        "chile 2025 Web/patagonia 50.png",
        "chile 2025 Web/_Z8N7909-copy.jpg",
        "chile 2025 Web/chile 016.tif",
        "chile 2025 Web/patagonia 5.png",
        "chile 2025 Web/naila 06.tif",
        "chile 2025 Web/patagonia 36.png",
        "chile 2025 Web/patagonia 37.png",
        "chile 2025 Web/patagonia 33.png",
        "chile 2025 Web/chile 011.tif",
        "chile 2025 Web/patagonia 2.png",
        "chile 2025 Web/naila 03.tif",
    ),
}


def slugify(value: str) -> str:
    value = value.lower().replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "photo"


def to_srgb(image: Image.Image) -> Image.Image:
    icc_profile = image.info.get("icc_profile")
    if icc_profile:
        try:
            source_profile = ImageCms.ImageCmsProfile(BytesIO(icc_profile))
            target_profile = ImageCms.createProfile("sRGB")
            return ImageCms.profileToProfile(
                image,
                source_profile,
                target_profile,
                outputMode="RGB",
            )
        except (ImageCms.PyCMSError, OSError, ValueError):
            pass
    return image.convert("RGB")


def optimize(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        image = to_srgb(image)
        image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        image.save(
            destination,
            "JPEG",
            quality=JPEG_QUALITY,
            optimize=True,
            progressive=True,
            subsampling="4:2:0",
        )


def main() -> None:
    source_bytes = 0
    output_bytes = 0
    image_count = 0

    for section_slug, source_names in PHOTO_GROUPS.items():
        for index, source_name in enumerate(source_names, start=1):
            source = ROOT / source_name
            if not source.is_file():
                raise FileNotFoundError(source)

            filename = f"{index:02d}-{slugify(source.stem)}.jpg"
            destination = OUTPUT_ROOT / section_slug / filename
            optimize(source, destination)

            source_bytes += source.stat().st_size
            output_bytes += destination.stat().st_size
            image_count += 1
            print(destination.relative_to(ROOT))

    saved = 1 - (output_bytes / source_bytes)
    print(
        f"Optimized {image_count} photographs: "
        f"{source_bytes / 1_000_000:.1f} MB to "
        f"{output_bytes / 1_000_000:.1f} MB ({saved:.1%} smaller)."
    )


if __name__ == "__main__":
    main()
