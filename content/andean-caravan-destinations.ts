import type { AndeanCaravanRouteStop } from "@/content/andean-caravan-route";

export interface AndeanDestinationImage {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly focalPoint: { readonly x: number; readonly y: number };
}

export interface AndeanDestinationDetail {
  readonly stopId: AndeanCaravanRouteStop["id"];
  readonly shortName: string;
  readonly introduction: string;
  readonly altitude: string;
  readonly population: string;
  readonly populationContext: string;
  readonly orientation: readonly [string, string];
  readonly image: AndeanDestinationImage;
  readonly source: {
    readonly label: string;
    readonly href: string;
  };
}

const imageRoot = "/assets/images/departures/andean";

/**
 * Concise geographic orientation for the interactive map. “Around the stop”
 * ideas are context, not confirmed itinerary inclusions. Population figures
 * retain their census boundary and year so unlike areas are not presented as
 * directly comparable.
 */
export const andeanDestinationDetails = {
  lima: {
    stopId: "lima",
    shortName: "Lima",
    introduction:
      "The Caravan opens on the Pacific, where the historic centre and coastal neighbourhoods introduce Peru at street level.",
    altitude: "161 m",
    population: "8.57m",
    populationContext: "Lima Province · 2017 census",
    orientation: ["Historic centre and working streets", "Pacific cliffs and coastal neighbourhoods"],
    image: {
      src: `${imageRoot}/gallery/desert-coast/01-lima-01.jpg`,
      alt: "A woman stands in the pale green doorway of a Lima building.",
      caption: "Lima · Sawayatra route photograph",
      focalPoint: { x: 78, y: 54 },
    },
    source: {
      label: "INEI Peru",
      href: "https://www.gob.pe/institucion/inei/noticias/535500-poblacion-del-peru-totalizo-31-millones-237-mil-385-personas-al-2017",
    },
  },
  arequipa: {
    stopId: "arequipa",
    shortName: "Arequipa",
    introduction:
      "A high desert city built in pale volcanic stone, framed by volcanoes and a strong everyday market culture.",
    altitude: "2,337 m",
    population: "1.01m",
    populationContext: "Urban city · 2017 census",
    orientation: ["Sillar architecture and historic centre", "Markets, courtyards and volcanic horizons"],
    image: {
      src: `${imageRoot}/gallery/white-city-deep-canyon/01-z8n0729-enhanced-nr-copy.jpg`,
      alt: "A woman stands in a red doorway in a Peruvian highland town.",
      caption: "Arequipa section · Sawayatra route photograph",
      focalPoint: { x: 76, y: 53 },
    },
    source: {
      label: "INEI / PROMPERÚ",
      href: "https://repositorio.promperu.gob.pe/bitstreams/319a8794-c7f2-4dd2-8ff6-c7e1b1c5ce80/download",
    },
  },
  cusco: {
    stopId: "cusco",
    shortName: "Cusco",
    introduction:
      "An Andean city where Inca stonework, colonial buildings and present-day neighbourhood life sit in the same frame.",
    altitude: "3,414 m",
    population: "428k",
    populationContext: "Urban city · 2017 census",
    orientation: ["Layered Inca and colonial streets", "Markets, workshops and highland viewpoints"],
    image: {
      src: `${imageRoot}/gallery/the-stone-road/01-cuscco-01.jpg`,
      alt: "A woman walks along a white-walled street in Cusco.",
      caption: "Cusco · Sawayatra route photograph",
      focalPoint: { x: 72, y: 55 },
    },
    source: {
      label: "INEI Cusco",
      href: "https://www.inei.gob.pe/media/MenuRecursivo/publicaciones_digitales/Est/Lib1559/08TOMO_01.pdf",
    },
  },
  titicaca: {
    stopId: "titicaca",
    shortName: "Lake Titicaca",
    introduction:
      "The route meets the lake as one shared high-altitude landscape, rather than treating Puno as a separate top-level stop.",
    altitude: "3,812 m",
    population: "Not applicable",
    populationContext: "Lake landscape · not a town",
    orientation: ["Open-water crossings and reed shorelines", "Island and lakeside community life"],
    image: {
      src: `${imageRoot}/gallery/both-shores/02-drive-la-paz-puno-09.jpg`,
      alt: "A small handwritten word marks a white roadside wall near Lake Titicaca.",
      caption: "Lake Titicaca road · Sawayatra route photograph",
      focalPoint: { x: 50, y: 51 },
    },
    source: {
      label: "Lake reference",
      href: "https://www.britannica.com/place/Lake-Titicaca",
    },
  },
  "la-paz": {
    stopId: "la-paz",
    shortName: "La Paz",
    introduction:
      "A city folded into a steep Andean basin, with streets and aerial views that constantly reveal the surrounding altiplano.",
    altitude: "3,631 m",
    population: "766k",
    populationContext: "City · 2012 census",
    orientation: ["Markets and steep neighbourhood streets", "Cable-car views across the urban basin"],
    image: {
      src: `${imageRoot}/gallery/thin-air-cloud-forest/02-la-paz-09-copy-2.jpg`,
      alt: "A passenger boards a painted bus on a steep street in La Paz.",
      caption: "La Paz · Sawayatra route photograph",
      focalPoint: { x: 73, y: 54 },
    },
    source: {
      label: "INE Bolivia",
      href: "https://www.ine.gob.bo/index.php/publicaciones/la-paz-censo-2012/",
    },
  },
  sucre: {
    stopId: "sucre",
    shortName: "Sucre",
    introduction:
      "Bolivia’s constitutional capital brings whitewashed streets, sheltered courtyards and a gentler elevation than the altiplano.",
    altitude: "2,810 m",
    population: "261k",
    populationContext: "City · 2012 census",
    orientation: ["Whitewashed historic centre", "Courtyards, markets and surrounding hills"],
    image: {
      src: `${imageRoot}/gallery/silver-and-bone/10-drive-uyuni-lapaz-29.jpg`,
      alt: "A market worker sorts flowers and fabric by hand in Bolivia.",
      caption: "Bolivia · Sawayatra route photograph",
      focalPoint: { x: 67, y: 52 },
    },
    source: {
      label: "UN-Habitat Bolivia",
      href: "https://unhabitat.org/sites/default/files/2021/10/sistema_de_ciudades_de_bolivia_unh.pdf",
    },
  },
  uyuni: {
    stopId: "uyuni",
    shortName: "Uyuni",
    introduction:
      "A small rail town at the edge of the salar, marking the change from settled altiplano to an immense mineral landscape.",
    altitude: "3,656 m",
    population: "29.7k",
    populationContext: "Town · 2012 census",
    orientation: ["Rail history and the salar gateway", "Salt, lagoons and long horizons"],
    image: {
      src: `${imageRoot}/gallery/the-mirror/01-uyuni-01.jpg`,
      alt: "A shallow high-altitude lagoon reflects the mountains near Uyuni.",
      caption: "Uyuni region · Sawayatra route photograph",
      focalPoint: { x: 53, y: 52 },
    },
    source: {
      label: "UN-Habitat Bolivia",
      href: "https://unhabitat.org/sites/default/files/2021/10/sistema_de_ciudades_de_bolivia_unh.pdf",
    },
  },
  atacama: {
    stopId: "atacama",
    shortName: "Atacama",
    introduction:
      "San Pedro is the human-scale base for salt, stone, high-altitude lagoons and some of the clearest night skies on the route.",
    altitude: "2,407 m",
    population: "5,347",
    populationContext: "San Pedro town · 2017 census",
    orientation: ["Desert valleys, salt and volcanic forms", "Night skies and high-altitude lagoons"],
    image: {
      src: `${imageRoot}/gallery/atacama/01-astro-01.jpg`,
      alt: "The Milky Way spans the dark sky above Atacama rock formations.",
      caption: "Atacama · Sawayatra route photograph",
      focalPoint: { x: 60, y: 38 },
    },
    source: {
      label: "INE Chile / Chile Travel",
      href: "https://chile.travel/en/destinations/san-pedro-de-atacama/",
    },
  },
  santiago: {
    stopId: "santiago",
    shortName: "Santiago",
    introduction:
      "Chile’s capital is the route’s major urban hinge: a valley city beneath the Andes before the Caravan flies south.",
    altitude: "520 m",
    population: "6.14m",
    populationContext: "Greater Santiago · 2017 census",
    orientation: ["Historic civic centre and markets", "Neighbourhood streets and Andean viewpoints"],
    image: {
      src: `${imageRoot}/atacama.jpg`,
      alt: "A star-filled Atacama landscape on the northern Chile section of the route.",
      caption: "Northern Chile to Santiago · Sawayatra route photograph",
      focalPoint: { x: 50, y: 45 },
    },
    source: {
      label: "INE Chile",
      href: "https://www.ine.gob.cl/docs/default-source/geodatos-abiertos/publicaciones/ciudades-pueblos-aldeas-y-caserios/censo-2017/ciudades-pueblos-aldeas-y-caser%C3%ADos-2019.pdf?sfvrsn=24e81d36_4",
    },
  },
  "balmaceda-airport": {
    stopId: "balmaceda-airport",
    shortName: "Balmaceda Airport",
    introduction:
      "The arrival point for Aysén and the operational gateway from the Santiago flight into the Patagonian road journey.",
    altitude: "518 m",
    population: "405",
    populationContext: "Balmaceda settlement · 2017 census",
    orientation: ["Arrival gateway for central Aysén", "Road transfer towards Coyhaique"],
    image: {
      src: `${imageRoot}/gallery/the-end-of-the-road/02-patagonia-13.jpg`,
      alt: "A narrow road crosses tawny grasslands beneath a Patagonian escarpment.",
      caption: "Aysén · Sawayatra route photograph",
      focalPoint: { x: 46, y: 60 },
    },
    source: {
      label: "INE Chile",
      href: "https://www.ine.gob.cl/docs/default-source/geodatos-abiertos/publicaciones/ciudades-pueblos-aldeas-y-caserios/censo-2017/ciudades-pueblos-aldeas-y-caser%C3%ADos-2019.pdf?sfvrsn=24e81d36_4",
    },
  },
  coyhaique: {
    stopId: "coyhaique",
    shortName: "Coyhaique",
    introduction:
      "A compact regional capital between rivers and mountains, and the practical threshold of the southern road.",
    altitude: "302 m",
    population: "49.7k",
    populationContext: "City · 2017 census",
    orientation: ["Regional market and low-rise centre", "River valleys and mountain viewpoints"],
    image: {
      src: `${imageRoot}/gallery/the-end-of-the-road/07-patagoina-01.jpg`,
      alt: "A gravel road runs through open Patagonian ranchland.",
      caption: "Coyhaique region · Sawayatra route photograph",
      focalPoint: { x: 50, y: 58 },
    },
    source: {
      label: "INE Chile",
      href: "https://www.ine.gob.cl/docs/default-source/geodatos-abiertos/publicaciones/ciudades-pueblos-aldeas-y-caserios/censo-2017/ciudades-pueblos-aldeas-y-caser%C3%ADos-2019.pdf?sfvrsn=24e81d36_4",
    },
  },
  "villa-ohiggins": {
    stopId: "villa-ohiggins",
    shortName: "Villa O’Higgins",
    introduction:
      "A very small settlement at the southern end of the Carretera Austral, where the road gives way to lake, forest and ice.",
    altitude: "280 m",
    population: "484",
    populationContext: "Settlement · 2017 census",
    orientation: ["The end-of-road marker", "Lake O’Higgins, forest and mountain landscape"],
    image: {
      src: `${imageRoot}/gallery/the-end-of-the-road/09-patagonia-41.jpg`,
      alt: "A still Patagonian lake rests beneath a line of snow-covered mountains.",
      caption: "Villa O’Higgins region · Sawayatra route photograph",
      focalPoint: { x: 52, y: 50 },
    },
    source: {
      label: "INE Chile / MeteoChile",
      href: "https://climatologia.meteochile.gob.cl/application/informacion/fichaDeEstacion/480002",
    },
  },
  balmaceda: {
    stopId: "balmaceda",
    shortName: "Balmaceda",
    introduction:
      "The return to Balmaceda closes the southern loop and restores the airport gateway for the final onward flight.",
    altitude: "518 m",
    population: "405",
    populationContext: "Balmaceda settlement · 2017 census",
    orientation: ["Return gateway after the southern road", "Final transition from road to air"],
    image: {
      src: `${imageRoot}/gallery/the-end-of-the-road/13-chile-016.jpg`,
      alt: "A mountain road disappears into mist and autumn forest.",
      caption: "Return through Aysén · Sawayatra route photograph",
      focalPoint: { x: 50, y: 60 },
    },
    source: {
      label: "INE Chile",
      href: "https://www.ine.gob.cl/docs/default-source/geodatos-abiertos/publicaciones/ciudades-pueblos-aldeas-y-caserios/censo-2017/ciudades-pueblos-aldeas-y-caser%C3%ADos-2019.pdf?sfvrsn=24e81d36_4",
    },
  },
} as const satisfies Record<
  AndeanCaravanRouteStop["id"],
  AndeanDestinationDetail
>;
