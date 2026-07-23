import { createPageMetadata } from "@/app/_metadata";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { DepartureCard } from "@/components/departures/DepartureCard";
import { ArchetypeChip } from "@/components/journeys/ArchetypeChip";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ContentStatusLabel } from "@/components/ui/ContentStatusLabel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { archetypes } from "@/content/archetypes";
import { andeanCaravanSections } from "@/content/andean-caravan";
import { getAndeanCaravanImage } from "@/content/andean-caravan-images";
import { andeanCaravanHeroImage } from "@/content/andean-caravan-images";
import { homeContent } from "@/content/site";

import styles from "./home.module.css";

export const metadata = createPageMetadata("/");

const featuredAndeanSections = andeanCaravanSections.filter((section) =>
  ["desert-coast", "the-mirror", "the-end-of-the-road"].includes(
    section.slug,
  ),
);

function displayDepartureValue(value: unknown, fallback: string): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    for (const key of ["publicLabel", "label", "summary", "text"]) {
      const candidate = (value as Record<string, unknown>)[key];
      if (typeof candidate === "string") return candidate;
    }
  }

  return fallback;
}

function HomeHeroTitle() {
  const accent = homeContent.hero.accentWord;
  const [beforeAccent, afterAccent] = homeContent.hero.title.split(accent);

  return (
    <>
      {beforeAccent}
      <em className={styles.heroAccent}>{accent}</em>
      {afterAccent}
    </>
  );
}

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        ground="ink"
        eyebrow={homeContent.hero.eyebrow}
        title={<HomeHeroTitle />}
        intro={<p>{homeContent.hero.lead}</p>}
        actions={
          <>
            <ButtonLink href={homeContent.hero.primaryAction.href}>
              {homeContent.hero.primaryAction.label}
            </ButtonLink>
            <ButtonLink
              href={homeContent.hero.secondaryAction.href}
              variant="secondary"
              className={styles.heroSecondary}
            >
              {homeContent.hero.secondaryAction.label}
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

      <Section ground="cream" aria-labelledby="positioning-heading">
        <Container>
          <div className={styles.sectionHeading}>
            <Eyebrow tone="accent">{homeContent.positioning.eyebrow}</Eyebrow>
            <h2 id="positioning-heading">{homeContent.positioning.title}</h2>
          </div>
          <ol className={styles.pillarGrid}>
            {homeContent.positioning.pillars.map((pillar, index) => (
              <li className={styles.pillar} key={pillar.id}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ContentStatusLabel status={pillar.contentStatus} />
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section ground="butter" aria-labelledby="home-how-heading">
        <Container>
          <div className={styles.splitHeading}>
            <div className={styles.sectionHeading}>
              <Eyebrow tone="accent">{homeContent.howItWorks.eyebrow}</Eyebrow>
              <h2 id="home-how-heading">{homeContent.howItWorks.title}</h2>
            </div>
            <ButtonLink
              href={homeContent.howItWorks.action.href}
              variant="secondary"
            >
              {homeContent.howItWorks.action.label}
            </ButtonLink>
          </div>
          <ol className={styles.stepList}>
            {homeContent.howItWorks.steps.map((step) => (
              <li className={styles.step} key={step.id}>
                <span className={styles.stepNumber}>{step.number}</span>
                <div className={styles.stepCopy}>
                  <ContentStatusLabel status={step.contentStatus} />
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section
        ground="cream"
        aria-label={`${homeContent.travelSelfHook.eyebrow} and ${homeContent.departuresPreview.eyebrow}`}
      >
        <Container className={styles.featureStack}>
          <section
            className={styles.travelSelfPanel}
            aria-labelledby="travel-self-hook-heading"
          >
            <div className={styles.travelSelfCopy}>
              <div className={styles.statusLine}>
                <ContentStatusLabel status={homeContent.travelSelfHook.contentStatus} />
              </div>
              <Eyebrow tone="accent">{homeContent.travelSelfHook.eyebrow}</Eyebrow>
              <h2 id="travel-self-hook-heading">{homeContent.travelSelfHook.title}</h2>
              <p className={styles.lead}>{homeContent.travelSelfHook.body}</p>
              <ButtonLink href={homeContent.travelSelfHook.action.href}>
                {homeContent.travelSelfHook.action.label}
              </ButtonLink>
            </div>
            <div
              className={styles.chipField}
              aria-label={`${homeContent.travelSelfHook.eyebrow} archetypes`}
            >
              <ContentStatusLabel status="DRAFT" />
              <div className={styles.chipList}>
                {archetypes.map((archetype) => (
                  <ArchetypeChip key={archetype.id}>{archetype.name}</ArchetypeChip>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.departures} aria-labelledby="departures-heading">
            <div className={styles.splitHeading}>
              <div className={styles.sectionHeading}>
                <Eyebrow tone="accent">{homeContent.departuresPreview.eyebrow}</Eyebrow>
                <h2 id="departures-heading">{homeContent.departuresPreview.title}</h2>
              </div>
              <ButtonLink
                href={homeContent.departuresPreview.action.href}
                variant="secondary"
              >
                {homeContent.departuresPreview.action.label}
              </ButtonLink>
            </div>
            <div className={styles.journeyGrid}>
              {featuredAndeanSections.map((section) => (
                <div className={styles.journeyItem} key={section.id}>
                  <DepartureCard
                    href={`/departures/${section.slug}`}
                    title={section.title}
                    route={displayDepartureValue(section.route, "Andean route")}
                    duration={`${section.durationDays} days`}
                    dateWindow={displayDepartureValue(
                      section.publicDateWindow,
                      "February–April 2028",
                    )}
                    groupSize={displayDepartureValue(
                      section.group,
                      "Group maximum varies",
                    )}
                    price={displayDepartureValue(
                      section.price,
                      "Price on request",
                    )}
                    sequence={String(section.sectionNumber).padStart(2, "0")}
                    asset={getAndeanCaravanImage(section.slug)}
                  />
                </div>
              ))}
            </div>
          </section>
        </Container>
      </Section>

      <Section ground="brick" aria-labelledby="membership-band-heading">
        <Container className={styles.membershipBand}>
          <div className={styles.membershipCopy}>
            <div className={styles.statusLine}>
              <ContentStatusLabel status={homeContent.membershipBand.contentStatus} />
            </div>
            <Eyebrow>{homeContent.membershipBand.eyebrow}</Eyebrow>
            <h2 id="membership-band-heading">{homeContent.membershipBand.title}</h2>
            <div className={styles.mechanismLine}>
              <ContentStatusLabel status="PLACEHOLDER" />
              <p>{homeContent.membershipBand.safetyMechanismLine}</p>
            </div>
          </div>
          <ButtonLink
            href={homeContent.membershipBand.action.href}
            surface="deep"
          >
            {homeContent.membershipBand.action.label}
          </ButtonLink>
        </Container>
      </Section>
    </main>
  );
}
