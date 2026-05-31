import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PRODUCT_IMAGE_FALLBACK } from "../data/products";
import type { Product } from "../data/products";
import styles from "../styles/ProductDetail.module.css";
import { ProductImage } from "./ProductImage";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  return (
    <section className={styles.gallerySection}>
      <div className="container">
        <div className={styles.blockHeader}>
          <span>Галерея</span>
          <h2>Интерфейсы и визуальные материалы продукта</h2>
        </div>
        <GalleryCarousel images={product.gallery} title={product.title} />
        {product.galleryGroups?.map((group) => (
          <div className={styles.galleryGroup} key={group.title}>
            <div className={styles.galleryGroupHeader}>
              <span>Дополнительный сценарий</span>
              <h3>{group.title}</h3>
              {group.description ? <p>{group.description}</p> : null}
            </div>
            <GalleryCarousel images={group.images} title={`${product.title}: ${group.title}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

type GalleryCarouselProps = {
  images: string[];
  title: string;
};

function GalleryCarousel({ images, title }: GalleryCarouselProps) {
  const safeImages = useMemo(() => (images.length > 0 ? images : [PRODUCT_IMAGE_FALLBACK]), [images]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setSelectedIndex(0);
    setZoom(1);
  }, [safeImages]);

  const selectedImage = safeImages[selectedIndex] || safeImages[0];

  const showPrevious = () => {
    setSelectedIndex((current) => (current === 0 ? safeImages.length - 1 : current - 1));
    setZoom(1);
  };

  const showNext = () => {
    setSelectedIndex((current) => (current === safeImages.length - 1 ? 0 : current + 1));
    setZoom(1);
  };

  const showImage = (index: number) => {
    setSelectedIndex(index);
    setZoom(1);
  };

  const openLightbox = () => {
    setZoom(1);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setZoom(1);
    setIsLightboxOpen(false);
  };

  const zoomOut = () => {
    setZoom((current) => Math.max(0.75, Math.round((current - 0.25) * 100) / 100));
  };

  const zoomIn = () => {
    setZoom((current) => Math.min(3, Math.round((current + 0.25) * 100) / 100));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "+" || event.key === "=") zoomIn();
      if (event.key === "-") zoomOut();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, safeImages.length]);

  return (
    <>
      <div className={styles.carousel}>
        <button
          className={`${styles.carouselButton} ${styles.carouselButtonPrev}`}
          type="button"
          onClick={showPrevious}
          aria-label="Показать предыдущее изображение"
        >
          <ChevronLeft size={26} />
        </button>
        <div className={styles.galleryPreview}>
          <button
            className={styles.galleryImageButton}
            type="button"
            onClick={openLightbox}
            aria-label={`Открыть изображение ${title} на весь экран`}
          >
            <span className={styles.galleryImageFrame}>
              <ProductImage
                className={styles.galleryImage}
                src={selectedImage}
                alt={`${title}: выбранное изображение`}
              />
            </span>
          </button>
        </div>
        <button
          className={`${styles.carouselButton} ${styles.carouselButtonNext}`}
          type="button"
          onClick={showNext}
          aria-label="Показать следующее изображение"
        >
          <ChevronRight size={26} />
        </button>
      </div>
      <div className={styles.galleryDots} aria-label={`Навигация галереи ${title}`}>
        {safeImages.map((image, index) => (
          <button
            className={`${styles.galleryDot} ${selectedIndex === index ? styles.activeDot : ""}`}
            key={`${image}-${index}`}
            type="button"
            onClick={() => showImage(index)}
            aria-label={`Показать изображение ${index + 1}: ${title}`}
          />
        ))}
      </div>

      {isLightboxOpen ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Просмотр галереи ${title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
        >
          <div className={styles.lightboxTopbar}>
            <span>{title}</span>
            <div className={styles.zoomControls} aria-label="Масштаб изображения">
              <button type="button" onClick={zoomOut} aria-label="Уменьшить изображение">
                <ZoomOut size={18} />
              </button>
              <strong>{Math.round(zoom * 100)}%</strong>
              <button type="button" onClick={zoomIn} aria-label="Увеличить изображение">
                <ZoomIn size={18} />
              </button>
              <button type="button" onClick={resetZoom} aria-label="Вернуть масштаб">
                <RotateCcw size={17} />
              </button>
            </div>
          </div>
          <button
            className={styles.lightboxClose}
            type="button"
            onClick={closeLightbox}
            aria-label="Закрыть полноэкранный просмотр"
          >
            <X size={24} />
          </button>
          <button
            className={`${styles.lightboxButton} ${styles.lightboxPrev}`}
            type="button"
            onClick={showPrevious}
            aria-label="Предыдущее изображение"
          >
            <ChevronLeft size={30} />
          </button>
          <div className={styles.lightboxViewport}>
            <div
              className={styles.lightboxImageStage}
              style={{
                width: `${zoom * 100}%`,
                height: `${zoom * 100}%`
              }}
            >
              <ProductImage
                className={styles.lightboxImage}
                src={selectedImage}
                alt={`${title}: изображение ${selectedIndex + 1}`}
              />
            </div>
            <span className={styles.lightboxCounter}>
              {selectedIndex + 1} / {safeImages.length}
            </span>
          </div>
          <button
            className={`${styles.lightboxButton} ${styles.lightboxNext}`}
            type="button"
            onClick={showNext}
            aria-label="Следующее изображение"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      ) : null}
    </>
  );
}
