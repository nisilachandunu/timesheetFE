import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AuthLayout,
  ResetPasswordForm,
  ResetPasswordFormContainer,
} from "@/features/auth";

export const metadata: Metadata = {
  title: "Reset Password - TimesheetOS",
  description: "Choose a new password for your TimesheetOS account",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<ResetPasswordForm />}>
        <ResetPasswordFormContainer />
      </Suspense>
    </AuthLayout>
  );
}
