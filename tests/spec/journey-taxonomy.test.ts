import { describe, expect, it } from "vitest";

import {
  JOURNEY_ORIGIN_LABEL,
  PROVENANCE_BADGE_LABEL,
} from "@/lib/journeys/model";
import { ANDEAN_CARAVAN_JOURNEY } from "@/lib/sawayatra/journey-registry";
import {
  createJourney,
  formOpenJourneyGroup,
  JOURNEY_ACCESSES,
  JOURNEY_ORIGINS,
  JOURNEY_SETTINGS,
  JOURNEY_STRUCTURES,
  JOURNEY_TYPES,
  type CreateJourneyInput,
} from "@/lib/sawayatra/model";

const NOW = new Date("2026-08-18T00:00:00.000Z");

function canonicalJourney(
  overrides: Partial<CreateJourneyInput> = {},
) {
  return createJourney({
    id: "journey-taxonomy-fixture",
    slug: "taxonomy-fixture",
    title: "Taxonomy fixture",
    structure: "standalone",
    setting: null,
    access: "private",
    origin: "member-proposed",
    visibility: "members",
    status: "draft",
    publicationState: "draft",
    groupFormedAt: null,
    originatorId: "member-1",
    operatorType: null,
    operatorId: null,
    groupPortrait: { intended: "Fixture", actual: "Fixture" },
    route: "A → B",
    duration: "10 days",
    cost: "Published separately",
    asksOfYou: [],
    story: [],
    heroImage: "/fixture.jpg",
    heroAlt: "A road",
    ...overrides,
  });
}

describe("independent journey taxonomy", () => {
  it("adds four independent axes without changing the legacy type API", () => {
    expect(JOURNEY_STRUCTURES).toEqual(["caravan", "standalone"]);
    expect(JOURNEY_SETTINGS).toEqual(["farm"]);
    expect(JOURNEY_ACCESSES).toEqual(["open-to-members", "private"]);
    expect(JOURNEY_ORIGINS).toEqual([
      "sawayatra-conceived",
      "member-proposed",
      "partner-submitted",
    ]);
    expect(JOURNEY_TYPES).toEqual(["caravan", "open"]);
  });

  it("does not infer access, origin, publication or operation from structure", () => {
    const record = canonicalJourney({
      structure: "caravan",
      setting: "farm",
      access: "private",
      origin: "member-proposed",
    });

    expect(record).toMatchObject({
      structure: "caravan",
      type: "caravan",
      setting: "farm",
      access: "private",
      origin: "member-proposed",
      originatorType: "member",
      visibility: "members",
      publicationState: "draft",
      operatorType: null,
      operatorId: null,
    });
  });

  it("keeps the old type and provenance interfaces as compatibility shims", () => {
    const standalone = canonicalJourney();
    expect(standalone.type).toBe("open");
    expect(PROVENANCE_BADGE_LABEL).toEqual({
      sawayatra: "Sawayatra",
      partner: "Partner",
      member: "Member-made",
    });
    expect(standalone.origin).toBe("member-proposed");
    expect(JOURNEY_ORIGIN_LABEL["member-proposed"]).toBe("Member-proposed");
  });

  it("publishes an operator only when it is explicitly supplied", () => {
    const unpublished = canonicalJourney();
    const operated = canonicalJourney({
      origin: "partner-submitted",
      originatorId: "partner-author",
      operatorType: "partner",
      operatorId: "operator-1",
    });

    expect(unpublished.operatorType).toBeNull();
    expect(unpublished.operatorId).toBeNull();
    expect(operated.operatorType).toBe("partner");
    expect(operated.operatorId).toBe("operator-1");
    expect(() =>
      canonicalJourney({ operatorType: null, operatorId: "operator-1" }),
    ).toThrow(/explicit operatorType/);
  });

  it("forms an open-to-members group without inventing an operator", () => {
    const record = canonicalJourney({
      structure: "caravan",
      access: "open-to-members",
    });
    const formed = formOpenJourneyGroup(
      record,
      { type: "member", id: "member-1" },
      null,
      NOW,
    );

    expect(formed.groupFormedAt).toEqual(NOW);
    expect(formed.structure).toBe("caravan");
    expect(formed.operatorType).toBeNull();
    expect(formed.operatorId).toBeNull();
  });

  it("keeps the registered Andean record explicit without an operator claim", () => {
    expect(ANDEAN_CARAVAN_JOURNEY).toMatchObject({
      structure: "caravan",
      type: "caravan",
      setting: null,
      access: null,
      origin: null,
      originatorType: "club",
      visibility: "public",
      publicationState: "approved",
      operatorType: null,
      operatorId: null,
    });
  });
});
