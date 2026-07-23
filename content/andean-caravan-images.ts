import type { RisoAsset } from "@/components/brand/RisoArtwork";

const image = (
  filename: string,
  alt: string,
  focalPoint?: { x: number; y: number },
): RisoAsset => ({
  src: `/assets/images/departures/andean/${filename}`,
  alt,
  treatment: "true",
  focalPoint,
  status: "DRAFT",
});

export const andeanCaravanHeroImage = image(
  "andean-caravan.jpg",
  "A motorcyclist follows a gravel road towards snow-covered Patagonian peaks.",
  { x: 52, y: 61 },
);

export const andeanCaravanSectionImages = {
  "desert-coast": image(
    "desert-coast.jpg",
    "A street vendor sits beside small stools and folding carts in Lima.",
    { x: 28, y: 59 },
  ),
  "white-city-deep-canyon": image(
    "white-city-deep-canyon.jpg",
    "Cultivated fields rise towards cloud-covered mountains in Peru.",
    { x: 53, y: 58 },
  ),
  "the-stone-road": image(
    "the-stone-road.jpg",
    "A field of yellow flowers stretches towards high green Andean ridges.",
    { x: 52, y: 46 },
  ),
  "both-shores": image(
    "both-shores.jpg",
    "A truck passes a pedestrian on a high Bolivian road.",
    { x: 48, y: 52 },
  ),
  "thin-air-cloud-forest": image(
    "thin-air-cloud-forest.jpg",
    "A passenger boards a painted bus on a steep street in La Paz.",
    { x: 73, y: 54 },
  ),
  "silver-and-bone": image(
    "silver-and-bone.jpg",
    "A person enters a weathered adobe building beneath a wide Bolivian sky.",
    { x: 64, y: 58 },
  ),
  "the-mirror": image(
    "the-mirror.jpg",
    "Flamingos stand in a shallow high-altitude lagoon beneath volcanic hills.",
    { x: 59, y: 53 },
  ),
  atacama: image(
    "atacama.jpg",
    "The Milky Way spans the dark sky above rock formations in the Atacama Desert.",
    { x: 66, y: 40 },
  ),
  "the-end-of-the-road": image(
    "the-end-of-the-road.jpg",
    "A gravel road curves between a Patagonian lake and a rocky cliff.",
    { x: 61, y: 58 },
  ),
} as const satisfies Readonly<Record<string, RisoAsset>>;

export function getAndeanCaravanImage(slug: string): RisoAsset {
  return (
    andeanCaravanSectionImages[
      slug as keyof typeof andeanCaravanSectionImages
    ] ?? andeanCaravanHeroImage
  );
}
