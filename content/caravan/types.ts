export const CONTENT_VISIBILITIES = [
  "public",
  "pre_sale_disclosure",
  "internal_operations",
  "legal_review",
] as const;

export type ContentVisibility = (typeof CONTENT_VISIBILITIES)[number];

export const PUBLIC_CONTENT_VISIBILITIES = [
  "public",
  "pre_sale_disclosure",
] as const;

export type PublicContentVisibility =
  (typeof PUBLIC_CONTENT_VISIBILITIES)[number];

export const CONTENT_STATUSES = [
  "draft",
  "proposed",
  "secured",
  "suspended",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const COPY_CLASSES = [
  "locked_source",
  "controlled_source",
  "fixed_phrase",
  "derived_label",
  "founder_copy",
] as const;

export type CopyClass = (typeof COPY_CLASSES)[number];

export type SectionId = "01" | "02" | "03" | "04";
export type StageId =
  | "01-a"
  | "01-b"
  | "01-c"
  | "02-a"
  | "02-b"
  | "03-a"
  | "03-b"
  | "03-c"
  | "04-a"
  | "04-b"
  | "04-c";

export type GateId =
  | "lima"
  | "cusco"
  | "puno"
  | "sucre"
  | "santiago"
  | "balmaceda";

export type GateClass = "caravan_gate" | "short_form_joining_gate";
export type EffortLevel = "Light" | "Steady" | "Demanding";
export type OperatingEnvironment =
  | "Connected"
  | "Limited services"
  | "Remote";

export type CanonicalRecoveryRole =
  | "Normal"
  | "Recovery"
  | "Watch"
  | "Buffer"
  | "Protected shoulder"
  | "Closure";

export type SourceRecoveryRole =
  | "Protected arrival"
  | "Recovery"
  | "Normal"
  | "Watch"
  | "Protected"
  | "Buffer"
  | "Normal · protects the exception"
  | "Watch · exception begins"
  | "Watch · exception ends"
  | "Recovery · protects the exception"
  | "Recovery / choice"
  | "Recovery / weather"
  | "Weather window"
  | "Recovery progression"
  | "Buffer / closure"
  | "Departure / closure";

export type MovementMode =
  | "road"
  | "scheduled flight"
  | "passenger boat"
  | "small vessel"
  | "vehicle ferry"
  | "rail"
  | "premium day train"
  | "4x4"
  | "foot border"
  | "walking"
  | "cable car"
  | "airport transfer"
  | "none";

export interface ContentRecord {
  readonly content_visibility: ContentVisibility;
  readonly status: ContentStatus;
  readonly source_ids: readonly string[];
  readonly recheck_date: string | null;
}

export interface TextRecord extends ContentRecord {
  readonly copy_class: CopyClass;
  readonly text: string;
}

export interface LabelledTextRecord extends TextRecord {
  readonly label: string;
}

export interface GateRecord extends ContentRecord {
  readonly id: GateId;
  readonly name: string;
  readonly airport: string;
  readonly altitude: {
    readonly metres: number | null;
    readonly display: string;
    readonly qualifier: "exact" | "approximate" | "sea_level";
  };
  readonly gate_class: GateClass;
  readonly role: string;
  readonly arrival_rule: TextRecord;
  readonly joining_load: string;
  readonly leaving_load: string;
}

export interface SleepAltitudeRecord extends ContentRecord {
  readonly day: number;
  readonly metres: number | null;
  readonly display: string | null;
  readonly qualifier: "exact" | "approximate" | "pending_contract";
}

export interface DayRecord extends ContentRecord {
  readonly id: `day-${string}`;
  readonly day: number;
  readonly section_id: SectionId;
  readonly stage_id: StageId;
  readonly title: string;
  readonly route: string;
  readonly sleep: string;
  readonly movement: string;
  readonly movement_modes: readonly MovementMode[];
  readonly movement_time_basis:
    | "not_applicable"
    | "road_time"
    | "scheduled_travel"
    | "total_elapsed"
    | "mixed_or_unspecified";
  readonly effort_level: EffortLevel;
  readonly operating_environment: OperatingEnvironment;
  readonly fatigue_signals: readonly string[];
  readonly source_recovery_role: SourceRecoveryRole;
  readonly recovery_role: readonly CanonicalRecoveryRole[];
  readonly protected_marker: boolean;
  readonly description: TextRecord;
  readonly free_time: TextRecord | null;
  readonly conditional_items: readonly LabelledTextRecord[];
  readonly sleep_altitude: SleepAltitudeRecord;
}

export interface LaundryAvailabilityRecord extends ContentRecord {
  readonly availability: "available" | "limited" | "none" | "to_contract";
  readonly next_reliable_window: string | null;
  readonly expected_turnaround: string | null;
}

export interface MakersEncounterRecord extends ContentRecord {
  readonly strategy:
    | "contracted_encounter"
    | "required_to_contract"
    | "none_by_design";
  readonly description: string;
  readonly permission_recorded: boolean;
  readonly payment_recorded: boolean;
  readonly credit_recorded: boolean;
}

export interface StageRecord extends ContentRecord {
  readonly id: StageId;
  readonly section_id: SectionId;
  readonly name: string;
  readonly day_start: number;
  readonly day_end: number;
  readonly anchor: string;
  readonly product_behaviour: boolean;
  readonly makers_encounter: MakersEncounterRecord;
  readonly laundry_availability: LaundryAvailabilityRecord;
}

export interface ConditionalItemRecord extends ContentRecord {
  readonly id: string;
  readonly controller: string;
  readonly fallback: string;
  readonly notice_point: string;
  readonly remedy: string;
}

export interface DeclaredLoadExceptionRecord extends ContentRecord {
  readonly name: "Declared Load Exception";
  readonly day_start: 49;
  readonly day_end: 53;
  readonly disclosure: TextRecord;
  readonly structural_reason: TextRecord;
  readonly protected_shoulders: readonly [48, 54];
  readonly consecutive_demanding_days: 5;
  readonly refuge_nights: 3;
  readonly sleep_altitude_range: string;
}

export interface PreSectionProgressionRecord extends ContentRecord {
  readonly location: string;
  readonly nights: number;
  readonly sleeping_altitudes: readonly SleepAltitudeRecord[];
  readonly transfer: string;
  readonly cost: string | null;
  readonly inclusion_status: "pending" | "included" | "supplementary";
  readonly required: boolean;
}

export interface IncludedExitMovementRecord extends ContentRecord {
  readonly from: GateId;
  readonly to: GateId;
  readonly mode: "scheduled flight";
  readonly included: true;
  readonly outside_route_geometry: true;
}

export interface RouteMaximumAltitudeRecord extends ContentRecord {
  readonly metres_min: number;
  readonly metres_max: number;
  readonly display: string;
  readonly qualifier: "exact" | "approximate";
  readonly survey_status: "confirmed" | "survey_pending";
  readonly location: string;
}

export interface ShortFormExceptionRecord extends ContentRecord {
  readonly id: "the-stone-road";
  readonly name: "The Stone Road";
  readonly stage_id: "01-c";
  readonly day_start: 16;
  readonly day_end: 23;
  readonly gate_from: "cusco";
  readonly gate_to: "puno";
  readonly shared_inventory: true;
  readonly inventory_additive: false;
  readonly closed_to_other_stages: true;
  readonly canonical_for: "/journeys/caravans/andean-caravan/sea-to-stone";
  readonly canonical_document_has_fragment: false;
  readonly legacy_url: readonly ["/departures/the-stone-road"];
}

export interface SectionRecord extends ContentRecord {
  readonly section_id: SectionId;
  readonly name: string;
  readonly subline: string | null;
  readonly day_start: number;
  readonly day_end: number;
  readonly stages: readonly StageId[];
  readonly short_form_exception: ShortFormExceptionRecord | null;
  readonly gate_from: GateId;
  readonly gate_to: GateId;
  readonly gate_load: TextRecord;
  readonly join_rule: TextRecord;
  readonly pre_section_progression: PreSectionProgressionRecord | null;
  readonly acclimatisation_ladder: readonly SleepAltitudeRecord[];
  readonly group_max: 12;
  readonly min_operating_number: ContentRecord & {
    readonly value: number | null;
    readonly assessment_date: string | null;
  };
  readonly route_max_altitude: RouteMaximumAltitudeRecord;
  readonly sleep_altitudes: readonly SleepAltitudeRecord[];
  readonly movement_modes: readonly MovementMode[];
  readonly movement_time_basis: string;
  readonly season_public: TextRecord;
  readonly declared_load_exception: DeclaredLoadExceptionRecord | null;
  readonly makers_encounter: MakersEncounterRecord;
  readonly laundry_availability: readonly LaundryAvailabilityRecord[];
  readonly exit_points: readonly string[];
  readonly steward_continuity: TextRecord;
  readonly sleep_standard: TextRecord;
  readonly demands: readonly TextRecord[];
  readonly conditional_items: readonly ConditionalItemRecord[];
  readonly gate_social_protocol: TextRecord;
  readonly conduct_policy: TextRecord;
  readonly transport_standard: TextRecord;
  readonly canonical_for: string;
  readonly legacy_url: readonly string[];
  readonly cta: TextRecord;
}

export interface EvidenceRecord extends ContentRecord {
  readonly source_id: string;
  readonly claim_supported: string;
  readonly source_owner: string;
  readonly url_or_document: string;
  readonly date_accessed: string | null;
  readonly evidence_excerpt: string;
  readonly rechecked_by: string | null;
  readonly replacement_source: string | null;
}

export interface CaravanRouteModel extends ContentRecord {
  readonly id: "andean-caravan";
  readonly name: "The Andean Caravan";
  readonly day_start: 1;
  readonly day_end: 71;
  readonly duration_days: 71;
  readonly group_max: 12;
  readonly scheduled_flight_movements_total: 5;
  readonly scheduled_flight_movements_in_route: 4;
  readonly gates: readonly GateRecord[];
  readonly stages: readonly StageRecord[];
  readonly sections: readonly SectionRecord[];
  readonly days: readonly DayRecord[];
  readonly included_exit_movement: IncludedExitMovementRecord;
  readonly evidence: readonly EvidenceRecord[];
}
