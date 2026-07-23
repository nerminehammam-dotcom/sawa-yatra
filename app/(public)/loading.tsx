import styles from "@/app/system.module.css";
import { systemUiContent } from "@/content/legal-placeholders";

export default function Loading() {
  const content = systemUiContent.loading;

  return (
    <section
      className={styles.skeletonPage}
      aria-label={content.label}
      aria-busy="true"
      aria-live="polite"
    >
      <p className="sr-only">{content.announcement}</p>
      <div className={styles.skeleton} aria-hidden="true">
        <div className={styles.skeletonLine} />
        <div
          className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}
        />
        <div className={styles.skeletonBlock} />
      </div>
    </section>
  );
}
