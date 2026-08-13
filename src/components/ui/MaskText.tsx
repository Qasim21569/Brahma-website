"use client";

import type { ReactNode, CSSProperties } from "react";
import { motion } from "motion/react";

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

/**
 * MaskText — exact port of Elementis `components/Server/MaskText.tsx`.
 *
 * Each line animates `y: 100% → 0%` together with
 * `clipPath: inset(0% 0% 100% 0%) → inset(0% 0% 0% 0%)`, staggered by the
 * parent via `staggerChildren`.
 *
 * NOTE: there is deliberately **no `overflow: hidden` wrapper**. The clip-path
 * does the masking, and because the resting state is `inset(0 0 0 0)` there is
 * no clipping at rest — which is also why descenders (g, p, y) are safe under
 * `line-height: 1`. Do not add an overflow wrapper back.
 */
export function MaskText({
  lines,
  className = "",
  style,
  once = true,
  amount = 0.3,
  delay = 0,
  stagger = 0.1,
}: {
  lines: ReactNode[];
  className?: string;
  style?: CSSProperties;
  once?: boolean;
  amount?: number;
  delay?: number;
  stagger?: number;
}) {
  const containerVariants = {
    initial: {},
    inView: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const lineVariants = {
    initial: { y: "100%", clipPath: "inset(0% 0% 100% 0%)" },
    inView: {
      y: "0%",
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { ease: EASE, duration: 0.8 },
    },
  };

  return (
    <motion.span
      initial="initial"
      whileInView="inView"
      viewport={{ once, amount }}
      variants={containerVariants}
      style={{ display: "block", ...style }}
      className={className}
    >
      {lines.map((line, i) => (
        <motion.span
          key={i}
          variants={lineVariants}
          style={{ display: "block" }}
        >
          {line}
        </motion.span>
      ))}
    </motion.span>
  );
}
