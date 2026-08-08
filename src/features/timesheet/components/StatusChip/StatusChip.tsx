import styles from "./StatusChip.module.css";

export type ChipTone = "neutral" | "accent" | "success" | "danger";

export interface StatusChipProps {
  label: string;
  tone?: ChipTone;
}

/** Compact status pill: a tone dot plus a label, sized for a dense grid row. */
export function StatusChip({ label, tone = "neutral" }: StatusChipProps) {
  return <span className={`${styles.chip} ${styles[tone]}`}>{label}</span>;
}
