import { products } from "../data/products";
import styles from "../styles/sections.module.css";
import { ProductCard } from "./ProductCard";
import { SectionTitle } from "./ui/SectionTitle";

export function Products() {
  return (
    <section id="products" className="section">
      <div className="container">
        <div className={styles.sectionHeadRow}>
          <SectionTitle
            eyebrow="Наши продукты"
            title="Готовые решения с возможностью адаптации под бизнес"
            description="Продукты AvaTech закрывают ключевые процессы парка: продажи, гостевой опыт, ресторан, сотрудников и учёт рабочего времени."
          />
        </div>
        <div className={styles.productGrid}>
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
