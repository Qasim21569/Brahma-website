/**
 * Services page content — capability, not services for hire.
 *
 * BMIG owns and operates its own assets; this page exists to prove it can
 * execute end to end, for sellers, lenders and franchisors. It is NOT a menu of
 * services sold to third parties — that would contradict the "we operate what
 * we own" thesis the rest of the site is built on.
 *
 * ── Why these three pillars and not Acquire / Renovate / Operate ─────────────
 * The homepage `Process` section already runs Acquire → Renovate → Operate.
 * Repeating it here would be the duplicate-copy trap that put the founder story
 * on the homepage twice (defect D-2). So these pillars run on a different axis:
 * the homepage describes *what happens to an asset over time*, these describe
 * *what the group can do*. Keep that distinction if you edit either.
 *
 * ── Rules for editing ────────────────────────────────────────────────────────
 * - No financial figures. Nothing here may claim a return, a yield or a spend.
 * - Only `Brahmas Hospitality Management` may be named as a subsidiary. It is a
 *   hard fact — every one of the 12 properties carries it as `subunit` in
 *   properties.ts. The other registered entities (Funding Group, Development,
 *   …) have real names but their business purposes are INFERRED FROM THE NAME,
 *   which is why they were pulled from the About page. Do not assign them to
 *   pillars without client sign-off.
 * - `body` lines are hand-set for MaskText. Keep each ≲45 characters or they
 *   re-wrap and destroy the intended rag (§2.2).
 */

export type Pillar = {
  title: string;
  /** Hand-broken lines for MaskText. */
  body: string[];
  capabilities: string[];
  /** Only set where properties.ts or company.ts supports the claim. */
  subunit?: string;
};

export const pillars: Pillar[] = [
  {
    title: "Capital Structuring",
    body: [
      "We source assets whose structural quality",
      "exceeds their operating performance, and",
      "structure the capital to acquire them.",
    ],
    capabilities: [
      "Sourcing and underwriting",
      "Capital Structuring",
      "Lender relationships",
    ],
  },
  {
    title: "Repositioning",
    body: [
      "Capital goes into the building and the",
      "brand. Scope is defined asset by asset",
      "and delivered with specialist partners.",
    ],
    capabilities: [
      "Scope definition",
      "Design and build delivery",
      "Brand and franchise alignment",
    ],
  },
  {
    title: "Operations",
    body: [
      "We run what we buy. The team that",
      "underwrites an asset is the same team",
      "accountable for how it performs.",
    ],
    capabilities: [
      "Direct operation",
      "Quarterly performance review",
      "Franchise compliance",
    ],
    // Sourced from properties.ts — all 12 assets carry this as `subunit`.
    subunit: "Brahmas Hospitality Management",
  },
];

/**
 * Short capability chips for the hero list.
 *
 * Title Case throughout, set 2026-08-17. The client asked for the "S" in
 * "Capital structuring"; the other two multi-word entries were capitalised with
 * it, because a list mixing "Capital Structuring" with "Brand alignment" reads
 * as a typo rather than a style. Revert the other two if sentence case was
 * actually wanted.
 */
export const capabilityChips = [
  "Sourcing",
  "Underwriting",
  "Capital Structuring",
  "Repositioning",
  "Brand Alignment",
  "Direct Operation",
];

export type Partner = {
  name: string;
  /** How we describe the relationship. Deliberately conservative — see below. */
  role: string;
  url: string;
  /** Their own stated capabilities, taken from their site. */
  capabilities: string[];
  body: string[];
};

/**
 * Heal Construct — credited construction partner.
 *
 * ⚠️ SCOPE OF THE CLAIM. The client asked for them to be credited as a
 * construction partner, and confirmed the relationship is a **preferred partner
 * / affiliation only** — NOT that Heal Construct has delivered a specific BMIG
 * property. The copy below therefore states the relationship and describes
 * *their* practice, and claims no joint project. Do not add one without
 * client confirmation.
 *
 * Their published portfolio (healconstruct.com, read 2026-08-13) is entirely
 * residential — a 90,000 sq ft residence, a 15,000 sq ft clubhouse, a 6,500 sq
 * ft remodel. **No hospitality work is shown**, so do not describe them as a
 * hotel or hospitality contractor. "Design · Build · BIM" are their own three
 * stated capabilities, verbatim from their services section.
 */
export const constructionPartner: Partner = {
  name: "Heal Construct",
  role: "Construction Partner",
  url: "https://www.healconstruct.com/",
  capabilities: ["Design", "Build", "BIM"],
  body: [
    "Brahmas works with Heal Construct, a",
    "design-build and interior practice, as a",
    "preferred construction partner on",
    "repositioning work.",
  ],
};
