"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Icon } from "../Icon";
import { TextInput } from "../TextInput";
import styles from "./PasswordInput.module.css";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  errorText?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, errorText, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <TextInput
        ref={ref}
        label={label}
        icon="key"
        errorText={errorText}
        type={visible ? "text" : "password"}
        trailingSlot={
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            <Icon name={visible ? "visibility_off" : "visibility"} size={20} />
          </button>
        }
        {...rest}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";
