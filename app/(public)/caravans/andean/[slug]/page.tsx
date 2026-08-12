import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { JourneyGallery } from "@/components/departures/JourneyGallery";
import { Accordion } from "@/components/ui/Accordion";
import { Arrow } from "@/components/ui/Arrow";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactStrip } from "@/components/ui/FactStrip";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import {
  getCanonicalCaravanGallery,
  getCanonicalCaravanHeroImage,
  type CanonicalCaravanImageSlug,
} from "@/content/andean-caravan-images";
import {
  andeanCaravanEditorial,
  andeanCaravanEnquiry,
} from "@/content/andean-caravan-editorial";
import {
  canonicalProductSlugs,
  canonicalSectionSlugs,
  getCanonicalSectionPageData,
  getCanonicalStoneRoadPageData,
  isCanonicalProductSlug,
  type CanonicalSectionPageData,
  type CanonicalSectionSlug,
  type PublicDayView,
} from "@/content/caravan/page-data";
import { siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

import styles from "../../../departures/[slug]/journey.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function canonicalPath(slug: string): string {
  return slug === "the-stone-road"
    ? "/journeys/caravans/andean-caravan/sea-to-stone"
    : `/journeys/caravans/andean-caravan/${slug}`;
}

function imageSlug(slug: string): CanonicalCaravanImageSlug {
  return slug as CanonicalCaravanImageSlug;
}

function dayDetails(day: PublicDayView) {
  return (
    <div>
      <p><strong>{day.route}</strong></p>
      <p>{day.description.text}</p>
      {day.free_time ? <p>{day.free_time.text}</p> : null}
      <dl>
        <div><dt>Movement</dt><dd>{day.movement}</dd></div>
        <div><dt>Sleep</dt><dd>{day.sleep}</dd></div>
        <div><dt>Effort</dt><dd>{day.effort_level}</dd></div>
        <div><dt>Environment</dt><dd>{day.operating_environment}</dd></div>
        <div>
          <dt>Sleeping altitude</dt>
          <dd>{day.sleep_altitude.display ?? "Altitude pending contract"}</dd>
        </div>
      </dl>
      {day.conditional_items.map((item) => (
        <p key={item.label}><strong>{item.label}:</strong> {item.text}</p>
      ))}
    </div>
  );
}

function sectionFacts(data: CanonicalSectionPageData) {
  const { section, gateFrom, gateTo } = data;
  const route = section.section_id === "04"
    ? `${gateFrom.name} → ${gateTo.name} → ${gateFrom.name}`
    : `${gateFrom.name} → ${gateTo.name}`;

  return [
    { label: "Duration", value: `${section.day_end - section.day_start + 1} days` },
    { label: "Route", value: route },
    { label: "Days", value: `${section.day_start}–${section.day_end}` },
    { label: "Group maximum", value: String(section.group_max) },
    { label: "Route maximum", value: section.route_max_altitude.display },
    { label: "Season", value: section.season_public.text },
  ];
}

export function generateStaticParams() {
  return canonicalProductSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isCanonicalProductSlug(slug)) notFound();

  const title =
    slug === "the-stone-road"
      ? `The Stone Road | Andean Caravan | ${siteConfig.name}`
      : `${getCanonicalSectionPageData(slug as CanonicalSectionSlug).section.name} | Andean Caravan | ${siteConfig.name}`;

  return {
    title: { absolute: title },
    alternates: { canonical: absoluteUrl(canonicalPath(slug)) },
  };
}

export default async function CanonicalCaravanProductPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isCanonicalProductSlug(slug)) notFound();

  const isStoneRoad = slug === "the-stone-road";
  const stoneRoad = isStoneRoad ? getCanonicalStoneRoadPageData() : null;
  const data = isStoneRoad
    ? getCanonicalSectionPageData("sea-to-stone")
    : getCanonicalSectionPageData(slug as CanonicalSectionSlug);
  const title = stoneRoad?.product.name ?? data.section.name;
  const days = stoneRoad?.days ?? data.days;
  const stages = stoneRoad ? [stoneRoad.stage] : data.stages;
  const gateFrom = stoneRoad?.gateFrom ?? data.gateFrom;
  const gateTo = stoneRoad?.gateTo ?? data.gateTo;
  const duration = days.length;
  const gallerySlug = imageSlug(slug);
  const editorial = andeanCaravanEditorial[gallerySlug];
  const heroImage = getCanonicalCaravanHeroImage(gallerySlug);
  const galleryImages = getCanonicalCaravanGallery(gallerySlug).filter(
    (asset) => asset.src !== heroImage.src,
  );
  const sectionIndex = canonicalSectionSlugs.indexOf(data.slug);
  const previousSlug = sectionIndex > 0 ? canonicalSectionSlugs[sectionIndex - 1] : undefined;
  const nextSlug = sectionIndex < canonicalSectionSlugs.length - 1
    ? canonicalSectionSlugs[sectionIndex + 1]
    : undefined;

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        className={styles.hero}
        mediaLayout="split"
        mobileContentFirst
        ground="cream"
        eyebrow={
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/journeys/caravans">Caravans</Link>
            <span aria-hidden="true">›</span>
            <Link href="/journeys/caravans/andean-caravan">The Andean Caravan</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{title}</span>
          </nav>
        }
        title={title}
        titleClassName={styles.heroTitle}
        intro={
          <div className={styles.heroIntro}>
            {data.section.subline && !isStoneRoad ? <p>{data.section.subline}</p> : null}
            <p>{duration} days · {gateFrom.name} to {gateTo.name} · Days {days[0]?.day}–{days.at(-1)?.day}</p>
            <p>{editorial.proposition}</p>
          </div>
        }
        facts={
          <FactStrip
            label={`${title} at a glance`}
            facts={
              isStoneRoad
                ? [
                    { label: "Duration", value: `${duration} days` },
                    { label: "Route", value: `${gateFrom.name} → ${gateTo.name}` },
                    { label: "Days", value: "16–23" },
                    { label: "Group maximum", value: String(data.section.group_max) },
                    { label: "Season", value: data.section.season_public.text },
                  ]
                : sectionFacts(data)
            }
          />
        }
        media={
          <RisoArtwork
            asset={heroImage}
            aspectRatio="hero"
            sizes="(max-width: 639px) 100vw, 54vw"
            priority
          />
        }
      />

      {!isStoneRoad && data.section.declared_load_exception ? (
        <Section
          className={`${styles.copySection} ${styles.roseCopySection}`}
          ground="cream"
          aria-labelledby="declared-load-heading"
        >
          <Container className={styles.copyGrid}>
            <div className={styles.sectionHeading}>
              <Eyebrow kind="decision" tone="accent">Read before continuing</Eyebrow>
              <h2 id="declared-load-heading">{data.section.declared_load_exception.name}</h2>
            </div>
            <div className={styles.copyBody}>
              <p>
                Water, crust, cold and border conditions choose the exact line;
                the itinerary keeps those limits visible before you decide.
              </p>
              <p>{data.section.declared_load_exception.disclosure.text}</p>
              <p>{data.section.declared_load_exception.structural_reason.text}</p>
              <h3>Eleven-night acclimatisation progression</h3>
              <ol>
                {data.section.acclimatisation_ladder.map((night, index) => (
                  <li key={`${night.day}-${index}`}>
                    Night {index + 1}: {night.display ?? "Altitude pending contract"}
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section
        className={styles.orientationSection}
        ground="cream"
        aria-labelledby="orientation-heading"
      >
        <Container className={styles.orientationGrid}>
          <div className={styles.sectionHeading}>
            <Eyebrow kind="decision" tone="accent">Route orientation</Eyebrow>
            <h2 id="orientation-heading">{gateFrom.name} to {gateTo.name}.</h2>
            <p>
              {isStoneRoad
                ? "The Stone Road sits inside Sea to Stone as a short-form exception."
                : `Section ${data.section.section_id} is one consecutive part of the four-section Caravan.`}
            </p>
          </div>
          <div className={styles.orientationAction}>
            <p>
              See how this section connects with every joining gate, flight,
              rail journey, road and ferry across the complete route.
            </p>
            <Link href="/journeys/caravans/andean-caravan#full-route-map">
              Open the full route atlas <Arrow />
            </Link>
          </div>
        </Container>
      </Section>

      <Section className={styles.copySection} ground="olive" aria-labelledby="character-heading">
        <Container className={styles.copyGrid}>
          <div className={styles.sectionHeading}>
            <Eyebrow tone="inherit" className={styles.oliveEyebrow}>Section character</Eyebrow>
            <h2 id="character-heading">{editorial.characterTitle}</h2>
          </div>
          <div className={styles.copyBody}>
            <p>{editorial.character}</p>
          </div>
        </Container>
      </Section>

      {!isStoneRoad ? (
        <Section className={styles.copySection} ground="cream" aria-labelledby="demands-heading">
          <Container className={styles.copyGrid}>
            <div className={styles.sectionHeading}>
              <Eyebrow kind="decision" tone="accent">Before you choose</Eyebrow>
              <h2 id="demands-heading">What this section asks of travellers.</h2>
            </div>
            <div className={styles.copyBody}>
              {data.section.demands.map((demand) => <p key={demand.text}>{demand.text}</p>)}
            </div>
          </Container>
        </Section>
      ) : null}

      <JourneyGallery
        journeySlug={slug}
        images={galleryImages}
      />

      <Section className={styles.movementsSection} ground="cream" aria-labelledby="itinerary-heading">
        <Container>
          <div className={styles.sectionHeadingInline}>
            <Eyebrow kind="decision" tone="accent">Stage-first itinerary</Eyebrow>
            <h2 id="itinerary-heading">Open a stage, then a day.</h2>
          </div>
          <Accordion
            initiallyOpen={stages[0] ? [stages[0].id] : []}
            items={stages.map((stage) => {
              const stageDays = days.filter((day) => day.stage_id === stage.id);
              return {
                id: stage.id,
                question: `${stage.name} · Days ${stage.day_start}–${stage.day_end}`,
                answer: (
                  <Accordion
                    allowMultiple
                    items={stageDays.map((day) => ({
                      id: day.id,
                      question: `Day ${day.day} · ${day.title}`,
                      answer: dayDetails(day),
                    }))}
                  />
                ),
              };
            })}
          />
        </Container>
      </Section>

      <Section className={styles.copySection} ground="cream" aria-labelledby="practical-heading">
        <Container className={styles.copyGrid}>
          <div className={styles.sectionHeading}>
            <Eyebrow kind="decision" tone="accent">Travel, sleep and joining</Eyebrow>
            <h2 id="practical-heading">The practical conditions.</h2>
          </div>
          <div className={styles.copyBody}>
            <p><strong>Joining:</strong> {data.section.join_rule.text}</p>
            <p><strong>Sleep:</strong> {data.section.sleep_standard.text}</p>
            <p><strong>Gate arrival:</strong> {gateFrom.arrival_rule.text}</p>
            {data.section.conditional_items.map((item) => (
              <p key={item.id}>
                <strong>{item.controller}:</strong> {item.fallback}. {item.remedy}.
              </p>
            ))}
          </div>
        </Container>
      </Section>

      <Section className={styles.adjacentSection} ground="cream" aria-label="Adjacent Caravan sections">
        <Container className={styles.adjacentLinks}>
          <Link href="/journeys/caravans/andean-caravan"><span>All sections</span><strong>The Andean Caravan</strong></Link>
          {isStoneRoad ? (
            <Link href="/journeys/caravans/andean-caravan/sea-to-stone"><span>Parent section</span><strong>01 · Sea to Stone</strong></Link>
          ) : null}
          {!isStoneRoad && previousSlug ? (
            <Link href={`/journeys/caravans/andean-caravan/${previousSlug}`}><span>Previous section</span><strong>{getCanonicalSectionPageData(previousSlug).section.name}</strong></Link>
          ) : null}
          {!isStoneRoad && nextSlug ? (
            <Link href={`/journeys/caravans/andean-caravan/${nextSlug}`}><span>Next section</span><strong>{getCanonicalSectionPageData(nextSlug).section.name}</strong></Link>
          ) : null}
        </Container>
      </Section>

      <Section className={styles.interestSection} ground="brick" aria-labelledby="enquiry-heading">
        <Container className={styles.interestGrid}>
          <div className={styles.sectionHeading}>
            <Eyebrow kind="decision" tone="inherit" className={styles.deepEyebrow}>
              {andeanCaravanEnquiry.eyebrow}
            </Eyebrow>
            <h2 id="enquiry-heading">{andeanCaravanEnquiry.heading}</h2>
            <p>{andeanCaravanEnquiry.invitation}</p>
            <p>{data.section.cta.text}</p>
          </div>
          <div className={styles.interestActions}>
            <Link className={styles.askLink} href="/register-interest">
              Register your interest <Arrow />
            </Link>
            <Link className={styles.secondaryAskLink} href="/journeys/caravans/andean-caravan#all-sections">
              Compare all four sections <Arrow />
            </Link>
            <p>{andeanCaravanEnquiry.status}</p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
