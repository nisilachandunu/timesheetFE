export interface MicrosoftLogoProps {
  size?: number;
  className?: string;
}

export function MicrosoftLogo({ size = 20, className }: MicrosoftLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect fill="#f25022" height="9" width="9" x="1" y="1" />
      <rect fill="#7fba00" height="9" width="9" x="11" y="1" />
      <rect fill="#00a4ef" height="9" width="9" x="1" y="11" />
      <rect fill="#ffb900" height="9" width="9" x="11" y="11" />
    </svg>
  );
}
