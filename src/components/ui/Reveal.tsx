"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useInView } from "motion/react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  /** Entrance direction the element travels FROM. Default "up". */
  direction?: Direction;
  /** Seconds to wait before animating. */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Travel distance in px. */
  distance?: number;
  /** Only animate the first time it enters view. Default true. */
  once?: boolean;
  /** Portion of the element that must be in view to trigger (0–1). */
  amount?: number;
  className?: string;
  style?: CSSProperties;
}

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

function offset(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    default:
      return {};
  }
}

/**
 * Scroll-triggered entrance reveal (Motion `useInView`). Fades + slides the
 * element into place when it scrolls into view. Respects reduced motion via
 * the app-level <MotionConfig reducedMotion="user">.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 30,
  once = true,
  amount = 0.2,
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset(direction, distance) }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
