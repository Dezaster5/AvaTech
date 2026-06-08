"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import PhoneInput, {
  isValidPhoneNumber,
  type Country,
} from "react-phone-number-input";
import ru from "react-phone-number-input/locale/ru";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";
import { sanitizeName } from "@/lib/form-masks";
import { detectCountry } from "@/lib/detect-country";

// Стиль поля совпадает с формой в секции «Контакты» — единый визуальный язык.
const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30 placeholder:text-muted-foreground";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const isTurnstileEnabled = Boolean(TURNSTILE_SITE_KEY);

// Блок-CTA на странице продукта: слева — призыв, справа — реальная форма заявки.
// productName подставляем в скрытое поле, чтобы при отправке было понятно,
// каким именно продуктом интересуется клиент.
export function ProductCta({ productName }: { productName: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<TurnstileInstance>(null);
  // Телефон в международном формате + страна (по умолчанию KZ, уточняем по IP).
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<Country>("KZ");

  useEffect(() => {
    detectCountry().then((c) => setCountry(c as Country));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      company: `Интерес к продукту: ${productName}`,
      // Телефон — из состояния, уже в международном формате.
      phone: phone ?? "",
      email: "", // на этой форме поля email нет
      message: formData.get("comment") as string,
      product: productName,
      // Honeypot — ловушка для ботов.
      website: formData.get("website") as string,
      token: isTurnstileEnabled ? captchaToken ?? "" : "local-dev",
    };

    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Введите корректный номер телефона.");
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
    // id="contact-form" — на эту форму ведут кнопки «Связаться»/«Оставить заявку»
    // в пределах страницы продукта (относительный якорь #contact-form)
    <section id="contact-form" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="overflow-hidden rounded-3xl bg-foreground px-6 py-12 sm:px-10 sm:py-14 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Левая колонка — призыв */}
            <div className="text-background">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
                Хотите внедрить «{productName}» в своём бизнесе?
              </h2>
              <p className="mt-5 max-w-xl text-lg text-white/70 text-pretty">
                Оставьте заявку — команда AvaTech свяжется с вами, покажет
                решение и обсудит внедрение под ваши процессы.
              </p>
            </div>

            {/* Правая колонка — форма */}
            <div className="rounded-2xl bg-card p-6 text-foreground sm:p-8">
              {submitted ? (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
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
                  {/* Honeypot: ловушка для ботов, спрятана от людей. Не трогать. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />
                  <div>
                    <label htmlFor="cta-name" className="text-sm font-medium">
                      Имя
                    </label>
                    <input
                      id="cta-name"
                      name="name"
                      required
                      placeholder="Как к вам обращаться"
                      // Маска имени: убираем цифры и спецсимволы.
                      onChange={(e) => {
                        e.currentTarget.value = sanitizeName(e.currentTarget.value);
                      }}
                      className={`mt-1.5 ${fieldClass}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="cta-phone" className="text-sm font-medium">
                      Телефон
                    </label>
                    {/* Международный телефон: флаг и код страны определяются
                        автоматически. Обёртка повторяет вид остальных полей. */}
                    <div className="mt-1.5 flex w-full items-center rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30">
                      <PhoneInput
                        id="cta-phone"
                        international
                        // Код страны зафиксирован: при вводе не стирается,
                        // смена страны — только через выпадающий список (стрелка).
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
                    <label htmlFor="cta-comment" className="text-sm font-medium">
                      Комментарий{" "}
                      <span className="text-muted-foreground">
                        (необязательно)
                      </span>
                    </label>
                    <textarea
                      id="cta-comment"
                      name="comment"
                      rows={3}
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
                    {loading ? "Отправляем…" : "Оставить заявку"}
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
