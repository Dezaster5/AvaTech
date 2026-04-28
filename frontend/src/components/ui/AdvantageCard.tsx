import type { LucideIcon } from "lucide-react";

import styles from "../../styles/ui.module.css";

type AdvantageCardProps = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

export function AdvantageCard({ title, description, Icon }: AdvantageCardProps) {
  return (
    <article className={styles.advantageCard}>
      <div className={styles.smallIcon} aria-hidden="true">
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}
