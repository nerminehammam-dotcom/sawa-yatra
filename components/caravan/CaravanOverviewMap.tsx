"use client";

import { useState } from "react";

import styles from "./CaravanOverviewMap.module.css";

interface SectionChoice {
  readonly id: string;
  readonly number: string;
  readonly name: string;
  readonly days: number;
  readonly dayStart: number;
  readonly dayEnd: number;
  readonly gateFrom: string;
  readonly gateTo: string;
}

interface GatePoint {
  readonly id: string;
  readonly name: string;
  readonly day: number | undefined;
  readonly altitudeMetres: number | null;
  readonly altitudeDisplay: string;
}

interface AltitudePoint { readonly day: number; readonly metres: number }

const WIDTH = 1000;
const HEIGHT = 650;
const x = (metres: number) => 96 + (metres / 5000) * 780;
const y = (day: number) => 58 + ((day - 1) / 70) * 520;

export function CaravanOverviewMap({
  sections,
  gates,
  altitudePoints,
}: {
  sections: readonly SectionChoice[];
  gates: readonly GatePoint[];
  altitudePoints: readonly AltitudePoint[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "01");
  const active = sections.find((section) => section.id === activeId) ?? sections[0];
  const activePoints = altitudePoints.filter(
    (point) => active && point.day >= active.dayStart && point.day <= active.dayEnd,
  );
  const polyline = activePoints.map((point) => `${x(point.metres)},${y(point.day)}`).join(" ");

  return (
    <div className={styles.root}>
      <div className={styles.controls} aria-label="Choose a Caravan section on the route map">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={styles.sectionButton}
            aria-pressed={section.id === activeId}
            onClick={() => setActiveId(section.id)}
            onFocus={() => setActiveId(section.id)}
            onPointerEnter={() => setActiveId(section.id)}
          >
            <span>{section.number} · {section.name}</span>
            <small>{section.gateFrom} → {section.gateTo} · {section.days} days</small>
          </button>
        ))}
      </div>

      <div className={styles.mapFrame}>
        <p className={styles.mapNote}>Route sequence runs down. Known overnight altitude runs across.</p>
        <svg className={styles.map} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="level-one-map-title level-one-map-desc">
          <title id="level-one-map-title">The Andean Caravan overview map</title>
          <desc id="level-one-map-desc">Four selectable route sections shown vertically from Lima to Balmaceda, with horizontal position indicating known overnight altitude. Unknown sleeping altitudes remain omitted pending contracts.</desc>
          {[0, 1000, 2000, 3000, 4000, 5000].map((metres) => (
            <g key={metres} className={styles.axis}>
              <line x1={x(metres)} y1="34" x2={x(metres)} y2="606" />
              <text x={x(metres)} y="628" textAnchor="middle">{metres === 0 ? "sea" : `${metres / 1000}k m`}</text>
            </g>
          ))}
          {sections.map((section) => (
            <rect
              key={section.id}
              className={section.id === activeId ? styles.bandActive : styles.band}
              x="72"
              y={y(section.dayStart) - 14}
              width="834"
              height={Math.max(38, y(section.dayEnd) - y(section.dayStart) + 28)}
            />
          ))}
          {polyline ? <polyline className={styles.routeLine} points={polyline} /> : null}
          {gates.map((gate) => gate.day !== undefined && gate.altitudeMetres !== null ? (
            <g key={gate.id} className={styles.gate} transform={`translate(${x(gate.altitudeMetres)} ${y(gate.day)})`}>
              <circle r="10" />
              <text x="18" y="6">{gate.name} · {gate.altitudeDisplay}</text>
            </g>
          ) : null)}
        </svg>
        <p className={styles.pending}>Known overnight values only. Contract-pending sleep altitudes create deliberate gaps in the record.</p>
      </div>
    </div>
  );
}

