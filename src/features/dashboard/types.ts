export interface NavLink {
  href: string;
  label: string;
  /** Material Symbols ligature name. */
  icon: string;
  /** Solid accent for the icon chip and active marker. */
  accent: string;
  /** Translucent form of `accent`, used as the resting chip fill. */
  accentSoft: string;
}

export interface UserProfile {
  name: string;
  email: string;
  /** Job title, e.g. "Associate Software Engineer". */
  designation: string;
  /** Access level within the product, e.g. "Employee". */
  role: string;
  avatarUrl?: string;
}
