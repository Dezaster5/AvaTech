import type { MetadataRoute } from "next";

// Карта сайта для поисковиков
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://avtch.io";
  const products = [
    "self-service-kiosk",
    "guest-mobile-app",
    "hr-tech-app",
    "mobile-pos",
    "qr-restaurant",
    "avatracker",
  ];
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...products.map((slug) => ({
      url: `${base}/products/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
