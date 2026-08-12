import {
  andeanCaravanGateById,
  andeanCaravanSections,
  type AndeanCaravanSectionSlug,
} from "@/content/andean-caravan";
import {
  andeanCaravanHeroImage,
  getAndeanCaravanGallery,
  getAndeanCaravanImage,
} from "@/content/andean-caravan-images";

export interface JoiningPointRecord {
  readonly id: string;
  readonly sectionSlug: AndeanCaravanSectionSlug;
  readonly number: string;
  readonly place: string;
  readonly country: string;
  readonly date: string;
  readonly access: string;
  readonly accessNote: string;
  readonly duration: string;
  readonly leaveAt: string;
  readonly route: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly focalPoint: { readonly x: number; readonly y: number };
  };
}

function countryFor(section: (typeof andeanCaravanSections)[number]): string {
  return section.countries.join(" / ");
}

export const joiningPoints = andeanCaravanSections.flatMap((section) => {
  const leaveGate = andeanCaravanGateById[section.leaveGateId];
  const image = getAndeanCaravanImage(section.slug);

  return section.joinGateIds.map((gateId, gateIndex) => {
    const gate = andeanCaravanGateById[gateId];
    const baseNumber = String(section.sectionNumber).padStart(2, "0");

    return {
      id: `${section.slug}-${gate.id}`,
      sectionSlug: section.slug,
      number: gateIndex === 0 ? baseNumber : `${baseNumber}B`,
      place: gate.name,
      country: countryFor(section),
      date: section.publicDateWindow,
      access: gate.airport,
      accessNote: gate.note,
      duration: `${section.durationDays} days`,
      leaveAt: leaveGate.name,
      route: section.route,
      image: {
        src: image.src,
        alt: image.alt,
        focalPoint: image.focalPoint ?? { x: 50, y: 50 },
      },
    };
  });
}) satisfies readonly JoiningPointRecord[];

export const fieldDocumentContent = {
  proposition:
    "One caravan. One long route. Join where you choose. Leave when your journey is complete.",
  hero: {
    eyebrow: "The Andean Caravan · annual expedition",
    actionLabel: "Enter the route",
    actionHref: "/caravans/andean",
    secondaryLabel: "See joining points",
    secondaryHref: "/caravans/andean-caravan/how-it-works",
    image: andeanCaravanHeroImage,
  },
  interruption: "The caravan is already moving.",
  /**
   * Founder-supplied 5 August 2026, verbatim.
   *
   * body[0] is set as the statement; body[1] and body[2] run as two columns
   * beneath it. `highlights` are phrases washed in the statement — each occurs
   * exactly once in body[0], and they are the two meanings the name is made
   * from. No word of the copy is altered by any of this.
   */
  nameStory: {
    /* Reordered 7 August 2026 — not rewritten. Every sentence is Nermine's,
       unchanged; only their order moved. The block used to open with the
       Sawa/Yatra etymology and reach the proposition ("a new way to travel…")
       only in the third paragraph, so a first-time visitor read the name's
       linguistics before learning what Sawayatra is. The proposition now leads
       and is the highlighted statement; the etymology follows as supporting
       depth. The site-wide announcement banner already carries the status
       ("open for interest · first departure February 2028"), so none is added
       here. The hero is left exactly as it was — the photograph and the line. */
    highlights: ["not just your destination", "your Travel Self"],
    actions: [
      { label: "Meet your Travel Self", href: "/travel-self" },
      { label: "Explore the Andean Caravan", href: "/journeys/andean-caravan" },
    ],
    body: [
      "Sawayatra is a new way to travel. A way to find people who share not just your destination, but your pace, your curiosity, your passions and your sense of discovery. We call it your Travel Self.",
      "Sawayatra is a name woven from two ancient words. Sawa, used across the Arabic-speaking world to mean together, is rooted in an ancient Arabic word that speaks of harmony, alignment and making things level. Yatra, the Sanskrit word for journey, began as a spiritual pilgrimage, a journey of purpose and transformation, and today has come to mean any journey or voyage of discovery.",
      "Together, they express the idea that inspired this community: that the most meaningful journeys are not simply shared, but shared with people who move through the world in much the same way we do.",
    ],
    contentStatus: "LOCKED",
  },
  how: {
    eyebrow: "How the caravan works",
    title: "The road stays continuous. Your part is yours to choose.",
    steps: [
      {
        number: "01",
        label: "Choose an entry",
        body: "Enter at one of the designated joining points shown along the route.",
      },
      {
        number: "02",
        label: "Travel a section, or several",
        body: "Each section connects directly to the next. The caravan continues south.",
      },
      {
        number: "03",
        label: "Leave at an approved point",
        body: "Your journey can finish while the wider expedition keeps moving.",
      },
    ],
  },
  route: {
    eyebrow: "The connected route",
    title: "Peru to the end of the road.",
    transfer:
      "After the Atacama, the route connects by air through Santiago to Balmaceda, continues through Coyhaique and the Carretera Austral to Villa O’Higgins, then follows the approved scenic return to Coyhaique and Balmaceda.",
  },
  travelSelf: {
    eyebrow: "How the matching works",
    title: "Which one are you?",
    body:
      "Sawayatra matches travellers by how they travel, not by where they are going. Sixteen travelling selves; eight short questions reveal which one is yours.",
    note: "Four minutes. Your answers are saved in this browser when you finish, and they are not sent to Sawayatra.",
    actionLabel: "Meet your Travel Self",
    actionHref: "/travel-self",
  },
  regionalChapters: [
    {
      id: "peru",
      number: "I",
      place: "Peru",
      note: "The first threshold: Pacific coast, Arequipa, Cusco and both shores of Titicaca.",
      image: getAndeanCaravanGallery("desert-coast")[0]!,
      tone: "sun",
    },
    {
      id: "bolivia",
      number: "II",
      place: "Bolivia",
      note: "Altitude, passage and the changing terrain between La Paz, Sucre and Uyuni.",
      image: getAndeanCaravanGallery("silver-and-bone")[0]!,
      tone: "pink",
    },
    {
      id: "atacama",
      number: "III",
      place: "Atacama",
      note: "High lagoons, salt, dry air and four days based in San Pedro.",
      image: getAndeanCaravanGallery("the-mirror")[0]!,
      tone: "clay",
    },
    {
      id: "patagonia",
      number: "IV",
      place: "Patagonia",
      note: "Roads, ferries, weather and the practical drama of the Carretera Austral.",
      image: getAndeanCaravanGallery("the-end-of-the-road")[0]!,
      tone: "olive",
    },
  ],
} as const;

/**
 * Homepage sections that are designed but have no founder-approved copy yet.
 * They render in development so the gap stays visible, and are filtered out of
 * the production page by `approvedHomeSections`. Do not invent copy for these —
 * supply it here with contentStatus "LOCKED" and it will appear automatically.
 */
export const reservedHomeSections = [
  {
    id: "cost",
    eyebrow: "What it costs",
    title: "To be confirmed",
    body: "No indicative cost, deposit or payment schedule exists in approved content yet.",
    needs: "An indicative price range for a single section and for the full 71-day route, plus deposit terms.",
    contentStatus: "PLACEHOLDER",
  },
  {
    id: "who-else",
    eyebrow: "Who else is travelling",
    title: "To be confirmed",
    body: "Group information will be added only when it can be shown clearly, privately and with enough registrations to be useful.",
    needs: "Either anonymised group composition, or founder-approved wording for what can be shown before departure.",
    contentStatus: "PLACEHOLDER",
  },
] as const;

export const approvedHomeSections = reservedHomeSections.filter(
  (section) => section.contentStatus !== "PLACEHOLDER",
);
