import styles from "./forms.module.css";

export type FormStatusTone =
  | "pending"
  | "validation"
  | "network-error"
  | "success"
  | "duplicate";

interface FormStatusProps {
  tone: FormStatusTone;
  title: string;
  message: string;
}

export function FormStatus({ tone, title, message }: FormStatusProps) {
  const isAlert = tone === "validation" || tone === "network-error";

  return (
    <div
      className={styles.formStatus}
      data-tone={tone}
      role={isAlert ? "alert" : "status"}
      aria-live={isAlert ? "assertive" : "polite"}
      aria-atomic="true"
      tabIndex={tone === "validation" ? -1 : undefined}
    >
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}
