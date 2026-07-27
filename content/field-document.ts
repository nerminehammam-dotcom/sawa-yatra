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
    actionHref: "/departures/the-andean-caravan",
    secondaryLabel: "See joining points",
    secondaryHref: "/joining-points",
    image: andeanCaravanHeroImage,
  },
  interruption: "The caravan is already moving.",
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
        label: "Travel a section—or several",
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
