/**
 * Approved club-first copy and publication gates.
 *
 * The source brief deliberately separates approved language from operational
 * truth. Copy in `blockedOperationalCopy` remains available to the project but
 * must not be rendered as a current mechanism until the named evidence exists.
 */

export const whatSawayatraIs = {
  definition:
    "Sawayatra is an invitation-only members’ club for slow overland journeys beyond the usual tourist circuit. It brings together independent-minded travellers who seek depth rather than destination collecting, and compatible company without the arbitrariness of conventional group travel.",
  reason:
    "The club exists to help members undertake journeys that might otherwise feel too unfamiliar, complex or remote to attempt alone. Adventure should belong to the road, not to uncertainty about who you are travelling with, who is responsible or what support exists.",
  currentStatus:
    "Applications, bookings and payments are not yet open. Published journey material makes route conditions and demands visible, but it does not guarantee safety or compatibility.",
} as const;
export const joiningCopy = {
  status:
    "The joining model is set out below. Applications are not yet accepted online while privacy and consent wording is completed.",
  paragraphs: [
    "Membership begins with an invitation from the founders or a nomination from an existing member. An invitation or nomination opens the application; it does not guarantee admission.",
    "Prospective members complete their Travel Self and submit a request for admission. Once admitted, they belong to the club, not merely to one journey.",
    "Membership gives access to the club, but not automatic acceptance onto every departure. Each journey states any particular physical, practical, medical, experience or documentation requirements.",
    "Where members do not already know one another, Travel Self helps form the travelling company. Identities are disclosed only after mutual interest.",
  ],
  travelSelfLimit:
    "Travel Self supports consideration of compatibility. It is not a medical, behavioural or safety assessment, and it cannot guarantee that people will travel well together.",
} as const;

export const journeyStructures = [
  {
    id: "caravan",
    title: "Caravans",
    body:
      "Long, continuous overland routes travelled over an extended period. Members may join and leave at designated gates.",
  },
  {
    id: "standalone",
    title: "Standalone journeys",
    body: "Complete journeys with their own beginning and end.",
  },
] as const;

export const farmJourney = {
  title: "Farm journeys",
  body:
    "Time spent on working land, where the day is shaped by what the season asks rather than by a conventional itinerary.",
  modelNote:
    "A farm journey is a setting, not a structure. It may be a standalone journey or form part of a larger route.",
} as const;

export const waysMembersTravel = [
  {
    number: "01",
    title: "Join a published departure",
    body: "Ask to join a published departure that is open to members.",
  },
  {
    number: "02",
    title: "Travel privately",
    body:
      "Ask Sawayatra to shape a private journey for a family, friends, an institution or another company that already knows itself.",
  },
  {
    number: "03",
    title: "Propose a road",
    body:
      "Propose a road you wish to travel and invite interest from compatible members.",
  },
] as const;

export const sponsoredGuestDraft =
  "Sponsored guests complete the journey’s suitability and conduct process, but do not become club members or gain access to the member layer.";

export const journeyOrigins = [
  {
    id: "sawayatra-conceived",
    title: "Sawayatra-conceived",
    body: "A journey conceived by Sawayatra.",
  },
  {
    id: "member-proposed",
    title: "Member-proposed",
    body: "A road proposed by a member for consideration by the club.",
  },
  {
    id: "partner-submitted",
    title: "Partner-submitted",
    body:
      "A journey brought to the club by a named agency or local operator for consideration.",
  },
] as const;

export const journeyPrinciples = [
  "Competent operation is the threshold, not the reason a journey belongs to Sawayatra. It must also travel in the way the club travels.",
  "Where a journey moves between places, it does so overland and coherently rather than being assembled from flights between highlights.",
  "It is paced so that places may be understood rather than counted.",
  "It is not built around the usual crowded circuit.",
  "It is rooted in named local knowledge, relationships and expertise, with local partners properly paid.",
] as const;

export const responsibilityLabels = [
  "Conceived by",
  "Hosted by",
  "Operated by",
  "Contracting party",
  "Payment received by",
  "Assessed by Sawayatra",
  "Sawayatra’s role",
  "Emergency and escalation responsibility",
  "Last reviewed",
] as const;

export const archiveCopy = {
  purpose:
    "Members may contribute photographs of places and routes, field notes and practical knowledge to the club’s Archive, so that every road travelled can leave something useful for those who follow.",
  privacy:
    "The Archive is visible only to members. Contributions appear under the member’s Travel Self, never under their name or portrait.",
  status:
    "The Archive is not open yet. No member contributions are available on the public website.",
} as const;

export const partnerSubmissionCopy = {
  status:
    "Partner submissions are not open yet. When they open, every submission will follow the same factual and editorial process.",
  steps: [
    "The partner supplies factual route information.",
    "The partner supplies operational details.",
    "The partner supplies named responsibility and contracting information.",
    "The partner supplies approved assets and rights information.",
    "Sawayatra writes or edits the public-facing page.",
    "The partner confirms factual accuracy.",
    "Sawayatra controls the final editorial wording.",
    "The page records its last review date.",
  ],
} as const;

export const blockedOperationalCopy = {
  confidenceMechanisms: {
    text:
      "A considered admissions process, shared standards of conduct, careful formation of the travelling company, coherent routes, assessed local partners and clearly named responsibilities allow members to travel with greater confidence. They do not remove the risks of travel. Every journey states its own demands, support and limits.",
    reason:
      "Blocked until application, conduct, assessment and responsibility mechanisms are live and evidenced.",
  },
  sponsoredGuests: {
    text: sponsoredGuestDraft,
    reason: "Blocked until sponsored-guest suitability and conduct rules exist.",
  },
  journeyAdmission: {
    text:
      "A journey that meets these standards may be admitted to the Sawayatra programme. One that does not is declined, however expertly operated.",
    reason: "Blocked as a current claim until the assessment workflow exists.",
  },
  materialChangeReview: {
    text:
      "Admission applies to the named journey, route, host and operator. It is reviewed when any material part of that arrangement changes.",
    reason: "Blocked until material-change reassessment is implemented.",
  },
  responsibilityDisclosure: {
    text:
      "Every journey states clearly who conceived it, who hosts it, who operates it, who contracts with the traveller and receives payment, what Sawayatra has assessed, and what responsibilities the club undertakes. Agencies and operators are named, not hidden behind Sawayatra.",
    reason:
      "Blocked until approved responsibility records exist for every published journey.",
  },
} as const;
