"use client";

import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "./ResetPasswordForm";

/**
 * Reads the verified address from the query string. Split from
 * ResetPasswordForm so the Suspense boundary wraps only the part that
 * depends on search params.
 */
export function ResetPasswordFormContainer() {
  const email = useSearchParams().get("email") ?? undefined;
  return <ResetPasswordForm email={email} />;
}
