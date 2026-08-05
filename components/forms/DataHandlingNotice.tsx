import { formUiContent } from "@/content/forms";

import styles from "./forms.module.css";

/**
 * Was DataHandlingNotice, which told every visitor the form was a development
 * mock. Submissions are now delivered, so this states what actually happens
 * to what they typed.
 */
export function DataHandlingNotice() {
  return (
    <aside
      className={styles.handlingNotice}
      aria-label={formUiContent.handlingNotice.ariaLabel}
    >
      <strong>{formUiContent.handlingNotice.title}</strong>
      <p>{formUiContent.handlingNotice.body}</p>
    </aside>
  );
}
