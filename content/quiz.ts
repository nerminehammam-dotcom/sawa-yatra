import type {
  ArchetypeId,
  QuizOption,
  QuizQuestion,
  SixItemTuple,
} from "@/lib/types";

const DEMO_SCORE_NOTE =
  "DRAFT DEMO ONLY — this score exists only to demonstrate deterministic interface behaviour and does not interpret the response.";

const demoOption = (
  id: string,
  label: string,
  archetypeId: ArchetypeId,
  contentStatus: "DRAFT" | "PLACEHOLDER" = "PLACEHOLDER",
): QuizOption => ({
  id,
  label,
  scores: { [archetypeId]: 1 },
  scoreStatus: "DRAFT",
  scoreNote: DEMO_SCORE_NOTE,
  contentStatus,
  contentNote:
    contentStatus === "PLACEHOLDER"
      ? "Founder-approved option copy is required."
      : "Visual-manual specimen copy; founder approval required.",
});

const placeholderQuestion = (
  number: 2 | 3 | 4 | 5 | 6,
  scoreTargets: readonly [ArchetypeId, ArchetypeId, ArchetypeId, ArchetypeId],
): QuizQuestion => ({
  id: `question-${number}`,
  prompt: `DRAFT / PLACEHOLDER — Founder-approved question ${number} to be supplied.`,
  options: [
    demoOption(
      `question-${number}-option-1`,
      `DRAFT / PLACEHOLDER — Founder-approved option 1 for question ${number} to be supplied.`,
      scoreTargets[0],
    ),
    demoOption(
      `question-${number}-option-2`,
      `DRAFT / PLACEHOLDER — Founder-approved option 2 for question ${number} to be supplied.`,
      scoreTargets[1],
    ),
    demoOption(
      `question-${number}-option-3`,
      `DRAFT / PLACEHOLDER — Founder-approved option 3 for question ${number} to be supplied.`,
      scoreTargets[2],
    ),
    demoOption(
      `question-${number}-option-4`,
      `DRAFT / PLACEHOLDER — Founder-approved option 4 for question ${number} to be supplied.`,
      scoreTargets[3],
    ),
  ],
  contentStatus: "PLACEHOLDER",
  contentNote:
    "This required draft question is a visible content placeholder; no behavioural meaning is asserted.",
});

export const quizQuestions = [
  {
    id: "question-1",
    prompt: "Dinner reservations fall through. What happens next?",
    options: [
      demoOption(
        "question-1-option-1",
        "I love it — let's see what we find",
        "slow-wanderer",
        "DRAFT",
      ),
      demoOption(
        "question-1-option-2",
        "I have a backup already",
        "design-pilgrim",
        "DRAFT",
      ),
      demoOption(
        "question-1-option-3",
        "We figure it out, together",
        "social-drifter",
        "DRAFT",
      ),
      demoOption(
        "question-1-option-4",
        "DRAFT / PLACEHOLDER — Founder-approved option 4 to be supplied.",
        "independent-joiner",
      ),
    ],
    contentStatus: "DRAFT",
    contentNote:
      "Question and first three options are visual-manual specimens; founder approval and a fourth option are required.",
  },
  placeholderQuestion(2, [
    "food-led",
    "culture-diver",
    "quiet-adventurer",
    "improviser",
  ]),
  placeholderQuestion(3, [
    "nature-listener",
    "city-reader",
    "ritual-seeker",
    "night-owl",
  ]),
  placeholderQuestion(4, [
    "independent-joiner",
    "social-drifter",
    "slow-wanderer",
    "design-pilgrim",
  ]),
  placeholderQuestion(5, [
    "quiet-adventurer",
    "food-led",
    "city-reader",
    "culture-diver",
  ]),
  placeholderQuestion(6, [
    "improviser",
    "nature-listener",
    "night-owl",
    "ritual-seeker",
  ]),
] as const satisfies SixItemTuple<QuizQuestion>;

export const quizContent = {
  contentStatus: "DRAFT",
  statusLabel: "DRAFT — interface demonstration only",
  intro: {
    eyebrow: "Meet your Travel Self",
    title: "You're not a demographic. You're a way of travelling.",
    lead: "Six honest questions. About two minutes.",
    contentStatus: "DRAFT",
    contentNote: "Visual-manual specimen copy; founder approval required.",
  },
  startLabel: "Begin the taster",
  progressLabel: "Question",
  draftArchetypeListLabel: "Draft Travel Self names",
  questionStatusLabel: "Draft question copy and scoring",
  backLabel: "Back",
  nextLabel: "Next question",
  revealActionLabel: "Reveal my draft Travel Self",
  revealEyebrow: "Your Travel Self",
  revealStatusLabel: "Interface demonstration only",
  unavailableResultLabel: "Draft result unavailable",
  unavailableResultCopy: "To be confirmed",
  continuePanelLabel: "Continue from the draft taster",
  restartLabel: "Restart the draft taster",
  interpretationDisclaimer:
    "This draft taster demonstrates the interface only. It is not validated and makes no psychological, diagnostic or compatibility claim.",
  tieBreakerQuestionIds: ["question-5", "question-6"],
  storageKey: "sawayatra.travel-self.draft",
  questions: quizQuestions,
} as const;
