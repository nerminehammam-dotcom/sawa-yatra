import type { Archetype, ArchetypeId, StatusedText } from "@/lib/types";

const placeholderText = (note: string): StatusedText => ({
  text: "To be confirmed",
  contentStatus: "PLACEHOLDER",
  contentNote: note,
});

const placeholderGreenFlags = (): readonly [StatusedText, StatusedText] => [
  placeholderText("Founder-approved green flag 1 is required."),
  placeholderText("Founder-approved green flag 2 is required."),
];

const draftArchetype = (
  id: ArchetypeId,
  name: string,
  portrait: StatusedText = placeholderText(
    "Founder-approved one-line archetype portrait is required.",
  ),
  fitStatement: StatusedText = placeholderText(
    "Founder-approved fit statement is required.",
  ),
): Archetype => ({
  id,
  name,
  portrait,
  greenFlags: placeholderGreenFlags(),
  fitStatement,
  contentStatus: "DRAFT",
  contentNote:
    "Archetype names and all interpretation copy require founder approval and make no validated assessment claim.",
});

export const archetypes = [
  draftArchetype(
    "slow-wanderer",
    "Slow Wanderer",
    {
      text: "One place, known deeply.",
      contentStatus: "DRAFT",
      contentNote: "Visual-manual specimen copy; founder approval required.",
    },
    {
      text: "Not your twin — the table that makes your journey better.",
      contentStatus: "DRAFT",
      contentNote: "Visual-manual specimen copy; founder approval required.",
    },
  ),
  draftArchetype("food-led", "Food-Led"),
  draftArchetype("culture-diver", "Culture Diver"),
  draftArchetype("design-pilgrim", "Design Pilgrim"),
  draftArchetype("night-owl", "Night Owl"),
  draftArchetype("quiet-adventurer", "Quiet Adventurer"),
  draftArchetype("improviser", "Improviser"),
  draftArchetype("nature-listener", "Nature Listener"),
  draftArchetype("city-reader", "City Reader"),
  draftArchetype("ritual-seeker", "Ritual Seeker"),
  draftArchetype("social-drifter", "Social Drifter"),
  draftArchetype("independent-joiner", "Independent Joiner"),
] as const satisfies readonly Archetype[];

export const archetypeById = Object.fromEntries(
  archetypes.map((archetype) => [archetype.id, archetype]),
) as Readonly<Record<ArchetypeId, Archetype>>;
