"use client";

import Link from "next/link";
import { Phone, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Пункты меню. Абсолютные ссылки на секции лендинга — работают и со страниц продуктов.
const navItems = [
  { label: "Главная", href: "/" },
  { label: "Продукты", href: "/#products" },
  { label: "Преимущества", href: "/#advantages" },
  { label: "Для кого", href: "/#audience" },
  { label: "Контакты", href: "/#contacts" },
];

const PHONE = "+7 701 971 27 77";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Логотип AvaTech */}
        <Link href="/" aria-label="AvaTech — на главную" className="text-foreground">
          <Logo className="h-6" />
        </Link>

        {/* Навигация — скрыта на мобильных, видна с md */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Правый блок: телефон + кнопка + бургер */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+77019712777"
            className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
          >
            <Phone className="size-4" aria-hidden="true" />
            {PHONE}
          </a>
          {/* Ссылка, стилизованная как кнопка (Base UI Button не умеет asChild).
              Якорь ОТНОСИТЕЛЬНЫЙ (#contact-form): на лендинге ведёт к форме
              лендинга, на странице продукта — к её собственной форме (тот же id). */}
          <a href="#contact-form" className={cn(buttonVariants({ size: "lg" }), "h-9 px-4")}>
            Связаться
          </a>

          {/* Бургер-меню — только на мобильных (<md). Открывает боковую шторку */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label="Открыть меню"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetHeader className="border-b border-border/60">
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>

              {/* Ссылки. SheetClose закрывает шторку при переходе по ссылке */}
              <nav className="flex flex-col px-4">
                {navItems.map((item) => (
                  <SheetClose
                    key={item.href}
                    nativeButton={false}
                    render={
                      <Link
                        href={item.href}
                        className="border-b border-border/60 py-3.5 text-base font-medium text-foreground transition-colors last:border-b-0 hover:text-brand"
                      />
                    }
                  >
                    {item.label}
                  </SheetClose>
                ))}
              </nav>

              {/* Телефон внизу шторки */}
              <a
                href="tel:+77019712777"
                className="mx-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="size-4" aria-hidden="true" />
                {PHONE}
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
