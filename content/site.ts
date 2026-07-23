import {
  invitationRequestFormContent,
  journeyInterestFormContent,
  signInInterestFormContent,
} from "@/content/forms";
import {
  TO_BE_CONFIRMED,
  type JourneyStatus,
  type RouteMetadataEntry,
} from "@/lib/types";

export const siteConfig = {
  name: "Sawayatra",
  temporaryWordmark: "Sawayatra",
  descriptor: "A members' travel club",
  tagline: "Held, but grinning.",
  pronunciation: "sa·wa·ya·tra",
  siteUrl: TO_BE_CONFIRMED,
  defaultSocialAssetId: "social-fallback",
  contentStatus: "LOCKED",
  contentNote:
    "The site URL, final logo and launch social asset remain placeholders.",
} as const;

const approvedRouteDescriptions = {
  departures:
    "The Andean Caravan moves through Peru, Bolivia and Chile. Join one of nine consecutive sections, connect several, or travel the complete 71-day route.",
  journey:
    "Explore the complete Andean Caravan and its nine bookable sections through Peru, Bolivia and Chile.",
} as const;

export const routeMetadata = ([
  ["home", "/", "Sawayatra | Go alone, arrive together."],
  ["how-it-works", "/how-it-works", "How it works | Sawayatra"],
  ["travel-self", "/travel-self", "Meet your Travel Self | Sawayatra"],
  ["departures", "/departures", "Departures | Sawayatra"],
  ["journey", "/departures/[slug]", "Journey | Sawayatra"],
  ["membership", "/membership", "Membership | Sawayatra"],
  ["about", "/about", "About | Sawayatra"],
  ["sign-in", "/sign-in", "Member access | Sawayatra"],
  ["request-invitation", "/request-invitation", "Request an invitation | Sawayatra"],
  ["privacy", "/privacy", "Privacy | Sawayatra"],
  ["terms", "/terms", "Terms | Sawayatra"],
  ["accessibility", "/accessibility", "Accessibility | Sawayatra"],
  ["not-found", "/404", "Page not found | Sawayatra"],
] as const).map(([id, path, title]) => ({
  id,
  path,
  title,
  description:
    id in approvedRouteDescriptions
      ? approvedRouteDescriptions[
          id as keyof typeof approvedRouteDescriptions
        ]
      : `PLACEHOLDER — Founder-approved ${id} meta description to be supplied.`,
  descriptionStatus:
    id in approvedRouteDescriptions ? "LOCKED" : "PLACEHOLDER",
  canonicalPath: path,
  noIndex: id === "sign-in" || id === "not-found" ? true : undefined,
  contentStatus: "LOCKED",
  contentNote: "Title follows the locked route map; description remains a placeholder.",
})) as readonly RouteMetadataEntry[];

export const routeMetadataByPath = Object.fromEntries(
  routeMetadata.map((entry) => [entry.path, entry]),
) as Readonly<Record<RouteMetadataEntry["path"], RouteMetadataEntry>>;

export const homeContent = {
  hero: {
    eyebrow: "A members' travel club",
    title: "Go alone, arrive together.",
    accentWord: "arrive",
    lead: "Good travel isn't about going with anyone. It's about going with the right people — found for you, and introduced only when it's mutual.",
    primaryAction: {
      label: "Meet your Travel Self",
      href: "/travel-self",
      style: "primary",
      contentStatus: "LOCKED",
    },
    secondaryAction: {
      label: "How it works",
      href: "/how-it-works",
      style: "secondary",
      contentStatus: "LOCKED",
    },
    assetId: "home-hero",
    contentStatus: "LOCKED",
  },
  positioning: {
    eyebrow: "The Sawayatra way",
    title: "People don't dislike small groups. They dislike random groups.",
    pillars: [
      {
        id: "person-centre",
        title: "The person is the centre",
        body: TO_BE_CONFIRMED,
        contentStatus: "PLACEHOLDER",
      },
      {
        id: "trip-meeting",
        title: "The trip is the meeting",
        body: TO_BE_CONFIRMED,
        contentStatus: "PLACEHOLDER",
      },
      {
        id: "host-room",
        title: "The host is in the room",
        body: TO_BE_CONFIRMED,
        contentStatus: "PLACEHOLDER",
      },
    ],
    contentStatus: "LOCKED",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "You do the travelling. We do the looking.",
    steps: [
      {
        id: "tell-us",
        number: "01",
        title: "Tell us how you travel",
        body: "Not a form — a conversation. Your pace, your mornings, your non-negotiables. How you move, not where you've been.",
        contentStatus: "DRAFT",
      },
      {
        id: "find-people",
        number: "02",
        title: "We find your people",
        body: "The host recognises who'd travel beautifully with you, and reaches out privately when a journey feels like yours.",
        contentStatus: "DRAFT",
      },
      {
        id: "arrive-together",
        number: "03",
        title: "Arrive together",
        body: "You went alone; you arrive among your people.",
        contentStatus: "DRAFT",
      },
    ],
    action: {
      label: "How it works",
      href: "/how-it-works",
      style: "secondary",
      contentStatus: "LOCKED",
    },
    contentStatus: "DRAFT",
  },
  travelSelfHook: {
    eyebrow: "Meet your Travel Self",
    title: "You're not a demographic. You're a way of travelling.",
    body: "Six honest questions. About two minutes.",
    action: {
      label: "Begin the taster",
      href: "/travel-self",
      style: "primary",
      contentStatus: "DRAFT",
    },
    contentStatus: "DRAFT",
  },
  departuresPreview: {
    eyebrow: "Departures",
    title: "One journey through the Andes. Nine ways to join it.",
    action: {
      label: "Explore the Andean Caravan",
      href: "/departures",
      style: "secondary",
      contentStatus: "LOCKED",
    },
    contentStatus: "LOCKED",
  },
  membershipBand: {
    eyebrow: "Membership",
    title: "A small, vetted club — and a host who knows you.",
    safetyMechanismLine: "DRAFT / PLACEHOLDER — Verified mechanism copy to be supplied.",
    action: {
      label: "Request an invitation",
      href: "/request-invitation",
      style: "primary",
      contentStatus: "LOCKED",
    },
    contentStatus: "DRAFT",
  },
} as const;

export const howItWorksContent = {
  hero: {
    eyebrow: "How it works",
    title: "You do the travelling. We do the looking.",
    accentWord: "looking.",
    lead: "No search bar, no swiping, no strangers to sift through. You tell us how you travel — and the host quietly finds the people you'd be glad to meet.",
    contentStatus: "DRAFT",
  },
  stepsEyebrow: "The mechanism",
  stepsHeading: "Four plain steps.",
  steps: [
    {
      id: "tell-us",
      number: "01",
      title: "Tell us how you travel",
      body: "Not a form — a conversation. Your pace, your mornings, your non-negotiables. How you move, not where you've been.",
      contentStatus: "DRAFT",
    },
    {
      id: "find-people",
      number: "02",
      title: "We find your people",
      body: "The host recognises who'd travel beautifully with you, and reaches out privately when a journey feels like yours.",
      contentStatus: "DRAFT",
    },
    {
      id: "everyone-says-yes",
      number: "03",
      title: "Everyone says yes first",
      body: "We share Travel Selves, not names. Only when everyone says yes do we make the introduction — Travel Self first, then names.",
      contentStatus: "DRAFT",
      contentNote: "Publish only after this operating mechanism is verified.",
    },
    {
      id: "arrive-together",
      number: "04",
      title: "Arrive together",
      body: "Co-created with people chosen with care, operated to a private-trip standard. You went alone; you arrive among your people.",
      contentStatus: "DRAFT",
      contentNote: "Publish only after the operating claim is verified.",
    },
  ],
  waysToTravel: {
    title: "Three ways to travel",
    items: ["Join", "Match", "Create"].map((title) => ({
      id: title.toLowerCase(),
      title,
      body: TO_BE_CONFIRMED,
      highlighted: title === "Match",
      contentStatus: "PLACEHOLDER",
    })),
    contentStatus: "PLACEHOLDER",
  },
  mechanisms: {
    eyebrow: "How we keep you held",
    title: "Mechanisms, never guarantees.",
    items: [
      {
        id: "verified-mechanism-placeholder",
        title: "DRAFT / PLACEHOLDER — Verified mechanism to be supplied.",
        body: TO_BE_CONFIRMED,
        contentStatus: "PLACEHOLDER",
      },
    ],
    contentStatus: "DRAFT",
  },
  action: {
    label: "Meet your Travel Self",
    href: "/travel-self",
    style: "primary",
    contentStatus: "LOCKED",
  },
} as const;

export const travelSelfPageContent = {
  title: "Meet your Travel Self",
  saveNotice:
    "You can take the draft taster without an account. Saving or continuing requires an invitation request or member access.",
  requestAction: {
    label: "Request an invitation",
    href: "/request-invitation",
    style: "primary",
    contentStatus: "LOCKED",
  },
  signInAction: {
    label: "Sign in",
    href: "/sign-in",
    style: "secondary",
    contentStatus: "LOCKED",
  },
  contentStatus: "DRAFT",
} as const;

export const departuresPageContent = {
  eyebrow: "Departures",
  title: "One journey through the Andes. Nine ways to join it.",
  browseRegionLabel: "Explore the complete Caravan and its nine sections",
  filterLabel: "Choose where to join",
  allFilterLabel: "All sections",
  resultSummary: {
    singularNoun: "journey",
    pluralNoun: "journeys",
    filteredJoiner: "for",
  },
  cardUnits: {
    daySingular: "day",
    dayPlural: "days",
    travellerSingular: "traveller",
    travellerPlural: "travellers",
  },
  draftDataNotice:
    "February–April 2028 · exact dates announced when the route is secured.",
  emptyState: {
    title: "No journeys match those filters.",
    body: "Clear the filters or meet your Travel Self to try another way in.",
    clearActionLabel: "Clear filters",
    travelSelfAction: {
      label: "Meet your Travel Self",
      href: "/travel-self",
      style: "secondary",
      contentStatus: "LOCKED",
    },
  },
  contentStatus: "DRAFT",
} as const;

export const journeyDetailContent = {
  breadcrumbLabel: "Departures",
  summaryLabel: "Journey summary",
  factEyebrow: "Journey details",
  tableEyebrow: "Travel Selves only",
  statusLabelPrefix: "Status",
  demoDataPrefix: "Demo data",
  exactDatesPrefix: "Exact dates",
  units: {
    daySingular: "day",
    dayPlural: "days",
    travellerSingular: "traveller",
    travellerPlural: "travellers",
  },
  factLabels: {
    dates: "Dates",
    duration: "Duration",
    group: "Group",
    seats: "Seats",
    pace: "Pace",
    price: "Price",
  },
  statusLabels: {
    forming: "Forming",
    confirmed: "Confirmed",
    full: "Full",
    closed: "Closed",
  } satisfies Record<JourneyStatus, string>,
  sectionLabels: {
    story: "The journey",
    facts: "The facts",
    table: "Who's at this table",
    days: "The shape of the days",
    held: "What is held",
    included: "What is included",
  },
  tablePrivacyLine: "Travel Selves only — never member names or photographs.",
  tablePlaceholder: "To be confirmed",
  tablePlaceholderNote:
    "Travel Self details for this demo journey have not been supplied.",
  primaryActionLabel: journeyInterestFormContent.actionLabel,
  interestForm: {
    ...journeyInterestFormContent,
    title: journeyInterestFormContent.actionLabel,
    contentStatus: "DRAFT",
    contentNote: "Consent wording requires legal review before launch.",
  },
  contentStatus: "DRAFT",
} as const;

export const aboutContent = {
  hero: {
    eyebrow: "About",
    title: "We started with a simple, stubborn idea.",
    accentWord: "idea.",
    lead: "That the best part of any journey was never the place. It was the company — and that finding the right company shouldn't be left to luck.",
    assetId: "about-founder",
    contentStatus: "DRAFT",
  },
  belief:
    "Demographics tell you almost nothing about whether two people will travel well together. How someone travels tells you nearly everything.",
  founder: {
    eyebrow: "Founder story",
    nameLabel: "Founder name",
    signatureLabel: "Founder signature",
    name: TO_BE_CONFIRMED,
    portraitAssetId: "about-founder",
    signature: TO_BE_CONFIRMED,
    story: [TO_BE_CONFIRMED],
    contentStatus: "PLACEHOLDER",
  },
  beliefSection: {
    eyebrow: "The belief",
    title: "Why the existing options fail.",
    contentStatus: "DRAFT",
  },
  hostRole: {
    title: "The host is in the room",
    body: TO_BE_CONFIRMED,
    contentStatus: "PLACEHOLDER",
  },
  valuesHeading: "The things that won't change",
  values: [
    ...Array.from({ length: 5 }, (_, index) => ({
      id: `value-placeholder-${index + 1}`,
      title: `PLACEHOLDER — Founder-approved value ${index + 1} to be supplied.`,
      body: TO_BE_CONFIRMED,
      contentStatus: "PLACEHOLDER" as const,
    })),
    {
      id: "real-before-scale",
      title: "Real before scale.",
      body: TO_BE_CONFIRMED,
      contentStatus: "PLACEHOLDER",
      contentNote: "Value name is locked; founder-approved explanation is required.",
    },
  ],
  closingLine: "The table's set — come find your seat.",
  action: {
    label: "Request an invitation",
    href: "/request-invitation",
    style: "primary",
    contentStatus: "LOCKED",
  },
  contentStatus: "DRAFT",
} as const;

export const signInContent = {
  eyebrow: "Member access",
  title: "Member access is opening in stages.",
  body: "Authentication is not active in Release 1.",
  interestForm: signInInterestFormContent,
  requestAction: {
    label: "Request an invitation",
    href: "/request-invitation",
    style: "secondary",
    contentStatus: "LOCKED",
  },
  homeAction: {
    label: "Return home",
    href: "/",
    style: "secondary",
    contentStatus: "LOCKED",
  },
  contentStatus: "LOCKED",
} as const;

export const requestInvitationContent = {
  eyebrow: "Membership",
  title: "Request an invitation",
  lead: "PLACEHOLDER — Founder-approved invitation-request introduction to be supplied.",
  form: invitationRequestFormContent,
  contentStatus: "DRAFT",
  contentNote: "Consent and follow-up copy require approval before launch.",
} as const;
