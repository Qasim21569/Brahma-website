"use client";

import { motion } from "motion/react";

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

/**
 * DrawnRule — a hairline that draws left-to-right as it enters view.
 *
 * Replaces `RotatingMark`, a mark that turned perpetually beside each pillar
 * heading. Ambient rotation sits in peripheral vision and never resolves; this
 * moves once, settles, and reads as an architectural setting-out line rather
 * than an animation.
 *
 * Used as the top edge of `PillarCard` in place of a static `border-t`, so the
 * card's own boundary is what draws in.
 *
 * Reduced motion is handled by the app-level <MotionConfig reducedMotion="user">,
 * which covers Motion animations — unlike the CSS rotation this replaced, which
 * needed its own `motion-reduce:` variant.
 */
export function DrawnRule({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={`h-px w-full origin-left ${className}`}
    />
  );
}
