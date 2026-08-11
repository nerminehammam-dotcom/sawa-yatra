import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { Arrow } from "@/components/ui/Arrow";
import { ANDEAN_CARAVAN_FIRST_DEPARTURE } from "@/content/andean-caravan";
import { andeanCaravanHeroImage } from "@/content/andean-caravan-images";
import { getCanonicalCaravanOverview } from "@/content/caravan/page-data";

import styles from "./caravans.module.css";

export const metadata = createPageMetadata("/caravans");

export default function CaravansPage() {
  const andeanCaravan = getCanonicalCaravanOverview();

  return (
    <main id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="caravans-heading">
        <div className={styles.heroCopy}>
          <p>Caravans / annual routes</p>
          <h1 id="caravans-heading">
            <span>Caravans.</span>
            <span>Long routes, shared well.</span>
          </h1>
          <p>
            Each Caravan is one continuous, long-form journey with designated
            places to join and leave. Choose the route first, then decide how
            far to follow it.
          </p>
        </div>
        <figure className={styles.heroImage}>
          <Image
            src={andeanCaravanHeroImage.src}
            alt={andeanCaravanHeroImage.alt}
            fill
            preload
            sizes="(max-width: 800px) 100vw, (max-width: 1440px) 55vw, 792px"
            style={{
              objectPosition: `${andeanCaravanHeroImage.focalPoint?.x ?? 50}% 76%`,
            }}
          />
          <figcaption>FLAGSHIP / SOUTH AMERICA</figcaption>
        </figure>
      </section>

      <section className={styles.flagship} aria-labelledby="andean-heading">
        <div className={styles.flagshipTitle}>
          <p>Caravan 01 / open for interest</p>
          <h2 id="andean-heading">{andeanCaravan.name}</h2>
          <p>Lima → Balmaceda · Peru / Bolivia / Chile</p>
        </div>
        <dl className={styles.facts}>
          <div>
            <dt>Full route</dt>
            <dd>{andeanCaravan.durationDays} days</dd>
          </div>
          <div>
            <dt>First departure</dt>
            <dd>{ANDEAN_CARAVAN_FIRST_DEPARTURE}</dd>
          </div>
          <div>
            <dt>Sections</dt>
            <dd>{andeanCaravan.sections.length} consecutive sections</dd>
          </div>
          <div>
            <dt>Group</dt>
            <dd>Maximum {andeanCaravan.groupMax}</dd>
          </div>
        </dl>
        <div className={styles.actions}>
          <Link href="/caravans/andean">Follow the complete route <Arrow /></Link>
          <Link href="/caravans/andean-caravan/how-it-works">Compare joining points <Arrow direction="up-right" /></Link>
        </div>
      </section>

      <section className={styles.future} aria-labelledby="future-heading">
        <p>The collection / future routes</p>
        <h2 id="future-heading">The collection will grow route by route.</h2>
        <p>
          Future caravans will appear here only when their route, dates and
          operating details are ready to be published clearly.
        </p>
      </section>
    </main>
  );
}
