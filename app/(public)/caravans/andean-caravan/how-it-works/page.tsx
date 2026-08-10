import type { Metadata } from "next";
import Link from "next/link";

import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { CaravanRouteMap } from "@/components/departures/CaravanRouteMap";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactStrip } from "@/components/ui/FactStrip";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { andeanCaravanHeroImage } from "@/content/andean-caravan-images";
import { getCanonicalCaravanOverview } from "@/content/caravan/page-data";
import { siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

import styles from "../../../departures/[slug]/journey.module.css";

export const metadata: Metadata = {
  title: { absolute: `Joining and leaving the Andean Caravan | ${siteConfig.name}` },
  alternates: {
    canonical: absoluteUrl("/caravans/andean-caravan/how-it-works"),
  },
};

export default function AndeanCaravanJoiningPage() {
  const data = getCanonicalCaravanOverview();
  const caravanGates = data.gates.filter(
    (gate) => gate.gate_class === "caravan_gate",
  );
  const shortFormGate = data.gates.find(
    (gate) => gate.gate_class === "short_form_joining_gate",
  );

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        className={styles.hero}
        mediaLayout="split"
        ground="cream"
        eyebrow="The Andean Caravan"
        eyebrowKind="decision"
        title="Joining and leaving"
        titleClassName={styles.heroTitle}
        intro={
          <div className={styles.heroIntro}>
            <p>
              The Caravan travels from Lima to Balmaceda in four sections.
              Travellers join and leave at the designated gates attached to
              those sections.
            </p>
          </div>
        }
        facts={
          <FactStrip
            label="Joining and leaving at a glance"
            facts={[
              { label: "Full route", value: `${data.durationDays} days` },
              { label: "Sections", value: String(data.sections.length) },
              { label: "Caravan gates", value: String(caravanGates.length) },
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
        className={styles.movementsSection}
        ground="cream"
        aria-labelledby="sections-heading"
      >
        <Container>
          <div className={styles.sectionHeadingInline}>
            <Eyebrow kind="decision" tone="accent">Four sections</Eyebrow>
            <h2 id="sections-heading">Choose where your journey begins and ends.</h2>
          </div>
          <Accordion
            allowMultiple
            items={data.sections.map(({ slug, section, gateFrom, gateTo }) => ({
              id: section.section_id,
              question: `${section.name} · ${section.day_end - section.day_start + 1} days · ${gateFrom.name} to ${gateTo.name}`,
              answer: (
                <div>
                  {section.subline ? <p>{section.subline}</p> : null}
                  <p>{section.join_rule.text}</p>
                  <p>
                    <Link href={`/caravans/andean/${slug}`}>
                      Read {section.name}
                    </Link>
                  </p>
                </div>
              ),
            }))}
          />
          <div className={styles.adjacentLinks}>
            <Link href="/caravans/andean/the-stone-road">
              <span>Short-form exception · Days 16–23</span>
              <strong>The Stone Road · Cusco → Puno · 8 days</strong>
            </Link>
          </div>
        </Container>
      </Section>

      <Section
        className={styles.copySection}
        ground="cream"
        aria-labelledby="gates-heading"
      >
        <Container className={styles.copyGrid}>
          <div className={styles.sectionHeading}>
            <Eyebrow kind="decision" tone="accent">The gates</Eyebrow>
            <h2 id="gates-heading">Five gates on the Caravan route.</h2>
          </div>
          <div className={styles.copyBody}>
            {caravanGates.map((gate) => (
              <div key={gate.id}>
                <h3>{gate.name} · {gate.airport}</h3>
                <p>{gate.role}</p>
                <p>{gate.arrival_rule.text}</p>
              </div>
            ))}
            {shortFormGate ? (
              <div>
                <h3>{shortFormGate.name} · short-form joining gate</h3>
                <p>{shortFormGate.role}</p>
                <p>{shortFormGate.arrival_rule.text}</p>
              </div>
            ) : null}
          </div>
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
              <Eyebrow kind="decision" tone="accent">The continuous route</Eyebrow>
              <h2 id="route-heading">Lima to Balmaceda.</h2>
            </div>
          </div>
          <CaravanRouteMap />
        </Container>
      </Section>

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
            <p>
              The route content is available to read. No payment or booking
              action is active.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
