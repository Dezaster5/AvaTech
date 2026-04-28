# AvaTech corporate website

Production-ready стартовый проект для корпоративного сайта AvaTech на Django + React.

## Архитектура

```text
.
├── backend/                 # Django + DRF API
│   ├── apps/contact/        # модель, serializer, view, email-сервис, admin
│   ├── config/              # settings, urls, wsgi/asgi
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
├── frontend/                # React + Vite + TypeScript
│   ├── public/              # favicon, robots.txt, sitemap.xml, OG placeholder
│   ├── src/components/      # секции сайта и UI-компоненты
│   ├── src/data/            # контент сайта
│   ├── src/styles/          # CSS Modules и global styles
│   ├── Dockerfile
│   └── nginx.conf
├── deploy/nginx/            # пример nginx-конфига для avtch.io + SSL
├── docker-compose.yml
├── .env.example
└── README.md
```

## Что реализовано

- Одностраничный корпоративный сайт на русском языке.
- Header с якорной навигацией, sticky blur и мобильным меню.
- Hero, блоки о компании, команде, продуктах, преимуществах, аудитории, контактах и footer.
- Форма заявки с frontend-валидацией, loading/success/error состояниями и honeypot-полем.
- Django endpoint `POST /api/contact/`.
- Модель `ContactRequest`, сохранение IP/User-Agent и просмотр заявок в Django admin.
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
cp .env.example .env
npm install
npm run dev
```

Сайт будет доступен на `http://localhost:5173`. Vite проксирует `/api` на Django `http://127.0.0.1:8000`.

## Локальный запуск через Docker

```bash
cp .env.example .env
docker compose up --build
```

Frontend: `http://localhost:8080`
Backend healthcheck: `http://localhost:8000/api/health/`
Admin: `http://localhost:8080/admin/`

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
DEFAULT_FROM_EMAIL=AvaTech <no-reply@avtch.io>
CONTACT_RECEIVER_EMAIL=info@avtch.io
```

Для локальной разработки можно оставить `EMAIL_HOST` пустым в `backend/.env`: при `DJANGO_DEBUG=True` письма будут выводиться в консоль Django.

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
npm run build
```

Backend:

```bash
cd backend
python manage.py collectstatic --noinput
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

## VPS deployment notes

1. Настроить DNS `A`/`AAAA` записи для `avtch.io` и `www.avtch.io`.
2. Скопировать `.env.example` в `.env`, задать production значения и SMTP.
3. Запустить `docker compose up -d --build`.
4. Выпустить SSL-сертификат через Certbot для `avtch.io` и `www.avtch.io`.
5. Использовать пример `deploy/nginx/avtch.io.conf`, где frontend доступен на `127.0.0.1:8080`, backend на `127.0.0.1:8000`.
6. Добавить Google Analytics и Яндекс Метрику в `frontend/index.html` после получения идентификаторов счётчиков.

Для production рекомендуется установить `DJANGO_DEBUG=False`, сложный `DJANGO_SECRET_KEY`, строгие `DJANGO_ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS` и реальные SMTP-данные.
