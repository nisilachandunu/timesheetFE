import type { ReactNode } from "react";
import styles from "./Divider.module.css";

export interface DividerProps {
  /** Optional label rendered between the two rules. */
  children?: ReactNode;
  className?: string;
}

export function Divider({ children, className }: DividerProps) {
  return (
    <div className={`${styles.divider} ${className ?? ""}`}>
      <span className={styles.line} />
      {children && <span className={styles.text}>{children}</span>}
      {children && <span className={styles.line} />}
    </div>
  );
}
