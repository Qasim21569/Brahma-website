"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "What We Do" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/careers", label: "Join Our Team" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background border-b border-mortar-grey transition-colors duration-300">
      <div className="flex justify-between items-center w-full px-margin-edge py-6 max-w-container-max mx-auto">
        <Link
          href="/"
          className="font-headline-md text-headline-md font-normal tracking-tight text-primary"
        >
          BRAHMA
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body-md text-body-md transition-colors duration-300 hover:text-muted-azure ${
                pathname === link.href
                  ? "text-primary font-bold border-b border-primary"
                  : "text-on-surface-variant"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-caps text-label-caps hover:bg-ink-navy transition-colors"
        >
          Contact Us
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </Link>

        <button
          className="md:hidden text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-mortar-grey px-margin-edge py-8 flex flex-col gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-body-md text-body-md text-on-surface-variant hover:text-muted-azure"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="font-label-caps text-label-caps text-primary"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}
