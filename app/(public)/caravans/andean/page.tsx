import type { Metadata } from "next";
import Link from "next/link";

import { CaravanRouteMap } from "@/app/(public)/caravans/_components/CaravanRouteMap";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { ProvenanceBadge } from "@/components/journeys/ProvenanceBadge";
import { Arrow } from "@/components/ui/Arrow";
import {
  andeanCaravanHeroImage,
  getCanonicalCaravanImage,
} from "@/content/andean-caravan-images";
import { getCanonicalCaravanOverview } from "@/content/caravan/page-data";
import { siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

import styles from "../../departures/departures.module.css";

export const metadata: Metadata = {
  title: { absolute: `The Andean Caravan | ${siteConfig.name}` },
  alternates: { canonical: absoluteUrl("/caravans/andean") },
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
          <p>Departures</p>
          <h1 id="departures-heading">Choose where the road becomes yours.</h1>
          <p>
            Each Caravan follows one route on one seasonal departure. Join for
            one section, combine several, or travel until the road ends.
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
          <h2 id="andean-caravan-heading">{data.name}</h2>
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
        <Link href="/caravans/andean-caravan/how-it-works">
          Explore joining and leaving <Arrow />
        </Link>
      </section>

      <div className={styles.map} id="full-route-map">
        <CaravanRouteMap />
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

            return (
              <li key={section.section_id}>
                <Link
                  className={styles.sectionCard}
                  href={`/caravans/andean/${slug}`}
                  aria-label={`Section ${section.section_id}, ${section.name} — ${duration} days, ${gateFrom.name} to ${gateTo.name}`}
                >
                  <RisoArtwork
                    className={styles.sectionImage}
                    asset={getCanonicalCaravanImage(slug)}
                    aspectRatio="card"
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, (max-width: 1440px) 33vw, 475px"
                  />
                  <div className={styles.sectionCopy}>
                    <span>{section.section_id}</span>
                    <ProvenanceBadge provenance="sawayatra" />
                    <h3>{section.name}</h3>
                    {section.subline ? <p>{section.subline}</p> : null}
                    <dl>
                      <div>
                        <dt>Route</dt>
                        <dd>{gateFrom.name} → {gateTo.name}</dd>
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
            <Link href="/caravans/andean/the-stone-road">
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
            <Link href="/caravans/andean-caravan/how-it-works">
              Compare joining points <Arrow />
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
          <h2>Enquiry status</h2>
          <p className={styles.conditionNote}>
            Enquiry delivery is not connected yet. No payment or booking action
            is active.
          </p>
        </div>
      </section>

      <section className={styles.ask} aria-labelledby="ask-heading">
        <p>The Andean Caravan</p>
        <h2 id="ask-heading">
          Start with the part of the route you can already imagine.
        </h2>
        <Link href="#all-sections">Choose a section <Arrow /></Link>
      </section>
    </main>
  );
}
