"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { ArchetypeChip } from "@/components/journeys/ArchetypeChip";
import { FitBand } from "@/components/journeys/FitBand";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { ContentStatusLabel } from "@/components/ui/ContentStatusLabel";
import { Progress } from "@/components/ui/Progress";
import {
  AXES,
  PASSIONS,
  PASSION_BY_ID,
  TRAVEL_SELF_CONTENT,
  TRAVEL_SELF_MODEL_VERSION,
  TRAVEL_SELF_QUESTIONS,
  hasCompleteAnswers,
  readTravelSelf,
  type PassionId,
  type PassionSelection,
  type TravelSelf,
  type TravelSelfAnswers,
} from "@/content/travel-self/travel-self-model";
import { trackTravelSelfEvent } from "@/lib/travel-self-events";
import {
  clearTravelSelfSession,
  readTravelSelfSession,
  writeTravelSelfSession,
  type StoredTravelSelfState,
  type TravelSelfPassionStep,
  type TravelSelfStage,
} from "@/lib/travel-self-session";
import { contactHref } from "@/lib/contact";
import type { CallToAction } from "@/lib/types";

import styles from "./travel-self.module.css";

interface TravelSelfPageContent {
  readonly title: string;
  readonly saveNotice: string;
  readonly requestAction: CallToAction;
  readonly signInAction: CallToAction;
  readonly contentStatus: "DRAFT";
}

interface TravelSelfQuizProps {
  pageContent: TravelSelfPageContent;
  showEditorialStatus?: boolean;
}

const INPUT_STEP_COUNT = TRAVEL_SELF_QUESTIONS.length + 1;

function answerLabel(questionId: string, optionId: string | undefined): string {
  const question = TRAVEL_SELF_QUESTIONS.find((item) => item.id === questionId);
  return (
    question?.options.find((option) => option.id === optionId)?.label ??
    TRAVEL_SELF_CONTENT.reveal.notAnsweredLabel
  );
}

function fitBandLabel(fit: number): string {
  if (fit >= 0.78) return TRAVEL_SELF_CONTENT.reveal.fitLabels.strong;
  if (fit >= 0.65) return TRAVEL_SELF_CONTENT.reveal.fitLabels.closerLook;
  return TRAVEL_SELF_CONTENT.reveal.fitLabels.differentWay;
}

function operationalComplete(result: TravelSelf["recommendedSections"][number]) {
  const practical = result.section.operational;
  return (
    practical.exertion !== null &&
    practical.peakAltitudeM !== null &&
    practical.acclimatisationDays !== null &&
    practical.remoteness !== null &&
    practical.comfortFloor !== null &&
    practical.hoursMovingPerDay !== null &&
    practical.dateRigidity !== null
  );
}

function OperationalDetails({
  recommendation,
}: {
  recommendation: TravelSelf["recommendedSections"][number];
}) {
  if (!operationalComplete(recommendation)) {
    return (
      <p className={styles.practicalPending}>
        {TRAVEL_SELF_CONTENT.reveal.practicalPending}
      </p>
    );
  }

  const practical = recommendation.section.operational;
  const labels = TRAVEL_SELF_CONTENT.reveal.practicalLabels;
  const moving = practical.hoursMovingPerDay;

  return (
    <dl className={styles.practicalList}>
      <div>
        <dt>{labels.exertion}</dt>
        <dd>
          {practical.exertion} {labels.scaleSuffix}
        </dd>
      </div>
      <div>
        <dt>{labels.peakAltitude}</dt>
        <dd>
          {practical.peakAltitudeM} {labels.metresSuffix}
        </dd>
      </div>
      <div>
        <dt>{labels.acclimatisation}</dt>
        <dd>
          {practical.acclimatisationDays} {labels.daysSuffix}
        </dd>
      </div>
      <div>
        <dt>{labels.remoteness}</dt>
        <dd>
          {practical.remoteness} {labels.scaleSuffix}
        </dd>
      </div>
      <div>
        <dt>{labels.comfort}</dt>
        <dd>{practical.comfortFloor}</dd>
      </div>
      <div>
        <dt>{labels.hoursMoving}</dt>
        <dd>
          {moving?.min}-{moving?.max} {labels.hoursSuffix}
        </dd>
      </div>
      <div>
        <dt>{labels.dateRigidity}</dt>
        <dd>{practical.dateRigidity?.replaceAll("-", " ")}</dd>
      </div>
    </dl>
  );
}

export function TravelSelfQuiz({
  pageContent,
  showEditorialStatus = false,
}: TravelSelfQuizProps) {
  const [stage, setStage] = useState<TravelSelfStage>("intro");
  const [passionStep, setPassionStep] =
    useState<TravelSelfPassionStep>("choose");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedPassions, setSelectedPassions] = useState<PassionId[]>([]);
  const [primary, setPrimary] = useState<PassionId | null>(null);
  const [secondary, setSecondary] = useState<PassionId | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [returnToReveal, setReturnToReveal] = useState(false);
  const [passionError, setPassionError] = useState("");
  const introHeadingRef = useRef<HTMLHeadingElement>(null);
  const screenHeadingRef = useRef<HTMLHeadingElement>(null);
  const revealHeadingRef = useRef<HTMLHeadingElement>(null);
  const revealContentRef = useRef<HTMLElement>(null);
  const passionErrorRef = useRef<HTMLParagraphElement>(null);
  const focusIntroAfterRestartRef = useRef(false);
  const focusReturnTargetRef = useRef<string | null>(null);
  const currentQuestion = TRAVEL_SELF_QUESTIONS[questionIndex];

  const passionSelection = useMemo<PassionSelection | null>(() => {
    if (!primary || !selectedPassions.includes(primary)) return null;
    const resolvedSecondary =
      secondary && secondary !== primary && selectedPassions.includes(secondary)
        ? secondary
        : null;
    return {
      primary,
      secondary: resolvedSecondary,
      also: selectedPassions.filter(
        (passionId) =>
          passionId !== primary && passionId !== resolvedSecondary,
      ),
    };
  }, [primary, secondary, selectedPassions]);

  const result = useMemo(() => {
    if (!passionSelection || !hasCompleteAnswers(answers)) return null;
    try {
      return readTravelSelf(answers satisfies TravelSelfAnswers, passionSelection);
    } catch {
      return null;
    }
  }, [answers, passionSelection]);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const stored = readTravelSelfSession(window.sessionStorage);
        if (stored) {
          setStage(stored.stage);
          setPassionStep(stored.passionStep);
          setQuestionIndex(stored.questionIndex);
          setAnswers(stored.answers);
          setSelectedPassions(stored.selectedPassions);
          setPrimary(stored.primary);
          setSecondary(stored.secondary);
        }
      } catch {
        // The quiz starts cleanly when session storage is unavailable.
      }
      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    const stored: StoredTravelSelfState = {
      version: TRAVEL_SELF_MODEL_VERSION,
      stage,
      passionStep,
      questionIndex,
      answers,
      selectedPassions,
      primary,
      secondary,
    };

    try {
      writeTravelSelfSession(window.sessionStorage, stored);
    } catch {
      // Private browsing may block storage. The quiz remains usable.
    }
  }, [
    answers,
    primary,
    passionStep,
    questionIndex,
    secondary,
    selectedPassions,
    stage,
    storageReady,
  ]);

  useEffect(() => {
    const focusFrame = window.requestAnimationFrame(() => {
      if (stage === "intro") {
        if (focusIntroAfterRestartRef.current) {
          introHeadingRef.current?.focus();
          focusIntroAfterRestartRef.current = false;
        }
        return;
      }

      if (stage === "reveal") {
        const returnTarget = focusReturnTargetRef.current;
        if (returnTarget) {
          revealContentRef.current
            ?.querySelector<HTMLButtonElement>(
              `[data-edit-target="${returnTarget}"]`,
            )
            ?.focus();
          focusReturnTargetRef.current = null;
        } else {
          revealHeadingRef.current?.focus();
        }
        return;
      }

      screenHeadingRef.current?.closest("section")?.scrollIntoView?.({
        block: "start",
      });
      screenHeadingRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(focusFrame);
  }, [passionStep, questionIndex, stage]);

  useEffect(() => {
    if (stage === "question" && currentQuestion) {
      trackTravelSelfEvent({
        name: "travel_self_step_viewed",
        step: questionIndex + 1,
        questionId: currentQuestion.id,
      });
    }
    if (stage === "passions") {
      trackTravelSelfEvent({
        name: "travel_self_step_viewed",
        step: INPUT_STEP_COUNT,
      });
    }
    if (stage === "reveal" && result) {
      trackTravelSelfEvent({
        name: "travel_self_result_viewed",
        resultId: result.id,
      });
    }
  }, [currentQuestion, questionIndex, result, stage]);

  function startQuiz() {
    setQuestionIndex(0);
    setReturnToReveal(false);
    setStage("question");
    trackTravelSelfEvent({ name: "travel_self_started" });
  }

  function restartQuiz() {
    const hasProgress =
      Object.keys(answers).length > 0 || selectedPassions.length > 0;
    if (
      hasProgress &&
      !window.confirm(TRAVEL_SELF_CONTENT.reveal.startOverConfirmation)
    ) {
      return;
    }

    setAnswers({});
    setPassionStep("choose");
    setSelectedPassions([]);
    setPrimary(null);
    setSecondary(null);
    setQuestionIndex(0);
    setReturnToReveal(false);
    setPassionError("");
    focusIntroAfterRestartRef.current = true;
    setStage("intro");
    try {
      clearTravelSelfSession(window.sessionStorage);
    } catch {
      // Nothing needs clearing when storage is unavailable.
    }
    trackTravelSelfEvent({ name: "travel_self_restarted" });
  }

  function chooseOption(questionId: string, optionId: string) {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    trackTravelSelfEvent({
      name: "travel_self_answer_selected",
      questionId,
      optionId,
    });
  }

  function nextQuestion() {
    if (!currentQuestion || !answers[currentQuestion.id]) return;

    if (returnToReveal && passionSelection) {
      focusReturnTargetRef.current = currentQuestion.id;
      setReturnToReveal(false);
      setStage("reveal");
      trackTravelSelfEvent({
        name: "travel_self_answer_edited",
        questionId: currentQuestion.id,
      });
      return;
    }

    if (questionIndex < TRAVEL_SELF_QUESTIONS.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    setPassionStep("choose");
    setStage("passions");
  }

  function togglePassion(passionId: PassionId) {
    setPassionError("");
    if (
      !selectedPassions.includes(passionId) &&
      selectedPassions.length >= 4
    ) {
      setPassionError(TRAVEL_SELF_CONTENT.passion.selectedLimit);
      window.requestAnimationFrame(() => passionErrorRef.current?.focus());
      return;
    }

    setSelectedPassions((current) => {
      if (current.includes(passionId)) {
        const next = current.filter((id) => id !== passionId);
        if (primary === passionId) setPrimary(null);
        if (secondary === passionId) setSecondary(null);
        trackTravelSelfEvent({
          name: "travel_self_passions_selected",
          passionIds: next,
        });
        return next;
      }
      const next = [...current, passionId];
      trackTravelSelfEvent({
        name: "travel_self_passions_selected",
        passionIds: next,
      });
      return next;
    });
  }

  function choosePrimary(passionId: PassionId) {
    if (!selectedPassions.includes(passionId)) return;
    setPrimary(passionId);
    if (secondary === passionId) setSecondary(null);
    trackTravelSelfEvent({
      name: "travel_self_primary_selected",
      passionId,
    });
  }

  function chooseSecondary(passionId: PassionId | null) {
    if (passionId && (!selectedPassions.includes(passionId) || passionId === primary)) {
      return;
    }
    setSecondary(passionId);
    trackTravelSelfEvent({
      name: "travel_self_secondary_selected",
      passionId,
    });
  }

  function revealResult() {
    if (!passionSelection) {
      setPassionError(TRAVEL_SELF_CONTENT.passion.primaryRequired);
      window.requestAnimationFrame(() => passionErrorRef.current?.focus());
      return;
    }
    const nextResult = readTravelSelf(answers, passionSelection);
    setPassionError("");
    if (returnToReveal) focusReturnTargetRef.current = "passions";
    setReturnToReveal(false);
    setStage("reveal");
    trackTravelSelfEvent({
      name: "travel_self_completed",
      resultId: nextResult.id,
      sectionIds: nextResult.recommendedSections.map(
        (recommendation) => recommendation.section.id,
      ),
    });
  }

  function editQuestion(index: number) {
    focusReturnTargetRef.current = null;
    setQuestionIndex(index);
    setReturnToReveal(true);
    setStage("question");
  }

  function editPassions() {
    focusReturnTargetRef.current = null;
    setReturnToReveal(true);
    setPassionStep("choose");
    setStage("passions");
  }

  if (stage === "intro") {
    return (
      <section className={styles.intro} data-dense="true">
        <Container className={styles.introGrid}>
          <div className={styles.introCopy}>
            {showEditorialStatus ? (
              <div className={styles.statusRow}>
                <ContentStatusLabel status={pageContent.contentStatus} />
                <span>{TRAVEL_SELF_CONTENT.statusLabel}</span>
              </div>
            ) : null}
            <p className={styles.eyebrow}>{TRAVEL_SELF_CONTENT.intro.eyebrow}</p>
            <h1 ref={introHeadingRef} tabIndex={-1}>
              {TRAVEL_SELF_CONTENT.intro.title}
            </h1>
            <p className={styles.lead}>{TRAVEL_SELF_CONTENT.intro.lead}</p>
            <p className={styles.introPractical}>
              Allow a few minutes. At the end, you receive an exploratory
              Travel Self and route sections worth a closer look.
            </p>
            <p className={styles.disclaimer}>
              {TRAVEL_SELF_CONTENT.interpretationDisclaimer}
            </p>
          </div>
          <div className={styles.introAside}>
            <div
              className={styles.archetypeCloud}
              aria-label={TRAVEL_SELF_CONTENT.intro.passionNounsLabel}
            >
              {PASSIONS.slice(0, 8).map((passion) => (
                <ArchetypeChip key={passion.id}>{passion.noun}</ArchetypeChip>
              ))}
            </div>
            <Button onClick={startQuiz}>
              {TRAVEL_SELF_CONTENT.intro.startLabel}
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  if (stage === "question" && currentQuestion) {
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
            ref={screenHeadingRef}
            tabIndex={-1}
          >
            {pageContent.title}: {currentQuestion.prompt}
          </h1>
          {showEditorialStatus ? (
            <div className={styles.statusRow}>
              <ContentStatusLabel status={currentQuestion.contentStatus} />
              <span>Unvalidated question copy and scoring</span>
            </div>
          ) : null}
          <Progress
            value={questionIndex + 1}
            max={INPUT_STEP_COUNT}
            label={`${TRAVEL_SELF_CONTENT.questionLabel} ${questionIndex + 1}`}
            valueText={`Step ${questionIndex + 1} of ${INPUT_STEP_COUNT}`}
          />
          <form
            className={styles.questionForm}
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
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
                  if (returnToReveal) {
                    setReturnToReveal(false);
                    setStage("reveal");
                  } else if (questionIndex === 0) {
                    setStage("intro");
                  } else {
                    setQuestionIndex((current) => current - 1);
                  }
                }}
              >
                {TRAVEL_SELF_CONTENT.backLabel}
              </Button>
              <Button type="submit" disabled={!selectedOption}>
                {returnToReveal
                  ? TRAVEL_SELF_CONTENT.reveal.saveAnswerLabel
                  : questionIndex === TRAVEL_SELF_QUESTIONS.length - 1
                    ? TRAVEL_SELF_CONTENT.reveal.choosePassionsLabel
                    : TRAVEL_SELF_CONTENT.nextLabel}
              </Button>
            </div>
          </form>
        </Container>
      </section>
    );
  }

  if (stage === "passions") {
    const validSelection = Boolean(passionSelection);
    const choosingPassions = passionStep === "choose";
    const passionHeading = choosingPassions
      ? TRAVEL_SELF_CONTENT.passion.title
      : TRAVEL_SELF_CONTENT.passion.primaryLegend;
    return (
      <section
        className={styles.question}
        data-dense="true"
        aria-labelledby="travel-self-passion-heading"
      >
        <Container className={styles.questionContainer}>
          <h1
            className="sr-only"
            id="travel-self-passion-heading"
            ref={screenHeadingRef}
            tabIndex={-1}
          >
            {passionHeading}
          </h1>
          {showEditorialStatus ? (
            <div className={styles.statusRow}>
              <ContentStatusLabel status="DRAFT" />
              <span>Unvalidated passion nouns and centroids</span>
            </div>
          ) : null}
          <Progress
            value={INPUT_STEP_COUNT}
            max={INPUT_STEP_COUNT}
            label={choosingPassions ? "Choose passions" : "Choose priorities"}
            valueText={`Step ${INPUT_STEP_COUNT} of ${INPUT_STEP_COUNT}`}
          />
          <form
            className={styles.questionForm}
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              if (choosingPassions) {
                if (selectedPassions.length > 0) {
                  setPassionError("");
                  setPassionStep("prioritise");
                }
                return;
              }
              revealResult();
            }}
          >
            {choosingPassions ? (
              <fieldset aria-describedby="passion-selection-help passion-selection-status">
                <legend>{TRAVEL_SELF_CONTENT.passion.title}</legend>
                <p id="passion-selection-help" className={styles.selectionHelp}>
                  {TRAVEL_SELF_CONTENT.passion.selectionHelp}
                </p>
                <p
                  id="passion-selection-status"
                  className={styles.selectionStatus}
                  aria-live="polite"
                >
                  {selectedPassions.length} of 4{" "}
                  {TRAVEL_SELF_CONTENT.passion.selectedLabel}
                </p>
                <div className={styles.passionGrid}>
                  {PASSIONS.map((passion) => {
                    const selected = selectedPassions.includes(passion.id);
                    return (
                      <label
                        className={styles.option}
                        data-selected={selected}
                        key={passion.id}
                      >
                        <input
                          className={styles.radio}
                          type="checkbox"
                          checked={selected}
                          onChange={() => togglePassion(passion.id)}
                        />
                        <span>
                          <strong>{passion.label}</strong>
                          <small>{passion.shortDescription}</small>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : (
              <>
                <fieldset aria-describedby={passionError ? "passion-error" : undefined}>
                  <legend>{TRAVEL_SELF_CONTENT.passion.primaryLegend}</legend>
                  <div className={styles.passionGrid}>
                    {selectedPassions.map((passionId) => (
                      <label
                        className={styles.option}
                        data-selected={primary === passionId}
                        key={`primary-${passionId}`}
                      >
                        <input
                          className={styles.radio}
                          type="radio"
                          name="primary-passion"
                          checked={primary === passionId}
                          onChange={() => choosePrimary(passionId)}
                        />
                        <span>{PASSION_BY_ID[passionId].label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset aria-describedby={passionError ? "passion-error" : undefined}>
                  <legend>{TRAVEL_SELF_CONTENT.passion.secondaryLegend}</legend>
                  <div className={styles.passionGrid}>
                    <label
                      className={styles.option}
                      data-selected={secondary === null}
                    >
                      <input
                        className={styles.radio}
                        type="radio"
                        name="secondary-passion"
                        checked={secondary === null}
                        onChange={() => chooseSecondary(null)}
                      />
                      <span>{TRAVEL_SELF_CONTENT.passion.noSecondaryLabel}</span>
                    </label>
                    {selectedPassions
                      .filter((passionId) => passionId !== primary)
                      .map((passionId) => (
                        <label
                          className={styles.option}
                          data-selected={secondary === passionId}
                          key={`secondary-${passionId}`}
                        >
                          <input
                            className={styles.radio}
                            type="radio"
                            name="secondary-passion"
                            checked={secondary === passionId}
                            onChange={() => chooseSecondary(passionId)}
                          />
                          <span>{PASSION_BY_ID[passionId].label}</span>
                        </label>
                      ))}
                  </div>
                </fieldset>

                {primary ? (
                  <div
                    className={styles.roleSummary}
                    aria-label={TRAVEL_SELF_CONTENT.passion.roleSummaryLabel}
                    aria-live="polite"
                  >
                    <p>
                      <span>{TRAVEL_SELF_CONTENT.reveal.passportLabels.primary}</span>
                      <strong>{PASSION_BY_ID[primary].label}</strong>
                    </p>
                    <p>
                      <span>{TRAVEL_SELF_CONTENT.reveal.passportLabels.secondary}</span>
                      <strong>
                        {secondary
                          ? PASSION_BY_ID[secondary].label
                          : TRAVEL_SELF_CONTENT.passion.noSecondaryLabel}
                      </strong>
                    </p>
                    <p>
                      <span>{TRAVEL_SELF_CONTENT.reveal.passportLabels.also}</span>
                      <strong>
                        {selectedPassions
                          .filter(
                            (passionId) =>
                              passionId !== primary && passionId !== secondary,
                          )
                          .map((passionId) => PASSION_BY_ID[passionId].label)
                          .join(", ") || TRAVEL_SELF_CONTENT.passion.noneLabel}
                      </strong>
                    </p>
                  </div>
                ) : null}
              </>
            )}

            {passionError ? (
              <p
                id="passion-error"
                className={styles.errorSummary}
                role="alert"
                ref={passionErrorRef}
                tabIndex={-1}
              >
                {passionError}
              </p>
            ) : null}

            <div className={styles.questionActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (!choosingPassions) {
                    setPassionError("");
                    setPassionStep("choose");
                  } else if (returnToReveal) {
                    focusReturnTargetRef.current = "passions";
                    setReturnToReveal(false);
                    setStage("reveal");
                  } else {
                    setQuestionIndex(TRAVEL_SELF_QUESTIONS.length - 1);
                    setStage("question");
                  }
                }}
              >
                {choosingPassions && returnToReveal
                  ? "Cancel"
                  : TRAVEL_SELF_CONTENT.backLabel}
              </Button>
              <Button
                type="submit"
                disabled={
                  choosingPassions
                    ? selectedPassions.length === 0
                    : !validSelection
                }
              >
                {choosingPassions
                  ? "Choose priorities"
                  : returnToReveal
                    ? TRAVEL_SELF_CONTENT.reveal.savePassionsLabel
                    : TRAVEL_SELF_CONTENT.passion.continueLabel}
              </Button>
            </div>
          </form>
        </Container>
      </section>
    );
  }

  if (stage === "reveal" && result) {
    return (
      <section
        className={styles.reveal}
        data-dense="true"
        aria-labelledby="travel-self-result"
        ref={revealContentRef}
      >
        <Container className={styles.revealGrid}>
          <div>
            {showEditorialStatus ? (
              <div className={styles.statusRow}>
                <ContentStatusLabel status={result.contentStatus} />
                <span>
                  Internal confidence {Math.round(result.confidence * 100)}%
                </span>
              </div>
            ) : null}
            <p className={styles.eyebrow}>{TRAVEL_SELF_CONTENT.reveal.eyebrow}</p>
            <h1 id="travel-self-result" ref={revealHeadingRef} tabIndex={-1}>
              {result.name}
            </h1>
            <p className={styles.portrait}>{result.portrait}</p>
            <FitBand
              aligns={result.fit.aligns}
              canFlex={result.fit.canFlex}
              willChafeWith={result.fit.willChafeWith}
              needsFromGroup={result.fit.needsFromGroup}
            />
            <p className={styles.disclaimer}>
              {TRAVEL_SELF_CONTENT.interpretationDisclaimer}
            </p>
          </div>

          <aside
            className={styles.continuePanel}
            aria-label={TRAVEL_SELF_CONTENT.reveal.passportHeading}
          >
            <h2>{TRAVEL_SELF_CONTENT.reveal.passportHeading}</h2>
            <div className={styles.passport}>
              <p className={styles.passportLine}>
                <span>{TRAVEL_SELF_CONTENT.reveal.passportLabels.primary}</span>
                <strong>{PASSION_BY_ID[result.passions.primary].label}</strong>
              </p>
              {result.passions.secondary ? (
                <p className={styles.passportLine}>
                  <span>
                    {TRAVEL_SELF_CONTENT.reveal.passportLabels.secondary}
                  </span>
                  <strong>{PASSION_BY_ID[result.passions.secondary].label}</strong>
                </p>
              ) : null}
              {result.passions.also.length ? (
                <div className={styles.passportLine}>
                  <span>{TRAVEL_SELF_CONTENT.reveal.passportLabels.also}</span>
                  <div>
                    {result.passions.also.map((passionId) => (
                      <ArchetypeChip key={passionId}>
                        {PASSION_BY_ID[passionId].label}
                      </ArchetypeChip>
                    ))}
                  </div>
                </div>
              ) : null}
              {showEditorialStatus ? (
                <div className={styles.passportLine}>
                  <span>{TRAVEL_SELF_CONTENT.reveal.passportLabels.axisRead}</span>
                  <div>
                    {AXES.map((axis) => (
                      <small key={axis.id}>
                        {axis.label}: {result.axes[axis.id].toFixed(2)}
                      </small>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <Button
              type="button"
              variant="secondary"
              data-edit-target="passions"
              onClick={editPassions}
            >
              {TRAVEL_SELF_CONTENT.reveal.editPassionsLabel}
            </Button>
          </aside>
        </Container>

        <Container>
          <section
            className={styles.revealSection}
            aria-labelledby="travel-self-fit-heading"
          >
            <h2 id="travel-self-fit-heading">
              {TRAVEL_SELF_CONTENT.reveal.fitHeading}
            </h2>
            <p className={styles.sectionIntro}>
              {TRAVEL_SELF_CONTENT.reveal.fitIntro}
            </p>
            <div className={styles.sectionList}>
              {result.recommendedSections.map((recommendation) => (
                <article key={recommendation.section.id}>
                  <p className={styles.sectionRoute}>
                    {recommendation.section.id} · {recommendation.section.route}
                  </p>
                  <h3>{recommendation.section.name}</h3>
                  <p>{fitBandLabel(recommendation.fit)}</p>
                  {showEditorialStatus ? (
                    <p>
                      Experiential {recommendation.experientialFit.toFixed(2)} · Passion{" "}
                      {recommendation.passionRelevance?.toFixed(2) ?? "not supplied"}
                    </p>
                  ) : null}
                  <ButtonLink
                    href={recommendation.section.href}
                    variant="secondary"
                    surface="deep"
                    onClick={() =>
                      trackTravelSelfEvent({
                        name: "travel_self_section_opened",
                        sectionId: recommendation.section.id,
                      })
                    }
                  >
                    {TRAVEL_SELF_CONTENT.reveal.exploreSectionLabel}
                  </ButtonLink>
                </article>
              ))}
            </div>
          </section>

          <section
            className={styles.revealSection}
            aria-labelledby="travel-self-practical-heading"
          >
            <h2 id="travel-self-practical-heading">
              {TRAVEL_SELF_CONTENT.reveal.practicalHeading}
            </h2>
            <p className={styles.sectionIntro}>
              {TRAVEL_SELF_CONTENT.reveal.practicalIntro}
            </p>
            <div className={styles.sectionList}>
              {result.recommendedSections.map((recommendation) => (
                <article key={`practical-${recommendation.section.id}`}>
                  <p className={styles.sectionRoute}>
                    {recommendation.section.id} · {recommendation.section.route}
                  </p>
                  <h3>{recommendation.section.name}</h3>
                  <OperationalDetails recommendation={recommendation} />
                  <ButtonLink
                    href={recommendation.section.href}
                    variant="secondary"
                    surface="deep"
                  >
                    {TRAVEL_SELF_CONTENT.reveal.practicalLinkLabel}
                  </ButtonLink>
                </article>
              ))}
            </div>
          </section>

          <section
            className={styles.revealSection}
            aria-labelledby="travel-self-edit-heading"
          >
            <h2 id="travel-self-edit-heading">
              {TRAVEL_SELF_CONTENT.reveal.editHeading}
            </h2>
            <div className={styles.editList}>
              {TRAVEL_SELF_QUESTIONS.map((question, index) => (
                <article key={`edit-${question.id}`}>
                  <h3>{question.prompt}</h3>
                  <p>{answerLabel(question.id, answers[question.id])}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    surface="deep"
                    data-edit-target={question.id}
                    onClick={() => editQuestion(index)}
                  >
                    {TRAVEL_SELF_CONTENT.reveal.editAnswerLabel}
                  </Button>
                </article>
              ))}
            </div>
          </section>

          <div className={styles.actions}>
            <ButtonLink
              href={contactHref("Travel Self")}
              surface="deep"
              onClick={() =>
                trackTravelSelfEvent({ name: "travel_self_email_cta_clicked" })
              }
            >
              {TRAVEL_SELF_CONTENT.reveal.emailActionLabel}
            </ButtonLink>
            <Button
              type="button"
              variant="secondary"
              surface="deep"
              onClick={restartQuiz}
            >
              {TRAVEL_SELF_CONTENT.reveal.restartLabel}
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return null;
}
