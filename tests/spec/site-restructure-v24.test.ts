import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { ClaimRegistry, issueClaimToken } from "@/lib/sawayatra/claims";
import {
  createJourney,
  editPassport,
  formOpenJourneyGroup,
  JOURNEY_TYPES,
  mayWriteGroupPortrait,
  SIGNED_OUT_VIEWER,
  type Passport,
  type ViewerContext,
} from "@/lib/sawayatra/model";
import {
  activeDeclarationsForJourney,
  declareInterest,
  emptyPoolState,
  expireDeclarations,
  identitiesForConnections,
  passportsForJourney,
  putPassport,
  requestReveal,
  revealStateVisibleToRecipient,
  withdrawInterest,
} from "@/lib/sawayatra/pools";
import {
  issueInterestToken,
  issueSessionToken,
  verifyInterestToken,
  verifySessionToken,
} from "@/lib/sawayatra/session";
import {
  canViewPoolRoute,
  computeJourneyViewModel,
  mayRouteJourney,
  toPassportDTO,
} from "@/lib/sawayatra/view-model";

const NOW = new Date("2026-08-12T00:00:00.000Z");
const SECRET = "a-secret-long-enough-for-hmac-tests-123456789";

function journey(overrides: Partial<Parameters<typeof createJourney>[0]> = {}) {
  return createJourney({
    id: "j1",
    slug: "one-road",
    title: "One road",
    type: "caravan",
    status: "open",
    groupFormedAt: null,
    originatorType: "club",
    originatorId: null,
    operatorId: null,
    groupPortrait: { intended: "For the road.", actual: "Five read the geology." },
    route: "A → B",
    duration: "10 days",
    cost: "Published in full",
    asksOfYou: [],
    story: [],
    heroImage: "/image.jpg",
    heroAlt: "A road",
    ...overrides,
  });
}

function viewer(overrides: Partial<ViewerContext> = {}): ViewerContext {
  return {
    isSignedIn: true,
    memberId: "me",
    membershipStatus: "member",
    hasSavedTravelSelf: true,
    declaredJourneyIds: [],
    authoredJourneyIds: [],
    isClubStaff: false,
    ...overrides,
  };
}

function passport(memberId: string): Passport {
  return {
    memberId,
    resultId: `result-${memberId}`,
    archetype: "The Seeker",
    axes: { pace: 2, planning: 1 },
    demographics: { nationality: null, gender: null, ageBand: null },
    updatedAt: NOW,
  };
}

describe("v2.4 journey records and publication gates", () => {
  it("models exactly two journey types", () => {
    expect(JOURNEY_TYPES).toEqual(["caravan", "open"]);
  });

  it("keeps legacy caravan visibility defaults without inventing an operator", () => {
    const record = journey({ visibility: "members", publicationState: "draft" });
    expect(record.visibility).toBe("public");
    expect(record.publicationState).toBe("approved");
    expect(record.operatorType).toBeNull();
  });

  it("defaults open journeys to members-only drafts", () => {
    const record = journey({
      type: "open",
      status: "draft",
      originatorType: "member",
      originatorId: "author-1",
    });
    expect(record.visibility).toBe("members");
    expect(record.publicationState).toBe("draft");
    expect(record.operatorType).toBeNull();
    expect(record.operatorId).toBeNull();
  });

  it("does not derive authorship or operation from the legacy type", () => {
    const memberCaravan = journey({
      status: "draft",
      originatorType: "member",
      originatorId: "member-1",
    });
    expect(memberCaravan.structure).toBe("caravan");
    expect(memberCaravan.origin).toBeNull();
    expect(memberCaravan.originatorType).toBe("member");
    expect(memberCaravan.operatorType).toBeNull();

    const clubStandalone = journey({
      type: "open",
      status: "draft",
      originatorType: "club",
      originatorId: null,
    });
    expect(clubStandalone.structure).toBe("standalone");
    expect(clubStandalone.origin).toBeNull();
    expect(clubStandalone.originatorType).toBe("club");
    expect(clubStandalone.operatorType).toBeNull();

    const explicitlyOperated = journey({
      operatorType: "partner",
      operatorId: "partner-1",
    });
    expect(explicitlyOperated.operatorType).toBe("partner");
    expect(explicitlyOperated.operatorId).toBe("partner-1");
  });

  it("forms an open journey only by its author and records its partner operator", () => {
    const record = journey({
      type: "open",
      access: "open-to-members",
      status: "open",
      publicationState: "approved",
      originatorType: "member",
      originatorId: "author-1",
    });
    expect(() => formOpenJourneyGroup(
      record,
      { type: "member", id: "someone-else" },
      "partner-1",
      NOW,
    )).toThrow(/Only the journey's author/);
    const formed = formOpenJourneyGroup(
      record,
      { type: "member", id: "author-1" },
      "partner-1",
      NOW,
    );
    expect(formed.groupFormedAt).toEqual(NOW);
    expect(formed.operatorType).toBe("partner");
    expect(formed.operatorId).toBe("partner-1");
  });

  it("reserves group portrait writing for club staff, never the itinerary author", () => {
    expect(mayWriteGroupPortrait(viewer({
      authoredJourneyIds: ["j1"],
      isClubStaff: false,
    }))).toBe(false);
    expect(mayWriteGroupPortrait(viewer({ isClubStaff: true }))).toBe(true);
  });

  it("will not open a journey before approval", () => {
    expect(() => journey({
      type: "open",
      status: "open",
      publicationState: "submitted",
      originatorType: "member",
      originatorId: "author-1",
    })).toThrow(/editorial approval/);
  });

  it("returns unpublished journeys only to their author or club staff", () => {
    const draft = journey({
      type: "open",
      status: "draft",
      originatorType: "member",
      originatorId: "author-1",
    });
    expect(mayRouteJourney(draft, SIGNED_OUT_VIEWER)).toBe(false);
    expect(mayRouteJourney(draft, viewer({ authoredJourneyIds: [draft.id] }))).toBe(true);
    expect(mayRouteJourney(draft, viewer({ isClubStaff: true }))).toBe(true);

    const rejected = journey({
      type: "open",
      status: "draft",
      publicationState: "rejected",
      originatorType: "partner",
      originatorId: "partner-author",
    });
    expect(mayRouteJourney(rejected, SIGNED_OUT_VIEWER)).toBe(false);
    expect(mayRouteJourney(rejected, viewer())).toBe(false);
    expect(mayRouteJourney(rejected, viewer({
      authoredJourneyIds: [rejected.id],
    }))).toBe(true);
    expect(mayRouteJourney(rejected, viewer({ isClubStaff: true }))).toBe(true);
  });

  it("keeps members-only open journeys unreachable to non-members", () => {
    const approved = journey({
      type: "open",
      visibility: "members",
      publicationState: "approved",
      originatorType: "member",
      originatorId: "author-1",
    });
    expect(mayRouteJourney(approved, SIGNED_OUT_VIEWER)).toBe(false);
    expect(mayRouteJourney(approved, viewer())).toBe(true);
  });
});

describe("v2.4 journey view model", () => {
  const record = journey();
  const poolPassports = [passport("a"), passport("b")];

  it("computes public, fit and pool from independent dimensions", () => {
    const cases = [
      [SIGNED_OUT_VIEWER, "public", false, false],
      [viewer({ membershipStatus: "applied" }), "public", false, false],
      [viewer(), "fit", true, false],
      [viewer({ declaredJourneyIds: [record.id] }), "pool", true, true],
      [viewer({ declaredJourneyIds: [record.id], hasSavedTravelSelf: false }), "pool", false, false],
    ] as const;
    for (const [subject, level, fit, match] of cases) {
      const view = computeJourneyViewModel({
        viewer: subject,
        journey: record,
        poolSize: 3,
        poolPassports,
      });
      expect(view.viewLevel).toBe(level);
      expect(view.showsFitLayer).toBe(fit);
      expect(view.showsMatchLayer).toBe(match);
    }
  });

  it("never sends pool passports in public or fit views", () => {
    expect(computeJourneyViewModel({ viewer: SIGNED_OUT_VIEWER, journey: record, poolSize: 2, poolPassports }).passports).toEqual([]);
    expect(computeJourneyViewModel({ viewer: viewer(), journey: record, poolSize: 2, poolPassports }).passports).toEqual([]);
  });

  it("does not use pool size to suppress passports", () => {
    for (const count of [1, 2]) {
      const visible = poolPassports.slice(0, count);
      const view = computeJourneyViewModel({
        viewer: viewer({ declaredJourneyIds: [record.id] }),
        journey: record,
        poolSize: count,
        poolPassports: visible,
      });
      expect(view.passports).toHaveLength(count);
    }
  });

  it("uses only matchable pool size for the portrait threshold", () => {
    const base = { viewer: viewer({ declaredJourneyIds: [record.id] }), journey: record, poolSize: 8 };
    expect(computeJourneyViewModel({ ...base, poolPassports: Array.from({ length: 4 }, (_, i) => passport(`${i}`)) }).portraitMode).toBe("intended");
    expect(computeJourneyViewModel({ ...base, poolPassports: Array.from({ length: 5 }, (_, i) => passport(`${i}`)) }).portraitMode).toBe("actual");
  });

  it("lets a member without a passport declare but not enter the matching layer", () => {
    const view = computeJourneyViewModel({
      viewer: viewer({ hasSavedTravelSelf: false }),
      journey: record,
      poolSize: 0,
      poolPassports: [],
    });
    expect(view.canDeclareInterest).toBe(true);
    expect(view.needsTravelSelfPrompt).toBe(true);
    expect(view.showsMatchLayer).toBe(false);
  });

  it("disables declaration for closed, departed and cancelled journeys", () => {
    for (const status of ["closed", "departed", "cancelled"] as const) {
      expect(computeJourneyViewModel({ viewer: viewer(), journey: journey({ status }), poolSize: 0, poolPassports: [] }).canDeclareInterest).toBe(false);
    }
  });

  it("404-gates the people route unless member and declared", () => {
    expect(canViewPoolRoute(record.id, SIGNED_OUT_VIEWER)).toBe(false);
    expect(canViewPoolRoute(record.id, viewer())).toBe(false);
    expect(canViewPoolRoute(record.id, viewer({ declaredJourneyIds: [record.id] }))).toBe(true);
  });
});

describe("passport, pool and reveal privacy", () => {
  it("serializes chosen demographics only and no private or identity field", () => {
    const dto = toPassportDTO({
      ...passport("a"),
      demographics: { nationality: "Canadian", gender: null, ageBand: "30–39" },
    });
    expect(dto.demographics).toEqual({ nationality: "Canadian", ageBand: "30–39" });
    expect(JSON.stringify(dto)).not.toMatch(/email|contact|fullName|photograph|firstName/);
  });

  it("references one edited passport across every pool and preserves reveal state", () => {
    let state = putPassport(emptyPoolState(), passport("a"));
    state = declareInterest(state, "a", "j1", NOW);
    state = declareInterest(state, "a", "j2", NOW);
    const edited = editPassport(passport("a"), { demographics: { nationality: "Canadian" } }, new Date("2026-08-13"));
    const beforeReveals = state.reveals;
    state = putPassport(state, edited);
    expect(passportsForJourney(state, "j1", NOW)[0]).toBe(edited);
    expect(passportsForJourney(state, "j2", NOW)[0]).toBe(edited);
    expect(state.reveals).toBe(beforeReveals);
  });

  it("counts a declaration without a passport but excludes it from matching", () => {
    const state = declareInterest(emptyPoolState(), "a", "j1", NOW);
    expect(activeDeclarationsForJourney(state, "j1", NOW)).toHaveLength(1);
    expect(passportsForJourney(state, "j1", NOW)).toHaveLength(0);
  });

  it("makes a one-way request completely unobservable to its recipient", () => {
    let state = putPassport(putPassport(emptyPoolState(), passport("a")), passport("b"));
    state = declareInterest(declareInterest(state, "a", "j1", NOW), "b", "j1", NOW);
    state = requestReveal(state, "a", "b", "j1", NOW).state;
    expect(revealStateVisibleToRecipient(state, "b", "j1")).toEqual([]);
  });

  it("limits unanswered requests to three per member per pool", () => {
    let state = putPassport(emptyPoolState(), passport("a"));
    state = declareInterest(state, "a", "j1", NOW);
    for (const id of ["b", "c", "d", "e"]) {
      state = putPassport(state, passport(id));
      state = declareInterest(state, id, "j1", NOW);
    }
    for (const id of ["b", "c", "d"]) state = requestReveal(state, "a", id, "j1", NOW).state;
    expect(() => requestReveal(state, "a", "e", "j1", NOW)).toThrow(/at most 3/);
  });

  it("creates journey-scoped connections releasing first name and photograph only", () => {
    let state = emptyPoolState();
    for (const id of ["a", "b"]) {
      state = putPassport(state, passport(id));
      state = declareInterest(state, id, "j1", NOW);
      state = declareInterest(state, id, "j2", NOW);
    }
    state = requestReveal(state, "a", "b", "j1", NOW).state;
    const outcome = requestReveal(state, "b", "a", "j1", NOW);
    expect(outcome.becameMutual).toBe(true);
    expect(outcome.state.connections).toHaveLength(1);
    expect(revealStateVisibleToRecipient(outcome.state, "a", "j2")).toEqual([]);
    const identities = identitiesForConnections(outcome.state, "a", "j1", {
      b: { memberId: "b", firstName: "Bea", photograph: "/bea.jpg" },
    });
    expect(identities).toEqual([{ memberId: "b", firstName: "Bea", photograph: "/bea.jpg" }]);
  });

  it("withdrawal and expiry void pending reveals but preserve connections", () => {
    let state = emptyPoolState();
    for (const id of ["a", "b", "c"]) {
      state = putPassport(state, passport(id));
      state = declareInterest(state, id, "j1", new Date("2026-01-01"));
    }
    state = requestReveal(state, "a", "b", "j1", new Date("2026-01-02")).state;
    state = requestReveal(state, "b", "a", "j1", new Date("2026-01-02")).state;
    state = requestReveal(state, "a", "c", "j1", new Date("2026-01-02")).state;
    const withdrawn = withdrawInterest(state, "a", "j1");
    expect(withdrawn.connections).toHaveLength(1);
    expect(withdrawn.reveals.some((request) => request.state === "void")).toBe(true);
    const expired = expireDeclarations(state, new Date("2026-08-01"));
    expect(expired.connections).toHaveLength(1);
    expect(activeDeclarationsForJourney(expired, "j1", new Date("2026-08-01"))).toHaveLength(0);
  });
});

describe("anonymous claim and session integrity", () => {
  it("claims an anonymous result exactly once by signed token", () => {
    const token = issueClaimToken("result-1", SECRET, NOW);
    const registry = new ClaimRegistry();
    expect(registry.claim(token, "result-1", SECRET, NOW)).toBe("result-1");
    expect(() => registry.claim(token, "result-1", SECRET, NOW)).toThrow(/already/);
  });

  it("fails closed for tampering, guessing, mismatch and expiry", () => {
    const token = issueClaimToken("result-1", SECRET, NOW);
    const registry = new ClaimRegistry();
    expect(() => registry.claim(`${token}x`, "result-1", SECRET, NOW)).toThrow(/Invalid/);
    expect(() => registry.claim(token, "result-2", SECRET, NOW)).toThrow(/does not match/);
    expect(() => registry.claim(token, "result-1", SECRET, new Date("2026-09-12"))).toThrow(/expired/);
  });

  it("accepts membership state only from a valid, unexpired server signature", () => {
    const token = issueSessionToken(
      {
        memberId: "m1",
        membershipStatus: "member",
        hasSavedTravelSelf: true,
        declaredJourneyIds: ["j1"],
        authoredJourneyIds: [],
        isClubStaff: false,
      },
      SECRET,
      new Date("2026-09-01"),
    );
    expect(verifySessionToken(token, SECRET, NOW).membershipStatus).toBe("member");
    expect(verifySessionToken(`${token}x`, SECRET, NOW)).toBe(SIGNED_OUT_VIEWER);
  });

  it("signs each declaration to one member and one journey for six months", () => {
    const token = issueInterestToken("m1", "j1", SECRET, NOW);
    expect(verifyInterestToken(token, "m1", SECRET, NOW)).toBe("j1");
    expect(verifyInterestToken(token, "m2", SECRET, NOW)).toBeNull();
    expect(verifyInterestToken(token, "m1", SECRET, new Date("2027-02-12"))).toBeNull();
  });
});

describe("route architecture", () => {
  function walk(directory: string): string[] {
    return readdirSync(directory).flatMap((entry) => {
      const path = join(directory, entry);
      return statSync(path).isDirectory() ? walk(path) : [path];
    });
  }

  it("contains no member directory route and no booking route or Book action", () => {
    const appRoot = join(process.cwd(), "app");
    const routeSegments = walk(appRoot)
      .filter((path) => path.endsWith("page.tsx") || path.endsWith("route.ts"))
      .map((path) => path.replace(appRoot, ""));
    expect(routeSegments.some((path) => /\/(members|directory)(\/|$)/.test(path))).toBe(false);
    expect(routeSegments.some((path) => /\/booking(\/|$)/.test(path))).toBe(false);
    const source = walk(appRoot)
      .filter((path) => path.endsWith(".tsx"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n");
    expect(source).not.toMatch(/>\s*Book\s*</);
  });
});
