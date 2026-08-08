"use client";

import { useTheme } from "@/hooks";
import { Icon } from "../Icon";
import styles from "./ThemeToggle.module.css";

export interface ThemeToggleProps {
  className?: string;
}

/**
 * Light/dark switch. Both glyphs are rendered and cross-faded so the swap
 * animates; the bulb shows in light mode, the crescent moon in dark.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`${styles.toggle} ${className ?? ""}`}
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className={styles.glyphs}>
        <Icon
          name="lightbulb"
          size={20}
          filled
          className={`${styles.glyph} ${isDark ? "" : styles.glyphOn}`}
        />
        <Icon
          name="dark_mode"
          size={20}
          filled
          className={`${styles.glyph} ${isDark ? styles.glyphOn : ""}`}
        />
      </span>
    </button>
  );
}
