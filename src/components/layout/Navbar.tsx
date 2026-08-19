"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { BMIG_LOGO_SRC, BMIG_LOGO_SIZE } from "@/data/company";
import { contactRoutes, operatingRegion } from "@/data/contact";

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
              width={BMIG_LOGO_SIZE.width}
              height={BMIG_LOGO_SIZE.height}
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

          {/* Hamburger (mobile only). Open-only: the drawer sits above this bar
              at z-60 and carries its own close control, so the previous
              drawerOpen branch drew a burger that was never visible. */}
          <button
            className="-mr-1 grid h-11 w-11 place-items-center text-ink-navy md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <svg viewBox="0 0 22 14" fill="none" className="h-7 w-7" aria-hidden="true">
              <path d="M1 13h20M1 7h20M1 1h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
      </motion.div>
      </motion.nav>

      {/* ── Mobile full-screen drawer ──
          LIGHT canvas, deliberately. The lockup's mark is drawn for a light
          background — on the previous #0a1220 drawer it muddied while the
          wordmark beside it stayed cream, so the two halves of one lockup
          disagreed. Cream removes the conflict at the root: this is the same
          logo treatment the desktop bar already uses, unmodified. Accent
          colour is `muted-azure-dim` (4.77:1 on cream) — `muted-azure` is the
          DARK-canvas variant and measures 2.48:1 here. See PLAYBOOK §2.5. */}
      <div
        className={`fixed inset-0 z-[60] bg-stone-white md:hidden ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ transition: "opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        aria-hidden={!drawerOpen}
        // Closed, this stays mounted (so it never returns null and renders
        // server-side) but must not be tab-reachable — aria-hidden alone with
        // focusable children is an ARIA violation.
        inert={!drawerOpen}
      >
        <div className="flex h-full flex-col">
          {/* Top bar — geometry mirrors the real navbar exactly (px-margin-edge,
              10px pad, h-12 mark) so the lockup does not shift when opening. */}
          <div
            className="flex items-center justify-between px-margin-edge"
            style={{ paddingTop: 10, paddingBottom: 10 }}
          >
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2.5 shrink-0"
              aria-label="Brahmas — home"
            >
              <Image
                src={BMIG_LOGO_SRC}
                alt=""
                width={BMIG_LOGO_SIZE.width}
                height={BMIG_LOGO_SIZE.height}
                className="h-12 w-auto"
                unoptimized
              />
              <span className="inline-flex flex-col leading-none" style={{ width: "max-content" }}>
                <span className="font-serif font-normal text-primary text-[22px] tracking-[-0.01em] leading-none whitespace-nowrap">
                  BRAHMAS
                </span>
                <span
                  className="font-sans font-medium text-primary/70 uppercase text-[6px] w-full mt-0.5"
                  style={{ textAlign: "justify", textAlignLast: "justify" }}
                >
                  Management and Investment Group
                </span>
              </span>
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="-mr-1 grid h-11 w-11 place-items-center text-ink-navy"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M2 2l18 18M20 2L2 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* ── Editorial index ──
              Left-aligned, each route carrying the NN counter already used on
              the portfolio grid and detail pages. Lines rise under a clip mask
              on the house easing — the MaskText vocabulary, not a new one. */}
          <motion.nav
            className="flex flex-1 flex-col justify-center px-margin-edge"
            initial={false}
            animate={drawerOpen ? "open" : "closed"}
            variants={{
              open: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
              closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
            }}
          >
            {links.map((link, i) => {
              const active = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  className="overflow-hidden border-t border-outline-variant/60 first:border-t-0"
                  variants={{
                    open: { opacity: 1 },
                    closed: { opacity: 0 },
                  }}
                >
                  <motion.div
                    variants={{
                      open: { y: "0%", opacity: 1, transition: { duration: 0.65, ease: EASE } },
                      closed: { y: "60%", opacity: 0, transition: { duration: 0.3, ease: EASE } },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="flex items-baseline gap-4 py-4"
                    >
                      <span
                        aria-hidden
                        className={`font-sans text-[11px] font-medium tabular-nums tracking-[0.08em] ${
                          active ? "text-muted-azure-dim" : "text-mortar-grey/70"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-serif text-[34px] font-light leading-none tracking-[-0.01em] ${
                          active ? "text-muted-azure-dim" : "text-ink-navy"
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.nav>

          {/* ── In-menu footer ── confirmed data only: the operating region is
              derived from the portfolio, the routes come from contact.ts. */}
          <motion.div
            className="px-margin-edge pb-10 pt-4"
            initial={false}
            animate={drawerOpen ? "open" : "closed"}
            variants={{
              open: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.34 } },
              closed: { opacity: 0, y: 12, transition: { duration: 0.25, ease: EASE } },
            }}
          >
            <Link
              href="/contact"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex min-h-11 w-full items-center justify-between rounded-full bg-ink-deep px-6 py-4 font-label-caps text-label-caps text-cream transition-opacity duration-300 hover:opacity-90"
            >
              Contact Us
              <ArrowIcon className="h-4 w-4" />
            </Link>

            <div className="mt-6 border-t border-outline-variant/60 pt-5">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.08em] text-muted-azure-dim">
                {operatingRegion}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {contactRoutes.map((route) => (
                  <li key={route.email} className="flex items-baseline justify-between gap-4">
                    <span className="font-sans text-[11px] uppercase tracking-[0.08em] text-mortar-grey">
                      {route.label}
                    </span>
                    <a
                      href={`mailto:${route.email}`}
                      className="font-body-md text-[13px] text-ink-navy/80 underline-offset-4 hover:underline"
                    >
                      {route.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
