import type { RisoAsset } from "@/components/brand/RisoArtwork";
import type { AndeanCaravanSectionSlug } from "@/content/andean-caravan";

const image = (
  filename: string,
  alt: string,
  focalPoint?: { x: number; y: number },
): RisoAsset => ({
  src: filename.startsWith("/")
    ? filename
    : `/assets/images/departures/andean/${filename}`,
  alt,
  treatment: "true",
  focalPoint,
  status: "DRAFT",
});

const galleryImage = (
  sectionSlug: AndeanCaravanSectionSlug,
  filename: string,
  alt: string,
  focalPoint?: { x: number; y: number },
): RisoAsset =>
  image(`gallery/${sectionSlug}/${filename}`, alt, focalPoint);

const carreteraAustralImage = (
  filename: string,
  alt: string,
  focalPoint?: { x: number; y: number },
): RisoAsset =>
  image(`gallery/carretera-austral/${filename}`, alt, focalPoint);

export const homeCarreteraHeroImage = carreteraAustralImage(
  "home-road.webp",
  "Long gravel road crossing the Patagonian steppe towards a line of mountains.",
  { x: 50, y: 68 },
);

export const journeysCarreteraCardImage = carreteraAustralImage(
  "journeys-storm-steppe.webp",
  "A dark storm front gathering above the central Aysén steppe.",
  { x: 50, y: 58 },
);

export const caravansCollectionHeroImage = carreteraAustralImage(
  "caravans-cattle-drive.webp",
  "Rider moving cattle along Ruta 7 through the forest in central Aysén.",
  { x: 74, y: 57 },
);

export const andeanCaravanHeroImage = carreteraAustralImage(
  "andean-steppe-road.webp",
  "Gravel road curving through tawny steppe below Cerro Castillo.",
  { x: 52, y: 61 },
);

export const joiningPointsHeroImage = carreteraAustralImage(
  "joining-gravel-ruta-7.webp",
  "Gravel stretch of Ruta 7 leading into rain beneath dark Patagonian mountains.",
  { x: 50, y: 58 },
);

export const departuresCarreteraHeroImage = carreteraAustralImage(
  "departures-ibanez-valley.webp",
  "The Ibáñez River valley opening beneath cloud-covered mountains near Villa Cerro Castillo.",
  { x: 50, y: 54 },
);

export const endOfRoadCardImage = carreteraAustralImage(
  "end-road-card.webp",
  "The Ibáñez River winding through the Cerro Castillo valley beneath snow-covered peaks.",
  { x: 50, y: 59 },
);

export const endOfRoadAtlasImage = carreteraAustralImage(
  "atlas-baker-canyon.webp",
  "A vehicle raising dust on the road above the Baker River canyon near Puerto Bertrand.",
  { x: 44, y: 59 },
);

export const endOfRoadHeroImage = carreteraAustralImage(
  "end-road-hero.webp",
  "Two riders descending a trail towards Lago O’Higgins in southern Aysén.",
  { x: 43, y: 64 },
);

export const andeanCaravanSectionGalleries = {
  "desert-coast": [
    galleryImage(
      "desert-coast",
      "01-lima-01.jpg",
      "Man in white friar's robes standing in a green doorway in Lima, holding a phone, an ornate iron street lamp on the wall beside him.",
      { x: 41, y: 63 },
    ),
    galleryImage(
      "desert-coast",
      "02-lima-02.jpg",
      "Two men work at a cobbler's stall in Lima, a devotional print pinned above them.",
      { x: 57, y: 54 },
    ),
    galleryImage(
      "desert-coast",
      "03-lima-05.jpg",
      "Street vendor sitting beside small stools against a weathered green wall in Lima.",
      { x: 27, y: 55 },
    ),
    galleryImage(
      "desert-coast",
      "04-lima-08.jpg",
      "Costumed performer pausing beside a tall wooden doorway in Lima.",
      { x: 72, y: 58 },
    ),
    galleryImage(
      "desert-coast",
      "05-lima-017a.jpg",
      "Man filling bottles at a bicycle cart against a concrete wall in Lima.",
      { x: 51, y: 49 },
    ),
    galleryImage(
      "desert-coast",
      "06-lima-017ae.jpg",
      "Police officer standing with a riot helmet beside a POLICIA sign in Lima.",
      { x: 60, y: 54 },
    ),
  ],
  "white-city-deep-canyon": [
    galleryImage(
      "white-city-deep-canyon",
      "01-z8n0729-enhanced-nr-copy.jpg",
      "Woman standing in a red doorway in a Peruvian highland town.",
      { x: 76, y: 53 },
    ),
    galleryImage(
      "white-city-deep-canyon",
      "02-z8n0934.jpg",
      "Cultivated strips run towards cloud-covered Andean mountains in southern Peru.",
      { x: 51, y: 55 },
    ),
    galleryImage(
      "white-city-deep-canyon",
      "03-z8n7811-copy.jpg",
      "Cattle graze on a dry high-altitude plain in southern Peru.",
      { x: 39, y: 59 },
    ),
    galleryImage(
      "white-city-deep-canyon",
      "04-london-0j.jpg",
      "Field of yellow wildflowers below green terraced mountains under a heavy grey sky in the southern Peruvian Andes.",
      { x: 52, y: 48 },
    ),
    galleryImage(
      "white-city-deep-canyon",
      "05-london-0ps.jpg",
      "Dirt road running between highland fields and a wall of dark mountains.",
      { x: 50, y: 62 },
    ),
    galleryImage(
      "white-city-deep-canyon",
      "06-london-02.jpg",
      "Andean woman in a hat walking a roadside path past green highland fields under a heavy grey sky.",
      { x: 48, y: 62 },
    ),
  ],
  "the-stone-road": [
    galleryImage(
      "the-stone-road",
      "01-cuscco-01.jpg",
      "Woman walking along a white-walled street in Cusco.",
      { x: 72, y: 55 },
    ),
    galleryImage(
      "the-stone-road",
      "02-cusco-13.jpg",
      "Child watching from the doorway of a carpenter's workshop in Cusco.",
      { x: 73, y: 53 },
    ),
    galleryImage(
      "the-stone-road",
      "03-cusco-15.jpg",
      "Market vendor sitting beneath a devotional image in Cusco.",
      { x: 51, y: 53 },
    ),
    galleryImage(
      "the-stone-road",
      "04-cusco-19.jpg",
      "Two motorcycles rest against a weathered green wall in Cusco.",
      { x: 69, y: 58 },
    ),
    galleryImage(
      "the-stone-road",
      "05-z8n9873-copy.jpg",
      "Two donkeys graze among agaves above the Sacred Valley.",
      { x: 49, y: 59 },
    ),
  ],
  "both-shores": [
    galleryImage(
      "both-shores",
      "01-drive-la-paz-puno-05.jpg",
      "Tractor working fields on the high plateau between Puno and La Paz.",
      { x: 53, y: 57 },
    ),
    galleryImage(
      "both-shores",
      "02-drive-la-paz-puno-09.jpg",
      "Small handwritten word marking a white roadside wall near Lake Titicaca.",
      { x: 50, y: 51 },
    ),
    galleryImage(
      "both-shores",
      "03-drive-la-paz-puno-10.jpg",
      "Yellow truck passing a pedestrian on the high road towards La Paz.",
      { x: 47, y: 54 },
    ),
    galleryImage(
      "both-shores",
      "04-drive-la-paz-puno-01.jpg",
      "Woman walking across wet ground past stacked ladders on the edge of a highland town.",
      { x: 72, y: 59 },
    ),
    galleryImage(
      "both-shores",
      "05-drive-la-paz-puno-04.jpg",
      "Dark farm building standing on the open altiplano near grazing animals.",
      { x: 33, y: 56 },
    ),
  ],
  "thin-air-cloud-forest": [
    galleryImage(
      "thin-air-cloud-forest",
      "01-la-paz-05.jpg",
      "Flower seller working among bundles of pale blooms in La Paz.",
      { x: 64, y: 53 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "02-la-paz-09-copy-2.jpg",
      "Passenger boarding a painted bus on a steep street in La Paz.",
      { x: 73, y: 54 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "03-drive-uyuni-lapaz-03.jpg",
      "Cyclist passing a lathe workshop on the outskirts of La Paz.",
      { x: 35, y: 55 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "04-drive-uyuni-lapaz-04.jpg",
      "Two women and a man stand beside a yellow wall painted with election slogans in Bolivia.",
      { x: 50, y: 54 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "05-drive-uyuni-lapaz-010.jpg",
      "Woman standing outside an adobe home under a wide turquoise sky.",
      { x: 69, y: 56 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "06-drive-uyuni-lapaz-011.jpg",
      "Cyclist riding past corrugated buildings on a Bolivian roadside.",
      { x: 75, y: 53 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "07-drive-uyuni-lapaz-300.jpg",
      "Woman carrying market goods through a narrow street in La Paz.",
      { x: 52, y: 52 },
    ),
  ],
  "silver-and-bone": [
    galleryImage(
      "silver-and-bone",
      "01-bolivia-01-3.jpg",
      "Traders and families gather around a truck and stacked crates on the Bolivian altiplano.",
      { x: 50, y: 57 },
    ),
    galleryImage(
      "silver-and-bone",
      "02-bolivia-01a.jpg",
      "Shepherd tending sheep beside a small highland settlement.",
      { x: 45, y: 57 },
    ),
    galleryImage(
      "silver-and-bone",
      "03-bolivia-02a.jpg",
      "Two women sit on a guardrail beside a remote Bolivian road.",
      { x: 78, y: 56 },
    ),
    galleryImage(
      "silver-and-bone",
      "04-bolivia-03a.jpg",
      "Flock of sheep spreading across a pale high-altitude valley.",
      { x: 51, y: 57 },
    ),
    galleryImage(
      "silver-and-bone",
      "05-bolivia-04a.jpg",
      "Small truck standing at the foot of a hill on the altiplano beneath towering clouds.",
      { x: 77, y: 59 },
    ),
    galleryImage(
      "silver-and-bone",
      "06-bolivia-07a.jpg",
      "Cow grazing among dry grasses on the Bolivian plateau, two more resting behind.",
      { x: 47, y: 58 },
    ),
    galleryImage(
      "silver-and-bone",
      "07-drive-uyuni-lapaz-09.jpg",
      "Storm clouds gather above a rocky plain on the road to Uyuni.",
      { x: 52, y: 47 },
    ),
    galleryImage(
      "silver-and-bone",
      "08-drive-uyuni-lapaz-012.jpg",
      "Flock of sheep rounding a bend in a highland road.",
      { x: 44, y: 55 },
    ),
    galleryImage(
      "silver-and-bone",
      "09-drive-uyuni-lapaz-013-2.jpg",
      "Road descending towards a hazy Bolivian city beneath the mountains.",
      { x: 50, y: 58 },
    ),
    galleryImage(
      "silver-and-bone",
      "10-drive-uyuni-lapaz-29.jpg",
      "Flower seller sitting in blue overalls among baskets of white and pink blooms.",
      { x: 67, y: 52 },
    ),
  ],
  "the-mirror": [
    galleryImage(
      "the-mirror",
      "01-uyuni-01.jpg",
      "Shallow high-altitude lagoon reflecting the mountains near Uyuni.",
      { x: 53, y: 52 },
    ),
    galleryImage(
      "the-mirror",
      "02-uyuni-04.jpg",
      "Flamingos feed in a rust-coloured lagoon beneath volcanic hills.",
      { x: 53, y: 55 },
    ),
    galleryImage(
      "the-mirror",
      "03-uyuni-05.jpg",
      "Turquoise lagoon cutting through the white mineral plain near Uyuni.",
      { x: 51, y: 52 },
    ),
    galleryImage(
      "the-mirror",
      "04-bolivia-11a.jpg",
      "Red water and white salt form bands across a Bolivian lagoon.",
      { x: 54, y: 55 },
    ),
    galleryImage(
      "the-mirror",
      "05-drive-uyuni-lapaz-07-2.jpg",
      "Herd of llamas wading through shallow water on the altiplano beneath a grey sky.",
      { x: 57, y: 54 },
    ),
  ],
  atacama: [
    galleryImage(
      "atacama",
      "01-astro-01.jpg",
      "The Milky Way spans the dark sky above Atacama rock formations.",
      { x: 60, y: 38 },
    ),
    galleryImage(
      "atacama",
      "02-astro-02.jpg",
      "Stars rise over eroded stone towers in the Atacama Desert.",
      { x: 46, y: 39 },
    ),
    galleryImage(
      "atacama",
      "03-z8n5462.jpg",
      "Star-filled sky hanging above a red canyon in the Atacama Desert.",
      { x: 52, y: 37 },
    ),
    galleryImage(
      "atacama",
      "04-dsc536-6.jpg",
      "The Milky Way appears above a jagged Atacama ridge.",
      { x: 55, y: 36 },
    ),
  ],
  "the-end-of-the-road": [
    carreteraAustralImage(
      "01-rural-ruta-7-night.webp",
      "Cow standing on a dark rural stretch of Ruta 7 in Aysén.",
    ),
    carreteraAustralImage(
      "02-villa-ohiggins-minimarket.webp",
      "Colourful minimarket frontage in Villa O’Higgins.",
    ),
    carreteraAustralImage(
      "03-cerro-castillo-valley.webp",
      "Yellow-flowering shrubs and fenced pasture beneath Cerro Castillo.",
    ),
    carreteraAustralImage(
      "04-coyhaique-ranch.webp",
      "Cattle grazing on open ranchland near Coyhaique.",
    ),
    carreteraAustralImage(
      "05-lago-general-carrera-water.webp",
      "Turquoise water of Lago General Carrera stretching towards distant mountains.",
    ),
    carreteraAustralImage(
      "06-baker-river-valley.webp",
      "The Baker River winding through a rocky valley near Puerto Bertrand.",
    ),
    carreteraAustralImage(
      "07-lago-general-carrera-shore.webp",
      "Boats pulled up along the shore of Lago General Carrera at Puerto Río Tranquilo.",
    ),
    carreteraAustralImage(
      "08-cattle-on-ruta-7.webp",
      "Cattle crossing Ruta 7 in central Aysén.",
    ),
    carreteraAustralImage(
      "09-caleta-tortel-residents.webp",
      "Two Caleta Tortel residents sitting beside a dark waterfront building.",
    ),
    carreteraAustralImage(
      "10-villa-ohiggins-steppe.webp",
      "A lone tree standing on the southern Aysén steppe near Villa O’Higgins.",
    ),
    carreteraAustralImage(
      "11-lago-ohiggins.webp",
      "Lago O’Higgins beneath a layered sky and dark mountain shore.",
    ),
  ],
} as const satisfies Readonly<
  Record<AndeanCaravanSectionSlug, readonly RisoAsset[]>
>;

export const andeanCaravanSectionImages = {
  "desert-coast": andeanCaravanSectionGalleries["desert-coast"][0],
  "white-city-deep-canyon":
    andeanCaravanSectionGalleries["white-city-deep-canyon"][0],
  "the-stone-road": andeanCaravanSectionGalleries["the-stone-road"][0],
  "both-shores": andeanCaravanSectionGalleries["both-shores"][0],
  "thin-air-cloud-forest":
    andeanCaravanSectionGalleries["thin-air-cloud-forest"][0],
  "silver-and-bone": andeanCaravanSectionGalleries["silver-and-bone"][0],
  "the-mirror": andeanCaravanSectionGalleries["the-mirror"][0],
  atacama: andeanCaravanSectionGalleries.atacama[0],
  "the-end-of-the-road": endOfRoadCardImage,
} as const satisfies Readonly<Record<AndeanCaravanSectionSlug, RisoAsset>>;

export function getAndeanCaravanImage(slug: string): RisoAsset {
  return (
    andeanCaravanSectionImages[
      slug as keyof typeof andeanCaravanSectionImages
    ] ?? andeanCaravanHeroImage
  );
}

export function getAndeanCaravanGallery(slug: string): readonly RisoAsset[] {
  return (
    andeanCaravanSectionGalleries[
      slug as keyof typeof andeanCaravanSectionGalleries
    ] ?? []
  );
}

export type CanonicalCaravanImageSlug =
  | "sea-to-stone"
  | "the-stone-road"
  | "both-shores"
  | "the-mirror"
  | "the-end-of-the-road";

const canonicalCaravanGalleries: Readonly<
  Record<CanonicalCaravanImageSlug, readonly RisoAsset[]>
> = {
  "sea-to-stone": [
    andeanCaravanSectionGalleries["desert-coast"][0],
    andeanCaravanSectionGalleries["desert-coast"][1],
    andeanCaravanSectionGalleries["desert-coast"][4],
    andeanCaravanSectionGalleries["white-city-deep-canyon"][0],
    andeanCaravanSectionGalleries["white-city-deep-canyon"][1],
    andeanCaravanSectionGalleries["white-city-deep-canyon"][4],
    andeanCaravanSectionGalleries["white-city-deep-canyon"][5],
    andeanCaravanSectionGalleries["the-stone-road"][0],
    andeanCaravanSectionGalleries["the-stone-road"][2],
    andeanCaravanSectionGalleries["the-stone-road"][4],
  ],
  "the-stone-road": andeanCaravanSectionGalleries["the-stone-road"],
  "both-shores": [
    andeanCaravanSectionGalleries["both-shores"][0],
    andeanCaravanSectionGalleries["both-shores"][1],
    andeanCaravanSectionGalleries["both-shores"][2],
    andeanCaravanSectionGalleries["both-shores"][4],
    andeanCaravanSectionGalleries["thin-air-cloud-forest"][0],
    andeanCaravanSectionGalleries["thin-air-cloud-forest"][1],
    andeanCaravanSectionGalleries["thin-air-cloud-forest"][3],
    andeanCaravanSectionGalleries["thin-air-cloud-forest"][4],
    andeanCaravanSectionGalleries["thin-air-cloud-forest"][6],
  ],
  "the-mirror": [
    andeanCaravanSectionGalleries["silver-and-bone"][0],
    andeanCaravanSectionGalleries["silver-and-bone"][2],
    andeanCaravanSectionGalleries["silver-and-bone"][4],
    andeanCaravanSectionGalleries["silver-and-bone"][6],
    andeanCaravanSectionGalleries["the-mirror"][0],
    andeanCaravanSectionGalleries["the-mirror"][1],
    andeanCaravanSectionGalleries["the-mirror"][2],
    andeanCaravanSectionGalleries["the-mirror"][4],
    andeanCaravanSectionGalleries.atacama[0],
    andeanCaravanSectionGalleries.atacama[2],
  ],
  "the-end-of-the-road":
    andeanCaravanSectionGalleries["the-end-of-the-road"],
};

const canonicalCaravanHeroImages: Readonly<
  Record<CanonicalCaravanImageSlug, RisoAsset>
> = {
  "sea-to-stone": andeanCaravanSectionGalleries["desert-coast"][0],
  "the-stone-road": andeanCaravanSectionGalleries["the-stone-road"][2],
  "both-shores": andeanCaravanSectionGalleries["both-shores"][2],
  "the-mirror": andeanCaravanSectionGalleries["the-mirror"][1],
  "the-end-of-the-road": endOfRoadHeroImage,
};

const canonicalCaravanCardImages: Readonly<
  Record<CanonicalCaravanImageSlug, RisoAsset>
> = {
  "sea-to-stone": andeanCaravanSectionGalleries["white-city-deep-canyon"][1],
  "the-stone-road": andeanCaravanSectionGalleries["the-stone-road"][4],
  "both-shores": andeanCaravanSectionGalleries["both-shores"][4],
  "the-mirror": andeanCaravanSectionGalleries["the-mirror"][0],
  "the-end-of-the-road": endOfRoadCardImage,
};

export function getCanonicalCaravanGallery(
  slug: CanonicalCaravanImageSlug,
): readonly RisoAsset[] {
  return canonicalCaravanGalleries[slug];
}

export function getCanonicalCaravanHeroImage(
  slug: CanonicalCaravanImageSlug,
): RisoAsset {
  return canonicalCaravanHeroImages[slug] ?? andeanCaravanHeroImage;
}

export function getCanonicalCaravanCardImage(
  slug: CanonicalCaravanImageSlug,
): RisoAsset {
  return canonicalCaravanCardImages[slug] ?? andeanCaravanHeroImage;
}
