import type { UseFormRegisterReturn } from "react-hook-form";

import { formUiContent } from "@/content/forms";

import styles from "./forms.module.css";

interface ConsentFieldProps {
  id: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

export function ConsentField({
  id,
  registration,
  error,
}: ConsentFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={styles.consentGroup}>
      <label className={styles.consentLabel} htmlFor={id}>
        <input
          {...registration}
          className={styles.checkbox}
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
        />
        <span>
          <strong>{formUiContent.consent.statusLabel}</strong>{" "}
          {formUiContent.consent.body}
        </span>
      </label>
      {error ? (
        <p className={styles.fieldError} id={errorId}>
          <span className={styles.statusWord}>{formUiContent.errorLabel}:</span>{" "}
          {error}
        </p>
      ) : null}
    </div>
  );
}
