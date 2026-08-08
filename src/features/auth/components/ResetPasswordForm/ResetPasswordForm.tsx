"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, Icon, PasswordInput, TextLink } from "@/components/ui";
import { MIN_PASSWORD_LENGTH } from "../../constants";
import { useResetPasswordForm } from "../../hooks";
import type { ResetPasswordRequest } from "../../types";
import { stagger } from "../stagger";
import { cn } from "@/lib/cn";

export interface ResetPasswordFormProps {
  /** Address the OTP was verified against, shown back to the user. */
  email?: string;
  /** Overrides the default behaviour of routing to the dashboard. */
  onSubmit?: (request: ResetPasswordRequest) => void | Promise<void>;
}

/** Small centred note used under the fields and below the form. */
const NOTE = "flex items-center gap-2 text-label-xs font-semibold text-on-surface-variant";

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
          <Icon name="lock_reset" size={16} />
          Identity Verified
        </p>
        <h2
          className={cn(
            "text-[clamp(1.5rem,min(2.2vw,3.6vh),2rem)] font-bold",
            "tracking-[-0.02em] leading-[1.2] mb-2",
          )}
        >
          Set a new password
        </h2>
        <p
          className={cn(
            "text-[clamp(0.875rem,1.8vh,1rem)] leading-[1.55]",
            "text-on-surface-variant mb-[clamp(16px,3.2vh,32px)]",
          )}
        >
          {email ? (
            <>
              Choose a new password for{" "}
              <span className="font-semibold text-on-background [overflow-wrap:anywhere]">
                {email}
              </span>
              .
            </>
          ) : (
            "Choose a new password for your account."
          )}
        </p>
      </div>

      <form
        className="flex flex-col gap-[clamp(12px,2.2vh,20px)]"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className={stagger(2)}>
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

        <div className={stagger(3)}>
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

        <p className={cn(stagger(3), NOTE)}>
          <Icon name="info" size={14} />
          Use at least {MIN_PASSWORD_LENGTH} characters
        </p>

        <div className={stagger(4)}>
          <Button type="submit" loading={isBusy}>
            {isBusy ? "Updating password…" : "Reset password"}
            {!isBusy && <Icon name="arrow_forward" size={18} />}
          </Button>
        </div>
      </form>

      <p
        className={cn(
          stagger(4),
          NOTE,
          "justify-center mt-[clamp(10px,2.2vh,24px)]",
        )}
      >
        <Icon name="shield_locked" size={14} />
        You&apos;ll be signed in once your password is updated
      </p>
    </div>
  );
}
