"use client";

import { useState, type FormEvent } from "react";
import type { SignInCredentials } from "../types";
import { validateEmail, validatePassword } from "../validation";

type Field = keyof SignInCredentials;
type Errors = Partial<Record<Field, string>>;

const INITIAL_STATE: SignInCredentials = {
  email: "",
  password: "",
};

function validateField(field: Field, value: string): string | undefined {
  return field === "email" ? validateEmail(value) : validatePassword(value);
}

function validateAll(credentials: SignInCredentials): Errors {
  const errors: Errors = {};
  const email = validateEmail(credentials.email);
  const password = validatePassword(credentials.password);
  if (email) errors.email = email;
  if (password) errors.password = password;
  return errors;
}

export function useSignInForm(
  onSubmit?: (credentials: SignInCredentials) => void | Promise<void>,
) {
  const [credentials, setCredentials] = useState<SignInCredentials>(INITIAL_STATE);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: Field, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));

    // Only re-validate a field that is already showing an error, so the
    // message clears as soon as the input becomes valid — but we never
    // surface an error while the user is still typing for the first time.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      const message = validateField(field, value);
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const handleBlur = (field: Field) => {
    const message = validateField(field, credentials[field]);
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
      await onSubmit?.({
        ...credentials,
        email: credentials.email.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { credentials, errors, handleChange, handleBlur, handleSubmit, isSubmitting };
}
