"use client";

import { MotionValue, useTransform } from "motion/react";

/**
 * useMaskImage — Elementis pattern port.
 *
 * Generates a `linear-gradient(to top, ...)` mask that progressively reveals
 * horizontal stripes as `localProgress` goes 0 → 1. On desktop 28 thin
 * divisions create the architectural strip-reveal; on mobile it degrades to
 * a simple top-to-bottom sweep.
 */
export default function useMaskImage(
  localProgress: MotionValue<number>,
  isMobile: boolean,
  _config?: {
    divisions?: number;
    inset?: number;
    gap?: number;
    vh?: number;
  },
) {
  const divisions = 28;
  const gap = 0.35;
  const vh = 110;

  const func = (i: number, latest: number) => {
    const buffer = (1 - gap) / (divisions - 1);
    if (i * buffer > latest) return 0;
    if (gap + i * buffer < latest) return 1;
    return (latest - i * buffer) / gap;
  };

  const maskImage = useTransform(localProgress, (latest) => {
    if (!isMobile) {
      let temp = "";
      for (let i = 0; i < divisions; i++) {
        temp += `rgba(0,0,0,0) ${i * (vh / divisions)}vh ,rgba(0,0,0,0) ${func(i, latest) * (vh / divisions) + i * (vh / divisions)}vh,rgba(0,0,0,1) ${func(i, latest) * (vh / divisions) + i * (vh / divisions)}vh,rgba(0,0,0,1) ${(i + 1) * (vh / divisions)}vh`;
        if (i !== divisions - 1) temp += ",";
      }
      return `linear-gradient(to top,${temp})`;
    }
    return `linear-gradient(to top,rgba(0,0,0,0) 0%,rgba(0,0,0,0) ${latest * 100}% ,rgba(0,0,0,1) ${latest * 100}%,rgba(1,1,1,1) 100%)`;
  });

  return maskImage;
}
