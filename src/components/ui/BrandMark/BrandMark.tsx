import type { CSSProperties } from "react";
import styles from "./BrandMark.module.css";

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
      className={`${styles.mark} ${className ?? ""}`}
      style={{ "--mark-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      <svg className={styles.glyph} viewBox="0 0 32 32" fill="none">
        <circle
          className={styles.ring}
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
