"use client";

import { useEffect } from "react";

/**
 * Дотягивает прокрутку до якоря при заходе по ссылке вида «/#contact-form»
 * с ДРУГОЙ страницы (например кнопка «Связаться» на странице продукта).
 *
 * Проблема: браузер прокручивается к якорю сразу при загрузке, но секция
 * «Для кого» (pinned-блок) задаёт свою высоту уже после монтирования через
 * ResizeObserver и «отталкивает» форму вниз — прокрутка оказывается недокрученной.
 *
 * Решение: после загрузки несколько раз (пока макет не устаканится) повторно
 * прокручиваем к целевому элементу. Через ~1.5с перестаём вмешиваться, чтобы
 * не мешать пользователю.
 */
export function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!id) return;

    const go = () => {
      const el = document.getElementById(id);
      // block: "start" + scroll-margin-top у :target (в globals.css) уводят
      // элемент из-под прилипшей шапки
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    };

    const timers = [60, 250, 550, 900, 1400].map((t) => setTimeout(go, t));
    return () => timers.forEach(clearTimeout);
  }, []);

  return null;
}
