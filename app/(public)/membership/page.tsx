import Link from "next/link";

import { createPageMetadata } from "@/app/_metadata";
import {
  invitationModel,
  membershipContent,
  membershipMoney,
} from "@/content/membership";
import {
  specToken,
  specTokensFilled,
  type SpecTokenName,
} from "@/content/spec-tokens";
import { contactHref } from "@/lib/contact";

import styles from "./membership.module.css";
import { Arrow } from "@/components/ui/Arrow";

export const metadata = createPageMetadata("/membership");

const MONEY_TOKENS: readonly SpecTokenName[] = [
  "JOINING_FEE",
  "SERVICE_CHARGE",
  "HOUSEHOLD_FEE",
];

/**
 * §5 + §8 — invitation-only membership. No tier table appears anywhere until
 * the §8 tokens are filled; the money block is withheld from production
 * until sign-off and renders with visible token markers in development.
 */
export default function MembershipPage() {
  const showMoney =
    specTokensFilled(MONEY_TOKENS) || process.env.NODE_ENV !== "production";

  return (
    <main id="main-content" tabIndex={-1}>
      <section className={styles.hero} aria-labelledby="membership-heading">
        <p>{membershipContent.hero.eyebrow}</p>
        <h1 id="membership-heading">{membershipContent.hero.title}</h1>
        <p>
          Sawayatra accepts members by invitation only. The public site is
          yours to read; members and their Travel Selves become visible when
          you join.
        </p>
        <Link href={contactHref("Membership")}>
          Ask about membership <Arrow />
        </Link>
      </section>

      <section className={styles.note} aria-labelledby="invitation-heading">
        <h2 id="invitation-heading">{invitationModel.heading}</h2>
        <p>{invitationModel.founding}</p>
        <p>{invitationModel.houseDoor}</p>
        <p>{invitationModel.allocationLine}</p>
        <p>{invitationModel.sponsorship}</p>
        <p>{invitationModel.removal}</p>
      </section>

      {showMoney ? (
        <section className={`${styles.note} ${styles.moneyNote}`} aria-labelledby="money-heading">
          <h2 id="money-heading">{membershipMoney.heading}</h2>
          <dl>
            {membershipMoney.lines.map((line) => (
              <div key={line.id}>
                <dt>
                  {line.name} — {specToken(line.token)}
                </dt>
                <dd>{line.detail}</dd>
              </div>
            ))}
          </dl>
          {/* §6.3/§9.2: no font-glyph arrows; operational copy stays plain —
              an ordered list is the literal form of a sequence. */}
          <p>At checkout, in this order:</p>
          <ol>
            {membershipMoney.checkoutOrder.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>
            Nothing appears at the last step that was not visible at the
            second.
          </p>
        </section>
      ) : (
        <section className={`${styles.note} ${styles.moneyNote}`} aria-labelledby="money-heading">
          <h2 id="money-heading">The details come after the idea is clear.</h2>
          <p>
            Prices and conditions are not published before they are ready. You
            can still ask how the club is taking shape.
          </p>
        </section>
      )}
    </main>
  );
}
