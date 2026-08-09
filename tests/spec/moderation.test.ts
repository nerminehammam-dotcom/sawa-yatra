/**
 * Area G tests — moderation agent (spec v3.1 §11.3 + rule 4.6).
 *
 * The review SLA below is a LOCAL TEST VALUE; the real value is the §13
 * token REVIEW_SLA (owner: Nermine), injected as policy at the call site.
 */
import { describe, expect, it } from "vitest";

import { AgentBlindnessError } from "@/lib/agents/decision-log";
import {
  CONTACT_HOLD_EXPLANATION,
  CONTACT_MATCHER_COVERAGE_NOTE,
  MEMBER_DISCLOSURE,
  type Flag,
  type ModerationPolicy,
  containsContactDetails,
  expireUnreviewed,
  isConfidentlyEnglish,
  moderationDecisionEntry,
  neverFlagCategory,
  reviewOpenSpaceContent,
} from "@/lib/agents/moderation";

const policy: ModerationPolicy = { reviewSla: { hours: 48 } };
const context = { memberRef: "member-ref-0007" };
const now = new Date("2026-08-08T12:00:00Z");

function review(content: string) {
  return reviewOpenSpaceContent(content, context, policy, now);
}

describe("§11.3 — content always publishes", () => {
  it("publishes benign content immediately with no flags", () => {
    const outcome = review(
      "I collect old railway maps and I am slowly learning to sketch. On the road I am the one who finds the bakery before breakfast.",
    );
    expect(outcome).toEqual({ published: true, held: false, flags: [] });
  });

  it("publishes flagged content too — a flag queues, it never blocks", () => {
    const outcome = review(
      "I run a small travel agency and can get members a discount if you book through me — my packages cover all of Peru.",
    );
    expect(outcome.held).toBe(false);
    if (!outcome.held) {
      expect(outcome.published).toBe(true);
      expect(outcome.flags.map((flag) => flag.reason)).toContain(
        "commercial-solicitation",
      );
    }
  });
});

describe("§11.3 NEVER-FLAG hard list — none of these may flag", () => {
  const passages: ReadonlyArray<[string, string]> = [
    [
      "grief and bereavement",
      "My late husband and I planned this road for thirty years. He died two springs ago, and I am finally walking the section we talked about, with his photograph tucked in my bag.",
    ],
    [
      "illness, disability, mobility, mental health",
      "Since my diagnosis I travel slowly. Multiple sclerosis sets my pace, so I plan rest days and I am glad of a wheelchair-friendly room at the gate cities. It has made me a better traveller, not a lesser one.",
    ],
    [
      "religion and religious practice",
      "I keep my prayer times on the road and will look for a mosque in Cusco. If Ramadan falls during the section I will be fasting, and I love how a shared meal at sundown turns strangers into a table.",
    ],
    [
      "sexuality and gender",
      "My wife and I are both women who came out late in life, and travelling openly as a gay couple still feels like a small daily victory. We are good company and we pack light.",
    ],
    [
      "political history, displacement, exile, war",
      "We fled the war in 1992 and I grew up in exile, three countries in five years. Mountains were the first landscape that felt like home again, which is why I keep returning to them.",
    ],
    [
      "non-English content (Arabic)",
      "أحب السفر البطيء عبر الجبال، وأبحث عن رفقة طيبة تشاركني الطريق الطويل. أطبخ جيداً وأحمل معي دفتر رسم أينما ذهبت.",
    ],
  ];

  for (const [label, passage] of passages) {
    it(`does not flag: ${label}`, () => {
      const outcome = review(passage);
      expect(outcome.held).toBe(false);
      if (!outcome.held) {
        expect(outcome.published).toBe(true);
        expect(outcome.flags).toEqual([]);
      }
    });
  }

  it("treats not-confidently-English as non-English (conservative)", () => {
    // Latin script, but no recognisable English function words.
    expect(isConfidentlyEnglish("Vamos juntos por la cordillera, despacio.")).toBe(false);
    expect(neverFlagCategory("Vamos juntos por la cordillera, despacio.")).toBe(
      "non-english",
    );
    // Confident English is confident English.
    expect(
      isConfidentlyEnglish("I am the one who finds the bakery before breakfast."),
    ).toBe(true);
  });

  it("short-circuits before judgment flags: a war memoir mentioning a business does not flag", () => {
    const outcome = review(
      "After we fled the war I built a small business from nothing; I am proud of it, and prouder still that my daughter runs it now while I travel.",
    );
    expect(outcome.held).toBe(false);
    if (!outcome.held) {
      expect(outcome.flags).toEqual([]);
    }
  });
});

describe("rule 4.6 — contact details: the one permitted hold", () => {
  const contactCases: ReadonlyArray<[string, string]> = [
    ["email address", "Lovely to meet you all — write to me at nour.travels@example.com any time."],
    ["phone number", "If anyone is in Cusco in March, call me on +44 7911 123456 and we will find coffee."],
    ["handle", "I post my sketches as @nour_on_the_road if you want to follow along."],
    ["URL", "All my previous trip notes live at www.slowroadnotes.com for anyone curious."],
    ["messaging ID", "I am on Telegram, username nour_road, message me there."],
  ];

  for (const [label, content] of contactCases) {
    it(`holds, explains, and routes to a human: ${label}`, () => {
      const outcome = review(content);
      expect(outcome.held).toBe(true);
      if (outcome.held) {
        expect(outcome.published).toBe(false);
        expect(outcome.explanation).toBe(CONTACT_HOLD_EXPLANATION);
        expect(outcome.explanation).toContain("4.6");
        expect(outcome.humanRoute).not.toHaveLength(0);
        expect(outcome.humanRoute.toLowerCase()).toContain("human");
        // The hold also flags, into the same human queue.
        expect(outcome.flag.reason).toBe("contact-details");
        expect(outcome.flag.status).toBe("pending");
      }
    });
  }

  it("holds contact details even inside protected material — 4.6 is contractual, not topical", () => {
    const outcome = review(
      "My late husband kept a blog of our journeys at www.tworoads.example.com and I would love you to read it.",
    );
    expect(outcome.held).toBe(true);
  });

  it("does not hold plain prose without contact patterns", () => {
    expect(
      containsContactDetails(
        "Find me the same name on the usual photo app — I post mountains, mostly.",
      ),
    ).toBe(false); // the honest miss the coverage note admits to
    expect(CONTACT_MATCHER_COVERAGE_NOTE).toContain("two-thirds");
  });
});

describe("judgment flags — human queue only, content already published", () => {
  it("flags plausible third-party identification without consent", () => {
    const outcome = review(
      "My ex-husband Peter Callaghan still lives in Bristol and I will happily tell anyone which street.",
    );
    expect(outcome.held).toBe(false);
    if (!outcome.held) {
      expect(outcome.published).toBe(true);
      expect(outcome.flags.map((flag) => flag.reason)).toContain(
        "third-party-identification",
      );
    }
  });

  it("flags legal-obligation triggers", () => {
    const outcome = review(
      "I can get anything through customs, undeclared cash included, if the price is right.",
    );
    expect(outcome.held).toBe(false);
    if (!outcome.held) {
      expect(outcome.published).toBe(true);
      expect(outcome.flags.map((flag) => flag.reason)).toContain("legal-obligation");
    }
  });

  it("computes reviewBy from the injected SLA policy", () => {
    const outcome = review("Book through me and I will sort you a special rate.");
    expect(outcome.held).toBe(false);
    if (!outcome.held) {
      const flag = outcome.flags[0];
      expect(flag).toBeDefined();
      expect(flag?.queuedAt).toBe(now.toISOString());
      expect(flag?.reviewBy).toBe(
        new Date(now.getTime() + policy.reviewSla.hours * 60 * 60 * 1000).toISOString(),
      );
    }
  });
});

describe("§11.3 queue discipline — SLA expiry lets content stand", () => {
  const flag: Flag = {
    reason: "commercial-solicitation",
    queuedAt: "2026-08-01T00:00:00.000Z",
    reviewBy: "2026-08-03T00:00:00.000Z",
    status: "pending",
  };

  it("expires an unreviewed flag past the SLA — content stands", () => {
    const result = expireUnreviewed(flag, new Date("2026-08-04T00:00:00Z"));
    expect(result.flag.status).toBe("expired");
    expect(result.contentStands).toBe(true);
  });

  it("leaves a flag pending inside the SLA — content stands regardless", () => {
    const result = expireUnreviewed(flag, new Date("2026-08-02T00:00:00Z"));
    expect(result.flag.status).toBe("pending");
    expect(result.contentStands).toBe(true);
  });

  it("never rewinds a reviewed flag", () => {
    const reviewed: Flag = { ...flag, status: "reviewed" };
    const result = expireUnreviewed(reviewed, new Date("2026-08-09T00:00:00Z"));
    expect(result.flag.status).toBe("reviewed");
    expect(result.contentStands).toBe(true);
  });
});

describe("§11.1 — blindness and logging", () => {
  it("refuses a context carrying hidden-profile fields", () => {
    expect(() =>
      reviewOpenSpaceContent(
        "A perfectly harmless paragraph.",
        // @ts-expect-error — the type already forbids this; the runtime guard backs it up.
        { memberRef: "member-ref-0007", email: "leak@example.com" },
        policy,
        now,
      ),
    ).toThrow(AgentBlindnessError);
  });

  it("logs every decision uncommitted — no decision is final (4.11)", () => {
    const outcome = review("I collect old railway maps and I sketch a little.");
    const entry = moderationDecisionEntry(
      "I collect old railway maps and I sketch a little.",
      context,
      outcome,
      now.toISOString(),
    );
    expect(entry.agent).toBe("moderation");
    expect(entry.committedBy).toBeNull();
    expect(entry.ruleFired).toBe("published-no-flags");
    expect(entry.retention.classification).toBe("personal-data");
  });
});

describe("§11.3 member-facing disclosure", () => {
  it("carries the disclosure verbatim", () => {
    expect(MEMBER_DISCLOSURE).toBe(
      "Your open space publishes straight away. We check automatically for contact details — everything else, a person reads, and only if something is flagged. If we ever hold something of yours, we will tell you why and you can talk to a human about it.",
    );
  });
});
