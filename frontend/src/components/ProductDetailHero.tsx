import { ArrowRight, BadgeCheck } from "lucide-react";

import type { Product } from "../data/products";
import styles from "../styles/ProductDetail.module.css";
import { Button } from "./ui/Button";

type ProductDetailHeroProps = {
  product: Product;
};

export function ProductDetailHero({ product }: ProductDetailHeroProps) {
  const { Icon } = product;

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroContent}>
          <div className={styles.productBadge}>
            <BadgeCheck size={17} />
            Продукт AvaTech
          </div>
          <div className={styles.titleRow}>
            <span className={styles.titleIcon} aria-hidden="true">
              <Icon size={28} strokeWidth={1.8} />
            </span>
            <h1>{product.title}</h1>
          </div>
          <p className={styles.tagline}>{product.tagline}</p>
          <p className={styles.shortDescription}>{product.shortDescription}</p>
          <div className={styles.heroActions}>
            <Button to="/#contact-form">
              Оставить заявку
              <ArrowRight size={18} />
            </Button>
            <Button to="/#products" variant="secondary">
              Вернуться к продуктам
            </Button>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label={`${product.title}: цифровая схема продукта`}>
          <div className={styles.visualOrbit} aria-hidden="true" />
          <div className={styles.visualPanel}>
            <div className={styles.visualTopbar}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.visualHeader}>
              <div className={styles.visualIcon} aria-hidden="true">
                <Icon size={28} strokeWidth={1.8} />
              </div>
              <div>
                <strong>{product.title}</strong>
                <p>{product.tagline}</p>
              </div>
            </div>
            <div className={styles.visualFlow}>
              {product.features.slice(0, 4).map((feature, index) => (
                <div className={styles.flowNode} key={feature}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
            <div className={styles.visualMetrics}>
              <div>
                <span>Focus</span>
                <strong>Operations</strong>
              </div>
              <div>
                <span>Mode</span>
                <strong>Scalable</strong>
              </div>
              <div>
                <span>Support</span>
                <strong>AvaTech</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
