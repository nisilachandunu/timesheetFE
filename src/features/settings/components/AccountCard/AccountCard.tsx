import { Badge, Card, DetailField, Icon, TextLink } from "@/components/ui";
import type { UserProfile } from "@/features/dashboard";
import styles from "./AccountCard.module.css";

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
      <div className={styles.grid}>
        <DetailField label="Full name" value={user.name} icon="person" copyable />
        <DetailField label="Email" value={user.email} icon="alternate_email" copyable />
        <DetailField label="Designation" value={user.designation} icon="badge" />
        <DetailField label="User role" value={user.role} icon="shield_person" />
      </div>

      <p className={styles.note}>
        <Icon name="info" className={styles.noteIcon} weight={500} />
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
