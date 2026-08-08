"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, Divider, Icon, PasswordInput, TextInput, TextLink } from "@/components/ui";
import { useSignInForm } from "../../hooks";
import type { SignInCredentials } from "../../types";
import { SsoButton } from "../SsoButton";
import styles from "./SignInForm.module.css";

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
    <div className={styles.wrapper}>
      <div className={`${styles.stagger} ${styles.s1}`}>
        <p className={styles.eyebrow}>
          <Icon name="lock" size={16} />
          Secure Sign-In
        </p>
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Sign in to your account to continue</p>
      </div>

      <div className={`${styles.stagger} ${styles.s2} ${styles.ssoSlot}`}>
        <SsoButton onClick={onSsoSignIn} disabled={isBusy} />
      </div>

      <Divider className={`${styles.stagger} ${styles.s3} ${styles.divider}`}>
        or
      </Divider>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.stagger} ${styles.s4}`}>
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

        <div className={`${styles.stagger} ${styles.s5}`}>
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

        <div className={`${styles.stagger} ${styles.s6} ${styles.formActions}`}>
          <TextLink href="/forgot-password">Forgot password?</TextLink>
        </div>

        <div className={`${styles.stagger} ${styles.s7}`}>
          <Button type="submit" loading={isBusy}>
            {isBusy ? "Signing in…" : "Sign In"}
          </Button>
        </div>
      </form>

      <p className={`${styles.stagger} ${styles.s7} ${styles.encryptionNote}`}>
        <Icon name="shield_locked" size={14} />
        Protected by enterprise-grade encryption
      </p>

      <div className={`${styles.stagger} ${styles.s7} ${styles.footer}`}>
        <p className={styles.footerHelp}>
          Need help? <TextLink href="#">Contact IT Support</TextLink>
        </p>
        <p className={styles.footerLegal}>
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
