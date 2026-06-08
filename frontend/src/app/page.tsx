import type { Metadata } from "next";
import { SiteHeader } from "@/components/sections-v2/site-header";
import { Hero } from "@/components/sections-v2/hero";
import { About } from "@/components/sections-v2/about";
import { Team } from "@/components/sections-v2/team";
import { Products } from "@/components/sections-v2/products";
import { Advantages } from "@/components/sections-v2/advantages";
import { Audience } from "@/components/sections-v2/audience";
import { Contact } from "@/components/sections-v2/contact";
import { TrustedBy } from "@/components/sections-v2/trusted-by";
import { SiteFooter } from "@/components/sections-v2/site-footer";
import { HashScroll } from "@/components/sections-v2/hash-scroll";
import { JsonLd } from "@/components/sections-v2/json-ld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://avtch.io";

// Структурированные данные об организации для поисковиков (Schema.org)
const ORG_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AvaTech",
  url: SITE,
  logo: `${SITE}/apple-icon.png`,
  description:
    "IT-продукты для автоматизации продаж, персонала и гостевого опыта в бизнесе с потоком гостей.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+7 701 971 27 77",
    email: "info@avtch.io",
    contactType: "sales",
    areaServed: "KZ",
    availableLanguage: ["ru"],
  },
  address: { "@type": "PostalAddress", addressCountry: "KZ" },
};

// SEO для V2 — переопределяет корневую metadata из layout.tsx (новое, широкое позиционирование)
// metadataBase наследуется из layout; og:image берётся из v2/opengraph-image.png автоматически
const V2_TITLE = "AvaTech — цифровая платформа для бизнеса с потоком гостей";
const V2_DESC =
  "Автоматизируем продажи, персонал и гостевой опыт для бизнеса в сфере развлечений, общепита, ритейла и сервиса. IT-продукты на основе опыта реальных парков Avatariya.";

export const metadata: Metadata = {
  // absolute — заголовок уже содержит «AvaTech», шаблон из layout не нужен
  title: { absolute: V2_TITLE },
  description: V2_DESC,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "AvaTech",
    locale: "ru_RU",
    url: "/",
    title: V2_TITLE,
    description: V2_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: V2_TITLE,
    description: V2_DESC,
  },
};

export default function HomeV2() {
  return (
    <>
      <JsonLd data={ORG_LD} />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <About />
        <Team />
        <Products />
        <Advantages />
        <Audience />
        <Contact />
        <TrustedBy />
      </main>
      <SiteFooter />
      <HashScroll />
    </>
  );
}
