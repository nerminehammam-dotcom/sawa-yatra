import type { ReactNode } from "react";

import { Accordion, type AccordionItem } from "./Accordion";
import { classNames } from "./classNames";
import styles from "./Faq.module.css";

export interface FaqProps {
  items: readonly AccordionItem[];
  title?: ReactNode;
  className?: string;
}

export function Faq({
  items,
  title = "Frequently asked questions",
  className,
}: FaqProps) {
  return (
    <section className={classNames(styles.root, className)} aria-labelledby="faq-heading">
      <h2 className={styles.title} id="faq-heading">
        {title}
      </h2>
      <Accordion items={items} />
    </section>
  );
}
