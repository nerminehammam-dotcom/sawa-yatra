import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createPageMetadata } from "@/app/_metadata";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { DepartureCard } from "@/components/departures/DepartureCard";
import { CaravanRouteMap } from "@/components/departures/CaravanRouteMap";
import { JourneyGallery } from "@/components/departures/JourneyGallery";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import {
  andeanCaravanSectionBySlug,
  andeanCaravanSections,
  type AndeanCaravanSection,
  type AndeanCaravanSectionSlug,
} from "@/content/andean-caravan";
import {
  andeanCaravanHeroImage,
  getAndeanCaravanGallery,
  getAndeanCaravanImage,
} from "@/content/andean-caravan-images";
import {
  andeanCaravanCountries,
  andeanCaravanRouteStops,
} from "@/content/andean-caravan-route";
import { siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

import styles from "./journey.module.css";

const COMPLETE_SLUG = "the-andean-caravan";
const publicDate =
  "February–April 2028 · exact dates announced when the route is secured.";

export const dynamicParams = false;

interface JourneyPageProps {
  params: Promise<{ slug: string }>;
}

function displayValue(value: unknown, fallback: string): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const strings = value.filter(
      (entry): entry is string | number =>
        typeof entry === "string" || typeof entry === "number",
    );
    return strings.length > 0 ? strings.join(" · ") : fallback;
  }

  if (value && typeof value === "object") {
    for (const key of ["publicLabel", "label", "summary", "text", "name"]) {
      const candidate = (value as Record<string, unknown>)[key];
      if (typeof candidate === "string") return candidate;
    }
  }

  return fallback;
}

function textList(value: unknown): readonly string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    return value.flatMap((entry) => textList(entry));
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const preferredKeys = ["body", "copy", "paragraphs", "items", "text"];
    const preferred = preferredKeys.flatMap((key) => textList(record[key]));
    if (preferred.length > 0) return preferred;
  }
  return [];
}

function getSection(slug: string): AndeanCaravanSection | undefined {
  return andeanCaravanSectionBySlug[slug as AndeanCaravanSectionSlug];
}

function FactGrid({
  label,
  facts,
}: {
  label: string;
  facts: ReadonlyArray<{ label: string; value: string }>;
}) {
  return (
    <dl className={styles.facts} aria-label={label}>
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function CopySection({
  eyebrow,
  title,
  paragraphs,
  ground = "cream",
  tone = "plain",
}: {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  ground?: "cream" | "olive";
  tone?: "plain" | "blue" | "rose";
}) {
  if (paragraphs.length === 0) return null;
  const headingId = `${eyebrow
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "")}-heading`;

  return (
    <Section
      className={`${styles.copySection} ${tone === "blue" ? styles.blueCopySection : tone === "rose" ? styles.roseCopySection : ""}`}
      ground={ground}
      aria-labelledby={headingId}
    >
      <Container className={styles.copyGrid}>
        <div className={styles.sectionHeading}>
          <Eyebrow
            tone={ground === "olive" ? "inherit" : "accent"}
            className={ground === "olive" ? styles.oliveEyebrow : undefined}
          >
            {eyebrow}
          </Eyebrow>
          <h2 id={headingId}>{title}</h2>
        </div>
        <div className={styles.copyBody}>
          {paragraphs.map((paragraph, index) => (
            <p key={`${eyebrow}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function JourneyBreadcrumbs({ sectionTitle }: { sectionTitle?: string }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span aria-hidden="true">›</span>
      <Link href="/departures">Departures</Link>
      <span aria-hidden="true">›</span>
      {sectionTitle ? (
        <>
          <Link href="/departures/the-andean-caravan">The Andean Caravan</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{sectionTitle}</span>
        </>
      ) : (
        <span aria-current="page">The Andean Caravan</span>
      )}
    </nav>
  );
}

function Wayfinding({ title }: { title: string }) {
  return (
    <Section className={styles.wayfindingSection} ground="cream" aria-label="Journey navigation">
      <Container className={styles.wayfindingLinks}>
        <Link href="/departures#all-sections">Back to all sections</Link>
        <Link href="/joining-points">Joining & Leaving Points</Link>
        <Link href="/caravans#caravan-route-map-heading">Full route map</Link>
        <a href={`mailto:nerminehammam@gmail.com?subject=${encodeURIComponent(`Sawayatra section: ${title}`)}`}>
          Ask about this section
        </a>
      </Container>
    </Section>
  );
}

function InterestSection({ title }: { title: string }) {
  return (
    <Section
      className={styles.interestSection}
      ground="brick"
      aria-labelledby="journey-interest-heading"
      data-dense="true"
    >
      <Container className={styles.interestGrid}>
        <div className={styles.sectionHeading}>
          <Eyebrow kind="decision" tone="inherit" className={styles.deepEyebrow}>Ask</Eyebrow>
          <h2 id="journey-interest-heading">Ask about this section.</h2>
          <p>Your question opens in your email app. Nothing is submitted or stored on this site.</p>
        </div>
        <div className={styles.formPanel}>
          <a
            className={styles.askLink}
            href={`mailto:nerminehammam@gmail.com?subject=${encodeURIComponent(`Sawayatra section: ${title}`)}`}
          >
            Email a question →
          </a>
        </div>
      </Container>
    </Section>
  );
}

function CompleteCaravanPage() {
  return (
    <>
      <PageHero
        className={styles.hero}
        mediaLayout="split"
        ground="cream"
        eyebrow={
          <JourneyBreadcrumbs />
        }
        eyebrowKind="decision"
        title="The whole length of the Andes. Once a year."
        titleClassName={styles.completeHeroTitle}
        intro={
          <div className={styles.heroIntro}>
            <p>
              Seventy-one days. Three countries. The Pacific coast, desert,
              altiplano, salt and Patagonian ice.
            </p>
            <p className={styles.publicDate}>{publicDate}</p>
          </div>
        }
        actions={
          <ButtonLink href="/departures/desert-coast" className={styles.heroAction}>
            Explore section 01 · Desert Coast
          </ButtonLink>
        }
        media={
          <RisoArtwork
            asset={andeanCaravanHeroImage}
            aspectRatio="hero"
            sizes="100vw"
            priority
          />
        }
      />

      <Section
        className={styles.factsSection}
        ground="cream"
        aria-labelledby="complete-facts-heading"
      >
        <Container>
          <div className={styles.sectionHeadingInline}>
            <Eyebrow kind="decision" tone="accent">Complete Caravan</Eyebrow>
            <h2 id="complete-facts-heading">One continuous north-to-south journey.</h2>
          </div>
          <FactGrid
            label="Complete Caravan facts"
            facts={[
              { label: "Duration", value: "71 days" },
              { label: "Countries", value: "Peru · Bolivia · Chile" },
              { label: "Direction", value: "North to south" },
              {
                label: "Group",
                value: "12 most points · up to 16 on some sections",
              },
              { label: "Flights", value: "Four short flights" },
              { label: "Price", value: "Price on request" },
            ]}
          />
        </Container>
      </Section>

      <Section
        className={styles.routeSection}
        ground="cream"
        aria-labelledby="movements-heading"
      >
        <Container>
          <div className={styles.routeHeader}>
            <div className={styles.sectionHeading}>
              <Eyebrow kind="decision" tone="accent">The nine movements</Eyebrow>
              <h2 id="movements-heading">From the Pacific to the end of the road.</h2>
            </div>
            <div className={styles.routeOverview}>
              <p className={styles.routeOverviewLabel}>Route at a glance</p>
              <dl
                className={styles.countryRoutes}
                aria-label="Complete Caravan route overview"
              >
                {andeanCaravanCountries.map((country) => (
                  <div key={country} data-country={country.toLowerCase()}>
                    <dt>{country}</dt>
                    <dd>
                      {andeanCaravanRouteStops
                        .filter((stop) => stop.country === country)
                        .map((stop) => stop.name)
                        .join(" → ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <CaravanRouteMap />
        </Container>
      </Section>

      <Section
        className={styles.movementsSection}
        ground="cream"
        aria-labelledby="join-sections-heading"
      >
        <Container>
          <div className={styles.movementsHeader}>
            <div className={styles.sectionHeading}>
              <Eyebrow kind="decision" tone="accent">Choose where to join</Eyebrow>
              <h2 id="join-sections-heading">
                Nine complete sections. One moving Caravan.
              </h2>
            </div>
            <p>
              Join and leave at designated gates. Travel one section or combine
              consecutive sections along the route.
            </p>
          </div>
          <ol className={styles.movementGrid}>
            {andeanCaravanSections.map((section) => (
              <li key={section.id}>
                <DepartureCard
                  href={`/departures/${section.slug}`}
                  title={section.title}
                  route={displayValue(section.route, "Andean route")}
                  duration={`${section.durationDays} days`}
                  dateWindow={displayValue(
                    section.publicDateWindow,
                    "February–April 2028",
                  )}
                  groupSize={displayValue(section.group, "Group maximum varies")}
                  price={displayValue(section.price, "Price on request")}
                  sequence={String(section.sectionNumber).padStart(2, "0")}
                  asset={getAndeanCaravanImage(section.slug)}
                  tone={
                    section.countries.length > 1
                      ? "crossing"
                      : section.countries[0] === "Bolivia"
                        ? "bolivia"
                        : section.countries[0] === "Chile"
                          ? "chile"
                          : "peru"
                  }
                />
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <CopySection
        eyebrow="The whole journey"
        title="Nine movements, one altitude curve and one changing group."
        paragraphs={[
          "The complete journey is not nine holidays placed end to end. It has one altitude curve, one seasonal logic and one changing group. People will join and leave along the way. Those who stay experience the Caravan gathering and releasing travellers as the landscape changes.",
          "It moves overland—by van, Land Cruiser, train, boat and barge—with only four short flights, because the point is the ground between places, not the places alone.",
        ]}
      />

      <CopySection
        eyebrow="Why it leaves once"
        title="The calendar is arithmetic."
        ground="olive"
        paragraphs={[
          "The Salar de Uyuni becomes a mirror when water lies on the salt. The lenga forests of Patagonia turn red and gold in early April. The last boats cross Lake O’Higgins before winter closes the route.",
          "Move the Caravan several weeks in either direction and one of these disappears.",
        ]}
      />

      <CopySection
        eyebrow="The Patagonian culmination"
        title="The road ends. The journey does not simply reverse."
        tone="blue"
        paragraphs={[
          "Villa O’Higgins is the narrative culmination: the point where the Carretera Austral stops. Coyhaique/Balmaceda is the operational end and final flight gateway.",
          "Some initial retracing from Villa O’Higgins is unavoidable because there is only one road. The northbound return then changes route through Chile Chico and crosses Lago General Carrera by ferry before reaching Coyhaique/Balmaceda.",
        ]}
      />

      <CopySection
        eyebrow="Honest conditions"
        title="Some places on this route are deliberately simple."
        ground="cream"
        tone="rose"
        paragraphs={[
          "On the Lagunas route, accommodation means simple high-altitude refuges, shared bathrooms and limited heating. On Amantaní, guests sleep in a family home. Tortel has no streets, and luggage must be carried along its boardwalks and stairs.",
          "These are not hidden compromises. They are part of the journey, and we explain them before anyone books.",
        ]}
      />

      <Wayfinding title="The Andean Caravan" />
      <InterestSection title="The Andean Caravan - complete journey" />
    </>
  );
}

function SectionJourneyPage({ section }: { section: AndeanCaravanSection }) {
  const sectionIndex = andeanCaravanSections.findIndex(
    (item) => item.id === section.id,
  );
  const previous = andeanCaravanSections[sectionIndex - 1];
  const next = andeanCaravanSections[sectionIndex + 1];
  const why = textList(section.whyThisSectionExists);
  const shape = textList(section.journeyShape);
  const feature = textList(section.feature);
  const warnings = textList(section.warnings);
  const standalone = textList(section.standaloneWindows);
  const gallery = getAndeanCaravanGallery(section.slug);

  return (
    <>
      <PageHero
        className={styles.hero}
        mediaLayout="split"
        ground="cream"
        eyebrow={
          <JourneyBreadcrumbs sectionTitle={section.title} />
        }
        eyebrowKind="decision"
        title={section.title}
        titleClassName={styles.heroTitle}
        intro={
          <div className={styles.heroIntro}>
            <p>{section.promise}</p>
            <p className={styles.publicDate}>
              {displayValue(section.publicDateWindow, publicDate)}
            </p>
          </div>
        }
        media={
          <RisoArtwork
            asset={getAndeanCaravanImage(section.slug)}
            aspectRatio="hero"
            sizes="100vw"
            priority
          />
        }
      />

      <Section
        className={styles.factsSection}
        ground="cream"
        aria-labelledby="section-facts-heading"
      >
        <Container>
          <div className={styles.sectionHeadingInline}>
            <Eyebrow kind="decision" tone="accent">Section details</Eyebrow>
            <h2 id="section-facts-heading">Join here. Leave when this section ends.</h2>
          </div>
          <FactGrid
            label={`${section.title} facts`}
            facts={[
              { label: "Route", value: displayValue(section.route, "Route details") },
              { label: "Duration", value: `${section.durationDays} days` },
              {
                label: "Caravan window",
                value: displayValue(
                  section.publicDateWindow,
                  "February–April 2028",
                ),
              },
              { label: "Group", value: displayValue(section.group, "Varies") },
              { label: "Altitude", value: displayValue(section.altitude, "Varies") },
              { label: "Price", value: displayValue(section.price, "Price on request") },
            ]}
          />
        </Container>
      </Section>

      <JourneyGallery journeySlug={section.slug} images={gallery.slice(1)} />

      <CopySection
        eyebrow="Why this section exists"
        title={why[0] ?? section.promise}
        paragraphs={why.length > 1 ? why.slice(1) : [section.promise]}
      />
      <CopySection
        eyebrow="The shape of the journey"
        title="A complete journey in its own right."
        paragraphs={shape}
        tone="blue"
      />
      <CopySection
        eyebrow="What makes it distinct"
        title={feature[0] ?? "One clear reason to travel this section."}
        paragraphs={feature.length > 1 ? feature.slice(1) : feature}
      />

      {standalone.length > 0 ? (
        <CopySection
          eyebrow="Standalone season"
          title="A separate departure, not a place on the annual Caravan."
          paragraphs={standalone}
          ground="olive"
        />
      ) : null}

      {warnings.length > 0 ? (
        <CopySection
          eyebrow="Before you enquire"
          title="Conditions we explain plainly."
          paragraphs={warnings}
          tone="rose"
        />
      ) : null}

      <Section
        className={styles.adjacentSection}
        ground="cream"
        aria-label="Adjacent Caravan sections"
      >
        <Container className={styles.adjacentLinks}>
          <Link href={`/departures/${COMPLETE_SLUG}`}>
            <span>All nine sections</span>
            <strong>The Andean Caravan</strong>
          </Link>
          {previous ? (
            <Link href={`/departures/${previous.slug}`}>
              <span>Previous section</span>
              <strong>
                {String(previous.sectionNumber).padStart(2, "0")} · {previous.title}
              </strong>
            </Link>
          ) : null}
          {next ? (
            <Link href={`/departures/${next.slug}`}>
              <span>Next section</span>
              <strong>
                {String(next.sectionNumber).padStart(2, "0")} · {next.title}
              </strong>
            </Link>
          ) : null}
        </Container>
      </Section>

      <Wayfinding title={section.title} />
      <InterestSection title={section.title} />
    </>
  );
}

export function generateStaticParams() {
  return [
    { slug: COMPLETE_SLUG },
    ...andeanCaravanSections.map((section) => ({ slug: section.slug })),
  ];
}

export async function generateMetadata({
  params,
}: JourneyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const section = getSection(slug);

  if (slug !== COMPLETE_SLUG && !section) notFound();

  const title =
    slug === COMPLETE_SLUG
      ? `The Andean Caravan | ${siteConfig.name}`
      : `${section?.title} | ${siteConfig.name}`;
  const description =
    slug === COMPLETE_SLUG
      ? "The complete 71-day Andean Caravan through Peru, Bolivia and Chile, travelling from the Pacific coast to the end of the road in Patagonia."
      : `${section?.promise} Part of the Andean Caravan.`;
  const canonicalPath = `/departures/${slug}`;
  const canonicalUrl = absoluteUrl(canonicalPath);
  const baseMetadata = createPageMetadata("/departures");

  return {
    ...baseMetadata,
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: canonicalUrl,
    },
    twitter: { ...baseMetadata.twitter, title, description },
  };
}

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { slug } = await params;

  if (slug === COMPLETE_SLUG) {
    return <main id="main-content" tabIndex={-1}><CompleteCaravanPage /></main>;
  }

  const section = getSection(slug);
  if (!section) notFound();

  return (
    <main id="main-content" tabIndex={-1}>
      <SectionJourneyPage section={section} />
    </main>
  );
}
