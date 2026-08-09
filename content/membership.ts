import {
  TO_BE_CONFIRMED,
  type MembershipPromise,
  type MembershipTier,
  type PageHero,
  type StatusedText,
} from "@/lib/types";

const placeholderDescription = (note: string): StatusedText => ({
  text: TO_BE_CONFIRMED,
  contentStatus: "PLACEHOLDER",
  contentNote: note,
});

export const membershipPromises = [
  {
    id: "host-who-knows-you",
    number: "01",
    title: {
      text: "A host who knows you",
      contentStatus: "DRAFT",
      contentNote: "Visual-manual specimen heading; founder approval required.",
    },
    description: placeholderDescription(
      "Founder-approved membership promise detail is required; no benefit claim has been inferred.",
    ),
    contentStatus: "DRAFT",
  },
  {
    id: "journeys-worth-taking",
    number: "02",
    title: {
      text: "Journeys worth taking",
      contentStatus: "DRAFT",
      contentNote: "Visual-manual specimen heading; founder approval required.",
    },
    description: placeholderDescription(
      "Founder-approved membership promise detail is required; no benefit claim has been inferred.",
    ),
    contentStatus: "DRAFT",
  },
  {
    id: "held-always",
    number: "03",
    title: {
      text: "Held, always",
      contentStatus: "DRAFT",
      contentNote: "Visual-manual specimen heading; founder approval required.",
    },
    description: placeholderDescription(
      "Founder-approved and verified mechanism copy is required before this promise can be published as a claim.",
    ),
    contentStatus: "DRAFT",
  },
  {
    id: "club-not-crowd",
    number: "04",
    title: {
      text: "A club, not a crowd",
      contentStatus: "DRAFT",
      contentNote: "Visual-manual specimen heading; founder approval required.",
    },
    description: placeholderDescription(
      "Founder-approved membership promise detail is required; no benefit claim has been inferred.",
    ),
    contentStatus: "DRAFT",
  },
] as const satisfies readonly MembershipPromise[];

export const membershipTiers = [
  {
    id: "member",
    name: "Member",
    priceLabel: TO_BE_CONFIRMED,
    summary: placeholderDescription(
      "Founder-approved Member tier description is required.",
    ),
    benefits: [
      placeholderDescription(
        "Founder-approved Member tier benefits are required; no benefit has been inferred.",
      ),
    ],
    action: {
      label: "Register your interest",
      href: "/register-interest",
      style: "primary",
      contentStatus: "LOCKED",
    },
    contentStatus: "DRAFT",
    contentNote:
      "Tier name is a visual-manual specimen. Price and benefits are placeholders.",
  },
  {
    id: "household",
    name: "Household",
    priceLabel: TO_BE_CONFIRMED,
    summary: placeholderDescription(
      "Founder-approved Household tier description is required.",
    ),
    benefits: [
      placeholderDescription(
        "Founder-approved Household tier benefits are required; no benefit has been inferred.",
      ),
    ],
    action: {
      label: "Register your interest",
      href: "/register-interest",
      style: "primary",
      contentStatus: "LOCKED",
    },
    contentStatus: "DRAFT",
    contentNote:
      "Tier name is a visual-manual specimen. Price and benefits are placeholders.",
  },
] as const satisfies readonly MembershipTier[];

/**
 * §5 — invitation. The founding door, allocation, sponsor accountability,
 * removal and appeal. Values that are §13 tokens are carried as token names
 * and rendered through specToken() only.
 */
export const invitationModel = {
  heading: "By invitation",
  founding:
    "For the first six months, invitations come from an existing member or from Sawayatra itself. Membership for that founding cohort is free — waived for life, and the waiver is stated in the invitation letter itself, not announced later.",
  houseDoor:
    "The house door stays permanently open: a worthy applicant with no connection into the club is never structurally excluded.",
  allocationToken: "INVITES_PER_MEMBER",
  allocationLine:
    "Each founding member holds a small, fixed number of invitations. Scarce invitation rights are what keep a vouch meaning something.",
  sponsorship:
    "Every invitation carries its sponsor's name permanently in the hidden record. If an invited member is removed for conduct, the sponsor's remaining allocation is suspended and reviewed.",
  removal:
    "Removal requires a written reason from a documented list of grounds, and every removed member has a stated appeal route to a named human.",
} as const;

/**
 * §8 — money. Three charges, three moments, each shown separately. All
 * tokens. There is no tier table on any surface until the §8 tokens are
 * filled (build command §3.F).
 */
export const membershipMoney = {
  heading: "Three charges, three moments, each its own line.",
  lines: [
    {
      id: "joining",
      name: "Joining",
      token: "JOINING_FEE",
      detail:
        "One time, at membership, fully credited against your first booked section — a member who travels effectively never pays it. Waived for life for the founding cohort.",
    },
    {
      id: "service-charge",
      name: "Group formation service charge",
      token: "SERVICE_CHARGE",
      detail:
        "Flat, per person, per section, at checkout. Its own line, never absorbed into the band price.",
    },
    {
      id: "household",
      name: "Household (optional)",
      token: "HOUSEHOLD_FEE",
      detail:
        "If a recurring line is ever wanted: additional passports under one household, first-look windows, companion rights — offered to members who already travel, never as the price of entry.",
    },
  ],
  /** §8.4 — nothing appears at the last step that was not visible at the second. */
  checkoutOrder: [
    "Journey and dates",
    "Today's per-person price, with the floor beside it",
    "When the price settles",
    "Upgrades",
    "Group formation service charge",
    "Joining credit applied",
    "Identity check",
    "Total",
  ],
} as const;

export const membershipContent = {
  hero: {
    eyebrow: "Membership",
    title: "A small, vetted club, and a host who knows you.",
    primaryAction: {
      label: "Register your interest",
      href: "/register-interest",
      style: "primary",
      contentStatus: "LOCKED",
    },
    contentStatus: "LOCKED",
  } satisfies PageHero,
  heroAccentWord: "knows you.",
  promisesEyebrow: "What you're actually joining",
  promises: membershipPromises,
  selectivityHeading: "Membership selectivity",
  selectivityExplanation: {
    text: "We'd rather grow slowly and keep the room right than fill it fast.",
    contentStatus: "DRAFT",
    contentNote: "Visual-manual specimen copy; founder approval required.",
  },
  tiersHeading: "Membership options",
  tiers: membershipTiers,
  pricesNotice: "Prices are To be confirmed.",
  faqHeading: "Questions, answered",
  contentStatus: "DRAFT",
  contentNote:
    "Hero and action are locked. Promise details, tier details, prices and FAQs remain unapproved.",
} as const;
