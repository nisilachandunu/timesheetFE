"use client";

import { useSearchParams } from "next/navigation";
import { OtpForm } from "./OtpForm";

/**
 * Reads the address the code was sent to from the query string.
 * Split from OtpForm so the Suspense boundary wraps only the part that
 * depends on search params.
 */
export function OtpFormContainer() {
  const email = useSearchParams().get("email") ?? undefined;
  return <OtpForm email={email} />;
}
