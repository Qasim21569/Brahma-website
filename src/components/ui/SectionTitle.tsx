"use client";

import React from "react";

/**
 * SectionTitle — Elementis signature: hamburger icon + section label.
 *
 * The icon is a small 3-line "menu" symbol that precedes the label,
 * creating the brand's consistent section header pattern.
 */
export function SectionTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Hamburger icon */}
      <svg
        width="16"
        height="12"
        viewBox="0 0 16 12"
        fill="none"
        className="shrink-0"
        aria-hidden="true"
      >
        <line x1="0" y1="1" x2="16" y2="1" stroke="currentColor" strokeWidth="1.2" />
        <line x1="0" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.2" />
        <line x1="0" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span
        className="text-xs md:text-sm uppercase tracking-[0.15em] font-medium"
        style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
      >
        {children}
      </span>
    </div>
  );
}
