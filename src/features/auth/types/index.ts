export interface SignInCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordCredentials {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  /** Address the recovery OTP was verified against, when known. */
  email?: string;
  password: string;
}

export interface ValueProp {
  icon: string;
  text: string;
}

export interface TrustBadge {
  label: string;
  /** Renders the status dot in the accent colour when true. */
  highlighted?: boolean;
}
