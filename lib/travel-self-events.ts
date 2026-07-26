import type { PassionId } from "@/content/travel-self/travel-self-model";

export type TravelSelfEvent =
  | { readonly name: "travel_self_started" }
  | {
      readonly name: "travel_self_step_viewed";
      readonly step: number;
      readonly questionId?: string;
    }
  | {
      readonly name: "travel_self_answer_selected";
      readonly questionId: string;
      readonly optionId: string;
    }
  | {
      readonly name: "travel_self_passions_selected";
      readonly passionIds: readonly PassionId[];
    }
  | {
      readonly name: "travel_self_primary_selected";
      readonly passionId: PassionId;
    }
  | {
      readonly name: "travel_self_secondary_selected";
      readonly passionId: PassionId | null;
    }
  | {
      readonly name: "travel_self_completed";
      readonly resultId: string;
      readonly sectionIds: readonly string[];
    }
  | { readonly name: "travel_self_result_viewed"; readonly resultId: string }
  | { readonly name: "travel_self_section_opened"; readonly sectionId: string }
  | { readonly name: "travel_self_answer_edited"; readonly questionId: string }
  | { readonly name: "travel_self_restarted" }
  | { readonly name: "travel_self_email_cta_clicked" };

/**
 * Local review adapter only. Production intentionally performs no work and no
 * event is sent to a network, analytics provider, account, or database.
 */
export function trackTravelSelfEvent(event: TravelSelfEvent) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[travel-self]", event);
  }
}
