import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "../Icon";
import styles from "./TextLink.module.css";

export interface TextLinkProps {
  href: string;
  children: ReactNode;
  /** Material Symbols name rendered beside the label. */
  icon?: string;
  iconPosition?: "leading" | "trailing";
  /** Inherit surrounding type size/weight instead of the label scale. */
  subtle?: boolean;
  className?: string;
}

export function TextLink({
  href,
  children,
  icon,
  iconPosition = "leading",
  subtle = false,
  className,
}: TextLinkProps) {
  const iconEl = icon ? (
    <Icon
      name={icon}
      className={`${styles.icon} ${
        iconPosition === "leading" ? styles.iconLeading : styles.iconTrailing
      }`}
    />
  ) : null;

  return (
    <Link
      href={href}
      className={`${styles.link} ${subtle ? styles.subtle : ""} ${className ?? ""}`}
    >
      {iconPosition === "leading" && iconEl}
      <span className={styles.label}>{children}</span>
      {iconPosition === "trailing" && iconEl}
    </Link>
  );
}
