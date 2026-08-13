"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

const links = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/careers", label: "Join Our Team" },
];

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

/** Inline arrow — replaces the Material Symbols icon font. */
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

/** Elementis-style animated underline: grows from the left on hover,
 *  retracts to the right on leave. Persistent when the link is active. */
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    // Hide when scrolling down past the hero, show when scrolling up.
    if (latest > 220 && latest > prev) setHidden(true);
    else setHidden(false);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    if (mobileOpen) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
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
        {/* Logo lockup: mark + BRAHMAS / subtitle (equal width) */}
        <Link href="/" className="flex items-center gap-2.5 md:gap-3 shrink-0" aria-label="Brahmas — home">
          <Image
            src="/brahmas-vector-logo-preload.svg"
            alt=""
            width={56}
            height={55}
            className="h-12 w-auto md:h-14"
            priority
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

        <button
          className="md:hidden text-ink-navy p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </motion.div>

      {/* Overlay backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Side drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[300px] sm:w-[360px] bg-stone-white shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full px-margin-edge py-8">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 mb-10"
          >
            <Image src="/brahmas-vector-logo-preload.svg" alt="" width={56} height={55} className="h-12 w-auto" priority />
            <span className="inline-flex flex-col leading-none" style={{ width: "max-content" }}>
              <span className="font-serif font-normal text-primary text-[24px] tracking-[-0.01em] leading-none whitespace-nowrap">BRAHMAS</span>
              <span
                className="font-sans font-medium text-primary/70 uppercase text-[6.5px] w-full mt-1"
                style={{ textAlign: "justify", textAlignLast: "justify" }}
              >
                Management and Investment Group
              </span>
            </span>
          </Link>

          <nav className="flex flex-col gap-6 flex-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-[18px] leading-relaxed transition-colors pl-4 border-l-2 ${
                  pathname === link.href
                    ? "text-ink-navy border-ink-navy/60"
                    : "text-ink-navy/60 hover:text-ink-navy border-transparent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="border border-cream/40 text-cream px-6 py-4 rounded-full font-label-caps text-label-caps flex items-center justify-between mt-auto hover:bg-cream hover:text-ink-navy transition-colors"
          >
            Contact Us
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
