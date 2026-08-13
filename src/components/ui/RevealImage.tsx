"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useInView } from "motion/react";

interface RevealImageProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
  amount?: number;
  delay?: number;
  /** Direction the clip opens from. "up" = wipes upward. Default "up". */
  direction?: "up" | "down";
}

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

/**
 * Scroll-triggered clip-path image reveal — the inner content wipes in from an
 * inset clip while easing from a slight overscale (1.15 → 1). Wrap a next/image
 * <Image> or any block. The wrapper must define the visible size/aspect.
 */
export function RevealImage({
  children,
  className,
  style,
  once = true,
  amount = 0.25,
  delay = 0,
  direction = "up",
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });

  const from =
    direction === "down" ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)";

  return (
    <div
      ref={ref}
      className={className}
      style={{ overflow: "hidden", ...style }}
    >
      <motion.div
        style={{ width: "100%", height: "100%", willChange: "clip-path, transform" }}
        initial={{ clipPath: from, scale: 1.15 }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 } : undefined}
        transition={{
          clipPath: { duration: 0.6, delay, ease: EASE },
          scale: { duration: 0.9, delay, ease: EASE },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
