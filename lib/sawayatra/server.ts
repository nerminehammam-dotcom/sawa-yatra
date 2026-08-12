import "server-only";

import { cookies } from "next/headers";

import { createJourney, type Passport, type ViewerContext } from "./model";
import {
  activeDeclarationsForJourney,
  declareInterest,
  emptyPoolState,
  passportsForJourney,
  putPassport,
} from "./pools";
import { verifyInterestToken, verifySessionToken } from "./session";
import { computeJourneyViewModel } from "./view-model";

const JOURNEY_ID = "journey-andean-caravan";
const FIXTURE_NOW = new Date("2026-08-01T00:00:00.000Z");

export const journeys = Object.freeze([
  createJourney({
    id: JOURNEY_ID,
    slug: "andean-caravan",
    title: "The Andean Caravan",
    type: "caravan",
    status: "open",
    groupFormedAt: null,
    originatorType: "club",
    originatorId: null,
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
    heroImage:
      "/assets/images/departures/andean/gallery/the-end-of-the-road/07-patagoina-01.jpg",
    heroAlt:
      "Quiet road crossing open Patagonian grassland beneath a pale blue sky.",
  }),
]);

const passports: readonly Passport[] = Object.freeze([
  {
    memberId: "member-1",
    resultId: "result-1",
    archetype: "The Naturalist",
    axes: Object.freeze({ pace: 2, planning: 5, company: 2, hours: 1 }),
    demographics: Object.freeze({ nationality: "Canadian", gender: null, ageBand: "40–49" }),
    updatedAt: FIXTURE_NOW,
  },
  {
    memberId: "member-2",
    resultId: "result-2",
    archetype: "The Drifter",
    axes: Object.freeze({ pace: 2, planning: 1, company: 2, hours: 6 }),
    demographics: Object.freeze({ nationality: null, gender: null, ageBand: null }),
    updatedAt: FIXTURE_NOW,
  },
  {
    memberId: "member-3",
    resultId: "result-3",
    archetype: "The Pathfinder",
    axes: Object.freeze({ pace: 6, planning: 5, company: 2, hours: 1 }),
    demographics: Object.freeze({ nationality: null, gender: "Woman", ageBand: null }),
    updatedAt: FIXTURE_NOW,
  },
]);

let poolFixture = emptyPoolState();
for (const passport of passports) poolFixture = putPassport(poolFixture, passport);
for (const memberId of ["member-1", "member-2", "member-3", "member-without-passport"]) {
  poolFixture = declareInterest(poolFixture, memberId, JOURNEY_ID, FIXTURE_NOW);
}

export async function getCurrentViewer(): Promise<ViewerContext> {
  const cookieStore = await cookies();
  const viewer = verifySessionToken(
    cookieStore.get("sawayatra_session")?.value,
    process.env.SAWAYATRA_SESSION_SECRET,
    new Date(),
  );
  if (!viewer.isSignedIn || !viewer.memberId) return viewer;
  const cookieDeclarations = cookieStore
    .getAll()
    .filter((cookie) => cookie.name.startsWith("sawayatra_interest_"))
    .flatMap((cookie) => {
      const journeyId = verifyInterestToken(
        cookie.value,
        viewer.memberId!,
        process.env.SAWAYATRA_SESSION_SECRET,
        new Date(),
      );
      return journeyId ? [journeyId] : [];
    });
  return Object.freeze({
    ...viewer,
    declaredJourneyIds: Object.freeze([
      ...new Set([...viewer.declaredJourneyIds, ...cookieDeclarations]),
    ]),
  });
}

export function getJourneyBySlug(slug: string) {
  return journeys.find((journey) => journey.slug === slug) ?? null;
}

export function getJourneyView(slug: string, viewer: ViewerContext) {
  const journey = getJourneyBySlug(slug);
  if (!journey) return null;
  const declarations = activeDeclarationsForJourney(
    poolFixture,
    journey.id,
    new Date(),
  );
  return computeJourneyViewModel({
    viewer,
    journey,
    poolSize: declarations.length,
    poolPassports: passportsForJourney(poolFixture, journey.id, new Date()),
  });
}
