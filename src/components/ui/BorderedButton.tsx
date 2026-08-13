"use client";

import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

/**
 * BorderedButton — SVG border draws on hover (§4.6, Elementis).
 *
 * Matches the Elementis pattern: outer motion.div triggers hover state,
 * an SVG path traces the border outline via pathLength animation.
 */
export function BorderedButton({
  children,
  href,
  className = "",
  light = false,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  light?: boolean;
}) {
  const textColor = light ? "text-cream" : "text-ink-deep";
  const hoverBg = light ? "group-hover:bg-cream" : "group-hover:bg-ink-deep";
  const hoverText = light ? "group-hover:text-ink-deep" : "group-hover:text-cream";
  const strokeColor = light ? "#f5f0e8" : "#0a1220";

  const inner = (
    <motion.div
      initial="initial"
      whileHover="hover"
      className={`relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-label-caps text-label-caps ${textColor} transition-colors duration-500 ${hoverBg} ${hoverText} group ${className}`}
    >
      {children}
      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 shrink-0" aria-hidden="true">
        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 250 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M1 99 H249 V1 H1 Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          opacity="0.35"
        />
        <motion.path
          d="M1 99 H249 V1 H1 Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          variants={{
            initial: { pathLength: 0 },
            hover: {
              pathLength: 1,
              transition: {
                duration: 0.8,
                delay: 0.3,
                ease: EASE,
              },
            },
          }}
        />
      </svg>
    </motion.div>
  );

  if (href) {
    return (
      <MotionConfig transition={{ ease: EASE, duration: 0.5 }}>
        <Link href={href} className="no-underline">
          {inner}
        </Link>
      </MotionConfig>
    );
  }

  return inner;
}
