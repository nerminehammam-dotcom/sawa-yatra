import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { Faq } from "@/components/ui/Faq";
import { ANDEAN_CARAVAN_SEASON } from "@/content/andean-caravan";

import { CaravanRouteMap } from "../../_components/CaravanRouteMap";
import { approvedFaq } from "./_content";
import { FindGateButton, JourneyDrawerButton } from "./_components/FindGateButton";
import { GateSelector } from "./_components/GateSelector";
import styles from "./how-it-works.module.css";

export const metadata: Metadata = createPageMetadata(
  "/caravans/andean-caravan/how-it-works",
);

const rules = [
  ["You book sections, not days.", "Each section has its own beginning, ending and reason to exist."],
  ["Every gate connects to an airport.", "Joining and leaving points are chosen so travellers can reach them without breaking the route."],
  ["Some gates require an earlier arrival.", "Where required, the previous hotel night and arrival support are included."],
  ["A Sawayatra Host meets you.", "The Host already travelling with the group receives arriving guests and welcomes them into the Caravan."],
] as const;

const combinations = [
  ["Desert Coast + White City, Deep Canyon", "16 days", "Lima", "Cusco"],
  ["The Stone Road + Both Shores + Thin Air & Cloud Forest", "24 days", "Cusco", "Sucre"],
  ["The Mirror + Atacama", "11 days", "Uyuni", "Santiago"],
  ["The Mirror + Atacama + The End of the Road", "24 days", "Uyuni", "Balmaceda"],
  ["Complete Caravan", "71 days", "Lima", "Balmaceda"],
] as const;

export default function HopOnHopOffPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="page-heading">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            The Andean Caravan · {ANDEAN_CARAVAN_SEASON}
          </p>
          <h1 id="page-heading">Join the Caravan. Travel your section. Leave when it ends.</h1>
          <div className={styles.heroText}>
            <p>The Caravan follows one fixed north-to-south calendar. Travellers join and leave at designated gates along the route.</p>
            <p>You book sections rather than individual days. Choose one section, combine consecutive sections, or travel the complete Caravan.</p>
          </div>
          <div className={styles.heroActions}>
            <FindGateButton />
          </div>
        </div>
        <aside className={styles.promise}>
          <p>Join at any gate. Travel one section or several. Leave at the gate you choose. The Caravan continues.</p>
        </aside>
      </section>

      <CaravanRouteMap headingLevel={2} />

      <section className={styles.proposition} aria-labelledby="proposition-heading">
        <p aria-hidden="true">01—09</p>
        <h2 id="proposition-heading">One Caravan. Three countries. Nine ways to join.</h2>
        <p>Once a year, one moving group travels south from Peru through Bolivia and into Chilean Patagonia. You choose the doors.</p>
      </section>

      <section className={styles.numbers} aria-label="The Andean Caravan by the numbers">
        <p>71 days</p><p>70 nights</p><p>3 countries</p><p>9 sections</p><p>10 gates</p><p>2 land borders</p><p>4 short flights</p><p>Small groups</p><p>3 Hosts</p><p>One departure a year</p>
        <strong>Four short flights in 71 days. Everything else road, rail or water.</strong>
      </section>

      <section className={styles.rules} aria-labelledby="rules-heading">
        <header>
          <h2 id="rules-heading">Four rules. The road stays simple.</h2>
          <p>A gate is a designated city where you may join or leave the Caravan. Most gates are handover points: one section ends and the next begins.</p>
        </header>
        <ol>
          {rules.map(([title, body], index) => (
            <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></li>
          ))}
        </ol>
      </section>

      <section className={styles.joining} aria-labelledby="joining-heading">
        <div className={styles.joiningCopy}>
          <h2 id="joining-heading">Joining a group already in motion.</h2>
          <p>Some travellers will already know one another when you join. Your Host meets you before the group does, explains where the Caravan is in its rhythm and creates a deliberate welcome that evening.</p>
          <p>People will also be leaving. The changing group is part of the Caravan’s nature, not an interruption to it.</p>
        </div>
        <ol className={styles.ritual} aria-label="The gate ritual">
          <li>Private Host welcome</li>
          <li>Short journey orientation</li>
          <li>Introductions to the existing group</li>
          <li>Shared first meal</li>
          <li>Acknowledgement of travellers leaving</li>
          <li>Rooming and transport reset</li>
        </ol>
      </section>

      <section className={styles.once} aria-labelledby="once-heading">
        <div className={styles.onceImage}>
          <Image
            src="/assets/images/departures/andean/gallery/the-end-of-the-road/16-patagonia-36.jpg"
            alt="Patagonian lenga forest turning red and gold beside the road"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </div>
        <div className={styles.onceCopy}>
          <h2 id="once-heading">Why it leaves once.</h2>
          <p>The Salar de Uyuni becomes a mirror only when water lies on the salt. Patagonia’s lenga forests turn red and gold from late March into early April. The last boats cross Lake O’Higgins before winter closes the route.</p>
          <p>Move the Caravan a few weeks in either direction and one of those disappears. The calendar is not a preference. <strong>It is arithmetic.</strong></p>
        </div>
      </section>

      <section className={styles.combinations} aria-labelledby="combinations-heading">
        <header>
          <h2 id="combinations-heading">One section. Or keep going.</h2>
          <p>Every combination travels continuously south. No gaps, no backtracking, no nine-item shopping basket.</p>
        </header>
        <div className={styles.combinationList}>
          {combinations.map(([name, duration, join, leave]) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>{join} → {leave}</p>
              <strong>{duration}</strong>
            </article>
          ))}
        </div>
      </section>

      <GateSelector />

      <section className={styles.standalone} aria-labelledby="standalone-heading">
        <div>
          <h2 id="standalone-heading">Caravan or standalone?</h2>
          <p>The Caravan follows one fixed calendar and carries a changing group south. Each section may also run independently in its own best season, with different dates, weather, price, group and Host arrangement.</p>
        </div>
        <div className={styles.mirrorChoice}>
          <h3>One route, two propositions.</h3>
          <p><strong>The Mirror</strong> runs January–March, when water erases the Salar’s horizon.</p>
          <p><strong>The White Desert</strong> runs May–October, with dry crust and fuller access.</p>
          <Link href="/journeys">Browse standalone journeys →</Link>
        </div>
      </section>

      <section className={styles.faqSection}>
        <Faq items={approvedFaq} title="The useful questions." />
      </section>

      <section className={styles.closing} aria-labelledby="closing-heading">
        <div className={styles.closingImage}>
          <Image
            src="/assets/images/departures/andean/gallery/the-end-of-the-road/07-patagoina-01.jpg"
            alt="A quiet road continuing through open Patagonian country"
            fill
            sizes="(max-width: 800px) 100vw, 52vw"
          />
        </div>
        <div className={styles.closingCopy}>
          <h2 id="closing-heading">Where will you join us?</h2>
          <p>Choose one section, connect several, or ask Sawayatra to help shape your route through the Andes.</p>
          <div className={styles.closingActions}>
            <JourneyDrawerButton>Build my journey</JourneyDrawerButton>
          </div>
          <p className={styles.price}>Price on request. Enquiries open after the Before You Book guidance is approved.</p>
        </div>
      </section>
    </main>
  );
}
