import { Avatar, Badge, Icon } from "@/components/ui";
import type { UserProfile } from "@/features/dashboard";
import styles from "./ProfileHero.module.css";

export interface ProfileHeroProps {
  user: UserProfile;
}

export function ProfileHero({ user }: ProfileHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.cover} aria-hidden="true" />

      <div className={styles.identity}>
        <span className={styles.avatarRing}>
          <Avatar name={user.name} src={user.avatarUrl} size={84} />
        </span>

        <div className={styles.meta}>
          <h2 className={styles.name}>{user.name}</h2>
          <span className={styles.email}>
            <Icon name="mail" className={styles.emailIcon} />
            {user.email}
          </span>

          <div className={styles.chips}>
            <Badge variant="accent" icon="badge">
              {user.designation}
            </Badge>
            <Badge variant="neutral" icon="shield_person">
              {user.role}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
