import Link from "next/link";

import { CaravanOverviewMap } from "@/components/caravan/CaravanOverviewMap";
import { FounderCopy } from "@/components/caravan/FounderCopy";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { andeanCaravanHeroImage } from "@/content/andean-caravan-images";
import { getFounderCopySlot, getOverviewSpecimenData } from "@/content/caravan/specimen";

import styles from "./specimen.module.css";

export default function AndeanCaravanPhaseThreePreview() {
  const data = getOverviewSpecimenData();

  return (
    <main className={styles.page}>
      <p className={styles.previewBar}>Phase 3 founder-review specimen · structure, density and copy ceilings · placeholders are intentional</p>

      <section className={styles.hero} aria-labelledby="caravan-specimen-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>The Andean Caravan</p>
          <h1 id="caravan-specimen-title" className={styles.heroTitle}>Lima to the end of the Carretera Austral.</h1>
          <p className={styles.heroFacts}>{data.durationDays} days. Three countries.</p>
          <FounderCopy slot={getFounderCopySlot("caravan.hero.proposition")} />
          <p className={styles.fixedChoice}>Four sections. Travel one, or all of them. Or enter for eight days at Cusco.</p>
        </div>

        <div className={styles.choiceZone}>
          <div className={styles.choiceGrid}>
            {data.sections.map((section) => (
              <Link key={section.id} href={section.id === "03" ? section.href : "#level-one-map"} className={styles.choiceCard}>
                <span className={styles.choiceNumber}>{section.number}</span>
                <h2>{section.name}</h2>
                {section.subline ? <p className={styles.choiceSubline}>{section.subline}</p> : null}
                <p className={styles.choiceFacts}>{section.gateFrom} → {section.gateTo} · {section.days} days</p>
                <FounderCopy slot={section.character} />
              </Link>
            ))}
          </div>
          <div className={styles.stoneRoad}>
            <div>
              <strong>A shorter way in.</strong>
              <p>{data.stoneRoad.name} · {data.stoneRoad.days} days · {data.stoneRoad.gateFrom} to {data.stoneRoad.gateTo}</p>
            </div>
            <FounderCopy slot={data.stoneRoad.character} />
          </div>
        </div>
      </section>

      <div className={styles.fullBleedImage}>
        <RisoArtwork asset={andeanCaravanHeroImage} aspectRatio="hero" sizes="100vw" priority />
      </div>

      <section id="level-one-map" className={styles.section} aria-labelledby="level-one-heading">
        <header className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Level 1 · choose a section</p>
          <h2 id="level-one-heading">One route. Four decisions.</h2>
          <p className={styles.sectionLede}>The map repeats the product choice and shows route sequence against known overnight altitude. It does not introduce day pins or extra products.</p>
        </header>
        <CaravanOverviewMap sections={data.sections} gates={data.gates} altitudePoints={data.altitudePoints} />
      </section>

      <section className={styles.section} aria-labelledby="joining-heading">
        <div className={styles.joiningGrid}>
          <header className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>How joining works</p>
            <h2 id="joining-heading">Five Caravan gates.</h2>
          </header>
          <p className={styles.fixedLine}><span>Fixed dates. Five Caravan gates. Advance booking.</span><span>The Stone Road also joins at Cusco.</span></p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="threads-heading">
        <header className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Across all four sections</p>
          <h2 id="threads-heading">Three route threads.</h2>
          <FounderCopy slot={getFounderCopySlot("caravan.threads.intro")} />
        </header>
        <div className={styles.threadGrid}>
          <article className={styles.thread}><h3>Water</h3><FounderCopy slot={getFounderCopySlot("caravan.thread.water")} /></article>
          <article className={styles.thread}><h3>Materials</h3><FounderCopy slot={getFounderCopySlot("caravan.thread.materials")} /></article>
          <article className={styles.thread}><h3>People and pace</h3><FounderCopy slot={getFounderCopySlot("caravan.thread.people_pace")} /></article>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="journeys-entry-heading">
        <header className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Journeys hub specimen · one entry</p>
          <h2 id="journeys-entry-heading">The Caravan appears once.</h2>
        </header>
        <article className={styles.journeyCard}>
          <div className={styles.journeyCardCopy}>
            <h3>The Andean Caravan</h3>
            <p className={styles.journeyCardFacts}>Lima → Balmaceda · 71 days · four sections · maximum 12</p>
            <FounderCopy slot={getFounderCopySlot("journeys.caravan.character")} />
            <FounderCopy slot={getFounderCopySlot("journeys.caravan.invitation")} />
          </div>
          <Link href="#caravan-specimen-title" className={styles.journeyCardAction}>Explore the Caravan ↑</Link>
        </article>
      </section>

      <section className={styles.section} aria-labelledby="enquiry-heading">
        <header className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Ask</p>
          <h2 id="enquiry-heading">Enquiry only.</h2>
          <FounderCopy slot={getFounderCopySlot("caravan.enquiry.invitation")} />
        </header>
        <div className={styles.withheld}><p>[ENQUIRY ACTION WITHHELD · LB-01 · delivery configuration remains a launch blocker]</p></div>
      </section>
    </main>
  );
}
