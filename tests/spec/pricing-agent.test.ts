/**
 * Area G tests — pricing agent (spec v3.1 §11.2).
 *
 * Fixture numbers below are LOCAL TEST VALUES only — obviously round,
 * asserted against arithmetic, never shipped. The real rounding unit and
 * envelope are the §13 values PRICE_ROUNDING and PRICE_ENVELOPE, injected as
 * policy at the call site once signed off.
 */
import { describe, expect, it } from "vitest";

import {
  PRICING_AGENT_FRAMING,
  type PendingReviewPayload,
  type PricingAgentInputs,
  type PricingPolicy,
  checkSanityRails,
  derivationReconciles,
  deriveBands,
  renderPendingReviewFile,
  roundToUnit,
} from "@/lib/agents/pricing-agent";

const policy: PricingPolicy = {
  roundingUnit: 50,
  envelope: { min: 100, max: 10000 },
};

const inputs: PricingAgentInputs = {
  section: "Section 4 · Cusco to Uyuni",
  operatorFixedCost: 6000,
  perHeadCost: 400,
  durationDays: 21,
  inclusions: ["vehicle", "guide", "permits", "host"],
  currency: "USD",
  operatorFloor: 500,
};

function derive(
  overrides: Partial<PricingAgentInputs> = {},
  policyOverrides: Partial<PricingPolicy> = {},
) {
  return deriveBands(
    { ...inputs, ...overrides },
    { ...policy, ...policyOverrides },
    new Date("2026-08-08T12:00:00Z"),
  );
}

function expectPayload(result: ReturnType<typeof deriveBands>): PendingReviewPayload {
  if (result.rejected) {
    throw new Error(`expected payload, got rejection: ${result.reason}`);
  }
  return result;
}

describe("§11.2 derivation", () => {
  it("produces six bands with a full arithmetic trail that reconciles", () => {
    const payload = expectPayload(derive());
    expect(payload.bands).toHaveLength(6);
    // Band 1: 6000 / 1 + 400 = 6400. Band 6: 6000 / 12 + 400 = 900.
    expect(payload.bands[0].indicativeRoundFigure).toBe(6400);
    expect(payload.bands[5].indicativeRoundFigure).toBe(900);
    for (const band of payload.bands) {
      expect(band.arithmetic).toContain(`${inputs.operatorFixedCost} / ${band.representativeSize}`);
      expect(band.fixedShare).toBeCloseTo(inputs.operatorFixedCost / band.representativeSize);
      expect(band.rawPerPerson).toBeCloseTo(band.fixedShare + inputs.perHeadCost);
    }
    expect(derivationReconciles(payload.bands, inputs, policy)).toBe(true);
  });

  it("rounds every band to the injected unit — mandatory, not cosmetic", () => {
    // 6000 / 7 + 400 = 1257.14… — must land on a multiple of 50.
    const payload = expectPayload(derive());
    for (const band of payload.bands) {
      expect(band.indicativeRoundFigure % policy.roundingUnit).toBe(0);
    }
    expect(payload.bands[3].indicativeRoundFigure).toBe(1250);
    expect(roundToUnit(1257.142857, 50)).toBe(1250);
    expect(roundToUnit(1275, 50)).toBe(1300);
  });

  it("orders bands band 1 highest per-person, band 6 lowest", () => {
    const payload = expectPayload(derive());
    const figures = payload.bands.map((band) => band.indicativeRoundFigure);
    const sortedDescending = [...figures].sort((a, b) => b - a);
    expect(figures).toEqual(sortedDescending);
    expect(new Set(figures).size).toBe(6); // strictly decreasing
  });

  it("includes the standing framing verbatim in every payload", () => {
    const payload = expectPayload(derive());
    expect(payload.framing).toBe(
      "These are round figures for shape and review only. They are not prices, not quotes, and not commitments. No output of this agent may reach a member-facing surface.",
    );
    expect(payload.framing).toBe(PRICING_AGENT_FRAMING);
  });

  it("marks every payload awaiting sign-off — no decision is final (4.11)", () => {
    const payload = expectPayload(derive());
    expect(payload.status).toBe("awaiting-sign-off");
  });

  it("throws on an uninjected (invalid) policy rather than defaulting it", () => {
    expect(() =>
      deriveBands(inputs, { roundingUnit: 0, envelope: { min: 100, max: 10000 } }),
    ).toThrow(/PRICE_ROUNDING/);
    expect(() =>
      deriveBands(inputs, { roundingUnit: 50, envelope: { min: 10000, max: 100 } }),
    ).toThrow(/PRICE_ENVELOPE/);
  });
});

describe("§11.2 sanity rails — each rejects before a human sees output", () => {
  it("rejects when rounding collapses monotonicity", () => {
    // Fixed cost 10 is noise against a 400 per-head cost at unit 500:
    // every band rounds to 500 and the ladder flattens.
    const result = derive(
      { operatorFixedCost: 10, operatorFloor: undefined },
      { roundingUnit: 500, envelope: { min: 100, max: 10000 } },
    );
    expect(result.rejected).toBe(true);
    if (result.rejected) {
      expect(result.reason).toBe("bands-not-monotonically-decreasing");
    }
  });

  it("rejects any band outside the envelope", () => {
    const result = derive({}, { envelope: { min: 100, max: 5000 } }); // band 1 = 6400
    expect(result.rejected).toBe(true);
    if (result.rejected) {
      expect(result.reason).toBe("band-outside-envelope");
    }
  });

  it("rejects band 6 below the operator's stated floor", () => {
    const result = derive({ operatorFloor: 950 }); // band 6 = 900
    expect(result.rejected).toBe(true);
    if (result.rejected) {
      expect(result.reason).toBe("band6-below-operator-floor");
    }
  });

  it("rejects band 1 above the operator's stated ceiling", () => {
    const result = derive({ operatorCeiling: 6000 }); // band 1 = 6400
    expect(result.rejected).toBe(true);
    if (result.rejected) {
      expect(result.reason).toBe("band1-above-operator-ceiling");
    }
  });

  it("rejects a derivation that does not reconcile (tampered band)", () => {
    const payload = expectPayload(derive());
    const tampered = payload.bands.map((band) =>
      band.band === 3 ? { ...band, indicativeRoundFigure: band.indicativeRoundFigure - policy.roundingUnit } : band,
    ) as unknown as PendingReviewPayload["bands"];
    const rejection = checkSanityRails(tampered, inputs, policy);
    expect(rejection).not.toBeNull();
    // A lowered band 3 first breaks monotonicity or reconciliation; either
    // way it never reaches a human as a payload.
    expect(rejection?.rejected).toBe(true);
    expect(derivationReconciles(tampered, inputs, policy)).toBe(false);
  });

  it("types the rejection so it cannot be rendered for review", () => {
    const result = derive({ operatorFloor: 950 });
    expect(result.rejected).toBe(true);
    if (result.rejected) {
      // @ts-expect-error — renderPendingReviewFile accepts only a payload;
      // a rejection has no write path and a human never sees it.
      expect(() => renderPendingReviewFile(result)).toBeDefined();
    }
  });
});

describe("§11.2 write path — pending-review/ only", () => {
  it("renders a pending-review file, never a member-display string", () => {
    const payload = expectPayload(derive());
    const file = renderPendingReviewFile(payload);
    expect(file.filename).toBe("section-4-cusco-to-uyuni-2026-08-08.json");
    const parsed = JSON.parse(file.contents) as PendingReviewPayload;
    expect(parsed.framing).toBe(PRICING_AGENT_FRAMING);
    expect(parsed.status).toBe("awaiting-sign-off");
    expect(parsed.inputs.section).toBe(inputs.section);
    expect(parsed.bands).toHaveLength(6);
    // Figures are plain numbers for a reviewer — no currency-formatted
    // member-facing strings anywhere in the payload.
    expect(file.contents).not.toMatch(/[$£€]\s?\d/);
    expect(typeof parsed.bands[0]?.indicativeRoundFigure).toBe("number");
  });
});
