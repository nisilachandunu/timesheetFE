import type { CSSProperties } from "react";
import styles from "./Spinner.module.css";

export interface SpinnerProps {
  /** Any CSS length. Defaults to 1em so it tracks the surrounding text. */
  size?: string;
  className?: string;
  /** Accessible label; omit when a sibling already announces the state. */
  label?: string;
}

export function Spinner({ size, className, label }: SpinnerProps) {
  return (
    <span
      className={`${styles.spinner} ${className ?? ""}`}
      style={size ? ({ "--spinner-size": size } as CSSProperties) : undefined}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
