"use client";

import { useState, type FormEvent } from "react";
import { useCountdown } from "@/hooks";
import {
  OTP_LENGTH,
  OTP_RESEND_UNLOCK_SECONDS,
  OTP_VALIDITY_SECONDS,
} from "../constants";
import { validateOtp } from "../validation";

export interface UseOtpVerificationOptions {
  onVerify?: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
}

export function useOtpVerification({
  onVerify,
  onResend,
}: UseOtpVerificationOptions = {}) {
  const [code, setCodeValue] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { secondsLeft, formatted, isExpired, restart } =
    useCountdown(OTP_VALIDITY_SECONDS);

  /** Resend stays locked until the countdown reaches 1:30 remaining. */
  const canResend = secondsLeft <= OTP_RESEND_UNLOCK_SECONDS;
  const isComplete = code.length === OTP_LENGTH;

  const setCode = (value: string) => {
    setCodeValue(value);
    if (error) setError(undefined);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isExpired) {
      setError("This code has expired — request a new one");
      return;
    }

    const message = validateOtp(code);
    setError(message);
    if (message) return;

    setIsSubmitting(true);
    try {
      await onVerify?.(code);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCodeValue("");
    setError(undefined);
    restart();
    await onResend?.();
  };

  return {
    code,
    setCode,
    error,
    isComplete,
    isSubmitting,
    secondsLeft,
    formatted,
    isExpired,
    canResend,
    handleSubmit,
    handleResend,
  };
}
