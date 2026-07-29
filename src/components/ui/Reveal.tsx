"use client";

import { type ReactNode, type HTMLAttributes } from "react";

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Reveal({ children, ...rest }: RevealProps) {
  return (
    <div className="reveal" {...rest}>
      {children}
    </div>
  );
}
