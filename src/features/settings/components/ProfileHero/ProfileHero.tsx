import { Avatar, Badge, Icon } from "@/components/ui";
import type { UserProfile } from "@/features/dashboard";
import { cn } from "@/lib/cn";

export interface ProfileHeroProps {
  user: UserProfile;
}

/**
 * The cover gradient is written as two utilities — a background-image and a
 * background-color — because `bg-[<gradient>,<color>]` would land the colour
 * in background-image, where it is not a valid layer.
 *
 * At full strength the cover glares against dark surroundings, so the dark
 * variant drops to a muted band that sits closer to the card it tops.
 */
const COVER = cn(
  "relative h-[132px]",
  "bg-brand-canvas",
  "bg-[radial-gradient(110%_160%_at_8%_0%,rgba(167,139,250,0.95)_0%,rgba(99,76,232,0.9)_42%,rgba(30,27,75,0.98)_100%)]",
  "dark:bg-surface-container",
  "dark:bg-[radial-gradient(110%_160%_at_8%_0%,rgba(123,110,240,0.55)_0%,rgba(86,76,190,0.4)_45%,rgba(22,24,31,0.9)_100%)]",
  // Fine diagonal weave keeps the gradient from reading as a flat blob.
  "before:content-[''] before:absolute before:inset-0",
  "before:bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.07)_0px,rgba(255,255,255,0.07)_1px,transparent_1px,transparent_9px)]",
  // Soft light bloom in the upper-right.
  "after:content-[''] after:absolute after:inset-0",
  "after:bg-[radial-gradient(58%_120%_at_88%_10%,rgba(255,255,255,0.26)_0%,transparent_62%)]",
);

export function ProfileHero({ user }: ProfileHeroProps) {
  return (
    <section
      className={cn(
        "relative rounded-[20px] overflow-hidden bg-surface-lowest",
        "shadow-panel",
      )}
    >
      <div className={COVER} aria-hidden="true" />

      <div
        className={cn(
          "flex items-end gap-[18px]",
          "pt-3.5 px-[clamp(18px,2.4vw,28px)] pb-[clamp(18px,2.4vw,24px)]",
          "max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-3",
        )}
      >
        {/* Only the avatar overlaps the cover — pulling the whole row up would
            put the name and email behind it. */}
        <span
          className={cn(
            "relative z-[1] -mt-[60px] p-1 rounded-full shrink-0",
            "bg-surface-lowest shadow-[0_10px_26px_-12px_rgba(19,17,40,0.5)]",
          )}
        >
          <Avatar name={user.name} src={user.avatarUrl} size={84} />
        </span>

        <div className="min-w-0 pb-1">
          <h2
            className={cn(
              "text-[clamp(1.25rem,2.2vw,1.5rem)] font-bold",
              "tracking-[-0.02em] leading-[1.2] text-on-background",
            )}
          >
            {user.name}
          </h2>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 mt-[3px] text-sm",
              "text-on-surface-variant",
              "overflow-hidden text-ellipsis whitespace-nowrap",
            )}
          >
            <Icon name="mail" className="[--icon-size:16px] shrink-0" />
            {user.email}
          </span>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="accent" icon="badge">
              {user.designation}
            </Badge>
            <Badge variant="neutral" icon="shield_person">
              {user.role}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
