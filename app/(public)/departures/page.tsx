import { Arrow } from "@/components/ui/Arrow";
import type { Metadata } from "next";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { CaravanRouteMap } from "@/app/(public)/caravans/_components/CaravanRouteMap";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { ProvenanceBadge } from "@/components/journeys/ProvenanceBadge";
import {
  andeanCaravan,
  andeanCaravanGateById,
  andeanCaravanSectionHref,
  andeanCaravanSections,
} from "@/content/andean-caravan";
import {
  departuresCarreteraHeroImage,
  getAndeanCaravanImage,
} from "@/content/andean-caravan-images";
import { contactHref } from "@/lib/contact";

import styles from "./departures.module.css";

export const metadata: Metadata = createPageMetadata("/departures");

export default function DeparturesPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <section className={styles.introduction} aria-labelledby="departures-heading">
        <div className={styles.introductionCopy}>
          <p>Departures</p>
          <h1 id="departures-heading">Choose where the road becomes yours.</h1>
          <p>{andeanCaravan.landingCopy[1]}</p>
        </div>
        <RisoArtwork
          className={styles.introductionImage}
          asset={departuresCarreteraHeroImage}
          aspectRatio="wide"
          sizes="(max-width: 900px) 100vw, (max-width: 1440px) 52vw, 749px"
          priority
        />
      </section>

      <section className={styles.caravan} aria-labelledby="andean-caravan-heading">
        <div>
          <p>Peru / Bolivia / Chile</p>
          <h2 id="andean-caravan-heading">{andeanCaravan.productName}</h2>
          <p>{andeanCaravan.overviewCopy[0]}</p>
        </div>
        <dl>
          <div><dt>Complete route</dt><dd>{andeanCaravan.durationDays} days</dd></div>
          <div><dt>Sections</dt><dd>{andeanCaravanSections.length}</dd></div>
          <div><dt>Group</dt><dd>{andeanCaravan.group}</dd></div>
          <div><dt>Price</dt><dd>{andeanCaravan.price}</dd></div>
        </dl>
        <Link href="/journeys/caravans/andean-caravan">Explore the complete Caravan <Arrow /></Link>
      </section>

      <div className={styles.map} id="full-route-map">
        <CaravanRouteMap />
      </div>

      <section className={styles.sections} id="all-sections" aria-labelledby="all-sections-heading">
        <header>
          <p>All nine sections</p>
          <h2 id="all-sections-heading">Enter once. Continue as far as you choose.</h2>
        </header>
        <ol className={styles.sectionGrid}>
          {andeanCaravanSections.map((section) => {
            const image = getAndeanCaravanImage(section.slug);
            const joinNames = section.joinGateIds
              .map((id) => andeanCaravanGateById[id].name)
              .join(" or ");
            const leaveName = andeanCaravanGateById[section.leaveGateId].name;

            return (
              <li key={section.id}>
                {/* Concise accessible name for the whole-card link. Without it,
                    a screen-reader user listing links hears the entire card
                    dumped as link text - number, promise, every fact - for all
                    nine. aria-label overrides the link's name without hiding the
                    h3, so the section titles still appear in the heading outline. */}
                <Link
                  className={styles.sectionCard}
                  href={andeanCaravanSectionHref(section.slug)}
                  aria-label={`Section ${section.sectionNumber}, ${section.title} - ${section.durationDays} days, ${section.route}`}
                >
                  <RisoArtwork
                    className={styles.sectionImage}
                    asset={image}
                    aspectRatio="card"
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, (max-width: 1440px) 33vw, 475px"
                  />
                  <div className={styles.sectionCopy}>
                    <span>{String(section.sectionNumber).padStart(2, "0")}</span>
                    {/* Rule 1.4 / §2.2 - provenance on every journey card. */}
                    <ProvenanceBadge provenance="sawayatra" />
                    <h3>{section.title}</h3>
                    <p>{section.promise}</p>
                    <dl>
                      <div><dt>Route</dt><dd>{section.route}</dd></div>
                      <div><dt>Time</dt><dd>{section.durationDays} days</dd></div>
                      <div><dt>Join / leave</dt><dd>{joinNames} / {leaveName}</dd></div>
                      <div><dt>Date</dt><dd>{section.publicDateWindow}</dd></div>
                    </dl>
                    <strong>View section <Arrow /></strong>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.joining} aria-labelledby="joining-heading">
        <div>
          <h2 id="joining-heading">Joining & Leaving Points</h2>
          <p>Compare every gateway, airport, time commitment and next natural leaving point in one place.</p>
        </div>
        <Link href="/journeys/caravans/andean-caravan/joining-points">Compare joining points <Arrow /></Link>
      </section>

      <section className={styles.information} id="dates-availability" aria-labelledby="dates-heading">
        <div>
          <h2 id="dates-heading">Dates and availability</h2>
          <p>{andeanCaravan.publicDateWindow}</p>
          <p>Each section page keeps its current public date window visible.</p>
        </div>
        <div id="what-is-included">
          <h2>What is included</h2>
          <p>Where an earlier arrival is required, the protected hotel night and arrival support are included.</p>
          <p className={styles.conditionNote}>Complete operating inclusions will be confirmed before enquiries open.</p>
        </div>
      </section>

      <section className={styles.conditions} aria-labelledby="conditions-heading">
        <div>
          <h2 id="conditions-heading">Physical demands and altitude</h2>
          <p>{andeanCaravan.principles[1]!.body}</p>
          <ul>
            {andeanCaravan.conditions.map((condition) => <li key={condition}>{condition}</li>)}
          </ul>
        </div>
        <div>
          <h2>Price status</h2>
          <p className={styles.price}>{andeanCaravan.price}</p>
          <p className={styles.conditionNote}>No payment or booking is taken through this site.</p>
        </div>
      </section>

      <section className={styles.ask} aria-labelledby="ask-heading">
        <p>Ask about a section</p>
        <h2 id="ask-heading">Start with the part of the route you can already imagine.</h2>
        <Link href={contactHref("Departures")}>Ask a question <Arrow /></Link>
      </section>
    </main>
  );
}
