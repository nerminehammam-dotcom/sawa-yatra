import styles from "@/app/system.module.css";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ContentStatusLabel } from "@/components/ui/ContentStatusLabel";
import { systemPageContent } from "@/content/legal-placeholders";

export function NotFoundContent() {
  const content = systemPageContent.notFound;

  return (
    <main
      className={styles.page}
      id="main-content"
      tabIndex={-1}
      aria-labelledby="not-found-title"
    >
      <div className={styles.panel}>
        <div className={styles.statusRow}>
          <ContentStatusLabel status={content.contentStatus} />
        </div>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 className={styles.title} id="not-found-title">
          {content.title}
        </h1>
        <p className={styles.copy}>{content.body}</p>
        <div className={styles.actions}>
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
