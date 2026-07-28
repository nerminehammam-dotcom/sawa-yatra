"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { contactQuestionFormContent } from "@/content/forms";
import {
  contactQuestionSchema,
  type ContactQuestionValues,
} from "@/lib/forms/schemas";

import { Field } from "./Field";
import { FormStatus } from "./FormStatus";
import styles from "./forms.module.css";

interface ContactQuestionFormProps {
  initialJourneyContext?: string;
}

type ContactFormState = "idle" | "validation" | "unavailable";

export function ContactQuestionForm({
  initialJourneyContext = "",
}: ContactQuestionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submissionState, setSubmissionState] =
    useState<ContactFormState>("idle");
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

  useLayoutEffect(() => {
    if (submissionState !== "validation") return;

    formRef.current
      ?.querySelector<HTMLElement>('[data-tone="validation"][role="alert"]')
      ?.focus();
  }, [submissionState]);

  return (
    <form
      ref={formRef}
      className={styles.form}
      aria-label={contactQuestionFormContent.ariaLabel}
      noValidate
      onChange={() => {
        if (submissionState !== "idle") setSubmissionState("idle");
      }}
      onSubmit={handleSubmit(
        () => setSubmissionState("unavailable"),
        () => setSubmissionState("validation"),
      )}
    >
      {submissionState === "validation" ? (
        <FormStatus
          tone="validation"
          title="Check the form"
          message="Correct the marked fields, then try again."
        />
      ) : null}
      {submissionState === "unavailable" ? (
        <FormStatus
          tone="network-error"
          title={contactQuestionFormContent.unavailableTitle}
          message={contactQuestionFormContent.unavailableMessage}
        />
      ) : null}

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

      <button className={styles.primaryAction} type="submit">
        {contactQuestionFormContent.actionLabel}
      </button>
    </form>
  );
}
