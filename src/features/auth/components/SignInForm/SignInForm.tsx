"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, Divider, Icon, PasswordInput, TextInput, TextLink } from "@/components/ui";
import { useSignInForm } from "../../hooks";
import type { SignInCredentials } from "../../types";
import { SsoButton } from "../SsoButton";
import { stagger } from "../stagger";
import { cn } from "@/lib/cn";

export interface SignInFormProps {
  /** Overrides the default behaviour of routing to the dashboard. */
  onSubmit?: (credentials: SignInCredentials) => void | Promise<void>;
  onSsoSignIn?: () => void;
}

export function SignInForm({ onSubmit, onSsoSignIn }: SignInFormProps) {
  const router = useRouter();
  // router.push() resolves immediately, so a plain submitting flag would
  // flash. useTransition stays pending for the whole navigation.
  const [isNavigating, startNavigation] = useTransition();

  const { credentials, errors, handleChange, handleBlur, handleSubmit, isSubmitting } =
    useSignInForm(async (values) => {
      if (onSubmit) {
        await onSubmit(values);
        return;
      }
      startNavigation(() => router.push("/dashboard"));
    });

  const isBusy = isSubmitting || isNavigating;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className={stagger(1)}>
        <p
          className={cn(
            "flex items-center gap-2 mb-[clamp(10px,2vh,24px)]",
            "text-label-sm font-semibold tracking-[0.12em] uppercase",
            "text-on-surface-variant",
          )}
        >
          <Icon name="lock" size={16} />
          Secure Sign-In
        </p>
        <h2
          className={cn(
            "text-[clamp(1.5rem,min(2.2vw,3.6vh),2rem)] font-bold",
            "tracking-[-0.02em] leading-[1.2] mb-2",
          )}
        >
          Welcome back
        </h2>
        <p
          className={cn(
            "text-[clamp(0.875rem,1.8vh,1rem)] text-on-surface-variant",
            "mb-[clamp(14px,2.8vh,32px)]",
          )}
        >
          Sign in to your account to continue
        </p>
      </div>

      <div className={cn(stagger(2), "mb-[clamp(10px,2.2vh,24px)]")}>
        <SsoButton onClick={onSsoSignIn} disabled={isBusy} />
      </div>

      <Divider className={cn(stagger(3), "mb-[clamp(10px,2.2vh,24px)]")}>
        or
      </Divider>

      <form
        className="flex flex-col gap-[clamp(10px,1.8vh,16px)]"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className={stagger(4)}>
          <TextInput
            id="email"
            name="email"
            label="Email address"
            type="email"
            icon="mail"
            autoComplete="email"
            placeholder="you@company.com"
            value={credentials.email}
            errorText={errors.email}
            disabled={isBusy}
            onChange={(event) => handleChange("email", event.target.value)}
            onBlur={() => handleBlur("email")}
          />
        </div>

        <div className={stagger(5)}>
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={credentials.password}
            errorText={errors.password}
            disabled={isBusy}
            onChange={(event) => handleChange("password", event.target.value)}
            onBlur={() => handleBlur("password")}
          />
        </div>

        <div className={cn(stagger(6), "flex items-center justify-end py-1 px-0")}>
          <TextLink href="/forgot-password">Forgot password?</TextLink>
        </div>

        <div className={stagger(7)}>
          <Button type="submit" loading={isBusy}>
            {isBusy ? "Signing in…" : "Sign In"}
          </Button>
        </div>
      </form>

      <p
        className={cn(
          stagger(7),
          "flex items-center justify-center gap-2 mt-[clamp(10px,2.2vh,24px)]",
          "text-label-xs font-semibold text-on-surface-variant",
        )}
      >
        <Icon name="shield_locked" size={14} />
        Protected by enterprise-grade encryption
      </p>

      <div
        className={cn(
          stagger(7),
          "mt-[clamp(16px,3.4vh,40px)] text-center text-on-surface-variant",
        )}
      >
        <p className="text-label-sm font-semibold mb-2">
          Need help? <TextLink href="#">Contact IT Support</TextLink>
        </p>
        <p className="text-label-xs leading-[1.6]">
          By signing in, you agree to our{" "}
          <TextLink href="#" subtle>
            Terms of Service
          </TextLink>{" "}
          and{" "}
          <TextLink href="#" subtle>
            Privacy Policy
          </TextLink>
        </p>
      </div>
    </div>
  );
}
