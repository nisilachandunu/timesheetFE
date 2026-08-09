"use client";

import { Button, Card, Icon, PasswordInput } from "@/components/ui";
import { useChangePasswordForm, type ChangePasswordValues } from "../../hooks";
import { PasswordPolicyPanel } from "../PasswordPolicyPanel";
import { cn } from "@/lib/cn";

/** Inline feedback under the confirm field. */
const HINT = "flex items-center gap-1.5 mt-1.5 text-xs font-semibold";

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
          <p
            className={cn(
              "flex items-center gap-[9px] mb-[18px] py-3 px-3.5 rounded-xl",
              "bg-success-tint",
              "text-sm font-semibold text-success-text",
            )}
            role="status"
          >
            <Icon name="check_circle" className="[--icon-size:18px]" filled />
            Your password has been updated.
          </p>
        )}

        <div
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_minmax(240px,300px)] items-start",
            "gap-[clamp(18px,2.6vw,32px)]",
            "max-[860px]:grid-cols-[minmax(0,1fr)]",
          )}
        >
          <div className="flex flex-col gap-4">
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
                <p className={cn(HINT, "text-error")}>
                  <Icon name="error" className="[--icon-size:15px]" filled />
                  Passwords don&apos;t match yet
                </p>
              )}
              {confirmMatches && (
                <p className={cn(HINT, "text-success-text")}>
                  <Icon name="check_circle" className="[--icon-size:15px]" filled />
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
