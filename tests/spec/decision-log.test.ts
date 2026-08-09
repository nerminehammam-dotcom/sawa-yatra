/**
 * Area G tests — shared agent decision log (spec v3.1 §11.1, rules 4.11, §12).
 */
import { describe, expect, it } from "vitest";

import {
  AGENT_LOG_RETENTION,
  AgentBlindnessError,
  type AgentDecisionLogEntry,
  type AgentVisibleMemberContext,
  acceptCommittedDecision,
  assertAgentBlind,
  commitDecision,
  createDecisionEntry,
  isCommitted,
  overrideDecision,
} from "@/lib/agents/decision-log";

const proposal = {
  agent: "moderation" as const,
  input: { memberRef: "member-ref-0031", content: "a paragraph" },
  output: { published: true, flags: [] },
  ruleFired: "published-no-flags",
  timestamp: "2026-08-08T12:00:00.000Z",
};

describe("rule 4.11 — no agent decision is final", () => {
  it("creates every entry uncommitted, with the full audit fields", () => {
    const entry = createDecisionEntry(proposal);
    expect(entry.committedBy).toBeNull();
    expect(entry.agent).toBe("moderation");
    expect(entry.input).toEqual(proposal.input);
    expect(entry.output).toEqual(proposal.output);
    expect(entry.ruleFired).toBe("published-no-flags");
    expect(entry.timestamp).toBe("2026-08-08T12:00:00.000Z");
    expect(isCommitted(entry)).toBe(false);
  });

  it("commits only under a named human", () => {
    const entry = createDecisionEntry(proposal);
    const committed = commitDecision(entry, "Nermine");
    expect(committed.committedBy).toBe("Nermine");
    expect(committed.overriddenBy).toBeNull();
    expect(isCommitted(committed)).toBe(true);
    expect(() => commitDecision(entry, "")).toThrow(/named human/);
    expect(() => commitDecision(entry, "   ")).toThrow(/named human/);
  });

  it("records an override with the human who overrode it", () => {
    const entry = createDecisionEntry(proposal);
    const overridden = overrideDecision(entry, "Nermine");
    expect(overridden.committedBy).toBe("Nermine");
    expect(overridden.overriddenBy).toBe("Nermine");
  });

  it("downstream refuses an uncommitted decision — at the type level and at runtime", () => {
    const entry = createDecisionEntry(proposal);
    // @ts-expect-error — NotYetCommittedAgentDecision (committedBy: null) is
    // not assignable where a CommittedAgentDecision is required.
    expect(() => acceptCommittedDecision(entry)).toThrow(/4\.11/);

    const forged = {
      ...createDecisionEntry(proposal),
      committedBy: "  ",
    } as unknown as Parameters<typeof acceptCommittedDecision>[0];
    expect(() => acceptCommittedDecision(forged)).toThrow(/4\.11/);

    const committed = commitDecision(createDecisionEntry(proposal), "Nermine");
    expect(acceptCommittedDecision(committed)).toBe(committed);
  });

  it("narrows a stored entry of unknown state only through the guard", () => {
    const stored: AgentDecisionLogEntry = commitDecision(
      createDecisionEntry(proposal),
      "Nermine",
    );
    if (isCommitted(stored)) {
      expect(acceptCommittedDecision(stored).committedBy).toBe("Nermine");
    } else {
      throw new Error("entry should be committed");
    }
  });
});

describe("§11.1 — agent blindness", () => {
  const clean: AgentVisibleMemberContext = { memberRef: "member-ref-0031" };

  it("accepts the agent-visible context and plain values", () => {
    expect(() => assertAgentBlind(clean)).not.toThrow();
    expect(() => assertAgentBlind(null)).not.toThrow();
    expect(() => assertAgentBlind("a string of content")).not.toThrow();
    expect(() => assertAgentBlind([clean, { archetype: "cartographer" }])).not.toThrow();
  });

  it.each([
    ["dateOfBirth", { memberRef: "x", dateOfBirth: "1961-04-02" }],
    ["legalName", { memberRef: "x", legalName: "A B" }],
    ["email", { memberRef: "x", email: "a@example.com" }],
    ["mobile", { memberRef: "x", mobile: "0100000000" }],
    ["dob alias", { memberRef: "x", dob: "1961-04-02" }],
    ["snake_case alias", { memberRef: "x", date_of_birth: "1961-04-02" }],
    ["nested leak", { memberRef: "x", profile: { contact: { email: "a@example.com" } } }],
    ["leak inside an array", [{ ok: true }, { legal_name: "A B" }]],
  ])("rejects a context carrying %s", (_label, dirty) => {
    expect(() => assertAgentBlind(dirty)).toThrow(AgentBlindnessError);
  });

  it("survives cyclic structures", () => {
    const cyclic: Record<string, unknown> = { memberRef: "x" };
    cyclic.self = cyclic;
    expect(() => assertAgentBlind(cyclic)).not.toThrow();
  });

  it("guards entry creation itself — a leaky input cannot even be logged", () => {
    expect(() =>
      createDecisionEntry({
        ...proposal,
        input: { memberRef: "x", email: "leak@example.com" },
      }),
    ).toThrow(AgentBlindnessError);
  });

  it("gives the visible-context type no hidden-profile fields", () => {
    // @ts-expect-error — AgentVisibleMemberContext has no email field.
    const bad: AgentVisibleMemberContext = { memberRef: "x", email: "a@b.c" };
    expect(bad).toBeDefined();
  });
});

describe("§12 — log entries are personal data", () => {
  it("stamps every entry with the retention record", () => {
    const entry = createDecisionEntry(proposal);
    expect(entry.retention).toBe(AGENT_LOG_RETENTION);
    expect(entry.retention.classification).toBe("personal-data");
    expect(entry.retention.note).toContain("personal data");
    expect(entry.retention.note).toContain("erasure");
  });
});
