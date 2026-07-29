import { type ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  className?: string;
  withDot?: boolean;
  withLine?: boolean;
}

export function Label({
  children,
  className = "",
  withDot = false,
  withLine = false,
}: LabelProps) {
  // Base classes that can be overridden by className
  const baseClasses = "font-label-caps text-label-caps uppercase";

  // If className contains a text- color, don't apply the default muted-azure
  const hasColorOverride = /text-(primary|on-primary|white|on-surface|ink-navy)/.test(className);
  const defaultColor = hasColorOverride ? "" : "text-muted-azure";

  // If className contains block, don't apply flex
  const isBlock = /block/.test(className);
  const displayClass = isBlock ? "" : "flex items-center gap-2";

  return (
    <span className={`${baseClasses} ${defaultColor} ${displayClass} ${className}`}>
      {withDot && <span className="w-2 h-2 bg-muted-azure inline-block shrink-0" />}
      {withLine && <span className="w-8 h-px bg-muted-azure block shrink-0" />}
      {children}
    </span>
  );
}
