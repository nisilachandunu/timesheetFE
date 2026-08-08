import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "../Icon";
import styles from "./NavItem.module.css";

export interface NavItemProps {
  href: string;
  label: string;
  /** Material Symbols ligature name. */
  icon: string;
  active?: boolean;
  /** Icon-only rail: hides the label and reveals it as a hover tooltip. */
  collapsed?: boolean;
  /** Solid accent colour for the icon chip and active marker. */
  accent?: string;
  /** Translucent accent used as the resting chip fill. */
  accentSoft?: string;
  onNavigate?: () => void;
}

export function NavItem({
  href,
  label,
  icon,
  active = false,
  collapsed = false,
  accent,
  accentSoft,
  onNavigate,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      // The visible label is hidden when collapsed, so name the link explicitly.
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      data-tooltip={label}
      style={
        {
          ...(accent ? { "--nav-accent": accent } : {}),
          ...(accentSoft ? { "--nav-accent-soft": accentSoft } : {}),
        } as CSSProperties
      }
      className={`${styles.item} ${active ? styles.active : ""} ${
        collapsed ? styles.collapsed : ""
      }`}
    >
      <span className={styles.iconTile}>
        <Icon
          name={icon}
          className={styles.icon}
          filled={active}
          weight={active ? 500 : 400}
        />
      </span>
      <span className={styles.label}>{label}</span>
    </Link>
  );
}
