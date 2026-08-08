import type { Metadata } from "next";
import { AuthLayout, SignInForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign In - TimesheetOS",
  description: "Sign in to your TimesheetOS account",
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
