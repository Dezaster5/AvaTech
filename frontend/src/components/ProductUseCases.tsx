import { Building2, Sparkles } from "lucide-react";

import styles from "../styles/ProductDetail.module.css";

type ProductUseCasesProps = {
  audience: string[];
  businessValue: string[];
};

export function ProductUseCases({ audience, businessValue }: ProductUseCasesProps) {
  return (
    <section className={styles.block}>
      <div className={`container ${styles.splitGrid}`}>
        <div className={styles.infoPanel}>
          <div className={styles.panelIcon}>
            <Building2 size={24} />
          </div>
          <h2>Для кого подходит</h2>
          <ul>
            {audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={styles.infoPanel}>
          <div className={styles.panelIcon}>
            <Sparkles size={24} />
          </div>
          <h2>Бизнес-эффект</h2>
          <ul>
            {businessValue.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
