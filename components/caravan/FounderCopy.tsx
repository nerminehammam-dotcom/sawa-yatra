import type { FounderCopySlot } from "@/content/caravan/specimen";

import styles from "./FounderCopy.module.css";

export function FounderCopy({ slot, inline = false }: { slot: FounderCopySlot; inline?: boolean }) {
  const Tag = inline ? "span" : "p";
  return (
    <Tag className={styles.placeholder} data-copy-slot={slot.slotId}>
      [COPY: {slot.slotId} · ≤{slot.maxLength}]
    </Tag>
  );
}

