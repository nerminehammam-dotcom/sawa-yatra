import type { ReactNode } from "react";

import styles from "./FieldDocument.module.css";

export function SignalStatement({ children }: { children: ReactNode }) {
  return (
    <section className={styles.signal} aria-label="Caravan statement">
      <span aria-hidden="true">MOVING / ANNUAL</span>
      <p>{children}</p>
    </section>
  );
}
