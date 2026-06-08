"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 6 типов клиентов. gradient — плейсхолдер фона, пока нет реальных картинок.
const audience = [
  {
    slug: "kids-parks",
    title: "Детские развлекательные парки",
    text: "Автоматизация касс, билетов, гостей и внутренних процессов.",
    gradient: "from-indigo-500 to-blue-700",
  },
  {
    slug: "family-parks",
    title: "Семейные парки",
    text: "Цифровой гостевой опыт и управление сервисом на площадке.",
    gradient: "from-sky-500 to-indigo-700",
  },
  {
    slug: "restaurants",
    title: "Рестораны и кафе",
    text: "QR-заказы, ускорение обслуживания и снижение ручной нагрузки.",
    gradient: "from-blue-500 to-cyan-700",
  },
  {
    slug: "networks",
    title: "Сети развлечений",
    text: "Единые продукты для нескольких локаций и централизованного управления.",
    gradient: "from-violet-500 to-blue-700",
  },
  {
    slug: "franchise",
    title: "Франчайзинговые партнёры",
    text: "Повторяемые процессы и технологическая база для запуска площадок.",
    gradient: "from-blue-600 to-indigo-800",
  },
  {
    slug: "sales",
    title: "Компании с операционными продажами",
    text: "Автоматизация продаж, персонала и взаимодействия с клиентами.",
    gradient: "from-cyan-500 to-blue-700",
  },
];

type Item = (typeof audience)[number];

// Карточка клиента: фон (пока градиент) + тёмный оверлей + заголовок;
// при наведении проявляются описание и кнопка «Связаться».
function AudienceCard({ item }: { item: Item }) {
  return (
    <article className="group relative h-[460px] w-[min(360px,calc(100vw-2rem))] shrink-0 snap-start overflow-hidden rounded-2xl sm:h-[520px]">
      {/* фоновое фото */}
      <Image
        src={`/audience-v2/${item.slug}.webp`}
        alt={item.title}
        fill
        quality={90}
        sizes="(max-width: 1024px) 360px, 400px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* затемняющий градиент снизу для читабельности */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      <div className="relative flex h-full flex-col justify-end p-5 text-white sm:p-6">
        <h3 className="text-xl font-semibold">{item.title}</h3>
        {/* описание + кнопка: схлопнуты по умолчанию, раскрываются на hover и выталкивают заголовок вверх */}
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:grid-rows-[1fr] group-hover:opacity-100">
          <div className="overflow-hidden">
            <p className="text-sm text-white/85 text-pretty">{item.text}</p>
            <a
              href="#contact-form"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-4 h-10 bg-white px-4 text-sm text-foreground hover:bg-white/90",
              )}
            >
              Связаться
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function Header() {
  return (
    <div className="mb-8 max-w-2xl">
      <Badge variant="outline" className="h-auto gap-2 px-3 py-1 text-sm">
        <span className="size-1.5 rounded-full bg-brand" />
        Для кого
      </Badge>
      <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
        Решения для бизнеса с потоком гостей
      </h2>
      <p className="mt-4 text-lg text-muted-foreground text-pretty">
        AvaTech помогает компаниям, которым нужна автоматизация продаж,
        персонала и цифрового взаимодействия с гостями.
      </p>
    </div>
  );
}

export function Audience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);

  // Дистанция прокрутки: сдвигаем ряд ровно настолько, чтобы правый край
  // последней карточки совпал с правым краем сетки (max-w-6xl).
  // Меряем при x=0 (секция вне вьюпорта на маунте): правый край сетки
  // симметричен левому краю первой карточки → innerWidth − first.left.
  useEffect(() => {
    const calc = () => {
      const track = trackRef.current;
      if (!track || track.children.length < 2) return;
      const first = track.children[0].getBoundingClientRect();
      const last = track.children[track.children.length - 1].getBoundingClientRect();
      const gridRight = window.innerWidth - first.left;
      setMaxX(Math.max(0, Math.round(last.right - gridRight)));
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", calc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  return (
    <section id="audience" className="border-t border-border/60">
      {/* Десктоп: pinned горизонтальный скролл */}
      <div
        ref={sectionRef}
        style={{ height: `calc(100vh + ${maxX}px)` }}
        className="relative hidden lg:block"
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-6">
            <Header />
          </div>
          <div className="overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex gap-6 px-6 [&>*:first-child]:ml-[max(0px,calc((100vw-72rem)/2))]"
            >
              {audience.map((item) => (
                <AudienceCard key={item.slug} item={item} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Мобильный/планшет: обычная горизонтальная прокрутка (свайп) */}
      <div className="lg:hidden">
        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
          <Header />
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-16 sm:px-6 sm:pb-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {audience.map((item) => (
            <AudienceCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
