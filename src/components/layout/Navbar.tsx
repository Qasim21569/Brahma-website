import { getSection } from "@/content/server";
import { NavbarClient } from "./NavbarClient";

/**
 * Server shell for the navbar. The mobile drawer lists the contact email
 * routes, which are editable (Admin → Site settings → Contact details); a
 * client component cannot read them itself, so they are fetched here and
 * passed down. Pages keep importing `Navbar` exactly as before.
 */
export async function Navbar() {
  const [contact, nav] = await Promise.all([
    getSection("global.contact"),
    getSection("global.navigation"),
  ]);
  return (
    <NavbarClient
      links={nav.links}
      contactLabel={nav.contactLabel}
      contactHref={nav.contactHref}
      contactRoutes={contact.routes.map(({ label, email }) => ({ label, email }))}
      operatingRegion={contact.operatingRegion}
    />
  );
}
