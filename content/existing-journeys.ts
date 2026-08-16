import type { ContentStatus } from "@/components/ui/ContentStatusLabel";

/**
 * Journeys that already exist and can be joined, as opposed to a Caravan
 * (one long route travelled in sections) or a journey created from scratch.
 *
 * All nine currently run in Egypt's Western Desert. Every field below is read
 * from the client PDF itself - the title, the standfirst, the gate, the length
 * and the group rule are printed on page one of each document. Nothing here is
 * inferred, and no benefit, price or availability claim is made.
 */
export interface ExistingJourney {
  readonly id: string;
  /** Number as printed on the document: "01" through "09". */
  readonly number: string;
  readonly title: string;
  /** The standfirst from the cover, verbatim. */
  readonly standfirst: string;
  /** Where it starts and ends, verbatim from the cover. */
  readonly gate: string;
  readonly days: number;
  /** Group rule as printed. Not a promise of availability. */
  readonly group: string;
  readonly href: string;
  readonly pages: number;
  readonly sizeLabel: string;
  readonly contentStatus: ContentStatus;
}

export const existingJourneyRegion = {
  label: "The Egyptian · Western Desert",
  /** Stated because every journey below shares it; not a marketing line. */
  note: "Nine journeys in Egypt's Western Desert, from three days to twenty.",
} as const;

const GUIDE_PATH = "/assets/guides";

export const existingJourneys: readonly ExistingJourney[] = [
  {
    id: "the-three-kings",
    number: "01",
    title: "The Three Kings",
    standfirst:
      "A family desert experience — dunes, the White Desert and a visit after dark",
    gate: "Cairo return",
    days: 3,
    group: "4 to 20 travellers",
    href: `${GUIDE_PATH}/egyptian-01-the-three-kings.pdf`,
    pages: 9,
    sizeLabel: "0.7 MB",
    contentStatus: "DRAFT",
  },
  {
    id: "fun-desert-journey",
    number: "02",
    title: "Fun Desert Journey",
    standfirst:
      "Adventures and more — sandboarding, the English Track and a party in the dunes",
    gate: "Cairo return",
    days: 4,
    group: "4 to 20 travellers",
    href: `${GUIDE_PATH}/egyptian-02-fun-desert-journey.pdf`,
    pages: 9,
    sizeLabel: "1.0 MB",
    contentStatus: "DRAFT",
  },
  {
    id: "magical-western-desert",
    number: "03",
    title: "Magical Western Desert",
    standfirst:
      "Bahariya as your base — the Djara Cave, the White Desert and the oasis in full",
    gate: "Cairo return",
    days: 4,
    group: "Any group size",
    href: `${GUIDE_PATH}/egyptian-03-magical-western-desert.pdf`,
    pages: 9,
    sizeLabel: "1.1 MB",
    contentStatus: "DRAFT",
  },
  {
    id: "western-desert-mystical",
    number: "04",
    title: "Western Desert Mystical",
    standfirst:
      "Rohlfs' cave, the Roman wells and three nights on the sand",
    gate: "Cairo return",
    days: 5,
    group: "Any group size",
    href: `${GUIDE_PATH}/egyptian-04-western-desert-mystical.pdf`,
    pages: 10,
    sizeLabel: "0.9 MB",
    contentStatus: "DRAFT",
  },
  {
    id: "the-white-desert-trek",
    number: "05",
    title: "The White Desert Trek",
    standfirst:
      "Seven days on foot — the two valleys, the Roman wells and both White Deserts",
    gate: "Cairo return",
    days: 7,
    group: "Groups of 8 to 20",
    href: `${GUIDE_PATH}/egyptian-05-the-white-desert-trek.pdf`,
    pages: 11,
    sizeLabel: "0.8 MB",
    contentStatus: "DRAFT",
  },
  {
    id: "the-white-desert-exploration-trek",
    number: "06",
    title: "The White Desert Exploration Trek",
    standfirst:
      "Twelve days on foot along the old Baharia–Farafra camel route",
    gate: "Cairo return",
    days: 12,
    group: "Groups of 8 to 20",
    href: `${GUIDE_PATH}/egyptian-06-the-white-desert-exploration-trek.pdf`,
    pages: 13,
    sizeLabel: "0.9 MB",
    contentStatus: "DRAFT",
  },
  {
    id: "the-western-desert-oasis-tour",
    number: "07",
    title: "The Western Desert Oasis Tour",
    standfirst:
      "Baharia to Dakhla to Kharga — dunes, escarpments and three oases",
    gate: "Cairo to Cairo or Luxor",
    days: 12,
    group: "4 to 20 travellers",
    href: `${GUIDE_PATH}/egyptian-07-the-western-desert-oasis-tour.pdf`,
    pages: 13,
    sizeLabel: "0.9 MB",
    contentStatus: "DRAFT",
  },
  {
    id: "the-grand-expedition",
    number: "08",
    title: "The Grand Expedition",
    standfirst:
      "Abu Moharek, the longest chain of dunes in the world, from Baharia to Kharga",
    gate: "Cairo to Cairo or Luxor",
    days: 15,
    group: "4 to 20 travellers",
    href: `${GUIDE_PATH}/egyptian-08-the-grand-expedition.pdf`,
    pages: 15,
    sizeLabel: "0.9 MB",
    contentStatus: "DRAFT",
  },
  {
    id: "the-extensive-western-desert-tour",
    number: "09",
    title: "The Extensive Western Desert Tour",
    standfirst:
      "The ultimate crossing — 1,010 km off-road, Abu Moharek, the Whale Valley and Lake Qarun",
    gate: "Cairo return",
    days: 20,
    group: "4 to 20 travellers",
    href: `${GUIDE_PATH}/egyptian-09-the-extensive-western-desert-tour.pdf`,
    pages: 17,
    sizeLabel: "1.1 MB",
    contentStatus: "DRAFT",
  },
] as const;

export const existingJourneyDayRange = {
  shortest: 3,
  longest: 20,
} as const;
