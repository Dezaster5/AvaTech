import type { MetadataRoute } from "next";

// robots.txt — разрешаем индексацию, указываем карту сайта
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://avtch.io";

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
