import { getFounderCopyStressFixtures } from "@/content/caravan/specimen";

import styles from "./stress.module.css";

export default function CaravanCopyStressFixturePage() {
  const fixtures = getFounderCopyStressFixtures();
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p>Phase 3 · neutral stress-test fixture</p>
        <h1>Founder-copy ceilings</h1>
        <p>“Measure” is intentionally neutral. These are layout fixtures, not proposed Sawayatra copy.</p>
      </header>
      <ul className={styles.list}>
        {fixtures.map(({ slot, value }) => (
          <li key={slot.slotId} className={styles.fixture}>
            <code>{slot.slotId} · {value.length}/{slot.maxLength}</code>
            <p>{value}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
