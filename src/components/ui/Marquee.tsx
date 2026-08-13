"use client";
import {
  motion,
  MotionStyle,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { PropsWithChildren, useRef } from "react";

type MarqueeProps = PropsWithChildren & {
  className?: string;
  style?: MotionStyle;
  max: string;
  speed: number;
};

export default function Marquee({
  children,
  max,
  speed,
  className,
  style,
}: MarqueeProps) {
  const value = parseFloat(max);
  const unit = max.slice(value.toString().length);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const velocityFactor = useTransform(
    useSpring(scrollVelocity, { mass: 1, damping: 50, stiffness: 600 }),
    [0, 1000],
    [0, 4],
    { clamp: false },
  );
  const x = useTransform(baseX, (v) => `${wrap(0, value, v)}${unit}`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * speed * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden">
      <motion.div
        className={`font-display-hero text-display-hero leading-none tracking-tight whitespace-nowrap ${className}`}
        style={{ x, ...style }}
      >
        {children}
      </motion.div>
    </div>
  );
}
