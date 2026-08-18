import type {
  JourneyResponsibilityFields,
  JourneyResponsibilityRecord,
  RequiredJourneyResponsibilityField,
} from "@/lib/journeys/responsibility";

const requiredField = (): RequiredJourneyResponsibilityField =>
  Object.freeze({ status: "required", value: null });

/**
 * These records are intentionally incomplete. No responsibility is inferred
 * from the Sawayatra brand or from other journey copy. They remain blocked
 * from publication until every named party and role has accurate, approved
 * wording.
 */
function requiredResponsibilityRecord(
  journeySlug: string,
): JourneyResponsibilityRecord {
  return Object.freeze({
    journeySlug,
    fields: Object.freeze({
      conceivedBy: requiredField(),
      hostedBy: requiredField(),
      operatedBy: requiredField(),
      contractingParty: requiredField(),
      paymentReceivedBy: requiredField(),
      assessedBySawayatra: requiredField(),
      sawayatraRole: requiredField(),
      emergencyAndEscalationResponsibility: requiredField(),
      lastReviewed: requiredField(),
    }) satisfies JourneyResponsibilityFields,
  });
}

export const ANDEAN_CARAVAN_RESPONSIBILITY =
  requiredResponsibilityRecord("andean-caravan");

export const EGYPTIAN_CARAVAN_RESPONSIBILITY =
  requiredResponsibilityRecord("egyptian-caravan");

export const ANDEAN_PRODUCT_RESPONSIBILITIES = Object.freeze(
  [
    "sea-to-stone",
    "the-stone-road",
    "both-shores",
    "the-mirror",
    "the-end-of-the-road",
  ].map(requiredResponsibilityRecord),
);

export const EGYPTIAN_DRAFT_RESPONSIBILITIES = Object.freeze(
  [
    "the-three-kings",
    "fun-desert-journey",
    "magical-western-desert",
    "western-desert-mystical",
    "the-white-desert-trek",
    "the-white-desert-exploration-trek",
    "the-western-desert-oasis-tour",
    "the-grand-expedition",
    "the-extensive-western-desert-tour",
  ].map(requiredResponsibilityRecord),
);

export const JOURNEY_RESPONSIBILITIES: Readonly<
  Record<string, JourneyResponsibilityRecord>
> = Object.freeze(
  Object.fromEntries(
    [
      ANDEAN_CARAVAN_RESPONSIBILITY,
      EGYPTIAN_CARAVAN_RESPONSIBILITY,
      ...ANDEAN_PRODUCT_RESPONSIBILITIES,
      ...EGYPTIAN_DRAFT_RESPONSIBILITIES,
    ].map((record) => [record.journeySlug, record]),
  ),
);

export function getJourneyResponsibility(
  journeySlug: string,
): JourneyResponsibilityRecord | null {
  return JOURNEY_RESPONSIBILITIES[journeySlug] ?? null;
}
