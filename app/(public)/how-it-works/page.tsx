import { createPageMetadata } from "@/app/_metadata";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ContentStatusLabel } from "@/components/ui/ContentStatusLabel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { howItWorksContent } from "@/content/site";

import styles from "./how-it-works.module.css";

export const metadata = createPageMetadata("/how-it-works");

function HowItWorksTitle() {
  const accent = howItWorksContent.hero.accentWord;
  const [beforeAccent, afterAccent] = howItWorksContent.hero.title.split(accent);

  return (
    <>
      {beforeAccent}
      <em className={styles.heroAccent}>{accent}</em>
      {afterAccent}
    </>
  );
}

export default function HowItWorksPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        ground="cream"
        eyebrow={howItWorksContent.hero.eyebrow}
        title={<HowItWorksTitle />}
        intro={
          <div className={styles.heroIntro}>
            <ContentStatusLabel status={howItWorksContent.hero.contentStatus} />
            <p>{howItWorksContent.hero.lead}</p>
          </div>
        }
      />

      <Section ground="butter" aria-labelledby="four-steps-heading">
        <Container>
          <div className={styles.sectionHeading}>
            <Eyebrow tone="accent">{howItWorksContent.stepsEyebrow}</Eyebrow>
            <h2 id="four-steps-heading">{howItWorksContent.stepsHeading}</h2>
          </div>
          <ol className={styles.steps}>
            {howItWorksContent.steps.map((step) => (
              <li
                className={`${styles.step} ${
                  step.id === "everyone-says-yes" ? styles.keystone : ""
                }`}
                key={step.id}
              >
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

      <Section ground="olive" aria-labelledby="ways-heading">
        <Container>
          <div className={styles.deepHeading}>
            <ContentStatusLabel status={howItWorksContent.waysToTravel.contentStatus} />
            <h2 id="ways-heading">{howItWorksContent.waysToTravel.title}</h2>
          </div>
          <div className={styles.wayGrid}>
            {howItWorksContent.waysToTravel.items.map((way) => (
              <article
                className={`${styles.wayCard} ${way.highlighted ? styles.highlighted : ""}`}
                key={way.id}
              >
                <ContentStatusLabel status="PLACEHOLDER" />
                <h3>{way.title}</h3>
                <p>{way.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section ground="cream" aria-labelledby="mechanisms-heading">
        <Container>
          <div className={styles.mechanismPanel}>
            <div className={styles.mechanismHeading}>
              <ContentStatusLabel status={howItWorksContent.mechanisms.contentStatus} />
              <Eyebrow>{howItWorksContent.mechanisms.eyebrow}</Eyebrow>
              <h2 id="mechanisms-heading">{howItWorksContent.mechanisms.title}</h2>
            </div>
            <div className={styles.mechanismList}>
              {howItWorksContent.mechanisms.items.map((mechanism) => (
                <article className={styles.mechanism} key={mechanism.id}>
                  <ContentStatusLabel status={mechanism.contentStatus} />
                  <h3>{mechanism.title}</h3>
                  <p>{mechanism.body}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section ground="brick" aria-label={howItWorksContent.action.label}>
        <Container className={styles.ctaBand}>
          <h2>{howItWorksContent.action.label}</h2>
          <ButtonLink href={howItWorksContent.action.href} surface="deep">
            {howItWorksContent.action.label}
          </ButtonLink>
        </Container>
      </Section>
    </main>
  );
}
