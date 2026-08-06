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
      label: "Request an invitation",
      href: "/request-invitation",
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
      label: "Request an invitation",
      href: "/request-invitation",
      style: "primary",
      contentStatus: "LOCKED",
    },
    contentStatus: "DRAFT",
    contentNote:
      "Tier name is a visual-manual specimen. Price and benefits are placeholders.",
  },
] as const satisfies readonly MembershipTier[];

export const membershipContent = {
  hero: {
    eyebrow: "Membership",
    title: "A small, vetted club, and a host who knows you.",
    primaryAction: {
      label: "Request an invitation",
      href: "/request-invitation",
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
