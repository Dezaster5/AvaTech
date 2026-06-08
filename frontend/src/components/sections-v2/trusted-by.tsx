import Image from "next/image";
import { Badge } from "@/components/ui/badge";

// Партнёры (своя экосистема) — логотип + ссылка на сайт.
const partners = [
  {
    name: "Avatariya",
    logo: "/partners/avatariya.png",
    href: "https://avatariya.com/",
    width: 469,
    height: 241,
    // Логотип Avatariya «легче» по форме — делаем чуть крупнее, чтобы смотрелся вровень с Korzinka
    logoClassName: "h-12",
  },
  {
    name: "Вкусная корзинка",
    logo: "/partners/vkussnaya-korzinka.png",
    href: "https://www.vkorzinka.kz/",
    width: 1200,
    height: 327,
    logoClassName: "h-10",
  },
];

export function TrustedBy() {
  return (
    <section id="trusted" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:py-28">
        {/* Бейдж — вынесен наверх, над сплитом */}
        <Badge variant="outline" className="h-auto gap-2 px-3 py-1 text-sm">
          <span className="size-1.5 rounded-full bg-brand" />
          Нам доверяют
        </Badge>

        {/* Сплит: слева заголовок+описание, справа логотипы — выровнены по тексту */}
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Левая колонка — заголовок и описание */}
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
              Компании, для которых важны цифровые процессы
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              AvaTech развивает продукты на базе практического опыта Avatariya и
              задач бизнеса в сфере развлечений и сервиса.
            </p>
          </div>

          {/* Правая колонка — логотипы партнёров в 2 ряда, кликабельны */}
          <div className="relative flex flex-col items-center gap-5">
            {/* Фон-атмосфера: деликатное синее свечение за логотипами (как в hero) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl"
            />
            {partners.map((partner, i) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${partner.name} — перейти на сайт`}
                style={{ animationDelay: `${i * 120}ms` }}
                className="group flex h-20 w-full max-w-72 items-center justify-center rounded-2xl px-8 transition duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-both hover:-translate-y-0.5 hover:bg-white hover:shadow-xl hover:shadow-black/5 sm:px-10"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  className={`${partner.logoClassName} w-auto object-contain`}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
