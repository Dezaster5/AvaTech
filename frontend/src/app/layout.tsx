import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Единый шрифт сайта. Подключаем кириллицу — сайт на русском.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Корневые (fallback) метаданные. Конкретные страницы (главная, продукты)
// их переопределяют. Позиционирование — актуальное V2 («бизнес с потоком гостей»).
// metadataBase нужен, чтобы og:image и canonical отдавались абсолютными URL.
const SITE_TITLE = "AvaTech — IT-платформа для бизнеса с потоком гостей";
const SITE_DESC =
  "Автоматизируем продажи, персонал и гостевой опыт для бизнеса в сфере развлечений, общепита, ритейла и сервиса. IT-продукты на основе опыта реальных парков Avatariya.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://avtch.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // template добавляет «— AvaTech» к заголовкам дочерних страниц,
  // которые задают только свою часть (default — для страниц без своего title)
  title: { default: SITE_TITLE, template: "%s — AvaTech" },
  description: SITE_DESC,
  // og:image / twitter:image подхватываются автоматически из opengraph-image.png / twitter-image.png
  openGraph: {
    type: "website",
    siteName: "AvaTech",
    locale: "ru_RU",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
};

// theme-color — цвет адресной строки браузера на мобильных (фон сайта)
export const viewport: Viewport = {
  themeColor: "#FBFBFB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={cn("h-full antialiased font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
