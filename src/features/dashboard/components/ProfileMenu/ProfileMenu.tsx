"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Avatar, Icon } from "@/components/ui";
import { useDismissable } from "@/hooks";
import { SETTINGS_LINK } from "../../constants";
import type { UserProfile } from "../../types";
import styles from "./ProfileMenu.module.css";

export interface ProfileMenuProps {
  user: UserProfile;
  /** Icon-only rail: shows just the avatar. */
  collapsed?: boolean;
  /** Called after navigating, so a mobile drawer can close itself. */
  onNavigate?: () => void;
}

export function ProfileMenu({ user, collapsed = false, onNavigate }: ProfileMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  useDismissable(rootRef, isOpen, close);

  const handleNavigate = () => {
    close();
    onNavigate?.();
  };

  const handleSignOut = () => {
    close();
    onNavigate?.();
    router.push("/sign-in");
  };

  return (
    <div className={styles.root} ref={rootRef}>
      {isOpen && (
        <div
          className={`${styles.menu} ${collapsed ? styles.collapsedMenu : ""}`}
          role="menu"
          aria-label="Account"
        >
          <div className={styles.menuHeader}>
            <span className={styles.menuName}>{user.name}</span>
            <span className={styles.menuEmail} title={user.email}>
              {user.email}
            </span>
          </div>

          <Link
            href={SETTINGS_LINK.href}
            role="menuitem"
            className={styles.menuItem}
            onClick={handleNavigate}
          >
            <Icon name={SETTINGS_LINK.icon} className={styles.menuIcon} />
            {SETTINGS_LINK.label}
          </Link>

          <button
            type="button"
            role="menuitem"
            className={`${styles.menuItem} ${styles.signOut}`}
            onClick={handleSignOut}
          >
            <Icon name="logout" className={styles.menuIcon} />
            Sign out
          </button>
        </div>
      )}

      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""} ${
          collapsed ? styles.collapsedTrigger : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={collapsed ? `Account: ${user.name}` : undefined}
        title={collapsed ? user.name : undefined}
      >
        <Avatar
          name={user.name}
          src={user.avatarUrl}
          size={36}
          className={styles.avatar}
        />
        <span className={styles.identity}>
          <span className={styles.name}>{user.name}</span>
          <span className={styles.role}>{user.designation}</span>
        </span>
        <Icon
          name="keyboard_arrow_up"
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </button>
    </div>
  );
}
