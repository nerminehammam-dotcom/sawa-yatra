import { journeysCarreteraCardImage } from "@/content/andean-caravan-images";

import { createJourney } from "./model";

export interface JourneyIdentity {
  readonly id: string;
  readonly slug: string;
}

export const ANDEAN_CARAVAN_JOURNEY = createJourney({
  id: "journey-andean-caravan",
  slug: "andean-caravan",
  title: "The Andean Caravan",
  type: "caravan",
  status: "open",
  groupFormedAt: null,
  originatorType: "club",
  originatorId: null,
  operatorId: null,
  groupPortrait: Object.freeze({
    intended:
      "For travellers who can give a long road its time: curious about the ground beneath it, comfortable with changing weather, and willing to let a group find its rhythm.",
    actual:
      "Five are reading the geology closely. Three have travelled a long overland road before. Four are joining the Caravan on their own.",
  }),
  route: "Lima → Balmaceda",
  duration: "71 days, with defined joining and leaving points",
  cost: "Costs are published by section on the full journey document.",
  asksOfYou: Object.freeze([
    "Comfort with altitude, distance and changing conditions.",
    "Patience with borders, ferries and the practical life of a long road.",
    "Enough independence to join the group without asking it to fill every hour.",
  ]),
  story: Object.freeze([
    "One continuous overland route from Lima to Patagonia, travelled together and joined in defined sections.",
    "The road, its distances and its practical demands remain visible. This is a caravan rather than a sequence of polished destination breaks.",
  ]),
  heroImage: journeysCarreteraCardImage.src,
  heroAlt: journeysCarreteraCardImage.alt,
});

const journeyRegistrations = Object.freeze([
  Object.freeze({
    journey: ANDEAN_CARAVAN_JOURNEY,
    publicHref: "/journeys/caravans/andean-caravan" as const,
  }),
]);

export const journeys = Object.freeze(
  journeyRegistrations.map((registration) => registration.journey),
);

export const JOURNEY_IDENTITIES: readonly JourneyIdentity[] = Object.freeze(
  journeys.map(({ id, slug }) => Object.freeze({ id, slug })),
);

export function getJourneyBySlug(slug: string) {
  return journeys.find((journey) => journey.slug === slug) ?? null;
}

export function journeyIdForSlug(slug: string): string | null {
  return getJourneyBySlug(slug)?.id ?? null;
}

export function journeyPublicHrefForSlug(
  slug: string,
): `/journeys/${string}` | null {
  return (
    journeyRegistrations.find(
      (registration) => registration.journey.slug === slug,
    )?.publicHref ?? null
  );
}
