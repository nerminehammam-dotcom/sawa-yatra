import type { ReactNode } from "react";

import { formUiContent } from "@/content/forms";

import styles from "./forms.module.css";

export interface FieldControlProps {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: (controlProps: FieldControlProps) => ReactNode;
}

export function Field({
  id,
  label,
  required = false,
  hint,
  error,
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        <span>{label}</span>
        {required ? (
          <span className={styles.required}>{formUiContent.requiredLabel}</span>
        ) : null}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {hint ? (
        <p className={styles.hint} id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className={styles.fieldError} id={errorId}>
          <span className={styles.statusWord}>{formUiContent.errorLabel}:</span>{" "}
          {error}
        </p>
      ) : null}
    </div>
  );
}
