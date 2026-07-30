"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  AXES,
  POSITION_OPACITY,
  POSITION_STRENGTH,
  SLIDER_HELPER,
  type AxisId,
  type AxisPosition,
  type AxisPositions,
  type TravelAxis,
} from "@/content/travel-self/axes";
import { TRAVEL_SELF_COPY as COPY } from "@/content/travel-self/copy";
import { FAMILIES, FAMILY_LIST } from "@/content/travel-self/families";
import { PASSIONS, PASSION_BY_ID, type PassionId } from "@/content/travel-self/passions";
import { bendLine, comfortPole, familyKey, motivationLine, stingLine } from "@/lib/travel-self/engine";
import {
  TIME_TOGETHER_OPTIONS,
  TRAVEL_SELF_STORAGE_VERSION,
  annualPromptDue,
  readStoredTravelSelf,
  writeStoredTravelSelf,
  type StoredTravelSelf,
  type TimeTogether,
} from "@/lib/travel-self/storage";

import styles from "./travel-self.module.css";
import { TravelSelfQuestionnaire } from "./TravelSelfQuestionnaire";

type View = "intro" | "questionnaire" | "result" | "passport";
type QuestionnaireReturnView = "intro" | "passport";
type PartialPositions = Partial<Record<AxisId, AxisPosition>>;

interface DraftState {
  positions: PartialPositions;
  timeTogether: TimeTogether | null;
  passions: PassionId[];
  lead: PassionId | null;
}

const EMPTY_DRAFT: DraftState = {
  positions: {},
  timeTogether: null,
  passions: [],
  lead: null,
};

function isCompletePositions(value: PartialPositions): value is AxisPositions {
  return AXES.every((axis) => value[axis.id] !== undefined);
}

function uppercaseFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function storageForWindow(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function InkSlider({
  axis,
  value,
  onChange,
}: {
  axis: TravelAxis;
  value?: AxisPosition;
  onChange: (value: AxisPosition) => void;
}) {
  const groupRef = useRef<HTMLDivElement>(null);

  function choose(position: AxisPosition, focus = false) {
    onChange(position);
    if (focus) {
      window.requestAnimationFrame(() => {
        groupRef.current?.querySelector<HTMLButtonElement>(`[data-position="${position}"]`)?.focus();
      });
    }
  }

  function move(event: KeyboardEvent<HTMLButtonElement>, current: AxisPosition) {
    const movement: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const delta = movement[event.key];
    if (!delta) return;
    event.preventDefault();
    choose(Math.max(1, Math.min(6, current + delta)) as AxisPosition, true);
  }

  return (
    <div className={styles.sliderBlock} style={{ "--axis-ink": axis.token } as CSSProperties}>
      <div className={styles.poles} aria-hidden="true">
        <span>
          <strong>{axis.left.name}</strong>
          <small>{axis.left.gloss}</small>
        </span>
        <span className={styles.rightPole}>
          <strong>{axis.right.name}</strong>
          <small>{axis.right.gloss}</small>
        </span>
      </div>
      <div ref={groupRef} className={styles.inkScale} role="radiogroup" aria-label={axis.label}>
        {([1, 2, 3, 4, 5, 6] as const).map((position, index) => {
          const selected = value === position;
          const pole = position <= 3 ? axis.left.name : axis.right.name;
          return (
            <button
              key={position}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${POSITION_STRENGTH[index]} ${pole}`}
              data-position={position}
              className={styles.inkPosition}
              tabIndex={selected || (!value && position === 1) ? 0 : -1}
              style={{ "--position-opacity": POSITION_OPACITY[index] } as CSSProperties}
              onClick={() => choose(position)}
              onKeyDown={(event) => move(event, position)}
            >
              <span aria-hidden="true">{position}</span>
            </button>
          );
        })}
      </div>
      <p className={styles.sliderHelper}>{SLIDER_HELPER}</p>
      <p className={styles.echo} aria-live="polite">
        {value ? axis.echo[value - 1] : null}
      </p>
    </div>
  );
}

function NarrowingPanel({ positions, step }: { positions: PartialPositions; step: number }) {
  const namingAnswered = AXES.filter((axis) => axis.naming && positions[axis.id]).length;
  const remaining = 16 / 2 ** namingAnswered;
  const settled = namingAnswered === 4;
  const [line, detail] = COPY.narrowing[namingAnswered] ?? COPY.narrowing[4];

  return (
    <aside className={styles.narrowing} aria-label="Travel Self narrowing">
      <p className={styles.panelEyebrow}>Sixteen travel selves</p>
      <div className={styles.tiles} aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} data-active={index < remaining} />
        ))}
      </div>
      <p className={styles.narrowLine}>{line}</p>
      <p className={styles.narrowDetail}>{settled && step > 3 ? COPY.narrowingSettled : detail}</p>
    </aside>
  );
}

function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  display = (option) => option,
}: {
  label: string;
  options: readonly T[];
  value: T | null;
  onChange: (value: T) => void;
  display?: (value: T) => string;
}) {
  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const movement: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const delta = movement[event.key];
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + options.length) % options.length;
    const nextValue = options[next];
    if (nextValue === undefined) return;
    onChange(nextValue);
    window.requestAnimationFrame(() => {
      event.currentTarget.parentElement?.parentElement
        ?.querySelectorAll<HTMLButtonElement>("[role=radio]")[next]
        ?.focus();
    });
  }

  return (
    <div className={styles.choiceList} role="radiogroup" aria-label={label}>
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
          {display(option)}
        </button>
      ))}
    </div>
  );
}

function BeforeYouBegin() {
  return (
    <section className={styles.before} aria-labelledby="before-title">
      <h2 id="before-title">{COPY.before.heading}</h2>
      {COPY.before.groups.map(([lead, detail]) => (
        <div key={lead}>
          <p>{lead}</p>
          <p>{detail}</p>
        </div>
      ))}
    </section>
  );
}

export function TravelSelfQuiz({ children }: { children?: ReactNode }) {
  const hasServerIntroduction = children !== undefined;
  const [view, setView] = useState<View>("intro");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [stored, setStored] = useState<StoredTravelSelf | null>(null);
  const [refusal, setRefusal] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const returnViewRef = useRef<QuestionnaireReturnView>("intro");

  useLayoutEffect(() => {
    let mounted = true;
    queueMicrotask(() => {
      if (!mounted) return;
      const record = readStoredTravelSelf(storageForWindow());
      if (record) {
        setStored(record);
        setDraft({
          positions: record.positions,
          timeTogether: record.timeTogether,
          passions: [...record.passions],
          lead: record.lead,
        });
      }

      if (
        hasServerIntroduction &&
        new URLSearchParams(window.location.search).get("stage") === "questionnaire"
      ) {
        setView("questionnaire");
      } else if (record) {
        setView("passport");
      }
    });

    return () => {
      mounted = false;
    };
  }, [hasServerIntroduction]);

  useEffect(() => {
    const syncToHistory = (event: PopStateEvent) => {
      const stage = new URLSearchParams(window.location.search).get("stage");
      if (stage === "questionnaire") {
        setView("questionnaire");
        return;
      }
      if (event.state?.travelSelfStage === "result") {
        setView("result");
        return;
      }
      setView(returnViewRef.current);
    };

    window.addEventListener("popstate", syncToHistory);
    return () => window.removeEventListener("popstate", syncToHistory);
  }, []);

  useEffect(() => {
    if (view !== "questionnaire") return;
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "start" });
  }, [step, view]);

  useEffect(() => {
    if (view === "result") resultHeadingRef.current?.focus();
  }, [view]);

  const completed = useMemo(() => {
    if (!isCompletePositions(draft.positions) || !draft.timeTogether || draft.passions.length !== 3 || !draft.lead) return null;
    if (!draft.passions.includes(draft.lead)) return null;
    const passions = draft.passions as [PassionId, PassionId, PassionId];
    const key = familyKey(draft.positions);
    return {
      key,
      family: FAMILIES[key],
      positions: draft.positions,
      timeTogether: draft.timeTogether,
      passions,
      lead: draft.lead,
      motivation: motivationLine(passions),
      comfort: comfortPole(draft.positions),
      bend: bendLine(draft.positions),
      sting: stingLine(draft.positions),
    };
  }, [draft]);

  function updatePosition(axis: AxisId, position: AxisPosition) {
    setDraft((current) => ({ ...current, positions: { ...current.positions, [axis]: position } }));
  }

  function showQuestionnaire(returnView: QuestionnaireReturnView) {
    returnViewRef.current = returnView;
    setStep(0);
    setView("questionnaire");

    if (hasServerIntroduction) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.delete("self");
      nextUrl.searchParams.set("stage", "questionnaire");
      window.history.pushState(
        { travelSelfStage: "questionnaire" },
        "",
        nextUrl,
      );
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function beginFromIntroduction(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest("[data-travel-self-begin]")) return;
    showQuestionnaire("intro");
  }

  function leaveQuestionnaire() {
    const currentUrl = new URL(window.location.href);
    const isPushedQuestionnaire =
      currentUrl.searchParams.get("stage") === "questionnaire" &&
      window.history.state?.travelSelfStage === "questionnaire";

    if (isPushedQuestionnaire) {
      window.history.back();
      return;
    }

    currentUrl.searchParams.delete("stage");
    window.history.replaceState(null, "", currentUrl);
    setView(returnViewRef.current);
  }

  function stepAnswered(): boolean {
    if (step < 5) {
      const axis = AXES[step];
      return axis ? draft.positions[axis.id] !== undefined : false;
    }
    if (step === 5) return draft.timeTogether !== null;
    if (step === 6) return draft.passions.length === 3;
    return draft.lead !== null;
  }

  function goBack() {
    if (step > 0) {
      setStep((current) => current - 1);
      return;
    }
    leaveQuestionnaire();
  }

  function goNext() {
    if (!stepAnswered()) return;
    if (step < 7) {
      setStep((current) => current + 1);
      return;
    }
    if (!completed) return;
    const record: StoredTravelSelf = {
      version: TRAVEL_SELF_STORAGE_VERSION,
      positions: completed.positions,
      timeTogether: completed.timeTogether,
      passions: completed.passions,
      lead: completed.lead,
      updatedAt: Date.now(),
    };
    writeStoredTravelSelf(record, storageForWindow());
    setStored(record);
    setView("result");
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.delete("stage");
    shareUrl.searchParams.set("self", completed.key);
    window.history.replaceState({ travelSelfStage: "result" }, "", shareUrl);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function updatePassions(passion: PassionId) {
    setRefusal("");
    setDraft((current) => {
      if (current.passions.includes(passion)) {
        const next = current.passions.filter((item) => item !== passion);
        return { ...current, passions: next, lead: next.includes(current.lead as PassionId) ? current.lead : null };
      }
      if (current.passions.length === 3) {
        setRefusal(COPY.passions.refusal);
        return current;
      }
      return { ...current, passions: [...current.passions, passion] };
    });
  }

  function beginUpdate() {
    if (!stored) return;
    setDraft({ positions: stored.positions, timeTogether: stored.timeTogether, passions: [...stored.passions], lead: stored.lead });
    showQuestionnaire("passport");
  }

  function dismissAnnual() {
    if (!stored) return;
    const next = { ...stored, annualDismissedAt: Date.now() };
    writeStoredTravelSelf(next, storageForWindow());
    setStored(next);
  }

  if (view === "intro") {
    return (
      <div onClick={beginFromIntroduction}>
        {children ?? (
          <section>
            <h1>Your Travel Self</h1>
            <button data-travel-self-begin type="button">Begin</button>
          </section>
        )}
      </div>
    );
  }

  if (view === "questionnaire") {
    if (hasServerIntroduction) {
      return <TravelSelfQuestionnaire onExit={leaveQuestionnaire} />;
    }

    const axis = step < 5 ? AXES[step] : null;
    const heading = axis?.question ?? (step === 5 ? COPY.timeTogether.question : step === 6 ? COPY.passions.question : COPY.followUp.question);
    return (
      <div className={styles.questionnaire}>
        <Container>
          <div className={styles.questionGrid}>
            <div>
              <p className={styles.progress} aria-live="polite">{COPY.progress(step + 1)}</p>
              {step === 0 ? <BeforeYouBegin /> : null}
              <section className={styles.question} aria-labelledby="question-heading">
                <h2 ref={headingRef} id="question-heading" tabIndex={-1}>{heading}</h2>
                {axis ? (
                  <InkSlider key={axis.id} axis={axis} value={draft.positions[axis.id]} onChange={(position) => updatePosition(axis.id, position)} />
                ) : step === 5 ? (
                  <>
                    <p className={styles.questionHelper}>{COPY.timeTogether.helper}</p>
                    <ChoiceGroup label="Time together" options={TIME_TOGETHER_OPTIONS} value={draft.timeTogether} onChange={(timeTogether) => setDraft((current) => ({ ...current, timeTogether }))} />
                  </>
                ) : step === 6 ? (
                  <>
                    <p className={styles.questionHelper}>{COPY.passions.helper}</p>
                    <p className={styles.selectionCount}>{draft.passions.length} of three chosen</p>
                    <div className={styles.passionGrid}>
                      {PASSIONS.map((passion) => (
                        <button key={passion.id} type="button" className={styles.passion} aria-pressed={draft.passions.includes(passion.id)} onClick={() => updatePassions(passion.id)}>
                          <strong>{passion.name}</strong><span>{passion.line}</span>
                        </button>
                      ))}
                    </div>
                    <p className={styles.refusal} role="status">{refusal}</p>
                  </>
                ) : (
                  <>
                    <p className={styles.questionHelper}>{COPY.followUp.helper}</p>
                    <ChoiceGroup label="Leading passion" options={draft.passions} value={draft.lead} display={(passion) => PASSION_BY_ID[passion].name} onChange={(lead) => setDraft((current) => ({ ...current, lead }))} />
                  </>
                )}
              </section>
              <div className={styles.questionActions}>
                <Button variant="secondary" onClick={goBack}>{step === 0 ? COPY.backToIntroduction : COPY.back}</Button>
                <Button disabled={!stepAnswered()} onClick={goNext}>{step === 7 ? COPY.submit : COPY.next}</Button>
              </div>
            </div>
            <NarrowingPanel positions={draft.positions} step={step} />
          </div>
        </Container>
      </div>
    );
  }

  if (!completed) return null;
  const returning = view === "passport";

  return (
    <div className={styles.resultPage}>
      <section className={returning ? styles.returningHeader : styles.resultStage} aria-labelledby="result-name">
        <Container>
          {returning ? <p className={styles.resultEyebrow}>{COPY.resultEyebrow}</p> : null}
          <h1 ref={resultHeadingRef} id="result-name" tabIndex={-1}>{completed.family.name}</h1>
          <p className={styles.resultReadout}>{completed.family.readout}</p>
        </Container>
      </section>
      <Container>
        <section className={styles.passport} aria-label="Your Travel Self passport">
          {returning && stored && annualPromptDue(stored) ? (
            <div className={styles.annual}>
              <p>{COPY.annual}</p>
              <button type="button" onClick={dismissAnnual}>{COPY.dismiss}</button>
            </div>
          ) : null}
          {returning ? <div className={styles.updateAction}><Button onClick={beginUpdate}>{COPY.update}</Button></div> : null}
          <dl>
            <div><dt>{COPY.passportFields.essence}</dt><dd>{completed.family.essence}</dd></div>
            <div><dt>{COPY.passportFields.bring}</dt><dd>{uppercaseFirst(completed.family.whatYouBring)}</dd></div>
            <div><dt>{COPY.passportFields.motivation}</dt><dd>{completed.motivation}</dd></div>
            <div><dt>{COPY.passportFields.comfort}</dt><dd>{completed.comfort}</dd></div>
            <div><dt>{COPY.passportFields.time}</dt><dd>{completed.timeTogether}</dd></div>
            <div><dt>{COPY.passportFields.bend}</dt><dd>{completed.bend}</dd></div>
            <div className={styles.sting}><dt>{COPY.passportFields.sting}</dt><dd>{completed.sting}</dd></div>
          </dl>
          <p className={styles.boundary}>{COPY.boundary}</p>
          <p>{COPY.changeLater}</p>
        </section>
        <section className={styles.otherFamilies} aria-labelledby="other-families-title">
          <h2 id="other-families-title">{COPY.others.heading}</h2>
          <p>{COPY.others.introduction}</p>
          <ul>
            {FAMILY_LIST.map((family) => (
              <li key={family.key} data-current={family.key === completed.key}>
                <div><strong>{family.name}</strong>{family.key === completed.key ? <span>{COPY.others.ownMarker}</span> : null}</div>
                <p>{family.readout}</p>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </div>
  );
}
