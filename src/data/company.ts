/**
 * Company narrative, leadership, and affiliated ventures.
 *
 * STRUCTURE IS REAL. PROSE IS DRAFT.
 * The founder narrative is written from a Lodging Magazine interview with
 * Sanjay Patel (see SOURCES below). Facts are accurate to that interview;
 * the prose is original and awaits client sign-off.
 *
 * Anything marked TODO needs client input before launch.
 */

export const SOURCES = {
  lodgingMagazine: {
    title: "Starting Off in Hospitality With an Owner Mindset",
    publication: "LODGING Magazine",
    url: "https://lodgingmagazine.com/starting-off-in-hospitality-with-an-owner-mindset/",
  },
} as const;

/** Client-supplied brand mark — intro, navbar, homepage About. */
/**
 * The BMIG mark, as a true vector — 2.7 KB.
 *
 * Was `/BMIG LOGO FINAL.svg` until 2026-08-17. Despite the extension that file
 * is **5.47 MB** and contains ZERO vector paths: it is an SVG wrapper around
 * two base64 PNGs — a 3.7 MB blurred shadow layer beneath a 330 KB sharp mark.
 * It was loaded on every page (navbar twice, homepage, preloader) with
 * `unoptimized`, so all 5.47 MB shipped raw, and the navbar's `priority` put a
 * blocking `<link rel="preload">` for it in every document head.
 *
 * Both embedded PNGs were extracted and compared against this file: same
 * artwork (circle, lotus petals, key), same palette. The only thing lost is the
 * blurred shadow layer, which is imperceptible at the 40–56px the mark is
 * actually displayed at — and cost 3.7 MB.
 *
 * ⚠️ The old file is still in `public/`, so it is still deployed. It is now
 * referenced by nothing; delete it once the vector is signed off visually.
 * Also note the space in its filename — the exact footgun that forced the
 * `public/Site Photos/` → `site-photos/` rename (see HANDOFF landmines).
 */
export const BMIG_LOGO_SRC = "/bmig-logo.svg";

/** Intrinsic ratio of the vector above (viewBox 0 0 150 147). */
export const BMIG_LOGO_SIZE = { width: 150, height: 147 } as const;

/**
 * The original client-supplied file, restored by request for the homepage
 * About/Story section ONLY — 2026-08-17.
 *
 * Still 5.47 MB, still zero vector paths (a wrapped PNG, not a drawing) — see
 * the note above `BMIG_LOGO_SRC`, which is unchanged by this. The two differ
 * visually: this file carries the soft shadow layer the extracted vector
 * doesn't reproduce, which the client preferred at this section's large
 * display size (up to `520px`/`30vw`).
 *
 * The performance objection that got this file replaced everywhere else does
 * NOT apply the same way here: this usage has no `priority`, so Next never
 * emits a blocking `<link rel="preload">` for it, and it lazy-loads only once
 * scrolled near — unlike the navbar/preloader copies, which loaded on every
 * page before the user could see anything.
 *
 * ⚠️ Do not reuse this constant elsewhere without re-checking that reasoning —
 * chrome that appears on first paint (navbar, preloader) should keep using
 * `BMIG_LOGO_SRC`.
 */
export const BMIG_LOGO_FULL_SRC = "/BMIG LOGO FINAL.svg";

/** Intrinsic size of the file above (viewBox 0 0 2160 2160). */
export const BMIG_LOGO_FULL_SIZE = { width: 2160, height: 2160 } as const;

export const founder = {
  name: "Sanjay Patel",
  role: "Chief Executive Officer & President",
  company: "Brahmas Management and Investment Group",
  yearsInIndustry: "27+",
  /** Numeric form of `yearsInIndustry`, for CountUp. Keep the two in step. */
  yearsInIndustryValue: 27,
  /** First equity stake — the Pinellas Park partnership. See `story` below. */
  firstOwnershipYear: 2001,

  /** One-line positioning used in hero/intro contexts. */
  standfirst:
    "An operator before an owner — and an owner who never stopped operating.",

  /** Narrative blocks, in reading order. Original prose; facts per SOURCES. */
  story: [
    {
      heading: "Arrival",
      body: "Sanjay Patel arrived in the United States from India in 1996 with ten dollars and no capital behind him. What he had instead was a willingness to learn the business from its floor — and a conviction that the way to understand a hotel is to run one.",
    },
    {
      heading: "The floor",
      body: "He began at a small Tampa hotel owned by an uncle, taking the controls whenever his uncle was away. From there he moved to an independent property as a night auditor, and made a point of learning every function in the building — housekeeping, front desk, maintenance, the ledger. Within three years he was general manager of a larger hotel in southwest Florida, working sixteen-hour days for three years without taking a day off.",
    },
    {
      heading: "The owner's mindset",
      body: "Long before he held equity, he ran the business as though he did. Every unsold room registered as a personal loss; every dollar of revenue was treated as his own. That discipline is the origin of the company's operating philosophy — that ownership is a way of thinking about an asset, not merely a line on a title.",
    },
    {
      heading: "First ownership",
      body: "In 2001 a physician connected to his employer needed an experienced operator for a property in Pinellas Park, Florida. Patel had no money to contribute, so he contributed expertise instead, negotiating a partnership stake in place of capital. In the first year, revenue rose from $250,000 to $650,000, occupancy reached roughly 95 percent, and he repaid his share of the loan. The property was run by family members and two housekeeping employees.",
    },
    {
      heading: "The group",
      body: "That first success became Brahmas Management and Investment Group. The portfolio has grown to a diversified set of operating assets across hospitality, education, and residential real estate — the majority midscale hotels operating under established franchise systems. As the group's record with lenders lengthened, banks began approaching it directly to take on distressed and bankrupt properties during downturns.",
    },
    {
      heading: "How we hire",
      body: "The company recruits for disposition rather than credentials. Employees who show genuine ownership instinct are trained against nearly three decades of operating knowledge, and the strongest performers are offered equity stakes in new projects — the same path that turned an operator into an owner.",
    },
  ],

  /**
   * Verbatim quotes from the LODGING Magazine interview.
   * ⚠️ Confirm with the client before publishing; credit the publication.
   */
  quotes: [
    {
      text: "Every dollar that was coming in, I acted as if it was coming in for me as an owner.",
      source: "LODGING Magazine",
    },
    {
      text: "I don't look for a degree. I look at the passion the person has.",
      source: "LODGING Magazine",
    },
  ],
} as const;

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  /** Shown when the role is opened — what they actually do day to day. */
  focus: string;
  /** Local path; null renders a monogram placeholder. */
  photo: string | null;
};

/**
 * Leadership grid on /about#team.
 *
 * Headshots are the client-supplied `public/team-member{n}.png` files.
 * ⚠️ Names and titles below are working placeholders until the real roster
 * is confirmed — Sanjay Patel remains the named founder in `founder` above.
 */
export const team: TeamMember[] = [
  {
    id: "rajiv-mehta",
    name: "Rajiv Mehta",
    role: "Chief Investment Officer",
    focus: "Strategy, capital, and lender relationships",
    photo: "/team-member1.png",
  },
  {
    id: "vikram-shah",
    name: "Vikram Shah",
    role: "Director of Acquisitions",
    focus: "Underwriting, diligence, and market selection",
    photo: "/team-member2.png",
  },
  {
    id: "neil-kapoor",
    name: "Neil Kapoor",
    role: "Director of Asset Management",
    focus: "Capital improvement and brand standards",
    photo: "/team-member3.png",
  },
  {
    id: "ananya-rao",
    name: "Ananya Rao",
    role: "Head of Hospitality Operations",
    focus: "Brahmas Hospitality Management",
    photo: "/team-member4.png",
  },
  {
    id: "meera-iyer",
    name: "Meera Iyer",
    role: "Admin",
    focus: "Records, scheduling, and day-to-day office coordination",
    photo: "/team-member5.png",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    role: "Head of Development",
    focus: "Ground-up development and major repositioning",
    photo: "/team-member6.png",
  },
];

export type AffiliatedCompany = {
  name: string;
  /** Display name — title case, used on the site. */
  displayName: string;
  sector: string;
  description: string;
  /** Florida Division of Corporations (Sunbiz) record. */
  sunbizUrl: string | null;
  /** The parent entity is rendered separately from the affiliates. */
  isParent?: boolean;
};

/**
 * Registered entities under common ownership (Florida Sunbiz, client-supplied
 * 2026-08-13). INACTIVE entities are deliberately excluded per client
 * instruction — Brahmas Inc. and Brahmas Investment Group, LLC are omitted.
 *
 * ⚠️ TODO — `sector` and `description` below are INFERRED FROM ENTITY NAMES,
 * not from client-confirmed fact. They must be reviewed before launch; do not
 * publish an inferred business purpose for a legal entity without sign-off.
 *
 * ⚠️ The Sunbiz deep links are search-session URLs and are known to be brittle.
 * Consider replacing with a name search, or dropping the links and simply
 * stating the entities are Florida-registered. See docs/MASTER-PLAN.md §7b.
 */
export const affiliatedCompanies: AffiliatedCompany[] = [
  {
    name: "BRAHMAS MANAGEMENT INVESTMENT GROUP, INC",
    displayName: "Brahmas Management and Investment Group",
    sector: "Parent",
    description:
      "The parent company. Acquires, repositions, and operates the group's assets.",
    sunbizUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=PreviousList&searchNameOrder=BRAHMASMANAGEMENTINVESTMENTGRO%20P140000256070&aggregateId=domp-p14000025607-5c160704-20d1-429a-8302-3d405f8ceaf0&searchTerm=brahmas&listNameOrder=BRAHMAS%20L150000448790",
    isParent: true,
  },
  {
    name: "BRAHMAS HOSPITALITY, LLC",
    displayName: "Brahmas Hospitality",
    sector: "Hotel Operations",
    description:
      "The operating arm. Runs the group's hospitality assets directly, without third-party management.",
    sunbizUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=PreviousList&searchNameOrder=BRAHMASHOSPITALITY%20L130001025770&aggregateId=flal-l13000102577-4b05dd31-0db2-4f72-b51c-daa695175438&searchTerm=brahmas&listNameOrder=BRAHMAS%20L150000448790",
  },
  {
    name: "BRAHMAS HOTELS LLC",
    displayName: "Brahmas Hotels",
    sector: "Hospitality Holdings",
    description: "Holding entity for hotel assets within the group.",
    sunbizUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=PreviousList&searchNameOrder=BRAHMASHOTELS%20L210001426290&aggregateId=flal-l21000142629-a679361b-784e-4dbc-9d2a-70a30085eaf8&searchTerm=brahmas&listNameOrder=BRAHMAS%20L150000448790",
  },
  {
    name: "BRAHMAS PROPERTIES, LLC",
    displayName: "Brahmas Properties",
    sector: "Real Estate",
    description: "Real estate holding entity for the group's property interests.",
    sunbizUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=PreviousList&searchNameOrder=BRAHMASPROPERTIES%20L140001158750&aggregateId=flal-l14000115875-9df64d9e-be1d-44d0-ba07-8121c976f972&searchTerm=brahmas&listNameOrder=BRAHMAS%20L150000448790",
  },
  {
    name: "BRAHMAS DEVELOPMENT LLC",
    displayName: "Brahmas Development",
    sector: "Development",
    description: "Ground-up development and major repositioning projects.",
    sunbizUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=PreviousList&searchNameOrder=BRAHMASDEVELOPMENT%20L210003695990&aggregateId=flal-l21000369599-7bd3348f-8fb1-4be0-83e9-1ac72bf324e1&searchTerm=brahmas&listNameOrder=BRAHMAS%20L150000448790",
  },
  {
    name: "BRAHMAS FUNDING GROUP LLC",
    displayName: "Brahmas Funding Group",
    sector: "Capital",
    description: "Financing and capital structuring for group acquisitions.",
    sunbizUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=PreviousList&searchNameOrder=BRAHMASFUNDINGGROUP%20L170000871070&aggregateId=flal-l17000087107-4b07569c-6e54-41a7-a220-322be9546a6f&searchTerm=brahmas&listNameOrder=BRAHMAS%20L150000448790",
  },
  {
    name: "BRAHMAS PARTNERSHIP LLC",
    displayName: "Brahmas Partnership",
    sector: "Joint Ventures",
    description: "Partnership vehicle for co-invested assets.",
    sunbizUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=PreviousList&searchNameOrder=BRAHMASPARTNERSHIP%20L260003182510&aggregateId=flal-l26000318251-77aa16bd-4ba5-4a82-97eb-e248e9671729&searchTerm=brahmas&listNameOrder=BRAHMAS%20L150000448790",
  },
  {
    name: "BRAHMAS VENTURE LLC",
    displayName: "Brahmas Venture",
    sector: "Investments",
    description: "Investment vehicle for ventures outside the core portfolio.",
    sunbizUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=PreviousList&searchNameOrder=BRAHMASVENTURE%20L230005430950&aggregateId=flal-l23000543095-f84f313f-e01a-4a86-a0d3-a285cbc9acae&searchTerm=brahmas&listNameOrder=BRAHMAS%20L150000448790",
  },
  {
    name: "BRAHMAS LAKELAND LLC",
    displayName: "Brahmas Lakeland",
    sector: "Single Asset",
    description: "Asset-level entity for the Lakeland property.",
    sunbizUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=PreviousList&searchNameOrder=BRAHMASLAKELAND%20L230001904050&aggregateId=flal-l23000190405-ede6b0bc-ed61-4711-aabc-8c9490f7f710&searchTerm=brahmas&listNameOrder=BRAHMAS%20L150000448790",
  },
  {
    name: "BRAHMAS LLC",
    displayName: "Brahmas LLC",
    sector: "Holding",
    description: "Holding entity within the group structure.",
    sunbizUrl:
      "https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=PreviousList&searchNameOrder=BRAHMAS%20L150000448790&aggregateId=flal-l15000044879-7e5d14eb-b29c-487b-abfc-713d4c2851b7&searchTerm=brahmas&listNameOrder=BRAHMAS%20L150000448790",
  },
];

/** Affiliates only — excludes the parent entity. */
export const affiliates = affiliatedCompanies.filter((c) => !c.isParent);

/** Monogram fallback for team members without a headshot. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
