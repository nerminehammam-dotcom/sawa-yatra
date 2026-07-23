import type { FormKind, FormValuesByKind } from "./schemas";

export interface FormSubmission<K extends FormKind = FormKind> {
  kind: K;
  values: FormValuesByKind[K];
}

export interface FormAdapterResult {
  acknowledged: boolean;
  sent: boolean;
  stored: boolean;
  reason: "development-mock" | "not-configured";
}

export interface FormDeliveryAdapter {
  readonly name: "development-mock" | "resend-api";
  readonly configured: boolean;
  submit<K extends FormKind>(
    submission: FormSubmission<K>,
  ): Promise<FormAdapterResult>;
}

/**
 * Release 1 mock adapter. It deliberately does not send, persist, log, or
 * otherwise inspect submitted values.
 */
export const developmentMockFormAdapter: FormDeliveryAdapter = {
  name: "development-mock",
  configured: true,
  async submit<K extends FormKind>(
    submission: FormSubmission<K>,
  ): Promise<FormAdapterResult> {
    void submission;

    return {
      acknowledged: true,
      sent: false,
      stored: false,
      reason: "development-mock",
    };
  },
};

/**
 * Interface-only integration seam for a future Resend/API implementation.
 * No SDK, endpoint, recipient, credentials, or live delivery behaviour is
 * configured in Release 1.
 */
export const resendApiFormAdapterStub: FormDeliveryAdapter = {
  name: "resend-api",
  configured: false,
  async submit<K extends FormKind>(
    submission: FormSubmission<K>,
  ): Promise<FormAdapterResult> {
    void submission;

    return {
      acknowledged: false,
      sent: false,
      stored: false,
      reason: "not-configured",
    };
  },
};
