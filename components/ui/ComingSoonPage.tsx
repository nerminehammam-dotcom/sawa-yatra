import Link from "next/link";

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
  notificationSubject?: string;
  onwardLinks?: readonly OnwardLink[];
}

const defaultOnwardLinks: readonly OnwardLink[] = [
  {
    href: "/caravans/andean",
    label: "The Andean Caravan",
    description: "71 days, Lima to Patagonia. Join one route section or all nine.",
  },
  {
    href: "/travel-self",
    label: "Meet your Travel Self",
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
  notificationSubject = title,
  onwardLinks = defaultOnwardLinks,
}: ComingSoonPageProps) {
  const mailAction = `mailto:${contactEmail}?subject=${encodeURIComponent(
    `Please notify me when ${notificationSubject} opens`,
  )}`;

  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <div className={styles.wrap}>
        <p className={styles.label}>Coming soon</p>
        <h1>{title}</h1>
        <p className={styles.lede}>{lede}</p>

        <hr className={styles.rule} />

        <form
          className={styles.notify}
          action={mailAction}
          method="post"
          encType="text/plain"
        >
          <label htmlFor="coming-soon-email">
            Leave your email and we will write once, when this section opens.
          </label>
          <div className={styles.notifyRow}>
            <input
              id="coming-soon-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <button type="submit">Tell me when it opens</button>
          </div>
          <p className={styles.formNote}>
            This opens your email app. Nothing is stored on this website.
          </p>
        </form>

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
    </main>
  );
}
