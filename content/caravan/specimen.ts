import "server-only";

import manifest from "./copy-manifest.json";
import {
  getPublicAndeanCaravan,
  getPublicCaravanMapData,
  getPublicCaravanSection,
  getPublicStoneRoad,
} from "./public";

export interface FounderCopySlot {
  readonly slotId: string;
  readonly maxLength: number;
}

interface SourceText { readonly text: string }
interface SourceAltitude { readonly metres: number | null; readonly display: string | null; readonly qualifier: string }
interface SourceDay {
  readonly day: number;
  readonly stage_id: string;
  readonly title: string;
  readonly route: string;
  readonly sleep: string;
  readonly movement: string;
  readonly movement_modes: readonly string[];
  readonly effort_level: "Light" | "Steady" | "Demanding";
  readonly operating_environment: "Connected" | "Limited services" | "Remote";
  readonly recovery_role: readonly string[];
  readonly protected_marker: boolean;
  readonly description: SourceText;
  readonly free_time?: SourceText | null;
  readonly conditional_items: readonly { readonly label: string; readonly text: string }[];
  readonly sleep_altitude: SourceAltitude;
}
interface SourceStage { readonly id: string; readonly name: string; readonly day_start: number; readonly day_end: number; readonly anchor: string }
interface SourceSection {
  readonly section_id: "01" | "02" | "03" | "04";
  readonly name: string;
  readonly subline: string | null;
  readonly day_start: number;
  readonly day_end: number;
  readonly gate_from: string;
  readonly gate_to: string;
  readonly group_max: number;
  readonly route_max_altitude: { readonly display: string };
  readonly season_public: SourceText;
  readonly join_rule: SourceText;
  readonly sleep_standard: SourceText;
  readonly demands: readonly SourceText[];
  readonly declared_load_exception?: {
    readonly disclosure: SourceText;
    readonly structural_reason: SourceText;
    readonly refuge_nights: number;
    readonly sleep_altitude_range: string;
    readonly protected_shoulders: readonly number[];
  } | null;
}
interface SourceGate {
  readonly id: string;
  readonly name: string;
  readonly gate_class: string;
  readonly altitude: { readonly metres: number | null; readonly display: string };
}

const founderSlots = new Map(
  manifest.slots
    .filter((slot) => slot.copy_class === "founder_copy")
    .map((slot) => [slot.slot_id, slot] as const),
);

export function getFounderCopySlot(slotId: string): FounderCopySlot {
  const slot = founderSlots.get(slotId);
  if (!slot) throw new Error(`Unknown founder-copy slot: ${slotId}`);
  return { slotId, maxLength: slot.max_length };
}

export function getFounderCopyStressFixtures() {
  return [...founderSlots.values()].map((slot) => {
    const seed = "Measure ";
    return {
      slot: { slotId: slot.slot_id, maxLength: slot.max_length },
      value: seed.repeat(Math.ceil(slot.max_length / seed.length)).slice(0, slot.max_length),
    };
  });
}

const sectionRoutes = {
  "01": "/caravans/andean/sea-to-stone",
  "02": "/caravans/andean/both-shores",
  "03": "/caravans/andean/phase-3-preview/the-mirror",
  "04": "/caravans/andean/the-end-of-the-road",
} as const;

const gateDays = { lima: 1, puno: 23, sucre: 39, santiago: 57, balmaceda: 71 } as const;

export function getOverviewSpecimenData() {
  const model = getPublicAndeanCaravan() as unknown as {
    readonly name: string;
    readonly duration_days: number;
    readonly group_max: number;
    readonly sections: readonly SourceSection[];
  };
  const map = getPublicCaravanMapData() as unknown as {
    readonly caravanGates: readonly SourceGate[];
    readonly shortFormJoiningGate?: SourceGate;
    readonly routeDays: readonly SourceDay[];
  };
  const stone = getPublicStoneRoad() as unknown as {
    readonly product: { readonly name: string; readonly day_start: number; readonly day_end: number; readonly gate_from: string; readonly gate_to: string };
  };

  const gateById = new Map(
    [...map.caravanGates, ...(map.shortFormJoiningGate ? [map.shortFormJoiningGate] : [])]
      .map((gate) => [gate.id, gate] as const),
  );
  const gateName = (id: string) => gateById.get(id)?.name ?? id;

  return {
    name: model.name,
    durationDays: model.duration_days,
    groupMax: model.group_max,
    sections: model.sections.map((section) => ({
      id: section.section_id,
      number: section.section_id,
      name: section.name,
      subline: section.subline,
      days: section.day_end - section.day_start + 1,
      dayStart: section.day_start,
      dayEnd: section.day_end,
      gateFrom: gateName(section.gate_from),
      gateTo: gateName(section.gate_to),
      href: sectionRoutes[section.section_id],
      character: getFounderCopySlot(`caravan.choice.s${section.section_id}.character`),
    })),
    stoneRoad: {
      name: stone.product.name,
      days: stone.product.day_end - stone.product.day_start + 1,
      gateFrom: gateName(stone.product.gate_from),
      gateTo: gateName(stone.product.gate_to),
      character: getFounderCopySlot("caravan.stone_road.character"),
    },
    gates: map.caravanGates.map((gate) => ({
      id: gate.id,
      name: gate.name,
      day: gateDays[gate.id as keyof typeof gateDays],
      altitudeMetres: gate.altitude.metres,
      altitudeDisplay: gate.altitude.display,
    })),
    altitudePoints: map.routeDays
      .filter((day) => day.sleep_altitude.metres !== null)
      .map((day) => ({ day: day.day, metres: day.sleep_altitude.metres as number })),
  };
}

export function getMirrorSpecimenData() {
  const result = getPublicCaravanSection("03") as unknown as {
    readonly section: SourceSection;
    readonly stages: readonly SourceStage[];
    readonly days: readonly SourceDay[];
  };
  const gates = (getPublicAndeanCaravan() as unknown as { readonly gates: readonly SourceGate[] }).gates;
  const gateById = new Map(gates.map((gate) => [gate.id, gate] as const));
  const section = result.section;
  const ladder = result.days.slice(0, 11);

  return {
    section: {
      number: section.section_id,
      name: section.name,
      days: section.day_end - section.day_start + 1,
      dayStart: section.day_start,
      dayEnd: section.day_end,
      gateFrom: gateById.get(section.gate_from)?.name ?? section.gate_from,
      gateTo: gateById.get(section.gate_to)?.name ?? section.gate_to,
      groupMax: section.group_max,
      routeMaximum: section.route_max_altitude.display,
      season: section.season_public.text,
      joinRule: section.join_rule.text,
      sleepStandard: section.sleep_standard.text,
      demands: section.demands.map((demand) => demand.text),
      exception: section.declared_load_exception,
    },
    stages: result.stages,
    days: result.days,
    ladder: ladder.map((day) => ({
      night: day.day - 38,
      day: day.day,
      sleep: day.sleep,
      altitude: day.sleep_altitude.display,
      qualifier: day.sleep_altitude.qualifier,
    })),
    slots: {
      hero: getFounderCopySlot("s03.hero.proposition"),
      caption: getFounderCopySlot("s03.hero.caption"),
      framing: getFounderCopySlot("s03.disclosure.framing"),
      editorial: getFounderCopySlot("s03.editorial.character"),
      places: getFounderCopySlot("s03.places.intro"),
      enquiry: getFounderCopySlot("s03.enquiry.invitation"),
      stageA: getFounderCopySlot("s03.stage.a.character"),
      stageB: getFounderCopySlot("s03.stage.b.character"),
      stageC: getFounderCopySlot("s03.stage.c.character"),
    },
  };
}
