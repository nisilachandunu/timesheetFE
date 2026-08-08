import { InteractiveGlow, Logo } from "@/components/ui";
import { TrustBadges } from "../TrustBadges";
import { ValuePropList } from "../ValuePropList";
import styles from "./BrandingPanel.module.css";

export function BrandingPanel() {
  return (
    <InteractiveGlow className={styles.panel}>
      <span className={`${styles.blob} ${styles.blobOne}`} aria-hidden="true" />
      <span className={`${styles.blob} ${styles.blobTwo}`} aria-hidden="true" />
      <span className={`${styles.blob} ${styles.blobThree}`} aria-hidden="true" />

      <div className={styles.card}>
        <Logo className={styles.logo} />

        <div className={styles.body}>
          <h1 className={styles.headline}>
            Track time.
            <br />
            Ship faster.
            <br />
            Stay aligned.
          </h1>

          <p className={styles.subhead}>
            The modern timesheet platform trusted by enterprise teams to track
            time, manage projects, and unlock deep productivity insights.
          </p>

          <ValuePropList />
        </div>

        <div className={styles.footer}>
          <TrustBadges />
        </div>
      </div>
    </InteractiveGlow>
  );
}
