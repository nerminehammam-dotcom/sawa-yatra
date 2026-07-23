"use client";

import { useCallback, useState } from "react";

import { formUiContent } from "@/content/forms";
import { submitMockForm } from "@/lib/forms/client";
import type { FormKind, FormValuesByKind } from "@/lib/forms/schemas";

import type { FormStatusTone } from "./FormStatus";

interface VisibleSubmissionState {
  status: Exclude<FormStatusTone, never>;
  title: string;
  message: string;
}

type SubmissionState = { status: "idle" } | VisibleSubmissionState;

const idleState: SubmissionState = { status: "idle" };

export function useFormSubmission<K extends FormKind>(kind: K) {
  const [state, setState] = useState<SubmissionState>(idleState);

  const submit = useCallback(
    async (values: FormValuesByKind[K]) => {
      setState({
        status: "pending",
        title: formUiContent.submission.pendingTitle,
        message: formUiContent.submission.pendingMessage,
      });

      const result = await submitMockForm(kind, values);

      switch (result.status) {
        case "success":
          setState({
            status: "success",
            title: formUiContent.submission.successTitle,
            message: result.localReceiptSaved
              ? `${result.response.message} ${formUiContent.submission.localReceiptSavedSuffix}`
              : `${result.response.message} ${formUiContent.submission.localReceiptUnavailableSuffix}`,
          });
          break;
        case "duplicate":
          setState({
            status: "duplicate",
            title: formUiContent.submission.duplicateTitle,
            message: formUiContent.submission.duplicateMessage,
          });
          break;
        case "validation-error":
          setState({
            status: "validation",
            title: formUiContent.submission.validationTitle,
            message: result.message,
          });
          break;
        case "network-error":
          setState({
            status: "network-error",
            title: formUiContent.submission.networkErrorTitle,
            message: result.message,
          });
          break;
      }

      return result;
    },
    [kind],
  );

  const showValidationState = useCallback(() => {
    setState({
      status: "validation",
      title: formUiContent.submission.validationTitle,
      message: formUiContent.submission.validationMessage,
    });
  }, []);

  const clearSettledState = useCallback(() => {
    setState((currentState) =>
      currentState.status === "pending" ? currentState : idleState,
    );
  }, []);

  return {
    state,
    submit,
    showValidationState,
    clearSettledState,
  };
}
