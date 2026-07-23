import { developmentMockFormAdapter } from "@/lib/forms/adapters";
import { archetypes } from "@/content/archetypes";
import { andeanCaravanPublicEnquiryIds } from "@/content/andean-caravan";
import { formApiMessages } from "@/content/forms";
import {
  formKindSchema,
  getFormSchema,
  NOT_COMPLETED_TRAVEL_SELF,
  type FormKind,
  type JourneyInterestValues,
  type FormValuesByKind,
} from "@/lib/forms/schemas";

const MAX_MOCK_PAYLOAD_BYTES = 12_000;
const journeyIds: ReadonlySet<string> = new Set(
  andeanCaravanPublicEnquiryIds,
);
const travelSelfIds: ReadonlySet<string> = new Set(
  archetypes.map((archetype) => archetype.id),
);

const responseMessages: Record<FormKind, string> = formApiMessages;

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

function mockError(
  status: number,
  code:
    | "invalid-form-kind"
    | "invalid-content-type"
    | "invalid-json"
    | "payload-too-large"
    | "validation-error"
    | "mock-adapter-error",
  message: string,
  issues?: Array<{ path: string; message: string }>,
) {
  return Response.json(
    {
      ok: false as const,
      mode: "development-mock" as const,
      sent: false as const,
      storedOnServer: false as const,
      code,
      message,
      ...(issues ? { issues } : {}),
    },
    { status, headers: noStoreHeaders },
  );
}

async function acknowledgeMockSubmission<K extends FormKind>(
  kind: K,
  values: FormValuesByKind[K],
) {
  const adapterResult = await developmentMockFormAdapter.submit({
    kind,
    values,
  });

  if (
    !adapterResult.acknowledged ||
    adapterResult.sent ||
    adapterResult.stored
  ) {
    return mockError(
      503,
      "mock-adapter-error",
      "The development mock is unavailable. Nothing was sent or stored.",
    );
  }

  return Response.json(
    {
      ok: true as const,
      mode: "development-mock" as const,
      kind,
      sent: false as const,
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
    return mockError(
      404,
      "invalid-form-kind",
      "This form endpoint is not available.",
    );
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().startsWith("application/json")) {
    return mockError(
      415,
      "invalid-content-type",
      "Send this mock request as JSON.",
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_MOCK_PAYLOAD_BYTES
  ) {
    return mockError(
      413,
      "payload-too-large",
      "This mock request is too large. Shorten the text fields and try again.",
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return mockError(
      400,
      "invalid-json",
      "The mock request body could not be read as JSON.",
    );
  }

  const kind = parsedKind.data;
  const validatedSubmission = getFormSchema(kind).safeParse(requestBody);

  if (!validatedSubmission.success) {
    return mockError(
      400,
      "validation-error",
      "Check the marked fields and try this action again.",
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
        message: "Choose one of the available Travel Self results.",
      });
    }

    if (referenceIssues.length > 0) {
      return mockError(
        400,
        "validation-error",
        "Check the marked fields and try this action again.",
        referenceIssues,
      );
    }
  }

  return acknowledgeMockSubmission(kind, validatedSubmission.data);
}
