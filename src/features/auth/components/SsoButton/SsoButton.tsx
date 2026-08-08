import { Button, Icon, MicrosoftLogo } from "@/components/ui";

export interface SsoButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export function SsoButton({ onClick, disabled }: SsoButtonProps) {
  return (
    <Button
      variant="outline"
      className="group justify-between"
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={
          "flex items-center gap-3 text-label-sm font-semibold " +
          "transition-colors duration-base ease-[ease] group-hover:text-accent-text"
        }
      >
        <MicrosoftLogo />
        Sign in with Microsoft 365
      </span>
      <Icon
        name="arrow_forward"
        size={20}
        // Two properties with different easings, so the shorthand is spelled out.
        className={
          "text-on-surface-variant " +
          "[transition:color_var(--duration-base)_ease,transform_var(--duration-base)_var(--ease-out-expo)] " +
          "group-hover:text-accent-text group-hover:translate-x-[3px]"
        }
      />
    </Button>
  );
}
