import type { ReactNode } from "react";
import { Icon } from "../Icon";
import styles from "./Badge.module.css";

export type BadgeVariant = "neutral" | "accent" | "success" | "onDark";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  /** Material Symbols ligature name shown before the label. */
  icon?: string;
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  icon,
  className,
}: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className ?? ""}`}>
      {icon && <Icon name={icon} className={styles.icon} weight={500} />}
      {children}
    </span>
  );
}
