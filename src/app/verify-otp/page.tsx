import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout, OtpForm, OtpFormContainer } from "@/features/auth";

export const metadata: Metadata = {
  title: "Verify OTP - TimesheetOS",
  description: "Enter the one-time password sent to your email",
};

export default function VerifyOtpPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<OtpForm />}>
        <OtpFormContainer />
      </Suspense>
    </AuthLayout>
  );
}
