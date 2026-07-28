import { createPageMetadata } from "@/app/_metadata";

import { CaravanRouteMap } from "../../_components/CaravanRouteMap";

export const metadata = createPageMetadata("/caravans/andean/route-map");

export default function AndeanRouteMapPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <CaravanRouteMap />
    </main>
  );
}
