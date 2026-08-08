"use client";

import { usePathname } from "next/navigation";
import { BrandMark, Icon, NavItem } from "@/components/ui";
import { CURRENT_USER, NAV_LINKS } from "../../constants";
import { useSidebarCollapse } from "../../hooks";
import { ProfileMenu } from "../ProfileMenu";
import styles from "./Sidebar.module.css";

export interface SidebarProps {
  /** Drawer visibility below the desktop breakpoint. */
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggle, isHydrated } = useSidebarCollapse();

  const classes = [
    styles.sidebar,
    isOpen ? styles.open : "",
    isCollapsed ? styles.collapsed : "",
    // Skip the width animation on the first paint so a restored collapsed
    // state does not slide in from expanded.
    isHydrated ? "" : styles.noTransition,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={classes} aria-label="Main navigation">
      <div className={styles.brand}>
        <BrandMark size={36} />

        <span className={styles.brandText}>
          <span className={styles.wordmark}>TimesheetOS</span>
          <span className={styles.tagline}>Enterprise</span>
        </span>

        <button
          type="button"
          className={styles.collapseButton}
          onClick={toggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon
            name={isCollapsed ? "chevron_right" : "chevron_left"}
            size={19}
            weight={500}
          />
        </button>

        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close navigation"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>Workspace</span>
        {NAV_LINKS.map((link) => (
          <NavItem
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            accent={link.accent}
            accentSoft={link.accentSoft}
            active={pathname === link.href || pathname.startsWith(`${link.href}/`)}
            collapsed={isCollapsed}
            onNavigate={onClose}
          />
        ))}
      </nav>

      <div className={styles.footer}>
        <ProfileMenu user={CURRENT_USER} collapsed={isCollapsed} onNavigate={onClose} />
      </div>
    </aside>
  );
}
