import { Icon } from "../Icon";
import styles from "./Logo.module.css";

export interface LogoProps {
  eyebrow?: string;
  className?: string;
}

export function Logo({ eyebrow = "Enterprise Edition", className }: LogoProps) {
  return (
    <div className={`${styles.logo} ${className ?? ""}`}>
      <span className={styles.mark}>
        <Icon name="history" className={styles.icon} />
      </span>
      <div>
        <span className={styles.wordmark}>TimesheetOS</span>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      </div>
    </div>
  );
}
