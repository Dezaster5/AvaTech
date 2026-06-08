# AvaTech VPS deploy on Ubuntu

Инструкция рассчитана на чистый Ubuntu-сервер, Docker Compose, системный Nginx и SSL от Let's Encrypt.

## 1. DNS

В панели домена добавьте записи:

```text
A     avtch.io      <SERVER_IP>
A     www.avtch.io  <SERVER_IP>
```

Подождите, пока DNS обновится. Проверить можно так:

```bash
nslookup avtch.io
nslookup www.avtch.io
```

## 2. Подключение к серверу

```bash
ssh root@<SERVER_IP>
```

Если используете не root-пользователя, добавляйте `sudo` перед системными командами.

## 3. Базовая подготовка Ubuntu

```bash
apt update
apt upgrade -y
apt install -y ca-certificates curl gnupg git ufw nginx certbot python3-certbot-nginx
```

Установите Docker из официального репозитория:

```bash
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
docker --version
docker compose version
```

Откройте только SSH и Nginx:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

## 4. Загрузка проекта

```bash
mkdir -p /var/www
cd /var/www
git clone <GITHUB_REPO_URL> avtch.io
cd /var/www/avtch.io
```

Если репозиторий приватный, настройте SSH-ключ или используйте GitHub deploy key.

## 5. Production .env

```bash
cp .env.example .env
nano .env
```

Минимальный production-набор:

```env
DJANGO_SECRET_KEY=<PASTE_SECRET_FROM_OPENSSL>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=avtch.io,www.avtch.io,<SERVER_IP>
CSRF_TRUSTED_ORIGINS=https://avtch.io,https://www.avtch.io
CORS_ALLOWED_ORIGINS=https://avtch.io,https://www.avtch.io

DATABASE_URL=
POSTGRES_DB=avtch
POSTGRES_USER=avtch
POSTGRES_PASSWORD=<STRONG_POSTGRES_PASSWORD>
POSTGRES_HOST=db
POSTGRES_PORT=5432

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.mail.ru
EMAIL_PORT=465
EMAIL_HOST_USER=info@avtch.io
EMAIL_HOST_PASSWORD=<MAIL_RU_APP_PASSWORD>
EMAIL_USE_TLS=False
EMAIL_USE_SSL=True
EMAIL_TIMEOUT=15
DEFAULT_FROM_EMAIL=AvaTech <info@avtch.io>
CONTACT_RECEIVER_EMAIL=info@avtch.io
CONTACT_RECEIVER_EMAILS=info@avtch.io

CONTACT_RATE_LIMIT_COUNT=5
CONTACT_RATE_LIMIT_WINDOW_SECONDS=900
INTERNAL_API_TOKEN=<LONG_RANDOM_INTERNAL_TOKEN>

NEXT_PUBLIC_SITE_URL=https://avtch.io
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<CLOUDFLARE_TURNSTILE_SITE_KEY>
BITRIX_CONTACT_WEBHOOK=<BITRIX_CONTACT_WEBHOOK>
BITRIX_DEAL_WEBHOOK=<BITRIX_DEAL_WEBHOOK>
TURNSTILE_SECRET_KEY=<CLOUDFLARE_TURNSTILE_SECRET_KEY>
DJANGO_SUBMISSION_LOG_URL=http://backend:8000/api/contact/log/
DJANGO_SUBMISSION_LOG_TOKEN=<LONG_RANDOM_INTERNAL_TOKEN>
```

Сгенерировать значения:

```bash
openssl rand -base64 48
openssl rand -base64 32
```

Первое значение используйте для `DJANGO_SECRET_KEY`, второе можно использовать как `POSTGRES_PASSWORD`. Ещё одно отдельное значение задайте одинаково в `INTERNAL_API_TOKEN` и `DJANGO_SUBMISSION_LOG_TOKEN`.

Для Mail.ru нужен пароль приложения, а не обычный пароль от почты.

## 6. Запуск контейнеров

```bash
cd /var/www/avtch.io
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
```

Проверка внутри сервера:

```bash
curl -I http://127.0.0.1:8080
curl http://127.0.0.1:8000/api/health/
```

Создайте администратора Django:

```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

## 7. Nginx без SSL для первого запуска

Сначала ставим HTTP-конфиг, чтобы Certbot смог выпустить сертификат:

```bash
mkdir -p /var/www/certbot
cp /var/www/avtch.io/deploy/nginx/avtch.io.http.conf /etc/nginx/sites-available/avtch.io.conf
ln -sf /etc/nginx/sites-available/avtch.io.conf /etc/nginx/sites-enabled/avtch.io.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

Проверка:

```bash
curl -I http://avtch.io
```

## 8. SSL

```bash
certbot certonly --webroot -w /var/www/certbot -d avtch.io -d www.avtch.io
cp /var/www/avtch.io/deploy/nginx/avtch.io.conf /etc/nginx/sites-available/avtch.io.conf
nginx -t
systemctl reload nginx
certbot renew --dry-run
```

После этого сайт должен открываться:

```text
https://avtch.io
https://www.avtch.io
https://avtch.io/admin/
```

## 9. Обновление после нового push

```bash
cd /var/www/avtch.io
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

Backend при старте сам выполняет `migrate` и `collectstatic`.

## 10. Логи и диагностика

```bash
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f db
journalctl -u nginx -f
```

Проверить форму заявки:

```bash
curl -X POST https://avtch.io/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","company":"AvaTech","phone":"+77019712777","email":"test@example.com","comment":"Test deploy request"}'
```

Проверить внутреннее сохранение диагностики из Next.js в Django admin:

```bash
docker compose -f docker-compose.prod.yml exec frontend node -e "fetch(process.env.DJANGO_SUBMISSION_LOG_URL,{method:'POST',headers:{'Content-Type':'application/json','X-AvaTech-Internal-Token':process.env.DJANGO_SUBMISSION_LOG_TOKEN},body:JSON.stringify({name:'Test Admin Log',company:'AvaTech',phone:'+77019712777',email:'test@example.com',message:'Internal log test',bitrix_status:'failed',bitrix_error:'Manual diagnostics test',request_payload:{source:'manual'},api_response_payload:{success:false,error:'manual'}})}).then(async r=>console.log(r.status,await r.text()))"
```

## 11. Backup PostgreSQL

```bash
cd /var/www/avtch.io
docker compose -f docker-compose.prod.yml exec -T db pg_dump -U avtch avtch > backup_$(date +%F).sql
```

Восстановление:

```bash
cat backup_YYYY-MM-DD.sql | docker compose -f docker-compose.prod.yml exec -T db psql -U avtch avtch
```

## 12. Что проверить перед показом

- Главная страница открывается по HTTPS.
- `/api/health/` возвращает JSON.
- `/admin/` открывается со стилями.
- Форма заявки создаёт контакт/сделку в Bitrix24 и сохраняет запись в admin.
- В admin у заявки видны статус Bitrix24, Contact ID, Deal ID, JSON-ответы Bitrix, JSON запроса/ответа API route и статус email.
- На `info@avtch.io` приходит письмо.
- Продуктовые страницы открываются при прямом переходе по URL.
