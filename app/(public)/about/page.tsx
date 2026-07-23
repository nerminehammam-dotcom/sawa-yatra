import { createPageMetadata } from "@/app/_metadata";
import { RisoArtwork } from "@/components/brand/RisoArtwork";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ContentStatusLabel } from "@/components/ui/ContentStatusLabel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { assetManifest } from "@/content/assets";
import { aboutContent } from "@/content/site";

import styles from "./about.module.css";

const founderPortrait = assetManifest[aboutContent.founder.portraitAssetId];

export const metadata = createPageMetadata("/about");

function AboutTitle() {
  const accent = aboutContent.hero.accentWord;
  const [beforeAccent, afterAccent] = aboutContent.hero.title.split(accent);

  return (
    <>
      {beforeAccent}
      <em className={styles.heroAccent}>{accent}</em>
      {afterAccent}
    </>
  );
}

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        ground="cream"
        eyebrow={aboutContent.hero.eyebrow}
        title={<AboutTitle />}
        intro={
          <div className={styles.heroIntro}>
            <ContentStatusLabel status={aboutContent.hero.contentStatus} />
            <p>{aboutContent.hero.lead}</p>
          </div>
        }
      />

      <Section ground="butter" aria-labelledby="founder-heading">
        <Container className={styles.founderLayout}>
          <RisoArtwork
            asset={{
              src: founderPortrait.src,
              alt: founderPortrait.alt,
              treatment: founderPortrait.treatment,
              status: founderPortrait.contentStatus,
            }}
            aspectRatio="square"
            sizes="(max-width: 639px) 100vw, 46vw"
          />
          <div className={styles.founderCopy}>
            <ContentStatusLabel status={aboutContent.founder.contentStatus} />
            <Eyebrow tone="accent">{aboutContent.founder.eyebrow}</Eyebrow>
            <h2 id="founder-heading">{aboutContent.founder.name}</h2>
            <div className={styles.placeholderBlock}>
              <ContentStatusLabel status="PLACEHOLDER" />
              {aboutContent.founder.story.map((paragraph, index) => (
                <p key={`founder-story-${index + 1}`}>{paragraph}</p>
              ))}
            </div>
            <dl className={styles.founderDetails}>
              <div>
                <dt>{aboutContent.founder.nameLabel}</dt>
                <dd>
                  <ContentStatusLabel status="PLACEHOLDER" />
                  <span>{aboutContent.founder.name}</span>
                </dd>
              </div>
              <div>
                <dt>{aboutContent.founder.signatureLabel}</dt>
                <dd>
                  <ContentStatusLabel status="PLACEHOLDER" />
                  <span>{aboutContent.founder.signature}</span>
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </Section>

      <Section ground="cream" aria-labelledby="belief-heading">
        <Container className={styles.beliefLayout}>
          <div className={styles.sectionHeading}>
            <ContentStatusLabel status={aboutContent.beliefSection.contentStatus} />
            <Eyebrow tone="accent">{aboutContent.beliefSection.eyebrow}</Eyebrow>
            <h2 id="belief-heading">{aboutContent.beliefSection.title}</h2>
          </div>
          <blockquote>{aboutContent.belief}</blockquote>
        </Container>
      </Section>

      <Section ground="olive" aria-labelledby="host-role-heading">
        <Container className={styles.hostRole}>
          <div className={styles.sectionHeading}>
            <ContentStatusLabel status={aboutContent.hostRole.contentStatus} />
            <h2 id="host-role-heading">{aboutContent.hostRole.title}</h2>
          </div>
          <div className={styles.placeholderBlock}>
            <ContentStatusLabel status={aboutContent.hostRole.contentStatus} />
            <p>{aboutContent.hostRole.body}</p>
          </div>
        </Container>
      </Section>

      <Section ground="cream" aria-labelledby="values-heading">
        <Container>
          <div className={styles.sectionHeading}>
            <h2 id="values-heading">{aboutContent.valuesHeading}</h2>
          </div>
          <ol className={styles.valueGrid}>
            {aboutContent.values.map((value, index) => (
              <li className={styles.value} key={value.id}>
                <span className={styles.valueNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ContentStatusLabel status={value.contentStatus} />
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section ground="brick" aria-labelledby="about-cta-heading">
        <Container className={styles.ctaBand}>
          <div className={styles.ctaCopy}>
            <ContentStatusLabel status={aboutContent.contentStatus} />
            <h2 id="about-cta-heading">{aboutContent.closingLine}</h2>
          </div>
          <ButtonLink href={aboutContent.action.href} surface="deep">
            {aboutContent.action.label}
          </ButtonLink>
        </Container>
      </Section>
    </main>
  );
}
