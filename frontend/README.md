# AvaTech frontend

Next.js frontend for `avtch.io`.

## Local development

```bash
cp .env.example .env.local
corepack enable
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

The contact form sends requests to the Next.js API route `/api/bitrix`.
That route creates a Bitrix24 contact/deal and then writes diagnostics to Django admin through `DJANGO_SUBMISSION_LOG_URL`.

For local development with Django running on `127.0.0.1:8000`, set:

```env
DJANGO_SUBMISSION_LOG_URL=http://127.0.0.1:8000/api/contact/log/
DJANGO_SUBMISSION_LOG_TOKEN=
```

For production, `DJANGO_SUBMISSION_LOG_TOKEN` must match backend `INTERNAL_API_TOKEN`.

## Production build

```bash
pnpm build
pnpm start
```

Docker uses the standalone Next.js build and exposes port `3000`.
