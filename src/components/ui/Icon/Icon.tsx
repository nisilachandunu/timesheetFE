import type { CSSProperties } from "react";
import styles from "./Icon.module.css";

export interface IconProps {
  /** Material Symbols ligature name, e.g. "lock", "mail". */
  name: string;
  /**
   * Glyph size in pixels. Omit to let CSS decide — useful when the icon
   * should scale fluidly with the viewport via a consuming module.
   */
  size?: number;
  /** Use the filled variant of the glyph. */
  filled?: boolean;
  /** Optical stroke weight, 100–700. Defaults to 400. */
  weight?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({
  name,
  size,
  filled = false,
  weight,
  className,
  style,
}: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols ${styles.icon} ${className ?? ""}`}
      style={
        {
          ...(size ? { "--icon-size": `${size}px` } : {}),
          ...(weight ? { "--icon-weight": weight } : {}),
          "--icon-fill": filled ? 1 : 0,
          ...style,
        } as CSSProperties
      }
    >
      {name}
    </span>
  );
}
