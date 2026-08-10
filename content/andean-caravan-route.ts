export type AndeanCaravanRouteChapterId = "01" | "02" | "03" | "04";

export type AndeanCaravanTransportMode =
  | "overland"
  | "rail"
  | "ferry"
  | "scheduled-flight";

export interface AndeanCaravanRouteStop {
  readonly id: string;
  readonly name: string;
  readonly country: "Peru" | "Bolivia" | "Chile";
  readonly kind: "gate" | "city" | "waypoint";
  readonly mapLabel?: string;
  readonly x: number;
  readonly y: number;
  readonly labelSide: "left" | "right";
}

export interface AndeanCaravanRouteSegment {
  readonly id: string;
  readonly chapterId: AndeanCaravanRouteChapterId;
  readonly from: string;
  readonly to: string;
  readonly mode: AndeanCaravanTransportMode;
  readonly role?: "spine" | "excursion" | "return";
  /** Signed bend for a quadratic flight arc, relative to segment length. */
  readonly curve?: number;
}

/**
 * Positions are projected into the same 0–100 percentage space as the cropped
 * Andean SVG. The list carries every principal city and route-making place
 * needed to explain the published 71-day itinerary without reproducing every
 * day visit on the atlas.
 */
export const andeanCaravanAtlasStops = [
  { id: "lima", name: "Lima", country: "Peru", kind: "gate", x: 22.9, y: 22.7, labelSide: "left" },
  { id: "paracas", name: "Paracas", country: "Peru", kind: "waypoint", x: 26, y: 25.9, labelSide: "left" },
  { id: "nazca", name: "Nazca", country: "Peru", kind: "city", x: 31, y: 27.7, labelSide: "left" },
  { id: "arequipa", name: "Arequipa", country: "Peru", kind: "city", x: 40.8, y: 31.7, labelSide: "left" },
  { id: "colca", name: "Colca", country: "Peru", kind: "waypoint", mapLabel: "Colca Canyon", x: 43.8, y: 29, labelSide: "right" },
  { id: "cusco", name: "Cusco", country: "Peru", kind: "gate", x: 43.4, y: 24.8, labelSide: "right" },
  { id: "sacred-valley", name: "Sacred Valley", country: "Peru", kind: "waypoint", x: 41.9, y: 25.7, labelSide: "right" },
  { id: "machu-picchu", name: "Machu Picchu", country: "Peru", kind: "waypoint", x: 40.3, y: 24.3, labelSide: "left" },
  { id: "puno", name: "Puno", country: "Peru", kind: "gate", x: 50.7, y: 28.2, labelSide: "right" },
  { id: "copacabana", name: "Copacabana", country: "Bolivia", kind: "city", x: 53.5, y: 30, labelSide: "right" },
  { id: "isla-del-sol", name: "Isla del Sol", country: "Bolivia", kind: "waypoint", x: 52.8, y: 29.2, labelSide: "left" },
  { id: "la-paz", name: "La Paz", country: "Bolivia", kind: "city", x: 58.4, y: 31.6, labelSide: "right" },
  { id: "coroico", name: "Coroico", country: "Bolivia", kind: "city", x: 58.8, y: 30, labelSide: "right" },
  { id: "sucre", name: "Sucre", country: "Bolivia", kind: "gate", x: 68.2, y: 34.8, labelSide: "right" },
  { id: "potosi", name: "Potosí", country: "Bolivia", kind: "city", x: 66.3, y: 35.9, labelSide: "right" },
  { id: "uyuni", name: "Uyuni", country: "Bolivia", kind: "city", x: 62.2, y: 37.3, labelSide: "left" },
  { id: "san-pedro", name: "San Pedro de Atacama", country: "Chile", kind: "city", mapLabel: "San Pedro", x: 56.9, y: 41.6, labelSide: "right" },
  { id: "calama", name: "Calama", country: "Chile", kind: "city", x: 54.1, y: 40.9, labelSide: "left" },
  { id: "santiago", name: "Santiago", country: "Chile", kind: "gate", x: 47.4, y: 59.9, labelSide: "left" },
  { id: "balmaceda", name: "Balmaceda", country: "Chile", kind: "gate", x: 43.5, y: 81.6, labelSide: "right" },
  { id: "coyhaique", name: "Coyhaique", country: "Chile", kind: "city", x: 42, y: 81, labelSide: "left" },
  { id: "rio-tranquilo", name: "Río Tranquilo", country: "Chile", kind: "city", x: 39.7, y: 82.9, labelSide: "left" },
  { id: "cochrane", name: "Cochrane", country: "Chile", kind: "city", x: 40.1, y: 84, labelSide: "right" },
  { id: "tortel", name: "Caleta Tortel", country: "Chile", kind: "city", mapLabel: "Tortel", x: 36.4, y: 84.9, labelSide: "left" },
  { id: "puerto-yungay", name: "Puerto Yungay", country: "Chile", kind: "waypoint", x: 36.9, y: 85.3, labelSide: "left" },
  { id: "rio-bravo", name: "Río Bravo", country: "Chile", kind: "waypoint", x: 37.5, y: 85.5, labelSide: "right" },
  { id: "villa-ohiggins", name: "Villa O’Higgins", country: "Chile", kind: "city", x: 40, y: 86.1, labelSide: "left" },
  { id: "puerto-guadal", name: "Puerto Guadal", country: "Chile", kind: "waypoint", x: 40, y: 83.2, labelSide: "right" },
  { id: "chile-chico", name: "Chile Chico", country: "Chile", kind: "city", x: 43.4, y: 82.7, labelSide: "right" },
  { id: "puerto-ibanez", name: "Puerto Ibáñez", country: "Chile", kind: "waypoint", x: 42.5, y: 82.3, labelSide: "right" },
] as const satisfies readonly AndeanCaravanRouteStop[];

/**
 * The older destination-by-destination explorer still has a curated story and
 * photograph for these thirteen entries. Keep that public data contract stable
 * while the editorial atlas above carries the fuller transport truth.
 */
export const andeanCaravanRouteStops = [
  { id: "lima", name: "Lima", country: "Peru", kind: "gate", x: 22.9, y: 22.7, labelSide: "left" },
  { id: "arequipa", name: "Arequipa", country: "Peru", kind: "gate", x: 40.8, y: 31.7, labelSide: "left" },
  { id: "cusco", name: "Cusco", country: "Peru", kind: "gate", x: 43.4, y: 24.8, labelSide: "right" },
  { id: "titicaca", name: "Lake Titicaca", country: "Peru", kind: "waypoint", x: 50.7, y: 28.2, labelSide: "right" },
  { id: "la-paz", name: "La Paz", country: "Bolivia", kind: "gate", x: 58.4, y: 31.6, labelSide: "left" },
  { id: "sucre", name: "Sucre", country: "Bolivia", kind: "gate", x: 68.2, y: 34.8, labelSide: "right" },
  { id: "uyuni", name: "Uyuni", country: "Bolivia", kind: "gate", x: 62.2, y: 37.3, labelSide: "left" },
  { id: "atacama", name: "Atacama", country: "Chile", kind: "gate", x: 56.9, y: 41.6, labelSide: "right" },
  { id: "santiago", name: "Santiago", country: "Chile", kind: "gate", x: 47.4, y: 59.9, labelSide: "left" },
  { id: "balmaceda-airport", name: "Balmaceda Airport (arrival)", mapLabel: "Balmaceda Airport", country: "Chile", kind: "waypoint", x: 43.5, y: 81.6, labelSide: "right" },
  { id: "coyhaique", name: "Coyhaique", country: "Chile", kind: "city", x: 42, y: 81, labelSide: "right" },
  { id: "villa-ohiggins", name: "Carretera Austral to Villa O’Higgins", mapLabel: "Villa O’Higgins", country: "Chile", kind: "city", x: 40, y: 86.1, labelSide: "right" },
  { id: "balmaceda", name: "Balmaceda (return)", mapLabel: "Balmaceda", country: "Chile", kind: "gate", x: 46, y: 83.8, labelSide: "left" },
] as const satisfies readonly AndeanCaravanRouteStop[];

/**
 * Transport is explicit because a continuous line would be materially wrong:
 * four in-route transfers are scheduled flights, Cusco–Puno is rail, and the
 * southern return depends on vehicle ferries. The included Balmaceda–Santiago
 * exit flight remains outside route geometry by product rule.
 */
export const andeanCaravanRouteSegments = [
  { id: "lima-paracas", chapterId: "01", from: "lima", to: "paracas", mode: "overland" },
  { id: "paracas-nazca", chapterId: "01", from: "paracas", to: "nazca", mode: "overland" },
  { id: "nazca-arequipa", chapterId: "01", from: "nazca", to: "arequipa", mode: "overland" },
  { id: "arequipa-colca", chapterId: "01", from: "arequipa", to: "colca", mode: "overland", role: "excursion" },
  { id: "arequipa-cusco", chapterId: "01", from: "arequipa", to: "cusco", mode: "scheduled-flight", curve: -0.34 },
  { id: "cusco-sacred-valley", chapterId: "01", from: "cusco", to: "sacred-valley", mode: "overland", role: "excursion" },
  { id: "sacred-valley-machu-picchu", chapterId: "01", from: "sacred-valley", to: "machu-picchu", mode: "rail", role: "excursion" },
  { id: "machu-picchu-sacred-valley-return", chapterId: "01", from: "machu-picchu", to: "sacred-valley", mode: "rail", role: "return" },
  { id: "sacred-valley-cusco-return", chapterId: "01", from: "sacred-valley", to: "cusco", mode: "overland", role: "return" },
  { id: "cusco-puno", chapterId: "01", from: "cusco", to: "puno", mode: "rail" },

  { id: "puno-copacabana", chapterId: "02", from: "puno", to: "copacabana", mode: "overland" },
  { id: "copacabana-isla-del-sol", chapterId: "02", from: "copacabana", to: "isla-del-sol", mode: "ferry", role: "excursion" },
  { id: "copacabana-la-paz", chapterId: "02", from: "copacabana", to: "la-paz", mode: "overland" },
  { id: "la-paz-coroico", chapterId: "02", from: "la-paz", to: "coroico", mode: "overland", role: "excursion" },
  { id: "la-paz-sucre", chapterId: "02", from: "la-paz", to: "sucre", mode: "scheduled-flight", curve: -0.25 },

  { id: "sucre-potosi", chapterId: "03", from: "sucre", to: "potosi", mode: "overland" },
  { id: "potosi-uyuni", chapterId: "03", from: "potosi", to: "uyuni", mode: "overland" },
  { id: "uyuni-san-pedro", chapterId: "03", from: "uyuni", to: "san-pedro", mode: "overland" },
  { id: "san-pedro-calama", chapterId: "03", from: "san-pedro", to: "calama", mode: "overland" },
  { id: "calama-santiago", chapterId: "03", from: "calama", to: "santiago", mode: "scheduled-flight", curve: 0.24 },

  { id: "santiago-balmaceda", chapterId: "04", from: "santiago", to: "balmaceda", mode: "scheduled-flight", curve: -0.42 },
  { id: "balmaceda-coyhaique", chapterId: "04", from: "balmaceda", to: "coyhaique", mode: "overland" },
  { id: "coyhaique-rio-tranquilo", chapterId: "04", from: "coyhaique", to: "rio-tranquilo", mode: "overland" },
  { id: "rio-tranquilo-cochrane", chapterId: "04", from: "rio-tranquilo", to: "cochrane", mode: "overland" },
  { id: "cochrane-tortel", chapterId: "04", from: "cochrane", to: "tortel", mode: "overland" },
  { id: "tortel-puerto-yungay", chapterId: "04", from: "tortel", to: "puerto-yungay", mode: "overland" },
  { id: "puerto-yungay-rio-bravo", chapterId: "04", from: "puerto-yungay", to: "rio-bravo", mode: "ferry" },
  { id: "rio-bravo-villa-ohiggins", chapterId: "04", from: "rio-bravo", to: "villa-ohiggins", mode: "overland" },
  { id: "villa-ohiggins-rio-bravo", chapterId: "04", from: "villa-ohiggins", to: "rio-bravo", mode: "overland", role: "return" },
  { id: "rio-bravo-puerto-yungay-return", chapterId: "04", from: "rio-bravo", to: "puerto-yungay", mode: "ferry", role: "return" },
  { id: "puerto-yungay-cochrane-return", chapterId: "04", from: "puerto-yungay", to: "cochrane", mode: "overland", role: "return" },
  { id: "cochrane-puerto-guadal", chapterId: "04", from: "cochrane", to: "puerto-guadal", mode: "overland", role: "return" },
  { id: "puerto-guadal-chile-chico", chapterId: "04", from: "puerto-guadal", to: "chile-chico", mode: "overland", role: "return" },
  { id: "chile-chico-puerto-ibanez", chapterId: "04", from: "chile-chico", to: "puerto-ibanez", mode: "ferry", role: "return" },
  { id: "puerto-ibanez-coyhaique", chapterId: "04", from: "puerto-ibanez", to: "coyhaique", mode: "overland", role: "return" },
  { id: "coyhaique-balmaceda", chapterId: "04", from: "coyhaique", to: "balmaceda", mode: "overland", role: "return" },
] as const satisfies readonly AndeanCaravanRouteSegment[];

export const andeanCaravanCountries = ["Peru", "Bolivia", "Chile"] as const;
