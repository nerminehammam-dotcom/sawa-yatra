#!/usr/bin/env python3
"""
Build tools/photography/photographs.json from the master folders.

This is the single source of truth for the photography on the site: which
master produces which shipped file, where it was taken, and what the caption
and alt text say. Both the derivative pipeline and the page components read it.

It is generated once and then edited by hand, because the parts that matter —
place names, alt text — cannot be derived from a filename. Where the filename
is a camera number the place is written as an empty string and left for a human;
nothing here guesses at a location.

Re-running it will NOT overwrite places or alt text that already exist in the
manifest. It only adds newly-found masters and reports ones that have vanished.

Usage:  python3 tools/photography/scan-masters.py
"""

from __future__ import annotations

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MANIFEST = os.path.join(ROOT, "tools/photography/photographs.json")
SHIPPED_ROOT = os.path.join(ROOT, "public/assets/images")

# Master folders, in route order. These are gitignored and stay on her machine.
MASTER_FOLDERS = [
    ("peru 2025 Web", "Peru", 2025),
    ("bolivia 2025 Web", "Bolivia", 2025),
    ("atacama", "Chile", 2025),
    ("chile 2025 Web", "Chile", 2025),
]

MASTER_EXTENSIONS = {".tif", ".tiff", ".png", ".jpg", ".jpeg"}

# Filename stem -> place. Only entries we are sure of. Anything not listed here
# produces an empty place, which is a question for Nermine, not a guess.
PLACES = [
    ("cuscco", "Cusco, Peru"),
    ("cusco", "Cusco, Peru"),
    ("lima", "Lima, Peru"),
    ("drive la paz puno", "The La Paz to Puno road"),
    ("drive-la-paz-puno", "The La Paz to Puno road"),
    ("drive uyuni lapaz", "The Uyuni to La Paz road"),
    ("la paz", "La Paz, Bolivia"),
    ("uyuni", "Salar de Uyuni, Bolivia"),
    ("astro", "Atacama, Chile"),
    ("patagonia", "Patagonia, Chile"),
    ("patagoina", "Patagonia, Chile"),
    ("paragonia", "Patagonia, Chile"),
]


def key(name: str) -> str:
    stem = os.path.splitext(os.path.basename(name))[0].lower()
    stem = stem.replace("ح", "")  # a stray Arabic character in one filename
    return re.sub(r"[^a-z0-9]+", "", stem)


def place_for(stem: str) -> str:
    low = stem.lower()
    for needle, label in PLACES:
        if low.startswith(needle) or needle in low:
            return label
    return ""


def find_masters():
    found = {}
    for folder, country, year in MASTER_FOLDERS:
        directory = os.path.join(ROOT, folder)
        if not os.path.isdir(directory):
            print(f"  master folder not present, skipping: {folder}")
            continue
        for name in sorted(os.listdir(directory)):
            full = os.path.join(directory, name)
            if not os.path.isfile(full):
                continue
            if os.path.splitext(name)[1].lower() not in MASTER_EXTENSIONS:
                continue
            found[key(name)] = {
                "master": os.path.join(folder, name),
                "country": country,
                "year": year,
                "stem": os.path.splitext(name)[0],
            }
    return found


def find_shipped():
    shipped = {}
    for base, _dirs, files in os.walk(SHIPPED_ROOT):
        for name in files:
            if os.path.splitext(name)[1].lower() not in {".jpg", ".jpeg", ".png"}:
                continue
            rel = os.path.relpath(os.path.join(base, name), SHIPPED_ROOT)
            stem = re.sub(r"^\d+-", "", os.path.splitext(name)[0])
            shipped.setdefault(key(stem), []).append(rel.replace(os.sep, "/"))
    return shipped


def main() -> int:
    masters = find_masters()
    shipped = find_shipped()

    existing = {}
    if os.path.exists(MANIFEST):
        for entry in json.load(open(MANIFEST)):
            existing[entry["out"]] = entry

    entries = []
    unmatched = []
    for mkey, master in sorted(masters.items()):
        outs = shipped.get(mkey)
        if not outs:
            # Try a looser match: one is a prefix of the other.
            outs = [
                o
                for skey, paths in shipped.items()
                if skey.startswith(mkey) or mkey.startswith(skey)
                for o in paths
            ]
        if not outs:
            unmatched.append(master["master"])
            continue

        for out in sorted(set(outs)):
            previous = existing.get(out, {})
            section = out.split("gallery/")[1].split("/")[0] if "/gallery/" in out else None
            entries.append({
                "out": out,
                "master": master["master"],
                "section": section,
                "country": master["country"],
                "year": master["year"],
                # Never overwritten by a re-scan.
                "place": previous.get("place") or place_for(master["stem"]),
                "alt": previous.get("alt", ""),
            })

    entries.sort(key=lambda e: e["out"])
    with open(MANIFEST, "w") as handle:
        json.dump(entries, handle, indent=2)
        handle.write("\n")

    needs_place = [e for e in entries if not e["place"]]
    needs_alt = [e for e in entries if not e["alt"]]

    print(f"  masters found        : {len(masters)}")
    print(f"  manifest entries     : {len(entries)}")
    print(f"  masters with no file : {len(unmatched)}")
    for path in unmatched:
        print(f"      {path}")
    print(f"  entries needing a place : {len(needs_place)}")
    print(f"  entries needing alt text: {len(needs_alt)}")
    print(f"\n  written to {os.path.relpath(MANIFEST, ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
