import { createPageMetadata } from "@/app/_metadata";
import {
  andeanCaravanCountries,
  andeanCaravanRouteStops,
} from "@/content/andean-caravan-route";

import { CaravanRouteMap } from "../../_components/CaravanRouteMap";

import styles from "./route-map.module.css";

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

      {/* Constitution §5/§10: every map has a static, labelled equivalent
          carrying the same information. The route, in reading order. */}
      <section className={styles.staticRoute} aria-labelledby="static-route-heading">
        <h2 id="static-route-heading">The route, in order</h2>
        {andeanCaravanCountries.map((country) => (
          <div key={country} className={styles.country}>
            <h3>{country}</h3>
            <ol className={styles.stops}>
              {andeanCaravanRouteStops
                .filter((stop) => stop.country === country)
                .map((stop) => (
                  <li key={stop.id}>{stop.name}</li>
                ))}
            </ol>
          </div>
        ))}
        <p className={styles.note}>
          North to south, Lima to the end of the road. Each stop's detail —
          altitude, season, what the Caravan does there — lives on its section
          page.
        </p>
      </section>
    </main>
  );
}
