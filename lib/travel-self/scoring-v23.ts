import {
  ARCHETYPES,
  ARCHETYPE_BY_SIGNATURE,
  AXES,
  BEND_FIVE,
  BEND_FOUR,
  BEND_ORDER,
  COMFORT_LABEL,
  FAMILY_LINE,
  FRICTION,
  FRICTION_ALL_FLEXIBLE,
  FRICTION_ORDER,
  NO_BENDS,
  PASSIONS,
  SPREAD_LINE,
  signatureFor,
  type Axis,
  type Family,
  type Pole,
} from "@/content/travel-self/travel-self-model";
import type {
  PassionName,
  TimeTogether,
  TravelSelfAnswers,
} from "@/lib/travel-self/state-machine";

export type CompletePositions = Record<Axis, Pole>;

export interface TravelSelfResultV23 {
  readonly signature: string;
  readonly name: string;
  readonly readout: string;
  readonly essence: string;
  readonly bring: string;
  readonly travelFor: string;
  readonly comfort: (typeof COMFORT_LABEL)[keyof typeof COMFORT_LABEL];
  readonly timeTogether: TimeTogether;
  readonly bendOn: string;
  readonly feelItWhen: string;
  readonly passions: readonly [PassionName, PassionName, PassionName];
  readonly lead: PassionName;
}

const AXIS_BY_KEY = Object.fromEntries(
  AXES.map((axis) => [axis.key, axis]),
) as Record<Axis, (typeof AXES)[number]>;

const PASSION_BY_NAME = new Map(
  PASSIONS.map((passion) => [passion.name, passion] as const),
);

const ARCHETYPE_DETAILS_BY_NAME = new Map(
  ARCHETYPES.map((archetype) => [archetype.name, archetype] as const),
);

function completePositions(
  positions: TravelSelfAnswers["positions"],
): CompletePositions | null {
  const entries = AXES.map((axis) => {
    const value = positions[axis.key];
    return value === undefined ? null : ([axis.key, value] as const);
  });

  if (entries.some((entry) => entry === null)) return null;
  return Object.fromEntries(entries as [Axis, Pole][]) as CompletePositions;
}

function completePassions(
  passions: TravelSelfAnswers["passions"],
): readonly [PassionName, PassionName, PassionName] | null {
  if (passions.length !== 3 || new Set(passions).size !== 3) return null;
  if (passions.some((passion) => !PASSION_BY_NAME.has(passion))) return null;
  return passions as readonly [PassionName, PassionName, PassionName];
}

export function motivationLineV23(
  passions: readonly [PassionName, PassionName, PassionName],
): string {
  const families = passions.map((passion) => {
    const item = PASSION_BY_NAME.get(passion);
    if (!item) throw new Error(`Unknown Travel Self passion: ${passion}`);
    return item.family;
  });

  const counts = new Map<Family, number>();
  for (const family of families) {
    counts.set(family, (counts.get(family) ?? 0) + 1);
  }

  const dominant = [...counts.entries()].find(([, count]) => count >= 2)?.[0];
  if (dominant) return FAMILY_LINE[dominant];

  const spreadKey = [...new Set(families)].sort().join("+");
  const spreadLine = SPREAD_LINE[spreadKey];
  if (!spreadLine) {
    throw new Error(`Missing Travel Self motivation line: ${spreadKey}`);
  }
  return spreadLine;
}

export function bendLineV23(positions: CompletePositions): string {
  const bends = BEND_ORDER.filter((axis) => {
    const position = positions[axis];
    return position === 3 || position === 4;
  });

  if (bends.length === 0) return NO_BENDS;
  if (bends.length <= 3) {
    return `${bends.map((axis) => AXIS_BY_KEY[axis].label).join(", ")}.`;
  }
  if (bends.length === 4) {
    const firmAxis = BEND_ORDER.find((axis) => !bends.includes(axis));
    if (!firmAxis) throw new Error("Expected one firm Travel Self axis");
    return BEND_FOUR(AXIS_BY_KEY[firmAxis].label.toLowerCase());
  }
  return BEND_FIVE;
}

export function frictionLineV23(positions: CompletePositions): string {
  for (const axis of FRICTION_ORDER) {
    const position = positions[axis];
    if (position === 3 || position === 4) continue;

    const pole = position <= 2
      ? AXIS_BY_KEY[axis].left.name
      : AXIS_BY_KEY[axis].right.name;
    const line = FRICTION[`${axis}|${pole}`];
    if (!line) throw new Error(`Missing Travel Self friction line: ${axis}|${pole}`);
    return line;
  }
  return FRICTION_ALL_FLEXIBLE;
}

export function scoreTravelSelfV23(
  answers: TravelSelfAnswers,
): TravelSelfResultV23 | null {
  const positions = completePositions(answers.positions);
  const passions = completePassions(answers.passions);
  if (
    !positions
    || !answers.timeTogether
    || !passions
    || !answers.lead
    || !passions.includes(answers.lead)
  ) {
    return null;
  }

  const signature = signatureFor(positions);
  const name = ARCHETYPE_BY_SIGNATURE[signature];
  if (!name) throw new Error(`Missing Travel Self archetype: ${signature}`);

  const archetype = ARCHETYPE_DETAILS_BY_NAME.get(name);
  if (!archetype) throw new Error(`Missing Travel Self portrait: ${name}`);

  return {
    signature,
    name,
    readout: archetype.readout,
    essence: archetype.essence,
    bring: archetype.bring,
    travelFor: motivationLineV23(passions),
    comfort: positions.comfort <= 3
      ? COMFORT_LABEL.first
      : COMFORT_LABEL.second,
    timeTogether: answers.timeTogether,
    bendOn: bendLineV23(positions),
    feelItWhen: frictionLineV23(positions),
    passions,
    lead: answers.lead,
  };
}
