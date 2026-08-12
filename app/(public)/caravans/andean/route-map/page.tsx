import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { Arrow } from "@/components/ui/Arrow";
import { andeanCaravanMapChapters } from "@/content/andean-caravan-map";
import {
  getCanonicalCaravanOverview,
  getCanonicalStoneRoadPageData,
} from "@/content/caravan/page-data";

import styles from "./route-map.module.css";

export const metadata = createPageMetadata("/caravans/andean/route-map");

export default function AndeanRouteMapPage() {
  const overview = getCanonicalCaravanOverview();
  const stoneRoad = getCanonicalStoneRoadPageData();

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>
          <Link href="/journeys/caravans">Caravans</Link> /{" "}
          <Link href="/journeys/caravans/andean-caravan">The Andean Caravan</Link> / Each stop
        </p>
        <h1>Each stop, in travelling order.</h1>
        <p className={styles.lede}>
          A text-first companion to Maps: the principal route stops, every
          travel day, transport modes, joining gates, the Cusco short-form
          exception and the included exit flight.
        </p>
        <div className={styles.introActions}>
          <Link className={styles.primaryAction} href="/journeys/caravans/andean-caravan#full-route-map">
            Open Maps <Arrow />
          </Link>
          <Link href="/journeys/caravans/andean-caravan/joining-points">
            Choose where to join and leave <Arrow />
          </Link>
        </div>
      </header>

      <section className={styles.staticRoute} aria-labelledby="static-route-heading">
        <header className={styles.routeHeader}>
          <p>Four joinable sections</p>
          <h2 id="static-route-heading">
            Lima to Patagonia, with the included flight back to Santiago.
          </h2>
          <p>
            Each numbered section corresponds to one atlas plate and one
            consecutive part of the Caravan.
          </p>
        </header>

        <ol className={styles.sections}>
          {andeanCaravanMapChapters.map((section) => {
            const sectionData = overview.sections.find(
              ({ section: candidate }) => candidate.section_id === section.id,
            );

            return (
              <li key={section.id}>
                <article className={styles.sectionCard}>
                  <p className={styles.sectionNumber}>{section.id}</p>
                  <h3>{section.title}</h3>
                  <p className={styles.route}>{section.route} · {section.days} days</p>
                  <p className={styles.movement}>{section.movement}</p>
                  {"routeGroups" in section && section.routeGroups ? (
                    <div className={styles.routeGroups}>
                      {section.routeGroups.map((group) => (
                        <div key={group.label}>
                          <h4>{group.label}</h4>
                          <ol className={styles.stopList}>
                            {group.places.map((place) => (
                              <li key={`${group.label}-${place}`}>{place}</li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ol className={styles.stopList}>
                      {section.places.map((place) => (
                        <li key={place}>{place}</li>
                      ))}
                    </ol>
                  )}
                  <dl className={styles.gates}>
                    <div><dt>Join</dt><dd>{section.join}</dd></div>
                    <div><dt>Leave</dt><dd>{section.leave}</dd></div>
                  </dl>

                  {sectionData ? (
                    <details className={styles.dayIndex}>
                      <summary>View all {sectionData.days.length} route days</summary>
                      <ol>
                        {sectionData.days.map((day) => (
                          <li key={day.id}>
                            <div>
                              <span>Day {day.day}</span>
                              <strong>{day.title}</strong>
                            </div>
                            <p>{day.route}</p>
                            <dl>
                              <div>
                                <dt>Movement</dt>
                                <dd>{day.movement}</dd>
                              </div>
                              <div>
                                <dt>Sleep</dt>
                                <dd>{day.sleep}</dd>
                              </div>
                            </dl>
                          </li>
                        ))}
                      </ol>
                    </details>
                  ) : null}

                  <Link className={styles.sectionLink} href={section.href}>
                    Explore this section <Arrow />
                  </Link>
                </article>
              </li>
            );
          })}
        </ol>

        <aside className={styles.shortForm} aria-labelledby="short-form-heading">
          <div>
            <p>Short-form joining exception · Caravan days {stoneRoad.product.day_start}–{stoneRoad.product.day_end}</p>
            <h3 id="short-form-heading">{stoneRoad.product.name}</h3>
            <p>
              {stoneRoad.gateFrom.name} → {stoneRoad.gateTo.name} · {stoneRoad.product.day_end - stoneRoad.product.day_start + 1} days
            </p>
          </div>
          <div>
            <p><strong>Join:</strong> {stoneRoad.gateFrom.name} · {stoneRoad.gateFrom.airport}</p>
            <p><strong>Leave:</strong> {stoneRoad.gateTo.name} · {stoneRoad.gateTo.airport}</p>
            <p>{stoneRoad.gateFrom.arrival_rule.text}</p>
            <Link href="/journeys/caravans/andean-caravan/the-stone-road">
              Explore the short form <Arrow />
            </Link>
          </div>
        </aside>

        <p className={styles.note}>
          This index shows every published route day. Detailed narrative,
          altitude, accommodation, demands and operating conditions live on
          each section page.
        </p>
      </section>

      <nav className={styles.nextSteps} aria-label="Continue planning the Andean Caravan">
        <Link href="/journeys/caravans/andean-caravan#trip-documents">
          <span>Documents</span>
          <strong>Check the Trip PDFs status</strong>
        </Link>
        <Link href="/journeys/caravans/andean-caravan/joining-points">
          <span>Choose your run</span>
          <strong>Plan where to join and leave</strong>
        </Link>
        <Link href="/register-interest">
          <span>When you are ready</span>
          <strong>Register your interest</strong>
        </Link>
      </nav>
    </main>
  );
}
