export const AXIS_IDS = [
  "pace",
  "planning",
  "social",
  "rhythm",
  "comfort",
] as const;

export type AxisId = (typeof AXIS_IDS)[number];
export type AxisPosition = 1 | 2 | 3 | 4 | 5 | 6;
export type AxisPositions = Readonly<Record<AxisId, AxisPosition>>;

export interface TravelAxis {
  readonly id: AxisId;
  readonly label: string;
  readonly naming: boolean;
  readonly token: string;
  readonly question: string;
  readonly left: {
    readonly name: string;
    readonly gloss: string;
    readonly readout: string;
  };
  readonly right: {
    readonly name: string;
    readonly gloss: string;
    readonly readout: string;
  };
  readonly echo: readonly [string, string, string, string, string, string];
  readonly feel: { readonly left: string; readonly right: string };
}

export const SLIDER_HELPER = "With people you haven’t travelled with before.";

export const AXES = [
  {
    id: "pace",
    label: "Pace",
    naming: true,
    token: "var(--clay)",
    question: "How much ground do you want to cover?",
    left: { name: "Slow", gloss: "fewer places, longer in each", readout: "unhurried" },
    right: { name: "Full-Tilt", gloss: "more places, keep moving", readout: "full-tilt" },
    echo: [
      "One town. You would stay another night if you could.",
      "Few places, and time enough to be bored in them.",
      "Slowly, though you would not want to miss the thing an hour away.",
      "Onward, but not through lunch.",
      "More ground. You sleep well on buses.",
      "Three towns, and you would have taken a fourth.",
    ],
    feel: {
      left: "the group decides to fit in one more town before dark.",
      right: "it is four in the afternoon and everyone is still in the same square.",
    },
  },
  {
    id: "planning",
    label: "Planning",
    naming: true,
    token: "var(--olive)",
    question: "How much of it do you want settled before you go?",
    left: { name: "Improviser", gloss: "decide as you arrive", readout: "unplanned" },
    right: { name: "Choreographer", gloss: "know the week in advance", readout: "charted" },
    echo: [
      "No plan. That is the plan.",
      "You will decide when you get there.",
      "A loose idea, and the rest as it comes.",
      "Enough booked to stop thinking about it.",
      "You would like the week settled before you pack.",
      "You have a document, and it has tabs.",
    ],
    feel: {
      left: "Tuesday was decided in March, and Tuesday turns out to be beautiful somewhere else.",
      right: "nothing is booked and it is already Thursday.",
    },
  },
  {
    id: "social",
    label: "Social energy",
    naming: true,
    token: "var(--sun)",
    question: "How much company do you want around you?",
    left: { name: "Quiet", gloss: "a few people, unhurried", readout: "quiet" },
    right: { name: "Table-Setter", gloss: "a full table, most nights", readout: "sociable" },
    echo: [
      "A few people, and long silences that are not awkward.",
      "Company, in small amounts.",
      "You will join the table. You may not lead it.",
      "You like a full table, and an early night.",
      "Dinner with everyone, most nights.",
      "You have already invited the people at the next table.",
    ],
    feel: {
      left: "the table has been going two hours and it is understood that you stay.",
      right: "everyone goes up to their rooms straight after dinner.",
    },
  },
  {
    id: "rhythm",
    label: "Rhythm",
    naming: true,
    token: "var(--olive)",
    question: "When does your day come alive?",
    left: { name: "Sunrise-Chaser", gloss: "first light", readout: "dawn-led" },
    right: { name: "Night-Owl", gloss: "after dark", readout: "night-led" },
    echo: [
      "You have watched more than one town wake up.",
      "The first hour is the good one.",
      "Early, though you will stay up if something is happening.",
      "Late, though you can be got out of bed.",
      "The day starts properly after lunch.",
      "You are still awake, and glad about it.",
    ],
    feel: {
      left: "the table is still going at midnight and you have a six o’clock in your head.",
      right: "the group wants to be up at six and decide the day over breakfast.",
    },
  },
  {
    id: "comfort",
    label: "Comfort",
    naming: false,
    token: "var(--ink)",
    question: "How much comfort do you want around you?",
    left: { name: "Unfussy", gloss: "simple is fine", readout: "unfussy" },
    right: { name: "Considered", gloss: "where you stay matters", readout: "considered" },
    echo: [
      "A bed is a bed.",
      "You have slept in worse and thought nothing of it.",
      "Simple is fine, as long as it is clean.",
      "Comfortable, without needing a view.",
      "Where you stay is part of the trip.",
      "You would rather one good room than three nights saved.",
    ],
    feel: {
      left: "the third dinner in a row costs more than you would have chosen to spend.",
      right: "the group settles on the cheaper option and nobody thinks to ask.",
    },
  },
] as const satisfies readonly TravelAxis[];

export const AXIS_BY_ID = Object.fromEntries(
  AXES.map((axis) => [axis.id, axis]),
) as Readonly<Record<AxisId, TravelAxis>>;

export const WEIGHTING_ORDER = [
  "rhythm",
  "pace",
  "comfort",
  "planning",
  "social",
] as const satisfies readonly AxisId[];

export const POSITION_STRENGTH = [
  "Strongly",
  "Clearly",
  "Slightly",
  "Slightly",
  "Clearly",
  "Strongly",
] as const;

export const POSITION_OPACITY = [1, 0.72, 0.3, 0.3, 0.72, 1] as const;
