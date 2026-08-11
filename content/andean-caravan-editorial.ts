import type { CanonicalCaravanImageSlug } from "@/content/andean-caravan-images";

interface AndeanCaravanEditorialChapter {
  readonly proposition: string;
  readonly characterTitle: string;
  readonly character: string;
}

export const andeanCaravanEditorial: Readonly<
  Record<CanonicalCaravanImageSlug, AndeanCaravanEditorialChapter>
> = {
  "sea-to-stone": {
    proposition:
      "The Pacific is where this section begins; Puno’s altiplano is where it leaves us, by way of Colca, Cusco and Machu Picchu.",
    characterTitle: "Altitude is allowed to arrive slowly.",
    character:
      "Desert archaeology and long coastal roads lead to two quieter days in Arequipa, Colca’s 4,910 m pass, a flight to Cusco, two Machu Picchu entries and the day train to Puno.",
  },
  "the-stone-road": {
    proposition:
      "Begin in Cusco, move through the Sacred Valley and Machu Picchu, then cross the altiplano by day train to Puno.",
    characterTitle: "Eight days, without hurrying the altitude.",
    character:
      "The Stone Road is the short form within Sea to Stone: two measured Cusco days, the Sacred Valley, two Machu Picchu entries, a weather buffer and the full-day rail crossing to Puno.",
  },
  "both-shores": {
    proposition:
      "Lake Titicaca holds both sides of this section: Puno and Amantaní, Copacabana and Isla del Sol, then La Paz and Sucre.",
    characterTitle: "A border crossed at the pace of the lake.",
    character:
      "Both Shores moves by boat, steep island paths and the Kasani border on foot. After La Paz and Tiwanaku, the modern road drops into Coroico’s cloud forest. A protected Puno day keeps weather from becoming haste.",
  },
  "the-mirror": {
    proposition:
      "The salt may become a mirror; we will not promise that it does. From Sucre, the route crosses the Salar into the Atacama.",
    characterTitle: "Conditions choose the exact line.",
    character:
      "Sucre, Maragua and Potosí lead to two days held for the Salar. The second begins five demanding days: long 4×4 travel, three refuge nights and a pre-dawn high-border crossing.",
  },
  "the-end-of-the-road": {
    proposition:
      "From Santiago, fly into Aysén and follow the Carretera Austral to Villa O’Higgins, then return by road and ferry to Balmaceda.",
    characterTitle: "Here, weather sets the tempo.",
    character:
      "Small vessels, vehicle ferries, Tortel’s boardwalks and long ripio days carry the route south and back. The Caravan stops at Balmaceda Airport; the included exit flight returns travellers to Santiago.",
  },
};

export const andeanCaravanEnquiry = {
  eyebrow: "Enquiry",
  heading: "Which part of the road stayed with you?",
  invitation:
    "Tell us which section—or run of sections—has stayed with you. This is an expression of interest, not a booking.",
  status:
    "No payment is taken. We’ll write when confirmed dates, availability and next steps are ready.",
} as const;
