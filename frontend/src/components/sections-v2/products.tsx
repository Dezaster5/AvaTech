import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Базовые классы плитки-карточки.
const tile =
  "group flex overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5";

// Стрелка в углу карточки — появляется при наведении.
function CardArrow() {
  return (
    <ArrowUpRight
      aria-hidden
      className="absolute right-5 top-5 z-20 size-5 text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    />
  );
}

export function Products() {
  return (
    <section id="products" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Шапка: бейдж сверху; ниже 2 колонки — заголовок | описание (по центру заголовка) */}
        <div>
          <Badge variant="outline" className="h-auto gap-2 px-3 py-1 text-sm">
            <span className="size-1.5 rounded-full bg-brand" />
            Продукты
          </Badge>
          <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-12">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
              Готовые продукты под ключевые процессы бизнеса
            </h2>
            {/* описание по центру относительно заголовка */}
            <p className="text-lg text-muted-foreground text-pretty">
              Продажи, гостевой опыт, ресторан, сотрудники{" "}
              {/* перенос только на десктопе; на мобиле текст переносится сам */}
              <br className="hidden lg:inline" />и учёт времени — в одной
              экосистеме.
            </p>
          </div>
        </div>

        {/* Бенто-сетка */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:mt-14 lg:grid-cols-12">
          {/* 1. Мобильное приложение — высокая плитка: текст сверху, мокап снизу */}
          <Link href="/products/guest-mobile-app" className={cn(tile, "relative flex-col lg:col-span-4 lg:row-span-2")}>
            <CardArrow />
            {/* фон на всю карточку */}
            <Image
              src="/products/bg-for-mobile-app.png"
              alt=""
              fill
              aria-hidden
              sizes="(max-width: 1024px) 100vw, 360px"
              className="object-cover [filter:hue-rotate(-45deg)] transition-transform duration-700 group-hover:scale-105"
            />
            {/* белый градиент сверху, уходящий в прозрачность — мягкий переход к фону */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-white from-[18%] to-transparent to-[85%]"
            />
            {/* контент поверх */}
            <div className="relative z-10 p-6">
              <h3 className="text-lg font-semibold">
                Мобильное приложение для гостей
              </h3>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                Лояльность, билеты, бронирование кабинок и связь с гостем.
              </p>
            </div>
            <div className="relative z-10 flex flex-1 items-start justify-center px-3 pt-2">
              <Image
                src="/products/mobile-app.png"
                alt="Мобильное приложение AvaTech для гостей"
                width={640}
                height={1185}
                sizes="320px"
                className="w-[300px] [filter:drop-shadow(0_18px_32px_rgba(17,25,38,0.13))] transition-transform duration-500 group-hover:-translate-y-1"
              />
            </div>
          </Link>

          {/* 2. HR Tech — широкая: текст слева, мокап справа */}
          <Link href="/products/hr-tech-app" className={cn(tile, "relative flex-col sm:flex-row lg:col-span-8")}>
            <CardArrow />
            {/* фон на всю плитку */}
            <Image
              src="/products/bg-for-hr-tech2.png"
              alt=""
              fill
              aria-hidden
              sizes="(max-width: 1024px) 100vw, 760px"
              className="object-cover [filter:hue-rotate(-45deg)] transition-transform duration-700 group-hover:scale-105"
            />
            {/* белый градиент слева, уходящий в прозрачность вправо */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-white from-[38%] to-transparent to-[88%]"
            />
            {/* текст слева */}
            <div className="relative z-10 p-6 sm:max-w-[16rem] sm:self-start">
              <h3 className="text-lg font-semibold">HR Tech-приложение</h3>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                Онбординг, обучение, задачи и аналитика по сотрудникам.
              </p>
            </div>
            {/* мокап справа */}
            <div className="relative z-10 flex flex-1 items-center justify-center p-6 sm:pl-0">
              <Image
                src="/products/hr-tech.png"
                alt="HR Tech-приложение AvaTech: вход в систему Avatariya"
                width={1448}
                height={1086}
                sizes="(max-width: 1024px) 90vw, 460px"
                className="w-full max-w-sm [filter:drop-shadow(0_18px_32px_rgba(17,25,38,0.13))] transition-transform duration-500 group-hover:-translate-y-1"
              />
            </div>
          </Link>

          {/* 3. QR-ресторан — текст сверху, телефон снизу */}
          <Link href="/products/qr-restaurant" className={cn(tile, "relative flex-col lg:col-span-4")}>
            <CardArrow />
            <Image
              src="/products/bg-for-qr-menu.png"
              alt=""
              fill
              aria-hidden
              sizes="(max-width: 1024px) 100vw, 360px"
              className="object-cover [filter:hue-rotate(-45deg)] transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-white from-[22%] to-transparent to-[88%]"
            />
            <div className="relative z-10 p-6">
              <h3 className="text-lg font-semibold">QR-ресторан</h3>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                Заказ блюд по QR без официанта. Интеграции с Kaspi и iiko.
              </p>
            </div>
            <div className="relative z-10 flex flex-1 items-end justify-center px-6 pt-2 pb-5">
              <Image
                src="/products/qr-menu.png"
                alt="QR-меню AvaTech: заказ блюд по QR-коду"
                width={586}
                height={1184}
                sizes="140px"
                className="w-[128px] [filter:drop-shadow(0_18px_32px_rgba(17,25,38,0.13))] transition-transform duration-500 group-hover:-translate-y-1"
              />
            </div>
          </Link>

          {/* 4. Касса самообслуживания — текст сверху, киоск снизу */}
          <Link href="/products/self-service-kiosk" className={cn(tile, "relative flex-col lg:col-span-4")}>
            <CardArrow />
            <Image
              src="/products/bg-for-kassa.png"
              alt=""
              fill
              aria-hidden
              sizes="(max-width: 1024px) 100vw, 360px"
              className="object-cover [filter:hue-rotate(-45deg)] transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-white from-[22%] to-transparent to-[88%]"
            />
            <div className="relative z-10 p-6">
              <h3 className="text-lg font-semibold">Касса самообслуживания</h3>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                Гости оформляют покупки и билеты сами, без очереди к кассиру.
              </p>
            </div>
            <div className="relative z-10 flex flex-1 items-end justify-center px-6 pt-2 pb-5">
              <Image
                src="/products/kassa1.png"
                alt="Касса самообслуживания AvaTech: самостоятельная покупка"
                width={714}
                height={1282}
                sizes="150px"
                className="w-[138px] [filter:drop-shadow(0_18px_32px_rgba(17,25,38,0.13))] transition-transform duration-500 group-hover:-translate-y-1"
              />
            </div>
          </Link>

          {/* 5. AvaTracker — широкая: текст слева, монитор справа */}
          <Link href="/products/avatracker" className={cn(tile, "relative flex-col sm:flex-row lg:col-span-8")}>
            <CardArrow />
            <Image
              src="/products/bg-for-avatrack.png"
              alt=""
              fill
              aria-hidden
              sizes="(max-width: 1024px) 100vw, 760px"
              className="object-cover [filter:hue-rotate(-45deg)] transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-white from-[38%] to-transparent to-[88%]"
            />
            <div className="relative z-10 p-6 sm:max-w-[16rem] sm:self-start">
              <h3 className="text-lg font-semibold">AvaTracker</h3>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                Учёт рабочего времени и трекинг смен сотрудников.
              </p>
            </div>
            <div className="relative z-10 flex flex-1 items-center justify-center p-6 sm:pl-0">
              <Image
                src="/products/avatrack.png"
                alt="AvaTracker AvaTech: просмотр отметок сотрудников"
                width={1088}
                height={972}
                sizes="(max-width: 1024px) 90vw, 460px"
                className="w-full max-w-sm [filter:drop-shadow(0_18px_32px_rgba(17,25,38,0.13))] transition-transform duration-500 group-hover:-translate-y-1"
              />
            </div>
          </Link>

          {/* 6. Мобильная касса — текст сверху, устройство снизу */}
          <Link href="/products/mobile-pos" className={cn(tile, "relative flex-col lg:col-span-4")}>
            <CardArrow />
            <Image
              src="/products/bg-for-self-kassa.png"
              alt=""
              fill
              aria-hidden
              sizes="(max-width: 1024px) 100vw, 360px"
              className="object-cover [filter:hue-rotate(-45deg)] transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-white from-[22%] to-transparent to-[88%]"
            />
            <div className="relative z-10 p-6">
              <h3 className="text-lg font-semibold">Мобильная касса</h3>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                Продажа билетов и услуг с телефона в любой точке зала.
              </p>
            </div>
            <div className="relative z-10 flex flex-1 items-end justify-center px-6 pt-2 pb-5">
              <Image
                src="/products/self-kassa.png"
                alt="Мобильная касса AvaTech: продажа билетов"
                width={834}
                height={1182}
                sizes="190px"
                className="w-[180px] [filter:drop-shadow(0_18px_32px_rgba(17,25,38,0.13))] transition-transform duration-500 group-hover:-translate-y-1"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
