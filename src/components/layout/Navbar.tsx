"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { BMIG_LOGO_SRC } from "@/data/company";

const links = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/careers", label: "Join Our Team" },
];

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

/** Inline arrow */
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Elementis-style animated underline */
function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className="group relative inline-block">
      <motion.span
        initial="rest"
        animate="rest"
        whileHover="hover"
        className="relative inline-block font-body-md text-body-md text-ink-navy/80"
      >
        {label}
        <motion.span
          className="absolute -bottom-1 h-px bg-primary"
          variants={{
            rest: active
              ? { width: "100%", left: 0, right: "auto" }
              : { width: "0%", right: 0, left: "auto" },
            hover: { width: "100%", left: 0, right: "auto" },
          }}
          transition={{
            left: { duration: 0 },
            right: { duration: 0 },
            width: { duration: 0.6, ease: EASE },
          }}
        />
      </motion.span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (latest > 220 && latest > prev) setHidden(true);
    else setHidden(false);
  });

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    if (drawerOpen) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <>
      {/* ── Desktop + base bar ── */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-50"
        initial={{ y: 0 }}
        animate={{
          y: hidden ? "-100%" : "0%",
          backgroundColor: scrolled ? "rgba(244,241,236,0.92)" : "rgba(244,241,236,0.88)",
          borderColor: scrolled ? "rgba(184,176,164,0.5)" : "rgba(184,176,164,0.3)",
          backdropFilter: scrolled ? "blur(12px)" : "blur(4px)",
        }}
        transition={{ y: { duration: 0.6, ease: EASE }, default: { duration: 0.4, ease: EASE } }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <motion.div
          className="flex justify-between items-center w-full px-margin-edge"
          style={{ paddingTop: 10, paddingBottom: 10 }}
        >
          {/* Logo lockup */}
          <Link href="/" className="flex items-center gap-2.5 md:gap-3 shrink-0" aria-label="Brahmas — home">
            <Image
              src={BMIG_LOGO_SRC}
              alt=""
              width={2160}
              height={2160}
              className="h-12 w-auto md:h-14"
              priority
              unoptimized
            />
            <span className="inline-flex flex-col leading-none" style={{ width: "max-content" }}>
              <span className="font-serif font-normal text-primary text-[22px] md:text-[26px] tracking-[-0.01em] leading-none whitespace-nowrap">
                BRAHMAS
              </span>
              <span
                className="font-sans font-medium text-primary/70 uppercase text-[6px] md:text-[6.5px] w-full mt-0.5"
                style={{ textAlign: "justify", textAlignLast: "justify" }}
              >
                Management and Investment Group
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </div>

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 border border-ink-navy/20 text-ink-navy px-6 py-2.5 rounded-full font-label-caps text-label-caps hover:bg-ink-navy hover:text-cream transition-colors duration-300"
          >
            Contact Us
            <ArrowIcon className="w-4 h-4" />
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden text-ink-navy p-1"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
          >
            <svg viewBox="0 0 22 14" fill="none" className="w-7 h-7" aria-hidden="true">
              {drawerOpen ? (
                <path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M1 13h20M1 7h20M1 1h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
      </motion.div>
      </motion.nav>

      {/* ── Mobile full-screen drawer ── */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundColor: "#0a1220",
          transition: "opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="flex h-full flex-col">
          {/* Top bar: logo + close button */}
          <div className="flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2.5"
            >
              <Image src={BMIG_LOGO_SRC} alt="" width={2160} height={2160} className="h-10 w-auto" unoptimized />
              <span className="inline-flex flex-col leading-none" style={{ width: "max-content" }}>
                <span className="font-serif font-normal text-cream text-[20px] tracking-[-0.01em] leading-none whitespace-nowrap">BRAHMAS</span>
                <span
                  className="font-sans font-medium text-cream/60 uppercase text-[5.5px] w-full mt-0.5"
                  style={{ textAlign: "justify", textAlignLast: "justify" }}
                >
                  Management and Investment Group
                </span>
              </span>
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center text-cream"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M2 2l18 18M20 2L2 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Nav links — centered vertically */}
          <nav className="flex flex-1 flex-col justify-center gap-6 px-8">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className="inline-flex items-center gap-4 text-cream font-serif italic text-3xl tracking-[-0.005em] transition-opacity duration-200 hover:opacity-70"
                style={{
                  fontStyle: "italic",
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                }}
              >
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: "rgba(244, 241, 236, 0.35)" }}
                />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="px-8 pb-10 pt-4">
            <Link
              href="/contact"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex items-center justify-between w-full border border-cream/30 text-cream px-6 py-4 rounded-full font-label-caps text-label-caps transition-colors duration-300 hover:bg-cream hover:text-ink-deep"
            >
              Contact Us
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
