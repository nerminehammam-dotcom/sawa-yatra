"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { invitationRequestFormContent } from "@/content/forms";
import {
  invitationRequestSchema,
  type InvitationRequestValues,
} from "@/lib/forms/schemas";

import { ConsentField } from "./ConsentField";
import { Field } from "./Field";
import { FormStatus } from "./FormStatus";
import { MockModeNotice } from "./MockModeNotice";
import styles from "./forms.module.css";
import { useFormSubmission } from "./useFormSubmission";

export function InvitationRequestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvitationRequestValues>({
    resolver: zodResolver(invitationRequestSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      country: "",
      travelInterest: "",
      consent: false,
    },
  });
  const submission = useFormSubmission("invitation-request");

  return (
    <form
      className={styles.form}
      aria-label={invitationRequestFormContent.ariaLabel}
      aria-busy={isSubmitting}
      noValidate
      onChange={submission.clearSettledState}
      onSubmit={handleSubmit(
        submission.submit,
        submission.showValidationState,
      )}
    >
      {submission.state.status !== "idle" ? (
        <FormStatus
          tone={submission.state.status}
          title={submission.state.title}
          message={submission.state.message}
        />
      ) : null}

      <Field
        id="invitation-name"
        label={invitationRequestFormContent.fields.name}
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
        id="invitation-email"
        label={invitationRequestFormContent.fields.email}
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
        id="invitation-country"
        label={invitationRequestFormContent.fields.country}
        required
        error={errors.country?.message}
      >
        {(controlProps) => (
          <input
            {...register("country")}
            {...controlProps}
            className={styles.control}
            type="text"
            autoComplete="country-name"
            maxLength={100}
          />
        )}
      </Field>

      <Field
        id="invitation-travel-interest"
        label={invitationRequestFormContent.fields.travelInterest}
        required
        hint={invitationRequestFormContent.travelInterestHint}
        error={errors.travelInterest?.message}
      >
        {(controlProps) => (
          <textarea
            {...register("travelInterest")}
            {...controlProps}
            className={`${styles.control} ${styles.textarea}`}
            rows={5}
            maxLength={2_000}
          />
        )}
      </Field>

      <ConsentField
        id="invitation-consent"
        registration={register("consent")}
        error={errors.consent?.message}
      />

      <MockModeNotice />

      <button
        className={styles.primaryAction}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? invitationRequestFormContent.pendingActionLabel
          : invitationRequestFormContent.actionLabel}
      </button>
    </form>
  );
}
