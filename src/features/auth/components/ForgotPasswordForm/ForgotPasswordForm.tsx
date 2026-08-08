"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, Icon, TextInput, TextLink } from "@/components/ui";
import { useForgotPasswordForm } from "../../hooks";
import type { ForgotPasswordRequest } from "../../types";
import styles from "./ForgotPasswordForm.module.css";

export interface ForgotPasswordFormProps {
  /** Overrides the default behaviour of routing to the OTP screen. */
  onSubmit?: (request: ForgotPasswordRequest) => void | Promise<void>;
}

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const router = useRouter();
  // Keeps the button in its loading state for the whole navigation;
  // router.push() on its own resolves immediately.
  const [isNavigating, startNavigation] = useTransition();

  const { email, setEmail, error, handleBlur, handleSubmit, isSubmitting } =
    useForgotPasswordForm(async (request) => {
      if (onSubmit) {
        await onSubmit(request);
        return;
      }
      startNavigation(() =>
        router.push(`/verify-otp?email=${encodeURIComponent(request.email)}`),
      );
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
          Password Recovery
        </p>
        <h2 className={styles.title}>Forgot password?</h2>
        <p className={styles.subtitle}>
          No worries, enter your account email to receive an OTP.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.stagger} ${styles.s2}`}>
          <TextInput
            id="recovery-email"
            name="email"
            label="Email address"
            type="email"
            icon="mail"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            errorText={error}
            disabled={isBusy}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={handleBlur}
          />
        </div>

        <div className={`${styles.stagger} ${styles.s3}`}>
          <Button type="submit" loading={isBusy}>
            {isBusy ? "Sending OTP…" : "Send OTP"}
            {!isBusy && <Icon name="arrow_forward" size={18} />}
          </Button>
        </div>
      </form>

      <p className={`${styles.stagger} ${styles.s4} ${styles.hint}`}>
        <Icon name="schedule" size={14} />
        The OTP is valid for 5 minutes
      </p>
    </div>
  );
}
