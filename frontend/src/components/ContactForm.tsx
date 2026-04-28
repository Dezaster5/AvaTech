import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import styles from "../styles/ContactForm.module.css";
import { Button } from "./ui/Button";
import { SectionTitle } from "./ui/SectionTitle";

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  comment: string;
  website: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  company: "",
  phone: "",
  email: "",
  comment: "",
  website: ""
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?[0-9\s()\-]{7,24}$/;

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const endpoint = useMemo(() => {
    const apiBase = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
    return `${apiBase}/contact/`;
  }, []);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) nextErrors.name = "Укажите имя.";
    if (!form.company.trim()) nextErrors.company = "Укажите компанию.";
    if (!phoneRe.test(form.phone.trim())) nextErrors.phone = "Укажите корректный телефон.";
    if (!emailRe.test(form.email.trim())) nextErrors.email = "Укажите корректный email.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setMessage("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.company.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          comment: form.comment.trim(),
          website: form.website
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || "Не удалось отправить заявку.");
      }

      setForm(initialForm);
      setStatus("success");
      setMessage(data.detail || "Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formShell}>
      <div className={styles.formIntro}>
        <SectionTitle
          eyebrow="Форма заявки"
          title="Расскажите, какую часть парка нужно автоматизировать"
          description="Мы свяжемся с вами и обсудим подходящий продукт, внедрение и дальнейшую поддержку."
        />
        <div className={styles.formMeta}>
          <span>info@avtch.io</span>
          <span>+7 701 971 27 77</span>
          <span>Казахстан</span>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.hiddenField} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => updateField("website", event.target.value)}
          />
        </div>

        <label>
          <span>Имя</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <small>{errors.name}</small> : null}
        </label>

        <label>
          <span>Компания</span>
          <input
            type="text"
            name="company"
            autoComplete="organization"
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
            aria-invalid={Boolean(errors.company)}
          />
          {errors.company ? <small>{errors.company}</small> : null}
        </label>

        <div className={styles.twoColumns}>
          <label>
            <span>Телефон</span>
            <input
              type="tel"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 701 971 27 77"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? <small>{errors.phone}</small> : null}
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <small>{errors.email}</small> : null}
          </label>
        </div>

        <label>
          <span>Комментарий</span>
          <textarea
            name="comment"
            rows={5}
            value={form.comment}
            onChange={(event) => updateField("comment", event.target.value)}
          />
        </label>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Отправляем..." : "Отправить заявку"}
          <Send size={18} />
        </Button>

        {message ? (
          <p className={`${styles.status} ${status === "success" ? styles.success : styles.error}`} aria-live="polite">
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
