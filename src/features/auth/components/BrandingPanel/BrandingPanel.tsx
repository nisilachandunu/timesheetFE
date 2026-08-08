import { InteractiveGlow, Logo } from "@/components/ui";
import { TrustBadges } from "../TrustBadges";
import { ValuePropList } from "../ValuePropList";
import { cn } from "@/lib/cn";

/** Ambient mesh-gradient blobs drifting behind the frosted card. */
const BLOB = cn(
  "absolute rounded-full blur-[120px] mix-blend-screen",
  "animate-blob z-0 pointer-events-none",
);

export function BrandingPanel() {
  return (
    <InteractiveGlow
      className={cn(
        "flex-[0_0_62%] min-w-0 flex flex-col overflow-hidden",
        "bg-brand-canvas p-[clamp(12px,2.2vh,32px)]",
        // Below the desktop breakpoint the form takes the whole screen.
        "max-lg:hidden max-[1279px]:flex-[0_0_55%]",
      )}
    >
      <span
        className={cn(BLOB, "top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[rgba(126,34,206,0.4)]")}
        aria-hidden="true"
      />
      <span
        className={cn(
          BLOB,
          "top-[20%] right-[-10%] w-[50%] h-[70%] bg-[rgba(192,38,211,0.3)]",
          "[animation-delay:2s]",
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          BLOB,
          "bottom-[-20%] left-[10%] w-[70%] h-[60%] bg-[rgba(79,70,229,0.4)]",
          "[animation-delay:4s]",
        )}
        aria-hidden="true"
      />

      {/* Frosted card holding the content. Every dimension is viewport-height
          aware so the panel fits a laptop screen without ever scrolling. */}
      <div
        className={cn(
          "relative z-[2] flex-1 min-h-0 flex flex-col justify-between",
          "gap-[clamp(12px,2.4vh,40px)] w-full p-[clamp(20px,3.6vh,48px)]",
          "rounded-[clamp(1rem,2.4vh,2rem)] bg-[rgba(255,255,255,0.03)]",
          "border border-solid border-[rgba(255,255,255,0.1)]",
          "backdrop-blur-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
          "overflow-hidden",
        )}
      >
        <Logo className="shrink-0" />

        <div
          className={cn(
            "flex-[0_1_auto] flex flex-col justify-center min-h-0",
            "gap-[clamp(10px,2vh,24px)]",
          )}
        >
          <h1
            className={cn(
              "text-[clamp(1.5rem,min(3.4vw,5.6vh),3.5rem)] font-extrabold",
              "leading-[1.05] tracking-[-0.03em] text-brand-text",
              "[text-shadow:0_4px_12px_rgba(0,0,0,0.25)]",
            )}
          >
            Track time.
            <br />
            Ship faster.
            <br />
            Stay aligned.
          </h1>

          <p
            className={cn(
              "max-w-[34rem] leading-[1.55] text-brand-text-muted",
              "text-[clamp(0.8125rem,min(1.2vw,2vh),1.125rem)]",
              // Very short viewports: drop the supporting copy rather than
              // crushing the hierarchy.
              "[@media(max-height:620px)]:hidden",
            )}
          >
            The modern timesheet platform trusted by enterprise teams to track
            time, manage projects, and unlock deep productivity insights.
          </p>

          <ValuePropList />
        </div>

        <div className="relative z-[2] shrink-0">
          <TrustBadges />
        </div>
      </div>
    </InteractiveGlow>
  );
}
