import type { Metadata } from "next";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { andeanCaravanHeroImage } from "@/content/andean-caravan-images";

import styles from "./departures.module.css";

export const metadata: Metadata = createPageMetadata("/departures");

export default function DeparturesPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Section
        className={styles.gateway}
        ground="cream"
        aria-labelledby="departure-paths-heading"
      >
        <Container size="full" className={styles.gatewayFrame}>
          <header className={styles.gatewayHeader}>
            <Eyebrow className={styles.gatewayEyebrow} tone="accent">
              Departures
            </Eyebrow>
            <h1 className={styles.gatewayTitle} id="departure-paths-heading">
              Two ways to travel
            </h1>
            <p className={styles.gatewayIntroduction}>
              Choose the kind of journey you want to explore.
            </p>
          </header>

          <div className={styles.pathSequence}>
            <Link
              className={styles.caravanPath}
              href="/departures/the-andean-caravan"
            >
              <div className={styles.caravanImageStage}>
                <RisoArtwork
                  className={styles.caravanImage}
                  asset={andeanCaravanHeroImage}
                  aspectRatio="wide"
                  sizes="(max-width: 767px) 100vw, 78vw"
                  priority
                />
              </div>
              <div className={styles.caravanCopy}>
                <span className={styles.availableLabel}>Available journey</span>
                <h2>Caravan / Join</h2>
                <p>
                  Join one of nine consecutive sections, combine several, or
                  travel the complete 71-day Andean Caravan.
                </p>
                <span className={styles.cardAction}>
                  Explore the Caravan <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>

            <article className={styles.createPath}>
              <div className={styles.createRoute} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className={styles.createCopy}>
                <p className={styles.laterLabel}>Later release</p>
                <h2>
                  Create <span className={styles.comingLater}>Coming later</span>
                </h2>
                <p>
                  Create is not available in Release 1. Explore Caravan / Join
                  for the journey available now.
                </p>
              </div>
            </article>
          </div>
        </Container>
      </Section>
    </main>
  );
}
