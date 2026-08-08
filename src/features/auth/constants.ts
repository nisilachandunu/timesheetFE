/** Number of slots in the one-time password. */
export const OTP_LENGTH = 5;

/** How long an issued OTP stays valid. */
export const OTP_VALIDITY_SECONDS = 5 * 60; // 5 minutes

/**
 * Resend unlocks once the countdown has fallen to this many seconds,
 * i.e. 1:30 remaining.
 */
export const OTP_RESEND_UNLOCK_SECONDS = 90;

/** Shortest password we accept when setting or resetting one. */
export const MIN_PASSWORD_LENGTH = 8;
