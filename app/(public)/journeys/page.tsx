import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { journeyProductNavigation } from "@/content/navigation";

import styles from "./journeys.module.css";

const productImages = {
  caravans: {
    src: "/assets/images/editorial/chaiten-lago-yelcho.jpg",
    alt: "Lago Yelcho reflecting blue evening light between forested mountains near Chaitén.",
  },
  "create-your-own-journey": {
    src: "/assets/images/editorial/atacama-night-rock-tower.jpg",
    alt: "Star-filled night sky above a tall rock formation in the Atacama Desert.",
  },
  "join-an-existing-journey": {
    src: "/assets/images/editorial/altiplano-sheep.jpg",
    alt: "Sheep standing in highland fields with a shepherd further up the slope.",
  },
} as const;

const productDescriptions = {
  caravans:
    "Each Caravan is one continuous, long-form journey with designated places to join and leave. Choose the route first, then decide how far to follow it.",
  "create-your-own-journey":
    "A later way for members to propose a destination, dates and travel style, then invite compatible members to join.",
  "join-an-existing-journey":
    "These run to a set route and a set length. You join one as it is, rather than building it from scratch or riding a Caravan section by section.",
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
      </header>

      <nav aria-label="Journey products">
        <ul className={styles.productList}>
          {journeyProductNavigation.map((product, index) => (
            <li key={product.id}>
              <Link href={product.href}>
                <figure className={styles.productImage}>
                  <Image
                    src={productImages[product.id].src}
                    alt={productImages[product.id].alt}
                    fill
                    preload={index === 0}
                    sizes="(max-width: 800px) 100vw, 50vw"
                  />
                </figure>
                <span className={styles.productCopy}>
                  <span className={styles.productTitle}>{product.label}</span>
                  <span className={styles.productDescription}>
                    {productDescriptions[product.id]}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

    </main>
  );
}
