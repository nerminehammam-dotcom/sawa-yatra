import type { ArchetypeId } from "@/lib/types";

import styles from "./DepartureFilters.module.css";

export interface DepartureFilterOption {
  readonly id: ArchetypeId;
  readonly label: string;
}

export interface DepartureFiltersProps {
  readonly label: string;
  readonly allLabel: string;
  readonly options: readonly DepartureFilterOption[];
  readonly selected?: ArchetypeId;
}

export function DepartureFilters({
  label,
  allLabel,
  options,
  selected,
}: DepartureFiltersProps) {
  return (
    <form className={styles.form} action="/departures" method="get">
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{label}</legend>
        <div className={styles.scroller}>
          <button
            className={styles.chip}
            type="submit"
            aria-controls="departure-results"
            aria-pressed={!selected}
          >
            {allLabel}
          </button>
          {options.map((option) => (
            <button
              className={styles.chip}
              key={option.id}
              type="submit"
              name="archetype"
              value={option.id}
              aria-controls="departure-results"
              aria-pressed={selected === option.id}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
    </form>
  );
}
