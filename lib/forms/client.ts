"use client";

import { z } from "zod";

import { formUiContent } from "@/content/forms";

import {
  formErrorResponseSchema,
  formSuccessResponseSchema,
  type FormSuccessResponse,
} from "./protocol";
import {
  getFormSchema,
  type FormKind,
  type FormValuesByKind,
} from "./schemas";

const STORAGE_KEY = "sawayatra:form-receipts";
const MAX_LOCAL_RECEIPTS = 24;

const localReceiptSchema = z
  .object({
    version: z.literal(1),
    kind: z.enum([
      "invitation-request",
      "journey-interest",
      "sign-in-interest",
    ]),
    fingerprint: z.string().regex(/^[a-f0-9]{64}$/),
    result: z.literal("delivered"),
    recordedAt: z.string().datetime(),
  })
  .strict();

const localReceiptListSchema = z.array(localReceiptSchema);

export type LocalFormReceipt = z.infer<typeof localReceiptSchema>;

export type FormClientResult =
  | {
      status: "success";
      response: FormSuccessResponse;
      localReceiptSaved: boolean;
    }
  | {
      status: "duplicate";
      receipt: LocalFormReceipt;
    }
  | {
      status: "validation-error";
      message: string;
    }
  | {
      status: "network-error";
      message: string;
    };

function readLocalReceipts(): LocalFormReceipt[] {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedJson: unknown = JSON.parse(storedValue);
    const parsedReceipts = localReceiptListSchema.safeParse(parsedJson);

    return parsedReceipts.success ? parsedReceipts.data : [];
  } catch {
    return [];
  }
}

function writeLocalReceipt(receipt: LocalFormReceipt): boolean {
  try {
    const nextReceipts = [
      receipt,
      ...readLocalReceipts().filter(
        (existingReceipt) =>
          existingReceipt.fingerprint !== receipt.fingerprint,
      ),
    ].slice(0, MAX_LOCAL_RECEIPTS);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReceipts));
    return true;
  } catch {
    return false;
  }
}

async function createSubmissionFingerprint<K extends FormKind>(
  kind: K,
  values: FormValuesByKind[K],
): Promise<string | null> {
  if (!globalThis.crypto?.subtle) {
    return null;
  }

  try {
    const canonicalSubmission = JSON.stringify({ kind, values });
    const bytes = new TextEncoder().encode(canonicalSubmission);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  } catch {
    return null;
  }
}

async function readJsonResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function submitForm<K extends FormKind>(
  kind: K,
  input: FormValuesByKind[K],
): Promise<FormClientResult> {
  const validatedInput = getFormSchema(kind).safeParse(input);

  if (!validatedInput.success) {
    return {
      status: "validation-error",
      message: formUiContent.clientErrors.validation,
    };
  }

  const fingerprint = await createSubmissionFingerprint(
    kind,
    validatedInput.data,
  );

  if (fingerprint) {
    const duplicateReceipt = readLocalReceipts().find(
      (receipt) =>
        receipt.kind === kind && receipt.fingerprint === fingerprint,
    );

    if (duplicateReceipt) {
      return { status: "duplicate", receipt: duplicateReceipt };
    }
  }

  try {
    const response = await fetch(`/api/forms/${kind}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedInput.data),
    });
    const responseBody = await readJsonResponse(response);

    if (!response.ok) {
      const formError = formErrorResponseSchema.safeParse(responseBody);

      if (formError.success && formError.data.code === "validation-error") {
        return {
          status: "validation-error",
          message: formError.data.message,
        };
      }

      return {
        status: "network-error",
        message: formUiContent.clientErrors.request,
      };
    }

    const successResponse = formSuccessResponseSchema.safeParse(responseBody);

    if (!successResponse.success) {
      return {
        status: "network-error",
        message: formUiContent.clientErrors.unexpected,
      };
    }

    // Belt and braces against the failure mode this whole layer exists to
    // prevent: a 200 for an enquiry that was never delivered. The route
    // already refuses to emit one, but if it ever did, the visitor must not
    // be told it worked.
    if (successResponse.data.mode === "email" && !successResponse.data.sent) {
      return {
        status: "network-error",
        message: formUiContent.clientErrors.request,
      };
    }

    let localReceiptSaved = false;

    if (fingerprint) {
      localReceiptSaved = writeLocalReceipt({
        version: 1,
        kind,
        fingerprint,
        result: "delivered",
        recordedAt: new Date().toISOString(),
      });
    }

    return {
      status: "success",
      response: successResponse.data,
      localReceiptSaved,
    };
  } catch {
    return {
      status: "network-error",
      message: formUiContent.clientErrors.unreachable,
    };
  }
}
