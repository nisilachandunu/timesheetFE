import { Badge, Card, DetailField, Icon, TextLink } from "@/components/ui";
import type { UserProfile } from "@/features/dashboard";
import { cn } from "@/lib/cn";

export interface AccountCardProps {
  user: UserProfile;
}

export function AccountCard({ user }: AccountCardProps) {
  return (
    <Card
      icon="account_circle"
      title="Account"
      description="Details synced from your organisation directory."
      headerAside={
        <Badge variant="neutral" icon="lock">
          Read-only
        </Badge>
      }
    >
      <div
        className={cn(
          "grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3",
          "max-[720px]:grid-cols-[minmax(0,1fr)]",
        )}
      >
        <DetailField label="Full name" value={user.name} icon="person" copyable />
        <DetailField label="Email" value={user.email} icon="alternate_email" copyable />
        <DetailField label="Designation" value={user.designation} icon="badge" />
        <DetailField label="User role" value={user.role} icon="shield_person" />
      </div>

      <p
        className={cn(
          "flex items-center gap-2 mt-3.5 py-[11px] px-[13px] rounded-[11px]",
          "bg-accent-tint-faint",
          "text-[0.8125rem] text-on-surface-variant",
        )}
      >
        <Icon
          name="info"
          className="[--icon-size:17px] shrink-0 text-accent-text"
          weight={500}
        />
        <span>
          These details come from your organisation directory.{" "}
          <TextLink href="#" subtle>
            Contact IT Support
          </TextLink>{" "}
          to request a change.
        </span>
      </p>
    </Card>
  );
}
