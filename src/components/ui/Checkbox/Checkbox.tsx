import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...rest }, ref) => {
    return (
      <label className={styles.wrapper}>
        <input
          ref={ref}
          type="checkbox"
          className={`${styles.input} ${className ?? ""}`}
          {...rest}
        />
        <span className={styles.label}>{label}</span>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
