import { Button, Icon, MicrosoftLogo } from "@/components/ui";
import styles from "./SsoButton.module.css";

export interface SsoButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function SsoButton({ onClick, disabled }: SsoButtonProps) {
  return (
    <Button
      variant="outline"
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.label}>
        <MicrosoftLogo />
        Sign in with Microsoft 365
      </span>
      <Icon name="arrow_forward" size={20} className={styles.arrow} />
    </Button>
  );
}
