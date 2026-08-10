import "server-only";

/**
 * The public Journeys index carries one unlabelled Andean Caravan entry.
 * Section choice happens inside the Caravan rather than as nine independent
 * products in the index.
 */
import { getCanonicalCaravanOverview } from "@/content/caravan/page-data";
import type { FixedJourney, FormingJourney, Journey } from "@/lib/journeys/model";

const caravan = getCanonicalCaravanOverview();

export const fixedJourneys: readonly FixedJourney[] = [
  {
    id: "andean-caravan",
    slug: "andean-caravan",
    title: caravan.name,
    route: "Lima → Balmaceda",
    durationDays: caravan.durationDays,
    href: "/caravans/andean",
    pricingModel: "fixed-seat",
    dateState: "fixed",
    provenance: "sawayatra",
    // Required by the legacy taxonomy type; deliberately not rendered until
    // the schedule is approved for public use.
    dateLine: "Schedule not yet published",
  },
];

/**
 * Member-created journeys remain out of the public index until membership is
 * open. The empty array is retained for taxonomy compatibility only.
 */
export const formingJourneys: readonly FormingJourney[] = [];

export const journeysCatalog: readonly Journey[] = [
  ...fixedJourneys,
  ...formingJourneys,
];
