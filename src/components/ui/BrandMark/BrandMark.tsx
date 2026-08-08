import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export interface BrandMarkProps {
  /** Rendered box size in pixels. */
  size?: number;
  className?: string;
}

/**
 * The product mark: a clock ring with an hour hand, drawn rather than
 * borrowed from an icon font so the brand reads as its own thing.
 * The gradient lives on the wrapper, keeping the SVG free of ids that
 * would collide when the mark appears more than once on a page.
 */
export function BrandMark({ size = 36, className }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0 text-white",
        "w-[var(--mark-size,36px)] h-[var(--mark-size,36px)]",
        "rounded-[calc(var(--mark-size,36px)*0.28)]",
        "bg-[linear-gradient(140deg,#a78bfa_0%,#6366f1_52%,#4f46e5_100%)]",
        "shadow-[0_6px_16px_-6px_rgba(99,76,232,0.7),inset_0_1px_0_rgba(255,255,255,0.45)]",
        className,
      )}
      style={{ "--mark-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      <svg className="w-[62%] h-[62%]" viewBox="0 0 32 32" fill="none">
        <circle
          className="opacity-50"
          cx="16"
          cy="16"
          r="12"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 8.6v7.7l5 2.9"
          stroke="currentColor"
          strokeWidth="2.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
