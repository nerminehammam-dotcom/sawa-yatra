/**
 * Agent decision log — spec v3.1 §11.1 shared constraints, rule 4.11, §12.
 *
 * Both agents (pricing §11.2, moderation §11.3) propose; a human commits.
 * Every decision is logged with input, output, the rule that fired, a
 * timestamp, and the human who committed or overrode it — so "why was my
 * paragraph held" and "why did this band change" can be answered a year
 * later.
 *
 * Two walls are enforced here:
 *
 * 1. NO AGENT DECISION IS FINAL (rule 4.11). The type system splits every
 *    entry into `NotYetCommittedAgentDecision` (committedBy: null) and
 *    `CommittedAgentDecision` (committedBy: a human's name). Downstream code
 *    that acts on a decision takes only the committed type; an uncommitted
 *    entry is a compile error, and `acceptCommittedDecision` re-checks at
 *    runtime.
 *
 * 2. AGENT BLINDNESS (§11.1). Neither agent ever sees date of birth, legal
 *    name, or contact details from the hidden profile. The only member
 *    context an agent receives is `AgentVisibleMemberContext`, which has no
 *    such fields, and `assertAgentBlind` rejects at runtime any object that
 *    smuggles them in under any nesting.
 *
 * Log entries are themselves personal data (§12): they carry member content,
 * so every entry embeds a retention record with its own rule.
 */

export type AgentName = "pricing" | "moderation";

/* -------------------------------------------------------------------------
 * Retention — §12: agent logs are personal data with their own rule.
 * ---------------------------------------------------------------------- */

export interface AgentLogRetention {
  /** Log entries carry member content; they are never "just telemetry". */
  readonly classification: "personal-data";
  /** Plain-language retention note stored on every entry. */
  readonly note: string;
}

export const AGENT_LOG_RETENTION: AgentLogRetention = {
  classification: "personal-data",
  note:
    "This log entry contains member content and is personal data under the " +
    "section 12 schedule. It is kept under the agent-log retention rule, is " +
    "covered by the documented subject access and erasure routes, and is " +
    "deleted when that rule says so — it does not live forever because it " +
    "is a log.",
};

/* -------------------------------------------------------------------------
 * The entry, split by commitment state (rule 4.11).
 * ---------------------------------------------------------------------- */

interface AgentDecisionLogEntryBase {
  readonly agent: AgentName;
  /** What the agent was given. Passed through assertAgentBlind on creation. */
  readonly input: unknown;
  /** What the agent proposed. A proposal, never an action. */
  readonly output: unknown;
  /** The specific rule that fired — reviewable, not a vibe. */
  readonly ruleFired: string;
  /** ISO-8601 instant the decision was proposed. */
  readonly timestamp: string;
  /** §12 — the entry is personal data with its own retention rule. */
  readonly retention: AgentLogRetention;
}

/** A proposal awaiting a human. Nothing downstream may act on this. */
export interface NotYetCommittedAgentDecision extends AgentDecisionLogEntryBase {
  readonly committedBy: null;
  readonly overriddenBy?: null;
}

/** A decision a named human has committed (or overridden). Only this acts. */
export interface CommittedAgentDecision extends AgentDecisionLogEntryBase {
  /** The human who committed it. Never empty, never an agent. */
  readonly committedBy: string;
  /** Set when the human overrode the agent's proposal rather than adopting it. */
  readonly overriddenBy?: string | null;
}

export type AgentDecisionLogEntry =
  | NotYetCommittedAgentDecision
  | CommittedAgentDecision;

/* -------------------------------------------------------------------------
 * Agent blindness (§11.1).
 * ---------------------------------------------------------------------- */

/**
 * The only member context an agent may receive. Deliberately contains no
 * date of birth, no legal name, no email, no mobile — those live in the
 * hidden profile (§3.1) and never reach an agent.
 */
export interface AgentVisibleMemberContext {
  /** Opaque pseudonymous reference — never a name, never contactable. */
  readonly memberRef: string;
}

/** Hidden-profile keys no agent may ever be handed (§3.1, §11.1). */
const AGENT_BLIND_KEYS: ReadonlySet<string> = new Set([
  "dateofbirth",
  "dob",
  "legalname",
  "email",
  "mobile",
]);

export class AgentBlindnessError extends Error {
  constructor(key: string) {
    super(
      `Agent blindness violated: context contains hidden-profile field "${key}". ` +
        "Neither agent ever sees date of birth, legal name, or contact details (spec 11.1).",
    );
    this.name = "AgentBlindnessError";
  }
}

/**
 * Runtime guard: rejects any value that carries hidden-profile fields at any
 * depth. Called on every agent input before an agent reasons about it.
 */
export function assertAgentBlind(context: unknown): void {
  const seen = new Set<object>();
  const walk = (value: unknown): void => {
    if (value === null || typeof value !== "object") return;
    if (seen.has(value)) return;
    seen.add(value);
    if (Array.isArray(value)) {
      for (const item of value) walk(item);
      return;
    }
    for (const [key, nested] of Object.entries(value)) {
      if (AGENT_BLIND_KEYS.has(key.toLowerCase().replace(/[^a-z]/g, ""))) {
        throw new AgentBlindnessError(key);
      }
      walk(nested);
    }
  };
  walk(context);
}

/* -------------------------------------------------------------------------
 * Lifecycle: propose → (human) commit or override → downstream accepts.
 * ---------------------------------------------------------------------- */

export interface DecisionProposal {
  readonly agent: AgentName;
  readonly input: unknown;
  readonly output: unknown;
  readonly ruleFired: string;
  /** ISO timestamp; injectable for tests. */
  readonly timestamp?: string;
}

/** Create a log entry in the only state an agent can produce: uncommitted. */
export function createDecisionEntry(
  proposal: DecisionProposal,
): NotYetCommittedAgentDecision {
  assertAgentBlind(proposal.input);
  assertAgentBlind(proposal.output);
  return {
    agent: proposal.agent,
    input: proposal.input,
    output: proposal.output,
    ruleFired: proposal.ruleFired,
    timestamp: proposal.timestamp ?? new Date().toISOString(),
    committedBy: null,
    retention: AGENT_LOG_RETENTION,
  };
}

function requireHumanName(name: string, action: string): string {
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error(
      `A decision can only be ${action} by a named human (rule 4.11); got an empty name.`,
    );
  }
  return name.trim();
}

/** A named human adopts the agent's proposal. The decision becomes final. */
export function commitDecision(
  entry: NotYetCommittedAgentDecision,
  committedBy: string,
): CommittedAgentDecision {
  return {
    ...entry,
    committedBy: requireHumanName(committedBy, "committed"),
    overriddenBy: null,
  };
}

/** A named human replaces the agent's proposal with their own judgment. */
export function overrideDecision(
  entry: NotYetCommittedAgentDecision,
  overriddenBy: string,
): CommittedAgentDecision {
  const human = requireHumanName(overriddenBy, "overridden");
  return { ...entry, committedBy: human, overriddenBy: human };
}

/** Narrowing guard for stored entries of unknown state. */
export function isCommitted(
  entry: AgentDecisionLogEntry,
): entry is CommittedAgentDecision {
  return entry.committedBy !== null;
}

/**
 * The single gate downstream code passes a decision through before acting on
 * it. The parameter type already excludes `NotYetCommittedAgentDecision`
 * (compile error); the runtime check catches anything that arrived untyped.
 */
export function acceptCommittedDecision(
  decision: CommittedAgentDecision,
): CommittedAgentDecision {
  if (
    typeof decision.committedBy !== "string" ||
    decision.committedBy.trim() === ""
  ) {
    throw new Error(
      "Refusing to act on an uncommitted agent decision: no agent decision is final until a human commits it (rule 4.11).",
    );
  }
  return decision;
}
