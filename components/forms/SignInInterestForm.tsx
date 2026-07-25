"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signInInterestFormContent } from "@/content/forms";
import {
  signInInterestSchema,
  type SignInInterestValues,
} from "@/lib/forms/schemas";

import { Field } from "./Field";
import { FormStatus } from "./FormStatus";
import { MockModeNotice } from "./MockModeNotice";
import styles from "./forms.module.css";
import { useFormSubmission } from "./useFormSubmission";

export function SignInInterestForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInterestValues>({
    resolver: zodResolver(signInInterestSchema),
    mode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      email: "",
    },
  });
  const {
    state,
    submit,
    showValidationState,
    clearSettledState,
    setFormElement,
  } = useFormSubmission("sign-in-interest");

  return (
    <form
      ref={setFormElement}
      className={styles.form}
      aria-label={signInInterestFormContent.ariaLabel}
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

      <Field
        id="sign-in-interest-email"
        label={signInInterestFormContent.emailLabel}
        required
        hint={signInInterestFormContent.emailHint}
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

      <MockModeNotice />

      <button
        className={styles.primaryAction}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? signInInterestFormContent.pendingActionLabel
          : signInInterestFormContent.actionLabel}
      </button>
    </form>
  );
}
