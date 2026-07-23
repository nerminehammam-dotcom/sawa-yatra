import { z } from "zod";

export const formKinds = [
  "invitation-request",
  "journey-interest",
  "sign-in-interest",
] as const;

export const formKindSchema = z.enum(formKinds);

export type FormKind = z.infer<typeof formKindSchema>;

export const NOT_COMPLETED_TRAVEL_SELF = "not-completed" as const;

const requiredText = (label: string, maximumLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maximumLength, `${label} must be ${maximumLength} characters or fewer.`);

const email = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(254, "Email must be 254 characters or fewer.")
  .email("Enter an email address in the format name@example.com.");

const consent = z.boolean().refine((isChecked) => isChecked, {
  message: "Consent must be checked before this request can be recorded.",
});

const identifier = (label: string) =>
  requiredText(label, 160).regex(
    /^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/,
    `${label} is not recognised. Choose one of the available options.`,
  );

export const invitationRequestSchema = z
  .object({
    name: requiredText("Name", 120),
    email,
    country: requiredText("Country", 100),
    travelInterest: requiredText("Travel interest", 2_000),
    consent,
  })
  .strict();

export const journeyInterestSchema = z
  .object({
    name: requiredText("Name", 120),
    email,
    journey: identifier("Journey"),
    travelSelfResult: z.union([
      z.literal(NOT_COMPLETED_TRAVEL_SELF),
      identifier("Travel Self result"),
    ]),
    shortNote: requiredText("Short note", 2_000),
    consent,
  })
  .strict();

export const signInInterestSchema = z
  .object({
    email,
  })
  .strict();

export type InvitationRequestValues = z.infer<
  typeof invitationRequestSchema
>;
export type JourneyInterestValues = z.infer<typeof journeyInterestSchema>;
export type SignInInterestValues = z.infer<typeof signInInterestSchema>;

export interface FormValuesByKind {
  "invitation-request": InvitationRequestValues;
  "journey-interest": JourneyInterestValues;
  "sign-in-interest": SignInInterestValues;
}

export const formSchemas = {
  "invitation-request": invitationRequestSchema,
  "journey-interest": journeyInterestSchema,
  "sign-in-interest": signInInterestSchema,
} satisfies Record<FormKind, z.ZodType>;

export function getFormSchema<K extends FormKind>(
  kind: K,
): z.ZodType<FormValuesByKind[K], FormValuesByKind[K]> {
  return formSchemas[kind] as unknown as z.ZodType<
    FormValuesByKind[K],
    FormValuesByKind[K]
  >;
}

export function createJourneyInterestClientSchema(
  availableTravelSelfIds: readonly string[],
): z.ZodType<JourneyInterestValues, JourneyInterestValues> {
  const allowedResults = new Set([
    NOT_COMPLETED_TRAVEL_SELF,
    ...availableTravelSelfIds,
  ]);

  return journeyInterestSchema.superRefine((values, context) => {
    if (!allowedResults.has(values.travelSelfResult)) {
      context.addIssue({
        code: "custom",
        path: ["travelSelfResult"],
        message: "Choose one of the Travel Self results available here.",
      });
    }
  });
}
