import type { Metadata } from "next";
import { CURRENT_USER, PageHeader } from "@/features/dashboard";
import { AccountCard, ChangePasswordCard, ProfileHero } from "@/features/settings";

export const metadata: Metadata = {
  title: "Settings - TimesheetOS",
};

export default function SettingsPage() {
  return (
    // max-width caps line length so form labels and values stay scannable.
    <div className="flex flex-col gap-[clamp(16px,2.2vh,24px)] max-w-[1080px]">
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
