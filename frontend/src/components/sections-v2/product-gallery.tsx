"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogPopup,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Карусель «Интерфейсы продукта»: главное изображение со стрелками и точками-
// индикаторами снизу. Клик по фото открывает лайтбокс (крупный просмотр с
// навигацией). active шарится между инлайн-слайдером и лайтбоксом.
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;
  const go = (delta: number) => setActive((prev) => (prev + delta + count) % count);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Главное изображение */}
      <div className="group relative h-[300px] w-full overflow-hidden rounded-2xl border border-border bg-card sm:h-[360px]">
        <Image
          src={images[active]}
          alt={alt}
          fill
          sizes="(max-width: 768px) 90vw, 640px"
          className="object-contain p-6"
        />

        {/* Прозрачная кнопка-оверлей: клик/Enter открывает лайтбокс */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Увеличить изображение"
          className="absolute inset-0 z-10 cursor-zoom-in"
        />

        {/* Подсказка «увеличить» — появляется на hover */}
        <span className="pointer-events-none absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition group-hover:opacity-100">
          <ZoomIn className="size-4" />
        </span>

        {/* Стрелки — только если изображений больше одного */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Предыдущее изображение"
              className="absolute left-3 top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Следующее изображение"
              className="absolute right-3 top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {/* Точки-индикаторы */}
      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((src, i) => (
            <button
              type="button"
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`Перейти к изображению ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "h-2 rounded-full transition-all",
                i === active ? "w-5 bg-brand" : "w-2 bg-border hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      )}

      {/* Лайтбокс — крупный просмотр поверх затемнённого фона */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPopup
            onKeyDown={(e) => {
              if (count < 2) return;
              if (e.key === "ArrowRight") go(1);
              if (e.key === "ArrowLeft") go(-1);
            }}
            // клик по пустому фону (не по картинке/кнопкам) закрывает
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none transition duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0"
          >
            <DialogTitle className="sr-only">{alt}</DialogTitle>
            <DialogDescription className="sr-only">
              Изображение {active + 1} из {count}
            </DialogDescription>

            {/* Обычный <img>: картинки галереи бывают разных пропорций
                (портрет/квадрат/landscape), поэтому не фиксируем width/height.
                Файлы webp лёгкие (≤~150КБ). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active]}
              alt={alt}
              className="h-auto max-h-[85vh] w-auto max-w-[90vw] object-contain"
            />

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Предыдущее изображение"
                  className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Следующее изображение"
                  className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                >
                  <ChevronRight className="size-5" />
                </button>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
                  {active + 1} / {count}
                </div>
              </>
            )}

            <DialogClose
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <X className="size-5" />
            </DialogClose>
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
