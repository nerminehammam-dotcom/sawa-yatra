import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { SignalStatement } from "@/components/field/SignalStatement";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { fieldDocumentContent } from "@/content/field-document";

import styles from "./home.module.css";

export const metadata = createPageMetadata("/");

export default function HomePage() {
  const content = fieldDocumentContent;

  return (
    <main className={styles.homePage} id="main-content" tabIndex={-1}>
      <section className={styles.homeHero} aria-labelledby="home-heading">
        <Image
          className={styles.homeHeroImage}
          src="/assets/images/home/hero.jpg"
          alt="A quiet road runs through open Patagonian grassland beneath a pale blue sky."
          fill
          preload
          sizes="100vw"
        />
        <div className={styles.homeHeroScrim} aria-hidden="true" />

        <div className={styles.homeHeroCopy}>
          <h1 id="home-heading">Go alone, arrive together.</h1>
          <p className={styles.homeHeroTagline}>
            A members’ club that matches travellers by how they travel.
          </p>
          <p className={styles.homeHeroDefinition}>
            Sawayatra is a members’ travel club that brings compatible
            travellers together through shared journeys, beginning with the
            annual Andean Caravan.
          </p>
          <div className={styles.homeHeroActions}>
            <ButtonLink
              className={styles.homeHeroPrimaryAction}
              href="/how-it-works"
              surface="deep"
            >
              See how Sawayatra works
            </ButtonLink>
            <ButtonLink
              className={styles.homeHeroSecondaryAction}
              href="/caravans/andean"
              surface="deep"
              variant="secondary"
            >
              Explore the Andean Caravan
            </ButtonLink>
          </div>
          <Link
            className={styles.homeHeroPracticalLink}
            href="/caravans/andean#honest-conditions-heading"
          >
            Altitude, physical demands and accommodation
          </Link>
        </div>
      </section>

      <SignalStatement>{content.interruption}</SignalStatement>
    </main>
  );
}
