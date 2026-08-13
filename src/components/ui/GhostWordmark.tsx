"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * GhostWordmark — the oversized, near-invisible BRAHMAS behind the CTA band.
 *
 * Replaces the dead `data-wordmark-scale` attribute, which was read by a GSAP
 * provider deleted in Phase 0 (defect D-3). The scale/opacity is now driven by
 * Motion off the section's own scroll progress, so there is no global provider
 * to orphan again.
 *
 * Reduced motion is handled by the app-level <MotionConfig reducedMotion="user">.
 */
export function GhostWordmark({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Swells slightly as the band crosses the viewport, then settles.
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.02, 0.05, 0.02]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
    >
      <motion.span
        style={{ scale, opacity }}
        className="font-display-hero whitespace-nowrap text-[80px] leading-none tracking-tighter text-cream md:text-[200px]"
      >
        {children}
      </motion.span>
    </div>
  );
}
