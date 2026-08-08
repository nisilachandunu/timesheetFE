"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, Icon, PasswordInput, TextLink } from "@/components/ui";
import { MIN_PASSWORD_LENGTH } from "../../constants";
import { useResetPasswordForm } from "../../hooks";
import type { ResetPasswordRequest } from "../../types";
import styles from "./ResetPasswordForm.module.css";

export interface ResetPasswordFormProps {
  /** Address the OTP was verified against, shown back to the user. */
  email?: string;
  /** Overrides the default behaviour of routing to the dashboard. */
  onSubmit?: (request: ResetPasswordRequest) => void | Promise<void>;
}

export function ResetPasswordForm({ email, onSubmit }: ResetPasswordFormProps) {
  const router = useRouter();
  // router.push() resolves immediately, so a plain submitting flag would
  // flash. useTransition stays pending for the whole navigation.
  const [isNavigating, startNavigation] = useTransition();

  const { credentials, errors, handleChange, handleBlur, handleSubmit, isSubmitting } =
    useResetPasswordForm(async (password) => {
      if (onSubmit) {
        await onSubmit({ email, password });
        return;
      }
      startNavigation(() => router.push("/dashboard"));
    });

  const isBusy = isSubmitting || isNavigating;

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.stagger} ${styles.s1} ${styles.backRow}`}>
        <TextLink href="/sign-in" icon="arrow_back">
          Back to sign in
        </TextLink>
      </div>

      <div className={`${styles.stagger} ${styles.s1}`}>
        <p className={styles.eyebrow}>
          <Icon name="lock_reset" size={16} />
          Identity Verified
        </p>
        <h2 className={styles.title}>Set a new password</h2>
        <p className={styles.subtitle}>
          {email ? (
            <>
              Choose a new password for{" "}
              <span className={styles.email}>{email}</span>.
            </>
          ) : (
            "Choose a new password for your account."
          )}
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.stagger} ${styles.s2}`}>
          <PasswordInput
            id="new-password"
            name="password"
            label="New password"
            autoComplete="new-password"
            placeholder="Enter your new password"
            value={credentials.password}
            errorText={errors.password}
            disabled={isBusy}
            onChange={(event) => handleChange("password", event.target.value)}
            onBlur={() => handleBlur("password")}
          />
        </div>

        <div className={`${styles.stagger} ${styles.s3}`}>
          <PasswordInput
            id="confirm-password"
            name="confirmPassword"
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            value={credentials.confirmPassword}
            errorText={errors.confirmPassword}
            disabled={isBusy}
            onChange={(event) =>
              handleChange("confirmPassword", event.target.value)
            }
            onBlur={() => handleBlur("confirmPassword")}
          />
        </div>

        <p className={`${styles.stagger} ${styles.s3} ${styles.requirement}`}>
          <Icon name="info" size={14} />
          Use at least {MIN_PASSWORD_LENGTH} characters
        </p>

        <div className={`${styles.stagger} ${styles.s4}`}>
          <Button type="submit" loading={isBusy}>
            {isBusy ? "Updating password…" : "Reset password"}
            {!isBusy && <Icon name="arrow_forward" size={18} />}
          </Button>
        </div>
      </form>

      <p className={`${styles.stagger} ${styles.s4} ${styles.hint}`}>
        <Icon name="shield_locked" size={14} />
        You&apos;ll be signed in once your password is updated
      </p>
    </div>
  );
}
