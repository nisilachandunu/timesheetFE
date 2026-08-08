"use client";

import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import styles from "./OtpInput.module.css";

export interface OtpInputProps {
  /** Current code. May be shorter than `length` while being typed. */
  value: string;
  onChange: (value: string) => void;
  /** Number of slots to render. */
  length?: number;
  /** Fired once the final slot is filled. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  /** Accessible name for the group. */
  label?: string;
}

const DIGITS_ONLY = /\D/g;

export function OtpInput({
  value,
  onChange,
  length = 5,
  onComplete,
  disabled = false,
  invalid = false,
  autoFocus = false,
  label = "One-time password",
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focusSlot = (index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    inputsRef.current[clamped]?.focus();
    inputsRef.current[clamped]?.select();
  };

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const typed = event.target.value.replace(DIGITS_ONLY, "");
      if (!typed) return;

      // Take the last character so overwriting a filled slot works.
      const digit = typed[typed.length - 1];
      const chars = value.padEnd(length, " ").split("");
      chars[index] = digit;

      const next = chars.join("").trimEnd();
      commit(next);

      if (index < length - 1) focusSlot(index + 1);
    };

  const handleKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        const chars = value.padEnd(length, " ").split("");

        if (chars[index] && chars[index] !== " ") {
          chars[index] = " ";
          commit(chars.join("").trimEnd());
        } else if (index > 0) {
          chars[index - 1] = " ";
          commit(chars.join("").trimEnd());
          focusSlot(index - 1);
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusSlot(index - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        focusSlot(index + 1);
      }
    };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(DIGITS_ONLY, "")
      .slice(0, length);
    if (!pasted) return;

    commit(pasted);
    focusSlot(pasted.length);
  };

  return (
    <div className={styles.group} role="group" aria-label={label}>
      {Array.from({ length }, (_, index) => {
        const char = value[index] ?? "";
        return (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            className={`${styles.slot} ${char.trim() ? styles.filled : ""} ${
              invalid ? styles.error : ""
            }`}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={invalid || undefined}
            autoFocus={autoFocus && index === 0}
            value={char.trim()}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
          />
        );
      })}
    </div>
  );
}
