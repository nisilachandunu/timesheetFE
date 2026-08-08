"use client";

import { useState, type FormEvent } from "react";
import type { ForgotPasswordRequest } from "../types";
import { validateEmail } from "../validation";

export function useForgotPasswordForm(
  onSubmit?: (request: ForgotPasswordRequest) => void | Promise<void>,
) {
  const [email, setEmailValue] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setEmail = (value: string) => {
    setEmailValue(value);
    // Clear a visible error as soon as the value becomes valid.
    if (error) setError(validateEmail(value));
  };

  const handleBlur = () => setError(validateEmail(email));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = validateEmail(email);
    setError(message);
    if (message) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({ email: email.trim() });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { email, setEmail, error, handleBlur, handleSubmit, isSubmitting };
}
