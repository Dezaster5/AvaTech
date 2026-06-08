"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import PhoneInput, {
  isValidPhoneNumber,
  type Country,
} from "react-phone-number-input";
import ru from "react-phone-number-input/locale/ru";
import "react-phone-number-input/style.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sanitizeName, isValidEmail } from "@/lib/form-masks";
import { detectCountry } from "@/lib/detect-country";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30 placeholder:text-muted-foreground";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const isTurnstileEnabled = Boolean(TURNSTILE_SITE_KEY);

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  // loading — идёт отправка (блокируем кнопку), error — текст ошибки для пользователя.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<TurnstileInstance>(null);
  // Телефон в международном формате (например, +77051234567).
  const [phone, setPhone] = useState<string | undefined>(undefined);
  // Страна для телефона: по умолчанию Казахстан, уточняем по IP при загрузке.
  const [country, setCountry] = useState<Country>("KZ");

  useEffect(() => {
    detectCountry().then((c) => setCountry(c as Country));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Собираем данные из полей формы.
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      // Телефон берём из состояния — он уже в международном формате (+7705...).
      phone: phone ?? "",
      email: formData.get("email") as string,
      message: formData.get("comment") as string,
      // Honeypot — скрытое поле-ловушка для ботов (человек его не заполняет).
      website: formData.get("website") as string,
      token: isTurnstileEnabled ? captchaToken ?? "" : "local-dev",
    };

    // Проверяем телефон и email до отправки — чтобы не слать мусор в CRM.
    // isValidPhoneNumber знает правила каждой страны.
    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Введите корректный номер телефона.");
      setLoading(false);
      return;
    }
    if (payload.email && !isValidEmail(payload.email)) {
      setError("Проверьте правильность email.");
      setLoading(false);
      return;
    }
    if (isTurnstileEnabled && !captchaToken) {
      setError("Пройдите проверку «вы не робот» и отправьте форму ещё раз.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/bitrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Не удалось отправить заявку. Попробуйте позже.");
        captchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } catch (submitError) {
      // Сюда попадаем при проблемах с сетью.
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Проблема с подключением. Проверьте интернет и попробуйте снова.",
      );
      captchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contacts">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Navy панель-«остров» */}
        <div className="overflow-hidden rounded-3xl bg-foreground px-6 py-12 sm:px-10 sm:py-14 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Левая колонка — контакты (белый текст на navy) */}
            <div className="text-background">
              <Badge
                variant="outline"
                className="h-auto gap-2 border-white/20 bg-white/5 px-3 py-1 text-sm text-white/85"
              >
                <span className="size-1.5 rounded-full bg-brand" />
                Контакты
              </Badge>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
                Обсудим автоматизацию вашего бизнеса
              </h2>
              <p className="mt-5 text-lg text-white/70 text-pretty">
                Свяжитесь с AvaTech, если нужны IT-решения для продаж, сервиса,
                сотрудников или гостевого опыта. Обсудим подходящий продукт,
                внедрение и поддержку.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href="tel:+77019712777"
                  className="flex items-center gap-3 transition-colors hover:text-brand"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                    <Phone className="size-5" strokeWidth={1.75} />
                  </span>
                  +7 701 971 27 77
                </a>
                <a
                  href="mailto:info@avtch.io"
                  className="flex items-center gap-3 transition-colors hover:text-brand"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                    <Mail className="size-5" strokeWidth={1.75} />
                  </span>
                  info@avtch.io
                </a>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                    <MapPin className="size-5" strokeWidth={1.75} />
                  </span>
                  Казахстан
                </div>
              </div>

              <div className="mt-8">
                <Badge
                  variant="outline"
                  className="h-auto gap-2 border-white/20 bg-white/5 px-3 py-1 text-sm text-white/70"
                >
                  <span className="size-1.5 rounded-full bg-brand" />
                  Участник Astana Hub
                </Badge>
              </div>
            </div>

            {/* Правая колонка — форма (белая карточка) */}
            <div
              id="contact-form"
              className="rounded-2xl bg-card p-6 text-foreground sm:p-8"
            >
              {submitted ? (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                  <CheckCircle2 className="size-12 text-brand" strokeWidth={1.5} />
                  <h3 className="mt-4 text-xl font-semibold">
                    Спасибо! Заявка отправлена
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Мы свяжемся с вами в ближайшее время.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Honeypot: ловушка для ботов. Спрятано от людей (off-screen),
                      убрано из таб-навигации и автозаполнения. Не трогать. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />
                  <div>
                    <label htmlFor="name" className="text-sm font-medium">
                      Имя
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      placeholder="Как к вам обращаться"
                      // Маска имени: на лету убираем цифры и спецсимволы.
                      onChange={(e) => {
                        e.currentTarget.value = sanitizeName(e.currentTarget.value);
                      }}
                      className={`mt-1.5 ${fieldClass}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="text-sm font-medium">
                      Компания{" "}
                      <span className="text-muted-foreground">
                        (необязательно)
                      </span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      placeholder="Название компании"
                      className={`mt-1.5 ${fieldClass}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium">
                      Телефон
                    </label>
                    {/* Международный телефон: флаг + код страны определяются
                        автоматически (по IP и по вводу), формат — под страну.
                        Обёртка повторяет вид остальных полей формы. */}
                    <div className="mt-1.5 flex w-full items-center rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30">
                      <PhoneInput
                        id="phone"
                        international
                        // Код страны зафиксирован: при вводе номера он не стирается,
                        // сменить страну можно только через выпадающий список (стрелка).
                        countryCallingCodeEditable={false}
                        key={country}
                        defaultCountry={country}
                        value={phone}
                        onChange={setPhone}
                        labels={ru}
                        placeholder="705 123 45 67"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-muted-foreground">(необязательно)</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.kz"
                      className={`mt-1.5 ${fieldClass}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="comment" className="text-sm font-medium">
                      Комментарий
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      placeholder="Какие процессы нужно автоматизировать?"
                      className={`mt-1.5 resize-none ${fieldClass}`}
                    />
                  </div>
                  {isTurnstileEnabled ? (
                    <div className="min-h-[65px]">
                      <Turnstile
                        ref={captchaRef}
                        siteKey={TURNSTILE_SITE_KEY}
                        onSuccess={(token) => {
                          setCaptchaToken(token);
                          setError(null);
                        }}
                        onExpire={() => setCaptchaToken(null)}
                        onError={() => {
                          setCaptchaToken(null);
                          setError("Проверка «вы не робот» не прошла. Обновите её и попробуйте снова.");
                        }}
                        options={{ language: "ru", appearance: "always" }}
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Turnstile отключён для локальной разработки.
                    </p>
                  )}
                  {/* Сообщение об ошибке (если отправка не удалась) */}
                  {error && (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="mt-2 h-11 w-full bg-brand text-base text-white hover:bg-brand/90 disabled:opacity-60"
                  >
                    {loading ? "Отправляем…" : "Отправить заявку"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
