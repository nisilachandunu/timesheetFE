"use client";

import { Icon } from "@/components/ui";
import { PASSWORD_RULES, type PasswordStrength } from "../../passwordPolicy";
import styles from "./PasswordPolicyPanel.module.css";

export interface PasswordPolicyPanelProps {
  /** The candidate password, checked live against each rule. */
  value: string;
  strength: PasswordStrength;
}

export function PasswordPolicyPanel({ value, strength }: PasswordPolicyPanelProps) {
  return (
    <aside className={`${styles.panel} ${styles[strength.level] ?? ""}`}>
      <h3 className={styles.heading}>
        <Icon name="verified_user" className={styles.headingIcon} weight={500} />
        Password requirements
      </h3>

      <ul className={styles.rules}>
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(value);
          return (
            <li
              key={rule.id}
              className={`${styles.rule} ${passed ? styles.rulePassed : ""}`}
            >
              <span className={styles.ruleDot}>
                <Icon name="check" className={styles.ruleIcon} weight={700} />
              </span>
              {rule.label}
              <span className="sr-only">{passed ? " — met" : " — not met"}</span>
            </li>
          );
        })}
      </ul>

      <div className={styles.meter}>
        <div className={styles.meterHead}>
          <span className={styles.meterLabel}>Password strength</span>
          <span className={styles.meterValue} aria-live="polite">
            {strength.label}
          </span>
        </div>

        <div
          className={styles.segments}
          role="meter"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={strength.score}
          aria-label="Password strength"
        >
          {[1, 2, 3, 4].map((step) => (
            <span
              key={step}
              className={`${styles.segment} ${
                step <= strength.score ? styles.segmentOn : ""
              }`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
