import type {
  JourneyAccess,
  JourneyOrigin,
  JourneySetting,
  JourneyStructure,
} from "@/lib/sawayatra/model";

export {
  JOURNEY_ACCESSES,
  JOURNEY_ORIGINS,
  JOURNEY_SETTINGS,
  JOURNEY_STRUCTURES,
} from "@/lib/sawayatra/model";
export type {
  JourneyAccess,
  JourneyOrigin,
  JourneySetting,
  JourneyStructure,
} from "@/lib/sawayatra/model";

/**
 * Date state remains independent from structure, setting, access and origin.
 * Forming-only fields are type-gated so they cannot appear on a Fixed journey.
 */

export type DateState = "fixed" | "forming";
export type Provenance = "sawayatra" | "partner" | "member";
export type PricingModel = "laddered" | "fixed-seat";

export const JOURNEY_ORIGIN_LABEL: Readonly<Record<JourneyOrigin, string>> = {
  "sawayatra-conceived": "Sawayatra-conceived",
  "member-proposed": "Member-proposed",
  "partner-submitted": "Partner-submitted",
};

/**
 * §2.2 badge copy - the exact, unabbreviated forms. There is no short form.
 */
export const PROVENANCE_BADGE_LABEL: Record<Provenance, string> = {
  sawayatra: "Sawayatra",
  partner: "Partner",
  member: "Member-made",
};

/** §6.3 - a window, not a date. Granularity per the WINDOW_GRANULARITY token. */
export interface JourneyWindow {
  readonly id: string;
  /** e.g. "Southern autumn 2028" - a range, never a day. */
  readonly label: string;
  /** §6.4 demand density - a count, never names/passports/archetypes. */
  readonly consideringCount: number;
  /** §6.6 - proposed by a member (no name shown), or not. */
  readonly proposedByMember: boolean;
}

interface JourneyBase {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly structure: JourneyStructure;
  readonly setting: JourneySetting | null;
  /** Null means the canonical access classification is not approved. */
  readonly access: JourneyAccess | null;
  /** Null means the canonical origin classification is not approved. */
  readonly origin: JourneyOrigin | null;
  readonly route: string;
  readonly durationDays: number;
  readonly href:
    | `/departures/${string}`
    | `/caravans/${string}`
    | `/journeys/${string}`;
  /**
   * §7.2 - the page renders a ladder or a flat rate, never the wrong one.
   * Showing a ladder on fixed-seat inventory would be a straightforward lie.
   */
  readonly pricingModel: PricingModel;
}

/** Fixed means that a public date line exists. Origin remains independent. */
export interface FixedJourney extends JourneyBase {
  readonly dateState: "fixed";
  /** @deprecated Read origin instead. Retained for existing card callers. */
  readonly provenance: Provenance;
  /** Public date line, e.g. "February–April 2028 · exact dates …". */
  readonly dateLine: string;
  /** Forming-only concepts cannot exist here. */
  readonly windows?: never;
}

/**
 * Forming means that the date does not exist yet. It retains all four
 * independent taxonomy dimensions and uses laddered pricing.
 */
export interface FormingJourney extends JourneyBase {
  readonly dateState: "forming";
  /** @deprecated Read origin instead. Retained for existing card callers. */
  readonly provenance: "member";
  readonly pricingModel: "laddered";
  readonly windows: readonly JourneyWindow[];
  readonly dateLine?: never;
}

export type Journey = FixedJourney | FormingJourney;

export function isForming(journey: Journey): journey is FormingJourney {
  return journey.dateState === "forming";
}

export function isFixed(journey: Journey): journey is FixedJourney {
  return journey.dateState === "fixed";
}
