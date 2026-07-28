export const PASSION_IDS = [
  "food", "festivals", "local-connection", "design", "culture",
  "photography", "learning", "shopping", "nature", "wildlife",
  "adventure", "wellness", "water",
] as const;

export type PassionId = (typeof PASSION_IDS)[number];
export type MotivationFamily = "table" | "made" | "wild" | "quiet";

export interface Passion {
  readonly id: PassionId;
  readonly name: string;
  readonly line: string;
  readonly family: MotivationFamily;
}

export const PASSIONS = [
  { id: "food", name: "Food", family: "table", line: "Markets, kitchens and long lunches." },
  { id: "festivals", name: "Festivals", family: "table", line: "Processions, feast days, and whatever the town is doing that week." },
  { id: "local-connection", name: "Local Connection", family: "table", line: "Time with the people who live there, not only the ones who host." },
  { id: "design", name: "Design", family: "made", line: "Buildings, objects, and how a place puts itself together." },
  { id: "culture", name: "Culture", family: "made", line: "Museums, ruins, music, and the history under the street." },
  { id: "photography", name: "Photography", family: "made", line: "Light, and the time it takes to wait for it." },
  { id: "learning", name: "Learning", family: "made", line: "Courses, guides, languages, and being taught something." },
  { id: "shopping", name: "Shopping", family: "made", line: "Workshops, makers, and bringing something home." },
  { id: "nature", name: "Nature", family: "wild", line: "Landscape, walking, weather, and being outside all day." },
  { id: "wildlife", name: "Wildlife", family: "wild", line: "Animals and birds, and the patience they ask for." },
  { id: "adventure", name: "Adventure", family: "wild", line: "Height, distance, effort, and a little risk." },
  { id: "wellness", name: "Wellness", family: "quiet", line: "Rest, treatment, sleep, and coming home slower than you left." },
  { id: "water", name: "Water", family: "quiet", line: "Coastlines, swimming, rivers and hot springs." },
] as const satisfies readonly Passion[];

export const PASSION_BY_ID = Object.fromEntries(
  PASSIONS.map((passion) => [passion.id, passion]),
) as Readonly<Record<PassionId, Passion>>;
