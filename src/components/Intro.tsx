import Image from "next/image";
import { BMIG_LOGO_SRC } from "@/data/company";

/**
 * The preload curtain — professional BRAHMAS logo reveal.
 *
 * Pure markup — no "use client", no state, no effects.
 * All motion is CSS keyframes in globals.css, orchestrated by the boot
 * script in layout.tsx via the `data-intro` attribute on <html>.
 * This must NOT depend on hydration.
 *
 * Mirrors the mvrk-orbit Intro structure:
 *   .intro-sheet (curtain)
 *     .intro-fill (background layer)
 *     .intro-edge (SVG curved bottom edge — flattens as sheet lifts)
 *     .intro-stage (logo + wordmark content)
 *
 * The curved edge is the key transition: it starts as a deep convex curve
 * below the sheet and flattens to zero as the sheet lifts, creating the
 * illusion of the curtain peeling off the floor.
 */

/** Deep sag. Flattens by scaling to zero height, not by morphing `d`. */
const EDGE_SAG = "M0 0 H100 Q50 40 0 0 Z";

export default function Intro() {
  return (
    <div className="intro-sheet" aria-hidden="true">
      <div className="intro-fill" />

      {/* Curved bottom edge — flattens via scaleY animation as the sheet lifts,
          creating the "curtain peeling off" effect. */}
      <svg
        className="intro-edge"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="intro-edge-path" d={EDGE_SAG} />
      </svg>

      <div className="intro-stage">
        {/* BMIG logo mark — real vector asset */}
        <div className="intro-logo">
          <Image
            src={BMIG_LOGO_SRC}
            alt=""
            width={2160}
            height={2160}
            className="h-full w-full object-contain"
            priority
            unoptimized
          />
        </div>

        {/* Wordmark lockup — width defined by BRAHMAS */}
        <div className="intro-lockup">
          <span className="intro-word-mask">
            <span className="intro-word">BRAHMAS</span>
          </span>
          <span className="intro-rule" aria-hidden="true" />
          <span className="intro-sub">Management and Investment Group</span>
        </div>
      </div>
    </div>
  );
}
