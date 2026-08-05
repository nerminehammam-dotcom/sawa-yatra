import type { FormKind, FormValuesByKind } from "./schemas";

export interface FormSubmission<K extends FormKind = FormKind> {
  kind: K;
  values: FormValuesByKind[K];
}

export interface FormAdapterResult {
  acknowledged: boolean;
  sent: boolean;
  stored: boolean;
  reason:
    | "development-mock"
    | "not-configured"
    | "delivered"
    | "delivery-failed";
  /** Present only when reason is "delivery-failed". Never contains form values. */
  failure?: string;
}

export interface FormDeliveryAdapter {
  readonly name: "development-mock" | "email";
  readonly configured: boolean;
  submit<K extends FormKind>(
    submission: FormSubmission<K>,
  ): Promise<FormAdapterResult>;
}

/**
 * Development mock. Deliberately does not send, persist, log, or otherwise
 * inspect submitted values.
 *
 * Only ever reached when the email adapter is unconfigured AND NODE_ENV is not
 * production — see resolveFormAdapter. In production an unconfigured adapter is
 * an error, never a silent success: a form that validates someone's details,
 * thanks them and discards them is worse than one that visibly fails.
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

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DELIVERY_TIMEOUT_MS = 10_000;

const subjectByKind: Record<FormKind, string> = {
  "invitation-request": "Invitation request",
  "journey-interest": "Journey interest",
  "sign-in-interest": "Member access interest",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fieldLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase())
    .trim();
}

function renderSubmission(kind: FormKind, values: Record<string, unknown>) {
  const rows = Object.entries(values).filter(([key]) => key !== "consent");
  const consentLine =
    values.consent === true ? "ticked" : "not present on this form";

  const text = [
    `${subjectByKind[kind]} — sawayatra`,
    "",
    ...rows.map(([key, value]) => `${fieldLabel(key)}: ${String(value)}`),
    "",
    `Consent checkbox: ${consentLine}`,
    `Received: ${new Date().toISOString()}`,
  ].join("\n");

  const html = [
    `<h2 style="font:500 18px system-ui,sans-serif">${escapeHtml(
      subjectByKind[kind],
    )}</h2>`,
    '<table style="font:14px system-ui,sans-serif;border-collapse:collapse">',
    ...rows.map(
      ([key, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${escapeHtml(
          fieldLabel(key),
        )}</td><td style="padding:4px 0">${escapeHtml(String(value)).replace(
          /\n/g,
          "<br>",
        )}</td></tr>`,
    ),
    `<tr><td style="padding:4px 16px 4px 0;color:#666">Consent</td><td style="padding:4px 0">${consentLine}</td></tr>`,
    "</table>",
  ].join("");

  return { text, html };
}

/**
 * Email delivery via Resend, over plain fetch — no SDK, no new dependency.
 *
 * Requires all three of RESEND_API_KEY, SAWAYATRA_FORM_RECIPIENT and
 * SAWAYATRA_FORM_SENDER. Missing any one leaves it unconfigured, which is a
 * hard failure in production rather than a fallback.
 *
 * The visitor's own address is set as reply-to, so replying reaches them
 * directly. Values go to the recipient and are logged nowhere.
 */
export const emailFormAdapter: FormDeliveryAdapter = {
  name: "email",
  get configured() {
    return Boolean(
      process.env.RESEND_API_KEY?.trim() &&
        process.env.SAWAYATRA_FORM_RECIPIENT?.trim() &&
        process.env.SAWAYATRA_FORM_SENDER?.trim(),
    );
  },
  async submit<K extends FormKind>(
    submission: FormSubmission<K>,
  ): Promise<FormAdapterResult> {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const recipient = process.env.SAWAYATRA_FORM_RECIPIENT?.trim();
    const sender = process.env.SAWAYATRA_FORM_SENDER?.trim();

    if (!apiKey || !recipient || !sender) {
      return {
        acknowledged: false,
        sent: false,
        stored: false,
        reason: "not-configured",
      };
    }

    const values = submission.values as unknown as Record<string, unknown>;
    const { text, html } = renderSubmission(submission.kind, values);
    const replyTo = typeof values.email === "string" ? values.email : undefined;

    try {
      const response = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: sender,
          to: [recipient],
          subject: `Sawayatra — ${subjectByKind[submission.kind]}`,
          text,
          html,
          ...(replyTo ? { reply_to: replyTo } : {}),
        }),
        signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
      });

      if (!response.ok) {
        // Status only — the error body can echo the submitted payload back.
        return {
          acknowledged: false,
          sent: false,
          stored: false,
          reason: "delivery-failed",
          failure: `Delivery service returned ${response.status}.`,
        };
      }

      return {
        acknowledged: true,
        sent: true,
        stored: false,
        reason: "delivered",
      };
    } catch {
      return {
        acknowledged: false,
        sent: false,
        stored: false,
        reason: "delivery-failed",
        failure: "Delivery service could not be reached.",
      };
    }
  },
};

/**
 * Email if configured. Otherwise the mock — but only outside production. In
 * production an unconfigured adapter returns null so the route can fail
 * loudly, making a broken configuration visible at once instead of quietly
 * losing every enquiry.
 */
export function resolveFormAdapter(): FormDeliveryAdapter | null {
  if (emailFormAdapter.configured) {
    return emailFormAdapter;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return developmentMockFormAdapter;
}
