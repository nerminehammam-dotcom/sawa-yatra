/**
 * Sawayatra Travel Self v2
 *
 * Pure data and pure functions. No React, browser, analytics, or persistence
 * dependencies belong in this file.
 *
 * Editorial status: DRAFT. The sixteen prompts, passion centroids, modifiers,
 * and section profiles must be validated and approved before being LOCKED.
 */

export const TRAVEL_SELF_MODEL_VERSION = 2 as const;
export const TRAVEL_SELF_STORAGE_KEY = "sawayatra.travel-self.v2" as const;
export const MIN_POLE = 0.2;

export const AXIS_IDS = [
  "rhythm",
  "discovery",
  "socialEnergy",
  "clock",
  "threshold",
  "focus",
] as const;

export type AxisId = (typeof AXIS_IDS)[number];
export type AxisDirection = "negative" | "positive";
export type AxisVector = Readonly<Record<AxisId, number>>;

export interface AxisDefinition {
  readonly id: AxisId;
  readonly label: string;
  readonly negativeLabel: string;
  readonly positiveLabel: string;
}

export const AXES: readonly AxisDefinition[] = [
  {
    id: "rhythm",
    label: "Rhythm",
    negativeLabel: "unhurried",
    positiveLabel: "full-stride",
  },
  {
    id: "discovery",
    label: "Discovery",
    negativeLabel: "mapped",
    positiveLabel: "improvising",
  },
  {
    id: "socialEnergy",
    label: "Social energy",
    negativeLabel: "private",
    positiveLabel: "gathering",
  },
  {
    id: "clock",
    label: "Clock",
    negativeLabel: "dawn-led",
    positiveLabel: "after-dark",
  },
  {
    id: "threshold",
    label: "Threshold",
    negativeLabel: "measured",
    positiveLabel: "edge-seeking",
  },
  {
    id: "focus",
    label: "Focus",
    negativeLabel: "one place deeply",
    positiveLabel: "many places lightly",
  },
] as const;

const axisById = Object.fromEntries(
  AXES.map((axis) => [axis.id, axis]),
) as Readonly<Record<AxisId, AxisDefinition>>;

export interface TravelSelfOption {
  readonly id: string;
  readonly label: string;
  readonly value: -1 | 1;
}

export interface TravelSelfQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly axis: AxisId;
  readonly options: readonly [TravelSelfOption, TravelSelfOption];
  readonly contentStatus: "DRAFT";
  readonly contentNote: string;
}

const option = (
  id: string,
  label: string,
  value: -1 | 1,
): TravelSelfOption => ({ id, label, value });

/**
 * DRAFT item bank. Five scenarios descend from earlier Sawayatra product copy;
 * the remaining prompts complete the approved six-axis, sixteen-item structure.
 * All sixteen require the validation pass described in the handoff brief.
 */
export const TRAVEL_SELF_QUESTIONS = [
  {
    id: "rhythm-free-hours",
    axis: "rhythm",
    prompt: "You have two free hours in a place you may never see again. What do you do?",
    options: [
      option("rhythm-free-hours-deep", "Choose one thing and give it the whole two hours", -1),
      option("rhythm-free-hours-wide", "Fit in two or three things while the door is open", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated forced-choice item.",
  },
  {
    id: "rhythm-plan-ends",
    axis: "rhythm",
    prompt: "The planned visit ends earlier than expected. What feels better?",
    options: [
      option("rhythm-plan-ends-linger", "Stay nearby and let the place continue", -1),
      option("rhythm-plan-ends-add", "Use the time for one more stop", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated forced-choice item.",
  },
  {
    id: "rhythm-long-lunch",
    axis: "rhythm",
    prompt: "Lunch has become long and nobody is watching the clock. Your instinct?",
    options: [
      option("rhythm-long-lunch-keep", "Protect the long lunch", -1),
      option("rhythm-long-lunch-move", "Enjoy it, then get the day moving again", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated forced-choice item.",
  },
  {
    id: "discovery-dinner",
    axis: "discovery",
    prompt: "Dinner reservations fall through. What happens next?",
    options: [
      option("discovery-dinner-backup", "I have a backup, or I make one quickly", -1),
      option("discovery-dinner-wander", "Good. Let us see what we find", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Scenario retained from the approved visual-manual specimen; scoring is new and unvalidated.",
  },
  {
    id: "discovery-road-closes",
    axis: "discovery",
    prompt: "The road closes and the day has to change. What steadies you?",
    options: [
      option("discovery-road-closes-plan", "A clear replacement plan", -1),
      option("discovery-road-closes-detour", "The possibility that the detour becomes the day", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated forced-choice item.",
  },
  {
    id: "discovery-first-afternoon",
    axis: "discovery",
    prompt: "You arrive in a new city with one unscheduled afternoon. Where do you begin?",
    options: [
      option("discovery-first-afternoon-mark", "Mark one destination and make my way there", -1),
      option("discovery-first-afternoon-follow", "Follow the first street that pulls me", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Adapted from an earlier Sawayatra behavioural-scenario seed; unvalidated in this form.",
  },
  {
    id: "social-only-awake",
    axis: "socialEnergy",
    prompt: "You are the only one awake and the morning has begun. What do you do?",
    options: [
      option("social-only-awake-go", "Go. I like having the world to myself", -1),
      option("social-only-awake-wait", "Wait a little. I want to share the start", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Adapted from an earlier Sawayatra behavioural-scenario seed; unvalidated in this form.",
  },
  {
    id: "social-late-table",
    axis: "socialEnergy",
    prompt: "Dinner is over, but the table is still talking. Where are you?",
    options: [
      option("social-late-table-leave", "Happy to slip away before the second life of the evening", -1),
      option("social-late-table-stay", "Still there. This is often the best part", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated forced-choice item.",
  },
  {
    id: "social-full-day",
    axis: "socialEnergy",
    prompt: "After a full day with the group, what restores you?",
    options: [
      option("social-full-day-alone", "A closed door and an hour with nobody", -1),
      option("social-full-day-together", "One more drink with whoever is still awake", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated forced-choice item.",
  },
  {
    id: "clock-early-start",
    axis: "clock",
    prompt: "The group wants to leave for a day trip at 7am. How do you feel?",
    options: [
      option("clock-early-start-ready", "Good. The day is best before everyone arrives", -1),
      option("clock-early-start-later", "I will do it, but my real day begins later", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Adapted from an earlier Sawayatra behavioural-scenario seed; this thin axis needs validation.",
  },
  {
    id: "clock-late-evening",
    axis: "clock",
    prompt: "It is 10pm in a city that is still fully awake. Your instinct?",
    options: [
      option("clock-late-evening-sleep", "Leave something for dawn", -1),
      option("clock-late-evening-begin", "Now the city is becoming interesting", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated forced-choice item on a thin axis.",
  },
  {
    id: "threshold-simple-room",
    axis: "threshold",
    prompt: "The route is remarkable. Tonight's room is very simple. What matters most?",
    options: [
      option("threshold-simple-room-reset", "I need enough comfort to reset properly", -1),
      option("threshold-simple-room-route", "If it is clean and honest, the route wins", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Taste only; it must never be used as a medical, access, or care question.",
  },
  {
    id: "threshold-weather",
    axis: "threshold",
    prompt: "The weather turns rough halfway through the day. What sounds right?",
    options: [
      option("threshold-weather-return", "Turn back before the day becomes an ordeal", -1),
      option("threshold-weather-continue", "Continue carefully if the route remains responsibly open", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated taste item; it does not assess physical suitability or override safety decisions.",
  },
  {
    id: "threshold-no-signal",
    axis: "threshold",
    prompt: "The road becomes remote and your phone loses signal. What changes first?",
    options: [
      option("threshold-no-signal-tension", "I become more alert until connection returns", -1),
      option("threshold-no-signal-attention", "My attention finally arrives where I am", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated forced-choice item.",
  },
  {
    id: "focus-four-days",
    axis: "focus",
    prompt: "You have four days in one region. Which shape feels richer?",
    options: [
      option("focus-four-days-base", "One base, known properly", -1),
      option("focus-four-days-route", "A route that changes the view each day", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated forced-choice item on a thin axis.",
  },
  {
    id: "focus-market",
    axis: "focus",
    prompt: "A market, a museum and a landscape all compete for the same afternoon. What do you choose?",
    options: [
      option("focus-market-one", "One, without rushing it", -1),
      option("focus-market-sample", "A piece of each; the contrast is the point", 1),
    ],
    contentStatus: "DRAFT",
    contentNote: "Unvalidated forced-choice item on a thin axis.",
  },
] as const satisfies readonly TravelSelfQuestion[];

export type TravelSelfAnswers = Readonly<Record<string, string>>;

export interface AxisCoverage {
  readonly itemCount: number;
  readonly negativeLoads: number;
  readonly positiveLoads: number;
  readonly canSingleItemFlipPole: boolean;
  readonly thin: boolean;
}

function buildAxisCoverage(): Readonly<Record<AxisId, AxisCoverage>> {
  return Object.fromEntries(
    AXIS_IDS.map((axisId) => {
      const questions = TRAVEL_SELF_QUESTIONS.filter(
        (question) => question.axis === axisId,
      );
      return [
        axisId,
        {
          itemCount: questions.length,
          negativeLoads: questions.filter((question) =>
            question.options.some((answer) => answer.value === -1),
          ).length,
          positiveLoads: questions.filter((question) =>
            question.options.some((answer) => answer.value === 1),
          ).length,
          canSingleItemFlipPole: questions.length <= 2,
          thin: questions.length < 3,
        },
      ];
    }),
  ) as Readonly<Record<AxisId, AxisCoverage>>;
}

export const AXIS_COVERAGE = buildAxisCoverage();

export const PASSION_IDS = [
  "food",
  "nature",
  "adventure",
  "history",
  "architecture",
  "art",
  "photography",
  "wildlife",
  "ritual",
  "music",
  "craft",
  "localLife",
] as const;

export type PassionId = (typeof PASSION_IDS)[number];

export interface Passion {
  readonly id: PassionId;
  readonly label: string;
  readonly noun: string;
  readonly shortDescription: string;
  readonly centroid: AxisVector;
  readonly contentStatus: "DRAFT";
}

const vector = (
  rhythm: number,
  discovery: number,
  socialEnergy: number,
  clock: number,
  threshold: number,
  focus: number,
): AxisVector => ({ rhythm, discovery, socialEnergy, clock, threshold, focus });

/** DRAFT estimated centroids. Replace with approved or observed data. */
export const PASSIONS = [
  {
    id: "food",
    label: "Food",
    noun: "Epicurean",
    shortDescription: "Markets, kitchens, long lunches and the table itself.",
    centroid: vector(-0.2, 0.35, 0.45, 0.05, 0.05, -0.15),
    contentStatus: "DRAFT",
  },
  {
    id: "nature",
    label: "Nature",
    noun: "Listener",
    shortDescription: "Land, weather, silence and the living world.",
    centroid: vector(-0.35, 0.15, -0.2, -0.35, 0.35, -0.35),
    contentStatus: "DRAFT",
  },
  {
    id: "adventure",
    label: "Adventure",
    noun: "Ranger",
    shortDescription: "Exposure, movement and the edge of the known route.",
    centroid: vector(0.25, 0.45, 0.05, -0.05, 0.65, 0.25),
    contentStatus: "DRAFT",
  },
  {
    id: "history",
    label: "History",
    noun: "Timekeeper",
    shortDescription: "What happened here, what remains and what was erased.",
    centroid: vector(-0.25, -0.1, -0.15, -0.15, -0.1, -0.45),
    contentStatus: "DRAFT",
  },
  {
    id: "architecture",
    label: "Architecture",
    noun: "Pilgrim",
    shortDescription: "Buildings, streets, form and the made world.",
    centroid: vector(-0.15, -0.15, -0.1, 0, -0.05, -0.5),
    contentStatus: "DRAFT",
  },
  {
    id: "art",
    label: "Art",
    noun: "Curator",
    shortDescription: "Images, objects, studios and visual language.",
    centroid: vector(-0.2, 0.15, -0.1, 0.1, 0.1, -0.35),
    contentStatus: "DRAFT",
  },
  {
    id: "photography",
    label: "Photography",
    noun: "Framer",
    shortDescription: "Light, vantage, patience and the decisive view.",
    centroid: vector(-0.1, 0.2, -0.25, -0.25, 0.25, -0.1),
    contentStatus: "DRAFT",
  },
  {
    id: "wildlife",
    label: "Wildlife",
    noun: "Tracker",
    shortDescription: "Animals, habitats and the patience of watching.",
    centroid: vector(-0.3, 0.15, -0.35, -0.4, 0.4, -0.3),
    contentStatus: "DRAFT",
  },
  {
    id: "ritual",
    label: "Ritual",
    noun: "Witness",
    shortDescription: "Belief, ceremony and the meanings people keep.",
    centroid: vector(-0.35, -0.05, 0.05, -0.2, 0.1, -0.5),
    contentStatus: "DRAFT",
  },
  {
    id: "music",
    label: "Music",
    noun: "Resonator",
    shortDescription: "Sound, performance and the life after dark.",
    centroid: vector(0.05, 0.25, 0.35, 0.3, 0.05, -0.1),
    contentStatus: "DRAFT",
  },
  {
    id: "craft",
    label: "Craft",
    noun: "Maker",
    shortDescription: "Materials, hands, technique and patient work.",
    centroid: vector(-0.3, 0.05, 0.05, -0.05, -0.15, -0.55),
    contentStatus: "DRAFT",
  },
  {
    id: "localLife",
    label: "Local life",
    noun: "Guest",
    shortDescription: "Ordinary rhythms, neighbourhoods and conversation.",
    centroid: vector(-0.25, 0.35, 0.5, 0.05, 0.15, -0.35),
    contentStatus: "DRAFT",
  },
] as const satisfies readonly Passion[];

export const PASSION_BY_ID = Object.fromEntries(
  PASSIONS.map((passion) => [passion.id, passion]),
) as Readonly<Record<PassionId, Passion>>;

export interface PassionSelection {
  readonly primary: PassionId;
  readonly secondary?: PassionId | null;
  readonly also: readonly PassionId[];
}

export interface OperationalProfile {
  readonly exertion: 0 | 1 | 2 | 3 | null;
  readonly peakAltitudeM: number | null;
  readonly acclimatisationDays: number | null;
  readonly remoteness: 0 | 1 | 2 | 3 | null;
  readonly comfortFloor: "basic" | "simple" | "comfortable" | "mixed" | null;
  readonly hoursMovingPerDay: { readonly min: number; readonly max: number } | null;
  readonly dateRigidity: "fixed" | "limited-flexibility" | "flexible" | null;
  readonly rationale: string | null;
}

export interface TravelSection {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly route: string;
  readonly href: string;
  readonly profile: AxisVector;
  readonly experientialRationale: string | null;
  readonly passionFit: Partial<Record<PassionId, 0 | 1 | 2 | 3>>;
  readonly passionRationale: string | null;
  readonly operational: OperationalProfile;
  readonly contentStatus: "DRAFT";
}

const emptyOperational = (): OperationalProfile => ({
  exertion: null,
  peakAltitudeM: null,
  acclimatisationDays: null,
  remoteness: null,
  comfortFloor: null,
  hoursMovingPerDay: null,
  dateRigidity: null,
  rationale: null,
});

const section = (
  id: string,
  slug: string,
  name: string,
  route: string,
  profile: AxisVector,
): TravelSection => ({
  id,
  slug,
  name,
  route,
  href: `/departures/${slug}`,
  profile,
  experientialRationale: null,
  passionFit: {},
  passionRationale: null,
  operational: emptyOperational(),
  contentStatus: "DRAFT",
});

/**
 * DRAFT experiential estimates derived from the current route copy. The Route
 * Product Lead must correct all fifty-four numbers and sign them off. Passion
 * relevance and operational facts are deliberately empty.
 */
export const SECTIONS = [
  section(
    "01",
    "desert-coast",
    "Desert Coast",
    "Lima → Arequipa",
    vector(0.35, 0.15, 0.05, -0.15, 0.3, 0.45),
  ),
  section(
    "02",
    "white-city-deep-canyon",
    "White City, Deep Canyon",
    "Arequipa → Cusco",
    vector(0.05, -0.05, 0, -0.35, 0.55, 0.05),
  ),
  section(
    "03",
    "the-stone-road",
    "The Stone Road",
    "Cusco → Puno",
    vector(-0.1, -0.1, 0.05, -0.2, 0.25, -0.1),
  ),
  section(
    "04",
    "both-shores",
    "Both Shores",
    "Puno → La Paz",
    vector(-0.15, 0.15, 0.35, -0.15, 0.3, -0.15),
  ),
  section(
    "05",
    "thin-air-cloud-forest",
    "Thin Air & Cloud Forest",
    "La Paz → Sucre",
    vector(0.05, 0.25, 0, -0.25, 0.6, 0.1),
  ),
  section(
    "06",
    "silver-and-bone",
    "Silver & Bone",
    "Sucre → Uyuni",
    vector(-0.15, -0.05, 0.05, -0.1, 0.2, -0.35),
  ),
  section(
    "07",
    "the-mirror",
    "The Mirror",
    "Uyuni → San Pedro de Atacama",
    vector(0.15, 0.35, 0.05, -0.4, 0.75, 0.05),
  ),
  section(
    "08",
    "atacama",
    "Atacama",
    "San Pedro de Atacama → Santiago",
    vector(-0.05, 0.05, -0.05, 0, 0.5, -0.2),
  ),
  section(
    "09",
    "the-end-of-the-road",
    "The End of the Road",
    "Santiago → Balmaceda",
    vector(-0.2, 0.35, -0.05, -0.15, 0.55, -0.15),
  ),
] as const satisfies readonly TravelSection[];

export const SECTION_FIT_WEIGHTS = {
  experiential: 0.6,
  passion: 0.4,
} as const;

export const PASSION_WEIGHTS = {
  primary: 1,
  secondary: 0.5,
} as const;

export const CONFIDENCE_CONFIG = {
  marginWeight: 0.5,
  strengthWeight: 0.35,
  coverageWeight: 0.15,
  strengthReference: 0.6,
  thinAxisPenalty: 0.7,
  fullCoverageItemCount: 3,
} as const;

const MODIFIERS: Readonly<Record<AxisId, Record<AxisDirection, string>>> = {
  rhythm: { negative: "Unhurried", positive: "Full-Stride" },
  discovery: { negative: "Mapped", positive: "Unscripted" },
  socialEnergy: { negative: "Hidden", positive: "Gathering" },
  clock: { negative: "Dawn", positive: "After-Dark" },
  threshold: { negative: "Measured", positive: "Far-Edge" },
  focus: { negative: "Deep", positive: "Roaming" },
};

/**
 * Curated exceptions. A null value suppresses a combination and falls back to
 * the bare noun. These are DRAFT editorial examples, not a completed name audit.
 */
const NAME_OVERRIDES: Readonly<Record<string, string | null>> = {
  "food:socialEnergy:negative": "Hidden",
  "food:clock:positive": "Midnight",
  "nature:clock:negative": "Dawn",
  "photography:focus:positive": "Wide-Angle",
  "history:focus:negative": "Deep-Time",
  "music:socialEnergy:positive": "Chorus",
  "ritual:socialEnergy:negative": "Private",
  "architecture:threshold:positive": null,
};

export interface ResidualScore {
  readonly axis: AxisId;
  readonly value: number;
  readonly magnitude: number;
}

export interface ResidualPole {
  readonly winningAxis: AxisId | null;
  readonly direction: AxisDirection | null;
}

export interface TravelSelfFitCopy {
  readonly aligns: string;
  readonly canFlex: string;
  readonly willChafeWith: string;
  readonly needsFromGroup: string;
}

export interface SectionRecommendation {
  readonly sectionId: string;
  readonly section: TravelSection;
  readonly fit: number;
  readonly experientialFit: number;
  readonly passionRelevance: number | null;
  readonly passionSignalAvailable: boolean;
}

export interface TravelSelf {
  readonly id: string;
  readonly name: string;
  readonly noun: string;
  readonly modifier: string | null;
  readonly portrait: string;
  readonly axes: AxisVector;
  readonly axisEvidence: Readonly<Record<AxisId, number>>;
  readonly passionCentroid: AxisVector;
  readonly residuals: readonly ResidualScore[];
  readonly winningAxis: AxisId | null;
  readonly direction: AxisDirection | null;
  readonly confidence: number;
  readonly passions: PassionSelection;
  readonly fit: TravelSelfFitCopy;
  readonly recommendedSections: readonly SectionRecommendation[];
  readonly contentStatus: "DRAFT";
}

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function round(value: number, places = 4): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function isPassionId(value: unknown): value is PassionId {
  return typeof value === "string" && PASSION_IDS.includes(value as PassionId);
}

export function isValidQuestionAnswer(
  questionId: string,
  optionId: string,
): boolean {
  const question = TRAVEL_SELF_QUESTIONS.find((item) => item.id === questionId);
  return Boolean(question?.options.some((answer) => answer.id === optionId));
}

export function hasCompleteAnswers(answers: TravelSelfAnswers): boolean {
  return TRAVEL_SELF_QUESTIONS.every((question) =>
    isValidQuestionAnswer(question.id, answers[question.id] ?? ""),
  );
}

export function validatePassionSelection(
  selection: PassionSelection,
): readonly string[] {
  const errors: string[] = [];
  const rawSelected: readonly unknown[] = [
    selection.primary,
    selection.secondary,
    ...selection.also,
  ];
  if (rawSelected.some((value) => value !== null && value !== undefined && !isPassionId(value))) {
    errors.push("Every passion must use a recognised passion ID.");
  }
  const selected = rawSelected.filter(isPassionId);
  const unique = new Set(selected);

  if (!isPassionId(selection.primary)) errors.push("Choose a primary passion.");
  if (selection.secondary && selection.secondary === selection.primary) {
    errors.push("Primary and secondary passions must be different.");
  }
  if (selected.length !== unique.size) {
    errors.push("Each selected passion may appear only once.");
  }
  if (unique.size > 4) errors.push("Choose no more than four passions.");

  return errors;
}

export function scoreAxes(answers: TravelSelfAnswers): {
  readonly axes: AxisVector;
  readonly evidence: Readonly<Record<AxisId, number>>;
} {
  const sums = Object.fromEntries(AXIS_IDS.map((axis) => [axis, 0])) as Record<
    AxisId,
    number
  >;
  const evidence = Object.fromEntries(AXIS_IDS.map((axis) => [axis, 0])) as Record<
    AxisId,
    number
  >;

  for (const question of TRAVEL_SELF_QUESTIONS) {
    const selected = question.options.find(
      (answer) => answer.id === answers[question.id],
    );
    if (!selected) continue;
    sums[question.axis] += selected.value;
    evidence[question.axis] += 1;
  }

  const axes = Object.fromEntries(
    AXIS_IDS.map((axis) => [
      axis,
      evidence[axis] ? round(sums[axis] / evidence[axis]) : 0,
    ]),
  ) as Record<AxisId, number>;

  return { axes, evidence };
}

export function blendedCentroid(selection: PassionSelection): AxisVector {
  const errors = validatePassionSelection(selection);
  if (errors.length) throw new Error(errors.join(" "));

  const primary = PASSION_BY_ID[selection.primary];
  const secondary = selection.secondary
    ? PASSION_BY_ID[selection.secondary]
    : null;
  const denominator = PASSION_WEIGHTS.primary +
    (secondary ? PASSION_WEIGHTS.secondary : 0);

  return Object.fromEntries(
    AXIS_IDS.map((axis) => {
      const total = primary.centroid[axis] * PASSION_WEIGHTS.primary +
        (secondary?.centroid[axis] ?? 0) * PASSION_WEIGHTS.secondary;
      return [axis, round(total / denominator)];
    }),
  ) as Record<AxisId, number>;
}

export function calculateResiduals(
  axes: AxisVector,
  centroid: AxisVector,
): readonly ResidualScore[] {
  return AXIS_IDS.map((axis) => {
    const value = round(axes[axis] - centroid[axis]);
    return { axis, value, magnitude: Math.abs(value) };
  }).sort((left, right) => {
    const magnitudeDifference = right.magnitude - left.magnitude;
    if (magnitudeDifference !== 0) return magnitudeDifference;
    return AXIS_IDS.indexOf(left.axis) - AXIS_IDS.indexOf(right.axis);
  });
}

export function resolveResidualPole(
  residuals: readonly ResidualScore[],
): ResidualPole {
  const strongest = residuals[0];
  if (!strongest || strongest.magnitude < MIN_POLE) {
    return { winningAxis: null, direction: null };
  }

  return {
    winningAxis: strongest.axis,
    direction: strongest.value < 0 ? "negative" : "positive",
  };
}

export function resolveDisplayName(
  passion: PassionId,
  axis: AxisId | null,
  direction: AxisDirection | null,
): { readonly name: string; readonly noun: string; readonly modifier: string | null } {
  const noun = PASSION_BY_ID[passion].noun;
  if (!axis || !direction) return { name: `The ${noun}`, noun, modifier: null };

  const overrideKey = `${passion}:${axis}:${direction}`;
  const override = NAME_OVERRIDES[overrideKey];
  if (override === null) return { name: `The ${noun}`, noun, modifier: null };

  const modifier = override ?? MODIFIERS[axis][direction];
  return { name: `The ${modifier} ${noun}`, noun, modifier };
}

export function confidenceFor(
  residuals: readonly ResidualScore[],
  axes: AxisVector,
): number {
  const winning = residuals[0];
  if (!winning) return 0;
  const runnerUp = residuals[1];
  const s1 = winning.magnitude;
  const s2 = runnerUp?.magnitude ?? 0;
  const margin = s1 <= 0 ? 0 : clamp((s1 - s2) / s1);
  const strength = clamp(
    Math.abs(axes[winning.axis]) / CONFIDENCE_CONFIG.strengthReference,
  );
  const itemsForAxis = AXIS_COVERAGE[winning.axis].itemCount;
  const coverage = itemsForAxis >= CONFIDENCE_CONFIG.fullCoverageItemCount
    ? 1
    : CONFIDENCE_CONFIG.thinAxisPenalty;

  return round(clamp(
    CONFIDENCE_CONFIG.marginWeight * margin +
      CONFIDENCE_CONFIG.strengthWeight * strength +
      CONFIDENCE_CONFIG.coverageWeight * coverage,
  ));
}

export function experientialFit(axes: AxisVector, profile: AxisVector): number {
  const averageDistance = AXIS_IDS.reduce(
    (sum, axis) => sum + Math.abs(axes[axis] - profile[axis]),
    0,
  ) / AXIS_IDS.length;
  return round(clamp(1 - averageDistance / 2));
}

export function passionRelevance(
  section: TravelSection,
  selection: PassionSelection,
): number | null {
  const weightedScores: Array<{ score: number; weight: number }> = [];
  const primaryScore = section.passionFit[selection.primary];
  if (primaryScore !== undefined) {
    weightedScores.push({
      score: primaryScore / 3,
      weight: PASSION_WEIGHTS.primary,
    });
  }

  if (selection.secondary) {
    const secondaryScore = section.passionFit[selection.secondary];
    if (secondaryScore !== undefined) {
      weightedScores.push({
        score: secondaryScore / 3,
        weight: PASSION_WEIGHTS.secondary,
      });
    }
  }

  if (!weightedScores.length) return null;
  const denominator = weightedScores.reduce((sum, item) => sum + item.weight, 0);
  return round(
    weightedScores.reduce(
      (sum, item) => sum + item.score * item.weight,
      0,
    ) / denominator,
  );
}

export function recommendSections(
  axes: AxisVector,
  selection: PassionSelection,
  limit = 3,
): readonly SectionRecommendation[] {
  return SECTIONS.map((travelSection) =>
    recommendSection(travelSection, axes, selection),
  )
    .sort((left, right) => right.fit - left.fit || left.section.id.localeCompare(right.section.id))
    .slice(0, Math.max(0, limit));
}

export function recommendSection(
  travelSection: TravelSection,
  axes: AxisVector,
  selection: PassionSelection,
): SectionRecommendation {
  const experiential = experientialFit(axes, travelSection.profile);
  const passion = passionRelevance(travelSection, selection);
  const passionSignalAvailable = passion !== null;
  const fit = passionSignalAvailable
    ? round(
        SECTION_FIT_WEIGHTS.experiential * experiential +
          SECTION_FIT_WEIGHTS.passion * passion,
      )
    : experiential;

  return {
    sectionId: travelSection.id,
    section: travelSection,
    fit,
    experientialFit: experiential,
    passionRelevance: passion,
    passionSignalAvailable,
  };
}

const directionSentence: Readonly<
  Record<AxisId, Record<AxisDirection, string>>
> = {
  rhythm: {
    negative: "you protect time from becoming a checklist",
    positive: "you like a day with forward movement",
  },
  discovery: {
    negative: "you relax when the shape of the day is visible",
    positive: "you leave room for the route to answer back",
  },
  socialEnergy: {
    negative: "you travel warmly without needing constant company",
    positive: "shared energy is part of the destination",
  },
  clock: {
    negative: "first light feels like an invitation",
    positive: "a place often opens for you after dark",
  },
  threshold: {
    negative: "you enjoy exposure when a reliable base remains underneath it",
    positive: "remoteness and rough edges sharpen your attention",
  },
  focus: {
    negative: "depth matters more than collecting stops",
    positive: "contrast and changing ground keep you awake",
  },
};

function buildFitCopy(
  axes: AxisVector,
  primary: Passion,
  winningAxis: AxisId | null,
  direction: AxisDirection | null,
): TravelSelfFitCopy {
  const socialDirection: AxisDirection = axes.socialEnergy < 0 ? "negative" : "positive";
  const axis = winningAxis ?? "focus";
  const resolvedDirection = direction ?? (axes[axis] < 0 ? "negative" : "positive");
  const opposite = resolvedDirection === "negative" ? "positive" : "negative";

  return {
    aligns: `${primary.label} leads, and ${directionSentence[axis][resolvedDirection]}.`,
    canFlex: "You can cross the middle when the reason for the day is clear and the group does not turn preference into pressure.",
    willChafeWith: `A journey organised entirely around the ${axisById[axis][
      opposite === "negative" ? "negativeLabel" : "positiveLabel"
    ]} pole may begin to feel borrowed rather than yours.`,
    needsFromGroup:
      socialDirection === "negative"
        ? "Warmth without compulsory togetherness, and room to disappear without causing alarm."
        : "People who participate, answer the invitation and help the table become a table.",
  };
}

export function readTravelSelf(
  answers: TravelSelfAnswers,
  passions: PassionSelection,
): TravelSelf {
  if (!hasCompleteAnswers(answers)) {
    throw new Error("Travel Self requires one valid answer for every question.");
  }
  const passionErrors = validatePassionSelection(passions);
  if (passionErrors.length) throw new Error(passionErrors.join(" "));

  const { axes, evidence } = scoreAxes(answers);
  const centroid = blendedCentroid(passions);
  const residuals = calculateResiduals(axes, centroid);
  const { winningAxis, direction } = resolveResidualPole(residuals);
  const display = resolveDisplayName(passions.primary, winningAxis, direction);
  const primary = PASSION_BY_ID[passions.primary];
  const portrait = winningAxis && direction
    ? `${primary.label} is the pull. The recognition sits in the difference: ${directionSentence[winningAxis][direction]}.`
    : `${primary.label} is the pull, and your answers stay close to its expected travelling rhythm rather than breaking sharply from it.`;

  return {
    id: winningAxis && direction
      ? `${passions.primary}:${winningAxis}:${direction}`
      : `${passions.primary}:bare`,
    name: display.name,
    noun: display.noun,
    modifier: display.modifier,
    portrait,
    axes,
    axisEvidence: evidence,
    passionCentroid: centroid,
    residuals,
    winningAxis,
    direction,
    confidence: confidenceFor(residuals, axes),
    passions,
    fit: buildFitCopy(axes, primary, winningAxis, direction),
    recommendedSections: recommendSections(axes, passions),
    contentStatus: "DRAFT",
  };
}

export const TRAVEL_SELF_CONTENT = {
  intro: {
    eyebrow: "Meet your Travel Self",
    title: "You're not a demographic. You're a way of travelling.",
    lead: "Sixteen honest choices, then the things that pull you onto the road.",
    startLabel: "Begin",
    passionNounsLabel: "Travel Self passion nouns",
  },
  progressLabel: "Travel Self step",
  questionLabel: "Question",
  backLabel: "Back",
  nextLabel: "Next",
  passion: {
    eyebrow: "What pulls you",
    title: "Choose the reasons you travel.",
    lead: "Choose up to four. Then name one primary passion and, if useful, one secondary.",
    selectedLimit: "Choose no more than four passions.",
    primaryRequired: "Choose a primary passion before continuing.",
    selectionHelp: "Choose between one and four passions. Tap order does not set their importance.",
    selectedLabel: "selected",
    primaryLegend: "Which passion leads?",
    secondaryLegend: "Is there a secondary passion?",
    noSecondaryLabel: "No secondary passion",
    noneLabel: "None",
    roleSummaryLabel: "Selected passion roles",
    continueLabel: "Read my Travel Self",
  },
  reveal: {
    eyebrow: "Your Travel Self",
    passportHeading: "Your passport",
    passportLabels: {
      primary: "Primary",
      secondary: "Secondary",
      also: "Also",
      axisRead: "Axis read",
    },
    fitHeading: "This suits how you travel",
    fitIntro:
      "These matches reflect your travelling rhythm and the interests for which section data is available. They are not recommendations to book.",
    practicalHeading: "Check the practical demands",
    practicalIntro:
      "The body, logistics and calendar are a separate decision. Only you can judge whether a section's practical demands suit you.",
    practicalPending: "Practical details under review",
    editHeading: "Edit one answer",
    editPassionsLabel: "Edit passions",
    restartLabel: "Start over",
    emailActionLabel: "Tell me when these sections open",
    exploreSectionLabel: "Explore this section",
    practicalLinkLabel: "Check the route details",
    saveAnswerLabel: "Save answer",
    savePassionsLabel: "Save passions",
    choosePassionsLabel: "Choose my passions",
    editAnswerLabel: "Edit this answer",
    notAnsweredLabel: "Not answered",
    startOverConfirmation: "Start over and clear this Travel Self from the session?",
    fitLabels: {
      strong: "Strong fit",
      closerLook: "Worth a closer look",
      differentWay: "A different way in",
    },
    practicalLabels: {
      exertion: "Exertion",
      peakAltitude: "Peak altitude",
      acclimatisation: "Acclimatisation",
      remoteness: "Remoteness",
      comfort: "Comfort floor",
      hoursMoving: "Hours moving per day",
      dateRigidity: "Date rigidity",
      scaleSuffix: "of 3",
      daysSuffix: "days",
      metresSuffix: "m",
      hoursSuffix: "hours",
    },
  },
  interpretationDisclaimer:
    "The Travel Self is exploratory, not diagnostic. It is not a psychological, medical or physical-suitability assessment, and it does not guarantee compatibility. It is an authored interpretation of unvalidated draft questions.",
  statusLabel: "Draft model and copy",
} as const;
