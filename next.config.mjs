/**
 * `images.remotePatterns` admits exactly one remote origin: this project's
 * Supabase Storage `media` bucket, where images uploaded through the admin
 * live. Everything else is still served from `public/`.
 *
 * `lh3.googleusercontent.com` was once whitelisted here to allow five
 * `<Image src="https://lh3.googleusercontent.com/aida-public/…">` tags across
 * the services, contact and careers pages. Those were AI-generated
 * placeholders hotlinked live from Google's CDN: not owned, not licensed, and
 * liable to 404 whenever Google expired the URL. All five are gone
 * (defect D-10), so the whitelist went with them. If Google Places photos are
 * ever rendered remotely rather than downloaded, that host goes back — see
 * docs/PHOTO-PIPELINE.md §4.3.
 */
function supabaseMediaPattern() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return [];
  try {
    const { protocol, hostname } = new URL(raw);
    return [
      {
        protocol: protocol.replace(":", ""),
        hostname,
        pathname: "/storage/v1/object/public/media/**",
      },
    ];
  } catch {
    return [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: supabaseMediaPattern(),
  },
};

export default nextConfig;
