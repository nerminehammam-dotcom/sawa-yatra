import type { Metadata } from "next";
import Link from "next/link";

import { CaravanRouteMap } from "@/app/(public)/caravans/_components/CaravanRouteMap";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { ProvenanceBadge } from "@/components/journeys/ProvenanceBadge";
import { Arrow } from "@/components/ui/Arrow";
import {
  andeanCaravanHeroImage,
  getCanonicalCaravanCardImage,
} from "@/content/andean-caravan-images";
import { andeanCaravanMapChapters } from "@/content/andean-caravan-map";
import { getCanonicalCaravanOverview } from "@/content/caravan/page-data";
import { siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

import styles from "../../departures/departures.module.css";

export const metadata: Metadata = {
  title: { absolute: `The Andean Caravan | ${siteConfig.name}` },
  alternates: { canonical: absoluteUrl("/journeys/caravans/andean-caravan") },
};

export default function AndeanCaravanPage() {
  const data = getCanonicalCaravanOverview();

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <section
        className={styles.introduction}
        aria-labelledby="departures-heading"
      >
        <div className={styles.introductionCopy}>
          <p>
            <Link href="/journeys/caravans">Caravans</Link> / The Andean Caravan / Peru · Bolivia · Chile
          </p>
          <h1 id="departures-heading">The whole Andean Caravan.</h1>
          <p>
            Seventy-one days from Lima to Patagonia. Join one section, combine
            several, or follow the road until the Caravan ends.
          </p>
        </div>
        <RisoArtwork
          className={styles.introductionImage}
          asset={andeanCaravanHeroImage}
          aspectRatio="wide"
          sizes="(max-width: 900px) 100vw, (max-width: 1440px) 52vw, 749px"
          priority
        />
      </section>

      <section
        className={styles.caravan}
        aria-labelledby="andean-caravan-heading"
      >
        <div>
          <p>Peru / Bolivia / Chile</p>
          <h2 id="andean-caravan-heading">Lima to Balmaceda, in four sections.</h2>
          <p>
            One continuous route from Lima to Balmaceda, arranged as four
            consecutive sections with one optional eight-day short form.
          </p>
        </div>
        <dl>
          <div><dt>Complete route</dt><dd>{data.durationDays} days</dd></div>
          <div><dt>Sections</dt><dd>{data.sections.length}</dd></div>
          <div><dt>Group</dt><dd>Maximum {data.groupMax}</dd></div>
          <div><dt>Scheduled flights</dt><dd>{data.scheduledFlights} movements</dd></div>
        </dl>
        <Link href="#full-route-map">
          View the Maps section <Arrow />
        </Link>
      </section>

      <div className={styles.map} id="full-route-map">
        <CaravanRouteMap headingLevel={2} />
        <details className={styles.mapTextEquivalent}>
          <summary>Read the Maps section as text</summary>
          <ol>
            {andeanCaravanMapChapters.map((section) => (
              <li key={section.id}>
                <p>{section.id}</p>
                <h3>{section.title}</h3>
                <p>{section.route} · {section.days} days</p>
                <p><strong>Movement:</strong> {section.movement}</p>
                <p><strong>Places:</strong> {section.places.join(" → ")}</p>
                <dl>
                  <div><dt>Join</dt><dd>{section.join}</dd></div>
                  <div><dt>Leave</dt><dd>{section.leave}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
        </details>
        <div className={styles.mapTextLink}>
          <p>Prefer every route day in one reading order?</p>
          <Link href="/journeys/caravans/andean-caravan/route-map">
            Open Each stop <Arrow />
          </Link>
        </div>
      </div>

      <section
        className={styles.sections}
        id="all-sections"
        aria-labelledby="all-sections-heading"
      >
        <header>
          <p>Four sections</p>
          <h2 id="all-sections-heading">
            Enter once. Continue as far as you choose.
          </h2>
        </header>
        <ol className={styles.sectionGrid}>
          {data.sections.map(({ slug, section, gateFrom, gateTo }) => {
            const duration = section.day_end - section.day_start + 1;
            const routeLabel =
              section.section_id === "04"
                ? `${gateFrom.name} → ${gateTo.name} → ${gateFrom.name}`
                : `${gateFrom.name} → ${gateTo.name}`;

            return (
              <li key={section.section_id}>
                <Link
                  className={styles.sectionCard}
                  href={`/journeys/caravans/andean-caravan/${slug}`}
                  aria-label={`Section ${section.section_id}, ${section.name} - ${duration} days, ${routeLabel}`}
                >
                  <RisoArtwork
                    className={styles.sectionImage}
                    asset={getCanonicalCaravanCardImage(slug)}
                    aspectRatio="card"
                    sizes="(max-width: 700px) 100vw, (max-width: 1440px) 50vw, 720px"
                  />
                  <div className={styles.sectionCopy}>
                    <span>{section.section_id}</span>
                    <ProvenanceBadge provenance="sawayatra" />
                    <h3>{section.name}</h3>
                    {section.subline ? <p>{section.subline}</p> : null}
                    <dl>
                      <div>
                        <dt>Route</dt>
                        <dd>{routeLabel}</dd>
                      </div>
                      <div><dt>Time</dt><dd>{duration} days</dd></div>
                      <div>
                        <dt>Join / leave</dt>
                        <dd>{gateFrom.name} / {gateTo.name}</dd>
                      </div>
                    </dl>
                    <strong>View section <Arrow /></strong>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.information} aria-label="Caravan choices">
        <div>
          <h2>The Stone Road</h2>
          <p>
            The optional eight-day short form runs from Cusco to Puno on days
            16–23 of Sea to Stone.
          </p>
          <p>
            <Link href="/journeys/caravans/andean-caravan/the-stone-road">
              Read The Stone Road <Arrow />
            </Link>
          </p>
        </div>
        <div>
          <h2>Joining &amp; leaving points</h2>
          <p>
            Compare the five Caravan gates and the Cusco short-form joining
            exception.
          </p>
          <p>
            <Link href="/journeys/caravans/andean-caravan/joining-points">
              Plan your joining and leaving gates <Arrow />
            </Link>
          </p>
        </div>
      </section>

      <section
        className={styles.information}
        id="trip-documents"
        aria-labelledby="trip-documents-heading"
      >
        <div>
          <p>Trip PDFs</p>
          <h2 id="trip-documents-heading">Trip PDFs for the Andean Caravan.</h2>
          <p>
            This will be the single library for approved Andean Caravan PDFs
            and traveller documents.
          </p>
        </div>
        <div>
          <h2>Coming soon</h2>
          <p>
            No trip documents are available for download yet. They will appear
            here when the route, dates and practical information are approved.
          </p>
          <p>
            <Link href="/journeys/caravans/andean-caravan/route-map">
              Read every route day online <Arrow />
            </Link>
          </p>
        </div>
      </section>

      <section className={styles.conditions} aria-labelledby="conditions-heading">
        <div>
          <h2 id="conditions-heading">How the sections work</h2>
          <p>
            Choose one section or combine consecutive sections on the same
            north-to-south route. Each section page contains its day-by-day
            itinerary, demands, altitude information and operating conditions.
          </p>
        </div>
        <div>
          <h2>Interest registration</h2>
          <p className={styles.conditionNote}>
            Open for the first departure in February 2028. No payment is taken
            online; Sawayatra will reply personally when dates, price and
            availability are ready.
          </p>
          <p>
            <Link href="/register-interest">
              Register your interest <Arrow />
            </Link>
          </p>
        </div>
      </section>

      <section className={styles.ask} aria-labelledby="ask-heading">
        <p>The Andean Caravan</p>
        <h2 id="ask-heading">
          Start with the part of the route you can already imagine.
        </h2>
        <Link href="/register-interest">Register your interest <Arrow /></Link>
      </section>
    </main>
  );
}
