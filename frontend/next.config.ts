import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // В Next 16 по умолчанию разрешено только качество 75.
    // Добавляем 90 и 100, чтобы фото отдавались чётче.
    qualities: [75, 90, 100],
  },
  // Редизайн V2 переехал в КОРЕНЬ (чистые URL «/», «/products/...»).
  // Старый лендинг заархивирован в src/app/_legacy/ (Next не маршрутизирует
  // папки с «_»). Обратные редиректы со старого пути «/v2» оставлены,
  // чтобы ранее расшаренные ссылки на прототип не ломались.
  async redirects() {
    return [
      { source: "/v2", destination: "/", permanent: false },
      { source: "/v2/:path*", destination: "/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
