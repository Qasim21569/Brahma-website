"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * SmoothScrollProvider — owns the single Lenis instance and the scroll
 * behaviour that depends on it.
 *
 * ── Why this holds a context now ─────────────────────────────────────────────
 * Lenis takes over scrolling through its own RAF loop, which means anything
 * else that wants to move the page has to go through it. The instance used to
 * be trapped in a ref no one could reach, so two things were broken:
 *
 *   1. In-page anchor links worked exactly ONCE. `StyledLink` renders a
 *      `next/link`, so clicking `#team` navigated `/about` → `/about#team` and
 *      Next did the scrolling. Scroll away and click the same link again and
 *      the URL is ALREADY `/about#team` — no navigation, no hash change, so
 *      nothing re-triggered a scroll. The scroll was a side effect of
 *      navigating, never of clicking.
 *
 *   2. Landing on a new page mid-scroll. On client-side navigation Next resets
 *      scroll to 0, but Lenis still held the previous page's offset in
 *      `animatedScroll`/`targetScroll` and wrote it back on the next frame —
 *      so the new page opened partway down and then slid upward.
 *
 * Both are fixed here rather than at the call sites: `useScrollToHash` scrolls
 * on the CLICK (so it is repeatable by construction) and the pathname effect
 * resets Lenis on every route change.
 *
 * ⚠️ Lenis is NOT created under `prefers-reduced-motion`, so every consumer
 * must work with a null instance. `useScrollToHash` falls back to an instant
 * native jump.
 *
 * ⚠️ Still not wired to GSAP ScrollTrigger — see BUILD-PLAYBOOK §5 Phase E1.
 */

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/** Reads the fixed navbar height so anchored sections don't land under it. */
function navOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Returns a function that scrolls to an in-page target, every time it is
 * called — independent of the URL, the router, and whether Lenis exists.
 */
export function useScrollToHash() {
  const lenisRef = useContext(LenisContext);

  return useCallback(
    (hash: string) => {
      const id = hash.replace(/^#/, "");
      const el = document.getElementById(id);
      if (!el) return;

      // Resolved against the document, not the viewport, so the result does
      // not depend on where the visitor happens to be scrolled.
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset();
      const lenis = lenisRef?.current;

      if (lenis) {
        // `force` scrolls even when Lenis is stopped — the intro lock stops it.
        lenis.scrollTo(top, { force: true });
      } else {
        // No Lenis means reduced motion; an instant jump is the correct
        // behaviour, not a shortened smooth scroll.
        window.scrollTo({ top, behavior: "auto" });
      }

      // Keep the address bar honest without pushing a history entry — a push
      // would put the same hash on the stack on every click.
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", hash);
      }
    },
    [lenisRef]
  );
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Drops Lenis' inertia when a link leads to a different pathname, so
      // leftover momentum cannot carry into the page being navigated to.
      stopInertiaOnNavigate: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ── Land every navigation at the top ──
  // Declared AFTER the creation effect so `lenisRef.current` is populated on
  // mount. `immediate` is essential: animating to 0 is the visible "scrolls
  // up" symptom rather than the fix for it.
  useEffect(() => {
    // A hash in the URL means the visitor asked for a specific section —
    // forcing the top would override an explicit request.
    if (window.location.hash) return;

    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
