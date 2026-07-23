import type { ArchetypeId } from "@/lib/types";

export const analyticsConfig = {
  provider: "Plausible",
  enabled: false,
  contentStatus: "PLACEHOLDER",
  disabledReason:
    "Analytics transmission remains disabled until the domain, consent decision and privacy basis are approved.",
} as const;

export const ANALYTICS_EVENT_NAMES = [
  "home_primary_cta_clicked",
  "travel_self_started",
  "travel_self_completed",
  "departure_filter_selected",
  "journey_viewed",
  "ask_to_join_started",
  "ask_to_join_submitted",
  "membership_request_started",
  "membership_request_submitted",
  "faq_opened",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export interface AnalyticsEventPayloadMap {
  readonly home_primary_cta_clicked: {
    readonly target: "travel-self";
  };
  readonly travel_self_started: {
    readonly source: "home" | "travel-self";
  };
  readonly travel_self_completed: {
    readonly archetypeId: ArchetypeId;
    readonly draft: true;
  };
  readonly departure_filter_selected: {
    readonly archetypeId: ArchetypeId | "all";
  };
  readonly journey_viewed: {
    readonly journeySlug: string;
  };
  readonly ask_to_join_started: {
    readonly journeySlug: string;
  };
  readonly ask_to_join_submitted: {
    readonly journeySlug: string;
    readonly mode: "mock";
  };
  readonly membership_request_started: {
    readonly source: "membership" | "navigation" | "journey" | "sign-in";
  };
  readonly membership_request_submitted: {
    readonly mode: "mock";
  };
  readonly faq_opened: {
    readonly faqId: string;
    readonly location: "membership" | "general";
  };
}

export type AnalyticsEvent<Name extends AnalyticsEventName = AnalyticsEventName> = {
  readonly [EventName in Name]: {
    readonly name: EventName;
    readonly payload: AnalyticsEventPayloadMap[EventName];
  };
}[Name];

export const createAnalyticsEvent = <Name extends AnalyticsEventName>(
  name: Name,
  payload: AnalyticsEventPayloadMap[Name],
): AnalyticsEvent<Name> => ({ name, payload }) as AnalyticsEvent<Name>;

// Intentionally no sender is exported. Release 1 prepares typed events only.
