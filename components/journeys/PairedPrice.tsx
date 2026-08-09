import { specToken } from "@/content/spec-tokens";
import type { LadderView } from "@/lib/journeys/pricing";
import { FLOOR_PRICE_TOKEN } from "@/lib/journeys/pricing";

import styles from "./PairedPrice.module.css";

/**
 * Locked rule 4.9 / §7.4 — the paired price is ONE component. The "from"
 * floor and today's real price are a single, inseparable unit: same block,
 * comparable weight. There is no export that renders the floor alone.
 *
 * Where a surface can render only one number, it renders today's price,
 * never the floor — that is `<TodaysPriceOnly>`, below.
 *
 * §7.2 — this component is for laddered journeys only; fixed-seat inventory
 * renders a flat rate elsewhere. Passing a fixed-seat journey is a bug.
 */
export function PairedPrice({ ladder }: { ladder: LadderView }) {
  const floor = specToken(FLOOR_PRICE_TOKEN);
  const today = todaysPrice(ladder);

  return (
    <div className={styles.block}>
      <p className={styles.from}>
        From {floor} per person, at twelve travellers.
      </p>
      <p className={styles.today}>
        {ladder.travellers === 0 ? (
          <>No travellers yet — the first pays {today}.</>
        ) : (
          <>
            {travellerCount(ladder.travellers)} so far — today, {today} each.
          </>
        )}{" "}
        Every traveller who joins lowers it for everyone.
      </p>
    </div>
  );
}

/**
 * The single-number surface (rule 4.9, last clause): today's price, never
 * the floor. This is the only sanctioned way to show one figure.
 */
export function TodaysPriceOnly({ ladder }: { ladder: LadderView }) {
  return <span className={styles.todayOnly}>{todaysPrice(ladder)}</span>;
}

function todaysPrice(ladder: LadderView): string {
  // With no travellers, "today's price" is what the first traveller would
  // pay — band 1. Otherwise it is the current band's per-person price.
  const bandToken = ladder.currentBand?.priceToken ?? "PRICE_T1";
  return specToken(bandToken);
}

function travellerCount(count: number): string {
  const words = [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
  ] as const;
  const word = words[count];
  return word !== undefined
    ? `${word} traveller${count === 1 ? "" : "s"}`
    : `${count} travellers`;
}
