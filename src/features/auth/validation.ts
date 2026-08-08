import { MIN_PASSWORD_LENGTH, OTP_LENGTH } from "./constants";

/**
 * Deliberately permissive: catches typos and obviously malformed input
 * without rejecting valid-but-unusual addresses. The server remains the
 * authority on whether an address actually exists.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Email address is required";
  if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address";
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required";
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return undefined;
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): string | undefined {
  if (!confirmation) return "Confirm your new password";
  if (confirmation !== password) return "Passwords do not match";
  return undefined;
}

export function validateOtp(value: string): string | undefined {
  if (!value) return `Enter the ${OTP_LENGTH}-digit code we sent you`;
  if (!/^\d*$/.test(value)) return "The code contains digits only";
  if (value.length < OTP_LENGTH) return `Enter all ${OTP_LENGTH} digits`;
  return undefined;
}
