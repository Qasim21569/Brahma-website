const iconPaths: Record<string, string> = {
  arrow_forward: "M3 8h9M8.5 4.5 12 8l-3.5 3.5",
  arrow_downward: "M8 3v10M3 8l5 5 5-5",
  mail: "M2 4h12v8H2zM2 4l6 4 6-4",
  monitoring:
    "M4 14h2v6H4zM10 10h2v10h-2zM16 6h2v14h-2z",
  architecture:
    "M2 20V6h14v3H4v7h10v3H2zM4 9h2v5H4zM9 9h2v5H9zM14 9h2v5h-2z",
  arrow_outward: "M3 8h9M8.5 4.5 12 8l-3.5 3.5",
};

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`icon-svg ${className}`}
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={iconPaths[name] || ""} />
    </svg>
  );
}
