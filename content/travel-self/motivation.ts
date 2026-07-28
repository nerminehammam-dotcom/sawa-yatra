import type { MotivationFamily } from "./passions";

export const MOTIVATION_FAMILY_LINES: Readonly<Record<MotivationFamily, string>> = {
  table: "You measure a place by who you ended up eating with.",
  made: "You read a place through what people there have made and kept.",
  wild: "You want the part of a country that was not arranged for you.",
  quiet: "You travel to come back to yourself.",
};

export type MotivationSpreadKey =
  | "made,table,wild"
  | "made,quiet,table"
  | "quiet,table,wild"
  | "made,quiet,wild";

export const MOTIVATION_SPREAD_LINES: Readonly<Record<MotivationSpreadKey, string>> = {
  "made,table,wild": "You want all of it: the meal, the workshop, the weather.",
  "made,quiet,table": "You like a place best when it is well made and someone is feeding you.",
  "quiet,table,wild": "You go out for the whole day and come back to the table.",
  "made,quiet,wild": "You want beauty and open country, and quiet at the end of it.",
};
