// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { JourneyResponsibilityPanel } from "@/components/journeys/JourneyResponsibilityPanel";
import {
  ANDEAN_CARAVAN_RESPONSIBILITY,
  EGYPTIAN_CARAVAN_RESPONSIBILITY,
} from "@/content/journey-responsibilities";
import {
  getPublishableJourneyResponsibility,
  IncompleteJourneyResponsibilityError,
  JOURNEY_RESPONSIBILITY_FIELD_KEYS,
  JOURNEY_RESPONSIBILITY_FIELD_LABELS,
  publishJourneyResponsibility,
  type ApprovedJourneyResponsibilityField,
  type JourneyResponsibilityFields,
  type JourneyResponsibilityRecord,
} from "@/lib/journeys/responsibility";

afterEach(cleanup);

const approvedField = (
  value: string,
): ApprovedJourneyResponsibilityField =>
  Object.freeze({ status: "approved", value });

const completeApprovedFixture = {
  journeySlug: "approved-fixture-only",
  fields: {
    conceivedBy: approvedField("Approved fixture: conceived by"),
    hostedBy: approvedField("Approved fixture: hosted by"),
    operatedBy: approvedField("Approved fixture: operated by"),
    contractingParty: approvedField("Approved fixture: contracting party"),
    paymentReceivedBy: approvedField(
      "Approved fixture: payment received by",
    ),
    assessedBySawayatra: approvedField(
      "Approved fixture: assessment scope",
    ),
    sawayatraRole: approvedField("Approved fixture: Sawayatra role"),
    emergencyAndEscalationResponsibility: approvedField(
      "Approved fixture: emergency responsibility",
    ),
    lastReviewed: approvedField("2026-08-18"),
  } satisfies JourneyResponsibilityFields,
} satisfies JourneyResponsibilityRecord;

describe("journey responsibility publication gate", () => {
  it("defines every required disclosure field once and in display order", () => {
    expect(JOURNEY_RESPONSIBILITY_FIELD_KEYS).toEqual([
      "conceivedBy",
      "hostedBy",
      "operatedBy",
      "contractingParty",
      "paymentReceivedBy",
      "assessedBySawayatra",
      "sawayatraRole",
      "emergencyAndEscalationResponsibility",
      "lastReviewed",
    ]);
    expect(
      JOURNEY_RESPONSIBILITY_FIELD_KEYS.map(
        (key) => JOURNEY_RESPONSIBILITY_FIELD_LABELS[key],
      ),
    ).toEqual([
      "Conceived by",
      "Hosted by",
      "Operated by",
      "Contracting party",
      "Payment received by",
      "Assessed by Sawayatra",
      "Sawayatra’s role",
      "Emergency and escalation responsibility",
      "Last reviewed",
    ]);
  });

  it.each([
    ["Andean", ANDEAN_CARAVAN_RESPONSIBILITY],
    ["Egyptian", EGYPTIAN_CARAVAN_RESPONSIBILITY],
  ])("keeps the %s record explicitly required and null", (_name, record) => {
    for (const key of JOURNEY_RESPONSIBILITY_FIELD_KEYS) {
      expect(record.fields[key]).toEqual({
        status: "required",
        value: null,
      });
    }

    expect(getPublishableJourneyResponsibility(record)).toBeNull();
    expect(() => publishJourneyResponsibility(record)).toThrow(
      IncompleteJourneyResponsibilityError,
    );
  });

  it("does not render a partial panel for an incomplete record", () => {
    const { container } = render(
      <JourneyResponsibilityPanel
        responsibility={ANDEAN_CARAVAN_RESPONSIBILITY}
      />,
    );

    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByRole("heading", {
        name: "Who is responsible for this journey",
      }),
    ).not.toBeInTheDocument();
  });

  it("requires Last reviewed to be a real ISO calendar date", () => {
    const invalidReviewDate = {
      ...completeApprovedFixture,
      fields: {
        ...completeApprovedFixture.fields,
        lastReviewed: approvedField("2026-02-30"),
      },
    } satisfies JourneyResponsibilityRecord;

    expect(() => publishJourneyResponsibility(invalidReviewDate)).toThrow(
      IncompleteJourneyResponsibilityError,
    );
  });

  it("publishes and renders all nine fields for a complete approved record", () => {
    const published = publishJourneyResponsibility(completeApprovedFixture);

    expect(Object.keys(published.fields)).toEqual(
      JOURNEY_RESPONSIBILITY_FIELD_KEYS,
    );

    render(
      <JourneyResponsibilityPanel responsibility={completeApprovedFixture} />,
    );

    const panel = screen.getByRole("region", {
      name: "Who is responsible for this journey",
    });

    for (const key of JOURNEY_RESPONSIBILITY_FIELD_KEYS) {
      expect(
        within(panel).getByText(JOURNEY_RESPONSIBILITY_FIELD_LABELS[key]),
      ).toBeInTheDocument();
      expect(
        within(panel).getByText(completeApprovedFixture.fields[key].value),
      ).toBeInTheDocument();
    }
  });
});
