/**
 * Single source for every departure date shown anywhere on the site.
 *
 * Before this existed the site gave three different answers: the announcement
 * banner said February 2028, the hop-on hop-off page said January–April 2027,
 * and content/journeys.ts said February 2027. Founder-confirmed 5 August 2026:
 * the season is February–April 2028. Change it here and nowhere else.
 */
export const ANDEAN_CARAVAN_FIRST_DEPARTURE = "February 2028" as const;
export const ANDEAN_CARAVAN_SEASON = "February–April 2028" as const;
export const ANDEAN_CARAVAN_SECURED_DATE_LINE =
  "exact dates announced when the route is secured" as const;

export const ANDEAN_CARAVAN_PUBLIC_DATE =
  `${ANDEAN_CARAVAN_SEASON} · ${ANDEAN_CARAVAN_SECURED_DATE_LINE}` as const;

export type AndeanCaravanGateId =
  | "lima"
  | "arequipa"
  | "puno-stone-road"
  | "cusco-stone-road"
  | "puno-both-shores"
  | "la-paz"
  | "sucre"
  | "uyuni"
  | "san-pedro"
  | "santiago"
  | "balmaceda";

export interface AndeanCaravanGate {
  readonly id: AndeanCaravanGateId;
  readonly name: string;
  readonly airport: string;
  readonly note: string;
}

export type AndeanCaravanSectionSlug =
  | "desert-coast"
  | "white-city-deep-canyon"
  | "the-stone-road"
  | "both-shores"
  | "thin-air-cloud-forest"
  | "silver-and-bone"
  | "the-mirror"
  | "atacama"
  | "the-end-of-the-road";

const canonicalSectionSlugByLegacySlug: Readonly<
  Record<AndeanCaravanSectionSlug, string>
> = {
  "desert-coast": "sea-to-stone",
  "white-city-deep-canyon": "sea-to-stone",
  "the-stone-road": "the-stone-road",
  "both-shores": "both-shores",
  "thin-air-cloud-forest": "both-shores",
  "silver-and-bone": "the-mirror",
  "the-mirror": "the-mirror",
  "atacama": "the-mirror",
  "the-end-of-the-road": "the-end-of-the-road",
};

export function andeanCaravanSectionHref(
  slug: AndeanCaravanSectionSlug,
): `/journeys/caravans/andean-caravan/${string}` {
  return `/journeys/caravans/andean-caravan/${canonicalSectionSlugByLegacySlug[slug]}`;
}

export type AndeanCaravanPublicEnquiryId =
  | "andean-caravan-complete"
  | "andean-caravan-section-01"
  | "andean-caravan-section-02"
  | "andean-caravan-section-03"
  | "andean-caravan-section-04"
  | "andean-caravan-section-05"
  | "andean-caravan-section-06"
  | "andean-caravan-section-07"
  | "andean-caravan-section-08"
  | "andean-caravan-section-09";

export interface AndeanCaravanSection {
  readonly id: string;
  readonly slug: AndeanCaravanSectionSlug;
  readonly sectionNumber: number;
  readonly title: string;
  readonly route: string;
  readonly joinGateIds: readonly AndeanCaravanGateId[];
  readonly leaveGateId: AndeanCaravanGateId;
  readonly durationDays: number;
  readonly promise: string;
  readonly publicDateWindow: string;
  readonly standaloneWindows: readonly string[];
  readonly altitude: string;
  readonly group: string;
  readonly countries: readonly string[];
  readonly whyThisSectionExists: readonly string[];
  readonly journeyShape: readonly string[];
  readonly feature: readonly string[];
  readonly warnings: readonly string[];
  readonly price: "Price on request";
  readonly publicEnquiryId: AndeanCaravanPublicEnquiryId;
}

export interface AndeanCaravan {
  readonly id: "andean-caravan";
  readonly slug: "the-andean-caravan";
  readonly productName: "The Andean Caravan";
  readonly editorialTitle: "The Long Spine";
  readonly familyName: "Caravans";
  readonly durationDays: 71;
  readonly countries: readonly ["Peru", "Bolivia", "Chile"];
  readonly publicDateWindow: typeof ANDEAN_CARAVAN_PUBLIC_DATE;
  readonly group: string;
  readonly price: "Price on request";
  readonly completeEnquiryId: AndeanCaravanPublicEnquiryId;
  readonly landingCopy: readonly string[];
  readonly overviewCopy: readonly string[];
  readonly completeCopy: readonly string[];
  readonly principles: readonly {
    readonly title: string;
    readonly body: string;
  }[];
  readonly conditions: readonly string[];
  readonly route: string;
}

export const andeanCaravanGates = [
  { id: "lima", name: "Lima", airport: "LIM", note: "Caravan start" },
  { id: "arequipa", name: "Arequipa", airport: "AQP", note: "Rest day built in" },
  { id: "puno-stone-road", name: "Puno", airport: "JUL", note: "Stone Road joining gate" },
  { id: "cusco-stone-road", name: "Cusco", airport: "CUZ", note: "Alternative Stone Road gate" },
  { id: "puno-both-shores", name: "Puno", airport: "JUL", note: "Both Shores joining gate" },
  { id: "la-paz", name: "La Paz", airport: "LPB", note: "High-altitude joining gate" },
  { id: "sucre", name: "Sucre", airport: "SRE", note: "Bolivian joining gate" },
  { id: "uyuni", name: "Uyuni", airport: "UYU", note: "Salt-route joining gate" },
  { id: "san-pedro", name: "San Pedro de Atacama", airport: "CJC", note: "Desert joining gate" },
  { id: "santiago", name: "Santiago", airport: "SCL", note: "Patagonia joining gate" },
  { id: "balmaceda", name: "Balmaceda", airport: "BBA", note: "Final flight gateway" },
] as const satisfies readonly AndeanCaravanGate[];

export const andeanCaravanGateById = Object.fromEntries(
  andeanCaravanGates.map((gate) => [gate.id, gate]),
) as Readonly<Record<AndeanCaravanGateId, AndeanCaravanGate>>;

const price = "Price on request" as const;
const securedDateLine = ANDEAN_CARAVAN_SECURED_DATE_LINE;

export const andeanCaravanSections = [
  {
    id: "andean-section-01",
    slug: "desert-coast",
    sectionNumber: 1,
    title: "Desert Coast",
    route: "Lima → Paracas → Nazca → Arequipa",
    joinGateIds: ["lima"],
    leaveGateId: "arequipa",
    durationDays: 9,
    promise: "Pacific light, pre-Inca cities, islands, desert cemeteries and the Nazca Lines.",
    publicDateWindow: `February 2028 · ${securedDateLine}`,
    standaloneWindows: [
      "December–March, the only months the coast escapes the garúa fog.",
    ],
    altitude: "Sea level, rising to 2,335 m on the final day",
    group: "Up to 16 travellers",
    countries: ["Peru"],
    whyThisSectionExists: [
      "The part of Peru people fly over.",
      "Peru's south coast contains a pre-Inca oracle city, an Inca palace with pigment still on its adobe walls, islands of sea lions and Humboldt penguins, a desert cemetery and the Nazca Lines seen from the air before the thermals start.",
    ],
    journeyShape: [
      "Four days in Lima: Museo Larco, Pachacámac, Barranco and a food day beginning at Surquillo market. Then south to Tambo Colorado and Paracas for the Ballestas and red-sand reserve.",
      "Nazca brings the early overflight and Chauchilla before the long desert run to Arequipa along the Panamericana.",
    ],
    feature: [
      "Chosen for the light.",
      "February air on this coast is the clearest of the year.",
    ],
    warnings: [],
    price,
    publicEnquiryId: "andean-caravan-section-01",
  },
  {
    id: "andean-section-02",
    slug: "white-city-deep-canyon",
    sectionNumber: 2,
    title: "White City, Deep Canyon",
    route: "Arequipa → Colca → Puno",
    joinGateIds: ["arequipa"],
    leaveGateId: "puno-stone-road",
    durationDays: 7,
    promise: "Volcanic architecture, mountain ritual, Colca Canyon and the ascent to Titicaca.",
    publicDateWindow: `February 2028 · ${securedDateLine}`,
    standaloneWindows: [
      "April–November, dry conditions, active condors and clear volcano views.",
    ],
    altitude: "2,335 m → 3,600 m → 3,800 m, over a 4,910 m pass",
    group: "Up to 16 travellers",
    countries: ["Peru"],
    whyThisSectionExists: [
      "White volcanic stone, a walled monastery and a canyon twice the depth of the Grand Canyon.",
      "Arequipa sits beneath three volcanoes. Beyond it, Colca Canyon opens towards terraces, mountain communities and condors riding the morning thermals.",
    ],
    journeyShape: [
      "Two acclimatising days in Arequipa, then over the Patapampa pass into the Colca for three nights in the valley.",
      "The route continues to Puno, with Sillustani held for the final light.",
    ],
    feature: [
      "The altitude ladder.",
      "The gradual ascent is what prepares the route for the Titicaca shore.",
    ],
    warnings: ["The road crosses a 4,910-metre pass before reaching Puno."],
    price,
    publicEnquiryId: "andean-caravan-section-02",
  },
  {
    id: "andean-section-03",
    slug: "the-stone-road",
    sectionNumber: 3,
    title: "The Stone Road",
    route: "Puno or Cusco → Machu Picchu → Titicaca train → Puno",
    joinGateIds: ["puno-stone-road", "cusco-stone-road"],
    leaveGateId: "puno-both-shores",
    durationDays: 8,
    promise: "The archaeological road to Cusco, Machu Picchu and the Titicaca train.",
    publicDateWindow: `February 2028 · ${securedDateLine}`,
    standaloneWindows: ["May–September, dry season and a clearer citadel."],
    altitude: "3,400–3,800 m",
    group: "Up to 16 travellers",
    countries: ["Peru"],
    whyThisSectionExists: [
      "Arrive in Cusco by following the archaeological corridor, not by flying over it.",
      "The route climbs from Puno through Pukará, La Raya, Raqchi and Andahuaylillas before Cusco, the Sacred Valley, two separate entries to Machu Picchu and the South Valley.",
    ],
    journeyShape: [
      "The corridor drive leads into Cusco, Pisac, Maras, Moray and Ollantaytambo, followed by two citadel entries on different circuits.",
      "The return to Puno is aboard the Titicaca train, crossing La Raya at 4,338 metres.",
    ],
    feature: [
      "Cloud belongs in the story.",
      "The Caravan reaches Machu Picchu in the wet season, when cloud and rain may partly erase the citadel. Standalone journeys run in the clearer dry season.",
    ],
    warnings: ["Wet-season rain can mean wet paths and limited visibility."],
    price,
    publicEnquiryId: "andean-caravan-section-03",
  },
  {
    id: "andean-section-04",
    slug: "both-shores",
    sectionNumber: 4,
    title: "Both Shores",
    route: "Puno → Amantaní → Copacabana → Isla del Sol → La Paz",
    joinGateIds: ["puno-both-shores"],
    leaveGateId: "la-paz",
    durationDays: 7,
    promise: "Titicaca in two countries, Amantaní, Isla del Sol and a border crossed on foot.",
    publicDateWindow: `February–March 2028 · ${securedDateLine}`,
    standaloneWindows: ["April–October."],
    altitude: "Around 3,800 m throughout",
    group: "Up to 12 travellers",
    countries: ["Peru", "Bolivia"],
    whyThisSectionExists: [
      "Give Lake Titicaca a week and both countries.",
      "The route sleeps on Amantaní in a family house, climbs Pachatata at dawn, crosses the Kasani border on foot and stays on Isla del Sol, where the Inca creation story begins.",
    ],
    journeyShape: [
      "Uros and Taquile lead to a family stay on Amantaní, followed by Copacabana and a night on Isla del Sol.",
      "The route crosses the Tiquina strait on a wooden barge before descending into La Paz.",
    ],
    feature: [
      "The family stay is the section.",
      "The Amantaní night has no hotel tier: a family cooks and travellers sleep in their home.",
    ],
    warnings: ["The Amantaní night is a family stay rather than a hotel."],
    price,
    publicEnquiryId: "andean-caravan-section-04",
  },
  {
    id: "andean-section-05",
    slug: "thin-air-cloud-forest",
    sectionNumber: 5,
    title: "Thin Air & Cloud Forest",
    route: "La Paz → Tiwanaku → the Yungas → Sajama → Sucre",
    joinGateIds: ["la-paz"],
    leaveGateId: "sucre",
    durationDays: 9,
    promise: "Cable cars, Tiwanaku, the Yungas and the high emptiness of Sajama.",
    publicDateWindow: `March 2028 · ${securedDateLine}`,
    standaloneWindows: ["May–October, the drier season."],
    altitude: "3,600 m → 1,700 m → 4,200 m",
    group: "Up to 12 travellers",
    countries: ["Bolivia"],
    whyThisSectionExists: [
      "A high city, a descent into cloud forest and the open altiplano.",
      "La Paz's cable cars reveal the city from above. Three hours down, the Andes fall into Yungas coffee country; west lies Sajama, with dawn geysers and the world's highest forest.",
    ],
    journeyShape: [
      "Four days in and around La Paz and Tiwanaku are followed by two nights at Coroico in the Yungas.",
      "The journey then rises again for two nights at Sajama before continuing to Sucre.",
    ],
    feature: [
      "Engineered rest disguised as a destination.",
      "The Yungas descent gives the route a restorative interval before later high-altitude sections.",
    ],
    warnings: ["The Death Road is not part of the scheduled itinerary."],
    price,
    publicEnquiryId: "andean-caravan-section-05",
  },
  {
    id: "andean-section-06",
    slug: "silver-and-bone",
    sectionNumber: 6,
    title: "Silver & Bone",
    route: "Sucre → Potosí → Uyuni",
    joinGateIds: ["sucre"],
    leaveGateId: "uyuni",
    durationDays: 7,
    promise: "Dinosaur tracks, textiles, colonial wealth and the mountain that financed an empire.",
    publicDateWindow: `March 2028 · ${securedDateLine}`,
    standaloneWindows: ["April–October."],
    altitude: "2,750 m → 4,090 m → 3,650 m",
    group: "Up to 12 travellers",
    countries: ["Bolivia"],
    whyThisSectionExists: [
      "A skipped city, five thousand dinosaur footprints and the history of one mountain.",
      "Sucre opens into Cal Orck'o's vertical dinosaur trackway and the textile traditions around Maragua. Potosí carries the story of colonial wealth before the route descends to Uyuni.",
    ],
    journeyShape: [
      "Three days in and around Sucre lead to Potosí's Casa de la Moneda and colonial core.",
      "The route then reaches Uyuni through the train cemetery, Colchani and the first line of salt on the horizon.",
    ],
    feature: [
      "Landscape written in wealth and extraction.",
      "This section links deep time at Cal Orck'o with the colonial history carried by Potosí and Cerro Rico.",
    ],
    warnings: [],
    price,
    publicEnquiryId: "andean-caravan-section-06",
  },
  {
    id: "andean-section-07",
    slug: "the-mirror",
    sectionNumber: 7,
    title: "The Mirror",
    route: "Uyuni → the Salar → the Lagunas → San Pedro de Atacama",
    joinGateIds: ["uyuni"],
    leaveGateId: "san-pedro",
    durationDays: 7,
    promise: "Flooded salt, flamingo lagoons, dawn geysers and a high border crossing.",
    publicDateWindow: `March 2028 · ${securedDateLine}`,
    standaloneWindows: [
      "The Mirror: January–March, when water lies on the salt.",
      "The White Desert: May–October, with full crust access and no water.",
    ],
    altitude: "3,650 m → 4,900 m → 2,400 m",
    group: "Maximum 12 travellers",
    countries: ["Bolivia", "Chile"],
    whyThisSectionExists: [
      "A horizon erased by water, then the altiplano proper.",
      "The Salar stretches across ten thousand square kilometres. South lie red lagoons with flamingos, stone formations, dawn geysers, Laguna Verde and a border crossed on foot between vehicles.",
    ],
    journeyShape: [
      "The Tunupa north shore and Coquesa lead to two full days on the Salar, followed by the high Lagunas crossing.",
      "The route exits at Hito Cajón and descends 2,500 metres into San Pedro de Atacama.",
    ],
    feature: [
      "The route changes identity with the season.",
      "Wet-season journeys are The Mirror; the same route becomes The White Desert during the dry season.",
    ],
    warnings: [
      "Three nights on the Lagunas route use simple refuges above 4,300 metres, with shared bathrooms and limited heating. There is no luxury tier on this crossing.",
    ],
    price,
    publicEnquiryId: "andean-caravan-section-07",
  },
  {
    id: "andean-section-08",
    slug: "atacama",
    sectionNumber: 8,
    title: "Atacama",
    route: "San Pedro de Atacama → Santiago",
    joinGateIds: ["san-pedro"],
    leaveGateId: "santiago",
    durationDays: 4,
    promise: "Salt flats, high lagoons, geysers and the southern night sky.",
    publicDateWindow: `March–April 2028 · ${securedDateLine}`,
    standaloneWindows: ["Year-round."],
    altitude: "2,400 m base, with day trips to 4,320 m",
    group: "Up to 16 travellers",
    countries: ["Chile"],
    whyThisSectionExists: [
      "The shortest section on the spine and the easiest to connect.",
      "The Atacama brings salt flats with flamingos, altiplanic lagoons, dawn geysers and the clearest night sky in the southern hemisphere.",
    ],
    journeyShape: [
      "An arrival afternoon and Valle de la Luna at sunset lead into Toconao, the Salar de Atacama, Piedras Rojas, Miscanti and Miñiques.",
      "El Tatio at dawn, Machuca and the Puritama hot springs are followed by the flight south.",
    ],
    feature: [
      "Four days, one base.",
      "No packing and repacking: in a 71-day journey, this is where people breathe.",
    ],
    warnings: [],
    price,
    publicEnquiryId: "andean-caravan-section-08",
  },
  {
    id: "andean-section-09",
    slug: "the-end-of-the-road",
    sectionNumber: 9,
    title: "The End of the Road",
    route: "Santiago → Carretera Austral → Villa O’Higgins → Balmaceda",
    joinGateIds: ["santiago"],
    leaveGateId: "balmaceda",
    durationDays: 13,
    promise: "The Carretera Austral, marble caves, Tortel and Villa O’Higgins.",
    publicDateWindow: `April 2028 · ${securedDateLine}`,
    standaloneWindows: [
      "November–March, while the annual Caravan travels at the edge of the season in April.",
    ],
    altitude: "Sea level",
    group: "Maximum 12 travellers",
    countries: ["Chile"],
    whyThisSectionExists: [
      "A road that stops dead at a village on a lake.",
      "The Carretera Austral runs through gravel, rainforest and Patagonian water to Villa O’Higgins. Along the way are marble caves, the Baker–Nef confluence and Caleta Tortel's cypress boardwalks.",
    ],
    journeyShape: [
      "After Santiago, the route flies to Balmaceda and travels south through Cerro Castillo, Río Tranquilo, Cochrane and Tortel to Villa O’Higgins.",
      "The return changes perspective through Chile Chico and crosses Lago General Carrera by ferry before Coyhaique/Balmaceda.",
    ],
    feature: [
      "Patagonian autumn at the edge of the season.",
      "The lenga forests turn red and gold in early April after the summer crowds have gone, as the final sailings approach.",
    ],
    warnings: [
      "Villa O’Higgins offers a comfortable local standard rather than a conventional high-end tier.",
      "Tortel has no streets; access involves boardwalks and stairs, and luggage must be carried from the vehicle.",
    ],
    price,
    publicEnquiryId: "andean-caravan-section-09",
  },
] as const satisfies readonly AndeanCaravanSection[];

export const andeanCaravanSectionBySlug = Object.fromEntries(
  andeanCaravanSections.map((section) => [section.slug, section]),
) as unknown as Readonly<
  Record<AndeanCaravanSectionSlug, AndeanCaravanSection>
>;

export const andeanCaravanSectionById = Object.fromEntries(
  andeanCaravanSections.map((section) => [section.id, section]),
) as Readonly<Record<string, AndeanCaravanSection>>;

export const andeanCaravanPublicEnquiryIds = [
  "andean-caravan-complete",
  ...andeanCaravanSections.map((section) => section.publicEnquiryId),
] as const satisfies readonly AndeanCaravanPublicEnquiryId[];

export const andeanCaravan: AndeanCaravan = {
  id: "andean-caravan",
  slug: "the-andean-caravan",
  productName: "The Andean Caravan",
  editorialTitle: "The Long Spine",
  familyName: "Caravans",
  durationDays: 71,
  countries: ["Peru", "Bolivia", "Chile"],
  publicDateWindow: ANDEAN_CARAVAN_PUBLIC_DATE,
  group: "12 travellers at most points; up to 16 on four flexible sections",
  price,
  completeEnquiryId: "andean-caravan-complete",
  landingCopy: [
    "Journeys that move across a region rather than collecting destinations.",
    "Each Caravan follows one route on one seasonal departure. Join for one section, combine several, or travel until the road ends.",
  ],
  overviewCopy: [
    "The Andean Caravan is one moving journey from the Pacific coast of Peru to the end of the road in Patagonia, and then by a different northbound return to the final flight home.",
    "Join it for one section. Connect several. Or stay with the Caravan until the road ends.",
  ],
  completeCopy: [
    "The Caravan begins on the Pacific coast of Peru and reaches its narrative end at Villa O’Higgins, where the Carretera Austral stops.",
    "It then returns north by a different scenic route to Coyhaique/Balmaceda for the flight home.",
  ],
  principles: [
    {
      title: "It moves on the ground",
      body: "Four short flights in 71 days. Everything else is road, rail or water.",
    },
    {
      title: "It climbs deliberately",
      body: "The route rises from sea level to 4,900 metres over five weeks, with a restorative descent into the Yungas.",
    },
    {
      title: "It ends at an actual end",
      body: "Villa O’Higgins is the narrative culmination; Balmaceda is the final flight gateway.",
    },
  ],
  conditions: [
    "The Lagunas crossing uses simple high-altitude refuges with shared bathrooms and limited heating.",
    "Amantaní is a family stay. Tortel has no streets, and luggage must be carried along boardwalks and stairs.",
  ],
  route:
    "Lima → Paracas → Nazca → Arequipa → Colca → Puno → Cusco → Machu Picchu → Titicaca → La Paz → Yungas → Sajama → Sucre → Potosí → Uyuni → Lagunas → Atacama → Santiago → Carretera Austral → Villa O’Higgins → Balmaceda",
};
