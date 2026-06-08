import { Logo } from "@/components/logo";

const navLinks = [
  { label: "О компании", href: "#about" },
  { label: "Продукты", href: "#products" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Для кого", href: "#audience" },
  { label: "Контакты", href: "#contacts" },
  { label: "Нам доверяют", href: "#trusted" },
];

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          {/* Бренд */}
          <div className="max-w-sm">
            <Logo className="h-7 text-white" />
            <p className="mt-5 text-sm text-white/60 text-pretty">
              IT-компания из экосистемы Avatariya. Разрабатываем и внедряем
              цифровые продукты для бизнеса с потоком гостей: в сфере
              развлечений, общепита, ритейла и сервиса.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
              <span className="size-1.5 rounded-full bg-brand" />
              Astana Hub participant
            </span>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-sm font-semibold text-white/90">Навигация</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-white/60 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-sm font-semibold text-white/90">Контакты</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="tel:+77019712777"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  +7 701 971 27 77
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@avtch.io"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  info@avtch.io
                </a>
              </li>
              <li>
                <a
                  href="https://avtch.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  avtch.io
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 AvaTech. Все права защищены.</span>
          <span>Казахстан</span>
        </div>
      </div>
    </footer>
  );
}
