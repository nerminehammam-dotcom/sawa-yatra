import styles from "@/app/system.module.css";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { systemUiContent } from "@/content/legal-placeholders";
import type { LegalPagePlaceholder } from "@/lib/types";

export function LegalPlaceholderPage({
  content,
}: {
  content: LegalPagePlaceholder;
}) {
  const titleId = `${content.id}-title`;
  const interfaceContent = systemUiContent.legal;

  return (
    <main
      className={styles.legalPage}
      id="main-content"
      tabIndex={-1}
      aria-labelledby={titleId}
    >
      <Container size="narrow" className={styles.legalDocument}>
        <header className={styles.legalHeader}>
          <p className={`${styles.eyebrow} ${styles.statusEyebrow}`}>
            {content.reviewLabel.charAt(0) + content.reviewLabel.slice(1).toLocaleLowerCase("en")}
          </p>
          <h1 className={styles.legalTitle} id={titleId}>
            {content.title}
          </h1>
          <p className={styles.legalNotice} role="note">
            {content.notice}
          </p>
        </header>

        <div className={styles.legalBody}>
          {content.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <dl className={styles.legalMeta}>
          <div>
            <dt>{interfaceContent.lastReviewedLabel}</dt>
            <dd>{content.lastReviewed}</dd>
          </div>
        </dl>

        <ButtonLink
          href={interfaceContent.returnHomeAction.href}
          variant={interfaceContent.returnHomeAction.style}
        >
          {interfaceContent.returnHomeAction.label}
        </ButtonLink>
      </Container>
    </main>
  );
}
