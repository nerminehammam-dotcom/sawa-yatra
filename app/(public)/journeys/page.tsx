import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { journeyProductNavigation } from "@/content/navigation";
import { journeyPublicHrefForSlug } from "@/lib/sawayatra/journey-registry";
import { journeys } from "@/lib/sawayatra/server";

import styles from "./journeys.module.css";

const productImages = {
  caravans: {
    src: "/assets/images/departures/andean/gallery/carretera-austral/caravans-cattle-drive.webp",
    alt: "Rider moving cattle along Ruta 7 through forest in central Aysén.",
  },
  "create-your-own-journey": {
    src: "/assets/images/create-your-own-journey/hero-anywhere.jpg",
    alt: "Illustrated landscape with pyramids, an aeroplane, camels and desert plants beneath pink clouds.",
  },
  "join-an-existing-journey": {
    src: "/assets/images/journeys/join/egypt/region-western-desert.jpg",
    alt: "Sunrise over rippled sand beneath a broad sky in Egypt's Western Desert.",
  },
} as const;

export const metadata = createPageMetadata("/journeys");

export default function JourneysPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
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
        </div>
        <figure className={styles.headerImage}>
          <Image
            src="/assets/images/departures/andean/gallery/carretera-austral/home-road.webp"
            alt="Long gravel road crossing the Patagonian steppe towards mountains."
            fill
            preload
            sizes="(max-width: 800px) 100vw, 58vw"
          />
        </figure>
      </header>

      <nav aria-label="Journey products">
        <ul className={styles.productList}>
          {journeyProductNavigation.map((product) => (
            <li key={product.id}>
              <Link href={product.href}>
                <figure className={styles.productImage}>
                  <Image
                    src={productImages[product.id].src}
                    alt={productImages[product.id].alt}
                    fill
                    sizes="(max-width: 800px) 100vw, 33vw"
                  />
                </figure>
                <span>{product.label}</span>
              </Link>
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
