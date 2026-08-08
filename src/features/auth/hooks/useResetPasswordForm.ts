"use client";

import { useState, type FormEvent } from "react";
import type { ResetPasswordCredentials } from "../types";
import { validatePassword, validatePasswordConfirmation } from "../validation";

type Field = keyof ResetPasswordCredentials;
type Errors = Partial<Record<Field, string>>;

const INITIAL_STATE: ResetPasswordCredentials = {
  password: "",
  confirmPassword: "",
};

function validateField(
  field: Field,
  credentials: ResetPasswordCredentials,
): string | undefined {
  return field === "password"
    ? validatePassword(credentials.password)
    : validatePasswordConfirmation(
        credentials.password,
        credentials.confirmPassword,
      );
}

function validateAll(credentials: ResetPasswordCredentials): Errors {
  const errors: Errors = {};
  const password = validatePassword(credentials.password);
  const confirmPassword = validatePasswordConfirmation(
    credentials.password,
    credentials.confirmPassword,
  );
  if (password) errors.password = password;
  if (confirmPassword) errors.confirmPassword = confirmPassword;
  return errors;
}

export function useResetPasswordForm(
  onSubmit?: (password: string) => void | Promise<void>,
) {
  const [credentials, setCredentials] =
    useState<ResetPasswordCredentials>(INITIAL_STATE);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: Field, value: string) => {
    const next = { ...credentials, [field]: value };
    setCredentials(next);

    // Only re-validate fields that are already showing an error, so a
    // message clears as soon as the input becomes valid without nagging
    // while the user is still typing for the first time. Editing the
    // password can also resolve a stale mismatch on the confirmation.
    setErrors((prev) => {
      const updated = { ...prev };
      for (const key of ["password", "confirmPassword"] as const) {
        if (!updated[key]) continue;
        const message = validateField(key, next);
        if (message) updated[key] = message;
        else delete updated[key];
      }
      return updated;
    });
  };

  const handleBlur = (field: Field) => {
    const message = validateField(field, credentials);
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validateAll(credentials);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(credentials.password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { credentials, errors, handleChange, handleBlur, handleSubmit, isSubmitting };
}
