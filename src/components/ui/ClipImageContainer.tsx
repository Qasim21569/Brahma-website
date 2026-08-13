"use client";

import type { ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * ClipImageContainer — exact port of Elementis
 * `components/Client/ClipImageContainer.tsx`.
 *
 * Used for the images INSIDE the Selected Work card. Each layer wipes away
 * bottom-up via `clipPath: inset(0 0 {bottom} 0)` while scaling 1 → 1.05, and
 * stacks with a negative z-index so earlier layers sit in front.
 *
 * Note this is a different mechanism from the full-bleed background layers,
 * which use the 28-bar `useMaskImage`. The reference uses both, together.
 */
export function ClipImageContainer({
  index,
  step,
  scrollYProgress,
  children,
}: {
  index: number;
  /** Scroll fraction each item occupies — 1 / (n - 1) in the reference. */
  step: number;
  scrollYProgress: MotionValue<number>;
  children: ReactNode;
}) {
  const bottom = useTransform(
    scrollYProgress,
    [index * step, index * step + step],
    ["0%", "100%"],
  );

  const scale = useTransform(
    scrollYProgress,
    [(index - 1) * step, index * step + step],
    [1, 1.05],
  );

  const clipPath = useMotionTemplate`inset(0px 0px ${bottom} 0px)`;

  return (
    <motion.div
      className="absolute inset-0"
      style={{ clipPath, zIndex: -index, scale }}
    >
      {children}
    </motion.div>
  );
}
