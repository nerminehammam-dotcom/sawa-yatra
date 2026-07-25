export interface Gate {
  id: string;
  name: string;
  airport: string;
  altitude: string;
  joiningNote: string;
  includedArrival?: string;
  opens?: string;
  closes?: string;
  hostHandover?: boolean;
}

export interface JourneyLeg {
  route: string;
  mode: string;
  surface: string;
  note?: string;
}

export interface CaravanSection {
  id: string;
  slug: string;
  name: string;
  joinGateId: string;
  leaveGateId: string;
  days: number;
  countries: readonly string[];
  modes: string;
  maximumAltitude: string;
  physicalNotice: string;
  accommodation: string;
  arrival: string;
  promise: string;
  image: { src: string; alt: string; focalPoint?: { x: number; y: number } };
  legs: readonly JourneyLeg[];
}

export const caravanGates: readonly Gate[] = [
  { id: "lima", name: "Lima", airport: "LIM", altitude: "Sea level", joiningNote: "The Caravan begins here.", includedArrival: "A protected arrival night is included.", opens: "Desert Coast" },
  { id: "arequipa", name: "Arequipa", airport: "AQP", altitude: "2,335 m", joiningNote: "A rest day is built into the section.", opens: "White City, Deep Canyon", closes: "Desert Coast" },
  { id: "cusco", name: "Cusco", airport: "CUZ", altitude: "3,400 m", joiningNote: "An acclimatisation day is built into the section.", opens: "The Stone Road", closes: "White City, Deep Canyon", hostHandover: true },
  { id: "puno", name: "Puno", airport: "JUL · 45-minute transfer", altitude: "3,800 m", joiningNote: "Previous-day arrival is required.", includedArrival: "The hotel night and arrival support are included.", opens: "Both Shores", closes: "The Stone Road" },
  { id: "la-paz", name: "La Paz", airport: "LPB · El Alto at 4,050 m", altitude: "3,640 m", joiningNote: "Previous-day arrival is required.", includedArrival: "The hotel night and arrival support are included.", opens: "Thin Air & Cloud Forest", closes: "Both Shores" },
  { id: "sucre", name: "Sucre", airport: "SRE", altitude: "2,750 m", joiningNote: "The gentlest Bolivian altitude gate.", opens: "Silver & Bone", closes: "Thin Air & Cloud Forest" },
  { id: "uyuni", name: "Uyuni", airport: "UYU", altitude: "3,650 m", joiningNote: "Previous-day arrival is required.", includedArrival: "The hotel night and arrival support are included.", opens: "The Mirror", closes: "Silver & Bone", hostHandover: true },
  { id: "san-pedro", name: "San Pedro de Atacama", airport: "CJC · 1-hour 15-minute transfer", altitude: "2,400 m", joiningNote: "Arrive through Calama the previous day.", includedArrival: "The hotel night and arrival support are included.", opens: "Atacama", closes: "The Mirror" },
  { id: "santiago", name: "Santiago", airport: "SCL", altitude: "Sea level", joiningNote: "The last joining gate.", opens: "The End of the Road", closes: "Atacama" },
  { id: "balmaceda", name: "Balmaceda", airport: "BBA · onward flight to SCL", altitude: "Sea level", joiningNote: "Final leaving gate only.", closes: "The End of the Road" },
] as const;

export const caravanSections: readonly CaravanSection[] = [
  {
    id: "01", slug: "desert-coast", name: "Desert Coast", joinGateId: "lima", leaveGateId: "arequipa", days: 9, countries: ["Peru"], modes: "road · boat · light aircraft", maximumAltitude: "2,335 m", physicalNotice: "The Nazca to Arequipa run is a nine-hour driving day.", accommodation: "A protected Lima arrival night is included.", arrival: "Join at sea level in Lima; your Host meets you before the group gathers.", promise: "Pacific light, pre-Inca cities, islands, desert cemeteries and the Nazca Lines.", image: { src: "/assets/images/departures/andean/gallery/desert-coast/01-lima-01.jpg", alt: "A quiet street and coastal architecture in Lima" },
    legs: [
      { route: "Lima city days", mode: "coach and walking", surface: "paved", note: "Museo Larco, Pachacámac, Surquillo and Barranco" },
      { route: "Lima → Tambo Colorado → Paracas", mode: "road coach", surface: "paved Panamericana Sur" },
      { route: "Ballestas Islands and Paracas Reserve", mode: "passenger boat and road", surface: "water and paved reserve roads" },
      { route: "Paracas → Huacachina → Nazca", mode: "road coach", surface: "paved desert road" },
      { route: "Nazca Lines", mode: "light aircraft", surface: "air" },
      { route: "Nazca → Sacaco → Arequipa", mode: "road coach", surface: "paved Panamericana Sur", note: "The longest road day of the Caravan" },
    ],
  },
  {
    id: "02", slug: "white-city-deep-canyon", name: "White City, Deep Canyon", joinGateId: "arequipa", leaveGateId: "cusco", days: 7, countries: ["Peru"], modes: "road · scheduled flight", maximumAltitude: "4,910 m", physicalNotice: "The route crosses the high Patapampa pass before descending into Colca.", accommodation: "A protected handover night in Cusco is included.", arrival: "A rest day in Arequipa gives the section its altitude ladder.", promise: "Volcanic architecture, mountain ritual, Colca Canyon and the handover to Cusco.", image: { src: "/assets/images/departures/andean/gallery/white-city-deep-canyon/05-london-0ps.jpg", alt: "A highland road beneath dark cloud and mountain ridges", focalPoint: { x: 48, y: 58 } },
    legs: [
      { route: "Arequipa → Colca", mode: "road coach", surface: "paved high-altitude road", note: "Over Patapampa pass" },
      { route: "Colca → Arequipa", mode: "road coach", surface: "paved mountain road" },
      { route: "Arequipa → Cusco", mode: "LATAM scheduled direct flight", surface: "air", note: "Flight 1 of 4" },
    ],
  },
  {
    id: "03", slug: "the-stone-road", name: "The Stone Road", joinGateId: "cusco", leaveGateId: "puno", days: 8, countries: ["Peru"], modes: "road · rail", maximumAltitude: "3,800 m", physicalNotice: "February brings rain, wet paths and possible limited visibility.", accommodation: "City and valley nights use the chosen comfort level where supply allows.", arrival: "An acclimatisation day is built into Cusco. This gate is also a Host handover.", promise: "Cusco, the Sacred Valley, Machu Picchu and the Titicaca day train to Puno.", image: { src: "/assets/images/departures/andean/gallery/the-stone-road/04-cusco-19.jpg", alt: "Travellers and motorcycles beside a stone wall near Cusco" },
    legs: [
      { route: "Cusco → Pisac → Maras and Moray → Ollantaytambo", mode: "road vehicle", surface: "paved and local roads" },
      { route: "Ollantaytambo ↔ Aguas Calientes", mode: "tourist rail", surface: "rail" },
      { route: "Aguas Calientes → Cusco", mode: "rail and road", surface: "rail and paved road" },
      { route: "Cusco → Puno", mode: "scheduled day train, standard service", surface: "rail", note: "Not the luxury sleeper" },
    ],
  },
  {
    id: "04", slug: "both-shores", name: "Both Shores", joinGateId: "puno", leaveGateId: "la-paz", days: 7, countries: ["Peru", "Bolivia"], modes: "coach · passenger boat · vehicle barge", maximumAltitude: "4,050 m", physicalNotice: "The Kasani land border is crossed on foot.", accommodation: "Amantaní has one shared family-stay standard; it is the section, not a downgrade.", arrival: "Arrive in Puno the previous day; the hotel night and arrival support are included.", promise: "Titicaca in two countries, Amantaní, Isla del Sol and a border crossed on foot.", image: { src: "/assets/images/departures/andean/gallery/both-shores/03-drive-la-paz-puno-10.jpg", alt: "A traveller beside a vehicle on the road between Puno and La Paz" },
    legs: [
      { route: "Puno → Uros → Taquile → Puno", mode: "passenger boat", surface: "Lake Titicaca" },
      { route: "Puno → Amantaní → Puno", mode: "passenger boat", surface: "Lake Titicaca" },
      { route: "Puno → Kasani → Copacabana", mode: "coach and border crossing on foot", surface: "paved road" },
      { route: "Copacabana ↔ Isla del Sol", mode: "passenger boat", surface: "Lake Titicaca" },
      { route: "Copacabana → Tiquina → La Paz", mode: "coach and vehicle barge", surface: "paved road and water" },
    ],
  },
  {
    id: "05", slug: "thin-air-cloud-forest", name: "Thin Air & Cloud Forest", joinGateId: "la-paz", leaveGateId: "sucre", days: 9, countries: ["Bolivia"], modes: "road · cable car · scheduled flight", maximumAltitude: "4,200 m", physicalNotice: "The section deliberately descends into the Yungas before returning to altitude.", accommodation: "Sajama choices depend on confirmed local supply; three levels are not promised there.", arrival: "Arrive in La Paz the previous day; the hotel night and arrival support are included.", promise: "Cable cars, Tiwanaku, the Yungas and the high emptiness of Sajama.", image: { src: "/assets/images/departures/andean/gallery/thin-air-cloud-forest/02-la-paz-09-copy-2.jpg", alt: "A passenger boarding a painted bus in the Bolivian highlands" },
    legs: [
      { route: "La Paz ↔ Coroico", mode: "road vehicle", surface: "paved mountain road" },
      { route: "La Paz ↔ Tiwanaku", mode: "road vehicle", surface: "paved road" },
      { route: "La Paz ↔ Sajama", mode: "road vehicle", surface: "paved and highland roads" },
      { route: "La Paz → Sucre", mode: "scheduled flight", surface: "air", note: "Flight 2 of 4" },
    ],
  },
  {
    id: "06", slug: "silver-and-bone", name: "Silver & Bone", joinGateId: "sucre", leaveGateId: "uyuni", days: 7, countries: ["Bolivia"], modes: "road", maximumAltitude: "4,090 m", physicalNotice: "The route rises through Potosí before descending to Uyuni.", accommodation: "Urban stays use the chosen comfort level where supply allows.", arrival: "Sucre is the gentlest Bolivian altitude gate; your Host receives you before the group.", promise: "Dinosaur tracks, textiles, colonial wealth and the mountain that financed an empire.", image: { src: "/assets/images/departures/andean/gallery/silver-and-bone/03-bolivia-02a.jpg", alt: "A traveller standing beside a highland road in Bolivia" },
    legs: [
      { route: "Sucre → Potosí", mode: "road coach", surface: "paved mountain road" },
      { route: "Potosí → Uyuni", mode: "road coach", surface: "paved highland road" },
    ],
  },
  {
    id: "07", slug: "the-mirror", name: "The Mirror", joinGateId: "uyuni", leaveGateId: "san-pedro", days: 7, countries: ["Bolivia", "Chile"], modes: "4×4 convoy · road", maximumAltitude: "4,900 m", physicalNotice: "Three Lagunas nights use simple high-altitude refuges with shared bathrooms and limited heating.", accommodation: "No luxury tier exists on the Lagunas crossing.", arrival: "Arrive in Uyuni the previous day; the included hotel night precedes a Host handover.", promise: "Flooded salt, flamingo lagoons, dawn geysers and a high border crossing.", image: { src: "/assets/images/departures/andean/gallery/the-mirror/03-uyuni-05.jpg", alt: "Mountains reflected in shallow water on the Salar de Uyuni" },
    legs: [
      { route: "Uyuni → Colchani → Salar north shore", mode: "Land Cruiser 4×4", surface: "salt" },
      { route: "Salar and Tunupa", mode: "Land Cruiser 4×4", surface: "salt and unpaved tracks" },
      { route: "Salar → rock valleys → Lagunas refuges", mode: "Land Cruiser 4×4 convoy", surface: "unpaved high-altitude tracks" },
      { route: "Laguna Verde → Hito Cajón → San Pedro", mode: "4×4 and road vehicle", surface: "unpaved and paved road", note: "The Bolivia–Chile border is crossed at altitude" },
    ],
  },
  {
    id: "08", slug: "atacama", name: "Atacama", joinGateId: "san-pedro", leaveGateId: "santiago", days: 4, countries: ["Chile"], modes: "road · scheduled flight", maximumAltitude: "4,320 m", physicalNotice: "High-lagoon and geyser excursions climb far above the 2,400 m base.", accommodation: "One base in San Pedro; no packing and repacking during the section.", arrival: "Arrive through Calama the previous day; the hotel night and transfer support are included.", promise: "Salt flats, high lagoons, geysers and the southern night sky.", image: { src: "/assets/images/departures/andean/gallery/atacama/01-astro-01.jpg", alt: "A clear night sky above the Atacama Desert" },
    legs: [
      { route: "San Pedro ↔ Valle de la Luna", mode: "road vehicle", surface: "paved and desert road" },
      { route: "Toconao, Salar de Atacama and high lagoons", mode: "road vehicle", surface: "paved and high-altitude road" },
      { route: "El Tatio and Machuca", mode: "road vehicle", surface: "high-altitude road" },
      { route: "San Pedro → Calama → Santiago", mode: "road transfer and scheduled flight", surface: "paved road and air", note: "Flight 3 of 4" },
    ],
  },
  {
    id: "09", slug: "the-end-of-the-road", name: "The End of the Road", joinGateId: "santiago", leaveGateId: "balmaceda", days: 13, countries: ["Chile"], modes: "scheduled flight · road · vehicle ferries · lake vessel", maximumAltitude: "1,120 m", physicalNotice: "Tortel has stairs and boardwalks; guests carry their own bags from the road.", accommodation: "Villa O’Higgins has a comfortable local standard; no high-end tier is implied.", arrival: "Join at sea level in Santiago. Balmaceda is the final leaving gate only.", promise: "The Carretera Austral, Tortel, Villa O’Higgins and a different ferry return.", image: { src: "/assets/images/departures/andean/gallery/the-end-of-the-road/13-chile-016.jpg", alt: "A wet road disappearing into the mist of Chilean Patagonia", focalPoint: { x: 50, y: 58 } },
    legs: [
      { route: "Santiago → Balmaceda → Coyhaique", mode: "scheduled flight and road vehicle", surface: "air and paved road", note: "Flight 4 of 4" },
      { route: "Coyhaique → Cerro Castillo → Río Tranquilo", mode: "road vehicle", surface: "paved and ripio" },
      { route: "Río Tranquilo → Baker–Nef → Cochrane", mode: "road vehicle", surface: "paved and ripio" },
      { route: "Cochrane → Caleta Tortel", mode: "road vehicle", surface: "ripio", note: "Tortel continues on foot over boardwalks and stairs" },
      { route: "Puerto Yungay → Río Bravo → Villa O’Higgins", mode: "vehicle ferry and road vehicle", surface: "water and ripio" },
      { route: "Villa O’Higgins glacier sailing", mode: "lake vessel", surface: "water" },
      { route: "Villa O’Higgins → Cochrane → Puerto Guadal", mode: "vehicle ferry and road vehicle", surface: "water and ripio" },
      { route: "Puerto Guadal → Chile Chico", mode: "road vehicle", surface: "cliff-cut lake road" },
      { route: "Chile Chico → Puerto Ibáñez → Coyhaique → Balmaceda", mode: "vehicle ferry and road vehicle", surface: "water, paved road and ripio" },
    ],
  },
] as const;

export const gateById = Object.fromEntries(caravanGates.map((gate) => [gate.id, gate])) as Record<string, Gate>;

export const approvedFaq = [
  { id: "friends", question: "Can I join with a friend who wants a different section?", answer: "Yes. You can use different joining and leaving gates and still share the parts of the Caravan where your sections overlap." },
  { id: "leave-early", question: "Can I leave earlier than the gate I booked?", answer: "The Caravan continues on its fixed route. Departure at a place that is not a designated gate is not supported." },
  { id: "only-new", question: "Will I be the only new person joining?", answer: "It depends on the gate. Some gates receive several new travellers; at others, you may be the only arrival. Your Host still makes the welcome deliberate." },
  { id: "fitness", question: "Do I need to be fit?", answer: "The Patagonian core is photo-first and includes no hiking. Tortel does mean stairs and carrying your own bag. The Death Road is never scheduled." },
  { id: "hardest", question: "What’s the hardest day?", answer: "The Nazca to Arequipa drive is the longest road day. The Lagunas crossing also includes simple refuge nights at high altitude." },
] as const;
