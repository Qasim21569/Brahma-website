/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * No `images.remotePatterns` — every image is served from `public/`.
   *
   * `lh3.googleusercontent.com` was whitelisted here to allow five
   * `<Image src="https://lh3.googleusercontent.com/aida-public/…">` tags across
   * the services, contact and careers pages. Those were AI-generated
   * placeholders hotlinked live from Google's CDN: not owned, not licensed, and
   * liable to 404 whenever Google expired the URL. All five are gone
   * (defect D-10), so the whitelist went with them.
   *
   * If Google Places photos are ever rendered remotely rather than downloaded,
   * this is where the host goes back — see docs/PHOTO-PIPELINE.md §4.3.
   */
};

export default nextConfig;
