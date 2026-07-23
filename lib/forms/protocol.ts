import { z } from "zod";

import { formKindSchema } from "./schemas";

export const mockFormSuccessResponseSchema = z
  .object({
    ok: z.literal(true),
    mode: z.literal("development-mock"),
    kind: formKindSchema,
    sent: z.literal(false),
    storedOnServer: z.literal(false),
    message: z.string(),
  })
  .strict();

export const mockFormErrorResponseSchema = z
  .object({
    ok: z.literal(false),
    mode: z.literal("development-mock"),
    sent: z.literal(false),
    storedOnServer: z.literal(false),
    code: z.enum([
      "invalid-form-kind",
      "invalid-content-type",
      "invalid-json",
      "payload-too-large",
      "validation-error",
      "mock-adapter-error",
    ]),
    message: z.string(),
    issues: z
      .array(
        z
          .object({
            path: z.string(),
            message: z.string(),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type MockFormSuccessResponse = z.infer<
  typeof mockFormSuccessResponseSchema
>;
export type MockFormErrorResponse = z.infer<
  typeof mockFormErrorResponseSchema
>;
