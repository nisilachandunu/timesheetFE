"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, Icon, TextInput, TextLink } from "@/components/ui";
import { useForgotPasswordForm } from "../../hooks";
import type { ForgotPasswordRequest } from "../../types";
import { stagger } from "../stagger";
import { cn } from "@/lib/cn";

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
    <div className="w-full max-w-sm mx-auto">
      <div className={cn(stagger(1), "mb-[clamp(14px,2.6vh,28px)]")}>
        <TextLink href="/sign-in" icon="arrow_back">
          Back to sign in
        </TextLink>
      </div>

      <div className={stagger(1)}>
        <p
          className={cn(
            "flex items-center gap-2 mb-[clamp(10px,2vh,24px)]",
            "text-label-sm font-semibold tracking-[0.12em] uppercase",
            "text-on-surface-variant",
          )}
        >
          <Icon name="lock_reset" size={16} />
          Password Recovery
        </p>
        <h2
          className={cn(
            "text-[clamp(1.5rem,min(2.2vw,3.6vh),2rem)] font-bold",
            "tracking-[-0.02em] leading-[1.2] mb-2",
          )}
        >
          Forgot password?
        </h2>
        <p
          className={cn(
            "text-[clamp(0.875rem,1.8vh,1rem)] leading-[1.55]",
            "text-on-surface-variant mb-[clamp(16px,3.2vh,32px)]",
          )}
        >
          No worries, enter your account email to receive an OTP.
        </p>
      </div>

      <form
        className="flex flex-col gap-[clamp(12px,2.2vh,20px)]"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className={stagger(2)}>
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

        <div className={stagger(3)}>
          <Button type="submit" loading={isBusy}>
            {isBusy ? "Sending OTP…" : "Send OTP"}
            {!isBusy && <Icon name="arrow_forward" size={18} />}
          </Button>
        </div>
      </form>

      <p
        className={cn(
          stagger(4),
          "flex items-center justify-center gap-2 mt-[clamp(10px,2.2vh,24px)]",
          "text-label-xs font-semibold text-on-surface-variant",
        )}
      >
        <Icon name="schedule" size={14} />
        The OTP is valid for 5 minutes
      </p>
    </div>
  );
}
