import { CheckCircle2 } from "lucide-react";

import styles from "../styles/ProductDetail.module.css";

type ProductBenefitsProps = {
  title: string;
  items: string[];
};

export function ProductBenefits({ title, items }: ProductBenefitsProps) {
  return (
    <section className={styles.block}>
      <div className="container">
        <div className={styles.blockHeader}>
          <span>Ключевые возможности</span>
          <h2>{title}</h2>
        </div>
        <div className={styles.cardGrid}>
          {items.map((item) => (
            <article className={styles.featureCard} key={item}>
              <CheckCircle2 size={22} />
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
