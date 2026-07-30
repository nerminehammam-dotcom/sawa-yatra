"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

import {
  AXES,
  BEFORE_YOU_BEGIN,
  FOLLOW_UP_HELPER,
  HELPER_1_TO_5,
  NARROWING,
  NAV,
  NO_STORAGE_WARNING,
  PASSIONS,
  PASSIONS_HELPER,
  QUESTION_HEADINGS,
  RAIL_PURPOSE,
  STEP_LABELS,
  STRENGTH,
  TIME_TOGETHER,
  TIME_TOGETHER_HELPER,
  VALIDATION,
  type Pole,
} from "@/content/travel-self/travel-self-model";
import {
  INITIAL_TRAVEL_SELF_STATE,
  isStepAnswered,
  shouldPersistTravelSelfTransition,
  travelSelfReducer,
  type PassionName,
  type TimeTogether,
  type TravelSelfAction,
  type TravelSelfState,
  type TravelSelfStep,
} from "@/lib/travel-self/state-machine";
import {
  loadTravelSelfState,
  saveTravelSelfState,
} from "@/lib/travel-self/storage-v23";

import styles from "./travel-self.module.css";

const POLES = [1, 2, 3, 4, 5, 6] as const;
const STEPS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const POSITION_WEIGHT = ["100%", "62%", "26%", "26%", "62%", "100%"] as const;
const QUESTION_IMAGES = {
  1: "/assets/travel-self/travel-self-q01.png",
  2: "/assets/travel-self/travel-self-q02.png",
  3: "/assets/travel-self/travel-self-q03.png",
  4: "/assets/travel-self/travel-self-q04.png",
  5: "/assets/travel-self/travel-self-q05.png",
  6: "/assets/travel-self/travel-self-q06.png",
  7: "/assets/travel-self/travel-self-q07.png",
  8: "/assets/travel-self/travel-self-q08.png",
} as const;

type QuestionnaireStyle = CSSProperties & {
  "--tsq-axis": string;
  "--tsq-surface": string;
};

const STEP_STYLE: Record<TravelSelfStep, QuestionnaireStyle> = {
  1: { "--tsq-axis": "var(--sun)", "--tsq-surface": "var(--sun)" },
  2: { "--tsq-axis": "var(--pink)", "--tsq-surface": "var(--pink)" },
  3: { "--tsq-axis": "var(--olive)", "--tsq-surface": "var(--olive)" },
  4: { "--tsq-axis": "var(--signal)", "--tsq-surface": "var(--signal)" },
  5: { "--tsq-axis": "var(--clay)", "--tsq-surface": "color-mix(in srgb, var(--clay) 80%, var(--paper))" },
  6: { "--tsq-axis": "var(--olive)", "--tsq-surface": "var(--olive)" },
  7: { "--tsq-axis": "var(--pink)", "--tsq-surface": "var(--pink)" },
  8: { "--tsq-axis": "var(--clay)", "--tsq-surface": "color-mix(in srgb, var(--clay) 80%, var(--paper))" },
};

function storageForWindow(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function questionnaireState(state: TravelSelfState): TravelSelfState {
  if (state.stage === "intro") {
    return travelSelfReducer(state, { type: "start" });
  }
  return state;
}

function BeforeYouBegin({ storageAvailable }: { storageAvailable: boolean }) {
  return (
    <section className={styles.qBefore} aria-labelledby="travel-self-before-title">
      <h2 id="travel-self-before-title">{BEFORE_YOU_BEGIN.heading}</h2>
      <div className={styles.qBeforeRows}>
        {BEFORE_YOU_BEGIN.groups.map(([lead, detail]) => (
          <div key={lead}>
            <p>{lead}</p>
            <p>{detail}</p>
          </div>
        ))}
      </div>
      {!storageAvailable ? <p className={styles.qStorageWarning}>{NO_STORAGE_WARNING}</p> : null}
    </section>
  );
}

function AxisQuestion({
  step,
  state,
  answer,
}: {
  step: TravelSelfStep;
  state: TravelSelfState;
  answer: (action: TravelSelfAction) => void;
}) {
  const axis = AXES.find((candidate) => candidate.step === step);
  const groupRef = useRef<HTMLDivElement>(null);
  if (!axis) return null;

  const axisKey = axis.key;
  const selected = state.answers.positions[axisKey];

  function choose(value: Pole, focus = false) {
    answer({ type: "answer-axis", axis: axisKey, value });
    if (focus) {
      window.requestAnimationFrame(() => {
        groupRef.current
          ?.querySelector<HTMLButtonElement>(`[data-position="${value}"]`)
          ?.focus();
      });
    }
  }

  function move(event: KeyboardEvent<HTMLButtonElement>, current: Pole) {
    const movement: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    const delta = movement[event.key];
    if (!delta) return;
    event.preventDefault();
    choose(Math.max(1, Math.min(6, current + delta)) as Pole, true);
  }

  return (
    <>
      <h2 id="travel-self-question-heading" tabIndex={-1}>{axis.question}</h2>
      <p className={styles.qHelper}>{HELPER_1_TO_5}</p>
      <div className={styles.qPoles} aria-hidden="true">
        <span>
          <strong>{axis.left.name}</strong>
          <small>{axis.left.note}</small>
        </span>
        <span className={styles.qRightPole}>
          <strong>{axis.right.name}</strong>
          <small>{axis.right.note}</small>
        </span>
      </div>
      <div ref={groupRef} className={styles.qScale} role="radiogroup" aria-label={axis.question}>
        {POLES.map((position, index) => {
          const pole = position <= 3 ? axis.left.name : axis.right.name;
          return (
            <button
              key={position}
              type="button"
              role="radio"
              aria-checked={selected === position}
              aria-label={`${STRENGTH[index]} ${pole}`}
              className={styles.qScalePosition}
              data-position={position}
              tabIndex={selected === position || (!selected && position === 1) ? 0 : -1}
              style={{ "--q-weight": POSITION_WEIGHT[index] } as CSSProperties}
              onClick={() => choose(position)}
              onKeyDown={(event) => move(event, position)}
            />
          );
        })}
      </div>
      <p className={selected ? styles.qEcho : styles.qPrompt} id="travel-self-question-prompt" aria-live="polite">
        {selected ? axis.lines[selected - 1] : VALIDATION.chooseAPosition}
      </p>
    </>
  );
}

function RadioChoices<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  const groupRef = useRef<HTMLDivElement>(null);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const movement: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    const delta = movement[event.key];
    if (!delta) return;
    event.preventDefault();
    const nextIndex = (index + delta + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) return;
    onChange(next);
    window.requestAnimationFrame(() => {
      groupRef.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[nextIndex]?.focus();
    });
  }

  return (
    <div ref={groupRef} className={styles.qChoices} role="radiogroup" aria-label={label}>
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          tabIndex={value === option || (!value && index === 0) ? 0 : -1}
          onClick={() => onChange(option)}
          onKeyDown={(event) => move(event, index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function TimeTogetherQuestion({
  value,
  answer,
}: {
  value: TimeTogether | null;
  answer: (action: TravelSelfAction) => void;
}) {
  return (
    <>
      <h2 id="travel-self-question-heading" tabIndex={-1}>{QUESTION_HEADINGS[6]}</h2>
      <p className={styles.qHelper}>{TIME_TOGETHER_HELPER}</p>
      <RadioChoices
        label={QUESTION_HEADINGS[6]}
        options={TIME_TOGETHER}
        value={value}
        onChange={(next) => answer({ type: "answer-time-together", value: next })}
      />
      {!value ? <p className={styles.qPrompt} id="travel-self-question-prompt">{VALIDATION.chooseAnOption}</p> : null}
    </>
  );
}

function PassionsQuestion({
  selected,
  refusal,
  answer,
  setRefusal,
}: {
  selected: readonly PassionName[];
  refusal: string;
  answer: (action: TravelSelfAction) => void;
  setRefusal: (value: string) => void;
}) {
  function toggle(value: PassionName) {
    if (!selected.includes(value) && selected.length === 3) {
      setRefusal(VALIDATION.passionsRefusal);
      return;
    }
    setRefusal("");
    answer({ type: "toggle-passion", value });
  }

  return (
    <>
      <h2 id="travel-self-question-heading" tabIndex={-1}>{QUESTION_HEADINGS[7]}</h2>
      <p className={styles.qHelper}>{PASSIONS_HELPER}</p>
      <div className={styles.qPassions} role="group" aria-label={QUESTION_HEADINGS[7]}>
        {PASSIONS.map((passion) => (
          <button
            key={passion.name}
            type="button"
            aria-pressed={selected.includes(passion.name)}
            onClick={() => toggle(passion.name)}
          >
            <strong>{passion.name}</strong>
            <span>{passion.note}</span>
          </button>
        ))}
      </div>
      <p className={styles.qCounter} id="travel-self-question-prompt" aria-live="polite">
        {VALIDATION.passionsCounter(selected.length)}
      </p>
      <p className={styles.qRefusal} role="status">{refusal}</p>
    </>
  );
}

function FollowUpQuestion({
  selected,
  value,
  answer,
}: {
  selected: readonly PassionName[];
  value: PassionName | null;
  answer: (action: TravelSelfAction) => void;
}) {
  return (
    <>
      <h2 id="travel-self-question-heading" tabIndex={-1}>{QUESTION_HEADINGS[8]}</h2>
      <p className={styles.qHelper}>{FOLLOW_UP_HELPER}</p>
      <RadioChoices
        label={QUESTION_HEADINGS[8]}
        options={selected}
        value={value}
        onChange={(next) => answer({ type: "answer-lead", value: next })}
      />
      {!value ? <p className={styles.qPrompt} id="travel-self-question-prompt">{VALIDATION.chooseWhichLeads}</p> : null}
    </>
  );
}

function NarrowingRail({ state }: { state: TravelSelfState }) {
  const { step } = state;
  const answeredNamingAxes = AXES.slice(0, 4).filter(
    (axis) => state.answers.positions[axis.key] !== undefined,
  ).length;
  const remaining = 16 / 2 ** answeredNamingAxes;
  const line =
    step <= 4
      ? answeredNamingAxes === 0
        ? NARROWING.beforeAnyAnswer
        : NARROWING.remaining(remaining)
      : RAIL_PURPOSE[step];
  const detail =
    step <= 4
      ? answeredNamingAxes === 0
        ? NARROWING.beforeAnyAnswerNote
        : NARROWING.note
      : null;
  const visibleTiles = step <= 4 ? remaining : 1;

  return (
    <aside className={styles.qRail}>
      <figure className={styles.qFigure}>
        <Image
          alt=""
          className={styles.qImage}
          height={1086}
          sizes="(max-width: 520px) 0px, (max-width: 899px) 38vw, 23rem"
          src={QUESTION_IMAGES[step]}
          width={1448}
        />
      </figure>
      <div className={styles.qFieldFoot}>
        <div className={styles.qField} aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => (
            <span key={index} data-out={index >= visibleTiles ? "" : undefined} />
          ))}
        </div>
        <p className={styles.qNarrowLine}>{line}</p>
        {detail ? <p className={styles.qNarrowDetail}>{detail}</p> : null}
      </div>
    </aside>
  );
}

export function TravelSelfQuestionnaire({ onExit }: { onExit: () => void }) {
  const [state, setState] = useState<TravelSelfState>(() =>
    questionnaireState(INITIAL_TRAVEL_SELF_STATE),
  );
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [refusal, setRefusal] = useState("");
  const headingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let mounted = true;
    queueMicrotask(() => {
      if (!mounted) return;
      const loaded = loadTravelSelfState(storageForWindow());
      const next = questionnaireState(loaded.state);
      setState(next);
      setStorageAvailable(loaded.storageAvailable);
      if (next !== loaded.state) saveTravelSelfState(next, storageForWindow());
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    headingRef.current
      ?.querySelector<HTMLHeadingElement>("#travel-self-question-heading")
      ?.focus({ preventScroll: true });
  }, [state.step]);

  function answer(action: TravelSelfAction) {
    const next = travelSelfReducer(state, action);
    if (shouldPersistTravelSelfTransition(state, next, action)) {
      setStorageAvailable(saveTravelSelfState(next, storageForWindow()));
    }
    setState(next);
  }

  function goBack() {
    if (state.step === 1) {
      answer({ type: "back" });
      onExit();
      return;
    }
    setRefusal("");
    answer({ type: "back" });
  }

  function goNext() {
    if (!isStepAnswered(state)) return;
    setRefusal("");
    answer({ type: "next" });
  }

  const step = state.step;
  const answered = isStepAnswered(state);

  return (
    <section className={styles.travelSelfQ} style={STEP_STYLE[step]} aria-labelledby="travel-self-question-heading">
      <div className={styles.qBand}>
        <div className={styles.qWrap}>
          <p className={styles.qCount} aria-hidden="true">{String(step).padStart(2, "0")}</p>
          <p className={styles.qBandLabel} aria-live="polite">
            <span>{STEP_LABELS[step]}</span>
            <span aria-hidden="true"> · </span>
            <span>{NAV.stepLabel(step)}</span>
          </p>
          <div className={styles.qTicks} aria-hidden="true">
            {STEPS.map((candidate) => (
              <span
                key={candidate}
                data-done={candidate < step ? "" : undefined}
                data-now={candidate === step ? "" : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.qWrap}>
        <div className={styles.qColumns}>
          <div ref={headingRef} className={styles.qDecision}>
            {step === 1 ? <BeforeYouBegin storageAvailable={storageAvailable} /> : null}
            <div className={styles.qQuestion}>
              {step <= 5 ? <AxisQuestion step={step} state={state} answer={answer} /> : null}
              {step === 6 ? <TimeTogetherQuestion value={state.answers.timeTogether} answer={answer} /> : null}
              {step === 7 ? (
                <PassionsQuestion
                  selected={state.answers.passions}
                  refusal={refusal}
                  answer={answer}
                  setRefusal={setRefusal}
                />
              ) : null}
              {step === 8 ? (
                <FollowUpQuestion
                  selected={state.answers.passions}
                  value={state.answers.lead}
                  answer={answer}
                />
              ) : null}
            </div>

            <div className={styles.qActions}>
              <button className={styles.qButton} type="button" onClick={goBack}>{NAV.back}</button>
              <button
                className={`${styles.qButton} ${styles.qNext}`}
                type="button"
                aria-describedby={!answered ? "travel-self-question-prompt" : undefined}
                disabled={!answered}
                onClick={goNext}
              >
                {step === 8 ? NAV.submit : NAV.next}
              </button>
            </div>
          </div>

          <NarrowingRail state={state} />
        </div>
      </div>
    </section>
  );
}
