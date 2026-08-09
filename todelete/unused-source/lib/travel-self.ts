import type { ArchetypeId, QuizQuestion } from "@/lib/types";

export type QuizAnswers = Readonly<Record<string, string>>;

function optionForAnswer(
  question: QuizQuestion,
  answerId: string | undefined,
) {
  return question.options.find((option) => option.id === answerId);
}

function scoreCandidates(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
  candidates?: ReadonlySet<ArchetypeId>,
): Map<ArchetypeId, number> {
  const scores = new Map<ArchetypeId, number>();

  for (const question of questions) {
    const option = optionForAnswer(question, answers[question.id]);

    if (!option) continue;

    for (const [archetypeId, points] of Object.entries(option.scores) as Array<
      [ArchetypeId, number]
    >) {
      if (candidates && !candidates.has(archetypeId)) continue;
      scores.set(archetypeId, (scores.get(archetypeId) ?? 0) + points);
    }
  }

  return scores;
}

function leaders(scores: ReadonlyMap<ArchetypeId, number>): ArchetypeId[] {
  if (scores.size === 0) return [];

  const highest = Math.max(...scores.values());

  return [...scores.entries()]
    .filter(([, score]) => score === highest)
    .map(([archetypeId]) => archetypeId)
    .sort((left, right) => left.localeCompare(right));
}

/**
 * Implements the locked Release 1 demo algorithm. It does not make or imply a
 * psychological or compatibility assessment.
 */
export function scoreTravelSelf(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
  tieBreakerQuestionIds: readonly string[],
): ArchetypeId | null {
  const overallLeaders = leaders(scoreCandidates(questions, answers));

  if (overallLeaders.length === 0) return null;
  if (overallLeaders.length === 1) return overallLeaders[0] ?? null;

  const tiedCandidates = new Set(overallLeaders);
  const tieBreakerQuestions = tieBreakerQuestionIds
    .map((questionId) =>
      questions.find((question) => question.id === questionId),
    )
    .filter((question): question is QuizQuestion => Boolean(question));
  const tieBreakerLeaders = leaders(
    scoreCandidates(tieBreakerQuestions, answers, tiedCandidates),
  ).filter((archetypeId) => tiedCandidates.has(archetypeId));

  if (tieBreakerLeaders.length === 1) return tieBreakerLeaders[0] ?? null;

  // Alphabetical ID order is the documented deterministic final fallback.
  return (tieBreakerLeaders.length > 0
    ? tieBreakerLeaders
    : overallLeaders)[0] ?? null;
}
