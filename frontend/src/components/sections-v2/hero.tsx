import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Фоновая атмосфера: мягкое синее свечение сверху + еле заметная сетка, которая растворяется */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(55%_60%_at_50%_-10%,rgb(8_67_253/0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(18_25_38/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(18_25_38/0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black,transparent_78%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        {/* Строка доверия вместо карусели логотипов. fill-mode-both = блок скрыт до старта анимации */}
        <div className="mb-10 flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500">
          <span className="inline-block size-1.5 rounded-full bg-brand" />
          Участник Astana Hub · экосистема Avatariya
        </div>

        {/* Заголовок на всю ширину — чтобы влезал крупным шрифтом в 2 строки */}
        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 delay-100 sm:text-5xl">
          Автоматизируем продажи,
          <br />
          персонал и <span className="text-brand">гостевой опыт</span>
        </h1>

        {/* Под заголовком: слева описание, справа кнопки в ряд */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 delay-150">
            <p className="max-w-xl text-lg text-muted-foreground text-pretty">
              IT-продукты для бизнеса с потоком гостей — на основе опыта
              реальных парков Avatariya.
            </p>
          </div>

          {/* Кнопки (прижаты к низу и вправо) */}
          <div className="lg:col-span-5 flex flex-wrap items-center gap-3 lg:justify-end animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 delay-200">
            <a
              href="#products"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}
            >
              Посмотреть продукты
            </a>
            <a
              href="#contact-form"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-5 text-base",
              )}
            >
              Связаться
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        {/* Визуал: реальный интерфейс продуктов AvaTech в парке развлечений */}
        <div className="relative mt-14 md:mt-20 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-1000 delay-300">
          {/* Мягкое фирменное свечение, чтобы кадр «парил» над страницей */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -top-10 -bottom-6 -z-10 rounded-[2.5rem] bg-brand/15 blur-3xl"
          />
          {/* Десктоп/планшет: широкий составной кадр (парк + устройства) */}
          <div className="hidden overflow-hidden rounded-2xl border border-border [filter:drop-shadow(0_18px_32px_rgba(17,25,38,0.13))] transition-all duration-500 hover:-translate-y-1 sm:block">
            <Image
              src="/hero/hero-visual.png"
              alt="Интерфейс приложения и сервисов AvaTech"
              width={1672}
              height={941}
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="h-auto w-full"
            />
          </div>

          {/* Мобильный: вертикальный скриншот приложения в рамке-устройстве (читаемо) */}
          <div className="mx-auto max-w-[260px] overflow-hidden rounded-[2.25rem] border-[6px] border-foreground [filter:drop-shadow(0_18px_32px_rgba(17,25,38,0.13))] sm:hidden">
            <Image
              src="/hero/app-phone.png"
              alt="Мобильное приложение AvaTech для гостей"
              width={390}
              height={812}
              priority
              sizes="260px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
