import type { Metadata } from "next";
import { CURRENT_USER, PageHeader } from "@/features/dashboard";
import { AccountCard, ChangePasswordCard, ProfileHero } from "@/features/settings";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Settings - TimesheetOS",
};

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Settings"
        description="Manage your account details and security."
      />
      <ProfileHero user={CURRENT_USER} />
      <AccountCard user={CURRENT_USER} />
      <ChangePasswordCard />
    </div>
  );
}
