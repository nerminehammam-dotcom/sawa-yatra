import "server-only";

import { cookies } from "next/headers";

import type { Passport, ViewerContext } from "./model";
import {
  ANDEAN_CARAVAN_JOURNEY,
  getJourneyBySlug,
  journeys,
} from "./journey-registry";
import {
  activeDeclarationsForJourney,
  declareInterest,
  emptyPoolState,
  passportsForJourney,
  putPassport,
} from "./pools";
import { verifyInterestToken, verifySessionToken } from "./session";
import { computeJourneyViewModel } from "./view-model";

const JOURNEY_ID = ANDEAN_CARAVAN_JOURNEY.id;
const FIXTURE_NOW = new Date("2026-08-01T00:00:00.000Z");

export { getJourneyBySlug, journeys };

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
