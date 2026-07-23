"use client";

import Link from "next/link";
import { useEffect } from "react";

import styles from "@/app/system.module.css";
import {
  systemPageContent,
  systemUiContent,
} from "@/content/legal-placeholders";
import { siteConfig } from "@/content/site";

import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const content = systemPageContent.error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <title>{`${content.eyebrow} | ${siteConfig.name}`}</title>
        <main className={styles.globalPage} id="main-content">
          <div className={styles.panel}>
            <p className={styles.eyebrow}>{content.eyebrow}</p>
            <h1 className={styles.title}>{content.title}</h1>
            <p className={styles.copy}>{content.body}</p>
            <div className={styles.actions}>
              <button
                className={styles.secondary}
                type="button"
                onClick={unstable_retry}
              >
                {systemUiContent.retryAction.label}
              </button>
              {content.actions.map((action) => (
                <Link
                  key={action.href}
                  className={
                    action.style === "primary"
                      ? styles.primary
                      : styles.secondary
                  }
                  href={action.href}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
