"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Icon } from "../Icon";
import { TextInput } from "../TextInput";

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
            className={
              "flex items-center justify-center rounded-sm text-outline " +
              "transition-colors duration-fast ease-[ease] hover:text-on-background"
            }
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
