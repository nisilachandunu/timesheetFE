"use client";

import { Button, Card, Icon, PasswordInput } from "@/components/ui";
import { useChangePasswordForm, type ChangePasswordValues } from "../../hooks";
import { PasswordPolicyPanel } from "../PasswordPolicyPanel";
import styles from "./ChangePasswordCard.module.css";

export interface ChangePasswordCardProps {
  onSubmit?: (values: ChangePasswordValues) => void | Promise<void>;
}

export function ChangePasswordCard({ onSubmit }: ChangePasswordCardProps) {
  const {
    values,
    setField,
    reset,
    handleSubmit,
    isSubmitting,
    status,
    strength,
    confirmMatches,
    confirmMismatch,
    reusesCurrent,
    canSubmit,
  } = useChangePasswordForm(onSubmit);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card
        icon="key"
        title="Change password"
        description="Use a strong, unique password you don't reuse elsewhere."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              fullWidth={false}
              onClick={reset}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth={false}
              loading={isSubmitting}
              disabled={!canSubmit}
            >
              {isSubmitting ? "Updating…" : "Update password"}
            </Button>
          </>
        }
      >
        {status === "saved" && (
          <p className={styles.saved} role="status">
            <Icon name="check_circle" className={styles.savedIcon} filled />
            Your password has been updated.
          </p>
        )}

        <div className={styles.layout}>
          <div className={styles.fields}>
            <PasswordInput
              id="current-password"
              name="currentPassword"
              label="Current password"
              autoComplete="current-password"
              placeholder="Enter your current password"
              value={values.current}
              disabled={isSubmitting}
              onChange={(e) => setField("current", e.target.value)}
            />

            <div>
              <PasswordInput
                id="new-password"
                name="newPassword"
                label="New password"
                autoComplete="new-password"
                placeholder="Create a new password"
                value={values.next}
                disabled={isSubmitting}
                errorText={
                  reusesCurrent
                    ? "Choose a password different from your current one"
                    : undefined
                }
                onChange={(e) => setField("next", e.target.value)}
              />
            </div>

            <div>
              <PasswordInput
                id="confirm-password"
                name="confirmPassword"
                label="Confirm new password"
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                value={values.confirm}
                disabled={isSubmitting}
                onChange={(e) => setField("confirm", e.target.value)}
              />

              {confirmMismatch && (
                <p className={`${styles.hint} ${styles.hintBad}`}>
                  <Icon name="error" className={styles.hintIcon} filled />
                  Passwords don&apos;t match yet
                </p>
              )}
              {confirmMatches && (
                <p className={`${styles.hint} ${styles.hintOk}`}>
                  <Icon name="check_circle" className={styles.hintIcon} filled />
                  Passwords match
                </p>
              )}
            </div>
          </div>

          <PasswordPolicyPanel value={values.next} strength={strength} />
        </div>
      </Card>
    </form>
  );
}
