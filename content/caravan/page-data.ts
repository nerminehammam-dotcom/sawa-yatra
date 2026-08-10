import "server-only";

import {
  getPublicAndeanCaravan,
  getPublicCaravanSection,
  getPublicStoneRoad,
} from "./public";
import type { SectionId } from "./types";

export const canonicalSectionSlugs = [
  "sea-to-stone",
  "both-shores",
  "the-mirror",
  "the-end-of-the-road",
] as const;

export const canonicalProductSlugs = [
  ...canonicalSectionSlugs,
  "the-stone-road",
] as const;

export type CanonicalSectionSlug = (typeof canonicalSectionSlugs)[number];
export type CanonicalProductSlug = (typeof canonicalProductSlugs)[number];

const sectionIdBySlug: Readonly<Record<CanonicalSectionSlug, SectionId>> = {
  "sea-to-stone": "01",
  "both-shores": "02",
  "the-mirror": "03",
  "the-end-of-the-road": "04",
};

export const slugBySectionId: Readonly<Record<SectionId, CanonicalSectionSlug>> = {
  "01": "sea-to-stone",
  "02": "both-shores",
  "03": "the-mirror",
  "04": "the-end-of-the-road",
};

interface PublicText {
  readonly text: string;
}

export interface PublicGateView {
  readonly id: string;
  readonly name: string;
  readonly airport: string;
  readonly altitude: { readonly display: string };
  readonly gate_class: "caravan_gate" | "short_form_joining_gate";
  readonly role: string;
  readonly arrival_rule: PublicText;
}

export interface PublicDayView {
  readonly id: string;
  readonly day: number;
  readonly section_id: SectionId;
  readonly stage_id: string;
  readonly title: string;
  readonly route: string;
  readonly sleep: string;
  readonly movement: string;
  readonly movement_modes: readonly string[];
  readonly effort_level: string;
  readonly operating_environment: string;
  readonly description: PublicText;
  readonly free_time: PublicText | null;
  readonly conditional_items: readonly {
    readonly label: string;
    readonly text: string;
  }[];
  readonly sleep_altitude: {
    readonly display: string | null;
    readonly qualifier: string;
  };
}

export interface PublicStageView {
  readonly id: string;
  readonly section_id: SectionId;
  readonly name: string;
  readonly day_start: number;
  readonly day_end: number;
  readonly anchor: string;
  readonly product_behaviour: boolean;
}

export interface PublicSectionView {
  readonly section_id: SectionId;
  readonly name: string;
  readonly subline: string | null;
  readonly day_start: number;
  readonly day_end: number;
  readonly gate_from: string;
  readonly gate_to: string;
  readonly group_max: number;
  readonly route_max_altitude: {
    readonly display: string;
    readonly qualifier: string;
    readonly survey_status: string;
  };
  readonly season_public: PublicText;
  readonly declared_load_exception: null | {
    readonly name: string;
    readonly disclosure: PublicText;
    readonly structural_reason: PublicText;
  };
  readonly acclimatisation_ladder: readonly {
    readonly day: number;
    readonly display: string | null;
    readonly qualifier: string;
  }[];
  readonly sleep_standard: PublicText;
  readonly demands: readonly PublicText[];
  readonly join_rule: PublicText;
  readonly conditional_items: readonly {
    readonly id: string;
    readonly controller: string;
    readonly fallback: string;
    readonly notice_point: string;
    readonly remedy: string;
  }[];
  readonly cta: PublicText;
}

export interface CanonicalSectionPageData {
  readonly slug: CanonicalSectionSlug;
  readonly section: PublicSectionView;
  readonly stages: readonly PublicStageView[];
  readonly days: readonly PublicDayView[];
  readonly gateFrom: PublicGateView;
  readonly gateTo: PublicGateView;
}

function gates(): readonly PublicGateView[] {
  return (getPublicAndeanCaravan().gates ?? []) as unknown as readonly PublicGateView[];
}

function gate(id: string): PublicGateView {
  const match = gates().find((candidate) => candidate.id === id);
  if (!match) throw new Error(`Missing public Caravan gate: ${id}`);
  return match;
}

export function getCanonicalCaravanOverview() {
  const caravan = getPublicAndeanCaravan();
  const sections = canonicalSectionSlugs.map((slug) =>
    getCanonicalSectionPageData(slug),
  );

  return Object.freeze({
    name: caravan.name ?? "The Andean Caravan",
    durationDays: caravan.duration_days ?? 71,
    groupMax: caravan.group_max ?? 12,
    scheduledFlights: caravan.scheduled_flight_movements_total ?? 5,
    sections,
    gates: gates(),
  });
}

export function getCanonicalSectionPageData(
  slug: CanonicalSectionSlug,
): CanonicalSectionPageData {
  const sectionId = sectionIdBySlug[slug];
  const projection = getPublicCaravanSection(sectionId);
  const section = projection.section as unknown as PublicSectionView;

  return Object.freeze({
    slug,
    section,
    stages: projection.stages as unknown as readonly PublicStageView[],
    days: projection.days as unknown as readonly PublicDayView[],
    gateFrom: gate(section.gate_from),
    gateTo: gate(section.gate_to),
  });
}

export function getCanonicalStoneRoadPageData() {
  const projection = getPublicStoneRoad();
  const sectionOne = getCanonicalSectionPageData("sea-to-stone");

  return Object.freeze({
    slug: "the-stone-road" as const,
    product: projection.product as unknown as {
      readonly name: string;
      readonly day_start: number;
      readonly day_end: number;
      readonly gate_from: string;
      readonly gate_to: string;
      readonly canonical_for: string;
    },
    stage: projection.stage as unknown as PublicStageView,
    days: projection.days as unknown as readonly PublicDayView[],
    gateFrom: gate("cusco"),
    gateTo: gate("puno"),
    parentSection: sectionOne.section,
  });
}

export function isCanonicalProductSlug(
  slug: string,
): slug is CanonicalProductSlug {
  return canonicalProductSlugs.includes(slug as CanonicalProductSlug);
}
