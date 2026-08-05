"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { archetypeById } from "@/content/archetypes";
import { journeyInterestFormContent } from "@/content/forms";
import {
  createJourneyInterestClientSchema,
  NOT_COMPLETED_TRAVEL_SELF,
  type JourneyInterestValues,
} from "@/lib/forms/schemas";
import type { ArchetypeId } from "@/lib/types";

import { ConsentField } from "./ConsentField";
import { Field } from "./Field";
import { FormStatus } from "./FormStatus";
import { DataHandlingNotice } from "./DataHandlingNotice";
import styles from "./forms.module.css";
import { useFormSubmission } from "./useFormSubmission";

export interface JourneyFormReference {
  id: string;
  label: string;
}

function travelSelfLabel(id: string): string {
  return id in archetypeById
    ? archetypeById[id as ArchetypeId].name
    : id;
}

interface JourneyInterestFormProps {
  journey: string | JourneyFormReference;
  availableTravelSelfIds: readonly string[];
}

export function JourneyInterestForm({
  journey,
  availableTravelSelfIds,
}: JourneyInterestFormProps) {
  const journeyId = typeof journey === "string" ? journey : journey.id;
  const journeyLabel = typeof journey === "string" ? journey : journey.label;
  const travelSelfIds = useMemo(
    () =>
      Array.from(new Set(availableTravelSelfIds)).filter(
        (id) => id !== NOT_COMPLETED_TRAVEL_SELF,
      ),
    [availableTravelSelfIds],
  );
  const clientSchema = useMemo(
    () => createJourneyInterestClientSchema(travelSelfIds),
    [travelSelfIds],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JourneyInterestValues>({
    resolver: zodResolver(clientSchema),
    mode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      name: "",
      email: "",
      journey: journeyId,
      travelSelfResult: undefined,
      shortNote: "",
      consent: false,
    },
  });
  const {
    state,
    submit,
    showValidationState,
    clearSettledState,
    setFormElement,
  } = useFormSubmission("journey-interest");

  return (
    <form
      ref={setFormElement}
      className={styles.form}
      aria-label={`${journeyInterestFormContent.ariaLabelPrefix} ${journeyLabel}`}
      aria-busy={isSubmitting}
      noValidate
      onChange={clearSettledState}
      onSubmit={handleSubmit(submit, showValidationState)}
    >
      {state.status !== "idle" ? (
        <FormStatus
          tone={state.status}
          title={state.title}
          message={state.message}
        />
      ) : null}

      <div className={styles.journeyContext}>
        <span>{journeyInterestFormContent.journeyLabel}</span>
        <strong>{journeyLabel}</strong>
      </div>
      <input {...register("journey")} type="hidden" value={journeyId} />
      {errors.journey?.message ? (
        <p className={styles.fieldError}>
          <span className={styles.statusWord}>Error:</span>{" "}
          {errors.journey.message}
        </p>
      ) : null}

      <Field
        id="journey-interest-name"
        label={journeyInterestFormContent.fields.name}
        required
        error={errors.name?.message}
      >
        {(controlProps) => (
          <input
            {...register("name")}
            {...controlProps}
            className={styles.control}
            type="text"
            autoComplete="name"
            maxLength={120}
          />
        )}
      </Field>

      <Field
        id="journey-interest-email"
        label={journeyInterestFormContent.fields.email}
        required
        error={errors.email?.message}
      >
        {(controlProps) => (
          <input
            {...register("email")}
            {...controlProps}
            className={styles.control}
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
          />
        )}
      </Field>

      <Field
        id="journey-interest-travel-self"
        label={journeyInterestFormContent.fields.travelSelf}
        required
        error={errors.travelSelfResult?.message}
      >
        {(controlProps) => (
          <select
            {...register("travelSelfResult")}
            {...controlProps}
            className={styles.control}
            defaultValue=""
          >
            <option value="" disabled>
              {journeyInterestFormContent.travelSelfPrompt}
            </option>
            <option value={NOT_COMPLETED_TRAVEL_SELF}>
              {journeyInterestFormContent.travelSelfNotCompleted}
            </option>
            {travelSelfIds.map((travelSelfId) => (
              <option key={travelSelfId} value={travelSelfId}>
                {travelSelfLabel(travelSelfId)}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field
        id="journey-interest-note"
        label={journeyInterestFormContent.fields.note}
        required
        hint={journeyInterestFormContent.noteHint}
        error={errors.shortNote?.message}
      >
        {(controlProps) => (
          <textarea
            {...register("shortNote")}
            {...controlProps}
            className={`${styles.control} ${styles.textarea}`}
            rows={5}
            maxLength={2_000}
          />
        )}
      </Field>

      <ConsentField
        id="journey-interest-consent"
        registration={register("consent")}
        error={errors.consent?.message}
      />

      <DataHandlingNotice />

      <button
        className={styles.primaryAction}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? journeyInterestFormContent.pendingActionLabel
          : journeyInterestFormContent.actionLabel}
      </button>
    </form>
  );
}
