import type { ReactNode } from "react";
import { Icon } from "../Icon";
import styles from "./Card.module.css";

export interface CardProps {
  title?: string;
  description?: string;
  /** Material Symbols ligature name shown in the header tile. */
  icon?: string;
  /** Trailing header content, e.g. a status chip. */
  headerAside?: ReactNode;
  /** Rendered in a tinted action bar under the body. */
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Card({
  title,
  description,
  icon,
  headerAside,
  footer,
  children,
  className,
}: CardProps) {
  const hasHeader = Boolean(title || icon);

  return (
    <section className={`${styles.card} ${className ?? ""}`}>
      {hasHeader && (
        <header className={styles.header}>
          {icon && (
            <span className={styles.iconTile}>
              <Icon name={icon} size={21} weight={500} />
            </span>
          )}
          <div className={styles.headingText}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {headerAside && <div className={styles.headerAside}>{headerAside}</div>}
        </header>
      )}

      {children && (
        <div className={`${styles.body} ${hasHeader ? styles.divided : ""}`}>
          {children}
        </div>
      )}

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
}
