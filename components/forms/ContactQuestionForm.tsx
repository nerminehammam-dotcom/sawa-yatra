"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { contactQuestionFormContent } from "@/content/forms";
import {
  contactQuestionSchema,
  type ContactQuestionValues,
} from "@/lib/forms/schemas";

import { DataHandlingNotice } from "./DataHandlingNotice";
import { Field } from "./Field";
import { FormStatus } from "./FormStatus";
import { useFormSubmission } from "./useFormSubmission";
import styles from "./forms.module.css";

interface ContactQuestionFormProps {
  initialJourneyContext?: string;
}

export function ContactQuestionForm({
  initialJourneyContext = "",
}: ContactQuestionFormProps) {
  const { state, submit, showValidationState, clearSettledState, setFormElement } =
    useFormSubmission("contact-question");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactQuestionValues>({
    resolver: zodResolver(contactQuestionSchema),
    shouldFocusError: false,
    defaultValues: {
      name: "",
      email: "",
      question: "",
      journeyContext: initialJourneyContext,
    },
  });

  return (
    <form
      ref={setFormElement}
      className={styles.form}
      aria-label={contactQuestionFormContent.ariaLabel}
      noValidate
      onChange={clearSettledState}
      onSubmit={handleSubmit(
        (values) => void submit(values),
        () => showValidationState(),
      )}
    >
      {state.status === "idle" ? null : (
        <FormStatus
          tone={state.status}
          title={state.title}
          message={state.message}
        />
      )}

      <Field
        id="contact-name"
        label={contactQuestionFormContent.fields.name}
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
          />
        )}
      </Field>

      <Field
        id="contact-email"
        label={contactQuestionFormContent.fields.email}
        required
        error={errors.email?.message}
      >
        {(controlProps) => (
          <input
            {...register("email")}
            {...controlProps}
            className={styles.control}
            type="email"
            autoComplete="email"
            inputMode="email"
          />
        )}
      </Field>

      <Field
        id="contact-question"
        label={contactQuestionFormContent.fields.question}
        required
        hint={contactQuestionFormContent.questionHint}
        error={errors.question?.message}
      >
        {(controlProps) => (
          <textarea
            {...register("question")}
            {...controlProps}
            className={`${styles.control} ${styles.textarea}`}
            rows={7}
          />
        )}
      </Field>

      <Field
        id="contact-journey-context"
        label={contactQuestionFormContent.fields.journeyContext}
        hint={contactQuestionFormContent.journeyContextHint}
        error={errors.journeyContext?.message}
      >
        {(controlProps) => (
          <input
            {...register("journeyContext")}
            {...controlProps}
            className={styles.control}
            type="text"
          />
        )}
      </Field>

      <DataHandlingNotice />

      <button
        className={styles.primaryAction}
        type="submit"
        disabled={state.status === "pending"}
      >
        {contactQuestionFormContent.actionLabel}
      </button>
    </form>
  );
}
