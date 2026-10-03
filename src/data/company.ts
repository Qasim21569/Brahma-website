/**
 * Brand assets and registered entities.
 *
 * The founder narrative, quotes and team roster that used to live here moved to
 * `src/content/sections/global.ts` on 2026-10-03 and are now edited in the
 * admin (Company → Founder / Team). Their sourcing rules moved with them.
 *
 * Anything marked TODO needs client input before launch.
 */

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
