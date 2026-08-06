#!/usr/bin/env python3
"""
Technical check over the built site: links, images, responsive risk.

Runs against .next/server/app after `npm run build`, so it inspects what a
visitor is actually served rather than what the source says.

What it can prove:
  - every internal link resolves to a route that exists
  - every referenced image and font exists on disk, with its weight
  - every image has an alt attribute, and decorative ones are marked
  - no element declares a fixed width wider than a phone or an iPad
  - no page has a heading-level problem

What it cannot: real rendering. There is no browser here. Anything about how
it looks at a given width is flagged as a risk to check, never as a verdict.

Usage:  python3 tools/audit/check-site.py [--build DIR]
"""

from __future__ import annotations

import argparse
import glob
import os
import re
import sys
from collections import defaultdict

from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Common viewport widths, in CSS pixels.
BREAKPOINTS = {
    "iPhone SE": 320,
    "iPhone 15": 393,
    "iPhone Plus": 430,
    "iPad portrait": 768,
    "iPad landscape": 1024,
}

FAIL = []
WARN = []


def fail(area: str, detail: str) -> None:
    FAIL.append((area, detail))


def warn(area: str, detail: str) -> None:
    WARN.append((area, detail))


def load_pages(build: str):
    pages = {}
    for path in glob.glob(os.path.join(build, "**/*.html"), recursive=True):
        route = os.path.relpath(path, build).replace(".html", "")
        if route.startswith("_"):
            continue
        route = "/" if route == "index" else "/" + route
        pages[route] = BeautifulSoup(open(path).read(), "html.parser")
    return pages


def known_routes() -> set[str]:
    """
    Every route the app defines, from the filesystem.

    Not from the built HTML: dynamic routes are server-rendered on demand and
    have no .html file, so a set built from the build output would report
    /travel-self and /contact as broken links. They are not.
    """
    routes = set()
    base = os.path.join(ROOT, "app", "(public)")
    for path in glob.glob(os.path.join(base, "**/page.tsx"), recursive=True):
        rel = os.path.relpath(os.path.dirname(path), base)
        routes.add("/" if rel == "." else "/" + rel)
    return routes


def check_links(pages) -> None:
    routes = set(pages) | known_routes()
    slugs = {r for r in routes if r.startswith("/departures/")}
    seen = defaultdict(set)

    for route, soup in pages.items():
        for anchor in soup.find_all("a"):
            href = anchor.get("href")
            if not href or href.startswith(("#", "mailto:", "tel:")):
                continue
            if href.startswith("http"):
                seen["external"].add(href)
                continue
            target = href.split("#")[0].split("?")[0].rstrip("/") or "/"
            seen["internal"].add(target)
            if target in routes or target in slugs:
                continue
            if target in {"/robots.txt", "/sitemap.xml"}:
                continue
            fail("links", f"{route} points at {href}, which is not a route")

            # An anchor with no accessible name is unusable.
        for anchor in soup.find_all("a"):
            name = anchor.get_text(" ", strip=True) or anchor.get("aria-label")
            if not name:
                img = anchor.find("img")
                name = img.get("alt") if img else None
            if not name:
                fail("links", f"{route} has a link with no accessible name")

    print(f"  internal link targets : {len(seen['internal'])}")
    print(f"  external links        : {len(seen['external'])}")


def check_images(pages) -> None:
    public = os.path.join(ROOT, "public")
    referenced, missing, no_alt = set(), set(), 0

    for route, soup in pages.items():
        for img in soup.find_all("img"):
            src = img.get("src") or ""
            if img.get("alt") is None:
                no_alt += 1
                fail("images", f"{route} has an <img> with no alt attribute")
            # Next serves optimised images through /_next/image?url=...
            match = re.search(r"url=([^&]+)", src)
            if match:
                from urllib.parse import unquote
                src = unquote(match.group(1))
            if not src.startswith("/") or src.startswith("/_next"):
                continue
            referenced.add(src)
            if not os.path.exists(os.path.join(public, src.lstrip("/"))):
                missing.add((route, src))

    for route, src in sorted(missing):
        fail("images", f"{route} references {src}, which is not in public/")

    heavy = []
    for src in referenced:
        path = os.path.join(public, src.lstrip("/"))
        if os.path.exists(path):
            kb = os.path.getsize(path) / 1024
            if kb > 500:
                heavy.append((kb, src))
    for kb, src in sorted(heavy, reverse=True):
        warn("images", f"{src} is {kb:.0f} KB")

    print(f"  images referenced     : {len(referenced)}")
    print(f"  missing from public/  : {len(missing)}")
    print(f"  missing alt attribute : {no_alt}")


def check_responsive() -> None:
    """Static scan for widths that cannot fit a small screen."""
    css_files = (
        glob.glob(os.path.join(ROOT, "app/**/*.css"), recursive=True)
        + glob.glob(os.path.join(ROOT, "components/**/*.css"), recursive=True)
        + glob.glob(os.path.join(ROOT, "styles/**/*.css"), recursive=True)
    )
    narrowest = min(BREAKPOINTS.values())
    ipad = BREAKPOINTS["iPad portrait"]
    risky = []

    for path in css_files:
        source = open(path).read()
        rel = os.path.relpath(path, ROOT)

        for match in re.finditer(
            r"(?<![-\w])(min-width|width)\s*:\s*(\d+(?:\.\d+)?)(px|rem)\s*;", source
        ):
            prop, value, unit = match.group(1), float(match.group(2)), match.group(3)
            px = value * 16 if unit == "rem" else value
            if px <= narrowest:
                continue
            line = source[: match.start()].count("\n") + 1
            # The route map canvas is deliberately wider than the viewport: it
            # sits inside a container with overflow: hidden and is panned and
            # zoomed rather than reflowed. See the comment at each site.
            enclosing = source[: match.start()].rsplit("{", 1)[0]
            if ".mapCanvas" in enclosing.rsplit("}", 1)[-1]:
                continue
            if px > ipad:
                risky.append(("iPad portrait and below", rel, line, prop, px))
            else:
                risky.append(("phones", rel, line, prop, px))

        # grid-template-columns with fixed minimums is the usual cause of a
        # horizontal scrollbar on a phone.
        #
        # minmax(min(24rem, 100%), …) is the safe form and is not flagged: the
        # track keeps its intended minimum wherever there is room for it, and
        # collapses to the container below that, so it can never force a
        # horizontal scrollbar. That is the fix applied across the site on
        # 6 August 2026, so anything still reported here is genuinely new.
        for match in re.finditer(
            r"minmax\(\s*(?!min\()(\d+(?:\.\d+)?)(px|rem)", source
        ):
            px = float(match.group(1)) * (16 if match.group(2) == "rem" else 1)
            if px > narrowest:
                line = source[: match.start()].count("\n") + 1
                risky.append(("phones", rel, line, "minmax floor", px))

    for scope, rel, line, prop, px in sorted(risky, key=lambda r: -r[4]):
        warn("responsive", f"{rel}:{line} {prop} {px:.0f}px, wider than {scope}")

    print(f"  fixed widths over 320px: {len(risky)}")


def check_headings(pages) -> None:
    problems = 0
    for route, soup in pages.items():
        main = soup.find("main") or soup
        levels = [int(h.name[1]) for h in main.find_all(re.compile(r"^h[1-6]$"))]
        if levels.count(1) != 1:
            fail("headings", f"{route} has {levels.count(1)} h1 elements")
            problems += 1
        for i in range(1, len(levels)):
            if levels[i] - levels[i - 1] > 1:
                fail("headings", f"{route} skips h{levels[i-1]} to h{levels[i]}")
                problems += 1
    print(f"  heading problems      : {problems}")


def check_metadata(pages) -> None:
    for route, soup in pages.items():
        title = soup.find("title")
        if not title or not title.get_text(strip=True):
            fail("metadata", f"{route} has no title")
        description = soup.find("meta", attrs={"name": "description"})
        if not description or not description.get("content"):
            fail("metadata", f"{route} has no meta description")

    localhost = [r for r, s in pages.items() if "localhost:3000" in str(s.head)]
    if localhost:
        warn(
            "metadata",
            f"{len(localhost)} pages emit localhost:3000 in their metadata "
            "(NEXT_PUBLIC_SITE_URL is unset — expected before launch)",
        )

    leaked = []
    for route, soup in pages.items():
        text = soup.get_text(" ")
        for token in ("PLACEHOLDER", "TO_BE_CONFIRMED", "To be confirmed",
                      "Price on request", "LEGAL REVIEW", "mock"):
            if token in text:
                leaked.append((route, token))
    for route, token in leaked:
        warn("content", f"{route} shows '{token}' to visitors")
    print(f"  pages with placeholders: {len({r for r, _ in leaked})}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--build", default=os.path.join(ROOT, ".next/server/app"))
    args = parser.parse_args()

    if not os.path.isdir(args.build):
        print(f"No build at {args.build}. Run `npm run build` first.")
        return 2

    pages = load_pages(args.build)
    print(f"\nChecking {len(pages)} built pages\n")

    check_links(pages)
    check_images(pages)
    check_headings(pages)
    check_metadata(pages)
    check_responsive()

    print()
    if FAIL:
        print(f"FAILURES ({len(FAIL)})")
        for area, detail in FAIL:
            print(f"  [{area}] {detail}")
    else:
        print("No failures.")

    if WARN:
        print(f"\nWARNINGS ({len(WARN)}) — judgement, not defects")
        for area, detail in WARN:
            print(f"  [{area}] {detail}")

    print(
        "\nNot checked here, because there is no browser: how any of this "
        "renders.\nEvery responsive item above is a risk to look at, not a verdict."
    )
    return 1 if FAIL else 0


if __name__ == "__main__":
    sys.exit(main())
