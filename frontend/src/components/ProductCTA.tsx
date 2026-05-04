import { ArrowRight } from "lucide-react";

import styles from "../styles/ProductDetail.module.css";
import { Button } from "./ui/Button";

export function ProductCTA() {
  return (
    <section className={styles.ctaSection}>
      <div className={`container ${styles.ctaBox}`}>
        <div>
          <span>Внедрение AvaTech</span>
          <h2>Хотите внедрить это решение в своём бизнесе?</h2>
          <p>Оставьте заявку — команда AvaTech свяжется с вами и обсудит задачу.</p>
        </div>
        <Button to="/#contact-form">
          Оставить заявку
          <ArrowRight size={18} />
        </Button>
      </div>
    </section>
  );
}
