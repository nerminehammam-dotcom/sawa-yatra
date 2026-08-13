import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { getAndeanCaravanGallery } from "@/content/andean-caravan-images";
import { contactHref } from "@/lib/contact";

import styles from "./about.module.css";
import { Arrow } from "@/components/ui/Arrow";

export const metadata = createPageMetadata("/about");

const fieldImage = getAndeanCaravanGallery("both-shores")[3]!;

const principles = [
  {
    number: "01",
    title: "The route is real work",
    body: "Distances, altitude, borders, ferries and transfer days belong in the story, not in hidden small print.",
  },
  {
    number: "02",
    title: "The caravan stays connected",
    body: "Each section is part of one annual movement through the Andes, even as travellers join and leave.",
  },
  {
    number: "03",
    title: "Places are not decoration",
    body: "The site uses approved factual content and observed photography without reducing a region or culture to a motif.",
  },
  {
    number: "04",
    title: "Clarity is a form of care",
    body: "A complex route should still feel possible to understand, compare and enter.",
  },
] as const;

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="about-heading">
        <p>About / Sawayatra field document</p>
        <h1 id="about-heading">A travel club with a point of view.</h1>
        <p>
          Sawayatra brings compatible travellers together through shared
          journeys. It begins with the annual Andean Caravan, built around
          designated joining points, practical clarity and the life found
          between destinations.
        </p>
      </section>

      <section className={styles.founders} aria-labelledby="founders-heading">
        <div className={styles.foundersLead}>
          <figure className={styles.foundersLeadImage}>
            <Image
              src="/assets/images/about/founders/lakeside.jpg"
              alt="Nermine Hammam and Amal standing together beside a lake and green hillside beneath a wide blue sky."
              fill
              loading="eager"
              sizes="(max-width: 900px) 100vw, 58vw"
            />
            <figcaption>Nermine and Amal / on the road</figcaption>
          </figure>
          <div className={styles.foundersIntroduction}>
            <p>Who we are / the people behind Sawayatra</p>
            <h2 id="founders-heading">The idea began on the road.</h2>
            <p>
              Sawayatra was founded by Nermine Hammam and Amal El Masri. It
              grew from travelling together and seeing how the right
              companionship, attention to practical details and room for
              spontaneity could transform a journey.
            </p>
          </div>
        </div>

        <article className={styles.founderProfile}>
          <figure className={styles.profileImage}>
            <Image
              src="/assets/images/about/founders/nermine-photographing.jpeg"
              alt="Nermine Hammam photographing a high-altitude wetland with mountains beyond."
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </figure>
          <div className={styles.profileCopy}>
            <p>Founder / artist / photographer</p>
            <h3>Nermine Hammam</h3>
            <p>
              Nermine Hammam is an Egyptian photo artist working between Cairo
              and London. Trained in filmmaking at New York University&apos;s
              Tisch School of the Arts, she works across photography, digital
              collage and mixed media. Her work has been exhibited
              internationally and is held in collections including the
              Victoria and Albert Museum and the Tropenmuseum.
            </p>
            <p>
              She brings to Sawayatra an artist&apos;s attention to place,
              memory and the stories images carry.
            </p>
            <a
              href="https://www.nerminehammam.com/"
              target="_blank"
              rel="noreferrer"
            >
              Visit Nermine&apos;s artist website <Arrow direction="up-right" />
            </a>
          </div>
        </article>

        <article className={styles.founderProfile}>
          <figure className={`${styles.profileImage} ${styles.amalProfileImage}`}>
            <Image
              src="/assets/images/about/founders/amal-el-masri-atacama.jpg"
              alt="Amal El Masri seated on a rock beside a high-altitude lagoon with volcanic mountains beyond."
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </figure>
          <div className={styles.profileCopy}>
            <p>Founder &amp; Journey Curator, Sawayatra</p>
            <h3>Amal El Masri</h3>
            <p>
              Amal el Masri is a travel entrepreneur and creative strategist
              whose career spans advertising, branding and film, including
              more than a decade at JWT, where she helped build one of the
              region&apos;s most celebrated creative agencies and its award-winning
              legacy. After years of frantic business travel had gradually
              taken the joy out of travelling, she rediscovered the magic of
              long-form journeys - and with it, a simple realisation: the people
              you travel with fundamentally shape how you experience a place.
              Sawayatra grew from this belief: that finding the right travel
              companions can turn a good journey into something deeper, more
              enriching and memorable.
            </p>
          </div>
        </article>

        <div className={styles.founderFieldNotes}>
          <figure>
            <Image
              src="/assets/images/about/founders/aircraft.jpg"
              alt="Nermine Hammam and Amal posing against the weathered fuselage of an aircraft."
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 900px) 50vw, 25vw"
            />
          </figure>
          <figure>
            <Image
              src="/assets/images/about/founders/patagonia-lake.jpeg"
              alt="Nermine Hammam and Amal standing above a vivid blue Patagonian lake."
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 900px) 50vw, 25vw"
            />
          </figure>
          <figure>
            <Image
              src="/assets/images/about/founders/salt-flat.jpg"
              alt="Nermine Hammam and Amal standing on a white salt flat beneath a vast blue sky."
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 900px) 50vw, 25vw"
            />
          </figure>
          <figure>
            <Image
              src="/assets/images/about/founders/walking.jpeg"
              alt="Nermine Hammam and Amal walking together on a rocky path through low forest."
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 900px) 50vw, 25vw"
            />
          </figure>
        </div>
        <p className={styles.founderCredit}>
          Founder photographs from Nermine Hammam&apos;s personal archive.
          Individual photographers are not yet credited.
        </p>
      </section>

      <section className={styles.observation} aria-labelledby="observation-heading">
        <figure>
          <Image
            src={fieldImage.src}
            alt={fieldImage.alt}
            fill
            sizes="(max-width: 800px) 100vw, (max-width: 1440px) 58vw, 835px"
            style={{
              objectPosition: `${fieldImage.focalPoint?.x ?? 50}% ${fieldImage.focalPoint?.y ?? 50}%`,
            }}
          />
          <figcaption>FIELD NOTE / ALTIPLANO ROAD</figcaption>
        </figure>
        <div>
          <p>Working belief</p>
          <h2>The in-between moments are part of the expedition.</h2>
          <p>
            Roads, weather, roadside meals, border crossings and changes of
            vehicle make a continuous caravan tangible. They are not edited out
            to create a polished travel fantasy.
          </p>
        </div>
      </section>

      <section className={styles.principles} aria-labelledby="principles-heading">
        <header>
          <p>Operating principles / what remains visible</p>
          <h2 id="principles-heading">Practical, authored, alive.</h2>
        </header>
        <ol>
          {principles.map((principle) => (
            <li key={principle.number}>
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.action} aria-labelledby="about-action-heading">
        <h2 id="about-action-heading">Begin with the first route.</h2>
        <div>
          <Link href="/journeys/caravans/andean-caravan">Explore the Andean Caravan <Arrow /></Link>
          <Link href={contactHref()}>
            Ask a question <Arrow direction="up-right" />
          </Link>
        </div>
      </section>
    </main>
  );
}
