/**
 * Journey taxonomy - spec v3.1 §2, §7.2.
 *
 * The resolving distinction is not who made a journey but whether its date
 * exists yet. Provenance is a badge, not an axis (§2.2): it renders on every
 * card, unabbreviated, never soft-pedalled (build command §1.4).
 *
 * Everything in §6.3–6.6 (windows, demand density, quorum calls, conveners)
 * belongs to Forming only - the types below make Forming fields unexpressible
 * on a Fixed journey.
 */

export type DateState = "fixed" | "forming";
export type Provenance = "sawayatra" | "partner" | "member";
export type PricingModel = "laddered" | "fixed-seat";

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

/**
 * Fixed - the date is real and immovable (§2.1). Sawayatra and Partner
 * journeys are always Fixed; a member journey becomes Fixed when a quorum
 * call lands a date (§6.5).
 */
export interface FixedJourney extends JourneyBase {
  readonly dateState: "fixed";
  readonly provenance: Provenance;
  /** Public date line, e.g. "February–April 2028 · exact dates …". */
  readonly dateLine: string;
  /** Forming-only concepts cannot exist here. */
  readonly windows?: never;
}

/**
 * Forming - the date does not exist yet; it is decided by whoever gathers
 * (§2.1). Only member-created journeys form, and forming journeys are always
 * laddered (fixed-seat inventory has a seller-set rate and a seller-set date).
 */
export interface FormingJourney extends JourneyBase {
  readonly dateState: "forming";
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
