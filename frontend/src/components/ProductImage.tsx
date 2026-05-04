import { useEffect, useState } from "react";

import { PRODUCT_IMAGE_FALLBACK } from "../data/products";

const EMBEDDED_FALLBACK =
  "data:image/svg+xml,%3Csvg width='1200' height='760' viewBox='0 0 1200 760' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1200' height='760' fill='%2308111F'/%3E%3Cpath d='M0 520H1200M240 0V760M840 0V760' stroke='%231D3354' stroke-width='2'/%3E%3Crect x='410' y='250' width='380' height='170' rx='24' fill='%230D1A2D' stroke='%23244066' stroke-width='2'/%3E%3Ctext x='600' y='335' text-anchor='middle' fill='%23F8FBFF' font-family='Arial,sans-serif' font-size='42' font-weight='700'%3EAvaTech%3C/text%3E%3Ctext x='600' y='382' text-anchor='middle' fill='%239CEFFF' font-family='Arial,sans-serif' font-size='22'%3EProduct preview%3C/text%3E%3C/svg%3E";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || PRODUCT_IMAGE_FALLBACK);

  useEffect(() => {
    setCurrentSrc(src || PRODUCT_IMAGE_FALLBACK);
  }, [src]);

  return (
    <img
      className={className}
      src={currentSrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        setCurrentSrc((value) => {
          if (value === EMBEDDED_FALLBACK) return value;
          return value === PRODUCT_IMAGE_FALLBACK ? EMBEDDED_FALLBACK : PRODUCT_IMAGE_FALLBACK;
        });
      }}
    />
  );
}
