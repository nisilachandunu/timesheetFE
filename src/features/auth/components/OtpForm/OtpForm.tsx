"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, Icon, OtpInput, TextLink } from "@/components/ui";
import { OTP_LENGTH, OTP_RESEND_UNLOCK_SECONDS } from "../../constants";
import { useOtpVerification } from "../../hooks";
import styles from "./OtpForm.module.css";

export interface OtpFormProps {
  /** Address the code was sent to, shown back to the user. */
  email?: string;
  /** Overrides the default behaviour of routing to the reset screen. */
  onVerify?: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
}

function formatUnlock(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function OtpForm({ email, onVerify, onResend }: OtpFormProps) {
  const router = useRouter();
  // router.push() resolves immediately, so a plain submitting flag would
  // flash. useTransition stays pending for the whole navigation.
  const [isNavigating, startNavigation] = useTransition();

  const {
    code,
    setCode,
    error,
    isSubmitting,
    formatted,
    isExpired,
    canResend,
    handleSubmit,
    handleResend,
  } = useOtpVerification({
    onVerify: async (verifiedCode) => {
      if (onVerify) {
        await onVerify(verifiedCode);
        return;
      }
      const query = email ? `?email=${encodeURIComponent(email)}` : "";
      startNavigation(() => router.push(`/reset-password${query}`));
    },
    onResend,
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
          <Icon name="mark_email_read" size={16} />
          Verify Your Identity
        </p>
        <h2 className={styles.title}>Enter the OTP</h2>
        <p className={styles.subtitle}>
          We sent a {OTP_LENGTH}-digit code to{" "}
          <span className={styles.email}>{email || "your email address"}</span>.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.stagger} ${styles.s2}`}>
          <OtpInput
            value={code}
            onChange={setCode}
            length={OTP_LENGTH}
            disabled={isExpired || isBusy}
            invalid={isExpired || Boolean(error)}
            autoFocus
          />
          {error && (
            <p className={styles.errorText} role="alert">
              <Icon name="error" size={14} />
              {error}
            </p>
          )}
        </div>

        <p
          className={`${styles.stagger} ${styles.s3} ${styles.timer} ${
            isExpired ? styles.timerExpired : ""
          }`}
        >
          <Icon name={isExpired ? "timer_off" : "schedule"} size={14} />
          {isExpired ? (
            "Code expired — request a new one"
          ) : (
            <>
              Code expires in{" "}
              <span className={styles.timerValue} aria-live="polite">
                {formatted}
              </span>
            </>
          )}
        </p>

        <div className={`${styles.stagger} ${styles.s3}`}>
          {/* Stays enabled while incomplete so submitting surfaces the
              validation message rather than silently doing nothing. */}
          <Button type="submit" loading={isBusy} disabled={isExpired}>
            {isBusy ? "Verifying…" : "Verify OTP"}
            {!isBusy && <Icon name="arrow_forward" size={18} />}
          </Button>
        </div>
      </form>

      <div className={`${styles.stagger} ${styles.s4} ${styles.resendRow}`}>
        <span>Didn&apos;t receive the code?</span>
        <button
          type="button"
          className={styles.resendButton}
          onClick={handleResend}
          disabled={!canResend}
        >
          <Icon name="refresh" size={15} />
          Resend code
        </button>

        {!canResend && (
          <span className={styles.resendHint}>
            You can resend once the timer reaches{" "}
            {formatUnlock(OTP_RESEND_UNLOCK_SECONDS)}
          </span>
        )}
      </div>
    </div>
  );
}
