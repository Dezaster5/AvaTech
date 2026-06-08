# AvaTech corporate website

Production-ready проект для корпоративного сайта AvaTech на Django + Next.js.

## Архитектура

```text
.
├── backend/                 # Django + DRF API
│   ├── apps/contact/        # модель, serializer, view, email-сервис, admin
│   ├── config/              # settings, urls, wsgi/asgi
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
├── frontend/                # Next.js + React + TypeScript
│   ├── public/              # изображения, product gallery, partner assets
│   ├── src/app/             # App Router, SEO, product pages
│   ├── src/components/      # секции сайта и UI-компоненты
│   ├── src/lib/             # утилиты, форма, API-клиент
│   ├── Dockerfile
│   └── next.config.ts
├── deploy/nginx/            # nginx-конфиги для avtch.io: HTTP bootstrap + SSL
├── deploy/ubuntu/README.md  # пошаговый деплой на чистый Ubuntu VPS
├── deploy/TEST_DEPLOY.md    # тестовый деплой на Render + Vercel + Neon
├── render.yaml              # Render blueprint для backend
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
└── README.md
```

## Что реализовано

- Одностраничный корпоративный сайт на русском языке.
- Header с якорной навигацией, sticky blur и анимацией в компактный top bar при скролле.
- Hero, блоки о компании, команде, продуктах, преимуществах, аудитории, контактах и footer.
- Отдельные страницы продуктов `/products/...` с галереей, fullscreen-просмотром изображений, CTA и SEO.
- Форма заявки с frontend-валидацией, loading/success/error состояниями и honeypot-полем.
- Django endpoint `POST /api/contact/`.
- Модель `ContactRequest`, сохранение IP/User-Agent и просмотр заявок в Django admin.
- Диагностика заявок из редизайна: статус Bitrix24, Contact ID, Deal ID, JSON-ответы Bitrix, JSON запроса/ответа API route и статус email-отправки.
- Email-отправка заявки на `CONTACT_RECEIVER_EMAIL`.
- Простая IP rate-limit защита формы.
- SEO: title, description, keywords, Open Graph, favicon, robots.txt, sitemap.xml, semantic HTML.
- Dockerfile для backend/frontend, docker-compose и nginx пример для VPS.

## Локальный запуск без Docker

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 127.0.0.1:8000
```

Frontend:

```bash
cd frontend
cp .env.example .env.local
corepack enable
pnpm install
pnpm dev
```

Сайт будет доступен на `http://localhost:3000`. Форма редизайна отправляет заявки в Next.js API route `/api/bitrix`; после отправки route пишет диагностику в Django endpoint `/api/contact/log/`.

## Локальный запуск через Docker

```bash
cp .env.example .env
docker compose up --build
```

Frontend: `http://localhost:8080`
Backend healthcheck: `http://localhost:8000/api/health/`
Admin: `http://localhost:8000/admin/`

Создание администратора в Docker:

```bash
docker compose exec backend python manage.py createsuperuser
```

## Настройка email

В `.env` заполните SMTP-параметры:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_HOST_USER=no-reply@avtch.io
EMAIL_HOST_PASSWORD=secure-password
EMAIL_USE_TLS=True
EMAIL_TIMEOUT=15
DEFAULT_FROM_EMAIL=AvaTech <no-reply@avtch.io>
CONTACT_RECEIVER_EMAIL=info@avtch.io
CONTACT_RECEIVER_EMAILS=info@avtch.io
```

Для локальной разработки можно оставить `EMAIL_HOST` пустым в `backend/.env`: при `DJANGO_DEBUG=True` письма будут выводиться в консоль Django.
В письме используется `Reply-To` с email клиента, поэтому отвечать на заявку можно прямо из почтового клиента.

## Bitrix24 и диагностика в admin

Форма редизайна сначала создаёт контакт и сделку в Bitrix24 через Next.js API route `/api/bitrix`, затем сохраняет результат в Django admin через внутренний endpoint `/api/contact/log/`.

Для Docker/VPS в корневом `.env` задайте:

```env
BITRIX_CONTACT_WEBHOOK=<bitrix-contact-webhook-base-url>
BITRIX_DEAL_WEBHOOK=<bitrix-deal-webhook-base-url>
INTERNAL_API_TOKEN=<same-long-random-token>
DJANGO_SUBMISSION_LOG_URL=http://backend:8000/api/contact/log/
DJANGO_SUBMISSION_LOG_TOKEN=<same-long-random-token>
```

В Django admin откройте `Заявки`: там видны статус Bitrix24, ID контакта/сделки, JSON-ответы Bitrix, JSON запроса формы, JSON ответа frontend API route, дата отправки email и ошибка email, если SMTP не сработал.

## API заявки

Endpoint:

```http
POST /api/contact/
Content-Type: application/json
```

Тело:

```json
{
  "name": "Имя",
  "company": "Компания",
  "phone": "+7 701 971 27 77",
  "email": "example@mail.com",
  "comment": "Комментарий"
}
```

Успешный ответ:

```json
{
  "detail": "Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время."
}
```

## Production build

Frontend:

```bash
cd frontend
pnpm build
```

Backend:

```bash
cd backend
python manage.py collectstatic --noinput
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

## VPS deployment notes

Подробная инструкция для чистого Ubuntu-сервера лежит в `deploy/ubuntu/README.md`.

Коротко:

```bash
cp .env.example .env
docker compose -f docker-compose.prod.yml up -d --build
```

Production compose публикует backend и frontend только на `127.0.0.1`, а наружный доступ должен идти через системный Nginx. Для первого запуска и выпуска SSL используйте `deploy/nginx/avtch.io.http.conf`, после выпуска сертификата замените его на `deploy/nginx/avtch.io.conf`.

Для production обязательно установить `DJANGO_DEBUG=False`, сложный `DJANGO_SECRET_KEY`, строгие `DJANGO_ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, `CORS_ALLOWED_ORIGINS` и реальные SMTP-данные.

## Test deploy: Render + Vercel + Neon

Подготовлены `render.yaml` и инструкция `deploy/TEST_DEPLOY.md`.

Коротко:

```env
# Render backend
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
DJANGO_ALLOWED_HOSTS=<your-render-service>.onrender.com
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-render-service>.onrender.com,https://<your-vercel-app>.vercel.app
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
CONTACT_RECEIVER_EMAILS=info@avtch.io
INTERNAL_API_TOKEN=<same-long-random-token>

# Vercel frontend
NEXT_PUBLIC_SITE_URL=https://<your-vercel-app>.vercel.app
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<cloudflare-turnstile-site-key>
BITRIX_CONTACT_WEBHOOK=<bitrix-contact-webhook>
BITRIX_DEAL_WEBHOOK=<bitrix-deal-webhook>
TURNSTILE_SECRET_KEY=<cloudflare-turnstile-secret-key>
DJANGO_SUBMISSION_LOG_URL=https://<your-render-service>.onrender.com/api/contact/log/
DJANGO_SUBMISSION_LOG_TOKEN=<same-long-random-token>
```
