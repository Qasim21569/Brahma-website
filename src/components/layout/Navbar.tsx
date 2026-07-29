"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/careers", label: "Join Our Team" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    if (mobileOpen) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

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
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span className="material-symbols-outlined">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Overlay backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Side drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[300px] sm:w-[360px] bg-surface shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full px-margin-edge py-8">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="font-headline-md text-headline-md text-primary mb-12"
          >
            BRAHMA
          </Link>

          {/* Nav links */}
          <nav className="flex flex-col gap-6 flex-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-[18px] leading-relaxed transition-colors pl-4 border-l-2 ${
                  pathname === link.href
                    ? "text-primary font-bold border-primary"
                    : "text-on-surface-variant hover:text-primary border-transparent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact CTA */}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="bg-primary text-on-primary px-6 py-4 rounded-full font-label-caps text-label-caps flex items-center justify-between mt-auto hover:bg-ink-navy transition-colors"
          >
            Contact Us
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
