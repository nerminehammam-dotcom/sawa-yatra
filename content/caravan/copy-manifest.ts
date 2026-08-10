import manualManifest from "./copy-manifest.json";
import { rawAndeanCaravanModel } from "./raw-model";
import {
  COPY_CLASSES,
  PUBLIC_CONTENT_VISIBILITIES,
  type CopyClass,
  type SectionId,
} from "./types";

export const COPY_STATUSES = [
  "needed",
  "supplied",
  "fact_checked",
  "approved",
  "placed",
] as const;

export type CopyStatus = (typeof COPY_STATUSES)[number];

export interface CopyManifestRecord {
  readonly slot_id: string;
  readonly surface: string;
  readonly position: string;
  readonly copy_class: CopyClass;
  readonly purpose: string;
  readonly max_length: number;
  readonly breakpoint_note: string;
  readonly source_ref: string;
  readonly route_facts_available: boolean;
  readonly route_fact_refs: readonly string[];
  readonly fact_check_status: "not_required" | "pending" | "passed";
  readonly adjacent_content: string;
  readonly status: CopyStatus;
  readonly approved_by: string | null;
  readonly approved_at: string | null;
  readonly placeholder_rendered: boolean;
}

const publicVisibilities = new Set<string>(PUBLIC_CONTENT_VISIBILITIES);
const copyClasses = new Set<string>(COPY_CLASSES);
const metadataKeys = new Set([
  "content_visibility",
  "status",
  "source_ids",
  "recheck_date",
  "copy_class",
]);
const nonCopyKeys = new Set([
  "id",
  "section_id",
  "stage_id",
  "gate_from",
  "gate_to",
  "day_start",
  "day_end",
  "day",
  "metres",
  "metres_min",
  "metres_max",
  "nights",
  "group_max",
  "canonical_for",
  "legacy_url",
  "anchor",
  "subline",
]);
const derivedLabelKeys = new Set([
  "name",
  "title",
  "route",
  "sleep",
  "movement",
  "airport",
  "display",
  "location",
  "role",
  "season_public",
  "qualifier",
  "survey_status",
  "movement_modes",
  "movement_time_basis",
  "effort_level",
  "operating_environment",
  "source_recovery_role",
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function arrayKey(item: unknown, index: number): string {
  if (!isObject(item)) return String(index + 1);
  if (typeof item.id === "string") return item.id;
  if (typeof item.section_id === "string" && "name" in item) {
    return `section-${item.section_id}`;
  }
  if (typeof item.day === "number") {
    return `day-${String(item.day).padStart(2, "0")}`;
  }
  return String(index + 1);
}

function sectionSurface(sectionId: SectionId): string {
  return `Section ${sectionId}`;
}

function surfaceForPath(path: string): string {
  const dayMatch = path.match(/days\.day-(\d{2})/);
  if (dayMatch) {
    const day = rawAndeanCaravanModel.days.find(
      (record) => record.day === Number(dayMatch[1]),
    );
    return day ? sectionSurface(day.section_id) : "The Andean Caravan";
  }

  const sectionMatch = path.match(/sections\.section-(0[1-4])/);
  if (sectionMatch) return sectionSurface(sectionMatch[1] as SectionId);

  const stageMatch = path.match(/stages\.(0[1-4])-/);
  if (stageMatch) return sectionSurface(stageMatch[1] as SectionId);

  return "Overview";
}

function sourceReference(value: Record<string, unknown>, path: string): string {
  if (Array.isArray(value.source_ids) && value.source_ids.length > 0) {
    return value.source_ids.join(",");
  }
  return `route-model:${path}`;
}

function lockedRecord(
  path: string,
  text: string,
  value: Record<string, unknown>,
  copyClass: CopyClass,
): CopyManifestRecord {
  return {
    slot_id: `model.${path}`,
    surface: surfaceForPath(path),
    position: path,
    copy_class: copyClass,
    purpose: "Carry the authoritative route-model wording without creating a second copy source",
    max_length: text.length,
    breakpoint_note: "Render in full using an existing content pattern; do not truncate or rewrite",
    source_ref: sourceReference(value, path),
    route_facts_available: true,
    route_fact_refs: [path],
    fact_check_status: "passed",
    adjacent_content: "Placement is governed by the approved Phase 3 content order",
    status: "approved",
    approved_by: "Locked Route Master",
    approved_at: "v4.2.1",
    placeholder_rendered: false,
  };
}

function derivedRecord(path: string, text: string): CopyManifestRecord {
  return {
    slot_id: `derived.${path}`,
    surface: surfaceForPath(path),
    position: path,
    copy_class: "derived_label",
    purpose: "Generate a route label from the canonical content model",
    max_length: text.length,
    breakpoint_note: "Value is model-derived and may wrap; it may not be shortened by hand",
    source_ref: `route-model:${path}`,
    route_facts_available: true,
    route_fact_refs: [path],
    fact_check_status: "passed",
    adjacent_content: "Placement is governed by the approved Phase 3 content order",
    status: "approved",
    approved_by: "Locked Route Master",
    approved_at: "v4.2.1",
    placeholder_rendered: false,
  };
}

function collectModelSlots(
  value: unknown,
  path: string,
  records: CopyManifestRecord[],
): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectModelSlots(item, `${path}.${arrayKey(item, index)}`, records),
    );
    return;
  }

  if (!isObject(value)) return;
  if (
    typeof value.content_visibility === "string" &&
    !publicVisibilities.has(value.content_visibility)
  ) {
    return;
  }

  if (
    typeof value.text === "string" &&
    typeof value.copy_class === "string" &&
    copyClasses.has(value.copy_class)
  ) {
    records.push(
      lockedRecord(path, value.text, value, value.copy_class as CopyClass),
    );
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (metadataKeys.has(key) || nonCopyKeys.has(key)) continue;
    const childPath = path ? `${path}.${key}` : key;

    if (typeof child === "string") {
      records.push(
        derivedLabelKeys.has(key)
          ? derivedRecord(childPath, child)
          : lockedRecord(childPath, child, value, "locked_source"),
      );
      continue;
    }

    collectModelSlots(child, childPath, records);
  }
}

const modelSlots: CopyManifestRecord[] = [];
collectModelSlots(rawAndeanCaravanModel, "caravan", modelSlots);

const promptFixedSlots: readonly CopyManifestRecord[] = [
  {
    slot_id: "s02.fixed.subline",
    surface: "Section 02",
    position: "Cards and product surfaces",
    copy_class: "fixed_phrase",
    purpose: "Carry the exact Section 02 subline required by v2.0",
    max_length: 41,
    breakpoint_note: "Render verbatim and allow the existing text pattern to wrap",
    source_ref: "website-content-migration-prompt-v2.0:3.1",
    route_facts_available: true,
    route_fact_refs: ["caravan.sections.section-02.subline"],
    fact_check_status: "passed",
    adjacent_content: "Directly associated with the Both Shores product name",
    status: "approved",
    approved_by: "Website Content Migration Prompt v2.0",
    approved_at: "v2.0",
    placeholder_rendered: false,
  },
];

const manualSlots = manualManifest.slots as readonly CopyManifestRecord[];

export const completeCopyManifest = Object.freeze({
  ...manualManifest,
  slots: Object.freeze([...manualSlots, ...promptFixedSlots, ...modelSlots]),
});
