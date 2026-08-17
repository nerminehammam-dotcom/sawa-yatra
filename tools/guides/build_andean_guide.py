#!/usr/bin/env python3
"""Build the Sawayatra Andean Caravan client guide design proof.

This script reads the inspected DOCX structure JSON and produces a standalone
review PDF. It does not touch the website or the source document.
"""

from __future__ import annotations

import json
import math
import re
from dataclasses import dataclass
from html import escape
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph


ROOT = Path("/Users/mimou/Documents/Sawayatra")
SOURCE_JSON = ROOT / "tmp/pdfs/source-guide-structure.json"
OUT = ROOT / "output/pdf/Sawayatra-Andean-Caravan-Client-Journey-Guide-design-draft.pdf"
LOG = ROOT / "tmp/pdfs/designed-guide-build-log.json"
LOGO = ROOT / "tmp/pdfs/sawayatra-wordmark.png"

PAGE_W, PAGE_H = A4

PAPER = HexColor("#E7E1D6")
INK = HexColor("#27231F")
SIGNAL = HexColor("#F05A2A")
SIGNAL_TEXT = HexColor("#B03A0C")
CLAY = HexColor("#A96F47")
SUN = HexColor("#E5BC4F")
OLIVE = HexColor("#98904F")
PINK = HexColor("#EEB6C4")
BLUE = HexColor("#7EA8C0")
WHITE = HexColor("#FFFFFF")

MARGIN = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

FONT_DIR = Path("/System/Library/Fonts/Supplemental")
FONT_FILES = {
    "Editorial": FONT_DIR / "Georgia.ttf",
    "EditorialBold": FONT_DIR / "Georgia Bold.ttf",
    "EditorialItalic": FONT_DIR / "Georgia Italic.ttf",
    "EditorialBoldItalic": FONT_DIR / "Georgia Bold Italic.ttf",
    "Operations": FONT_DIR / "Arial.ttf",
    "OperationsBold": FONT_DIR / "Arial Bold.ttf",
    "OperationsItalic": FONT_DIR / "Arial Italic.ttf",
    "Mono": FONT_DIR / "Courier New.ttf",
    "MonoBold": FONT_DIR / "Courier New Bold.ttf",
}

for name, path in FONT_FILES.items():
    pdfmetrics.registerFont(TTFont(name, str(path)))

pdfmetrics.registerFontFamily(
    "Editorial",
    normal="Editorial",
    bold="EditorialBold",
    italic="EditorialItalic",
    boldItalic="EditorialBoldItalic",
)
pdfmetrics.registerFontFamily(
    "Operations",
    normal="Operations",
    bold="OperationsBold",
    italic="OperationsItalic",
    boldItalic="OperationsBold",
)


@dataclass(frozen=True)
class Day:
    number: int
    title: str
    route: str
    sleep: str
    movement: str
    rhythm: str
    body: tuple[str, ...]


@dataclass(frozen=True)
class Section:
    number: str
    name: str
    subtitle: str
    gate: str
    duration: str
    day_start: int
    day_end: int
    accent: object
    photo: Path
    intro_paragraph: int
    facts_table: int
    stage_paragraphs: tuple[int, ...]
    before_heading: int
    before_bullets: tuple[int, ...]
    sleep_paragraphs: tuple[int, ...]
    glance_note_heading: int | None = None
    glance_note_paragraphs: tuple[int, ...] = ()
    glance_note_table: int | None = None
    before_note_heading: int | None = None
    before_note_paragraphs: tuple[int, ...] = ()


SECTIONS = (
    Section(
        "01",
        "Sea to Stone",
        "Pacific coast, desert, deep canyon and the Stone Road",
        "Lima to Puno",
        "23 days · Maximum 12 travellers",
        1,
        23,
        SIGNAL,
        ROOT / "public/assets/images/departures/andean/gallery/white-city-deep-canyon/05-london-0ps.jpg",
        59,
        4,
        (61, 63, 65),
        91,
        (92, 93, 94, 96, 97, 98, 99),
        (101,),
        66,
        (67,),
    ),
    Section(
        "02",
        "Both Shores",
        "Titicaca, La Paz and the cloud forest",
        "Puno to Sucre",
        "16 days · Maximum 12 travellers",
        24,
        39,
        OLIVE,
        ROOT / "public/assets/images/departures/andean/gallery/both-shores/01-drive-la-paz-puno-05.jpg",
        112,
        17,
        (114, 116),
        132,
        (133, 134, 135, 136, 137, 138, 139),
        (141, 142),
    ),
    Section(
        "03",
        "The Mirror",
        "Silver cities, wet-season salt, high lagoons and the Atacama",
        "Sucre to Santiago",
        "18 days · Maximum 12 travellers",
        40,
        57,
        PINK,
        ROOT / "public/assets/images/departures/andean/gallery/the-mirror/01-uyuni-01.jpg",
        153,
        26,
        (155, 157, 159),
        173,
        (174, 175, 176, 177, 178, 179, 180),
        (182,),
        None,
        (),
        27,
        183,
        (184,),
    ),
    Section(
        "04",
        "The End of the Road",
        "The Carretera Austral to Villa O'Higgins and back to the ferry",
        "Santiago to Balmaceda",
        "14 days · Maximum 12 travellers",
        58,
        71,
        SUN,
        ROOT / "public/assets/images/departures/andean/gallery/carretera-austral/end-road-hero.webp",
        196,
        37,
        (198, 200, 202),
        211,
        (212, 213, 214, 215, 216),
        (218,),
        None,
        (),
        None,
        219,
        (220,),
    ),
)


CALLOUTS: dict[int, tuple[tuple[str, str], ...]] = {
    5: (("Weather", "If boats are suspended, the reserve becomes the primary landscape day and receives more time. Departure depends on harbour clearance and sea state."),),
    11: (("Altitude", "A written symptom, oxygen, descent and medical-transfer protocol is required before this day is offered."),),
    14: (("Laundry", "A laundry opportunity is planned here, subject to final confirmation."),),
    20: (("Permits", "Do not name a circuit, entry time or viewpoint as guaranteed until the 2028 permits are issued and purchased."),),
    23: (
        ("Timing", "As checked on 8 August 2026, services from Cusco operated on Wednesdays, Fridays and Sundays from January to April. Day 23 must land on a secured 2028 operating day, and Day 1 falls one weekday earlier. The final calendar will be set around this service and the Chile Chico ferry."),
        ("At the gate", "Travellers joining Section 02 at Puno have completed the arranged Cusco progression and are already in Puno. The Section 01 group meets them on the evening of Day 23 or the morning of Day 24, and the handover is protected."),
    ),
    27: (
        ("Why the buffer", "This buffer remains unprogrammed. It is not back-filled with a compulsory excursion or converted into an optional paid tour."),
        ("Laundry", "A laundry opportunity is planned here; it is expected to be one of only two reliable ones between Cusco and Sucre."),
    ),
    35: (
        ("Protected recovery", "This recovery day remains genuinely open. Any optional individual activity may be declined so the day can remain completely free."),
        ("Laundry", "A laundry opportunity is planned here, subject to final confirmation."),
    ),
    40: (("Laundry", "A laundry opportunity is planned here; it is expected to be the last reliable one before the Salar."),),
    46: (("Crossing briefing", "The Days 49-53 load is restated here in full, in person: five consecutive Demanding days, three refuge nights between approximately 4,100 and 4,600 m, shared bathrooms, limited heating, and a pre-dawn border day. Nobody should first understand this from a briefing; it is disclosed before sale - but it is confirmed here, and a traveller may withdraw from the crossing at this point under the agreed terms."),),
    48: (("Protected day", "This day sits immediately before the Declared Load Exception. It stays at a single base and is not extended, however good the conditions look."),),
    49: (("Changing salt", "Write \"two days allotted to the Salar\", not \"two days driving across the flooded Salar\". The first is honest under changing water; the second is not."),),
    51: (("Altitude and cold", "Final departure documents will state the expected night temperature, heating hours, bedding, toilet type and emergency communications for the selected refuge."),),
    52: (("Why this day is demanding", "The drive is the shortest of the crossing, but this is the third consecutive night at altitude in a refuge without normal recovery conditions. The cumulative sleep debt is the principal load."),),
    53: (("Border", "Reconfirm 2028 border hours and Chile's entry declarations. Travellers declare relevant food, herb, wood, animal and plant products; Chile's SAG decides what is admissible."),),
    54: (
        ("Protected day", "This day closes the Declared Load Exception. The morning is not available for any fixed content, optional excursion or early departure, however the group appears on arrival. Do not attach Valle de la Luna to the previous border day."),
        ("Laundry", "A laundry opportunity is planned here; it is expected to be the first since Sucre."),
    ),
    56: (
        ("Night sky", "A small astronomy evening may be scheduled on Day 54 or Day 56 only when sky, moon, operator capacity and weather make it worthwhile. It is never guaranteed, and it is not stacked after El Tatio for the same traveller."),
        ("Puritama", "Outside the core programme. If later offered, it sits only as an individual choice on Day 56 and cannot be combined with El Tatio or the astronomy evening for the same traveller."),
    ),
    58: (("At the gate", "The Day 58 briefing serves travellers who have been on the road for 57 days and travellers who arrived last night. It must work for both without making either sit through the other's orientation. Santiago is a high-volume joining gate; resource it accordingly."),),
    60: (("Weather", "Contract a written cancellation outcome and inspect the exact vessel's boarding, handrails, seating, enclosure and toilet provision."),),
    61: (("Laundry", "A laundry opportunity is planned here; the next reliable one is expected in Coyhaique on Day 70."),),
    62: (("Access", "Tortel is not step-free. Measure the selected property's actual distance, stairs, gradient, handrails and wet-weather surface. If porterage is unavailable, final departure documents will state the exact guest-carried load."),),
    64: (("Weather", "The sailing remains planned and subject to weather. Both Day 64 and Day 65 remain protected as usable windows and write the remedy if neither operates."),),
    67: (("Why Puerto Guadal", "Puerto Guadal is an overnight, not a daytime pause. It breaks the demanding return into a more manageable sequence. Exact movement time, road conditions and property access will be confirmed before departure."),),
    69: (("Timing", "The final itinerary will work backwards from the secured 2028 morning ferry. The operator requires correct vehicle dimensions and may change or cancel sailings. Current hours are not treated as future fact. This ferry and the Day 23 train are the two anchors of the whole 71-day calendar."),),
    70: (("Resilient ending", "If a ferry or road delay consumes Day 70, the closing table is dropped without regret. A short breakfast and route-record handover moves to Day 71 before the airport. The ending survives disruption because it has two forms, not because the buffer is sacrificed."),),
    71: (("Included exit flight", "The Balmaceda to Santiago flight is part of every product that closes at Balmaceda. For a traveller finishing fourteen days of Patagonia or seventy-one days of the Caravan, Sawayatra returns them to the international gateway rather than dissolving at a regional check-in desk."),),
}


def clean_text(value: str) -> str:
    value = value.replace("\u00a0", " ")
    value = value.replace("\u2011", "-").replace("\u2013", "-").replace("\u2014", "-")
    value = value.replace("LaPaz", "La Paz").replace("driverhours", "driver hours")
    value = value.replace("theBorder", "the Border").replace("andinsurance", "and insurance")
    value = re.sub(r"[ \t]+", " ", value)
    return value.strip()


def para_html(value: str) -> str:
    return escape(clean_text(value)).replace("\n", "<br/>")


def style(
    name: str,
    font: str,
    size: float,
    leading: float,
    color=INK,
    space_after: float = 0,
    alignment: int = TA_LEFT,
) -> ParagraphStyle:
    return ParagraphStyle(
        name=name,
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=color,
        spaceAfter=space_after,
        alignment=alignment,
        allowWidows=0,
        allowOrphans=0,
    )


S_BODY = style("body", "Operations", 10.6, 15.2)
S_BODY_SMALL = style("body-small", "Operations", 9.7, 13.6)
S_LEAD = style("lead", "Editorial", 16, 22)
S_NOTE = style("note", "Mono", 8.4, 11.2)
S_KICKER = style("kicker", "MonoBold", 8.4, 10, SIGNAL_TEXT)
S_H1 = style("h1", "EditorialBold", 29, 34)
S_H2 = style("h2", "EditorialBold", 21, 26)
S_H3 = style("h3", "EditorialBold", 14, 18)


def draw_paragraph(c: canvas.Canvas, text: str, x: float, y_top: float, width: float, paragraph_style: ParagraphStyle) -> float:
    p = Paragraph(text, paragraph_style)
    _, h = p.wrap(width, PAGE_H)
    p.drawOn(c, x, y_top - h)
    return y_top - h


def draw_image_cover(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float, focal_x=0.5, focal_y=0.5) -> None:
    with Image.open(path) as im:
        iw, ih = im.size
    scale = max(w / iw, h / ih)
    sw, sh = iw * scale, ih * scale
    dx = x - max(0, sw - w) * focal_x
    dy = y - max(0, sh - h) * focal_y
    c.saveState()
    clip = c.beginPath()
    clip.rect(x, y, w, h)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(ImageReader(str(path)), dx, dy, width=sw, height=sh, mask="auto")
    c.restoreState()


def draw_logo(c: canvas.Canvas, x: float, y_top: float, width: float) -> float:
    with Image.open(LOGO) as im:
        iw, ih = im.size
    height = width * ih / iw
    c.drawImage(ImageReader(str(LOGO)), x, y_top - height, width=width, height=height, mask="auto")
    return height


def draw_running_page(c: canvas.Canvas, page_no: int, label: str, accent=SIGNAL_TEXT, footer: bool = True) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    draw_logo(c, MARGIN, PAGE_H - 8.5 * mm, 31 * mm)
    c.setFont("MonoBold", 7.4)
    c.setFillColor(accent)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 10.4 * mm, clean_text(label).upper())
    c.setStrokeColor(INK)
    c.setLineWidth(0.45)
    c.line(MARGIN, PAGE_H - 16 * mm, PAGE_W - MARGIN, PAGE_H - 16 * mm)
    if footer:
        c.line(MARGIN, 14 * mm, PAGE_W - MARGIN, 14 * mm)
        c.setFont("Mono", 7.2)
        c.setFillColor(INK)
        c.drawString(MARGIN, 8.6 * mm, "ROUTE PROPOSAL · DETAILS SUBJECT TO SECURING")
        c.drawRightString(PAGE_W - MARGIN, 8.6 * mm, f"{page_no:02d}")


def draw_label(c: canvas.Canvas, text: str, x: float, y: float, accent=SIGNAL_TEXT) -> None:
    c.setFont("MonoBold", 7.8)
    c.setFillColor(accent)
    c.drawString(x, y, clean_text(text).upper())


def split_label_body(text: str) -> tuple[str, str]:
    parts = [clean_text(v) for v in text.split("\t") if clean_text(v)]
    if len(parts) >= 2:
        return parts[0], " ".join(parts[1:])
    return "", clean_text(text)


def parse_days(tables: list[dict]) -> list[Day]:
    found: dict[int, Day] = {}
    for table in tables:
        for row in table["data"]:
            for cell in row:
                if not re.search(r"DAY\s+\d{2}", cell):
                    continue
                lines = [line.strip() for line in cell.splitlines() if line.strip()]
                route_idx = next((i for i, line in enumerate(lines) if "ROUTE" in line and "SLEEP" in line), -1)
                move_idx = next((i for i, line in enumerate(lines) if "MOVEMENT" in line and "RHYTHM" in line), -1)
                if route_idx < 0 or move_idx < 0 or route_idx + 1 >= len(lines) or move_idx + 1 >= len(lines):
                    raise ValueError(f"Unable to parse day cell: {cell[:120]}")
                title_blob = " ".join(clean_text(line) for line in lines[:route_idx])
                match = re.search(r"DAY\s+(\d{2})", title_blob)
                if not match:
                    raise ValueError(f"Day number missing: {title_blob}")
                number = int(match.group(1))
                title = clean_text(title_blob[: match.start()] + " " + title_blob[match.end() :])

                route_values = [clean_text(v) for v in lines[route_idx + 1].split("\t") if clean_text(v)]
                move_values = [clean_text(v) for v in lines[move_idx + 1].split("\t") if clean_text(v)]
                if number == 27:
                    route_values = ["Puno", "Puno"]
                if len(route_values) < 2 or len(move_values) < 2:
                    raise ValueError(f"Metadata parse failed for Day {number:02d}")
                body = tuple(clean_text(line) for line in lines[move_idx + 2 :])
                found[number] = Day(
                    number,
                    title,
                    route_values[0],
                    " ".join(route_values[1:]),
                    move_values[0],
                    " ".join(move_values[1:]),
                    body,
                )
    if sorted(found) != list(range(1, 72)):
        raise ValueError(f"Expected Days 01-71, found {sorted(found)}")
    return [found[n] for n in range(1, 72)]


def draw_cover(c: canvas.Canvas) -> None:
    c.bookmarkPage("cover")
    c.addOutlineEntry("Cover", "cover", level=0)
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    photo = ROOT / "public/assets/images/departures/andean/gallery/carretera-austral/home-road.webp"
    image_h = 166 * mm
    draw_image_cover(c, photo, 0, PAGE_H - image_h, PAGE_W, image_h, 0.5, 0.44)

    plate_h = 135 * mm
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, plate_h, fill=1, stroke=0)
    draw_logo(c, 18 * mm, plate_h - 13 * mm, 52 * mm)
    draw_label(c, "The 71-day passage", 18 * mm, plate_h - 43 * mm)
    y = plate_h - 54 * mm
    y = draw_paragraph(c, "THE ANDEAN<br/>CARAVAN", 18 * mm, y, 126 * mm, style("cover-title", "EditorialBold", 34, 37))
    y -= 7 * mm
    y = draw_paragraph(c, "A client journey guide", 18 * mm, y, 105 * mm, style("cover-sub", "EditorialItalic", 16, 21))
    y -= 4 * mm
    draw_paragraph(c, "Lima to the end of the Carretera Austral", 18 * mm, y, 128 * mm, style("cover-route", "Operations", 9.4, 13))

    c.setFillColor(INK)
    c.setFont("Mono", 6.8)
    c.drawString(18 * mm, 18 * mm, "ROUTE PROPOSAL · CLIENT EDITION · AUGUST 2026")

    c.setFillColor(INK)
    c.rect(PAGE_W - 55 * mm, 18 * mm, 37 * mm, 14 * mm, fill=1, stroke=0)
    c.setFillColor(PAPER)
    c.setFont("MonoBold", 7.4)
    c.drawCentredString(PAGE_W - 36.5 * mm, 23.2 * mm, "DESIGN REVIEW DRAFT")
    c.showPage()


def draw_contents(c: canvas.Canvas, page_no: int) -> None:
    draw_running_page(c, page_no, "Guide map")
    c.bookmarkPage("contents")
    c.addOutlineEntry("Guide map", "contents", level=0)
    draw_label(c, "How to use this guide", MARGIN, PAGE_H - 29 * mm)
    draw_paragraph(c, "The road, in one view", MARGIN, PAGE_H - 37 * mm, CONTENT_W, S_H1)
    y = PAGE_H - 65 * mm
    entries = [
        ("Before the road", "What the proposal is, how the Caravan moves and how to read each day", 3, "guide-in-hand"),
        ("01  Sea to Stone", "Lima to Puno · Days 1-23", 9, "section-01"),
        ("02  Both Shores", "Puno to Sucre · Days 24-39", 24, "section-02"),
        ("03  The Mirror", "Sucre to Santiago · Days 40-57", 35, "section-03"),
        ("04  The End of the Road", "Santiago to Balmaceda · Days 58-71", 47, "section-04"),
        ("What happens next", "From route proposal to your departure", 57, "next"),
    ]
    for i, (title, desc, target_page, bookmark) in enumerate(entries):
        block_h = 28 * mm
        if i:
            c.setStrokeColor(INK)
            c.setLineWidth(0.35)
            c.line(MARGIN, y + 6 * mm, PAGE_W - MARGIN, y + 6 * mm)
        c.setFont("EditorialBold", 15)
        c.setFillColor(INK)
        c.drawString(MARGIN, y - 3 * mm, title)
        c.setFont("Operations", 9.2)
        c.drawString(MARGIN, y - 10.5 * mm, desc)
        c.setFont("MonoBold", 9)
        c.setFillColor(SIGNAL_TEXT)
        c.drawRightString(PAGE_W - MARGIN, y - 3 * mm, f"{target_page:02d}")
        c.linkRect("", bookmark, (MARGIN, y - 16 * mm, PAGE_W - MARGIN, y + 4 * mm), relative=0, thickness=0)
        y -= block_h
    c.showPage()


def draw_guide_in_hand(c: canvas.Canvas, page_no: int, p: list[dict], tables: list[dict]) -> None:
    draw_running_page(c, page_no, "The guide in your hand")
    c.bookmarkPage("guide-in-hand")
    c.addOutlineEntry("Before the road", "guide-in-hand", level=0)
    draw_label(c, p[2]["text"], MARGIN, PAGE_H - 29 * mm)
    y = draw_paragraph(c, para_html(p[3]["text"]), MARGIN, PAGE_H - 38 * mm, 135 * mm, S_H1)
    y -= 7 * mm
    y = draw_paragraph(c, para_html(p[4]["text"]), MARGIN, y, 116 * mm, S_LEAD)
    y -= 5 * mm
    y = draw_paragraph(c, para_html(p[5]["text"]), MARGIN, y, 126 * mm, S_BODY)

    stats_y = 97 * mm
    stats = tables[0]["data"]
    col_w = CONTENT_W / 4
    for i in range(4):
        x = MARGIN + i * col_w
        c.setFillColor(INK if i % 2 == 0 else BLUE)
        c.rect(x, stats_y, col_w, 31 * mm, fill=1, stroke=0)
        c.setFillColor(PAPER)
        c.setFont("EditorialBold", 22)
        c.drawString(x + 5 * mm, stats_y + 16 * mm, stats[0][i])
        c.setFont("MonoBold", 6.7)
        c.drawString(x + 5 * mm, stats_y + 7 * mm, stats[1][i])

    callout_y = 28 * mm
    callout_h = 56 * mm
    c.setStrokeColor(INK)
    c.setLineWidth(1.1)
    c.rect(MARGIN, callout_y, CONTENT_W, callout_h, fill=0, stroke=1)
    c.setFillColor(SIGNAL)
    c.rect(MARGIN, callout_y, 8 * mm, callout_h, fill=1, stroke=0)
    draw_label(c, p[6]["text"], MARGIN + 14 * mm, callout_y + callout_h - 9 * mm)
    y2 = draw_paragraph(c, f"<b>{para_html(p[7]['text'])}</b>", MARGIN + 14 * mm, callout_y + callout_h - 17 * mm, CONTENT_W - 23 * mm, style("important-title", "OperationsBold", 11, 14))
    draw_paragraph(c, para_html(p[8]["text"]), MARGIN + 14 * mm, y2 - 3 * mm, CONTENT_W - 23 * mm, S_BODY_SMALL)
    c.showPage()


def draw_whole_passage(c: canvas.Canvas, page_no: int, p: list[dict], tables: list[dict]) -> None:
    draw_running_page(c, page_no, "The whole passage")
    c.bookmarkPage("whole-passage")
    c.addOutlineEntry("The whole passage", "whole-passage", level=1)
    draw_label(c, p[9]["text"], MARGIN, PAGE_H - 29 * mm)
    y = draw_paragraph(c, para_html(p[10]["text"]), MARGIN, PAGE_H - 38 * mm, CONTENT_W, S_H1)
    y -= 5 * mm
    draw_paragraph(c, para_html(p[11]["text"]), MARGIN, y, 135 * mm, S_BODY)

    route_rows = list(tables[1]["data"]) + [[clean_text(v) for v in p[16]["text"].split("\t") if clean_text(v)]]
    route_rows = [row for row in route_rows if row and row[0] != "SHORT"]
    accents = [SIGNAL, OLIVE, PINK, SUN]
    track_y = 154 * mm
    track_h = 18 * mm
    durations = [23, 16, 18, 14]
    total = sum(durations)
    x = MARGIN
    for i, (row, accent, duration) in enumerate(zip(route_rows, accents, durations)):
        w = CONTENT_W * duration / total
        c.setFillColor(accent)
        c.rect(x, track_y, w, track_h, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("MonoBold", 7.4)
        c.drawString(x + 3 * mm, track_y + 11 * mm, row[0])
        c.setFont("OperationsBold", 7.8)
        c.drawString(x + 3 * mm, track_y + 5 * mm, row[3])
        x += w

    gate_y = track_y - 11 * mm
    gates = ["LIMA", "PUNO", "SUCRE", "SANTIAGO", "BALMACEDA"]
    cumulative = [0, 23, 39, 57, 71]
    for gate, amount in zip(gates, cumulative):
        gx = MARGIN + CONTENT_W * amount / total
        c.setStrokeColor(INK)
        c.setLineWidth(0.6)
        c.line(gx, track_y - 3 * mm, gx, track_y + track_h + 3 * mm)
        c.setFillColor(INK)
        c.setFont("MonoBold", 6.4)
        if amount == 0:
            c.drawString(gx, gate_y, gate)
        elif amount == total:
            c.drawRightString(gx, gate_y, gate)
        else:
            c.drawCentredString(gx, gate_y, gate)

    rows_y = 122 * mm
    for i, row in enumerate(route_rows):
        y0 = rows_y - i * 20 * mm
        if i:
            c.setStrokeColor(INK)
            c.setLineWidth(0.35)
            c.line(MARGIN, y0 + 7 * mm, PAGE_W - MARGIN, y0 + 7 * mm)
        c.setFillColor(accents[i])
        c.rect(MARGIN, y0 - 6 * mm, 11 * mm, 11 * mm, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("MonoBold", 7.2)
        c.drawCentredString(MARGIN + 5.5 * mm, y0 - 2.3 * mm, row[0])
        c.setFont("EditorialBold", 13.5)
        c.drawString(MARGIN + 17 * mm, y0, row[1])
        c.setFont("Operations", 8.8)
        c.drawString(MARGIN + 17 * mm, y0 - 7 * mm, f"{row[2]} · {row[3]}")

    c.setFillColor(INK)
    c.rect(MARGIN, 20 * mm, CONTENT_W, 18 * mm, fill=1, stroke=0)
    c.setFillColor(PAPER)
    c.setFont("MonoBold", 7.2)
    c.drawString(MARGIN + 6 * mm, 30.5 * mm, "SHORT FORM")
    c.setFont("Operations", 8.8)
    c.drawString(MARGIN + 31 * mm, 30.5 * mm, "THE STONE ROAD · CUSCO TO PUNO · DAYS 16-23 · 8 DAYS")
    c.setFont("OperationsItalic", 8.5)
    c.drawString(MARGIN + 31 * mm, 24.5 * mm, clean_text(p[15]["text"]))
    c.showPage()


def draw_caravan_works(c: canvas.Canvas, page_no: int, p: list[dict]) -> None:
    draw_running_page(c, page_no, "How the Caravan works")
    c.bookmarkPage("caravan-works")
    c.addOutlineEntry("How the Caravan works", "caravan-works", level=1)
    draw_label(c, p[17]["text"], MARGIN, PAGE_H - 29 * mm)
    draw_paragraph(c, para_html(p[18]["text"]), MARGIN, PAGE_H - 38 * mm, CONTENT_W, S_H1)
    cards = [
        ("01", p[19]["text"], p[20]["text"], SIGNAL),
        ("02", p[21]["text"], p[22]["text"], OLIVE),
        ("03", p[23]["text"], p[24]["text"], PINK),
    ]
    y = 188 * mm
    card_h = 47 * mm
    for number, heading, body, accent in cards:
        c.setStrokeColor(INK)
        c.setLineWidth(0.55)
        c.rect(MARGIN, y - card_h, CONTENT_W, card_h, fill=0, stroke=1)
        c.setFillColor(accent)
        c.rect(MARGIN, y - card_h, 17 * mm, card_h, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("EditorialBold", 16)
        c.drawCentredString(MARGIN + 8.5 * mm, y - 26 * mm, number)
        draw_paragraph(c, para_html(heading), MARGIN + 24 * mm, y - 8 * mm, 58 * mm, S_H3)
        draw_paragraph(c, para_html(body), MARGIN + 82 * mm, y - 8 * mm, CONTENT_W - 90 * mm, S_BODY_SMALL)
        y -= card_h + 6 * mm
    c.setFillColor(INK)
    c.rect(MARGIN, 23 * mm, CONTENT_W, 21 * mm, fill=1, stroke=0)
    draw_paragraph(c, para_html(p[25]["text"]), MARGIN + 7 * mm, 36.5 * mm, CONTENT_W - 14 * mm, style("fixed", "EditorialBold", 13.5, 17, PAPER, alignment=TA_CENTER))
    c.showPage()


def draw_movement(c: canvas.Canvas, page_no: int, p: list[dict], tables: list[dict]) -> None:
    draw_running_page(c, page_no, "Movement")
    c.bookmarkPage("movement")
    c.addOutlineEntry("Movement", "movement", level=1)
    draw_label(c, p[26]["text"], MARGIN, PAGE_H - 29 * mm)
    y = draw_paragraph(c, para_html(p[27]["text"]), MARGIN, PAGE_H - 38 * mm, CONTENT_W, S_H1)
    y -= 11 * mm
    y = draw_paragraph(c, para_html(p[28]["text"]), MARGIN, y, 136 * mm, S_BODY)
    y -= 7 * mm

    scheduled_label, scheduled_body = split_label_body(p[29]["text"])
    road_text = clean_text(p[30]["text"] + " " + p[31]["text"])
    road_text = re.sub(r"^Road\s+", "", road_text)
    movement_cards = [
        (scheduled_label or "Scheduled", scheduled_body, SIGNAL),
        (tables[2]["data"][0][0], tables[2]["data"][0][1], BLUE),
        (tables[2]["data"][1][0], tables[2]["data"][1][1], OLIVE),
        ("Road", road_text, SUN),
    ]
    col_gap = 7 * mm
    col_w = (CONTENT_W - col_gap) / 2
    card_h = 66 * mm
    start_y = 154 * mm
    for i, (heading, body, accent) in enumerate(movement_cards):
        row, col = divmod(i, 2)
        x = MARGIN + col * (col_w + col_gap)
        top = start_y - row * (card_h + 7 * mm)
        c.setStrokeColor(INK)
        c.setLineWidth(0.5)
        c.rect(x, top - card_h, col_w, card_h, fill=0, stroke=1)
        c.setFillColor(accent)
        c.rect(x, top - 8 * mm, col_w, 8 * mm, fill=1, stroke=0)
        draw_paragraph(c, para_html(heading), x + 6 * mm, top - 16 * mm, col_w - 12 * mm, S_H3)
        draw_paragraph(c, para_html(body), x + 6 * mm, top - 28 * mm, col_w - 12 * mm, S_BODY_SMALL)
    c.showPage()


def draw_reading_day(c: canvas.Canvas, page_no: int, p: list[dict], tables: list[dict]) -> None:
    draw_running_page(c, page_no, "Reading each day")
    c.bookmarkPage("reading-days")
    c.addOutlineEntry("Reading each day", "reading-days", level=1)
    draw_label(c, p[32]["text"], MARGIN, PAGE_H - 29 * mm)
    y = draw_paragraph(c, para_html(p[33]["text"]), MARGIN, PAGE_H - 38 * mm, CONTENT_W, S_H1)
    y -= 5 * mm
    draw_paragraph(c, para_html(p[34]["text"]), MARGIN, y, 137 * mm, S_BODY)

    rows = tables[3]["data"]
    col_gap = 9 * mm
    col_w = (CONTENT_W - col_gap) / 2
    top = 184 * mm
    headings = ["PHYSICAL EFFORT", "OPERATING ENVIRONMENT"]
    for col in range(2):
        x = MARGIN + col * (col_w + col_gap)
        c.setFont("MonoBold", 7.5)
        c.setFillColor(SIGNAL_TEXT)
        c.drawString(x, top, headings[col])
        y0 = top - 9 * mm
        for label, body in rows[col * 3 : col * 3 + 3]:
            c.setStrokeColor(INK)
            c.setLineWidth(0.4)
            c.line(x, y0 + 2 * mm, x + col_w, y0 + 2 * mm)
            c.setFillColor([SIGNAL, OLIVE, PINK][(y0 == top - 9 * mm) * 0] if False else INK)
            draw_paragraph(c, para_html(label), x, y0 - 2 * mm, col_w, style("definition", "OperationsBold", 9.2, 11.5))
            draw_paragraph(c, para_html(body), x, y0 - 12 * mm, col_w, S_BODY_SMALL)
            y0 -= 44 * mm

    c.setFillColor(INK)
    c.rect(MARGIN, 24 * mm, CONTENT_W, 28 * mm, fill=1, stroke=0)
    c.setFillColor(PINK)
    c.setFont("MonoBold", 7.3)
    c.drawString(MARGIN + 6 * mm, 42 * mm, p[35]["text"])
    draw_paragraph(c, para_html(p[36]["text"]), MARGIN + 38 * mm, 45 * mm, CONTENT_W - 45 * mm, style("free-time", "Operations", 8.9, 12.4, PAPER))
    c.showPage()


def draw_honest_shape(c: canvas.Canvas, page_no: int, p: list[dict]) -> None:
    draw_running_page(c, page_no, "Before you choose")
    c.bookmarkPage("before-road")
    c.addOutlineEntry("Before you choose", "before-road", level=1)
    draw_label(c, p[37]["text"], MARGIN, PAGE_H - 29 * mm)
    draw_paragraph(c, para_html(p[38]["text"]), MARGIN, PAGE_H - 38 * mm, CONTENT_W, S_H1)
    pairs = [(39, 40), (41, 42), (43, 44), (45, 46), (47, 48)]
    y = 205 * mm
    heading_w = 51 * mm
    for i, (heading_idx, body_idx) in enumerate(pairs):
        if i:
            c.setStrokeColor(INK)
            c.setLineWidth(0.35)
            c.line(MARGIN, y + 6 * mm, PAGE_W - MARGIN, y + 6 * mm)
        c.setFillColor([SIGNAL, OLIVE, PINK, BLUE, SUN][i])
        c.rect(MARGIN, y - 3 * mm, 9 * mm, 9 * mm, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("EditorialBold", 13.2)
        draw_paragraph(c, para_html(p[heading_idx]["text"]), MARGIN + 15 * mm, y + 1 * mm, heading_w, style("honest-heading", "EditorialBold", 12.6, 15))
        draw_paragraph(c, para_html(p[body_idx]["text"]), MARGIN + 69 * mm, y + 1 * mm, CONTENT_W - 69 * mm, S_BODY_SMALL)
        y -= 38 * mm
    c.showPage()


def draw_section_opener(c: canvas.Canvas, page_no: int, section: Section) -> None:
    c.bookmarkPage(f"section-{section.number}")
    c.addOutlineEntry(f"{section.number}  {section.name}", f"section-{section.number}", level=0)
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    image_h = 165 * mm
    draw_image_cover(c, section.photo, 0, PAGE_H - image_h, PAGE_W, image_h, 0.5, 0.53)
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, 137 * mm, fill=1, stroke=0)
    c.setFillColor(section.accent)
    c.rect(0, 0, 13 * mm, 137 * mm, fill=1, stroke=0)
    draw_logo(c, 22 * mm, 126 * mm, 39 * mm)
    draw_label(c, f"Section {section.number} · Days {section.day_start}-{section.day_end}", 22 * mm, 97 * mm, SIGNAL_TEXT)
    y = draw_paragraph(c, para_html(section.name), 22 * mm, 87 * mm, 150 * mm, style("section-title", "EditorialBold", 31, 35))
    y -= 5 * mm
    y = draw_paragraph(c, para_html(section.subtitle), 22 * mm, y, 137 * mm, style("section-sub", "EditorialItalic", 14.5, 20))
    y -= 9 * mm
    c.setFont("OperationsBold", 9.2)
    c.setFillColor(INK)
    c.drawString(22 * mm, y, section.gate)
    c.setFont("Operations", 9.2)
    c.drawString(82 * mm, y, section.duration)
    c.setFont("Mono", 7.2)
    c.drawRightString(PAGE_W - 18 * mm, 9 * mm, f"{page_no:02d}")
    c.showPage()


def draw_fact_grid(c: canvas.Canvas, table: dict, x: float, y_top: float, w: float, accent) -> float:
    rows = table["data"]
    gap = 5 * mm
    cell_w = (w - gap) / 2
    cell_h = 31 * mm
    for row_i, row in enumerate(rows):
        for col_i, value in enumerate(row):
            cx = x + col_i * (cell_w + gap)
            cy_top = y_top - row_i * (cell_h + gap)
            c.setStrokeColor(INK)
            c.setLineWidth(0.5)
            c.rect(cx, cy_top - cell_h, cell_w, cell_h, fill=0, stroke=1)
            label, body = split_label_body(value.replace("\n", "\t", 1))
            c.setFillColor(accent)
            c.rect(cx, cy_top - 6 * mm, cell_w, 6 * mm, fill=1, stroke=0)
            c.setFont("MonoBold", 6.7)
            c.setFillColor(INK)
            c.drawString(cx + 4 * mm, cy_top - 12 * mm, label)
            draw_paragraph(c, para_html(body), cx + 4 * mm, cy_top - 17 * mm, cell_w - 8 * mm, style("fact", "OperationsBold", 8.9, 11.5))
    return y_top - len(rows) * (cell_h + gap)


def draw_at_glance(c: canvas.Canvas, page_no: int, section: Section, p: list[dict], tables: list[dict]) -> None:
    draw_running_page(c, page_no, f"Section {section.number} · At a glance", SIGNAL_TEXT)
    c.bookmarkPage(f"section-{section.number}-glance")
    c.addOutlineEntry("At a glance", f"section-{section.number}-glance", level=1)
    draw_label(c, f"Section {section.number} · At a glance", MARGIN, PAGE_H - 29 * mm)
    y = draw_paragraph(c, para_html(section.name), MARGIN, PAGE_H - 38 * mm, CONTENT_W, S_H1)
    y -= 5 * mm
    y = draw_paragraph(c, para_html(p[section.intro_paragraph]["text"]), MARGIN, y, 143 * mm, S_LEAD)
    y -= 8 * mm
    y = draw_fact_grid(c, tables[section.facts_table], MARGIN, y, CONTENT_W, section.accent)
    y -= 1 * mm
    draw_label(c, "The stages", MARGIN, y)
    y -= 9 * mm
    for idx in section.stage_paragraphs:
        parts = [clean_text(v) for v in p[idx]["text"].split("\t") if clean_text(v)]
        title = parts[0]
        days = " · ".join(parts[1:])
        c.setFillColor(section.accent)
        c.rect(MARGIN, y - 10 * mm, CONTENT_W, 14 * mm, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("OperationsBold", 9.2)
        c.drawString(MARGIN + 5 * mm, y - 5.5 * mm, title)
        c.setFont("MonoBold", 7.2)
        c.drawRightString(PAGE_W - MARGIN - 5 * mm, y - 5.5 * mm, days)
        y -= 18 * mm
    if section.glance_note_heading is not None or section.glance_note_table is not None:
        c.setStrokeColor(INK)
        c.setLineWidth(1)
        c.rect(MARGIN, 24 * mm, CONTENT_W, 39 * mm, fill=0, stroke=1)
        if section.glance_note_table is not None:
            note_heading, note_text = tables[section.glance_note_table]["data"][0]
        else:
            note_heading = p[section.glance_note_heading]["text"]
            note_text = " ".join(clean_text(p[idx]["text"]) for idx in section.glance_note_paragraphs)
        draw_label(c, note_heading, MARGIN + 6 * mm, 53 * mm)
        draw_paragraph(c, para_html(note_text), MARGIN + 6 * mm, 46 * mm, CONTENT_W - 12 * mm, S_BODY_SMALL)
    c.showPage()


def draw_meta_cell(c: canvas.Canvas, label: str, value: str, x: float, y_top: float, w: float, h: float) -> None:
    c.setFont("MonoBold", 6.2)
    c.setFillColor(SIGNAL_TEXT)
    c.drawString(x, y_top - 3.5 * mm, label)
    draw_paragraph(c, para_html(value), x, y_top - 7 * mm, w, style("meta", "OperationsBold", 7.8, 9.7))


def body_with_emphasis(day: Day) -> str:
    chunks = []
    for line in day.body:
        text = para_html(line)
        text = re.sub(r"^Free time\.", "<b>Free time.</b>", text)
        text = re.sub(r"^For travellers", "<b>For travellers</b>", text)
        chunks.append(text)
    for heading, body in CALLOUTS.get(day.number, ()):
        chunks.append(f'<font color="#B03A0C"><b>{para_html(heading).upper()}</b></font><br/><i>{para_html(body)}</i>')
    return "<br/><br/>".join(chunks)


def draw_day_card(c: canvas.Canvas, day: Day, section: Section, x: float, y: float, w: float, h: float, diagnostics: list[dict]) -> None:
    c.setStrokeColor(INK)
    c.setLineWidth(0.55)
    c.rect(x, y, w, h, fill=0, stroke=1)
    pad = 5 * mm
    num_size = 14 * mm
    c.setFillColor(section.accent)
    c.rect(x, y + h - num_size, num_size, num_size, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("EditorialBold", 15.5)
    c.drawCentredString(x + num_size / 2, y + h - 9.6 * mm, f"{day.number:02d}")

    title_x = x + num_size + 5 * mm
    title_top = y + h - 4 * mm
    title_style = style("day-title", "EditorialBold", 14.2, 16.5)
    title_p = Paragraph(para_html(day.title), title_style)
    _, title_h = title_p.wrap(w - num_size - 10 * mm, 30 * mm)
    title_p.drawOn(c, title_x, title_top - title_h)

    meta_top = min(y + h - 20 * mm, title_top - title_h - 3 * mm)
    meta_h = 27 * mm
    c.setStrokeColor(INK)
    c.setLineWidth(0.35)
    c.line(x + pad, meta_top, x + w - pad, meta_top)
    split_x = x + pad + (w - 2 * pad) * 0.68
    c.line(split_x - 3 * mm, meta_top, split_x - 3 * mm, meta_top - meta_h)
    c.line(x + pad, meta_top - meta_h / 2, x + w - pad, meta_top - meta_h / 2)
    draw_meta_cell(c, "ROUTE", day.route, x + pad, meta_top, split_x - x - 11 * mm, meta_h / 2)
    draw_meta_cell(c, "SLEEP", day.sleep, split_x, meta_top, x + w - pad - split_x, meta_h / 2)
    draw_meta_cell(c, "MOVEMENT", day.movement, x + pad, meta_top - meta_h / 2, split_x - x - 11 * mm, meta_h / 2)
    draw_meta_cell(c, "RHYTHM", day.rhythm, split_x, meta_top - meta_h / 2, x + w - pad - split_x, meta_h / 2)

    body_top = meta_top - meta_h - 4 * mm
    body_bottom = y + pad
    available = body_top - body_bottom
    html = body_with_emphasis(day)
    chosen = None
    for size in (10.1, 9.8, 9.5, 9.2, 8.9):
        pstyle = style(f"day-body-{size}", "Operations", size, size * 1.34)
        body_p = Paragraph(html, pstyle)
        _, body_h = body_p.wrap(w - 2 * pad, available)
        if body_h <= available + 0.1:
            chosen = (body_p, body_h, size)
            break
    if chosen is None:
        body_p = Paragraph(html, style("day-body-min", "Operations", 8.6, 11.1))
        _, body_h = body_p.wrap(w - 2 * pad, available)
        chosen = (body_p, body_h, 8.6)
    body_p, body_h, font_size = chosen
    body_p.drawOn(c, x + pad, body_top - body_h)
    diagnostics.append({"day": day.number, "body_font": font_size, "available": round(available, 2), "used": round(body_h, 2), "title_lines": round(title_h / 16.5, 1)})


def draw_day_pair(c: canvas.Canvas, page_no: int, section: Section, days: list[Day], diagnostics: list[dict]) -> None:
    day_label = f"Day {days[0].number}" if len(days) == 1 else f"Days {days[0].number}-{days[-1].number}"
    draw_running_page(c, page_no, f"Section {section.number} · {day_label}", SIGNAL_TEXT)
    bookmark = f"day-{days[0].number:02d}"
    c.bookmarkPage(bookmark)
    c.addOutlineEntry(f"Days {days[0].number}-{days[-1].number}", bookmark, level=1)
    bottom = 20 * mm
    top = PAGE_H - 22 * mm
    gap = 6 * mm
    if len(days) == 2:
        card_h = (top - bottom - gap) / 2
        draw_day_card(c, days[0], section, MARGIN, bottom + card_h + gap, CONTENT_W, card_h, diagnostics)
        draw_day_card(c, days[1], section, MARGIN, bottom, CONTENT_W, card_h, diagnostics)
    else:
        card_h = top - bottom
        draw_day_card(c, days[0], section, MARGIN, top - card_h, CONTENT_W, card_h, diagnostics)
    c.showPage()


def normalize_bullet(text: str) -> str:
    return clean_text(re.sub(r"^[·•]\s*", "", text))


def draw_before_choose(c: canvas.Canvas, page_no: int, section: Section, p: list[dict]) -> None:
    draw_running_page(c, page_no, f"Section {section.number} · Before you choose", SIGNAL_TEXT)
    bookmark = f"section-{section.number}-before"
    c.bookmarkPage(bookmark)
    c.addOutlineEntry("Before you choose", bookmark, level=1)
    draw_label(c, f"Section {section.number} · Before you choose", MARGIN, PAGE_H - 29 * mm)
    draw_paragraph(c, para_html(p[section.before_heading]["text"]), MARGIN, PAGE_H - 38 * mm, CONTENT_W, S_H1)

    bullet_texts: list[str] = []
    for idx in section.before_bullets:
        text = p[idx]["text"]
        if section.number == "01" and idx == 94:
            text += " " + p[95]["text"]
        bullet_texts.append(normalize_bullet(text))

    y = 208 * mm
    for i, text in enumerate(bullet_texts):
        c.setFillColor(section.accent)
        c.rect(MARGIN, y - 4.2 * mm, 5 * mm, 5 * mm, fill=1, stroke=0)
        bullet_html = para_html(text).replace("FOR SHORT-FORM TRAVELLERS", "<br/><br/><b>FOR SHORT-FORM TRAVELLERS</b><br/>")
        y = draw_paragraph(c, bullet_html, MARGIN + 10 * mm, y, CONTENT_W - 10 * mm, S_BODY_SMALL)
        y -= 5.2 * mm

    sleep_text = " ".join(clean_text(p[idx]["text"]) for idx in section.sleep_paragraphs)
    sleep_h = 41 * mm
    c.setFillColor(INK)
    c.rect(MARGIN, 25 * mm, CONTENT_W, sleep_h, fill=1, stroke=0)
    c.setFillColor(section.accent)
    c.setFont("MonoBold", 7.2)
    c.drawString(MARGIN + 6 * mm, 55 * mm, "SLEEP PATTERN")
    draw_paragraph(c, para_html(sleep_text), MARGIN + 6 * mm, 48 * mm, CONTENT_W - 12 * mm, style("sleep", "Operations", 8.8, 12.2, PAPER))

    if section.before_note_heading is not None:
        note_text = " ".join(clean_text(p[idx]["text"]) for idx in section.before_note_paragraphs)
        c.setFillColor(section.accent)
        c.rect(MARGIN, 71 * mm, CONTENT_W, 29 * mm, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("EditorialBold", 11.5)
        c.drawString(MARGIN + 6 * mm, 90 * mm, clean_text(p[section.before_note_heading]["text"]))
        draw_paragraph(c, para_html(note_text), MARGIN + 6 * mm, 84 * mm, CONTENT_W - 12 * mm, style("threshold", "Operations", 8.7, 11.5))
    c.showPage()


def draw_next(c: canvas.Canvas, page_no: int, p: list[dict], tables: list[dict]) -> None:
    draw_running_page(c, page_no, "What happens next", footer=False)
    c.bookmarkPage("next")
    c.addOutlineEntry("What happens next", "next", level=0)
    draw_label(c, p[221]["text"], MARGIN, PAGE_H - 29 * mm)
    y = draw_paragraph(c, para_html(p[222]["text"]), MARGIN, PAGE_H - 38 * mm, CONTENT_W, S_H1)
    y -= 5 * mm
    y = draw_paragraph(c, para_html(p[223]["text"]), MARGIN, y, 144 * mm, S_LEAD)
    y -= 8 * mm

    steps = []
    for i, row in enumerate(tables[45]["data"]):
        first = [clean_text(v) for v in row[0].split("\t") if clean_text(v)]
        number = first[0]
        title = " ".join(first[1:])
        steps.append((number, title, clean_text(row[1])))
    third = [clean_text(v) for v in p[224]["text"].split("\t") if clean_text(v)]
    steps.append((third[0], " ".join(third[1:]) + " " + clean_text(p[225]["text"]), clean_text(third[-1]) if len(third) > 2 else ""))
    if len(third) >= 3:
        steps[-1] = (third[0], clean_text(third[1] + " " + p[225]["text"]), clean_text(" ".join(third[2:])))

    card_y = 145 * mm
    card_h = 28 * mm
    for i, (number, title, body) in enumerate(steps):
        accent = (SIGNAL, OLIVE, PINK)[i]
        c.setFillColor(accent)
        c.rect(MARGIN, card_y - card_h, 17 * mm, card_h, fill=1, stroke=0)
        c.setStrokeColor(INK)
        c.setLineWidth(0.55)
        c.rect(MARGIN + 17 * mm, card_y - card_h, CONTENT_W - 17 * mm, card_h, fill=0, stroke=1)
        c.setFillColor(INK)
        c.setFont("EditorialBold", 15.5)
        c.drawCentredString(MARGIN + 8.5 * mm, card_y - 21 * mm, number)
        draw_paragraph(c, para_html(title), MARGIN + 23 * mm, card_y - 7 * mm, 48 * mm, S_H3)
        draw_paragraph(c, para_html(body), MARGIN + 75 * mm, card_y - 7 * mm, CONTENT_W - 82 * mm, S_BODY_SMALL)
        card_y -= card_h + 5 * mm

    c.setFillColor(INK)
    c.rect(0, 0, PAGE_W, 46 * mm, fill=1, stroke=0)
    draw_paragraph(c, para_html(p[226]["text"]), MARGIN, 37 * mm, 75 * mm, style("road-fixed", "EditorialBold", 19, 23, PINK))
    draw_paragraph(c, para_html(p[227]["text"]), MARGIN + 78 * mm, 38 * mm, CONTENT_W - 78 * mm, style("road-alive", "EditorialItalic", 11.2, 16, PAPER))
    c.setFillColor(PAPER)
    c.setFont("Mono", 6.8)
    c.drawString(MARGIN, 8.6 * mm, clean_text(p[229]["text"]))
    c.drawRightString(PAGE_W - MARGIN, 15 * mm, f"{page_no:02d} · SAWAYATRA.COM")
    c.showPage()


def build() -> None:
    data = json.loads(SOURCE_JSON.read_text())
    paragraphs = data["paragraphs"]
    tables = data["tables"]
    days = parse_days(tables)
    OUT.parent.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
    c.setTitle("The Andean Caravan - Client Journey Guide - Design Review Draft")
    c.setAuthor("Sawayatra")
    c.setSubject("A clear, client-facing day-by-day guide to the proposed 71-day Andean Caravan")
    c.setCreator("Sawayatra design proof")
    diagnostics: list[dict] = []

    draw_cover(c)
    draw_contents(c, 2)
    draw_guide_in_hand(c, 3, paragraphs, tables)
    draw_whole_passage(c, 4, paragraphs, tables)
    draw_caravan_works(c, 5, paragraphs)
    draw_movement(c, 6, paragraphs, tables)
    draw_reading_day(c, 7, paragraphs, tables)
    draw_honest_shape(c, 8, paragraphs)

    page_no = 9
    for section in SECTIONS:
        draw_section_opener(c, page_no, section)
        page_no += 1
        draw_at_glance(c, page_no, section, paragraphs, tables)
        page_no += 1
        section_days = [day for day in days if section.day_start <= day.number <= section.day_end]
        for i in range(0, len(section_days), 2):
            draw_day_pair(c, page_no, section, section_days[i : i + 2], diagnostics)
            page_no += 1
        draw_before_choose(c, page_no, section, paragraphs)
        page_no += 1

    draw_next(c, page_no, paragraphs, tables)
    c.save()

    low_sizes = [d for d in diagnostics if d["body_font"] < 9.2]
    log = {
        "output": str(OUT),
        "page_count": page_no,
        "days": len(diagnostics),
        "minimum_day_body_font": min(d["body_font"] for d in diagnostics),
        "days_below_9_2pt": low_sizes,
        "day_diagnostics": diagnostics,
    }
    LOG.write_text(json.dumps(log, indent=2))
    print(json.dumps({k: v for k, v in log.items() if k != "day_diagnostics"}, indent=2))


if __name__ == "__main__":
    build()
