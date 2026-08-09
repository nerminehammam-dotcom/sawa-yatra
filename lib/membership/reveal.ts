/**
 * The graduated reveal — spec v3.1 §6.7, rules 4.7 and 4.8.
 *
 * | Stage | Trigger                           | What opens                                      |
 * | 1     | Mutual interest, live or standing | First name, message channel, passport in full   |
 * | 2     | Both commit to the same journey   | Photograph and first name. Nothing more.        |
 * | 3     | Checkout                          | Legal name to Sawayatra alone, identity check;  |
 * |       |                                   | to co-travellers per the ROSTER_NAME_POLICY     |
 * |       |                                   | token (unfilled, [SIGN-OFF])                    |
 *
 * Rule 4.7 — nothing is asked of a member before checkout: not money, not
 * documents. The stage-1 and stage-2 transition types physically have no
 * field for a deposit, hold, fee or document; they cannot be expressed.
 *
 * Rule 4.8 — identity documents are verified and destroyed. The record keeps
 * pass/fail, date, verifying party — and has no field in which an image
 * could be retained.
 *
 * Reveal is symmetric and logged: both are told at the same instant and each
 * sees that the other saw them. There is no vantage point from which a
 * member looks without being seen to have looked.
 */

import type { Passport } from "./identity";

export type RevealStage = 1 | 2 | 3;

/** Rule 4.7, exported as a checkable fact. */
export const REVEAL_REQUIRES_NOTHING_BEFORE_CHECKOUT = true as const;

// ---------------------------------------------------------------------------
// What opens at each stage
// ---------------------------------------------------------------------------

/** Stage 1 — mutual interest, live or standing. */
export interface StageOneOpens {
  readonly firstName: string;
  readonly messageChannelId: string;
  readonly fullPassport: Passport;
}

/**
 * Stage 2 — both commit to the same journey. Photograph and first name.
 * NOTHING more: a face and a first name are what two people need to plan
 * together and recognise each other at a gate city. A surname is what a
 * stranger needs in order to search for you, so no surname field is even
 * expressible on this type.
 */
export interface StageTwoOpens {
  readonly photograph: string;
  readonly firstName: string;
  readonly surname?: never;
  readonly familyName?: never;
  readonly lastName?: never;
  readonly legalName?: never;
}

/**
 * Stage 3 — checkout. Legal name to Sawayatra alone, with the identity
 * check. What co-travellers see is governed by the ROSTER_NAME_POLICY token,
 * currently unfilled ([SIGN-OFF]); this type carries the reference, never a
 * guessed value.
 */
export interface StageThreeOpens {
  readonly legalNameToSawayatra: true;
  readonly identityCheck: true;
  readonly rosterNamePolicy: { readonly token: "ROSTER_NAME_POLICY" };
}

/** Builder — returns exactly the stage-1 fields, frozen. */
export function stageOneOpens(
  firstName: string,
  messageChannelId: string,
  fullPassport: Passport,
): StageOneOpens {
  return Object.freeze({ firstName, messageChannelId, fullPassport });
}

/** Builder — returns exactly { photograph, firstName }, frozen. Nothing more. */
export function stageTwoOpens(
  photograph: string,
  firstName: string,
): StageTwoOpens {
  return Object.freeze({ photograph, firstName });
}

export function stageThreeOpens(): StageThreeOpens {
  return Object.freeze({
    legalNameToSawayatra: true,
    identityCheck: true,
    rosterNamePolicy: Object.freeze({ token: "ROSTER_NAME_POLICY" as const }),
  });
}

// ---------------------------------------------------------------------------
// Rule 4.8 — the identity check record. Zero retention of the document.
// ---------------------------------------------------------------------------

/**
 * Record pass/fail, date, verifying party. Delete the image immediately.
 * The `never` fields make retention inexpressible: no image, scan or
 * document body can ever be assigned onto this record.
 */
export interface IdentityCheckRecord {
  readonly passed: boolean;
  readonly date: Date;
  readonly verifier: string;
  readonly image?: never;
  readonly imageRef?: never;
  readonly scan?: never;
  readonly document?: never;
  readonly documentBody?: never;
  readonly documentImage?: never;
  readonly file?: never;
}

export interface IdentityVerificationInput {
  readonly memberId: string;
  readonly verifier: string;
  /** Opaque handle to the presented document image. Never stored (4.8). */
  readonly imageRef: unknown;
}

/**
 * Verifies and destroys. `inspect` looks at the image; `destroyImageImmediately`
 * runs in a finally block, so the image reference is destroyed whether the
 * inspection passes, fails or throws — and the returned record structurally
 * cannot carry it. Sawayatra never retains scans of members' identity
 * documents.
 */
export function verifyIdentity(
  input: IdentityVerificationInput,
  inspect: (imageRef: unknown) => boolean,
  destroyImageImmediately: (imageRef: unknown) => void,
  now: Date,
): IdentityCheckRecord {
  let passed = false;
  try {
    passed = inspect(input.imageRef);
  } finally {
    destroyImageImmediately(input.imageRef);
  }
  return Object.freeze({ passed, date: now, verifier: input.verifier });
}

// ---------------------------------------------------------------------------
// Stage transitions — rule 4.7 enforced in the types.
// ---------------------------------------------------------------------------

/**
 * Fields that must not exist before checkout, made unassignable. Extending
 * this interface means the transition input CANNOT carry money or documents:
 * the compiler rejects any attempt to pass them.
 */
interface AsksNothingOfTheMember {
  readonly deposit?: never;
  readonly payment?: never;
  readonly hold?: never;
  readonly commitmentFee?: never;
  readonly fee?: never;
  readonly money?: never;
  readonly identityDocument?: never;
  readonly document?: never;
  readonly documentRef?: never;
}

/** Stage 1 trigger — mutual interest, live or standing. Asks nothing. */
export interface StageOneTrigger extends AsksNothingOfTheMember {
  readonly kind: "mutual-interest";
  readonly via: "live" | "standing";
}

/**
 * Stage 2 trigger — both commit to the same journey. "Commit" means both
 * members have said they intend to travel together, not that either has
 * paid (§6.7): no deposit, no hold, no commitment fee is expressible here.
 */
export interface StageTwoTrigger extends AsksNothingOfTheMember {
  readonly kind: "commitment";
  readonly journeyId: string;
}

/**
 * Stage 3 trigger — checkout. The first time a member pays anything or
 * proves anything is the moment they commit to a named journey (4.7). The
 * identity check happens here, and only its retained record (4.8) appears.
 */
export interface StageThreeTrigger {
  readonly kind: "checkout";
  readonly journeyId: string;
  readonly identityCheck: IdentityCheckRecord;
}

export type RevealTransition =
  | StageOneTrigger
  | StageTwoTrigger
  | StageThreeTrigger;

const STAGE_FOR_TRIGGER: Record<RevealTransition["kind"], RevealStage> = {
  "mutual-interest": 1,
  commitment: 2,
  checkout: 3,
};

// ---------------------------------------------------------------------------
// Symmetric, logged advancement
// ---------------------------------------------------------------------------

export interface RevealPair {
  readonly memberA: string;
  readonly memberB: string;
}

/**
 * One log entry per member. `at` is the same instant for both; `seenByOther`
 * is structurally true — each sees that the other saw them.
 */
export interface RevealEvent {
  readonly memberId: string;
  readonly sawMemberId: string;
  readonly stage: RevealStage;
  readonly at: Date;
  readonly seenByOther: true;
}

export interface RevealAdvancement {
  readonly stage: RevealStage;
  /** Events for BOTH members, identical timestamps — reveal is symmetric. */
  readonly events: readonly [RevealEvent, RevealEvent];
}

/**
 * Advances the reveal for a pair. Both members receive an event carrying the
 * identical timestamp; neither can be revealed to without the other knowing.
 */
export function advanceReveal(
  pair: RevealPair,
  transition: RevealTransition,
  now: Date,
): RevealAdvancement {
  const stage = STAGE_FOR_TRIGGER[transition.kind];
  return {
    stage,
    events: [
      {
        memberId: pair.memberA,
        sawMemberId: pair.memberB,
        stage,
        at: now,
        seenByOther: true,
      },
      {
        memberId: pair.memberB,
        sawMemberId: pair.memberA,
        stage,
        at: now,
        seenByOther: true,
      },
    ],
  };
}
