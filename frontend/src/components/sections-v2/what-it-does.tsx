"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Badge } from "@/components/ui/badge";

// Цвета перехода при скролле.
// Обычные слова: приглушённый серый → navy (foreground).
// Акцентная фраза: светло-синий → фирменный синий (brand).
const GRAY = "#c4c9d2";
const DARK = "#121926";
const BLUE_LIGHT = "#a9bcfd";
const BLUE = "#0843fd";

// Одно слово. Его цвет интерполируется по «своему» отрезку общего прогресса
// скролла — поэтому слова «загораются» по очереди, слева направо.
function Word({
  children,
  range,
  progress,
  accent,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
  accent: boolean;
}) {
  const color = useTransform(
    progress,
    range,
    accent ? [BLUE_LIGHT, BLUE] : [GRAY, DARK],
  );
  return (
    <motion.span style={{ color }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

export function WhatItDoes({ text, accent }: { text: string; accent?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  // Окно привязано к ЦЕНТРУ абзаца относительно экрана и симметрично вокруг
  // его середины (0.5) — поэтому покраска идёт, пока блок проходит ровно через
  // центр экрана, и понятно, где «срабатывает»:
  //  • старт  — центр абзаца в нижней части экрана (0.85), блок подходит к центру;
  //  • финиш  — центр абзаца в верхней части (0.15), блок уже прошёл центр.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center 0.85", "center 0.15"],
  });

  // Разбиваем текст на слова, запоминая позицию каждого в строке —
  // чтобы понять, какие слова попадают в акцентную фразу (по пересечению).
  const tokens: { word: string; start: number; end: number }[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    tokens.push({ word: m[0], start: m.index, end: m.index + m[0].length });
  }

  const aStart = accent ? text.indexOf(accent) : -1;
  const aEnd = aStart >= 0 ? aStart + (accent as string).length : -1;
  const isAccent = (t: { start: number; end: number }) =>
    aStart >= 0 && t.start < aEnd && t.end > aStart;

  return (
    // Блок центрируем по странице (mx-auto), колонка текста широкая (max-w-5xl).
    // На мобилке текст по левому краю, с sm+ — по центру.
    <div className="mx-auto max-w-5xl text-left sm:text-center">
      <Badge variant="outline" className="h-auto gap-2 px-3 py-1 text-sm">
        <span className="size-1.5 rounded-full bg-brand" />
        Что делает
      </Badge>
      <p
        ref={ref}
        className="mt-6 text-pretty text-[1.75rem] font-medium leading-[1.3] tracking-tight sm:text-4xl sm:leading-[1.25] lg:text-[2.75rem] lg:leading-[1.2]"
      >
        {tokens.map((t, i) => {
          // reveal — доля прогресса на переход ОДНОГО слова. Больше значение =
          // дольше и плавнее меняется цвет, переходы соседних слов перекрываются
          // (идёт мягкая «волна», а не резкие щелчки).
          const reveal = 0.22;
          const start = (i / tokens.length) * (1 - reveal);
          return (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[start, start + reveal]}
              accent={isAccent(t)}
            >
              {t.word}
            </Word>
          );
        })}
      </p>
    </div>
  );
}
