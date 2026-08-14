/**
 * Contact details — SINGLE SOURCE OF TRUTH.
 *
 * ⚠️⚠️ EVERY VALUE HERE NEEDS CLIENT CONFIRMATION BEFORE LAUNCH. ⚠️⚠️
 *
 * The page this replaced published contact details that were provably invented:
 *
 *   - Offices in **New York and London** with full street addresses. BMIG is a
 *     Florida operator; all 12 assets are in Florida. Both were deleted.
 *   - Phone numbers `+1 (212) 555-0198 / -0199`. Area code 212 is Manhattan and
 *     `555-01xx` is the range reserved for fiction. Both were deleted.
 *   - Job openings in New York, Miami and London (careers page). Deleted —
 *     advertising roles that do not exist is worse than a wrong address,
 *     because someone can apply to them.
 *
 * What survived is the email domain, which is *unconfirmed rather than
 * provably false* — it may well be real. It is flagged below, not deleted.
 *
 * RULE: do not add a phone number, street address or office location to this
 * file unless the client has supplied it. Real per-property phone numbers do
 * exist in `properties.ts` and are safe to use.
 */

/** Flip to false once the client has confirmed every value below. */
export const CONTACT_DETAILS_UNCONFIRMED = true;

export type ContactRoute = {
  label: string;
  /** What this route is for, in the visitor's terms. */
  description: string;
  email: string;
};

/**
 * ⚠️ UNCONFIRMED DOMAIN. Note it is `brahmagroup.com` — no "s" — which
 * contradicts the brand rule that it is always "Brahmas" (Phase F4). Either the
 * domain is genuinely spelled that way, or these addresses are wrong. Confirm
 * before launch; do not silently "correct" it, as that would invent an address
 * that may not exist.
 */
export const contactRoutes: ContactRoute[] = [
  {
    label: "Investment",
    description: "Assets for sale, joint ventures, and lender enquiries.",
    email: "investments@brahmagroup.com",
  },
  {
    label: "General",
    description: "Anything else about the group and its operations.",
    email: "info@brahmagroup.com",
  },
  {
    label: "Press",
    description: "Media enquiries and interview requests.",
    email: "press@brahmagroup.com",
  },
];

/** The single address the CTA and form default to. */
export const primaryEmail = "info@brahmagroup.com";

/**
 * Where the group actually operates. This IS confirmed — it is derived from the
 * portfolio, every asset of which is in Florida.
 */
export const operatingRegion = "Florida, United States";

export type EnquiryTopic = { value: string; label: string };

export const enquiryTopics: EnquiryTopic[] = [
  { value: "investment", label: "Investment or joint venture" },
  { value: "selling", label: "Selling an asset" },
  { value: "press", label: "Press and media" },
  { value: "careers", label: "Careers" },
  { value: "general", label: "General enquiry" },
];
