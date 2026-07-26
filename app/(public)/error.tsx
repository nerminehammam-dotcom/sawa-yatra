"use client";

import { useEffect } from "react";

import styles from "@/app/system.module.css";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ContentStatusLabel } from "@/components/ui/ContentStatusLabel";
import {
  systemPageContent,
  systemUiContent,
} from "@/content/legal-placeholders";

export default function PublicError({
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
    <main
      className={styles.page}
      id="main-content"
      tabIndex={-1}
      aria-labelledby="public-error-title"
    >
      <div className={styles.panel}>
        <div className={styles.statusRow}>
          <ContentStatusLabel status={content.contentStatus} />
        </div>
        <p className={`${styles.eyebrow} ${styles.statusEyebrow}`}>
          {content.eyebrow}
        </p>
        <h1 className={styles.title} id="public-error-title">
          {content.title}
        </h1>
        <p className={styles.copy}>{content.body}</p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={unstable_retry}>
            {systemUiContent.retryAction.label}
          </Button>
          {content.actions.map((action) => (
            <ButtonLink
              key={action.href}
              href={action.href}
              variant={action.style}
            >
              {action.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </main>
  );
}
