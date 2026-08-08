"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import styles from "./DetailField.module.css";

export interface DetailFieldProps {
  label: string;
  value: string;
  /** Material Symbols ligature name shown at the leading edge. */
  icon?: string;
  /** Offers a copy-to-clipboard control on hover. */
  copyable?: boolean;
}

/**
 * Presents a value the user cannot edit here. Rendering these as disabled
 * text inputs would imply editability and fail contrast, so they are shown
 * as labelled readouts instead.
 */
export function DetailField({ label, value, icon, copyable = false }: DetailFieldProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context or denied permission) — the
      // value stays selectable, so this is a soft failure.
    }
  };

  return (
    <div className={styles.field}>
      {icon && <Icon name={icon} className={styles.icon} />}

      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value} title={value}>
          {value}
        </span>
      </span>

      {copyable && (
        <button
          type="button"
          className={`${styles.copy} ${copied ? styles.copied : ""}`}
          onClick={handleCopy}
          aria-label={copied ? `${label} copied` : `Copy ${label}`}
        >
          <Icon name={copied ? "check" : "content_copy"} size={17} />
        </button>
      )}
    </div>
  );
}
