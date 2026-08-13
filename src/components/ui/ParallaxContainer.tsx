"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * ParallaxContainer — exact port of Elementis
 * `components/Client/ParallaxContainer.tsx`.
 *
 * This is the effect where an image appears to **move within its own frame** as
 * you scroll: the outer element clips, the inner element translates (and, when
 * the frame is shorter than the viewport, scales slightly so no edge is
 * exposed). `origin-bottom` keeps the growth anchored.
 *
 * Desktop only — wrap with `ResponsiveImage`, which drops the effect on mobile
 * exactly as the reference does.
 */
export function ParallaxContainer({
  children,
  className = "",
  style,
  parallaxAmount,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Travel, as a percentage of the frame. Elementis uses 8 for section images. */
  parallaxAmount: number;
}) {
  const imageContainer = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageContainer,
    offset: ["start end", "end start"],
  });

  const scrollY = useTransform(scrollYProgress, (latest) => {
    const vh = globalThis.window?.innerHeight ?? 0;
    const h = imageContainer.current?.getBoundingClientRect().height ?? 0;
    return latest * (vh + h);
  });

  const transform = useTransform(scrollY, (latest) => {
    const vh = globalThis.window?.innerHeight ?? 0;
    const containerHeight =
      imageContainer.current?.getBoundingClientRect().height ?? 0;

    if (containerHeight >= vh) {
      return `translateY(${
        scrollYProgress.get() * parallaxAmount * 2 - parallaxAmount
      }%) scale(1)`;
    }

    const denom = vh - containerHeight || 1;
    return `translateY(${
      (parallaxAmount / denom) * (latest - containerHeight)
    }%) scale(${1 + 0.01 * parallaxAmount})`;
  });

  return (
    <motion.div className="overflow-hidden" ref={imageContainer}>
      <motion.div
        style={{ transform, ...style }}
        className={`origin-bottom ${className}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
