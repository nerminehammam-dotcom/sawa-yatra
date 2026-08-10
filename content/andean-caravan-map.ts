export type AndeanCaravanMapChapterId = "01" | "02" | "03" | "04";

export interface AndeanCaravanMapChapter {
  readonly id: AndeanCaravanMapChapterId;
  readonly title: string;
  readonly days: number;
  readonly route: string;
  readonly join: string;
  readonly leave: string;
  readonly summary: string;
  readonly href: string;
  readonly stopIds: readonly string[];
  readonly labelStopIds: readonly string[];
  readonly focusStopIds: readonly string[];
  readonly movement: string;
  readonly places: readonly string[];
  readonly routeGroups?: readonly {
    readonly label: string;
    readonly places: readonly string[];
  }[];
  readonly countryIds: readonly ("peru" | "bolivia" | "chile")[];
  readonly atlasViewBox: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly terrain: string;
  readonly geographicFact: string;
  readonly elevation: {
    readonly points: readonly number[];
    readonly highMeters: number;
  };
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly caption: string;
    readonly focalPoint: { readonly x: number; readonly y: number };
  };
}

/**
 * The public route atlas follows the four canonical Caravan sections. It is
 * deliberately smaller than the operational day model: the map explains the
 * journey shape while each section page carries the detailed itinerary.
 */
export const andeanCaravanMapChapters = [
  {
    id: "01",
    title: "Sea to Stone",
    days: 23,
    route: "Lima → Puno",
    join: "Lima",
    leave: "Puno",
    summary:
      "Road south to Arequipa, scheduled flight to Cusco, then the Titicaca day train to Puno.",
    href: "/caravans/andean/sea-to-stone",
    stopIds: [
      "lima",
      "paracas",
      "nazca",
      "arequipa",
      "colca",
      "cusco",
      "sacred-valley",
      "machu-picchu",
      "puno",
    ],
    labelStopIds: ["paracas", "nazca", "arequipa", "colca", "machu-picchu"],
    focusStopIds: ["lima", "arequipa", "cusco", "puno"],
    movement: "Road → scheduled flight → rail",
    places: [
      "Lima",
      "Paracas",
      "Nazca",
      "Arequipa",
      "Colca / return to Arequipa",
      "Cusco",
      "Sacred Valley",
      "Machu Picchu",
      "Puno",
    ],
    countryIds: ["peru"],
    atlasViewBox: { x: 40, y: 40, width: 650, height: 520 },
    terrain: "Pacific / desert / volcanic highland",
    geographicFact:
      "From the Pacific the Caravan reaches Arequipa, crosses Patapampa, returns to fly to Cusco, then continues to Puno by day train.",
    elevation: {
      points: [161, 2337, 4910, 3414, 3812],
      highMeters: 4910,
    },
    image: {
      src: "/assets/images/departures/andean/gallery/white-city-deep-canyon/02-z8n0934.jpg",
      alt: "Cultivated strips run towards cloud-covered Andean mountains in southern Peru.",
      caption: "Southern Peru · Sawayatra route photograph",
      focalPoint: { x: 51, y: 55 },
    },
  },
  {
    id: "02",
    title: "Both Shores",
    days: 16,
    route: "Puno → Sucre",
    join: "Puno",
    leave: "Sucre",
    summary:
      "Lake roads, boats and the Tiquina vehicle barge reach La Paz; the chapter finishes with a scheduled flight down to Sucre.",
    href: "/caravans/andean/both-shores",
    stopIds: [
      "puno",
      "copacabana",
      "isla-del-sol",
      "la-paz",
      "coroico",
      "sucre",
    ],
    labelStopIds: ["copacabana", "la-paz", "coroico"],
    focusStopIds: ["puno", "la-paz", "coroico", "sucre"],
    movement: "Road / boat → scheduled flight",
    places: [
      "Puno",
      "Copacabana ↔ Isla del Sol",
      "Tiquina vehicle barge",
      "La Paz ↔ Coroico",
      "Sucre",
    ],
    countryIds: ["peru", "bolivia"],
    atlasViewBox: { x: 250, y: 130, width: 530, height: 430 },
    terrain: "Lake / altiplano / cloud forest",
    geographicFact:
      "Lake Titicaca lies at 3,812 metres, with this chapter tracing both its Peruvian and Bolivian shores.",
    elevation: {
      points: [3812, 3631, 1700, 4200, 2810],
      highMeters: 4200,
    },
    image: {
      src: "/assets/images/departures/andean/gallery/thin-air-cloud-forest/05-drive-uyuni-lapaz-010.jpg",
      alt: "Woman standing outside an adobe home under a wide turquoise sky.",
      caption: "Bolivia · Sawayatra route photograph",
      focalPoint: { x: 69, y: 56 },
    },
  },
  {
    id: "03",
    title: "The Mirror",
    days: 18,
    route: "Sucre → Santiago",
    join: "Sucre",
    leave: "Santiago",
    summary:
      "Road and 4×4 through Potosí, Uyuni and San Pedro; Calama to Santiago is by air.",
    href: "/caravans/andean/the-mirror",
    stopIds: ["sucre", "potosi", "uyuni", "san-pedro", "calama", "santiago"],
    labelStopIds: ["potosi", "uyuni", "san-pedro", "calama"],
    focusStopIds: ["sucre", "uyuni", "san-pedro", "santiago"],
    movement: "Road / 4×4 → scheduled flight",
    places: [
      "Sucre",
      "Potosí",
      "Uyuni",
      "Salar de Uyuni",
      "High lagoons",
      "San Pedro de Atacama",
      "Calama",
      "Santiago",
    ],
    countryIds: ["bolivia", "chile"],
    atlasViewBox: { x: 220, y: 260, width: 520, height: 460 },
    terrain: "Salt / high lagoons / desert",
    geographicFact:
      "The route crosses Salar de Uyuni and a 4,900-metre high-lagoon road before descending through Atacama.",
    elevation: {
      points: [2810, 4090, 3656, 4900, 2407, 520],
      highMeters: 4900,
    },
    image: {
      src: "/assets/images/departures/andean/gallery/atacama/03-z8n5462.jpg",
      alt: "Star-filled sky hanging above a red canyon in the Atacama Desert.",
      caption: "Atacama · Sawayatra route photograph",
      focalPoint: { x: 52, y: 37 },
    },
  },
  {
    id: "04",
    title: "The End of the Road",
    days: 14,
    route: "Santiago → Balmaceda → Santiago",
    join: "Santiago",
    leave: "Balmaceda",
    summary:
      "Fly south, follow the Carretera Austral and ferry loop, then return by road to Balmaceda for the included onward flight.",
    href: "/caravans/andean/the-end-of-the-road",
    stopIds: [
      "santiago",
      "balmaceda",
      "coyhaique",
      "rio-tranquilo",
      "cochrane",
      "tortel",
      "puerto-yungay",
      "rio-bravo",
      "villa-ohiggins",
      "puerto-guadal",
      "chile-chico",
      "puerto-ibanez",
    ],
    labelStopIds: [
      "coyhaique",
      "rio-tranquilo",
      "cochrane",
      "tortel",
      "villa-ohiggins",
    ],
    focusStopIds: ["balmaceda", "rio-tranquilo", "villa-ohiggins", "chile-chico"],
    movement: "Scheduled flight → road / vehicle ferry → onward flight",
    places: [
      "Santiago",
      "Balmaceda",
      "Coyhaique",
      "Río Tranquilo",
      "Cochrane",
      "Caleta Tortel",
      "Puerto Yungay ↔ Río Bravo ferry",
      "Villa O’Higgins",
      "Retrace via Río Bravo / Puerto Yungay ferry",
      "Cochrane",
      "Puerto Guadal",
      "Chile Chico",
      "Puerto Ibáñez",
      "Coyhaique",
      "Balmaceda / included flight to Santiago",
    ],
    routeGroups: [
      { label: "Air", places: ["Santiago", "Balmaceda"] },
      {
        label: "Southbound",
        places: [
          "Coyhaique",
          "Río Tranquilo",
          "Cochrane",
          "Caleta Tortel",
          "Villa O’Higgins",
        ],
      },
      {
        label: "Return",
        places: [
          "Retrace via Río Bravo / Puerto Yungay ferry",
          "Cochrane",
          "Puerto Guadal",
          "Chile Chico",
          "Puerto Ibáñez",
          "Coyhaique",
          "Balmaceda",
        ],
      },
    ],
    countryIds: ["chile"],
    atlasViewBox: { x: 248, y: 776, width: 148, height: 112 },
    terrain: "Flight / gravel / ferry / Patagonian water",
    geographicFact:
      "South of Balmaceda, the Carretera Austral is interrupted by fjords; the return retraces the same Mitchell Fjord crossing before turning east.",
    elevation: {
      points: [520, 518, 1120, 302, 280, 518],
      highMeters: 1120,
    },
    image: {
      src: "/assets/images/departures/andean/gallery/the-end-of-the-road/02-patagonia-13.jpg",
      alt: "Narrow road crossing tawny grasslands beneath a Patagonian escarpment.",
      caption: "Aysén · Sawayatra route photograph",
      focalPoint: { x: 46, y: 60 },
    },
  },
] as const satisfies readonly AndeanCaravanMapChapter[];
