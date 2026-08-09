import { describe, expect, it } from "vitest";

import {
  contactQuestionSchema,
  invitationRequestSchema,
  journeyInterestSchema,
  signInInterestSchema,
} from "@/lib/forms/schemas";

describe("Release 1 form schemas", () => {
  it("accepts only the non-sensitive contact question fields", () => {
    const validQuestion = {
      name: "A Traveller",
      email: "traveller@example.com",
      question: "How does joining in Lima work?",
      journeyContext: "The Andean Caravan",
    };

    expect(contactQuestionSchema.safeParse(validQuestion).success).toBe(true);
    expect(
      contactQuestionSchema.safeParse({
        ...validQuestion,
        paymentDetails: "not-allowed",
      }).success,
    ).toBe(false);
  });

  it("accepts only the required invitation-request fields", () => {
    const validInvitation = {
      name: "A Traveller",
      email: "traveller@example.com",
      country: "Egypt",
      travelInterest: "A small-group journey.",
      consent: true,
    };

    expect(invitationRequestSchema.safeParse(validInvitation).success).toBe(true);
    expect(
      invitationRequestSchema.safeParse({
        ...validInvitation,
        dateOfBirth: "1990-01-01",
      }).success,
    ).toBe(false);
  });

  it("requires invitation consent to be actively checked", () => {
    const result = invitationRequestSchema.safeParse({
      name: "A Traveller",
      email: "traveller@example.com",
      country: "Egypt",
      travelInterest: "A small-group journey.",
      consent: false,
    });

    expect(result.success).toBe(false);
  });

  it("accepts a Travel Self id or the not-completed value", () => {
    const baseJourneyInterest = {
      name: "A Traveller",
      email: "traveller@example.com",
      journey: "sample-journey",
      shortNote: "I am interested in the pace of this journey.",
      consent: true,
    };

    expect(
      journeyInterestSchema.safeParse({
        ...baseJourneyInterest,
        travelSelfResult: "slow-wanderer",
      }).success,
    ).toBe(true);
    expect(
      journeyInterestSchema.safeParse({
        ...baseJourneyInterest,
        travelSelfResult: "not-completed",
      }).success,
    ).toBe(true);
  });

  it("keeps the sign-in interest schema to email only", () => {
    expect(
      signInInterestSchema.safeParse({ email: "traveller@example.com" })
        .success,
    ).toBe(true);
    expect(
      signInInterestSchema.safeParse({
        email: "traveller@example.com",
        password: "not-allowed",
      }).success,
    ).toBe(false);
  });
});
