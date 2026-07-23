"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";

import { classNames } from "./classNames";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  id: string;
  question: ReactNode;
  answer: ReactNode;
}

export interface AccordionProps {
  items: readonly AccordionItem[];
  allowMultiple?: boolean;
  initiallyOpen?: readonly string[];
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  initiallyOpen = [],
  className,
}: AccordionProps) {
  const instanceId = useId();
  const [openItems, setOpenItems] = useState<ReadonlySet<string>>(
    () => new Set(initiallyOpen),
  );

  function toggleItem(itemId: string) {
    setOpenItems((current) => {
      const isOpen = current.has(itemId);

      if (isOpen) {
        const next = new Set(current);
        next.delete(itemId);
        return next;
      }

      return allowMultiple ? new Set([...current, itemId]) : new Set([itemId]);
    });
  }

  return (
    <div className={classNames(styles.root, className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const triggerId = `${instanceId}-${item.id}-trigger`;
        const panelId = `${instanceId}-${item.id}-panel`;

        return (
          <section className={styles.item} key={item.id}>
            <h3 className={styles.heading}>
              <button
                type="button"
                className={styles.trigger}
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
              >
                <span>{item.question}</span>
                <span className={styles.indicator} aria-hidden="true">
                  {isOpen ? "Close" : "Open"}
                </span>
              </button>
            </h3>
            <div
              className={styles.panel}
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
            >
              {item.answer}
            </div>
          </section>
        );
      })}
    </div>
  );
}
