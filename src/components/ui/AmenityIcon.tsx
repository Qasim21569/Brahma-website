/**
 * AmenityIcon — the glyph set for the property Amenities grid.
 *
 * ── Why this is not `ui/Icon.tsx` ────────────────────────────────────────────
 * `Icon` declares `viewBox="0 0 24 24"` but half its paths are drawn on a
 * 16-unit grid (`arrow_forward: "M3 8h9…"`), so those render at two-thirds
 * scale and sit off-centre. Adding twelve more paths to that set would mean
 * inheriting the inconsistency and picking a grid at random per glyph. These
 * are all drawn on a true 24-unit grid, on the same 1.5 stroke as the rest of
 * the site's chrome, so they optically align with each other.
 *
 * Keys are set by `deriveAmenities()` in `scripts/enrich-properties.mjs`. The
 * two sides must agree; an unrecognised key falls back to a neutral dot rather
 * than rendering an empty box, so adding a label before drawing its glyph
 * degrades quietly instead of leaving a hole in the grid.
 */

const amenityPaths: Record<string, string> = {
  // Wi-Fi — three arcs and the emitter dot.
  wifi: "M2.5 8.5a15 15 0 0 1 19 0M5.5 12a10.5 10.5 0 0 1 13 0M8.5 15.5a6 6 0 0 1 7 0M12 19h.01",
  // Breakfast — cup, handle and saucer.
  breakfast: "M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8ZM17 9.5h1.5a2.5 2.5 0 0 1 0 5H17M3 21h15",
  // Pool — water ripples over two posts.
  pool: "M2 18.5c1.8 0 1.8 1.5 3.6 1.5s1.8-1.5 3.6-1.5 1.8 1.5 3.6 1.5 1.8-1.5 3.6-1.5 1.8 1.5 3.6 1.5M7 16V5.5A2.5 2.5 0 0 1 9.5 3M17 16V5.5A2.5 2.5 0 0 0 14.5 3M7 8h10M7 12h10",
  // Fitness — a dumbbell.
  fitness: "M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12",
  // Parking — the P.
  parking: "M4 3h16v18H4zM9.5 17V8h3.2a2.9 2.9 0 0 1 0 5.8H9.5",
  // Shuttle — a bus in profile.
  shuttle: "M4 5h16v9H4zM4 9h16M8 5v4M14 5v4M6 14v2.5M18 14v2.5M3 17h18",
  // Meeting — a table with seats either side.
  meeting: "M3 10h18v4H3zM7 10V7.5M17 10V7.5M7 14v2.5M17 14v2.5M12 4v3M12 17v3",
  // Restaurant — fork and knife.
  restaurant: "M7 3v7a2 2 0 0 0 4 0V3M9 12v9M16 3c-1.5 1.5-1.5 5 0 6.5V21",
  // Bar — a stemmed glass.
  bar: "M5 4h14l-7 7zM12 11v7M8 21h8",
  // Pets — a paw.
  pets: "M12 13.5c2.4 0 4.5 1.9 4.5 4 0 1.4-1.1 2.5-2.5 2.5h-4c-1.4 0-2.5-1.1-2.5-2.5 0-2.1 2.1-4 4.5-4ZM6.5 8.5a1.6 2 0 1 0 0 .01M17.5 8.5a1.6 2 0 1 0 0 .01M9.5 4.5a1.5 2 0 1 0 0 .01M14.5 4.5a1.5 2 0 1 0 0 .01",
  // Family — two figures, one smaller.
  family: "M8 6a2 2 0 1 0 0 .01M8 8.5c-1.7 0-3 1.3-3 3V16h1.5v5h3v-5H11v-4.5c0-1.7-1.3-3-3-3ZM16.5 11a1.6 1.6 0 1 0 0 .01M16.5 13c-1.4 0-2.5 1.1-2.5 2.5V18h1.2v3h2.6v-3H19v-2.5c0-1.4-1.1-2.5-2.5-2.5Z",
  // Accessibility — the seated figure.
  accessible:
    "M12 4.5a1.4 1.4 0 1 0 0 .01M12 8v4.5h4M8.5 11a5.5 5.5 0 1 0 7.8 7.1M16 12.5l2 5.5h2",
  // Accessible parking — the P with the same seated figure alongside.
  "accessible-parking":
    "M3 3h8v18H3zM6 17V8h2.6a2.7 2.7 0 0 1 0 5.4H6M17.5 5a1.2 1.2 0 1 0 0 .01M17.5 8v3.8h3.2M14.8 10.5a4.6 4.6 0 1 0 6.5 6M20.7 11.8l1.6 4.6",
  // Fallback — a neutral dot, so an unknown key is still visibly a bullet.
  _fallback: "M12 12h.01",
};

export function AmenityIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const path = amenityPaths[name] ?? amenityPaths._fallback;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}
