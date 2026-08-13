import styles from "./FactStrip.module.css";

export interface Fact {
  readonly label: string;
  readonly value: string;
}

interface FactStripProps {
  /** Describes the set for a screen reader, e.g. "The Mirror at a glance". */
  label: string;
  facts: readonly Fact[];
}

/**
 * The facts, immediately under the heading, before any prose.
 *
 * This is the one itinerary convention nearly every operator in the category
 * shares - Chimu, Steppes, Wild Frontiers, Intrepid, Wilderness Travel, Natural
 * World Safaris, Aracari, Jacada, Black Tomato and Much Better Adventures all
 * have it. The contents vary from three cells to seven; the position does not.
 * A visitor arrives with the convention already installed, and breaking it
 * costs something.
 *
 * Sawayatra had the facts but had them below a section heading, three screens
 * down, after the promise and the gallery. Same content, wrong place.
 *
 * A definition list rather than a table: these are labelled values, not rows,
 * and a screen reader announces them as pairs. Hairlines rather than boxes,
 * because the site does not draw boxes around things.
 */
export function FactStrip({ label, facts }: FactStripProps) {
  if (facts.length === 0) return null;

  return (
    <dl className={styles.strip} aria-label={label}>
      {facts.map((fact) => (
        <div className={styles.fact} key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
