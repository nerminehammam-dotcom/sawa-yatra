import { createPageMetadata } from "@/app/_metadata";
import { andeanCaravanMapChapters } from "@/content/andean-caravan-map";

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
        <ol className={styles.chapters}>
          {andeanCaravanMapChapters.map((chapter) => (
            <li key={chapter.id}>
              <article className={styles.chapter}>
                <p className={styles.chapterNumber}>{chapter.id}</p>
                <h3>{chapter.title}</h3>
                <p className={styles.route}>{chapter.route} · {chapter.days} days</p>
                <p>{chapter.movement}</p>
                {"routeGroups" in chapter && chapter.routeGroups ? (
                  <div className={styles.routeGroups}>
                    {chapter.routeGroups.map((group) => (
                      <p key={group.label}>
                        <strong>{group.label}:</strong> {group.places.join(" → ")}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p>{chapter.places.join(" → ")}</p>
                )}
                <dl>
                  <div><dt>Join</dt><dd>{chapter.join}</dd></div>
                  <div><dt>Leave</dt><dd>{chapter.leave}</dd></div>
                </dl>
              </article>
            </li>
          ))}
        </ol>
        <p className={styles.note}>
          Transport modes and route places match the four atlas plates. Detailed
          timing, altitude and operating conditions live on each chapter page.
        </p>
      </section>
    </main>
  );
}
