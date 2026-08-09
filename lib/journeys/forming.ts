/**
 * Forming-only tools — spec v3.1 §6.3–§6.6. None of this touches Fixed.
 */
import type { JourneyWindow } from "@/lib/journeys/model";

/**
 * §6.4 — the demand map. Density only: no names, no passports, no
 * archetypes. The entry type cannot express a member.
 */
export interface DemandMapEntry {
  readonly sectionTitle: string;
  readonly sectionRoute: string;
  readonly windowLabel: string;
  readonly consideringCount: number;
}

export function toDemandMap(
  sections: readonly {
    readonly title: string;
    readonly route: string;
    readonly windows: readonly JourneyWindow[];
  }[],
): readonly DemandMapEntry[] {
  return sections.flatMap((section) =>
    section.windows.map((window) => ({
      sectionTitle: section.title,
      sectionRoute: section.route,
      windowLabel: window.label,
      consideringCount: window.consideringCount,
    })),
  );
}

/**
 * Forming policy — carriers of the unfilled QUORUM_TRIGGER, MIN_GROUP and
 * CONSIDERING_MAX tokens. Injected; no defaults. QUORUM_TRIGGER must sit
 * above MIN_GROUP so a vote can lose people without collapsing the departure
 * (§6.5) — construction enforces it.
 */
export interface FormingPolicy {
  readonly quorumTrigger: number;
  readonly minGroup: number;
  readonly consideringMax: number;
}

export function createFormingPolicy(policy: FormingPolicy): FormingPolicy {
  if (policy.quorumTrigger <= policy.minGroup) {
    throw new Error(
      "QUORUM_TRIGGER must sit above MIN_GROUP (§6.5): a vote must be able to lose people without collapsing the departure.",
    );
  }
  return policy;
}

/**
 * §6.3 — a member marks windows, not dates, and no more than the
 * CONSIDERING_MAX policy allows.
 */
export function canMarkAnotherWindow(
  markedCount: number,
  policy: FormingPolicy,
): boolean {
  return markedCount < policy.consideringMax;
}

/**
 * §6.5 — the quorum call. Candidate dates come from what the operator can
 * actually run — never invented — and members mark ALL that work: approval
 * voting, because approval finds the option most people can live with.
 */
export interface QuorumCandidateDate {
  readonly id: string;
  readonly label: string;
  /** Provenance requirement: a candidate exists only if operator-feasible. */
  readonly operatorFeasible: true;
}

export interface ApprovalBallot {
  readonly memberId: string;
  /** Every candidate that works — approval, not single choice. */
  readonly approvedDateIds: readonly string[];
}

export function shouldIssueQuorumCall(
  window: JourneyWindow,
  policy: FormingPolicy,
): boolean {
  return window.consideringCount >= policy.quorumTrigger;
}

export interface QuorumResult {
  readonly winningDateId: string;
  readonly approvals: number;
  /** Members whose dates did not survive stay in the window for the next call. */
  readonly remainInWindow: readonly string[];
  /** Widest coverage becomes a real departure: the journey moves to Fixed. */
  readonly movesJourneyTo: "fixed";
}

export function tallyApprovalVote(
  candidates: readonly QuorumCandidateDate[],
  ballots: readonly ApprovalBallot[],
): QuorumResult | null {
  if (candidates.length === 0 || ballots.length === 0) return null;

  let winner: { id: string; approvals: number } | null = null;
  for (const candidate of candidates) {
    const approvals = ballots.filter((ballot) =>
      ballot.approvedDateIds.includes(candidate.id),
    ).length;
    if (winner === null || approvals > winner.approvals) {
      winner = { id: candidate.id, approvals };
    }
  }
  if (winner === null || winner.approvals === 0) return null;

  const winnerId = winner.id;
  return {
    winningDateId: winnerId,
    approvals: winner.approvals,
    remainInWindow: ballots
      .filter((ballot) => !ballot.approvedDateIds.includes(winnerId))
      .map((ballot) => ballot.memberId),
    movesJourneyTo: "fixed",
  };
}

/**
 * §6.6 — the convener. Any member may propose a date and become its anchor.
 * No authority, no discount, no fee — the type has nowhere to put one.
 */
export interface ConvenerProposal {
  readonly windowId: string;
  readonly dateLabel: string;
  /** Rendered as "proposed by a member" — never a name (demand map is anonymous). */
  readonly proposedByMember: true;
}
