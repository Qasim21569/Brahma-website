import Link from "next/link";
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "light";
  icon?: string;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const base =
  "inline-flex items-center gap-2 rounded-full font-label-caps text-label-caps transition-colors duration-300";

const variants = {
  solid: "bg-primary text-on-primary hover:bg-ink-navy px-6 py-3",
  outline:
    "bg-transparent text-primary border border-primary hover:bg-primary hover:text-on-primary px-6 py-3",
  light:
    "bg-white text-ink-navy hover:bg-stone-white px-8 py-4",
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
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
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
