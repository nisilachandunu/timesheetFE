"use client";

import { useCallback, useState, type ReactNode } from "react";
import { BrandMark, Icon, ThemeToggle } from "@/components/ui";
import { Sidebar } from "../Sidebar";
import styles from "./DashboardShell.module.css";

export interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <div className={styles.shell}>
      <Sidebar isOpen={isDrawerOpen} onClose={closeDrawer} />

      {/* Scrim sits below the drawer but above content on small screens. */}
      {isDrawerOpen && (
        <div className={styles.overlay} onClick={closeDrawer} aria-hidden="true" />
      )}

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open navigation"
            aria-expanded={isDrawerOpen}
          >
            <Icon name="menu" size={22} />
          </button>
          <BrandMark size={28} />
          <span className={styles.topbarTitle}>TimesheetOS</span>
          <ThemeToggle className={styles.topbarToggle} />
        </header>

        {/* On desktop the theme toggle rides at the end of the page header's
            single row — see PageHeader. It had its own strip here, which cost
            a row of height to hold one button. */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
