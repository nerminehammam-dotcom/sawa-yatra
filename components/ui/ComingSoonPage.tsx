import Link from "next/link";
import type { ReactNode } from "react";

import { contactEmail } from "@/lib/contact";

import styles from "./ComingSoonPage.module.css";

interface OnwardLink {
  href: string;
  label: string;
  description: string;
}

interface ComingSoonPageProps {
  title: string;
  lede: string;
  children?: ReactNode;
  notificationSubject?: string;
  onwardLinks?: readonly OnwardLink[];
  /** Status label. Defaults to "Coming soon"; register-interest overrides it,
   *  because registering interest is an available action, not a future one. */
  label?: string;
  /** The full mailto subject line, when the default "notify me when … opens"
   *  framing is wrong (again, register-interest). */
  mailSubject?: string;
  mailBody?: string;
  /** Copy for the email capture, so a page that is open for interest does not
   *  say "we will write once, when this section opens." */
  notifyIntro?: string;
  submitLabel?: string;
  /** Use a normal site action instead of the email-app notification form. */
  actionHref?: string;
  actionNote?: string;
}

const defaultOnwardLinks: readonly OnwardLink[] = [
  {
    href: "/journeys/caravans/andean-caravan",
    label: "The Andean Caravan",
    description: "71 days, Lima to Patagonia. Join one of four sections or travel the complete route.",
  },
  {
    href: "/travel-self",
    label: "Meet Your Travel Fingerprint",
    description: "Eight short questions about how you travel.",
  },
  {
    href: "/how-it-works",
    label: "How Sawayatra works",
    description: "The practical arrangement behind the club and its journeys.",
  },
];

export function ComingSoonPage({
  title,
  lede,
  children,
  notificationSubject = title,
  onwardLinks = defaultOnwardLinks,
  label = "Coming soon",
  mailSubject,
  mailBody,
  notifyIntro = "Leave your email and we will write once, when this section opens.",
  submitLabel = "Tell me when it opens",
  actionHref,
  actionNote,
}: ComingSoonPageProps) {
  const mailAction = [
    `mailto:${contactEmail}?subject=${encodeURIComponent(
      mailSubject ?? `Please notify me when ${notificationSubject} opens`,
    )}`,
    mailBody ? `&body=${encodeURIComponent(mailBody)}` : "",
  ].join("");

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <div className={styles.wrap}>
        <p className={styles.label}>{label}</p>
        <h1>{title}</h1>
        <p className={styles.lede}>{lede}</p>

        <hr className={styles.rule} />

        {actionHref ? (
          <div className={styles.notify}>
            <p className={styles.actionIntro}>{notifyIntro}</p>
            <Link className={styles.directAction} href={actionHref}>
              {submitLabel}
            </Link>
            {actionNote ? <p className={styles.formNote}>{actionNote}</p> : null}
          </div>
        ) : (
          <form
            className={styles.notify}
            action={mailAction}
            method="post"
            encType="text/plain"
          >
            <label htmlFor="coming-soon-email">{notifyIntro}</label>
            <div className={styles.notifyRow}>
              <input
                id="coming-soon-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <button type="submit">{submitLabel}</button>
            </div>
            <p className={styles.formNote}>
              This opens your email app. Nothing is stored on this website.
            </p>
          </form>
        )}

        <nav className={styles.elsewhere} aria-label="Available Sawayatra sections">
          <p>In the meantime</p>
          <ul>
            {onwardLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  {link.label}
                  <span>{link.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {children}
    </main>
  );
}
