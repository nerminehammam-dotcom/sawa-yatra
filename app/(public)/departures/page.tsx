import type { Metadata } from "next";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { DepartureCard } from "@/components/departures/DepartureCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { andeanCaravanSections } from "@/content/andean-caravan";
import {
  andeanCaravanHeroImage,
  getAndeanCaravanImage,
} from "@/content/andean-caravan-images";

import styles from "./departures.module.css";

export const metadata: Metadata = createPageMetadata("/departures");

const publicDate =
  "February–April 2028 · exact dates announced when the route is secured.";

function displayValue(value: unknown, fallback: string): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const entries = value.filter(
      (entry): entry is string | number =>
        typeof entry === "string" || typeof entry === "number",
    );
    return entries.length > 0 ? entries.join(" · ") : fallback;
  }

  if (value && typeof value === "object") {
    for (const key of ["publicLabel", "label", "summary", "text", "name"]) {
      const candidate = (value as Record<string, unknown>)[key];
      if (typeof candidate === "string") {
        return candidate;
      }
    }
  }

  return fallback;
}

export default function DeparturesPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        className={styles.hero}
        ground="ink"
        eyebrow="Departures · Signature Caravan 01"
        title="One journey through the Andes. Nine ways to join it."
        titleClassName={styles.heroTitle}
        intro={
          <div className={styles.heroIntro}>
            <p>
              The Andean Caravan is one moving journey from the Pacific coast
              of Peru to the end of the road in Patagonia—and then by a
              different northbound return to the final flight home.
            </p>
            <p className={styles.publicDate}>{publicDate}</p>
          </div>
        }
        actions={
          <>
            <ButtonLink href="/departures/the-andean-caravan">
              See the whole Caravan
            </ButtonLink>
            <ButtonLink
              href="/departures/desert-coast"
              variant="secondary"
              className={styles.heroSecondary}
            >
              Start with section 01
            </ButtonLink>
          </>
        }
        media={
          <RisoArtwork
            asset={andeanCaravanHeroImage}
            aspectRatio="hero"
            sizes="(max-width: 639px) 100vw, 54vw"
            priority
          />
        }
      />

      <nav className={styles.routeNavigator} aria-label="Andean Caravan sections">
        <Container className={styles.routeTrack}>
          <Link className={styles.routeStart} href="/departures#whole-caravan-heading">
            <span>All</span>
            <strong>71 days</strong>
          </Link>
          {andeanCaravanSections.map((section) => (
            <Link key={section.id} href={`/departures#section-${section.sectionNumber}`}>
              <span>{String(section.sectionNumber).padStart(2, "0")}</span>
              <strong>{section.title}</strong>
            </Link>
          ))}
        </Container>
      </nav>

      <Section ground="cream" aria-labelledby="caravan-proposition-heading">
        <Container className={styles.propositionGrid}>
          <div className={styles.propositionHeading}>
            <Eyebrow tone="accent">The Andean Caravan</Eyebrow>
            <h2 id="caravan-proposition-heading">
              Seventy-one days is a long time. You do not have to give us all
              of them.
            </h2>
          </div>
          <div className={styles.propositionCopy}>
            <p>
              The Caravan is built to be joined and left. At designated gates
              along its length, travellers can step on or step off. Choose one
              section, connect several consecutive sections, or travel all
              nine.
            </p>
            <p>
              Every section is a complete journey in itself. The Caravan is
              what happens if you stay on.
            </p>
          </div>
          <dl className={styles.quickFacts}>
            <div>
              <dt>Route</dt>
              <dd>Peru · Bolivia · Chile</dd>
            </div>
            <div>
              <dt>Structure</dt>
              <dd>Nine consecutive sections</dd>
            </div>
            <div>
              <dt>Complete journey</dt>
              <dd>71 days</dd>
            </div>
            <div>
              <dt>Travel</dt>
              <dd>Four short flights in 71 days</dd>
            </div>
          </dl>
        </Container>
      </Section>

      <Section ground="butter" aria-labelledby="whole-caravan-heading">
        <Container>
          <div className={styles.sectionHeading}>
            <Eyebrow tone="accent">Travel the whole Caravan</Eyebrow>
            <h2 id="whole-caravan-heading">The whole length of the Andes. Once a year.</h2>
            <p>
              The Pacific coast, desert, altiplano, salt and Patagonian ice—one
              continuous north-to-south journey and a different scenic return
              to Coyhaique/Balmaceda.
            </p>
          </div>
          <DepartureCard
            className={styles.completeCard}
            href="/departures/the-andean-caravan"
            eyebrow="Complete Caravan"
            title="The Andean Caravan"
            route="Lima, Peru → Villa O’Higgins, Chile → Balmaceda"
            duration="71 days"
            dateWindow="February–April 2028"
            groupSize="12 most points · up to 16 on some sections"
            price="Price on request"
            asset={andeanCaravanHeroImage}
            featured
          />
        </Container>
      </Section>

      <Section ground="cream" aria-labelledby="sections-heading">
        <Container>
          <div className={styles.sectionsHeader}>
            <div className={styles.sectionHeading}>
              <Eyebrow tone="accent">Choose where to join</Eyebrow>
              <h2 id="sections-heading">Nine complete journeys. One moving route.</h2>
            </div>
            <p>
              Join and leave at designated gates. Sections may be travelled on
              their own or combined in consecutive order.
            </p>
          </div>
          <ol className={styles.sectionGrid}>
            {andeanCaravanSections.map((section, index) => (
              <li id={`section-${section.sectionNumber}`} key={section.id}>
                <DepartureCard
                  href={`/departures/${section.slug}`}
                  title={section.title}
                  route={displayValue(section.route, "Route details")}
                  duration={`${section.durationDays} days`}
                  dateWindow={displayValue(
                    section.publicDateWindow,
                    "February–April 2028",
                  )}
                  groupSize={displayValue(section.group, "Group maximum varies")}
                  price={displayValue(section.price, "Price on request")}
                  sequence={String(section.sectionNumber).padStart(2, "0")}
                  asset={getAndeanCaravanImage(section.slug)}
                  priority={index === 0}
                />
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section ground="olive" aria-labelledby="why-once-heading">
        <Container className={styles.whyGrid}>
          <div className={styles.sectionHeading}>
            <Eyebrow>Why it leaves once</Eyebrow>
            <h2 id="why-once-heading">The calendar is not a preference. It is arithmetic.</h2>
          </div>
          <p className={styles.whyLead}>
            The Salar de Uyuni becomes a mirror when water lies on the salt.
            The lenga forests of Patagonia turn red and gold in early April.
            The last boats cross Lake O’Higgins before winter closes the route.
          </p>
          <ol className={styles.principles}>
            <li>
              <span>01</span>
              <h3>It moves on the ground</h3>
              <p>
                Four short flights in 71 days. Everything else is road, rail
                or water because the ground between places is part of the
                journey.
              </p>
            </li>
            <li>
              <span>02</span>
              <h3>It climbs deliberately</h3>
              <p>
                The route rises from sea level to 4,900 metres over five weeks,
                with a restorative descent into the Yungas cloud forest.
              </p>
            </li>
            <li>
              <span>03</span>
              <h3>It ends at an actual end</h3>
              <p>
                Villa O’Higgins is where the Carretera Austral stops. The
                Caravan then returns north by a different scenic route to its
                final flight gateway.
              </p>
            </li>
          </ol>
        </Container>
      </Section>

      <Section ground="butter" aria-labelledby="conditions-heading">
        <Container className={styles.conditionsGrid}>
          <div className={styles.sectionHeading}>
            <Eyebrow tone="accent">Honest conditions</Eyebrow>
            <h2 id="conditions-heading">The journey includes places where luxury does not exist.</h2>
          </div>
          <div className={styles.conditionsCopy}>
            <p>
              On the Lagunas route, accommodation means simple high-altitude
              refuges, shared bathrooms and limited heating. On Amantaní,
              guests sleep in a family home. Tortel has no streets, and luggage
              must be carried along its boardwalks and stairs.
            </p>
            <p>
              These are not hidden compromises. They are part of the journey,
              and we explain them before anyone books.
            </p>
            <ButtonLink href="/departures/the-andean-caravan">
              Explore the complete journey
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </main>
  );
}
