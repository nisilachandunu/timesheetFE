import { Icon } from "@/components/ui";
import type { ValueProp } from "../../types";
import styles from "./ValuePropList.module.css";

const VALUE_PROPS: ValueProp[] = [
  { icon: "bolt", text: "Real-time project tracking across all teams" },
  { icon: "shield", text: "Enterprise-grade security with Azure AD" },
  { icon: "analytics", text: "Actionable analytics and billing reports" },
  { icon: "group", text: "Role-based access for every stakeholder" },
];

export function ValuePropList() {
  return (
    <ul className={styles.list}>
      {VALUE_PROPS.map((prop) => (
        <li key={prop.text} className={styles.item}>
          <span className={styles.iconWrap}>
            <Icon name={prop.icon} className={styles.icon} filled />
          </span>
          <span className={styles.text}>{prop.text}</span>
        </li>
      ))}
    </ul>
  );
}
