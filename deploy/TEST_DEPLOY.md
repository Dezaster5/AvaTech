# Test Deploy: Render + Vercel + Neon

## 1. Neon

Create a Neon project and copy the pooled or direct connection string:

```text
postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

Use it as `DATABASE_URL` for the Render backend. The Django settings read `DATABASE_URL` first, then fall back to `POSTGRES_*`, then SQLite.

## 2. Render Backend

Create a Render Web Service from this repository.

- Blueprint file: `render.yaml`
- Runtime: Python
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- Start Command: `python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
- Health Check Path: `/api/health/`

Required environment variables:

```env
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<generated-secret>
DJANGO_ALLOWED_HOSTS=<your-render-service>.onrender.com
DJANGO_ADMIN_PATH=control-<random-hex>/
CSRF_TRUSTED_ORIGINS=https://<your-render-service>.onrender.com,https://<your-vercel-app>.vercel.app
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
CONTACT_RECEIVER_EMAIL=info@avtch.io
CONTACT_RECEIVER_EMAILS=info@avtch.io
INTERNAL_API_TOKEN=<same-long-random-token>
```

For real emails, set `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL`, and keep `CONTACT_RECEIVER_EMAILS=info@avtch.io`. If you only need a visual demo without real email delivery, temporarily use `django.core.mail.backends.console.EmailBackend`; requests will still be saved in the database and email output will appear in Render logs.

## 3. Vercel Frontend

Create a Vercel project from this repository.

- Root Directory: `frontend`
- Framework Preset: Next.js
- Install Command: `corepack enable && pnpm install --frozen-lockfile`
- Build Command: `pnpm build`

Set:

```env
NEXT_PUBLIC_SITE_URL=https://<your-vercel-app>.vercel.app
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<cloudflare-turnstile-site-key>
BITRIX_CONTACT_WEBHOOK=<bitrix-contact-webhook>
BITRIX_DEAL_WEBHOOK=<bitrix-deal-webhook>
TURNSTILE_SECRET_KEY=<cloudflare-turnstile-secret-key>
DJANGO_SUBMISSION_LOG_URL=https://<your-render-service>.onrender.com/api/contact/log/
DJANGO_SUBMISSION_LOG_TOKEN=<same-long-random-token>
```

`DJANGO_SUBMISSION_LOG_TOKEN` in Vercel must be exactly the same value as `INTERNAL_API_TOKEN` in Render. This lets the Next.js route save Bitrix contact/deal IDs, JSON responses, API response JSON, and email status into Django admin.

After Vercel deploys, add the Vercel domain to Render:

```env
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-render-service>.onrender.com,https://<your-vercel-app>.vercel.app
```

Product pages are handled by Next.js App Router, so routes like `/products/self-service-kiosk` open correctly on refresh.
