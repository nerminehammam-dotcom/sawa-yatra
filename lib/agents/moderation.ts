/**
 * Moderation agent — spec v3.1 §11.3 + rule 4.6.
 *
 * Purpose: flag open-space content for HUMAN review. It never blocks, hides,
 * deletes, edits or delays publication. Content publishes immediately; a
 * flag goes to a queue a person reads.
 *
 * Why the rule exists: in an invitation-only club where every member traces
 * to a sponsor (§5.3), the expensive error is the FALSE POSITIVE. A member
 * writes about a late husband, an illness that shapes how they travel, a war
 * they lived through, their faith — precisely the material that makes a
 * passport worth reading, and precisely what a moderation model flags.
 * Silently suppressing that paragraph is the worst thing this product can do
 * to them, and they will never report it. They will simply go quiet.
 *
 * Order of operations, and the one deliberate resolution in it:
 *
 * 1. Agent blindness check on the context (§11.1).
 * 2. Rule 4.6 contact-detail matching — the ONE permitted hold, because it
 *    is pattern-matching rather than judgment, and rule 4.6 is absolute
 *    contractually. It runs on any script and any language: an email
 *    address is an email address in Arabic prose too. Held content gets a
 *    plain explanation and a route to a person — never a silent
 *    disappearance.
 * 3. The NEVER-FLAG guard — grief, illness, religion, sexuality and gender,
 *    political history and war, and anything not confidently English —
 *    which short-circuits ALL judgment-based flagging to "publish, no
 *    flags". Non-English detection is conservative: if the agent is not
 *    confident the text is English, it treats it as non-English and stands
 *    down; such content reaches human review only on member report.
 * 4. Judgment-based flags (commercial solicitation, third-party
 *    identification, legal triggers) — to a human queue only, while the
 *    content is already published.
 *
 * Queue discipline: a flag is reviewed within the injected REVIEW_SLA
 * policy (§13, owner Nermine — never a literal here). An unreviewed flag
 * past the SLA EXPIRES and the content STANDS. A queue without a service
 * level becomes a blocklist by neglect.
 */

import {
  type AgentVisibleMemberContext,
  assertAgentBlind,
  createDecisionEntry,
  type NotYetCommittedAgentDecision,
} from "@/lib/agents/decision-log";

/* -------------------------------------------------------------------------
 * Member-facing disclosure — §11.3, verbatim, shown at the editor.
 * ---------------------------------------------------------------------- */

export const MEMBER_DISCLOSURE =
  "Your open space publishes straight away. We check automatically for contact details — everything else, a person reads, and only if something is flagged. If we ever hold something of yours, we will tell you why and you can talk to a human about it." as const;

/* -------------------------------------------------------------------------
 * Policy — REVIEW_SLA is injected (§13), never a literal in this module.
 * ---------------------------------------------------------------------- */

export interface ReviewSla {
  /** Hours a flag may wait for a human before it expires and content stands. */
  readonly hours: number;
}

export interface ModerationPolicy {
  readonly reviewSla: ReviewSla;
}

/* -------------------------------------------------------------------------
 * The queue.
 * ---------------------------------------------------------------------- */

export type FlagReason =
  | "contact-details"
  | "commercial-solicitation"
  | "third-party-identification"
  | "legal-obligation";

export type FlagStatus = "pending" | "reviewed" | "expired";

export interface Flag {
  readonly reason: FlagReason;
  /** ISO instant the flag entered the human queue. */
  readonly queuedAt: string;
  /** ISO deadline computed from the injected review SLA. */
  readonly reviewBy: string;
  readonly status: FlagStatus;
}

const MS_PER_HOUR = 60 * 60 * 1000;

function createFlag(reason: FlagReason, now: Date, policy: ModerationPolicy): Flag {
  return {
    reason,
    queuedAt: now.toISOString(),
    reviewBy: new Date(
      now.getTime() + policy.reviewSla.hours * MS_PER_HOUR,
    ).toISOString(),
    status: "pending",
  };
}

/**
 * §11.3 queue discipline: an unreviewed flag past the SLA expires and the
 * content stands. Content stands in every case — it was published from the
 * first moment and the queue has no power to unpublish.
 */
export function expireUnreviewed(
  flag: Flag,
  now: Date,
): { readonly flag: Flag; readonly contentStands: true } {
  if (flag.status === "pending" && now.toISOString() > flag.reviewBy) {
    return { flag: { ...flag, status: "expired" }, contentStands: true };
  }
  return { flag, contentStands: true };
}

/* -------------------------------------------------------------------------
 * Outcomes.
 * ---------------------------------------------------------------------- */

/** The normal outcome: published immediately, flags (if any) queued for a human. */
export interface PublishedOutcome {
  readonly published: true;
  readonly held: false;
  readonly flags: readonly Flag[];
}

/**
 * The one permitted hold — rule 4.6 contact details. Always with a plain
 * explanation and a route to a person, never a silent disappearance.
 */
export interface HeldOutcome {
  readonly published: false;
  readonly held: true;
  readonly explanation: string;
  readonly humanRoute: string;
  /** The 4.6 detection also enters the human queue. */
  readonly flag: Flag;
}

export type ModerationOutcome = PublishedOutcome | HeldOutcome;

/* -------------------------------------------------------------------------
 * Rule 4.6 — contact-detail matcher.
 * ---------------------------------------------------------------------- */

/**
 * Honest coverage note (spec 4.6): pattern-matching catches structured
 * strings and misses "same name on instagram", a handle written into a
 * photograph, and numbers spelled in words. Expect roughly two-thirds
 * coverage. The filter is a speed bump; the enforcement is the term of
 * membership plus member reporting. The rule is absolute contractually,
 * not technically.
 */
export const CONTACT_MATCHER_COVERAGE_NOTE =
  "Pattern-matching catches structured contact strings and misses handles described in prose, handles inside images, and numbers spelled out in words. Expect roughly two-thirds coverage. The filter is a speed bump; the enforcement is the term of membership plus member reporting.";

const CONTACT_PATTERNS: readonly RegExp[] = [
  // Email addresses.
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
  // Phone-number-like strings: 8+ digits allowing spaces, dots, dashes, parens.
  /(?:\+|\b)\d[\d\s().-]{6,}\d\b/,
  // Handles: @name outside an email (preceded by start/whitespace/punctuation).
  /(?:^|[\s([:,;])@[A-Za-z0-9_.]{2,}\b/,
  // URLs, explicit or www-prefixed, and bare common-TLD domains.
  /\bhttps?:\/\/\S+/i,
  /\bwww\.[^\s]+/i,
  /\b[a-z0-9-]{2,}\.(?:com|net|org|io|co|me|app|uk|de|fr|eg|es|it)(?:\/\S*)?\b/i,
  // Messaging IDs: platform name next to an id/number/handle hint.
  /\b(?:whatsapp|telegram|signal|wechat|viber|snapchat|discord|skype)\b[^.!?\n]{0,40}\b(?:id|user(?:name)?|number|handle|pin|me|at)\b/i,
];

export function containsContactDetails(content: string): boolean {
  return CONTACT_PATTERNS.some((pattern) => pattern.test(content));
}

/**
 * The 4.6 hold text: plain, and written to a member who is being friendly,
 * not misbehaving.
 */
export const CONTACT_HOLD_EXPLANATION =
  "We have not published this yet, because it looks as though it contains contact details — an email address, a phone number, a handle or a link. Sharing those is a natural, friendly thing to do, but the open space is public to every member and the terms of membership keep contact details out of it (rule 4.6). Take the detail out and your words publish straight away.";

export const CONTACT_HOLD_HUMAN_ROUTE =
  "If we have read this wrongly, or you want to talk it through, a person will look at it with you: open Membership → Talk to us from your account and a named human will reply.";

/* -------------------------------------------------------------------------
 * NEVER-FLAG guard — §11.3 hard constraint. Runs before all judgment flags.
 * ---------------------------------------------------------------------- */

export type NeverFlagCategory =
  | "grief-bereavement"
  | "illness-disability-mental-health"
  | "religion"
  | "sexuality-gender"
  | "political-history-displacement-war"
  | "non-english";

const NEVER_FLAG_TOPICS: ReadonlyArray<{
  readonly category: NeverFlagCategory;
  readonly pattern: RegExp;
}> = [
  {
    category: "grief-bereavement",
    pattern:
      /\b(?:my late (?:husband|wife|partner|son|daughter|mother|father|brother|sister)|widow(?:ed|er)?|bereave\w*|grie(?:f|ving|ve)|passed away|in memory of|funeral|since (?:he|she|they) died|lost my (?:husband|wife|partner|son|daughter|mother|father))\b/i,
  },
  {
    category: "illness-disability-mental-health",
    pattern:
      /\b(?:diagnos\w+|cancer|chemo\w*|remission|multiple sclerosis|parkinson\w*|stroke|wheelchair|walking stick|mobility|disabilit\w+|disabled|chronic (?:pain|illness|fatigue)|mental health|depression|anxiety|ptsd|bipolar|therapy|hearing aid|low vision)\b/i,
  },
  {
    category: "religion",
    pattern:
      /\b(?:faith|prayer|pray(?:ing|s|ed)?|mosque|church|synagogue|temple|gurdwara|ramadan|eid|hajj|umrah|shabbat|sabbath|kosher|halal|lent|easter|christmas eve mass|pilgrim\w*|god|allah|quran|bible|torah|buddh\w+|hindu\w*|sikh\w*|muslim|christian|jewish|catholic|orthodox|quaker)\b/i,
  },
  {
    category: "sexuality-gender",
    pattern:
      /\b(?:gay|lesbian|bisexual|queer|lgbtq?\+?|transgender|trans (?:woman|man)|non-?binary|genderqueer|coming out|came out|my (?:wife and i are both|husband and i are both)|pride)\b/i,
  },
  {
    category: "political-history-displacement-war",
    pattern:
      /\b(?:war|wartime|refugee\w*|displace\w*|exile\w*|fled|asylum|occupation|occupied|siege|revolution|uprising|conscript\w*|checkpoint\w*|dictatorship|martial law|political prisoner)\b/i,
  },
];

/** Letters outside the Latin ranges → another script → not English. */
const NON_LATIN_LETTER =
  new RegExp("[^\\u0000-\\u024F\\u1E00-\\u1EFF\\u2000-\\u206F\\u20A0-\\u20CF]", "u");

const COMMON_ENGLISH_WORDS: ReadonlySet<string> = new Set([
  "the", "and", "a", "an", "i", "to", "of", "in", "is", "it", "my", "we",
  "for", "on", "with", "that", "at", "was", "have", "be", "you", "are",
  "this", "not", "but", "so", "as", "me", "our",
]);

/**
 * Conservative: returns true only when the agent is CONFIDENT the text is
 * English. Any other script, or Latin text without recognisable English
 * function words, is treated as non-English — human review on member report
 * only, never auto-flagged. A Cairo–London club will have Arabic in its open
 * spaces, and moderation models are markedly worse outside English.
 */
export function isConfidentlyEnglish(content: string): boolean {
  if (NON_LATIN_LETTER.test(content)) return false;
  const words = content.toLowerCase().match(/[a-z']+/g);
  if (words === null || words.length === 0) return false;
  const hits = words.filter((word) => COMMON_ENGLISH_WORDS.has(word)).length;
  return hits >= 2;
}

/** The guard itself: the matched category, or null when no protection applies. */
export function neverFlagCategory(content: string): NeverFlagCategory | null {
  if (!isConfidentlyEnglish(content)) return "non-english";
  for (const topic of NEVER_FLAG_TOPICS) {
    if (topic.pattern.test(content)) return topic.category;
  }
  return null;
}

/* -------------------------------------------------------------------------
 * Judgment-based flag heuristics — queue only, never a hold.
 * ---------------------------------------------------------------------- */

const COMMERCIAL_PATTERN =
  /\b(?:%\s?off|discount|special (?:rate|offer)|promo(?:tion| code)?|book (?:through|with|via) me|dm me to (?:book|buy|order)|my (?:company|agency|business|shop|brand|packages?|clients?)|i (?:sell|offer|run) (?:a|my)?\s?(?:tours?|trips?|packages?|retreats?|business|shop|service)|paid (?:tours?|service|partnership)|commission)\b/i;

const THIRD_PARTY_RELATION =
  /\b(?:my|our) (?:ex[- ]?(?:husband|wife|partner)|neighbour|neighbor|colleague|boss|landlord|landlady|doctor|therapist|lawyer|accountant|cleaner|builder)\b/i;
const FULL_NAME = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/;

const LEGAL_PATTERN =
  /\b(?:subpoena|court order|injunction|under investigation|smuggl\w+|traffick\w+|counterfeit|launder\w+|undeclared (?:cash|goods)|threat(?:en\w*)? (?:to|of)|restraining order)\b/i;

function judgmentFlags(
  content: string,
  now: Date,
  policy: ModerationPolicy,
): Flag[] {
  const flags: Flag[] = [];
  if (COMMERCIAL_PATTERN.test(content)) {
    flags.push(createFlag("commercial-solicitation", now, policy));
  }
  if (THIRD_PARTY_RELATION.test(content) && FULL_NAME.test(content)) {
    flags.push(createFlag("third-party-identification", now, policy));
  }
  if (LEGAL_PATTERN.test(content)) {
    flags.push(createFlag("legal-obligation", now, policy));
  }
  return flags;
}

/* -------------------------------------------------------------------------
 * The agent.
 * ---------------------------------------------------------------------- */

export function reviewOpenSpaceContent(
  content: string,
  context: AgentVisibleMemberContext,
  policy: ModerationPolicy,
  now: Date = new Date(),
): ModerationOutcome {
  // §11.1 — the agent never sees hidden-profile fields.
  assertAgentBlind(context);

  // Rule 4.6 — the one permitted hold. Pattern-matching, not judgment, so it
  // applies in any language; always with an explanation and a human route.
  if (containsContactDetails(content)) {
    return {
      published: false,
      held: true,
      explanation: CONTACT_HOLD_EXPLANATION,
      humanRoute: CONTACT_HOLD_HUMAN_ROUTE,
      flag: createFlag("contact-details", now, policy),
    };
  }

  // §11.3 NEVER-FLAG guard — short-circuits every judgment-based flag.
  if (neverFlagCategory(content) !== null) {
    return { published: true, held: false, flags: [] };
  }

  // Judgment heuristics — flags go to a human queue; content is published.
  return { published: true, held: false, flags: judgmentFlags(content, now, policy) };
}

/**
 * §11.1 — every decision is logged, uncommitted until a human acts on it.
 */
export function moderationDecisionEntry(
  content: string,
  context: AgentVisibleMemberContext,
  outcome: ModerationOutcome,
  timestamp?: string,
): NotYetCommittedAgentDecision {
  const ruleFired = outcome.held
    ? "4.6-contact-details-hold"
    : outcome.flags.length > 0
      ? `flags:${outcome.flags.map((flag) => flag.reason).join(",")}`
      : "published-no-flags";
  return createDecisionEntry({
    agent: "moderation",
    input: { memberRef: context.memberRef, content },
    output: outcome,
    ruleFired,
    timestamp,
  });
}
