import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui";
import styles from "./PageHeader.module.css";

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Trailing controls, e.g. a page's primary actions. */
  actions?: ReactNode;
}

/**
 * One line: the page's name, its description, the page's own actions and the
 * theme switch. The switch lives here rather than in a strip of its own above
 * the content — that strip cost a whole row of height to hold one 38px button.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <div className={styles.actions}>
        {actions}
        {/* Below the desktop breakpoint the mobile top bar carries the
            toggle instead — see DashboardShell. */}
        <ThemeToggle className={styles.toggle} />
      </div>
    </header>
  );
}
