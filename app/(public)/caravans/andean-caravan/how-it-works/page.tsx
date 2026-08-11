import type { Metadata } from "next";
import Link from "next/link";

import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { Arrow } from "@/components/ui/Arrow";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactStrip } from "@/components/ui/FactStrip";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { andeanCaravanHeroImage } from "@/content/andean-caravan-images";
import { andeanCaravanEnquiry } from "@/content/andean-caravan-editorial";
import {
  getCanonicalCaravanOverview,
  getCanonicalStoneRoadPageData,
} from "@/content/caravan/page-data";
import { siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

import styles from "../../../departures/[slug]/journey.module.css";
import { JoinLeavePlanner } from "./_components/JoinLeavePlanner";

export const metadata: Metadata = {
  title: { absolute: `Joining & leaving points | ${siteConfig.name}` },
  alternates: {
    canonical: absoluteUrl("/caravans/andean-caravan/how-it-works"),
  },
};

function airportLabel(airport: string): string {
  const labels: Readonly<Record<string, string>> = {
    LIM: "Lima airport (LIM)",
    CUZ: "Cusco airport (CUZ)",
    "JUL + road": "Juliaca airport (JUL) + road transfer",
    SRE: "Sucre airport (SRE)",
    SCL: "Santiago airport (SCL)",
    BBA: "Balmaceda airport (BBA)",
  };
  return labels[airport] ?? airport;
}

function gateRoleLabel(gateId: string): string {
  const labels: Readonly<Record<string, string>> = {
    lima: "Join Sea to Stone.",
    puno: "Leave Sea to Stone or join Both Shores.",
    sucre: "Leave Both Shores or join The Mirror.",
    santiago: "Leave The Mirror or join The End of the Road.",
    balmaceda:
      "Leave The End of the Road; the included exit flight continues to Santiago.",
    cusco: "Join The Stone Road short form only.",
  };
  return labels[gateId] ?? "Designated Caravan point.";
}

export default function AndeanCaravanJoiningPage() {
  const data = getCanonicalCaravanOverview();
  const stoneRoad = getCanonicalStoneRoadPageData();
  const caravanGates = data.gates.filter(
    (gate) => gate.gate_class === "caravan_gate",
  );
  const shortFormGate = data.gates.find(
    (gate) => gate.gate_class === "short_form_joining_gate",
  );
  const plannerSections = data.sections.map(
    ({ slug, section, gateFrom, gateTo }) => ({
      id: section.section_id,
      name: section.name,
      slug,
      days: section.day_end - section.day_start + 1,
      dayStart: section.day_start,
      dayEnd: section.day_end,
      join: gateFrom.name,
      leave: gateTo.name,
      joinAirport: gateFrom.airport,
      leaveAirport: gateTo.airport,
      joinNote: gateFrom.arrival_rule.text,
    }),
  );
  const plannerShortForm = {
    name: stoneRoad.product.name,
    slug: stoneRoad.slug,
    days: stoneRoad.product.day_end - stoneRoad.product.day_start + 1,
    dayStart: stoneRoad.product.day_start,
    dayEnd: stoneRoad.product.day_end,
    join: stoneRoad.gateFrom.name,
    leave: stoneRoad.gateTo.name,
    joinAirport: stoneRoad.gateFrom.airport,
    leaveAirport: stoneRoad.gateTo.airport,
    joinNote: stoneRoad.gateFrom.arrival_rule.text,
  };

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        className={styles.hero}
        mediaLayout="split"
        mobileContentFirst
        ground="cream"
        eyebrow={
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link href="/caravans">Caravans</Link>
            <span aria-hidden="true">›</span>
            <Link href="/caravans/andean">The Andean Caravan</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Joining &amp; leaving points</span>
          </nav>
        }
        eyebrowKind="decision"
        title="Joining & leaving points"
        titleClassName={styles.heroTitle}
        intro={
          <div className={styles.heroIntro}>
            <p>
              The Caravan travels from Lima to Balmaceda in four consecutive
              sections, with a separate Cusco–Puno short form. Choose the
              points where your part begins and ends.
            </p>
          </div>
        }
        facts={
          <FactStrip
            label="Joining & leaving at a glance"
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
            sizes="(max-width: 639px) 100vw, 54vw"
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
            <h2 id="sections-heading">Choose your joining and leaving points.</h2>
          </div>

          <JoinLeavePlanner
            sections={plannerSections}
            shortForm={plannerShortForm}
          />

        </Container>
      </Section>

      <Section
        className={styles.copySection}
        ground="cream"
        aria-labelledby="gates-heading"
      >
        <Container className={styles.copyGrid}>
          <div className={styles.sectionHeading}>
            <Eyebrow kind="decision" tone="accent">The points</Eyebrow>
            <h2 id="gates-heading">
              Five Caravan gates, plus Cusco for the short form.
            </h2>
          </div>
          <div className={styles.copyBody}>
            <div>
              <h3>Before arranging travel</h3>
              <p>
                Exact dates and scheduled-flight times are not confirmed yet.
                Wait for Sawayatra to confirm your joining point and arrival
                plan before arranging tickets.
              </p>
            </div>
            {caravanGates.map((gate) => (
              <div key={gate.id}>
                <h3>{gate.name} · {airportLabel(gate.airport)}</h3>
                <p>{gateRoleLabel(gate.id)}</p>
                <p>{gate.arrival_rule.text}</p>
              </div>
            ))}
            {shortFormGate ? (
              <div>
                <h3>
                  {shortFormGate.name} · {airportLabel(shortFormGate.airport)}
                </h3>
                <p>{gateRoleLabel(shortFormGate.id)}</p>
                <p>{shortFormGate.arrival_rule.text}</p>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section
        className={styles.adjacentSection}
        ground="cream"
        aria-labelledby="next-step-heading"
      >
        <Container>
          <div className={styles.sectionHeadingInline}>
            <Eyebrow kind="decision" tone="accent">Next step</Eyebrow>
            <h2 id="next-step-heading">Put your chosen run back on the map.</h2>
          </div>
          <div className={styles.adjacentLinks}>
            <Link href="/caravans/andean#full-route-map">
              <span>Places, transport and terrain</span>
              <strong>Open Maps</strong>
            </Link>
            <Link href="/caravans/andean/route-map">
              <span>Every route day</span>
              <strong>Open Each stop</strong>
            </Link>
          </div>
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
              {andeanCaravanEnquiry.eyebrow}
            </Eyebrow>
            <h2 id="enquiry-heading">{andeanCaravanEnquiry.heading}</h2>
            <p>{andeanCaravanEnquiry.invitation}</p>
          </div>
          <div className={styles.interestActions}>
            <Link className={styles.askLink} href="/register-interest">
              Register your interest <Arrow />
            </Link>
            <Link className={styles.secondaryAskLink} href="/caravans/andean#all-sections">
              Compare all four sections <Arrow />
            </Link>
            <p>{andeanCaravanEnquiry.status}</p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
