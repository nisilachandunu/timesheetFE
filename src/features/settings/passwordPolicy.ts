export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (v) => v.length >= 8,
  },
  {
    id: "number",
    label: "At least one number",
    test: (v) => /\d/.test(v),
  },
  {
    id: "case",
    label: "Upper & lower case letters",
    test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  {
    id: "symbol",
    label: "At least one symbol",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

export type StrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

export interface PasswordStrength {
  level: StrengthLevel;
  label: string;
  /** 0–4, drives the meter segments. */
  score: number;
}

const LABELS: Record<StrengthLevel, string> = {
  empty: "Enter a password",
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
};

/**
 * Scores on rules satisfied, with a bonus for length — a long passphrase is
 * stronger than a short string that merely ticks every character class.
 */
export function scorePassword(value: string): PasswordStrength {
  if (!value) return { level: "empty", label: LABELS.empty, score: 0 };

  const passed = PASSWORD_RULES.filter((rule) => rule.test(value)).length;
  let score = passed;

  if (value.length >= 12 && passed >= 3) score += 1;
  if (value.length < 8) score = Math.min(score, 1);
  score = Math.max(1, Math.min(score, 4));

  const level: StrengthLevel =
    score <= 1 ? "weak" : score === 2 ? "fair" : score === 3 ? "good" : "strong";

  return { level, label: LABELS[level], score };
}

export function meetsPolicy(value: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}
