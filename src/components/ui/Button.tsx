import Link from "next/link";
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "light";
  icon?: "arrow_forward" | "arrow_downward" | "mail";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const base =
  "inline-flex items-center gap-2 rounded-full font-label-caps text-label-caps transition-colors duration-300";

const variants = {
  solid: "bg-cream text-ink-deep hover:bg-cream-dim px-6 py-3",
  outline:
    "bg-transparent text-cream border border-cream/40 hover:bg-cream hover:text-ink-deep px-6 py-3",
  light:
    "bg-white text-ink-deep hover:bg-stone-white px-8 py-4",
};

const iconPaths: Record<string, string> = {
  arrow_forward: "M3 8h9M8.5 4.5 12 8l-3.5 3.5",
  arrow_downward: "M8 3v10M3 8l5 5 5-5",
  mail: "M2 4h12v8H2zM2 4l6 4 6-4",
};

export function Button({
  children,
  href,
  variant = "solid",
  icon,
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  const content = (
    <>
      {children}
      {icon && (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={iconPaths[icon]} />
        </svg>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
