import { createPageMetadata } from "@/app/_metadata";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ContentStatusLabel } from "@/components/ui/ContentStatusLabel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Faq } from "@/components/ui/Faq";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { faqItems } from "@/content/faq";
import { membershipContent } from "@/content/membership";

import styles from "./membership.module.css";

export const metadata = createPageMetadata("/membership");

function MembershipTitle() {
  const accent = membershipContent.heroAccentWord;
  const [beforeAccent, afterAccent] = membershipContent.hero.title.split(accent);

  return (
    <>
      {beforeAccent}
      <em className={styles.heroAccent}>{accent}</em>
      {afterAccent}
    </>
  );
}

export default function MembershipPage() {
  const faqAccordionItems = faqItems.map((item) => ({
    id: item.id,
    question: (
      <span className={styles.faqQuestion}>
        <ContentStatusLabel status={item.contentStatus} />
        <span>{item.question}</span>
      </span>
    ),
    answer: (
      <div className={styles.faqAnswer}>
        <ContentStatusLabel status={item.contentStatus} />
        <p>{item.answer}</p>
      </div>
    ),
  }));

  return (
    <main id="main-content" tabIndex={-1}>
      <PageHero
        ground="cream"
        eyebrow={membershipContent.hero.eyebrow}
        title={<MembershipTitle />}
        actions={
          <ButtonLink href={membershipContent.hero.primaryAction.href}>
            {membershipContent.hero.primaryAction.label}
          </ButtonLink>
        }
      />

      <Section ground="butter" aria-labelledby="promises-heading">
        <Container>
          <div className={styles.sectionHeading}>
            <ContentStatusLabel status={membershipContent.contentStatus} />
            <Eyebrow tone="accent">{membershipContent.promisesEyebrow}</Eyebrow>
            <h2 id="promises-heading">{membershipContent.promisesEyebrow}</h2>
          </div>
          <ol className={styles.promiseGrid}>
            {membershipContent.promises.map((promise) => (
              <li className={styles.promise} key={promise.id}>
                <span className={styles.promiseNumber}>{promise.number}</span>
                <div className={styles.promiseCopy}>
                  <ContentStatusLabel status={promise.title.contentStatus} />
                  <h3>{promise.title.text}</h3>
                  <div className={styles.placeholderCopy}>
                    <ContentStatusLabel status={promise.description.contentStatus} />
                    <p>{promise.description.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section ground="olive" aria-label={membershipContent.selectivityHeading}>
        <Container className={styles.selectivity}>
          <ContentStatusLabel
            status={membershipContent.selectivityExplanation.contentStatus}
          />
          <blockquote>{membershipContent.selectivityExplanation.text}</blockquote>
        </Container>
      </Section>

      <Section ground="cream" aria-labelledby="tiers-heading">
        <Container>
          <div className={styles.sectionHeading}>
            <h2 id="tiers-heading">{membershipContent.tiersHeading}</h2>
            <div className={styles.priceNotice}>
              <ContentStatusLabel status="PLACEHOLDER" />
              <p>{membershipContent.pricesNotice}</p>
            </div>
          </div>
          <div className={styles.tierGrid}>
            {membershipContent.tiers.slice(0, 2).map((tier) => (
              <article className={styles.tier} key={tier.id}>
                <div className={styles.tierHeader}>
                  <ContentStatusLabel status={tier.contentStatus} />
                  <h3>{tier.name}</h3>
                  <div className={styles.price}>
                    <ContentStatusLabel status="PLACEHOLDER" />
                    <p>{tier.priceLabel}</p>
                  </div>
                </div>
                <div className={styles.placeholderCopy}>
                  <ContentStatusLabel status={tier.summary.contentStatus} />
                  <p>{tier.summary.text}</p>
                </div>
                <ul className={styles.benefits}>
                  {tier.benefits.map((benefit, index) => (
                    <li key={`${tier.id}-benefit-${index + 1}`}>
                      <ContentStatusLabel status={benefit.contentStatus} />
                      <span>{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className={styles.tierAction}>
            <ButtonLink href={membershipContent.tiers[0].action.href}>
              {membershipContent.tiers[0].action.label}
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section ground="butter">
        <Container>
          <Faq items={faqAccordionItems} title={membershipContent.faqHeading} />
        </Container>
      </Section>

      <Section
        ground="brick"
        aria-label={membershipContent.hero.primaryAction.label}
      >
        <Container className={styles.ctaBand}>
          <h2>{membershipContent.hero.primaryAction.label}</h2>
          <ButtonLink href={membershipContent.hero.primaryAction.href} surface="deep">
            {membershipContent.hero.primaryAction.label}
          </ButtonLink>
        </Container>
      </Section>
    </main>
  );
}
