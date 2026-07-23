"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ArchetypeChip } from "@/components/journeys/ArchetypeChip";
import { FitBand } from "@/components/journeys/FitBand";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ContentStatusLabel } from "@/components/ui/ContentStatusLabel";
import { Progress } from "@/components/ui/Progress";
import { archetypeById, archetypes } from "@/content/archetypes";
import { quizContent, quizQuestions } from "@/content/quiz";
import { scoreTravelSelf, type QuizAnswers } from "@/lib/travel-self";
import type { CallToAction } from "@/lib/types";

import styles from "./travel-self.module.css";

interface TravelSelfPageContent {
  readonly title: string;
  readonly saveNotice: string;
  readonly requestAction: CallToAction;
  readonly signInAction: CallToAction;
  readonly contentStatus: "DRAFT";
}

interface StoredQuizState {
  answers: Record<string, string>;
  result: string | null;
}

interface TravelSelfQuizProps {
  pageContent: TravelSelfPageContent;
}

const initialAnswers: Record<string, string> = {};

function readStoredQuiz(): StoredQuizState | null {
  try {
    const raw = window.sessionStorage.getItem(quizContent.storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredQuizState>;

    if (!parsed.answers || typeof parsed.answers !== "object") return null;

    return {
      answers: Object.fromEntries(
        Object.entries(parsed.answers).filter(
          ([questionId, optionId]) =>
            typeof optionId === "string" &&
            quizQuestions.some(
              (question) =>
                question.id === questionId &&
                question.options.some((option) => option.id === optionId),
            ),
        ),
      ),
      result:
        typeof parsed.result === "string" && parsed.result in archetypeById
          ? parsed.result
          : null,
    };
  } catch {
    return null;
  }
}

function actionButton(action: CallToAction) {
  return (
    <ButtonLink
      key={action.href}
      href={action.href}
      variant={action.style}
    >
      {action.label}
    </ButtonLink>
  );
}

export function TravelSelfQuiz({ pageContent }: TravelSelfQuizProps) {
  const [stage, setStage] = useState<"intro" | "question" | "reveal">(
    "intro",
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [resultId, setResultId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const revealHeadingRef = useRef<HTMLHeadingElement>(null);
  const currentQuestion = quizQuestions[questionIndex];

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const stored = readStoredQuiz();

      if (stored) {
        setAnswers(stored.answers);
        setResultId(stored.result);

        if (stored.result && stored.result in archetypeById) {
          setStage("reveal");
        }
      }

      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    const stored: StoredQuizState = { answers, result: resultId };

    try {
      window.sessionStorage.setItem(
        quizContent.storageKey,
        JSON.stringify(stored),
      );
    } catch {
      // The taster still works when private browsing blocks session storage.
    }
  }, [answers, resultId, storageReady]);

  useEffect(() => {
    if (stage === "intro") return;

    const focusFrame = window.requestAnimationFrame(() => {
      if (stage === "question") questionHeadingRef.current?.focus();
      if (stage === "reveal") revealHeadingRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [questionIndex, stage]);

  const result = useMemo(
    () =>
      resultId && resultId in archetypeById
        ? archetypeById[resultId as keyof typeof archetypeById]
        : null,
    [resultId],
  );

  function startQuiz() {
    setQuestionIndex(0);
    setStage("question");
  }

  function restartQuiz() {
    setAnswers({});
    setResultId(null);
    setQuestionIndex(0);
    setStage("intro");
    try {
      window.sessionStorage.removeItem(quizContent.storageKey);
    } catch {
      // No stored state needs clearing when storage is unavailable.
    }
  }

  function chooseOption(questionId: string, optionId: string) {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  }

  function nextQuestion() {
    if (!currentQuestion || !answers[currentQuestion.id]) return;

    if (questionIndex < quizQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    const scoredResult = scoreTravelSelf(
      quizQuestions,
      answers satisfies QuizAnswers,
      quizContent.tieBreakerQuestionIds,
    );

    setResultId(scoredResult);
    setStage("reveal");
  }

  if (stage === "intro") {
    return (
      <section className={styles.intro} data-dense="true">
        <Container className={styles.introGrid}>
          <div className={styles.introCopy}>
            <div className={styles.statusRow}>
              <ContentStatusLabel status={pageContent.contentStatus} />
              <span>{quizContent.statusLabel}</span>
            </div>
            <p className={styles.eyebrow}>{quizContent.intro.eyebrow}</p>
            <h1>{quizContent.intro.title}</h1>
            <p className={styles.lead}>{quizContent.intro.lead}</p>
            <p className={styles.disclaimer}>{quizContent.interpretationDisclaimer}</p>
            <Button onClick={startQuiz}>{quizContent.startLabel}</Button>
          </div>
          <div
            className={styles.archetypeCloud}
            aria-label={quizContent.draftArchetypeListLabel}
          >
            {archetypes.slice(0, 6).map((archetype) => (
              <ArchetypeChip key={archetype.id}>{archetype.name}</ArchetypeChip>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (stage === "reveal") {
    return (
      <section className={styles.reveal} data-dense="true" aria-labelledby="travel-self-result">
        <Container className={styles.revealGrid}>
          <div>
            <div className={styles.statusRow}>
              <ContentStatusLabel status="DRAFT" />
              <span>{quizContent.revealStatusLabel}</span>
            </div>
            <p className={styles.eyebrow}>{quizContent.revealEyebrow}</p>
            <h1 id="travel-self-result" ref={revealHeadingRef} tabIndex={-1}>
              {result?.name ?? quizContent.unavailableResultLabel}
            </h1>
            <p className={styles.portrait}>
              {result?.portrait.text ?? quizContent.unavailableResultCopy}
            </p>
            <FitBand
              aligns={
                result?.greenFlags[0].text ?? quizContent.unavailableResultCopy
              }
              canFlex={
                result?.greenFlags[1].text ?? quizContent.unavailableResultCopy
              }
            />
            <p className={styles.fitStatement}>
              {result?.fitStatement.text ?? quizContent.unavailableResultCopy}
            </p>
            <p className={styles.disclaimer}>{quizContent.interpretationDisclaimer}</p>
          </div>
          <aside
            className={styles.continuePanel}
            aria-label={quizContent.continuePanelLabel}
          >
            <p>{pageContent.saveNotice}</p>
            <div className={styles.actions}>
              {actionButton(pageContent.requestAction)}
              {actionButton(pageContent.signInAction)}
            </div>
            <Button variant="secondary" onClick={restartQuiz}>
              {quizContent.restartLabel}
            </Button>
          </aside>
        </Container>
      </section>
    );
  }

  if (!currentQuestion) return null;

  const selectedOption = answers[currentQuestion.id];

  return (
    <section
      className={styles.question}
      data-dense="true"
      aria-labelledby="travel-self-question-heading"
    >
      <Container className={styles.questionContainer}>
        <h1
          className="sr-only"
          id="travel-self-question-heading"
          ref={questionHeadingRef}
          tabIndex={-1}
        >
          {pageContent.title}: {currentQuestion.prompt}
        </h1>
        <div className={styles.statusRow}>
          <ContentStatusLabel status={currentQuestion.contentStatus} />
          <span>{quizContent.questionStatusLabel}</span>
        </div>
        <Progress
          value={questionIndex + 1}
          max={quizQuestions.length}
          label={quizContent.progressLabel}
          valueText={`${questionIndex + 1} of ${quizQuestions.length}`}
        />
        <form
          className={styles.questionForm}
          onSubmit={(event) => {
            event.preventDefault();
            nextQuestion();
          }}
        >
          <fieldset>
            <legend>{currentQuestion.prompt}</legend>
            <div className={styles.options}>
              {currentQuestion.options.map((option) => (
                <label
                  className={styles.option}
                  data-selected={selectedOption === option.id}
                  key={option.id}
                >
                  <input
                    className={styles.radio}
                    type="radio"
                    name={currentQuestion.id}
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => chooseOption(currentQuestion.id, option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className={styles.questionActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (questionIndex === 0) setStage("intro");
                else setQuestionIndex((current) => current - 1);
              }}
            >
              {quizContent.backLabel}
            </Button>
            <Button type="submit" disabled={!selectedOption}>
              {questionIndex === quizQuestions.length - 1
                ? quizContent.revealActionLabel
                : quizContent.nextLabel}
            </Button>
          </div>
        </form>
      </Container>
    </section>
  );
}
