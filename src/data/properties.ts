export type Property = {
  slug: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  category: string;
  acquiredYear: string;
  subunit: string;
  summary: string;
  longform: string;
  acquisition: string;
  renovation: string;
  operations: string;
  outcomesNote: string;
  homeHeroSrc: string;
  homeSatelliteSrc: string;
  gallery: { src: string; alt: string }[];
};

export const properties: Property[] = [
  {
    slug: "hampton-inn-tampa-veterans-expwy",
    name: "Hampton Inn Tampa-Veterans Expwy (Airport North)",
    shortName: "Hampton Inn Tampa Veterans Expressway",
    address: "5628 W Waters Ave, Tampa, FL 33634",
    city: "Tampa, Florida",
    category: "Acquisition",
    acquiredYear: "2024",
    subunit: "Brahmas Hospitality Management",
    summary:
      "Acquired below replacement cost. Renovation complete. Held and operated under Brahmas Hospitality Management since handover.",
    longform:
      "Acquired below replacement cost from a regional operator seeking liquidity. The asset had strong bones and a stable Florida hospitality position, but its operational performance lagged its location grade. Brahmas acquired with the intent to reposition the property under our hospitality thesis.",
    acquisition:
      "Identify underperforming hotels in prime markets where structural quality exceeds current operating performance.",
    renovation:
      "Building envelope, room interiors, public space modernization, and brand repositioning under capital improvement program.",
    operations:
      "Held and operated directly under Brahmas Hospitality Management. Quarterly performance review against investment thesis.",
    outcomesNote: "Outcomes reported at financial close of fiscal year one.",
    homeHeroSrc: "/properties/hampton-inn-tampa-veterans-expwy/01-hero.webp",
    homeSatelliteSrc: "/properties/hampton-inn-tampa-veterans-expwy/02-satellite.webp",
    gallery: [
      {
        src: "/properties/hampton-inn-tampa-veterans-expwy/01-hero.webp",
        alt: "Hampton Inn Tampa Veterans Expressway exterior anchor shot",
      },
      {
        src: "/properties/hampton-inn-tampa-veterans-expwy/03-gallery-1.webp",
        alt: "Hampton Inn Tampa interior detail",
      },
      {
        src: "/properties/hampton-inn-tampa-veterans-expwy/04-gallery-2.webp",
        alt: "Hampton Inn Tampa room interior",
      },
      {
        src: "/properties/hampton-inn-tampa-veterans-expwy/05-gallery-3.webp",
        alt: "Hampton Inn Tampa public space",
      },
      {
        src: "/properties/hampton-inn-tampa-veterans-expwy/06-gallery-4.webp",
        alt: "Hampton Inn Tampa building exterior detail",
      },
    ],
  },
  {
    slug: "clarion-pointe-tampa-brandon",
    name: "Clarion Pointe Tampa-Brandon Near Fairgrounds and Casino",
    shortName: "Clarion Pointe Tampa Brandon",
    address: "Tampa, Florida",
    city: "Tampa, Florida",
    category: "Acquisition",
    acquiredYear: "2024",
    subunit: "Brahmas Hospitality Management",
    summary:
      "Acquired below replacement cost. Renovation complete. Held and operated under Brahmas Hospitality Management since handover.",
    longform:
      "Located near the Florida State Fairgrounds and the Seminole Hard Rock event corridor, the property benefits from year-round demand drivers. Brahmas acquired the asset and initiated a full operational and physical repositioning on closing.",
    acquisition:
      "Identify underperforming hotels near secular demand drivers whose structure supports long-term performance.",
    renovation:
      "Interior refurbishment, building envelope improvements, operating model reset, and brand repositioning.",
    operations:
      "Held and operated directly under Brahmas Hospitality Management. Quarterly performance review against investment thesis.",
    outcomesNote: "Outcomes reported at financial close of fiscal year one.",
    homeHeroSrc: "/properties/clarion-pointe-tampa-brandon/01-hero.webp",
    homeSatelliteSrc: "/properties/clarion-pointe-tampa-brandon/02-satellite.webp",
    gallery: [
      {
        src: "/properties/clarion-pointe-tampa-brandon/01-hero.webp",
        alt: "Clarion Pointe Tampa Brandon exterior anchor shot",
      },
      {
        src: "/properties/clarion-pointe-tampa-brandon/02-satellite.webp",
        alt: "Clarion Pointe Tampa Brandon public space",
      },
      {
        src: "/properties/clarion-pointe-tampa-brandon/03-gallery-1.webp",
        alt: "Clarion Pointe Tampa Brandon interior detail",
      },
      {
        src: "/properties/clarion-pointe-tampa-brandon/04-gallery-2.webp",
        alt: "Clarion Pointe Tampa Brandon building exterior",
      },
      {
        src: "/properties/clarion-pointe-tampa-brandon/05-gallery-3.webp",
        alt: "Clarion Pointe Tampa Brandon room interior",
      },
    ],
  },
];
