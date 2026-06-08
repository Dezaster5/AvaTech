import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/sections-v2/site-header";
import { SiteFooter } from "@/components/sections-v2/site-footer";
import { ProductGallery } from "@/components/sections-v2/product-gallery";
import { WhatItDoes } from "@/components/sections-v2/what-it-does";
import { ProductCta } from "@/components/sections-v2/product-cta";
import { getProduct, productSlugs } from "@/components/sections-v2/products-data";
import { JsonLd } from "@/components/sections-v2/json-ld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://avtch.io";

export function generateStaticParams() {
  return productSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  // Документный <title> = название (шаблон из layout добавит «— AvaTech»).
  // Для OG задаём полный заголовок с брендом явно (шаблон на OG не действует).
  const ogTitle = `${product.name} — AvaTech`;
  // tagline + subtitle = более полное описание (~120–160 символов) для сниппета
  const description = `${product.tagline} ${product.subtitle}`;
  const path = `/products/${slug}`;
  // своя OG-картинка продукта (фирменная карточка из public/og/)
  const ogImage = { url: `/og/${slug}.png`, width: 1200, height: 630, alt: ogTitle };
  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "AvaTech",
      locale: "ru_RU",
      url: path,
      title: ogTitle,
      description,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [ogImage.url] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const floats = product.features.slice(0, 4); // 4 ключевые фичи — булетами под мокапом

  // Лёгкое «парение» булетов со сдвигом фаз (разные duration/delay), чтобы
  // карточки в строке покачивались не синхронно — мягкая микроанимация.
  const floatAnim = [
    "float-soft 4.2s ease-in-out 0s infinite",
    "float-soft 5s ease-in-out 0.7s infinite",
    "float-soft 4.6s ease-in-out 1.1s infinite",
    "float-soft 5.3s ease-in-out 0.4s infinite",
  ];

  // Структурированные данные о продукте для поисковиков (Schema.org)
  const productLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.subtitle,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    url: `${SITE}/products/${slug}`,
    publisher: { "@type": "Organization", name: "AvaTech", url: SITE },
  };

  return (
    <>
      <JsonLd data={productLd} />
      <SiteHeader />
      <main className="flex-1">
        {/* ───────── Hero ───────── */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-0 -z-10 size-[36rem] rounded-full bg-brand/10 blur-3xl"
          />
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Все продукты
            </Link>

            <div className="mt-8 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Текст слева */}
              <div>
                <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
                  {product.tagline} {product.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {/* Якорь относительный — скроллит вниз к форме НА ЭТОЙ же
                      странице продукта (ProductCta, id="contact-form") */}
                  <a
                    href="#contact-form"
                    className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}
                  >
                    Оставить заявку
                  </a>
                  <Link
                    href="/#products"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-11 px-5 text-base",
                    )}
                  >
                    Вернуться к продуктам
                  </Link>
                </div>
              </div>

              {/* Мокап справа — крупный, по центру колонки */}
              <div className="flex justify-center">
                <Image
                  src={product.mockup.src}
                  alt={product.mockup.alt}
                  width={product.mockup.width}
                  height={product.mockup.height}
                  priority
                  sizes="(max-width: 1024px) 80vw, 440px"
                  /* max-w ограничивает широкие мокапы, max-h — высокие (телефоны),
                     object-contain сохраняет пропорции в этой «рамке» */
                  className="h-auto w-auto max-h-[360px] max-w-[300px] object-contain [filter:drop-shadow(0_24px_44px_rgba(17,25,38,0.16))] lg:max-h-[480px] lg:max-w-[440px]"
                />
              </div>
            </div>

            {/* Булеты-фичи — строкой во всю ширину hero под мокапом.
                2 колонки на мобилке, 4 на десктопе; лёгкое парение со сдвигом фаз.
                Иконка слева, текст по центру относительно неё (items-center). */}
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {floats.map((f, i) => (
                <li
                  key={f.title}
                  style={{ animation: floatAnim[i] }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                    <f.icon className="size-4.5 text-brand" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 text-sm font-medium leading-tight text-pretty">
                    {f.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Что делает (текст «проявляется» при скролле) ───────── */}
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <WhatItDoes
              text={product.whatItDoes}
              accent={product.whatItDoesAccent}
            />
          </div>
        </section>

        {/* ───────── Функции (2 колонки: заголовок | список) ───────── */}
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[11fr_9fr] lg:gap-16">
              {/* Левая колонка — заголовок, прилипает при скролле списка.
                 Колонки заданы как 11fr : 9fr = ровно 55% / 45% (заголовок шире). */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <Badge variant="outline" className="h-auto gap-2 px-3 py-1 text-sm">
                  <span className="size-1.5 rounded-full bg-brand" />
                  Возможности
                </Badge>
                <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
                  Функции, которые закрывают операционные задачи
                </h2>
              </div>

              {/* Правая колонка — функции списком (строка = иконка + текст).
                 Занимает вторую колонку 9fr = оставшиеся 45% ширины. */}
              <div>
                <ul className="flex flex-col">
                  {product.features.map((f) => (
                    <li
                      key={f.title}
                      className="group flex items-center gap-4 border-t border-border py-5 first:border-t-0 first:pt-0"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                        <f.icon
                          className="size-5 text-brand transition-transform duration-300 group-hover:scale-110"
                          strokeWidth={1.75}
                        />
                      </span>
                      <div>
                        <h3 className="font-semibold">{f.title}</h3>
                        {f.desc && (
                          <p className="mt-1 text-sm text-muted-foreground text-pretty">
                            {f.desc}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {product.integrations && (
                  <div className="mt-8 border-t border-border pt-8">
                    <h3 className="text-base font-semibold">Готовые подключения</h3>
                    <ul className="mt-4 flex flex-wrap gap-3">
                      {product.integrations.map((name) => (
                        <li
                          key={name}
                          className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Для кого подходит + Бизнес-эффект (единый блок) ─────────
            Сверху — сегменты аудитории иконками в ряд (кому подходит),
            ниже — панель результата со свечением (что это даёт). */}
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            {/* Часть 1 — аудитория: «кому подходит» */}
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
              Для кого подходит
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {product.audience.map((seg) => (
                <li
                  key={seg.label}
                  className="group flex flex-col items-start gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3.5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/5 sm:gap-4 sm:rounded-2xl sm:p-6"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-brand/10 transition-transform duration-300 group-hover:scale-110 sm:size-12 sm:rounded-xl">
                    <seg.icon className="size-4.5 text-brand sm:size-6" strokeWidth={1.75} />
                  </span>
                  <span className="text-sm font-medium leading-tight text-pretty sm:text-base sm:font-semibold sm:leading-snug">
                    {seg.label}
                  </span>
                </li>
              ))}
            </ul>

            {/* Часть 2 — результат: панель с мягким брендовым свечением */}
            <div className="relative mt-12 overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-brand/[0.05] to-transparent px-6 py-12 sm:px-10 sm:py-14">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
              />
              <div className="relative">
                <Badge variant="outline" className="h-auto gap-2 bg-card px-3 py-1 text-sm">
                  <span className="size-1.5 rounded-full bg-brand" />
                  Результат
                </Badge>
                <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
                  Бизнес-эффект
                </h2>

                <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {product.effects.map((e) =>
                    e.value ? (
                      // Карточка с цифрой: крупный градиентный показатель + подпись
                      <li
                        key={e.label}
                        className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10"
                      >
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                        />
                        <div className="relative bg-gradient-to-br from-brand to-[#4b74ff] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-[2.75rem]">
                          {e.value}
                        </div>
                        <div className="relative mt-2 text-sm text-muted-foreground text-pretty">
                          {e.label}
                        </div>
                      </li>
                    ) : (
                      // Карточка-преимущество: иконка-галочка в брендовом кружке
                      <li
                        key={e.label}
                        className="group rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10"
                      >
                        <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 transition-transform duration-300 group-hover:scale-110">
                          <Check className="size-5 text-brand" strokeWidth={2.5} />
                        </div>
                        <span className="mt-4 block text-base font-medium leading-snug text-pretty">
                          {e.label}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Интерфейсы (текст слева, галерея справа) ───────── */}
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              {/* Левая колонка — заголовок и описание */}
              <div className="lg:col-span-5">
                <Badge variant="outline" className="h-auto gap-2 px-3 py-1 text-sm">
                  <span className="size-1.5 rounded-full bg-brand" />
                  Интерфейсы
                </Badge>
                <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
                  Интерфейсы продукта
                </h2>
                <p className="mt-5 text-lg text-muted-foreground text-pretty">
                  Реальные экраны решения — посмотрите, как продукт выглядит и
                  работает на практике.
                </p>
              </div>
              {/* Правая колонка — галерея */}
              <div className="lg:col-span-7">
                <ProductGallery images={product.gallery} alt={product.mockup.alt} />
              </div>
            </div>
          </div>
        </section>

        {/* ───────── CTA (с реальной формой заявки) ───────── */}
        <ProductCta productName={product.name} />
      </main>
      <SiteFooter />
    </>
  );
}
