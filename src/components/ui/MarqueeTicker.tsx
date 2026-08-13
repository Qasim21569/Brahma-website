"use client";

/**
 * Infinite-scroll marquee ticker — Elementis-inspired.
 *
 * Two copies of the text scroll infinitely via CSS animation.
 * The animation moves from translateX(0) to translateX(-50%),
 * so the second copy takes over exactly when the first scrolls out.
 *
 * The only place 144px display type is permitted (§4.2).
 */
export function MarqueeTicker({
  text,
  className = "",
  speed = 30,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const doubled = `${text}  •  ${text}`;

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="marquee-content inline-block whitespace-nowrap"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
          fontSize: "calc(144 * var(--multiplier))",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          fontFamily: "var(--font-newsreader), Georgia, serif",
          fontWeight: 300,
          color: "inherit",
        }}
      >
        {doubled}
      </div>
    </div>
  );
}
