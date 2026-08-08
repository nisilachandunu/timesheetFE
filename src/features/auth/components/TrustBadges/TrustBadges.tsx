import type { TrustBadge } from "../../types";
import styles from "./TrustBadges.module.css";

const BADGES: TrustBadge[] = [
  { label: "99.9% Uptime", highlighted: true },
  { label: "SOC 2 Certified" },
  { label: "GDPR Ready" },
];

export function TrustBadges() {
  return (
    <ul className={styles.row}>
      {BADGES.map((badge) => (
        <li key={badge.label} className={styles.badge}>
          <span
            className={`${styles.dot} ${badge.highlighted ? styles.dotHighlighted : ""}`}
          />
          {badge.label}
        </li>
      ))}
    </ul>
  );
}
