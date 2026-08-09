/**
 * The journey catalog — one purchasable thing, two groups (§2.3):
 * "Leaving on a date" (Fixed) and "Still forming" (Forming).
 *
 * Release 1 reality: the nine Andean Caravan sections are the Fixed group
 * (Sawayatra provenance, laddered pricing). No partner inventory is live and
 * member-created journeys open with membership, so the Forming group is
 * honestly empty — an empty state, never invented entries.
 */
import { andeanCaravanSections } from "@/content/andean-caravan";
import type { FixedJourney, FormingJourney, Journey } from "@/lib/journeys/model";

export const fixedJourneys: readonly FixedJourney[] = andeanCaravanSections.map(
  (section) => ({
    id: section.id,
    slug: section.slug,
    title: section.title,
    route: section.route,
    durationDays: section.durationDays,
    href: `/departures/${section.slug}` as const,
    pricingModel: "laddered",
    dateState: "fixed",
    provenance: "sawayatra",
    dateLine: section.publicDateWindow,
  }),
);

/**
 * Member-created journeys, open to joining while forming (§2.2). Empty until
 * membership opens; the page renders an honest empty state.
 */
export const formingJourneys: readonly FormingJourney[] = [];

export const journeysCatalog: readonly Journey[] = [
  ...fixedJourneys,
  ...formingJourneys,
];
