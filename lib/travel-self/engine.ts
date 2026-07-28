import { AXES, AXIS_BY_ID, WEIGHTING_ORDER, type AxisId, type AxisPositions } from "@/content/travel-self/axes";
import { FAMILIES, type FamilyKey } from "@/content/travel-self/families";
import { MOTIVATION_FAMILY_LINES, MOTIVATION_SPREAD_LINES, type MotivationSpreadKey } from "@/content/travel-self/motivation";
import { PASSION_BY_ID, type MotivationFamily, type PassionId } from "@/content/travel-self/passions";

export function familyKey(positions: AxisPositions): FamilyKey {
  return ["pace", "planning", "social", "rhythm"]
    .map((axis) => positions[axis as AxisId] <= 3 ? "L" : "R")
    .join("") as FamilyKey;
}

export function readoutFor(key: FamilyKey): string {
  return FAMILIES[key].readout;
}

export function bendLine(positions: AxisPositions): string {
  const bends = WEIGHTING_ORDER.filter((axis) => [3, 4].includes(positions[axis]));
  if (bends.length === 0) return "Nothing. You are firmly placed on all five.";
  if (bends.length <= 3) return `${bends.map((axis) => AXIS_BY_ID[axis].label).join(", ")}.`;
  if (bends.length === 4) {
    const firm = WEIGHTING_ORDER.find((axis) => !bends.includes(axis));
    if (!firm) throw new Error("Expected one firm axis");
    return `You adapt across most of a journey; ${AXIS_BY_ID[firm].label.toLowerCase()} is the preference you hold to.`;
  }
  return "You adapt across all five, which makes you easier to travel with than most and harder to place.";
}

export function stingLine(positions: AxisPositions): string {
  for (const axisId of WEIGHTING_ORDER) {
    const position = positions[axisId];
    if (position === 3 || position === 4) continue;
    return position <= 2 ? AXIS_BY_ID[axisId].feel.left : AXIS_BY_ID[axisId].feel.right;
  }
  return "the group looks to you for a preference, and you do not have a strong one to give.";
}

export function motivationLine(passions: readonly [PassionId, PassionId, PassionId]): string {
  const families = passions.map((passion) => PASSION_BY_ID[passion].family);
  const counts = new Map<MotivationFamily, number>();
  for (const family of families) counts.set(family, (counts.get(family) ?? 0) + 1);
  const dominant = [...counts.entries()].find(([, count]) => count >= 2)?.[0];
  if (dominant) return MOTIVATION_FAMILY_LINES[dominant];
  const spread = [...new Set(families)].sort().join(",") as MotivationSpreadKey;
  const line = MOTIVATION_SPREAD_LINES[spread];
  if (!line) throw new Error(`No motivation line for ${spread}`);
  return line;
}

export function comfortPole(positions: AxisPositions): "Unfussy" | "Considered" {
  return positions.comfort <= 3 ? "Unfussy" : "Considered";
}

export function completePositions(value: number): AxisPositions {
  if (![1, 2, 3, 4, 5, 6].includes(value)) throw new Error("Invalid position");
  return Object.fromEntries(AXES.map((axis) => [axis.id, value])) as AxisPositions;
}
