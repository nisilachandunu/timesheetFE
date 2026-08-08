import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "../Icon";
import { cn } from "@/lib/cn";

export interface TextLinkProps {
  href: string;
  children: ReactNode;
  /** Material Symbols name rendered beside the label. */
  icon?: string;
  iconPosition?: "leading" | "trailing";
  /** Inherit surrounding type size/weight instead of the label scale. */
  subtle?: boolean;
  className?: string;
}

export function TextLink({
  href,
  children,
  icon,
  iconPosition = "leading",
  subtle = false,
  className,
}: TextLinkProps) {
  const iconEl = icon ? (
    <Icon
      name={icon}
      className={cn(
        "[--icon-size:1.15em] transition-transform duration-base ease-out-expo",
        iconPosition === "leading"
          ? "group-hover:-translate-x-[3px]"
          : "group-hover:translate-x-[3px]",
      )}
    />
  ) : null;

  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-1",
        "text-accent-text transition-colors duration-base ease-[ease]",
        "hover:text-secondary",
        // Muted variant for supporting/legal copy: inherit the surrounding type.
        subtle
          ? "text-[length:inherit] font-[inherit]"
          : "text-label-sm font-semibold",
        className,
      )}
    >
      {iconPosition === "leading" && iconEl}
      {/* Underline sweeps in from the left on hover, out to the right on leave. */}
      <span
        className={cn(
          "relative",
          "after:content-[''] after:absolute after:left-0 after:-bottom-0.5",
          "after:w-full after:h-px after:bg-current",
          "after:scale-x-0 after:origin-bottom-right",
          "after:transition-transform after:duration-[0.25s] after:ease-out",
          "group-hover:after:scale-x-100 group-hover:after:origin-bottom-left",
        )}
      >
        {children}
      </span>
      {iconPosition === "trailing" && iconEl}
    </Link>
  );
}
