"use client";

import { PropsWithChildren } from "react";
import { MotionStyle } from "motion/react";
import { useIsMobile } from "@/hooks/useIsMobile";
import Marquee from "./Marquee";

type ResponsiveMarqueeProps = PropsWithChildren & {
  animationConfig: {
    mobile: { max: string; speed: number };
    desktop: { max: string; speed: number };
  };
  className?: string;
  style?: MotionStyle;
};

export default function ResponsiveMarquee({
  children,
  animationConfig,
  ...rest
}: ResponsiveMarqueeProps) {
  const isMobile = useIsMobile();
  if (typeof isMobile !== "boolean") {
    return null;
  }

  return (
    <Marquee
      {...animationConfig[isMobile ? "mobile" : "desktop"]}
      {...rest}
    >
      {children}
    </Marquee>
  );
}
