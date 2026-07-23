import { formUiContent } from "@/content/forms";

import styles from "./forms.module.css";

export function MockModeNotice() {
  return (
    <aside
      className={styles.mockNotice}
      aria-label={formUiContent.mockNotice.ariaLabel}
    >
      <strong>{formUiContent.mockNotice.title}</strong>
      <p>{formUiContent.mockNotice.body}</p>
    </aside>
  );
}
