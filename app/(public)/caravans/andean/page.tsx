import type { Metadata } from "next";
import Link from "next/link";

import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { CaravanRouteMap } from "@/components/departures/CaravanRouteMap";
import { DepartureCard } from "@/components/departures/DepartureCard";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactStrip } from "@/components/ui/FactStrip";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import {
  andeanCaravanHeroImage,
  getCanonicalCaravanImage,
} from "@/content/andean-caravan-images";
import { getCanonicalCaravanOverview } from "@/content/caravan/page-data";
import { siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

import styles from "../../departures/[slug]/journey.module.css";

export const metadata: Metadata = {
  title: { absolute: `The Andean Caravan | ${siteConfig.name}` },
  alternates: { canonical: absoluteUrl("/caravans/andean") },
};

const sectionTone = {
  "01": "peru",
  "02": "crossing",
  "03": "bolivia",
  "04": "chile",
} as const;

export default function AndeanCaravanPage() {
  const data = getCanonicalCaravanOverview();
  const stoneRoad = data.sections[0];

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        className={styles.hero}
        mediaLayout="split"
        ground="cream"
        eyebrow="The Andean Caravan"
        eyebrowKind="decision"
        title={data.name}
        titleClassName={styles.completeHeroTitle}
        intro={
          <div className={styles.heroIntro}>
            <p>
              {data.durationDays} days from Lima to Balmaceda. Four sections,
              with one eight-day short form from Cusco to Puno.
            </p>
          </div>
        }
        facts={
          <FactStrip
            label="The Andean Caravan at a glance"
            facts={[
              { label: "Duration", value: `${data.durationDays} days` },
              { label: "Route", value: "Lima → Balmaceda" },
              { label: "Sections", value: "Four" },
              { label: "Group maximum", value: String(data.groupMax) },
              {
                label: "Scheduled flights",
                value: `${data.scheduledFlights} included movements`,
              },
            ]}
          />
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
        id="all-sections"
        className={styles.movementsSection}
        ground="cream"
        aria-labelledby="sections-heading"
      >
        <Container>
          <div className={styles.movementsHeader}>
            <div className={styles.sectionHeading}>
              <Eyebrow kind="decision" tone="accent">
                Choose a section
              </Eyebrow>
              <h2 id="sections-heading">Four sections on one continuous road.</h2>
            </div>
          </div>
          <ol className={styles.movementGrid}>
            {data.sections.map(({ slug, section, gateFrom, gateTo }) => (
              <li key={section.section_id}>
                <DepartureCard
                  href={`/caravans/andean/${slug}`}
                  title={section.name}
                  route={`${gateFrom.name} → ${gateTo.name}`}
                  duration={`${section.day_end - section.day_start + 1} days`}
                  groupSize={`Maximum ${section.group_max}`}
                  sequence={section.section_id}
                  eyebrow={section.subline ?? "Caravan section"}
                  asset={getCanonicalCaravanImage(slug)}
                  tone={sectionTone[section.section_id]}
                />
              </li>
            ))}
          </ol>

          {stoneRoad ? (
            <div className={styles.adjacentLinks}>
              <Link href="/caravans/andean/the-stone-road">
                <span>A shorter way in · Days 16–23</span>
                <strong>The Stone Road · Cusco → Puno · 8 days</strong>
              </Link>
            </div>
          ) : null}
        </Container>
      </Section>

      <Section
        className={styles.routeSection}
        ground="cream"
        aria-labelledby="route-heading"
      >
        <Container>
          <div className={styles.routeHeader}>
            <div className={styles.sectionHeading}>
              <Eyebrow kind="decision" tone="accent">
                The route
              </Eyebrow>
              <h2 id="route-heading">Lima to Balmaceda.</h2>
            </div>
          </div>
          <CaravanRouteMap />
        </Container>
      </Section>

      <Section
        className={styles.copySection}
        ground="cream"
        aria-labelledby="joining-heading"
      >
        <Container className={styles.copyGrid}>
          <div className={styles.sectionHeading}>
            <Eyebrow kind="decision" tone="accent">
              Joining and leaving
            </Eyebrow>
            <h2 id="joining-heading">Five Caravan gates. One short-form exception.</h2>
          </div>
          <div className={styles.copyBody}>
            {data.gates.map((gate) => (
              <p key={gate.id}>
                <strong>{gate.name} · {gate.airport} · {gate.altitude.display}</strong>
                <br />
                {gate.role}. {gate.arrival_rule.text}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      {process.env.NODE_ENV !== "production" ? (
        <Section
          className={styles.copySection}
          ground="olive"
          aria-labelledby="threads-heading"
        >
          <Container className={styles.copyGrid}>
            <div className={styles.sectionHeading}>
              <Eyebrow tone="inherit" className={styles.oliveEyebrow}>
                Founder copy needed
              </Eyebrow>
              <h2 id="threads-heading">Route threads</h2>
            </div>
            <div className={styles.copyBody}>
              <p>[Founder copy needed: Water]</p>
              <p>[Founder copy needed: Materials]</p>
              <p>[Founder copy needed: People and pace]</p>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section
        className={styles.interestSection}
        ground="brick"
        aria-labelledby="enquiry-heading"
      >
        <Container className={styles.interestGrid}>
          <div className={styles.sectionHeading}>
            <Eyebrow kind="decision" tone="inherit" className={styles.deepEyebrow}>
              Enquiry
            </Eyebrow>
            <h2 id="enquiry-heading">Enquiry delivery is not connected yet.</h2>
            <p>The route content is available to read. No payment or booking action is active.</p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
