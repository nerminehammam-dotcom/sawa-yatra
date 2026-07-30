import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { RouteIndex } from "@/components/field/RouteIndex";
import { andeanCaravan, andeanCaravanSections } from "@/content/andean-caravan";
import { andeanCaravanHeroImage } from "@/content/andean-caravan-images";

import { CaravanRouteMap } from "./_components/CaravanRouteMap";
import styles from "./caravans.module.css";

export const metadata = createPageMetadata("/caravans");

// Titles and ledes are taken verbatim from each caravan's own page; no route,
// region or date detail has been inferred for routes that are not yet approved.
const upcomingCaravans = [
  {
    title: "The Egyptian Caravan",
    lede:
      "This Caravan is coming soon. Route information will be added section by section when the approved details are ready.",
    href: "/caravans/egyptian",
  },
  {
    title: "The Indian Caravan",
    lede:
      "This Caravan is coming soon. Route information will be added section by section when the approved details are ready.",
    href: "/caravans/indian",
  },
] as const;

export default function CaravansPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="caravans-heading">
        <div className={styles.heroCopy}>
          <p>Caravans / annual routes</p>
          <h1 id="caravans-heading">
            <span>One caravan.</span>
            <span>One long route.</span>
          </h1>
          <p>
            A caravan is a continuous expedition with designated places to
            join and leave. The Andean Caravan is the flagship route.
          </p>
        </div>
        <figure className={styles.heroImage}>
          <Image
            src={andeanCaravanHeroImage.src}
            alt={andeanCaravanHeroImage.alt}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 55vw"
            style={{
              objectPosition: `${andeanCaravanHeroImage.focalPoint?.x ?? 50}% 76%`,
            }}
          />
          <figcaption>FLAGSHIP / SOUTH AMERICA</figcaption>
        </figure>
      </section>

      <section className={styles.flagship} aria-labelledby="andean-heading">
        <div className={styles.flagshipTitle}>
          <p>Peru / Bolivia / Chile</p>
          <h2 id="andean-heading">{andeanCaravan.productName}</h2>
          <p>{andeanCaravan.route}</p>
        </div>
        <dl className={styles.facts}>
          <div>
            <dt>Full route</dt>
            <dd>{andeanCaravan.durationDays} days</dd>
          </div>
          <div>
            <dt>Public window</dt>
            <dd>{andeanCaravan.publicDateWindow}</dd>
          </div>
          <div>
            <dt>Sections</dt>
            <dd>{andeanCaravanSections.length} connected ways to enter</dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd>{andeanCaravan.price}</dd>
          </div>
        </dl>
        <div className={styles.actions}>
          <Link href="/caravans/andean">Follow the complete route →</Link>
          <Link href="/caravans/andean-caravan/how-it-works">Compare joining points ↗</Link>
        </div>
      </section>

      <section
        className={styles.sections}
        aria-labelledby="andean-sections-heading"
      >
        <header>
          <p>The Andean Caravan / sections</p>
          <h2 id="andean-sections-heading">
            {andeanCaravanSections.length} connected ways to enter
          </h2>
        </header>
        <RouteIndex />
      </section>

      <CaravanRouteMap />

      <section className={styles.upcoming} aria-labelledby="upcoming-heading">
        <h2 className="sr-only" id="upcoming-heading">
          Caravans in preparation
        </h2>
        {upcomingCaravans.map((caravan) => (
          <article key={caravan.href}>
            <div className={styles.upcomingTitle}>
              <p>Coming soon</p>
              <h3>{caravan.title}</h3>
              <p>{caravan.lede}</p>
            </div>
            <div className={styles.actions}>
              <Link href={caravan.href}>Read what is confirmed →</Link>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.future} aria-labelledby="future-heading">
        <p>Collection architecture / future routes</p>
        <h2 id="future-heading">The field can grow. The facts have not been supplied yet.</h2>
        <p>
          Clearly labelled placeholder — future caravan regions, dates and
          operating details require approved source material before publication.
        </p>
      </section>
    </main>
  );
}
