"use client";

import { useMemo, useState, type FormEvent } from "react";
import { meetsPolicy, scorePassword } from "../passwordPolicy";

const EMPTY = { current: "", next: "", confirm: "" };

export interface ChangePasswordValues {
  current: string;
  next: string;
  confirm: string;
}

export function useChangePasswordForm(
  onSubmit?: (values: ChangePasswordValues) => void | Promise<void>,
) {
  const [values, setValues] = useState<ChangePasswordValues>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  const strength = useMemo(() => scorePassword(values.next), [values.next]);

  const confirmTouched = values.confirm.length > 0;
  const confirmMatches = confirmTouched && values.confirm === values.next;
  const confirmMismatch = confirmTouched && values.confirm !== values.next;

  /** Reusing the current password is a common mistake worth calling out. */
  const reusesCurrent =
    values.next.length > 0 && values.next === values.current;

  const canSubmit =
    values.current.length > 0 &&
    meetsPolicy(values.next) &&
    confirmMatches &&
    !reusesCurrent;

  const setField = (field: keyof ChangePasswordValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (status === "saved") setStatus("idle");
  };

  const reset = () => {
    setValues(EMPTY);
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
      setValues(EMPTY);
      setStatus("saved");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    setField,
    reset,
    handleSubmit,
    isSubmitting,
    status,
    strength,
    confirmMatches,
    confirmMismatch,
    reusesCurrent,
    canSubmit,
  };
}
