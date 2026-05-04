import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Product } from "../data/products";
import styles from "../styles/ui.module.css";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { Icon } = product;

  return (
    <Link
      className={styles.productCard}
      to={`/products/${product.slug}`}
      aria-label={`Открыть страницу продукта: ${product.title}`}
    >
      <div className={styles.cardTopline} />
      <div className={styles.iconBox} aria-hidden="true">
        <Icon size={24} strokeWidth={1.8} />
      </div>
      <div>
        <h3>{product.title}</h3>
        <p>{product.shortDescription}</p>
      </div>
      <span className={styles.cardArrow} aria-hidden="true">
        <ArrowUpRight size={18} />
      </span>
    </Link>
  );
}
