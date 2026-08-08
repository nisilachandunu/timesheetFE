import type { ReactNode } from "react";
import { Icon } from "../Icon";
import { cn } from "@/lib/cn";

export type BadgeVariant = "neutral" | "accent" | "success" | "onDark";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  /** Material Symbols ligature name shown before the label. */
  icon?: string;
  className?: string;
}

/**
 * Written out per variant rather than composed at runtime: Tailwind only sees
 * class names that appear literally in the source, so `styles[variant]`-style
 * lookups would leave the utilities ungenerated.
 */
const VARIANTS: Record<BadgeVariant, string> = {
  neutral:
    "bg-hairline-faint text-on-surface-variant border border-solid border-hairline",
  accent:
    "bg-accent-tint text-accent-text border border-solid border-accent-tint-border",
  success:
    "bg-success-tint text-success-text border border-solid border-success-tint-border",
  // Reads on a dark/gradient surface.
  onDark:
    "bg-[rgba(255,255,255,0.14)] text-white border border-solid border-[rgba(255,255,255,0.2)] backdrop-blur-[8px]",
};

export function Badge({
  children,
  variant = "neutral",
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 py-[5px] px-[11px] rounded-full",
        "text-[0.75rem] font-semibold tracking-[0.01em] leading-[1.3] whitespace-nowrap",
        VARIANTS[variant],
        className,
      )}
    >
      {icon && (
        <Icon name={icon} className="[--icon-size:14px]" weight={500} />
      )}
      {children}
    </span>
  );
}
