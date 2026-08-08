import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui";
import { BrandingPanel } from "../BrandingPanel";
import styles from "./AuthLayout.module.css";

export interface AuthLayoutProps {
  children: ReactNode;
}

/** Split-screen shell shared by every authentication screen. */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className={styles.layout}>
      <BrandingPanel />
      <section className={`${styles.formSlot} hide-scrollbar`}>
        <ThemeToggle className={styles.themeToggle} />
        {children}
      </section>
    </main>
  );
}
