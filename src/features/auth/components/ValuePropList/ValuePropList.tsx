import { Icon } from "@/components/ui";
import type { ValueProp } from "../../types";
import { cn } from "@/lib/cn";

const VALUE_PROPS: ValueProp[] = [
  { icon: "bolt", text: "Real-time project tracking across all teams" },
  { icon: "shield", text: "Enterprise-grade security with Azure AD" },
  { icon: "analytics", text: "Actionable analytics and billing reports" },
  { icon: "group", text: "Role-based access for every stakeholder" },
];

export function ValuePropList() {
  return (
    <ul
      className={cn(
        "flex flex-col items-start list-none min-h-0",
        "gap-[clamp(6px,1.5vh,16px)]",
      )}
    >
      {VALUE_PROPS.map((prop) => (
        <li
          key={prop.text}
          className={cn(
            "flex items-center gap-[clamp(10px,1.6vh,16px)]",
            "py-[clamp(6px,1.1vh,12px)]",
            "pl-[clamp(6px,1.1vh,12px)] pr-[clamp(16px,2.6vh,24px)]",
            "rounded-[clamp(0.75rem,1.8vh,1rem)]",
            "bg-[rgba(255,255,255,0.06)]",
            "border border-solid border-[rgba(255,255,255,0.08)]",
            "backdrop-blur-[12px] shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
            "text-brand-text",
            "transition-[background-color] duration-base ease-out-expo",
            "hover:bg-[rgba(255,255,255,0.1)]",
          )}
        >
          <span
            className={cn(
              "shrink-0 flex items-center justify-center rounded-full",
              "w-[clamp(28px,4.4vh,40px)] h-[clamp(28px,4.4vh,40px)]",
              "bg-[rgba(255,255,255,0.1)]",
            )}
          >
            <Icon
              name={prop.icon}
              className="[--icon-size:clamp(15px,2.4vh,20px)]"
              filled
            />
          </span>
          <span className="text-[clamp(0.75rem,min(1.05vw,1.85vh),1rem)] font-medium leading-[1.3]">
            {prop.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
