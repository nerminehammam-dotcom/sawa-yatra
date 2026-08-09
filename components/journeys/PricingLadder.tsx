import { specToken } from "@/content/spec-tokens";
import type { LadderView } from "@/lib/journeys/pricing";
import { PRICE_BANDS } from "@/lib/journeys/pricing";

import styles from "./PricingLadder.module.css";

/**
 * §7.5 — the pricing ladder: the section's live state, not a table dropped
 * into the layout. Six bands horizontal (vertical under 380px — the mobile
 * treatment is part of this component, not an afterthought), current band
 * marked, reached bands in darker ink, bands ahead lighter, the minimum-
 * viable-group notch, one live line beneath, and the always-present small
 * type about how the price settles.
 *
 * §7.6 — never: no countdowns, no "seats left", no band that appears to
 * expire. The truthful frame is "travellers so far"; something is being
 * reached, nothing is running out.
 *
 * §7.2 — laddered journeys only. The caller gates on pricingModel; this
 * component refuses to render otherwise.
 */
export function PricingLadder({
  ladder,
  pricingModel,
  minGroupLabel,
}: {
  ladder: LadderView;
  pricingModel: "laddered" | "fixed-seat";
  /** Display form of the MIN_GROUP token (unfilled → dev marker). */
  minGroupLabel?: string;
}) {
  if (pricingModel !== "laddered") {
    // Showing a ladder on fixed-seat inventory would be a straightforward
    // lie (§7.2). Render nothing rather than lie.
    return null;
  }

  const minGroup = minGroupLabel ?? specToken("MIN_GROUP");
  const currentBandNumber = ladder.currentBand?.band ?? null;

  return (
    <figure className={styles.ladder} data-state={ladder.state}>
      <figcaption className={styles.stateLine}>
        {stateLine(ladder)}
      </figcaption>

      <ol className={styles.bands} aria-label="Price bands by group size">
        {PRICE_BANDS.map((band) => {
          const reached =
            currentBandNumber !== null && band.band <= currentBandNumber;
          const isCurrent = currentBandNumber === band.band;
          return (
            <li
              key={band.band}
              className={styles.band}
              data-reached={reached || undefined}
              data-current={isCurrent || undefined}
            >
              <span className={styles.bandSize}>
                {band.minSize === band.maxSize
                  ? `${band.minSize} traveller${band.minSize === 1 ? "" : "s"}`
                  : `${band.minSize}–${band.maxSize}`}
              </span>
              <span className={styles.bandPrice}>{specToken(band.priceToken)}</span>
              {isCurrent ? (
                <span className={styles.youAreHere}>you are here</span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className={styles.minGroupNotch}>
        Minimum viable group: {minGroup}. Below it the section does not run
        and every payment is returned in full — decided and told to you at the
        lock date, not later.
      </p>

      <p className={styles.liveLine}>{liveLine(ladder)}</p>

      <p className={styles.smallType}>
        Everyone at this table pays the same. The price is set by how many of
        us there are, and settles {specToken("LOCK_DAYS")} days before
        departure. If more travellers join, it falls — for all of us.
      </p>
    </figure>
  );
}

function stateLine(ladder: LadderView): string {
  switch (ladder.state) {
    case "empty":
      return "No travellers yet. The table is open.";
    case "below-minimum":
      return "Forming — not yet at the minimum viable group.";
    case "at-minimum":
      return "At the minimum viable group. This section runs.";
    case "mid-band":
      return "Running. The price falls as the group grows.";
    case "final-band":
      return "Final band — the best this table gets.";
    case "locked":
      return "The price has settled. It is final for everyone aboard.";
    case "closed":
      return "This departure is closed.";
    case "cancelled":
      return "This section did not reach its minimum and is not running. Everything paid has been returned in full.";
  }
}

function liveLine(ladder: LadderView): string {
  if (ladder.state === "locked" || ladder.state === "closed") {
    return "The group is settled; nobody's price moves now.";
  }
  if (ladder.state === "cancelled") {
    return "";
  }
  if (ladder.travellers === 0) {
    return "Every traveller who joins lowers the price for everyone already committed.";
  }
  if (ladder.nextBand && ladder.joinersToNextBand !== null) {
    const plural = ladder.joinersToNextBand === 1 ? "" : "s";
    return `${ladder.travellers} traveller${
      ladder.travellers === 1 ? "" : "s"
    } so far. ${ladder.joinersToNextBand} more traveller${plural} and the price falls to ${specToken(
      ladder.nextBand.priceToken,
    )} — for everyone, including you.`;
  }
  return `${ladder.travellers} travellers so far — the final band. Every seat filled keeps it there.`;
}
