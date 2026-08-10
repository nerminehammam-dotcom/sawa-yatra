import "server-only";

import { rawAndeanCaravanModel } from "./raw-model";
import {
  PUBLIC_CONTENT_VISIBILITIES,
  type ContentVisibility,
  type SectionId,
} from "./types";
import { assertValidCaravanModel } from "./validate";

type PublicScalar = string | number | boolean | null;
export type PublicProjection<T> =
  T extends PublicScalar
    ? T
    : T extends readonly (infer Item)[]
      ? readonly PublicProjection<Item>[]
      : T extends object
        ? { readonly [Key in keyof T]?: PublicProjection<T[Key]> }
        : never;

const publicVisibility = new Set<ContentVisibility>(
  PUBLIC_CONTENT_VISIBILITIES,
);
const privateMetadataKeys = new Set([
  "source_ids",
  "recheck_date",
  "copy_class",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function projectValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map(projectValue)
      .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);
  }

  if (!isRecord(value)) return value;

  if (
    "content_visibility" in value &&
    !publicVisibility.has(value.content_visibility as ContentVisibility)
  ) {
    return undefined;
  }

  const projected: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (privateMetadataKeys.has(key) || key === "evidence") continue;
    const publicChild = projectValue(child);
    if (publicChild !== undefined) projected[key] = publicChild;
  }
  return Object.freeze(projected);
}

assertValidCaravanModel(rawAndeanCaravanModel);

const publicModel = Object.freeze(
  projectValue(rawAndeanCaravanModel),
) as PublicProjection<typeof rawAndeanCaravanModel>;

/** The only browser-facing read of the canonical Caravan content source. */
export function getPublicAndeanCaravan() {
  return publicModel;
}

export function getPublicCaravanSection(sectionId: SectionId) {
  const section = publicModel.sections?.find(
    (candidate) => candidate.section_id === sectionId,
  );
  if (!section) throw new Error(`Unknown Caravan section: ${sectionId}`);

  const stages = publicModel.stages?.filter(
    (candidate) => candidate.section_id === sectionId,
  ) ?? [];
  const days = publicModel.days?.filter(
    (candidate) => candidate.section_id === sectionId,
  ) ?? [];

  return Object.freeze({ section, stages, days });
}

export function getPublicStoneRoad() {
  const sectionOne = getPublicCaravanSection("01");
  const stage = sectionOne.stages.find((candidate) => candidate.id === "01-c");
  if (!stage) throw new Error("The Stone Road stage is missing");

  return Object.freeze({
    product: sectionOne.section.short_form_exception,
    stage,
    days: sectionOne.days.filter(
      (day) => typeof day.day === "number" && day.day >= 16 && day.day <= 23,
    ),
  });
}

export function getPublicCaravanMapData() {
  return Object.freeze({
    caravanGates:
      publicModel.gates?.filter((gate) => gate.gate_class === "caravan_gate") ?? [],
    shortFormJoiningGate: publicModel.gates?.find((gate) => gate.id === "cusco"),
    routeDays: publicModel.days ?? [],
    includedExitMovement: publicModel.included_exit_movement,
  });
}
