import { andeanCaravanPublicEnquiryIds } from "@/content/andean-caravan";
import { archetypes } from "@/content/archetypes";
import { formApiMessages } from "@/content/forms";
import {
  resolveFormAdapter,
  type FormDeliveryAdapter,
} from "@/lib/forms/adapters";
import {
  formKindSchema,
  getFormSchema,
  NOT_COMPLETED_TRAVEL_SELF,
  type FormKind,
  type FormValuesByKind,
  type JourneyInterestValues,
} from "@/lib/forms/schemas";

const MAX_PAYLOAD_BYTES = 12_000;
const journeyIds: ReadonlySet<string> = new Set(andeanCaravanPublicEnquiryIds);
const travelSelfIds: ReadonlySet<string> = new Set(
  archetypes.map((archetype) => archetype.id),
);

const responseMessages: Record<FormKind, string> = formApiMessages.byKind;

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

type ErrorCode =
  | "invalid-form-kind"
  | "invalid-content-type"
  | "invalid-json"
  | "payload-too-large"
  | "validation-error"
  | "delivery-not-configured"
  | "delivery-failed";

function formError(
  status: number,
  code: ErrorCode,
  message: string,
  mode: "development-mock" | "email" | "unavailable" = "unavailable",
  issues?: Array<{ path: string; message: string }>,
) {
  return Response.json(
    {
      ok: false as const,
      mode,
      sent: false as const,
      storedOnServer: false as const,
      code,
      message,
      ...(issues ? { issues } : {}),
    },
    { status, headers: noStoreHeaders },
  );
}

/**
 * Delivery is the only thing that makes a submission a success. If the adapter
 * does not acknowledge, the visitor is told and can act on it. The one outcome
 * never permitted here is a 200 for an enquiry that went nowhere.
 */
async function deliver<K extends FormKind>(
  adapter: FormDeliveryAdapter,
  kind: K,
  values: FormValuesByKind[K],
) {
  const result = await adapter.submit({ kind, values });

  if (!result.acknowledged || result.stored) {
    return formError(
      502,
      result.reason === "not-configured"
        ? "delivery-not-configured"
        : "delivery-failed",
      formApiMessages.deliveryFailed,
      adapter.name,
    );
  }

  return Response.json(
    {
      ok: true as const,
      mode: adapter.name,
      kind,
      sent: result.sent,
      storedOnServer: false as const,
      message: responseMessages[kind],
    },
    { status: 200, headers: noStoreHeaders },
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ kind: string }> },
) {
  const { kind: rawKind } = await context.params;
  const parsedKind = formKindSchema.safeParse(rawKind);

  if (!parsedKind.success) {
    return formError(
      404,
      "invalid-form-kind",
      "This form endpoint is not available.",
    );
  }

  const adapter = resolveFormAdapter();

  if (!adapter) {
    return formError(
      503,
      "delivery-not-configured",
      formApiMessages.deliveryUnavailable,
    );
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().startsWith("application/json")) {
    return formError(
      415,
      "invalid-content-type",
      "Send this request as JSON.",
      adapter.name,
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (Number.isFinite(contentLength) && contentLength > MAX_PAYLOAD_BYTES) {
    return formError(
      413,
      "payload-too-large",
      "This request is too large. Shorten the text fields and try again.",
      adapter.name,
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return formError(
      400,
      "invalid-json",
      "The request body could not be read as JSON.",
      adapter.name,
    );
  }

  const kind = parsedKind.data;
  const validatedSubmission = getFormSchema(kind).safeParse(requestBody);

  if (!validatedSubmission.success) {
    return formError(
      400,
      "validation-error",
      "Check the marked fields and try this action again.",
      adapter.name,
      validatedSubmission.error.issues.map((issue) => ({
        path: issue.path.map(String).join("."),
        message: issue.message,
      })),
    );
  }

  if (kind === "journey-interest") {
    const values = validatedSubmission.data as JourneyInterestValues;
    const referenceIssues: Array<{ path: string; message: string }> = [];

    if (!journeyIds.has(values.journey)) {
      referenceIssues.push({
        path: "journey",
        message: "Choose one of the available Release 1 journeys.",
      });
    }

    if (
      values.travelSelfResult !== NOT_COMPLETED_TRAVEL_SELF &&
      !travelSelfIds.has(values.travelSelfResult)
    ) {
      referenceIssues.push({
        path: "travelSelfResult",
        message: "Choose one of the available Travel Fingerprint results.",
      });
    }

    if (referenceIssues.length > 0) {
      return formError(
        400,
        "validation-error",
        "Check the marked fields and try this action again.",
        adapter.name,
        referenceIssues,
      );
    }
  }

  return deliver(adapter, kind, validatedSubmission.data);
}
