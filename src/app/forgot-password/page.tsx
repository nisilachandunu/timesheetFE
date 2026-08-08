import type { Metadata } from "next";
import { AuthLayout, ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Forgot Password - TimesheetOS",
  description: "Recover access to your TimesheetOS account",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
