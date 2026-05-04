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
CSRF_TRUSTED_ORIGINS=https://<your-render-service>.onrender.com,https://<your-vercel-app>.vercel.app
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
CONTACT_RECEIVER_EMAIL=info@avtch.io
```

For a visual test deploy, `console.EmailBackend` is enough: requests are saved to the database and email output appears in Render logs. For real emails, replace it with `django.core.mail.backends.smtp.EmailBackend` and set `EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL`.

## 3. Vercel Frontend

Create a Vercel project from this repository.

- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Set:

```env
VITE_API_URL=https://<your-render-service>.onrender.com/api
```

After Vercel deploys, add the Vercel domain to Render:

```env
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-render-service>.onrender.com,https://<your-vercel-app>.vercel.app
```

Product pages are handled by `frontend/vercel.json`, so routes like `/products/self-service-kiosk` open correctly on refresh.
