"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { initials } from "@/data/company";

/**
 * TeamPhoto — desaturated headshot that returns to full colour on engagement.
 *
 * The reference is zha.com/people: a grid of portraits sitting in greyscale
 * that bloom back to colour as you move across them.
 *
 * ── Why hover is CSS and only the tap is JavaScript ──────────────────────────
 * The desktop half is a plain `group-hover:grayscale-0`. No state, no
 * listeners, no hydration dependency — the effect works on the very first paint
 * and keeps working if JS never arrives. Tailwind v4 compiles hover variants
 * inside `@media (hover:hover)` on its own, so that half is already restricted
 * to devices that can actually hover.
 *
 * Touch devices are the actual problem, and it is the same one recorded in
 * BUILD-PLAYBOOK §2.6 for `HoverReveal` on the portfolio cards: **`:hover`
 * never fires on touch**, so a hover-only treatment leaves every phone visitor
 * looking at a permanently grey grid with no way to know it was meant to do
 * anything. So on coarse pointers the photo latches to colour on tap.
 *
 * ── Why the media query and not `useIsMobile()` ──────────────────────────────
 * `(hover: hover)` asks the question we actually care about — can this device
 * hover — rather than inferring it from viewport width. A small window on a
 * desktop is not a touch device, and a large tablet is. It also keeps the
 * DESKTOP path entirely in CSS: `useIsMobile` defaults to false during SSR and
 * corrects after hydration, which is right for choosing between two layouts but
 * would mean the hover effect depended on JS for no reason.
 *
 * Nothing here returns `null` or renders a different tree per viewport — both
 * pointer types get the same markup, so crawlers and non-JS visitors see the
 * full grid. Rule 9 holds.
 */
export function TeamPhoto({
  src,
  name,
  role,
  className = "",
}: {
  src: string | null;
  name: string;
  role: string;
  className?: string;
}) {
  const [canHover, setCanHover] = useState(true);
  const [revealed, setRevealed] = useState(false);

  // Defaults to `true` (hover-capable) so the server-rendered markup carries no
  // tap affordance — the same reasoning as useIsMobile defaulting to desktop.
  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Monogram fallback — no photo to desaturate, so none of the above applies.
  if (!src) {
    return (
      <div
        className={`flex aspect-[3/4] w-full items-center justify-center bg-surface-container ${className}`}
        aria-hidden="true"
      >
        <span className="font-display-hero text-[36px] leading-none text-primary/25">
          {initials(name)}
        </span>
      </div>
    );
  }

  const interactive = !canHover;

  return (
    <div
      className={`group relative aspect-[3/4] w-full overflow-hidden bg-surface-container ${className}`}
      // Tap-to-reveal is wired ONLY on coarse pointers. On a mouse this would
      // latch the photo to colour after a stray click and leave it stuck there
      // once the cursor moved away, fighting the hover it already has.
      onClick={interactive ? () => setRevealed((v) => !v) : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? revealed : undefined}
      aria-label={interactive ? `Show ${name}, ${role} in colour` : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setRevealed((v) => !v);
              }
            }
          : undefined
      }
    >
      <Image
        src={src}
        alt={`${name}, ${role}`}
        fill
        unoptimized
        loading="lazy"
        className={[
          "object-cover object-[center_18%]",
          // 0.7s sits at the top of the §2.3 range (0.6–0.8s). The one easing.
          "transition-[filter,transform] duration-700 ease-[cubic-bezier(0.24,0.43,0.15,0.97)]",
          // Base state. `grayscale` alone reads flat against the warm canvas,
          // so a little contrast comes off with it and returns on reveal.
          revealed ? "grayscale-0" : "grayscale",
          // Hover-capable pointers only — a tap on a phone cannot trigger the
          // sticky :hover state some mobile browsers emulate.
          //
          // No `[@media(hover:hover)]:` wrapper needed: **Tailwind v4 already
          // compiles every hover variant inside `@media (hover:hover)`**, which
          // is a v4 behaviour change from v3. Writing it explicitly emitted a
          // nested duplicate of the same query — verified in the compiled CSS.
          "group-hover:grayscale-0",
          "group-hover:scale-[1.03]",
        ].join(" ")}
      />

      {/* Touch affordance. Without it the grid reads as "these photos are just
          grey", which is exactly how the portfolio cards failed on mobile
          before they were given an explicit button. Hidden from hover-capable
          pointers, and hidden once the photo is already in colour. */}
      {interactive && !revealed && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center border border-cream/50 bg-ink-deep/60 backdrop-blur-sm"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-cream">
            <path
              d="M8 3.5C4.8 3.5 2.3 6 1.5 8c.8 2 3.3 4.5 6.5 4.5s5.7-2.5 6.5-4.5c-.8-2-3.3-4.5-6.5-4.5Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="8" cy="8" r="1.9" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
      )}
    </div>
  );
}
