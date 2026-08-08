import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui";
import { BrandingPanel } from "../BrandingPanel";
import { cn } from "@/lib/cn";
import styles from "./AuthLayout.module.css";

export interface AuthLayoutProps {
  children: ReactNode;
}

/** Split-screen shell shared by every authentication screen. */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // styles.layout carries only the 100vh/100dvh height pair — see the module.
    <main
      className={cn(
        styles.layout,
        "flex w-full overflow-hidden bg-surface-lowest",
      )}
    >
      <BrandingPanel />
      <section
        className={
          "hide-scrollbar relative flex flex-1 min-w-0 items-center justify-center " +
          "bg-surface-lowest overflow-hidden " +
          "py-[clamp(16px,3vh,48px)] px-[clamp(20px,2.5vw,48px)] " +
          // Single column: the branding panel hides itself and the form fills
          // the viewport. Scrolling is allowed because a small phone genuinely
          // cannot fit the form; .hide-scrollbar keeps the chrome invisible.
          "max-lg:py-8 max-lg:px-6 max-lg:overflow-y-auto " +
          // Extra head room keeps the form clear of the pinned toggle.
          "max-[480px]:pt-12 max-[480px]:pb-6 max-[480px]:px-margin-mobile " +
          "max-[480px]:items-start"
        }
      >
        {/* Pinned to the form pane's top-right, clear of the centred column.
            Fixed below the desktop breakpoint so it stays put while the pane
            scrolls rather than sliding off the top. */}
        <ThemeToggle
          className={
            "absolute z-[5] top-[clamp(16px,3vh,32px)] right-[clamp(16px,2.5vw,32px)] " +
            "max-lg:fixed max-lg:top-4 max-lg:right-4"
          }
        />
        {children}
      </section>
    </main>
  );
}
