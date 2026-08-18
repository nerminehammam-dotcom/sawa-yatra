import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import { Arrow } from "@/components/ui/Arrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  HOW_IT_WORKS_GROUPS,
  HOW_IT_WORKS_REASONS,
  HOW_IT_WORKS_STEPS,
} from "@/content/how-it-works-v24";
import {
  archiveCopy,
  farmJourney,
  journeyOrigins,
  journeyStructures,
  responsibilityLabels,
  waysMembersTravel,
} from "@/content/club-first";

import styles from "./how-it-works.module.css";

export const metadata = createPageMetadata("/how-it-works");

const journeyAccess = [
  {
    id: "open-to-members",
    title: "Open to members",
    body: waysMembersTravel[0].body,
  },
  {
    id: "private",
    title: "Private",
    body: waysMembersTravel[1].body,
  },
] as const;

export default function HowItWorksPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="how-heading">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>How Sawayatra works</p>
          <h1 id="how-heading">How Sawayatra works</h1>
          <p className={styles.openingLine}>
            Sawayatra is a members&apos; travel club. You join it before you know
            where you&apos;re going.
          </p>
          <p>
            Most group travel sells you a date and hands you a set of strangers
            on the first morning. We think the people are the journey, not an
            accident of who booked the same week.
          </p>
          <p>So the order is different here.</p>
        </div>
        <figure className={styles.heroImage}>
          <Image
            src="/assets/images/how-it-works/masthead.jpg"
            alt="Painted Sawayatra travel poster over an Andean valley beneath tall clouds and a red sun."
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
            preload
          />
        </figure>
      </section>

      <section className={styles.v24Steps} aria-label="The six steps">
        {HOW_IT_WORKS_GROUPS.map((group) => {
          const steps = HOW_IT_WORKS_STEPS.filter(
            (step) => step.group === group.id,
          );
          const first = steps[0];

          if (!first) {
            return null;
          }

          return (
            <div className={styles.stepGroup} key={group.id}>
              <h2 className={styles.stepGroupLabel} id={`steps-${group.id}`}>
                {group.label}
              </h2>
              <ol
                aria-labelledby={`steps-${group.id}`}
                start={Number(first.number)}
              >
                {steps.map((step) => (
                  <li key={step.number}>
                    <header>
                      <span>{step.number}</span>
                      <h3>{step.title}</h3>
                    </header>
                    <div>
                      {step.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {step.action ? (
                        <p className={styles.stepAction}>
                          <Link href={step.action.href}>
                            {step.action.label} <Arrow />
                          </Link>
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </section>

      <section className={styles.v24Reasons} aria-labelledby="reasons-heading">
        <header>
          <p className={styles.kicker}>The arrangement</p>
          <h2 id="reasons-heading">Why it works this way</h2>
        </header>
        <div>
          {HOW_IT_WORKS_REASONS.map((reason) => (
            <p key={reason.title}>
              <strong>{reason.title}</strong> {reason.body}
            </p>
          ))}
        </div>
      </section>

      <section
        className={styles.clubAppendix}
        aria-labelledby="journey-terms-heading"
      >
        <div className={styles.clubAppendixInner}>
          <header className={styles.appendixHeader}>
            <p className={styles.kicker}>Journey terms</p>
            <h2 id="journey-terms-heading">Four facts, kept separate</h2>
            <p>
              Structure, setting, access and origin describe different parts of
              a journey. One does not determine another.
            </p>
          </header>

          <div className={styles.taxonomyGrid}>
            <article>
              <p className={styles.taxonomyLabel}>Structure</p>
              {journeyStructures.map((structure) => (
                <div className={styles.term} key={structure.id}>
                  <h3>{structure.title}</h3>
                  <p>{structure.body}</p>
                </div>
              ))}
            </article>

            <article>
              <p className={styles.taxonomyLabel}>Setting</p>
              <div className={styles.term}>
                <h3>{farmJourney.title}</h3>
                <p>{farmJourney.body}</p>
                <p>{farmJourney.modelNote}</p>
              </div>
            </article>

            <article>
              <p className={styles.taxonomyLabel}>Access</p>
              {journeyAccess.map((access) => (
                <div className={styles.term} key={access.id}>
                  <h3>{access.title}</h3>
                  <p>{access.body}</p>
                </div>
              ))}
            </article>

            <article>
              <p className={styles.taxonomyLabel}>Origin</p>
              <p>
                Some journeys are conceived by Sawayatra. Some are proposed by
                members. Others are brought to the club by agencies and local
                operators who submit a journey for consideration.
              </p>
              {journeyOrigins.map((origin) => (
                <div className={styles.term} key={origin.id}>
                  <h3>{origin.title}</h3>
                  <p>{origin.body}</p>
                </div>
              ))}
            </article>
          </div>

          <div className={styles.disclosureGrid}>
            <section aria-labelledby="ways-members-travel-heading">
              <h2 id="ways-members-travel-heading">Ways members travel</h2>
              <p>
                Members may join a published departure open to the club, ask
                Sawayatra to shape a private journey for an existing company,
                or propose a road they wish to travel and invite interest from
                compatible members.
              </p>
              <p>
                A private journey may be taken by a family, a group of friends,
                an institution or another company that already knows itself.
              </p>
            </section>
          </div>

          <div className={styles.disclosureGrid}>
            <section aria-labelledby="responsibility-heading">
              <p className={styles.kicker}>Before publication</p>
              <h2 id="responsibility-heading">Named responsibilities</h2>
              <p>
                The journey model requires nine approved fields before a
                responsibility panel can be published.
              </p>
              <ul className={styles.responsibilityList}>
                {responsibilityLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
              <p>
                Existing journey records are being completed. Missing fields
                are kept out of public pages rather than replaced with guesses
                or implied Sawayatra responsibility.
              </p>
              <Link className={styles.appendixLink} href="/journey-standards">
                Read the Journey Standards <Arrow />
              </Link>
            </section>

            <section aria-labelledby="archive-heading">
              <p className={styles.kicker}>After the road</p>
              <h2 id="archive-heading">The Archive</h2>
              <p>{archiveCopy.status}</p>
              <p>{archiveCopy.purpose}</p>
              <p>{archiveCopy.privacy}</p>
              <Link className={styles.appendixLink} href="/archive">
                About the Archive <Arrow />
              </Link>
            </section>
          </div>
        </div>
      </section>

      <section className={styles.v24Closing} aria-label="Where to begin">
        <p>Start with the questionnaire. It&apos;s free and asks nothing of you.</p>
        <ButtonLink href="/travel-self/take">Meet your travel self</ButtonLink>
        <p>Or read the journeys first.</p>
        <ButtonLink href="/journeys" variant="secondary">The journeys</ButtonLink>
      </section>
    </main>
  );
}
