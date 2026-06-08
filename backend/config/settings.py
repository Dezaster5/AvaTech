from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def env_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


def env_str(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def postgres_database_from_url(database_url: str) -> dict[str, object]:
    parsed = urlparse(database_url)
    query = parse_qs(parsed.query)
    sslmode = query.get("sslmode", ["require"])[0]

    return {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": unquote(parsed.path.lstrip("/")),
        "USER": unquote(parsed.username or ""),
        "PASSWORD": unquote(parsed.password or ""),
        "HOST": parsed.hostname or "",
        "PORT": str(parsed.port or 5432),
        "OPTIONS": {"sslmode": sslmode},
    }


SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-only-change-me")
DEBUG = env_bool("DJANGO_DEBUG", True)

ALLOWED_HOSTS = env_list(
    "DJANGO_ALLOWED_HOSTS",
    "localhost,127.0.0.1,0.0.0.0,backend,frontend,host.docker.internal,avtch.io,www.avtch.io",
)
for internal_host in ("localhost", "127.0.0.1", "backend", "frontend", "host.docker.internal"):
    if internal_host not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(internal_host)
if render_hostname := os.getenv("RENDER_EXTERNAL_HOSTNAME"):
    ALLOWED_HOSTS.append(render_hostname)
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", "https://avtch.io,https://www.avtch.io")
_admin_path = env_str("DJANGO_ADMIN_PATH", "control-local-dev/").strip("/")
DJANGO_ADMIN_PATH = f"{_admin_path}/" if _admin_path else "control-local-dev/"

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "apps.contact",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

if os.getenv("DATABASE_URL"):
    DATABASES = {"default": postgres_database_from_url(os.environ["DATABASE_URL"])}
elif os.getenv("POSTGRES_DB"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("POSTGRES_DB"),
            "USER": os.getenv("POSTGRES_USER", "postgres"),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD", ""),
            "HOST": os.getenv("POSTGRES_HOST", "localhost"),
            "PORT": os.getenv("POSTGRES_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "ru"
TIME_ZONE = "Asia/Almaty"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,https://avtch.io,https://www.avtch.io",
)
CORS_ALLOW_CREDENTIALS = False

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
}

EMAIL_BACKEND = env_str("EMAIL_BACKEND")
if not EMAIL_BACKEND:
    EMAIL_BACKEND = (
        "django.core.mail.backends.console.EmailBackend"
        if DEBUG and not os.getenv("EMAIL_HOST")
        else "django.core.mail.backends.smtp.EmailBackend"
    )
EMAIL_HOST = env_str("EMAIL_HOST")
if "://" in EMAIL_HOST:
    parsed_email_host = urlparse(EMAIL_HOST)
    EMAIL_HOST = parsed_email_host.hostname or EMAIL_HOST
EMAIL_PORT = int(env_str("EMAIL_PORT", "587"))
EMAIL_HOST_USER = env_str("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env_str("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
EMAIL_USE_SSL = env_bool("EMAIL_USE_SSL", False)
EMAIL_TIMEOUT = int(env_str("EMAIL_TIMEOUT", "15"))
DEFAULT_FROM_EMAIL = env_str("DEFAULT_FROM_EMAIL", EMAIL_HOST_USER or "AvaTech <no-reply@avtch.io>")
_contact_receiver_email = env_str("CONTACT_RECEIVER_EMAIL", "info@avtch.io")
CONTACT_RECEIVER_EMAILS = env_list("CONTACT_RECEIVER_EMAILS", _contact_receiver_email) or ["info@avtch.io"]
CONTACT_RECEIVER_EMAIL = CONTACT_RECEIVER_EMAILS[0]

CONTACT_RATE_LIMIT_COUNT = int(os.getenv("CONTACT_RATE_LIMIT_COUNT", "5"))
CONTACT_RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("CONTACT_RATE_LIMIT_WINDOW_SECONDS", "900"))
INTERNAL_API_TOKEN = env_str("INTERNAL_API_TOKEN")
DJANGO_SUBMISSION_LOG_TOKEN = env_str("DJANGO_SUBMISSION_LOG_TOKEN")
INTERNAL_API_TOKENS = {
    token for token in (INTERNAL_API_TOKEN, DJANGO_SUBMISSION_LOG_TOKEN) if token
}

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = env_bool("SESSION_COOKIE_SECURE", not DEBUG)
CSRF_COOKIE_SECURE = env_bool("CSRF_COOKIE_SECURE", not DEBUG)
SECURE_SSL_REDIRECT = env_bool("SECURE_SSL_REDIRECT", False)
