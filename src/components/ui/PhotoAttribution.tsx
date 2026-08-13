/**
 * PhotoAttribution — the credit line for a photograph that requires one.
 *
 * Google's Places API requires that when a returned photo carries
 * `authorAttributions`, the attribution is displayed wherever the image is
 * displayed. Any surface showing a Places-sourced photo must render this.
 *
 * Renders nothing for our own photography (client-supplied or franchise media
 * kits), which passes `attribution: null` — so it is safe to drop next to every
 * image unconditionally.
 *
 * Deliberately a server component: it is static text, and making it a client
 * component would ship JS for a caption.
 */
export function PhotoAttribution({
  attribution,
  className = "",
}: {
  attribution?: string | null;
  className?: string;
}) {
  if (!attribution) return null;

  return (
    <p
      className={`font-label-caps text-label-caps text-on-surface-variant/70 mt-2 ${className}`}
    >
      Photo: {attribution}
    </p>
  );
}
