import { z } from "zod";

import { formKindSchema } from "./schemas";

export const formDeliveryModeSchema = z.enum(["development-mock", "email"]);

export type FormDeliveryMode = z.infer<typeof formDeliveryModeSchema>;

export const formSuccessResponseSchema = z
  .object({
    ok: z.literal(true),
    mode: formDeliveryModeSchema,
    kind: formKindSchema,
    /**
     * True only when delivery actually succeeded. The client must never treat
     * a response as a success on ok alone - see lib/forms/client.ts.
     */
    sent: z.boolean(),
    storedOnServer: z.literal(false),
    message: z.string(),
  })
  .strict();

export const formErrorResponseSchema = z
  .object({
    ok: z.literal(false),
    mode: formDeliveryModeSchema.or(z.literal("unavailable")),
    sent: z.literal(false),
    storedOnServer: z.literal(false),
    code: z.enum([
      "invalid-form-kind",
      "invalid-content-type",
      "invalid-json",
      "payload-too-large",
      "validation-error",
      "delivery-not-configured",
      "delivery-failed",
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

export type FormSuccessResponse = z.infer<typeof formSuccessResponseSchema>;
export type FormErrorResponse = z.infer<typeof formErrorResponseSchema>;
