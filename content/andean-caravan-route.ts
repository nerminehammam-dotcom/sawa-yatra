export interface AndeanCaravanRouteStop {
  readonly id: string;
  readonly name: string;
  readonly country: "Peru" | "Bolivia" | "Chile";
  readonly mapLabel?: string;
  readonly x: number;
  readonly y: number;
  readonly labelSide: "left" | "right";
}

/**
 * Positions projected from each place's broad geographic location into the
 * cropped Andean map view. The public map remains illustrative, not a
 * navigation map, but the stops now sit on recognisable country geography.
 */
export const andeanCaravanRouteStops = [
  { id: "lima", name: "Lima", country: "Peru", x: 22.9, y: 22.7, labelSide: "left" },
  {
    id: "arequipa",
    name: "Arequipa",
    country: "Peru",
    x: 40.8,
    y: 31.7,
    labelSide: "left",
  },
  { id: "cusco", name: "Cusco", country: "Peru", x: 43.4, y: 24.8, labelSide: "right" },
  {
    id: "titicaca",
    name: "Lake Titicaca",
    country: "Peru",
    x: 50.7,
    y: 28.2,
    labelSide: "right",
  },
  {
    id: "la-paz",
    name: "La Paz",
    country: "Bolivia",
    x: 58.4,
    y: 31.6,
    labelSide: "left",
  },
  {
    id: "sucre",
    name: "Sucre",
    country: "Bolivia",
    x: 68.2,
    y: 34.8,
    labelSide: "right",
  },
  {
    id: "uyuni",
    name: "Uyuni",
    country: "Bolivia",
    x: 62.2,
    y: 37.3,
    labelSide: "left",
  },
  {
    id: "atacama",
    name: "Atacama",
    country: "Chile",
    x: 56.9,
    y: 41.6,
    labelSide: "right",
  },
  {
    id: "santiago",
    name: "Santiago",
    country: "Chile",
    x: 47.4,
    y: 59.9,
    labelSide: "left",
  },
  {
    id: "balmaceda-airport",
    name: "Balmaceda Airport (arrival)",
    mapLabel: "Balmaceda Airport",
    country: "Chile",
    x: 43.5,
    y: 81.6,
    labelSide: "right",
  },
  {
    id: "coyhaique",
    name: "Coyhaique",
    country: "Chile",
    x: 42,
    y: 81,
    labelSide: "right",
  },
  {
    id: "villa-ohiggins",
    name: "Carretera Austral to Villa O’Higgins",
    mapLabel: "Villa O’Higgins",
    country: "Chile",
    x: 40,
    y: 86.1,
    labelSide: "right",
  },
  {
    id: "balmaceda",
    name: "Balmaceda (return)",
    mapLabel: "Balmaceda",
    country: "Chile",
    x: 46,
    y: 83.8,
    labelSide: "left",
  },
] as const satisfies readonly AndeanCaravanRouteStop[];

export const andeanCaravanCountries = ["Peru", "Bolivia", "Chile"] as const;
