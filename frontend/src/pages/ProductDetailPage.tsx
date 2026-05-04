import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { ProductBenefits } from "../components/ProductBenefits";
import { ProductCTA } from "../components/ProductCTA";
import { ProductDetailHero } from "../components/ProductDetailHero";
import { ProductGallery } from "../components/ProductGallery";
import { ProductUseCases } from "../components/ProductUseCases";
import { getProductBySlug } from "../data/products";
import styles from "../styles/ProductDetail.module.css";
import { Button } from "../components/ui/Button";

const NOT_FOUND_TITLE = "Продукт не найден | AvaTech";
const NOT_FOUND_DESCRIPTION = "Запрошенный продукт AvaTech не найден. Вернитесь к списку продуктов на главной странице.";

function setMetaDescription(content: string) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (meta) {
    meta.content = content;
  }
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  useEffect(() => {
    document.title = product?.seoTitle || NOT_FOUND_TITLE;
    setMetaDescription(product?.seoDescription || NOT_FOUND_DESCRIPTION);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);

  if (!product) {
    return (
      <main className={styles.notFoundPage}>
        <div className={`container ${styles.notFoundBox}`}>
          <span>404</span>
          <h1>Продукт не найден</h1>
          <p>Возможно, страница была перемещена или адрес указан с ошибкой.</p>
          <Button to="/#products">
            <ArrowLeft size={18} />
            Вернуться к продуктам
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <ProductDetailHero product={product} />

      <section className={styles.descriptionSection}>
        <div className={`container ${styles.descriptionGrid}`}>
          <div>
            <span>Описание продукта</span>
            <h2>Что делает {product.title}</h2>
          </div>
          <p>{product.description}</p>
        </div>
      </section>

      <ProductBenefits title="Функции, которые закрывают операционные задачи" items={product.features} />
      <ProductUseCases audience={product.audience} businessValue={product.businessValue} />
      <ProductGallery product={product} />
      <ProductCTA />
    </main>
  );
}
