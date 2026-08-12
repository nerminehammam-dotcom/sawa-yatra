import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";

import styles from "./club.module.css";

export const metadata = createPageMetadata("/club");

const memberPath = [
  {
    label: "Joining · the club",
    steps: [
      {
        number: "01",
        title: "Meet your Travel Self — if you want",
        body: "The questionnaire is free, anonymous and optional. Take it before joining, after joining, or not yet.",
        actions: [
          { label: "Meet your Travel Self", href: "/travel-self", protected: false },
          { label: "Take the questionnaire", href: "/travel-self/take", protected: false },
        ],
      },
      {
        number: "02",
        title: "Apply to the club",
        body: "Membership is free. You apply to the club, not to a journey, and there is no payment or booking.",
        actions: [
          { label: "Apply to join", href: "/club/apply", protected: false },
        ],
      },
      {
        number: "03",
        title: "We read your application",
        body: "The club reads it as people, not as an automatic score. Applicants can return to their application status.",
        actions: [
          { label: "View my application", href: "/my/application", protected: true },
        ],
      },
      {
        number: "04",
        title: "Membership becomes active",
        body: "If accepted, you are a member whether or not you have saved a Travel Self or chosen a journey.",
        actions: [
          { label: "My Sawayatra", href: "/my", protected: true },
        ],
      },
    ],
  },
  {
    label: "Member · the path",
    steps: [
      {
        number: "05",
        title: "Save your Travel Self when you choose",
        body: "A saved result becomes your passport. You can retake it later and control each optional demographic separately.",
        actions: [
          { label: "My Travel Self", href: "/my/travel-self", protected: true },
        ],
      },
      {
        number: "06",
        title: "Find a journey",
        body: "Read the journeys first or wait until a road holds you. A long gap after joining is normal here.",
        actions: [
          { label: "Explore journeys", href: "/journeys", protected: false },
        ],
      },
      {
        number: "07",
        title: "Declare interest",
        body: "Choose a journey first. Declare interest on that journey’s page; it is not a booking and does not require a saved Travel Self.",
        actions: [],
      },
      {
        number: "08",
        title: "Meet the pool",
        body: "After declaring, the journey pool shows passports. First name and photograph appear only after mutual interest.",
        actions: [],
      },
    ],
  },
] as const;

export default function ClubPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header className={styles.hero}>
        <div className={styles.heroStatement}>
          <p>The club</p>
          <h1>Join before you know where you&apos;re going.</h1>
        </div>
        <div className={styles.heroInvitation}>
          <p>
            Membership is free and separate from any journey. You may stay a
            member for as long as you need before a road holds you.
          </p>
          <Link href="/club/apply">Apply to join</Link>
        </div>
      </header>
      <section className={styles.memberPath} aria-labelledby="member-path-heading">
        <header className={styles.sheetHeader}>
          <div>
            <p>Sawayatra · member field sheet</p>
            <h2 id="member-path-heading">The path into the club.</h2>
          </div>
          <p>Membership is active before a passport or a journey.</p>
        </header>

        <div className={styles.pathColumns}>
          {memberPath.map((group) => (
            <section key={group.label} className={styles.pathColumn} aria-label={group.label}>
              <p className={styles.columnLabel}>{group.label}</p>
              <ol>
                {group.steps.map((step) => (
                  <li key={step.number}>
                    <p className={styles.stepNumber}>{step.number}</p>
                    <h3>{step.title}</h3>
                    <p className={styles.stepBody}>{step.body}</p>
                    {step.actions.length > 0 ? (
                      <div className={styles.stepActions}>
                        {step.actions.map((action) => (
                          <Link
                            key={action.href}
                            className={styles.stepAction}
                            href={action.href}
                            prefetch={action.protected ? false : undefined}
                          >
                            {action.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <footer className={styles.sheetFooter}>
          <p>No booking. No payment. No public profiles.</p>
          <p>Journey-specific actions appear only after a journey is chosen.</p>
        </footer>
      </section>
      <section className={styles.promise}>
        <h2>Membership is a place to sit while you decide.</h2>
        <p>
          There is no fee, subscription, booking obligation or expectation
          that you declare interest quickly. Travel does not happen often. A
          long gap is normal here.
        </p>
      </section>
    </main>
  );
}
