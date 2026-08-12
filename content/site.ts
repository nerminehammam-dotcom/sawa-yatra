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
  home:
    "One annual caravan through Peru, Bolivia and Chile. Join at a designated point and leave when your part of the route is complete.",
  caravans:
    "Explore Sawayatra caravans, beginning with the annual Andean Caravan through Peru, Bolivia and Chile.",
  "caravans-andean":
    "Explore the Andean Caravan and its four connected route sections through Peru, Bolivia and Chile.",
  "caravans-route-map":
    "Read the complete Andean Caravan route in order, with its sections, transport modes, joining gates and short-form exception.",
  // Moved verbatim from the inline `metadata` object that previously shipped on
  // app/(public)/caravans/andean-caravan/how-it-works/page.tsx. Not new copy.
  "hop-on-hop-off":
    "Choose where to join and leave the Andean Caravan, one continuous section at a time.",
  "who-else-is-travelling":
    "Privacy-safe group signals will appear only when registrations are numerous enough to be useful, without naming individual members.",
  "andean-caravan":
    "Follow the complete Andean Caravan route through Peru, Bolivia, the Atacama and the Carretera Austral.",
  /*
   * Added 6 August 2026. Both pages carried placeholder descriptions, and
   * createPageMetadata marks any such route noIndex while sitemap.ts drops it,
   * so How Sawayatra works and Meet your Travel Self could not be found in
   * search at all. Meet your Travel Self is the one thing no competitor has.
   *
   * Each sentence is condensed from what the page already says, not written
   * fresh: /how-it-works opens "Browse journeys openly. Connect
   * privately. Nothing is revealed until the interest is mutual." and
   * /travel-self opens "One of sixteen travelling selves. Eight short
   * questions reveal which one is yours: how you travel, and what you travel
   * for." Both are marked DRAFT rather than LOCKED, pending approval.
   */
  "how-it-works":
    "Browse journeys openly and connect privately. Nothing is revealed until the interest is mutual.",
  "travel-self":
    "Sawayatra matches travellers by how they travel, not by where they are going. Eight short questions reveal which of sixteen travelling selves is yours.",
  "joining-points":
    "Compare the designated places where travellers can enter and leave the Andean Caravan.",
  "do-it-yourself":
    "Create your own Sawayatra journey. The Do It Yourself experience is coming later.",
  departures:
    "The Andean Caravan moves through Peru, Bolivia and Chile. Join one of four consecutive sections, connect several, or travel the complete 71-day route.",
  "departure-dates":
    "Browse Sawayatra journeys by departure date when confirmed dates become available.",
  journeys:
    "Every Sawayatra journey in one place: those leaving on a date, and those still forming. Who stands behind each one is on the card.",
  "journeys-caravans":
    "Explore Sawayatra caravans, beginning with the annual Andean Caravan through Peru, Bolivia and Chile.",
  "journeys-andean-caravan":
    "Explore the Andean Caravan and its four connected route sections through Peru, Bolivia and Chile.",
  "journeys-caravans-route-map":
    "Read the complete Andean Caravan route in order, with its sections, transport modes, joining gates and short-form exception.",
  "journeys-caravans-joining-points":
    "Choose where to join and leave the Andean Caravan, one continuous section at a time.",
  "journeys-egyptian-caravan":
    "The Egyptian Caravan is in development. Its route, dates and sections are not published yet.",
  "create-your-own-journey":
    "Create your own journey is in development and will open when the structure is ready.",
  members:
    "Learn how Sawayatra membership keeps introductions considered and the travelling room small.",
  "who-we-are":
    "Meet the thinking behind Sawayatra and the practical principles that shape every journey.",
  partners:
    "Sawayatra partner information is being prepared and will be added when it is ready.",
  "register-interest":
    "Registration of interest is being prepared and will open when the process is ready.",
  contact:
    "Ask Sawayatra about membership, the Andean Caravan, a journey section or how the club works.",
  journey:
    "Explore the complete Andean Caravan and its four connected sections through Peru, Bolivia and Chile.",
  // Added 7 August 2026 — these three routes were falling through to an
  // auto-generated "PLACEHOLDER: Founder-approved … meta description" string,
  // which shipped that scaffolding to search engines and social cards.
  "sign-in":
    "Member access opens in stages and is not active yet. Register your interest and Sawayatra will write to you first.",
  "request-invitation":
    "Invitations open when membership does. Register your interest and Sawayatra will write to you first — no account, no payment.",
  "not-found":
    "This page could not be found. Return to Sawayatra and pick the road back up from the Andean Caravan or your Travel Self.",
  privacy:
    "Sawayatra's privacy policy is being prepared and professionally reviewed, and will be published before any personal information is collected.",
  terms:
    "Sawayatra's terms are being prepared and will be published before any booking or payment is possible.",
  accessibility:
    "Sawayatra's accessibility statement is being finalised. The site is built with WCAG 2.2 AA as the standard.",
} as const;

export const routeMetadata = ([
  ["home", "/", "Sawayatra | One caravan. One long route."],
  ["caravans", "/caravans", "Caravans | Sawayatra"],
  ["caravans-andean", "/caravans/andean", "The Andean Caravan | Sawayatra"],
  [
    "caravans-route-map",
    "/caravans/andean/route-map",
    "Andean Caravan route, in order | Sawayatra",
  ],
  [
    "hop-on-hop-off",
    "/caravans/andean-caravan/how-it-works",
    "Joining and leaving the Andean Caravan | Sawayatra",
  ],
  [
    "who-else-is-travelling",
    "/caravans/who-else-is-travelling",
    "Meet the travelling group | Sawayatra",
  ],
  [
    "andean-caravan",
    "/caravans/the-andean-caravan",
    "The Andean Caravan | Sawayatra",
  ],
  ["joining-points", "/joining-points", "Joining points | Sawayatra"],
  ["how-it-works", "/how-it-works", "How it works | Sawayatra"],
  ["travel-self", "/travel-self", "Meet your Travel Self | Sawayatra"],
  ["travel-self-take", "/travel-self/take", "Take the Travel Self | Sawayatra"],
  ["club", "/club", "The Club | Sawayatra"],
  ["club-apply", "/club/apply", "Apply to the club | Sawayatra"],
  ["do-it-yourself", "/do-it-yourself", "Do It Yourself | Sawayatra"],
  ["departures", "/departures", "Departures | Sawayatra"],
  ["departure-dates", "/departure-dates", "Browse by departure date | Sawayatra"],
  ["journeys", "/journeys", "Journeys | Sawayatra"],
  ["journeys-caravans", "/journeys/caravans", "Caravans | Sawayatra"],
  [
    "journeys-andean-caravan",
    "/journeys/caravans/andean-caravan",
    "The Andean Caravan | Sawayatra",
  ],
  [
    "journeys-caravans-route-map",
    "/journeys/caravans/andean-caravan/route-map",
    "Andean Caravan route, in order | Sawayatra",
  ],
  [
    "journeys-caravans-joining-points",
    "/journeys/caravans/andean-caravan/joining-points",
    "Joining and leaving the Andean Caravan | Sawayatra",
  ],
  [
    "journeys-egyptian-caravan",
    "/journeys/caravans/egyptian-caravan",
    "The Egyptian Caravan | Sawayatra",
  ],
  [
    "create-your-own-journey",
    "/create-your-own-journey",
    "Create your own journey | Sawayatra",
  ],
  ["journey", "/departures/[slug]", "Journey | Sawayatra"],
  ["membership", "/membership", "Membership | Sawayatra"],
  ["members", "/members", "Members | Sawayatra"],
  ["about", "/about", "About | Sawayatra"],
  ["who-we-are", "/who-we-are", "Who we are | Sawayatra"],
  ["partners", "/partners", "Our partners | Sawayatra"],
  ["contact", "/contact", "Ask a question | Sawayatra"],
  [
    "register-interest",
    "/register-interest",
    "Register your interest | Sawayatra",
  ],
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
      : `PLACEHOLDER: Founder-approved ${id} meta description to be supplied.`,
  descriptionStatus:
    id in approvedRouteDescriptions ? "LOCKED" : "PLACEHOLDER",
  canonicalPath: path,
  noIndex:
    id === "do-it-yourself" ||
    id === "sign-in" ||
    id === "not-found" ||
    id === "who-else-is-travelling" ||
    id === "departure-dates" ||
    id === "create-your-own-journey" ||
    id === "journeys-egyptian-caravan" ||
    id === "partners" ||
    id === "register-interest" ||
    // Added 7 August 2026: these carry honest holding copy now, not final
    // content, so they stay out of search and the sitemap until the real
    // policies land (privacy/terms/accessibility) or membership opens
    // (request-invitation). Previously excluded via a PLACEHOLDER description;
    // now that they have real descriptions, noIndex is what keeps them out.
    id === "privacy" ||
    id === "terms" ||
    id === "accessibility" ||
    id === "request-invitation"
      ? true
      : undefined,
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
    lead: "Good travel isn't about going with anyone. It's about going with the right people, found for you, and introduced only when it's mutual.",
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
        body: "Not a form. A conversation. Your pace, your mornings, your non-negotiables. How you move, not where you've been.",
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
    title: "One journey through the Andes. Four sections to join.",
    action: {
      label: "Explore the Andean Caravan",
      href: "/journeys/caravans/andean-caravan",
      style: "secondary",
      contentStatus: "LOCKED",
    },
    contentStatus: "LOCKED",
  },
  membershipBand: {
    eyebrow: "Membership",
    title: "A small, vetted club, and a host who knows you.",
    safetyMechanismLine: "DRAFT / PLACEHOLDER: Verified mechanism copy to be supplied.",
    action: {
      label: "Register your interest",
      href: "/register-interest",
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
    lead: "No search bar, no swiping, no strangers to sift through. You tell us how you travel, and the host quietly finds the people you'd be glad to meet.",
    contentStatus: "DRAFT",
  },
  stepsEyebrow: "The mechanism",
  stepsHeading: "Four plain steps.",
  steps: [
    {
      id: "tell-us",
      number: "01",
      title: "Tell us how you travel",
      body: "Not a form. A conversation. Your pace, your mornings, your non-negotiables. How you move, not where you've been.",
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
      body: "We share Travel Selves, not names. Only when everyone says yes do we make the introduction, Travel Self first, then names.",
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
    title: "Two ways to travel",
    items: [
      {
        id: "caravan-join",
        title: "Caravan / Join",
        body: "Join one of four consecutive sections, combine several, or travel the complete 71-day Andean Caravan.",
        highlighted: true,
        contentStatus: "LOCKED",
      },
      {
        id: "create",
        title: "Create",
        body: TO_BE_CONFIRMED,
        highlighted: false,
        contentStatus: "PLACEHOLDER",
      },
    ],
    contentStatus: "DRAFT",
  },
  mechanisms: {
    eyebrow: "How we keep you held",
    title: "Mechanisms, never guarantees.",
    items: [
      {
        id: "verified-mechanism-placeholder",
        title: "DRAFT / PLACEHOLDER: Verified mechanism to be supplied.",
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
    label: "Register your interest",
    href: "/register-interest",
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

// departuresPageContent (filter labels, empty states) was removed with the
// DepartureFilters cleanup: it was orphaned copy, and filter vocabulary is
// exactly the category rule 4.4 of the membership spec wants kept thin.

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
  tablePrivacyLine: "Travel Selves only, never member names or photographs.",
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
    lead: "That the best part of any journey was never the place. It was the company, and that finding the right company shouldn't be left to luck.",
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
      title: `PLACEHOLDER: Founder-approved value ${index + 1} to be supplied.`,
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
  closingLine: "The table's set, come find your seat.",
  action: {
    label: "Register your interest",
    href: "/register-interest",
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
    label: "Register your interest",
    href: "/register-interest",
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
  // Holding copy, 7 August 2026. The page previously showed a PLACEHOLDER lead
  // and an invitation form whose consent checkbox declared itself "not final
  // legal consent" while collecting name, email and country. Collecting
  // personal data behind a self-described non-consent box, before a reviewed
  // privacy policy exists, is a live compliance risk — so the form is removed
  // until the policy is ready and this points to the email-only interest
  // capture instead. Restore the form once consent wording is approved.
  lead: "Invitations open when membership does. In the meantime, register your interest and we will write to you first — no account, no payment, nothing to commit.",
  form: invitationRequestFormContent,
  contentStatus: "DRAFT",
  contentNote: "Consent and follow-up copy require approval before launch.",
} as const;
