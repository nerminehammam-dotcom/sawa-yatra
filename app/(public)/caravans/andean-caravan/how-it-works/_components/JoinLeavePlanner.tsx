"use client";

import Link from "next/link";
import { useState } from "react";

import { Arrow } from "@/components/ui/Arrow";

import styles from "./JoinLeavePlanner.module.css";

export interface JoinLeavePlannerSection {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly days: number;
  readonly dayStart: number;
  readonly dayEnd: number;
  readonly join: string;
  readonly leave: string;
  readonly joinAirport: string;
  readonly leaveAirport: string;
  readonly joinNote: string;
}

export interface JoinLeavePlannerShortForm {
  readonly name: string;
  readonly slug: string;
  readonly days: number;
  readonly dayStart: number;
  readonly dayEnd: number;
  readonly join: string;
  readonly leave: string;
  readonly joinAirport: string;
  readonly leaveAirport: string;
  readonly joinNote: string;
}

interface JoinLeavePlannerProps {
  readonly sections: readonly JoinLeavePlannerSection[];
  readonly shortForm: JoinLeavePlannerShortForm;
}

function sectionCountLabel(count: number): string {
  return `${count} ${count === 1 ? "section" : "consecutive sections"}`;
}

export function JoinLeavePlanner({ sections, shortForm }: JoinLeavePlannerProps) {
  const [joinId, setJoinId] = useState(sections[0]?.id ?? "");
  const [leaveId, setLeaveId] = useState(sections.at(-1)?.id ?? "");
  const startIndex = sections.findIndex((section) => section.id === joinId);
  const endIndex = sections.findIndex((section) => section.id === leaveId);
  const selectedSections = sections.slice(startIndex, endIndex + 1);
  const firstSection = selectedSections[0];
  const lastSection = selectedSections.at(-1);
  const totalDays = selectedSections.reduce((sum, section) => sum + section.days, 0);

  if (!firstSection || !lastSection) return null;

  const chooseStart = (nextJoinId: string) => {
    const nextStartIndex = sections.findIndex((section) => section.id === nextJoinId);
    setJoinId(nextJoinId);
    if (endIndex < nextStartIndex) setLeaveId(nextJoinId);
  };

  const registrationHref = {
    pathname: "/register-interest",
    query: {
      join: firstSection.join,
      leave: lastSection.leave,
      days: String(totalDays),
      sections: selectedSections.map((section) => section.id).join("-"),
    },
  };

  const shortFormRegistrationHref = {
    pathname: "/register-interest",
    query: {
      join: shortForm.join,
      leave: shortForm.leave,
      days: String(shortForm.days),
      sections: "stone-road",
    },
  };

  return (
    <div className={styles.planner}>
      <div className={styles.controls}>
        <div className={styles.controlIntro}>
          <p className={styles.kicker}>Choose from four section starts</p>
          <p>
            Every choice follows the Caravan south. Pick a joining gate, then
            choose any later leaving gate. The Cusco short form appears below
            as a separate exception.
          </p>
        </div>

        <fieldset className={styles.fields}>
          <legend className="sr-only">Choose joining and leaving gates</legend>
          <label>
            <span>Join at</span>
            <select
              value={joinId}
              onChange={(event) => chooseStart(event.target.value)}
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.join} - Section {section.id}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Leave at</span>
            <select
              value={leaveId}
              onChange={(event) => setLeaveId(event.target.value)}
            >
              {sections.slice(startIndex).map((section) => (
                <option key={section.id} value={section.id}>
                  {section.leave} - after {section.name}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

      </div>

      <div className={styles.result}>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Your journey is {firstSection.join} to {lastSection.leave}, {sectionCountLabel(selectedSections.length)}, {totalDays} days.
        </p>
        <p className={styles.kicker}>Your Caravan</p>
        <h3>
          {firstSection.join} <span aria-hidden="true">→</span> {lastSection.leave}
        </h3>
        <p className={styles.airportLine}>
          {firstSection.joinAirport} → {lastSection.leaveAirport}
        </p>
        <dl>
          <div>
            <dt>Caravan time</dt>
            <dd>{totalDays} days</dd>
          </div>
          <div>
            <dt>Route</dt>
            <dd>{sectionCountLabel(selectedSections.length)}</dd>
          </div>
          <div>
            <dt>Caravan days</dt>
            <dd>{firstSection.dayStart}–{lastSection.dayEnd}</dd>
          </div>
        </dl>

        <div className={styles.joinRequirement}>
          <p>Before joining in {firstSection.join}</p>
          <p>{firstSection.joinNote}</p>
        </div>

        {lastSection.id === "04" ? (
          <div className={styles.exitFlight}>
            <p>Included exit flight</p>
            <p>
              The Caravan handover ends at Balmaceda Airport. The included
              scheduled flight then returns travellers to Santiago.
            </p>
          </div>
        ) : null}

        <div className={styles.selectedList}>
          <p>Included sections</p>
          <ol>
            {selectedSections.map((section) => (
              <li key={section.id}>
                <Link href={`/journeys/caravans/andean-caravan/${section.slug}`}>
                  <span>{section.id}</span>
                  {section.name}
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <Link className={styles.action} href={registrationHref}>
          Register interest in this run <Arrow />
        </Link>
        <p className={styles.note}>No payment is taken. Sawayatra replies personally.</p>
      </div>

      <aside className={styles.shortFormChoice}>
        <div>
          <p className={styles.kicker}>Cusco short form</p>
          <h3>{shortForm.join} <span aria-hidden="true">→</span> {shortForm.leave}</h3>
          <p>
            {shortForm.name} · {shortForm.days} Caravan days · days {shortForm.dayStart}–{shortForm.dayEnd}
          </p>
          <p>{shortForm.joinNote}</p>
        </div>
        <div className={styles.shortFormLinks}>
          <Link href={`/journeys/caravans/andean-caravan/${shortForm.slug}`}>
            Explore {shortForm.name}
          </Link>
          <Link href={shortFormRegistrationHref}>
            Register interest in the short form
          </Link>
        </div>
      </aside>

      <ol className={styles.range} aria-label="The four consecutive route sections">
        {sections.map((section, index) => {
          const isSelected = index >= startIndex && index <= endIndex;
          return (
            <li key={section.id} data-selected={isSelected ? "true" : undefined}>
              <span>{section.id}</span>
              <small>
                {section.name}
                {isSelected ? <span className="sr-only"> - included</span> : null}
              </small>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
