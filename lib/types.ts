export const CONTENT_STATUSES = [
  "LOCKED",
  "DRAFT",
  "PLACEHOLDER",
  "LEGAL REVIEW",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const TO_BE_CONFIRMED = "To be confirmed" as const;

export interface ContentStatusRecord {
  readonly contentStatus: ContentStatus;
  readonly contentNote?: string;
}

export interface StatusedText extends ContentStatusRecord {
  readonly text: string;
}

export type FourItemTuple<T> = readonly [T, T, T, T];
export type SixItemTuple<T> = readonly [T, T, T, T, T, T];

export type StaticRoute =
  | "/"
  | "/how-it-works"
  | "/caravans"
  | "/caravans/andean"
  | "/caravans/andean/route-map"
  | "/caravans/andean-caravan/how-it-works"
  | "/caravans/who-else-is-travelling"
  | "/caravans/the-andean-caravan"
  | "/joining-points"
  | "/start-here"
  | "/travel-self"
  | "/departures"
  | "/departure-dates"
  | "/do-it-yourself"
  | "/journeys"
  | "/create-your-own-journey"
  | "/membership"
  | "/members"
  | "/about"
  | "/who-we-are"
  | "/partners"
  | "/contact"
  | "/register-interest"
  | "/sign-in"
  | "/request-invitation"
  | "/privacy"
  | "/terms"
  | "/accessibility"
  | "/404";

export type JourneyRoute = `/departures/${string}` | `/caravans/${string}`;
export type SiteRoute = StaticRoute | JourneyRoute;
export type RouteTemplate = StaticRoute | "/departures/[slug]";

export interface CallToAction extends ContentStatusRecord {
  readonly label: string;
  readonly href: SiteRoute;
  readonly style: "primary" | "secondary";
}

export interface RouteMetadataEntry extends ContentStatusRecord {
  readonly id: string;
  readonly path: RouteTemplate;
  readonly title: string;
  readonly description: string;
  readonly descriptionStatus: ContentStatus;
  readonly canonicalPath: RouteTemplate;
  readonly noIndex?: boolean;
}

export interface NavigationItem extends ContentStatusRecord {
  readonly id: string;
  readonly label: string;
  readonly href: StaticRoute;
}

export interface EditorialItem extends ContentStatusRecord {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export interface NumberedStep extends EditorialItem {
  readonly number: string;
}

export interface PageHero extends ContentStatusRecord {
  readonly eyebrow?: string;
  readonly title: string;
  readonly accentWord?: string;
  readonly lead?: string;
  readonly primaryAction?: CallToAction;
  readonly secondaryAction?: CallToAction;
  readonly assetId?: AssetId;
}

export type ImageTreatment = "true" | "duotone";

export type AssetId =
  | "grain"
  | "home-hero"
  | "about-founder"
  | "journey-patagonia-card"
  | "journey-patagonia-hero"
  | "journey-carretera-card"
  | "journey-carretera-hero"
  | "journey-atacama-card"
  | "journey-atacama-hero"
  | "social-fallback"
  | "favicon";

export interface ImageAsset extends ContentStatusRecord {
  readonly id: AssetId;
  readonly src: string;
  readonly alt: string;
  readonly treatment: ImageTreatment;
  readonly role:
    | "texture"
    | "hero"
    | "card"
    | "portrait"
    | "social"
    | "icon";
  readonly isPlaceholder: boolean;
  readonly focalPoint?: { readonly x: number; readonly y: number };
}

export type ArchetypeId =
  | "slow-wanderer"
  | "food-led"
  | "culture-diver"
  | "design-pilgrim"
  | "night-owl"
  | "quiet-adventurer"
  | "improviser"
  | "nature-listener"
  | "city-reader"
  | "ritual-seeker"
  | "social-drifter"
  | "independent-joiner";

export interface Archetype extends ContentStatusRecord {
  readonly id: ArchetypeId;
  readonly name: string;
  readonly portrait: StatusedText;
  readonly greenFlags: readonly [StatusedText, StatusedText];
  readonly fitStatement: StatusedText;
}

export interface QuizOption extends ContentStatusRecord {
  readonly id: string;
  readonly label: string;
  readonly scores: Partial<Record<ArchetypeId, number>>;
  readonly scoreStatus: "DRAFT";
  readonly scoreNote: string;
}

export interface QuizQuestion extends ContentStatusRecord {
  readonly id: string;
  readonly prompt: string;
  readonly options: FourItemTuple<QuizOption>;
}

export type JourneyStatus = "forming" | "confirmed" | "full" | "closed";

export type JourneyFieldName =
  | "dates"
  | "durationDays"
  | "capacity"
  | "seatsRemaining"
  | "priceLabel"
  | "pace"
  | "story"
  | "dayRhythm"
  | "included"
  | "held"
  | "images";

export interface Journey extends ContentStatusRecord {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly destination: string;
  readonly country: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly dateLabel: string;
  readonly durationDays: number;
  readonly capacity: number;
  readonly seatsRemaining: number | null;
  readonly seatStatusLabel: string;
  readonly status: JourneyStatus;
  readonly priceLabel: string;
  readonly pace: string;
  readonly archetypes: readonly ArchetypeId[];
  readonly fitLabel: string;
  readonly heroImage: ImageAsset;
  readonly cardImage: ImageAsset;
  readonly story: readonly string[];
  readonly dayRhythm: readonly string[];
  readonly included: readonly string[];
  readonly held: readonly string[];
  readonly fieldStatus: Readonly<Record<JourneyFieldName, ContentStatus>>;
  readonly demoOnly: true;
}

export interface MembershipPromise extends ContentStatusRecord {
  readonly id: string;
  readonly number: string;
  readonly title: StatusedText;
  readonly description: StatusedText;
}

export interface MembershipTier extends ContentStatusRecord {
  readonly id: string;
  readonly name: string;
  readonly priceLabel: typeof TO_BE_CONFIRMED;
  readonly summary: StatusedText;
  readonly benefits: readonly StatusedText[];
  readonly action: CallToAction;
}

export interface FaqItem extends ContentStatusRecord {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly category: "membership" | "general";
}

export interface LegalPagePlaceholder extends ContentStatusRecord {
  readonly id: "privacy" | "terms" | "accessibility";
  readonly path: Extract<StaticRoute, "/privacy" | "/terms" | "/accessibility">;
  readonly title: string;
  readonly reviewLabel: "LEGAL REVIEW";
  readonly notice: string;
  readonly body: readonly string[];
  readonly lastReviewed: typeof TO_BE_CONFIRMED;
}

export interface SystemPageContent extends ContentStatusRecord {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly actions: readonly CallToAction[];
}
