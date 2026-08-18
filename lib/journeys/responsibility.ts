/**
 * Publication gate for the responsibility disclosure shown on journey pages.
 *
 * A field is either still required, in which case it cannot carry a value, or
 * it is approved and carries the exact public wording. Keeping the two states
 * mutually exclusive prevents a draft value from reaching a public page merely
 * because it happens to be non-empty.
 */

export const JOURNEY_RESPONSIBILITY_FIELD_KEYS = [
  "conceivedBy",
  "hostedBy",
  "operatedBy",
  "contractingParty",
  "paymentReceivedBy",
  "assessedBySawayatra",
  "sawayatraRole",
  "emergencyAndEscalationResponsibility",
  "lastReviewed",
] as const;

export type JourneyResponsibilityFieldKey =
  (typeof JOURNEY_RESPONSIBILITY_FIELD_KEYS)[number];

export const JOURNEY_RESPONSIBILITY_FIELD_LABELS: Readonly<
  Record<JourneyResponsibilityFieldKey, string>
> = Object.freeze({
  conceivedBy: "Conceived by",
  hostedBy: "Hosted by",
  operatedBy: "Operated by",
  contractingParty: "Contracting party",
  paymentReceivedBy: "Payment received by",
  assessedBySawayatra: "Assessed by Sawayatra",
  sawayatraRole: "Sawayatra’s role",
  emergencyAndEscalationResponsibility:
    "Emergency and escalation responsibility",
  lastReviewed: "Last reviewed",
});

export interface RequiredJourneyResponsibilityField {
  readonly status: "required";
  readonly value: null;
}

export interface ApprovedJourneyResponsibilityField {
  readonly status: "approved";
  readonly value: string;
}

export type JourneyResponsibilityField =
  | RequiredJourneyResponsibilityField
  | ApprovedJourneyResponsibilityField;

export type JourneyResponsibilityFields = Readonly<
  Record<JourneyResponsibilityFieldKey, JourneyResponsibilityField>
>;

export interface JourneyResponsibilityRecord {
  readonly journeySlug: string;
  readonly fields: JourneyResponsibilityFields;
}

export interface PublishedJourneyResponsibility {
  readonly journeySlug: string;
  readonly fields: Readonly<Record<JourneyResponsibilityFieldKey, string>>;
}

export class IncompleteJourneyResponsibilityError extends Error {
  readonly journeySlug: string;
  readonly blockingFields: readonly JourneyResponsibilityFieldKey[];

  constructor(
    journeySlug: string,
    blockingFields: readonly JourneyResponsibilityFieldKey[],
  ) {
    super(
      `Journey responsibility for "${journeySlug}" cannot be published. ` +
        `Required or unapproved fields: ${blockingFields.join(", ")}.`,
    );
    this.name = "IncompleteJourneyResponsibilityError";
    this.journeySlug = journeySlug;
    this.blockingFields = Object.freeze([...blockingFields]);
  }
}

function isApprovedField(
  field: JourneyResponsibilityField | undefined,
): field is ApprovedJourneyResponsibilityField {
  return (
    field?.status === "approved" &&
    typeof field.value === "string" &&
    field.value.trim().length > 0
  );
}

function isReviewDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

/**
 * Return the public disclosure only when every required field is approved.
 * Incomplete records throw instead of leaking a partial or inferred panel.
 */
export function publishJourneyResponsibility(
  record: JourneyResponsibilityRecord,
): PublishedJourneyResponsibility {
  const blockingFields = JOURNEY_RESPONSIBILITY_FIELD_KEYS.filter(
    (key) =>
      !isApprovedField(record.fields[key]) ||
      (key === "lastReviewed" &&
        !isReviewDate(record.fields.lastReviewed.value ?? "")),
  );

  if (blockingFields.length > 0) {
    throw new IncompleteJourneyResponsibilityError(
      record.journeySlug,
      blockingFields,
    );
  }

  const fields = Object.fromEntries(
    JOURNEY_RESPONSIBILITY_FIELD_KEYS.map((key) => [
      key,
      record.fields[key].value,
    ]),
  ) as Record<JourneyResponsibilityFieldKey, string>;

  return Object.freeze({
    journeySlug: record.journeySlug,
    fields: Object.freeze(fields),
  });
}

/**
 * Rendering boundary for public UI. A blocked record becomes no public data,
 * while programming errors other than an incomplete record still surface.
 */
export function getPublishableJourneyResponsibility(
  record: JourneyResponsibilityRecord,
): PublishedJourneyResponsibility | null {
  try {
    return publishJourneyResponsibility(record);
  } catch (error) {
    if (error instanceof IncompleteJourneyResponsibilityError) return null;
    throw error;
  }
}
