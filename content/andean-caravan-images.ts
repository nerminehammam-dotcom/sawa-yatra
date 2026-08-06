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

export const andeanCaravanHeroImage = image(
  "gallery/the-end-of-the-road/01-patagonia-62.jpg",
  "A motorcyclist follows a gravel road towards snow-covered Patagonian peaks.",
  { x: 52, y: 61 },
);

export const andeanCaravanSectionGalleries = {
  "desert-coast": [
    galleryImage(
      "desert-coast",
      "01-lima-01.jpg",
      "A woman stands in the pale green doorway of a Lima building.",
      { x: 78, y: 54 },
    ),
    galleryImage(
      "desert-coast",
      "02-lima-02.jpg",
      "An artisan restores a religious figure inside a Lima workshop.",
      { x: 57, y: 54 },
    ),
    galleryImage(
      "desert-coast",
      "03-lima-05.jpg",
      "A street vendor sits beside small stools against a weathered green wall in Lima.",
      { x: 27, y: 55 },
    ),
    galleryImage(
      "desert-coast",
      "04-lima-08.jpg",
      "A costumed performer pauses beside a tall wooden doorway in Lima.",
      { x: 72, y: 58 },
    ),
    galleryImage(
      "desert-coast",
      "05-lima-017a.jpg",
      "A police officer stands outside a white civic building in Lima.",
      { x: 51, y: 49 },
    ),
    galleryImage(
      "desert-coast",
      "06-lima-017ae.jpg",
      "A cyclist fills containers at a public fountain set into a stone wall.",
      { x: 60, y: 54 },
    ),
  ],
  "white-city-deep-canyon": [
    galleryImage(
      "white-city-deep-canyon",
      "01-z8n0729-enhanced-nr-copy.jpg",
      "A woman stands in a red doorway in a Peruvian highland town.",
      { x: 76, y: 53 },
    ),
    galleryImage(
      "white-city-deep-canyon",
      "02-z8n0934.jpg",
      "A tractor crosses cultivated fields beneath cloud-covered Andean mountains.",
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
      "Green Andean ridges rise beneath fast-moving clouds.",
      { x: 52, y: 48 },
    ),
    galleryImage(
      "white-city-deep-canyon",
      "05-london-0ps.jpg",
      "A dirt road runs between highland fields and a wall of dark mountains.",
      { x: 50, y: 62 },
    ),
    galleryImage(
      "white-city-deep-canyon",
      "06-london-02.jpg",
      "A lone walker follows a green highland road under a heavy sky.",
      { x: 69, y: 59 },
    ),
  ],
  "the-stone-road": [
    galleryImage(
      "the-stone-road",
      "01-cuscco-01.jpg",
      "A woman walks along a white-walled street in Cusco.",
      { x: 72, y: 55 },
    ),
    galleryImage(
      "the-stone-road",
      "02-cusco-13.jpg",
      "A child watches from the doorway of a carpenter's workshop in Cusco.",
      { x: 73, y: 53 },
    ),
    galleryImage(
      "the-stone-road",
      "03-cusco-15.jpg",
      "A market vendor sits beneath a devotional image in Cusco.",
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
      "A horse grazes among agaves in the Sacred Valley.",
      { x: 49, y: 59 },
    ),
  ],
  "both-shores": [
    galleryImage(
      "both-shores",
      "01-drive-la-paz-puno-05.jpg",
      "A tractor works fields on the high plateau between Puno and La Paz.",
      { x: 53, y: 57 },
    ),
    galleryImage(
      "both-shores",
      "02-drive-la-paz-puno-09.jpg",
      "A small handwritten word marks a white roadside wall near Lake Titicaca.",
      { x: 50, y: 51 },
    ),
    galleryImage(
      "both-shores",
      "03-drive-la-paz-puno-10.jpg",
      "A yellow truck passes a pedestrian on the high road towards La Paz.",
      { x: 47, y: 54 },
    ),
    galleryImage(
      "both-shores",
      "04-drive-la-paz-puno-01.jpg",
      "A woman crosses a highland farmyard beneath a dramatic sky.",
      { x: 72, y: 59 },
    ),
    galleryImage(
      "both-shores",
      "05-drive-la-paz-puno-04.jpg",
      "A dark farm building stands on the open altiplano near grazing animals.",
      { x: 33, y: 56 },
    ),
    galleryImage(
      "both-shores",
      "06-drive-la-paz-puno-05.jpg",
      "A tractor crosses striped fields on the road between La Paz and Puno.",
      { x: 56, y: 55 },
    ),
  ],
  "thin-air-cloud-forest": [
    galleryImage(
      "thin-air-cloud-forest",
      "01-la-paz-05.jpg",
      "A flower seller works among bundles of pale blooms in La Paz.",
      { x: 64, y: 53 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "02-la-paz-09-copy-2.jpg",
      "A passenger boards a painted bus on a steep street in La Paz.",
      { x: 73, y: 54 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "03-drive-uyuni-lapaz-03.jpg",
      "A cyclist passes a brick workshop on the outskirts of La Paz.",
      { x: 35, y: 55 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "04-drive-uyuni-lapaz-04.jpg",
      "Three women stand beside a painted roadside wall in Bolivia.",
      { x: 50, y: 54 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "05-drive-uyuni-lapaz-010.jpg",
      "A woman stands outside an adobe home under a wide turquoise sky.",
      { x: 69, y: 56 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "06-drive-uyuni-lapaz-011.jpg",
      "A cyclist rides past corrugated buildings on a Bolivian roadside.",
      { x: 75, y: 53 },
    ),
    galleryImage(
      "thin-air-cloud-forest",
      "07-drive-uyuni-lapaz-300.jpg",
      "A woman carries market goods through a narrow street in La Paz.",
      { x: 52, y: 52 },
    ),
  ],
  "silver-and-bone": [
    galleryImage(
      "silver-and-bone",
      "01-bolivia-01-3.jpg",
      "Families and livestock gather beside a road on the Bolivian altiplano.",
      { x: 50, y: 57 },
    ),
    galleryImage(
      "silver-and-bone",
      "02-bolivia-01a.jpg",
      "A shepherd tends sheep beside a small highland settlement.",
      { x: 45, y: 57 },
    ),
    galleryImage(
      "silver-and-bone",
      "03-bolivia-02a.jpg",
      "A woman waits beside a guardrail on a remote Bolivian road.",
      { x: 78, y: 56 },
    ),
    galleryImage(
      "silver-and-bone",
      "04-bolivia-03a.jpg",
      "A flock of sheep spreads across a pale high-altitude valley.",
      { x: 51, y: 57 },
    ),
    galleryImage(
      "silver-and-bone",
      "05-bolivia-04a.jpg",
      "A small truck crosses the altiplano beneath towering clouds.",
      { x: 77, y: 59 },
    ),
    galleryImage(
      "silver-and-bone",
      "06-bolivia-07a.jpg",
      "Llamas graze among dry grasses on the Bolivian plateau.",
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
      "A flock of sheep rounds a bend in a highland road.",
      { x: 44, y: 55 },
    ),
    galleryImage(
      "silver-and-bone",
      "09-drive-uyuni-lapaz-013-2.jpg",
      "A road descends towards a hazy Bolivian city beneath the mountains.",
      { x: 50, y: 58 },
    ),
    galleryImage(
      "silver-and-bone",
      "10-drive-uyuni-lapaz-29.jpg",
      "A market worker sorts flowers and fabric by hand.",
      { x: 67, y: 52 },
    ),
  ],
  "the-mirror": [
    galleryImage(
      "the-mirror",
      "01-uyuni-01.jpg",
      "A shallow high-altitude lagoon reflects the mountains near Uyuni.",
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
      "A turquoise lagoon cuts through the white mineral plain near Uyuni.",
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
      "Flamingos stand in a shallow lagoon beneath a grey sky.",
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
      "A star-filled sky hangs above a red canyon in the Atacama Desert.",
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
    galleryImage(
      "the-end-of-the-road",
      "01-patagonia-62.jpg",
      "A motorcyclist follows a gravel road towards snow-covered Patagonian peaks.",
      { x: 52, y: 61 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "02-patagonia-13.jpg",
      "A narrow road crosses tawny grasslands beneath a Patagonian escarpment.",
      { x: 46, y: 60 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "03-patagonia-10.jpg",
      "Moonlight lays a silver path across a Patagonian lake.",
      { x: 49, y: 49 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "04-patagonia-8.jpg",
      "A traveller walks along a black Patagonian beach beneath forested hills.",
      { x: 56, y: 59 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "05-patagonia-04.jpg",
      "An orange vehicle crosses a broad Patagonian riverbed at dusk.",
      { x: 31, y: 57 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "06-paragonia-02.jpg",
      "A pale blue Patagonian lake stretches towards distant mountains.",
      { x: 50, y: 51 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "07-patagoina-01.jpg",
      "A gravel road runs through open Patagonian ranchland.",
      { x: 50, y: 58 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "08-patagonia-03.jpg",
      "A clear river winds between autumn forest and red Patagonian peaks.",
      { x: 55, y: 52 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "09-patagonia-41.jpg",
      "A still Patagonian lake rests beneath a line of snow-covered mountains.",
      { x: 52, y: 50 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "10-z8n7627-copy.jpg",
      "A vehicle approaches along a stony road in Patagonia.",
      { x: 53, y: 56 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "11-patagonia-50.jpg",
      "A rider follows horses beside a long lake in southern Patagonia.",
      { x: 54, y: 58 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "12-z8n7909-copy.jpg",
      "A gravel road curves between a Patagonian lake and a rocky cliff.",
      { x: 61, y: 58 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "13-chile-016.jpg",
      "A mountain road disappears into mist and autumn forest.",
      { x: 50, y: 60 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "14-patagonia-5.jpg",
      "Long evening light softens a lake between dark Patagonian ridges.",
      { x: 54, y: 51 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "15-naila-06.jpg",
      "A brown cow stands before snow-dusted mountains in Patagonia.",
      { x: 52, y: 57 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "16-patagonia-36.jpg",
      "A pale road winds through rolling Patagonian foothills.",
      { x: 52, y: 57 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "17-patagonia-37.jpg",
      "Dark mountains frame a steel-grey lake beneath storm clouds.",
      { x: 53, y: 50 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "18-patagonia-33.jpg",
      "A small boat rests on a Patagonian shore below snow-covered mountains.",
      { x: 49, y: 57 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "19-chile-011.jpg",
      "Red autumn leaves and pale boulders cover a Patagonian hillside.",
      { x: 51, y: 53 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "20-patagonia-2.jpg",
      "A small boat sits on a rocky shore beside a misty Patagonian lake.",
      { x: 54, y: 56 },
    ),
    galleryImage(
      "the-end-of-the-road",
      "21-naila-03.jpg",
      "A copper-coloured river bends through an autumn Patagonian valley.",
      { x: 48, y: 53 },
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
  "the-end-of-the-road":
    andeanCaravanSectionGalleries["the-end-of-the-road"][0],
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
