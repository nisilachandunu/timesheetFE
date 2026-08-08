"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, Icon, OtpInput, TextLink } from "@/components/ui";
import { OTP_LENGTH, OTP_RESEND_UNLOCK_SECONDS } from "../../constants";
import { useOtpVerification } from "../../hooks";
import { stagger } from "../stagger";
import { cn } from "@/lib/cn";

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
    <div className="w-full max-w-sm mx-auto">
      <div className={cn(stagger(1), "mb-[clamp(14px,2.6vh,28px)]")}>
        <TextLink href="/sign-in" icon="arrow_back">
          Back to sign in
        </TextLink>
      </div>

      <div className={stagger(1)}>
        <p
          className={cn(
            "flex items-center gap-2 mb-[clamp(8px,1.6vh,16px)]",
            "text-label-sm font-semibold tracking-[0.12em] uppercase",
            "text-on-surface-variant",
          )}
        >
          <Icon name="mark_email_read" size={16} />
          Verify Your Identity
        </p>
        <h2
          className={cn(
            "text-[clamp(1.5rem,min(2.2vw,3.6vh),2rem)] font-bold",
            "tracking-[-0.02em] leading-[1.2] mb-2",
          )}
        >
          Enter the OTP
        </h2>
        <p
          className={cn(
            "text-[clamp(0.875rem,1.8vh,1rem)] leading-[1.55]",
            "text-on-surface-variant mb-[clamp(16px,3.2vh,32px)]",
          )}
        >
          We sent a {OTP_LENGTH}-digit code to{" "}
          <span className="font-semibold text-on-background [overflow-wrap:anywhere]">
            {email || "your email address"}
          </span>
          .
        </p>
      </div>

      <form
        className="flex flex-col gap-[clamp(14px,2.6vh,24px)]"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className={stagger(2)}>
          <OtpInput
            value={code}
            onChange={setCode}
            length={OTP_LENGTH}
            disabled={isExpired || isBusy}
            invalid={isExpired || Boolean(error)}
            autoFocus
          />
          {error && (
            <p
              className={cn(
                "flex items-center justify-center gap-1 mt-2",
                "text-label-sm font-semibold text-error",
              )}
              role="alert"
            >
              <Icon name="error" size={14} />
              {error}
            </p>
          )}
        </div>

        <p
          className={cn(
            stagger(3),
            "flex items-center justify-center gap-2",
            "text-label-sm font-semibold text-on-surface-variant",
          )}
        >
          <Icon name={isExpired ? "timer_off" : "schedule"} size={14} />
          {isExpired ? (
            "Code expired — request a new one"
          ) : (
            <>
              Code expires in{" "}
              <span className="tabular-nums text-accent-text" aria-live="polite">
                {formatted}
              </span>
            </>
          )}
        </p>

        <div className={stagger(3)}>
          {/* Stays enabled while incomplete so submitting surfaces the
              validation message rather than silently doing nothing. */}
          <Button type="submit" loading={isBusy} disabled={isExpired}>
            {isBusy ? "Verifying…" : "Verify OTP"}
            {!isBusy && <Icon name="arrow_forward" size={18} />}
          </Button>
        </div>
      </form>

      <div
        className={cn(
          stagger(4),
          "flex flex-wrap items-center justify-center gap-2",
          "mt-[clamp(12px,2.4vh,24px)] text-label-sm text-on-surface-variant",
        )}
      >
        <span>Didn&apos;t receive the code?</span>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 rounded-sm",
            "text-label-sm font-bold text-accent-text",
            "transition-colors duration-base ease-[ease]",
            "enabled:hover:text-secondary enabled:hover:underline",
            "enabled:hover:underline-offset-[3px]",
            "disabled:text-outline disabled:cursor-not-allowed disabled:no-underline",
          )}
          onClick={handleResend}
          disabled={!canResend}
        >
          <Icon name="refresh" size={15} />
          Resend code
        </button>

        {!canResend && (
          <span className="w-full text-center text-label-xs text-outline">
            You can resend once the timer reaches{" "}
            {formatUnlock(OTP_RESEND_UNLOCK_SECONDS)}
          </span>
        )}
      </div>
    </div>
  );
}
