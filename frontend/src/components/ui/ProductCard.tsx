import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import styles from "../../styles/ui.module.css";

type ProductCardProps = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

export function ProductCard({ title, description, Icon }: ProductCardProps) {
  return (
    <article className={styles.productCard}>
      <div className={styles.cardTopline} />
      <div className={styles.iconBox} aria-hidden="true">
        <Icon size={24} strokeWidth={1.8} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <span className={styles.cardArrow} aria-hidden="true">
        <ArrowUpRight size={18} />
      </span>
    </article>
  );
}
