import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { journeyProductNavigation } from "@/content/navigation";
import { journeyPublicHrefForSlug } from "@/lib/sawayatra/journey-registry";
import { journeys } from "@/lib/sawayatra/server";

import styles from "./journeys.module.css";

export const metadata = createPageMetadata("/journeys");

export default function JourneysPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header className={styles.header}>
        <p>Journeys / every road is public to read</p>
        <h1>Find a journey.</h1>
        <p className={styles.lede}>
          Where it goes, how long it takes, what it costs and what it asks of
          you. Membership changes what you can do, not what a Caravan lets you
          read.
        </p>
        <p className={styles.lede}>
          Read the route, duration, demands and current publication status.
          Structure, setting, access and origin remain separate parts of every
          journey record.
        </p>
      </header>

      <nav aria-label="Journey products">
        <ul className={styles.productList}>
          {journeyProductNavigation.map((product) => (
            <li key={product.id}>
              <Link href={product.href}>{product.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className={styles.group} aria-label="All journeys">
        <ul className={styles.cardList}>
          {journeys.map((journey) => (
            <li key={journey.id} className={styles.card}>
              <figure className={styles.v24CardImage}>
                <Image
                  src={journey.heroImage}
                  alt={journey.heroAlt}
                  fill
                  loading="eager"
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </figure>
              <div className={styles.v24CardCopy}>
                <div className={styles.cardTop}>
                  <span>{journey.type === "caravan" ? "Caravan" : "Open journey"}</span>
                  <span className={styles.duration}>{journey.duration}</span>
                </div>
                <h2 className={styles.cardTitle}>
                  <Link
                    href={journeyPublicHrefForSlug(journey.slug) ?? "/journeys"}
                  >
                    {journey.title}
                  </Link>
                </h2>
                <p className={styles.cardRoute}>{journey.route}</p>
                <p>{journey.groupPortrait.intended}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
