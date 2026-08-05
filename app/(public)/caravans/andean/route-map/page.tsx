import { createPageMetadata } from "@/app/_metadata";

import { CaravanRouteMap } from "../../_components/CaravanRouteMap";

export const metadata = createPageMetadata("/caravans/andean/route-map");

export default function AndeanRouteMapPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      {/* This route rendered the map and nothing else, so its only heading was
          the map's own h3 and the page had no h1 at all. The wording is the
          approved route title from content/site.ts, not new copy; it is
          visually hidden so the page design is unchanged. */}
      <h1 className="sr-only">Andean Caravan route map</h1>
      <CaravanRouteMap headingLevel={2} />
    </main>
  );
}
