from __future__ import annotations

import os


def int_env(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        return default


port = os.getenv("PORT", "8000")

bind = os.getenv("GUNICORN_BIND", f"0.0.0.0:{port}")
workers = int_env("GUNICORN_WORKERS", 3)
timeout = int_env("GUNICORN_TIMEOUT", 120)
keepalive = int_env("GUNICORN_KEEPALIVE", 5)

accesslog = os.getenv("GUNICORN_ACCESS_LOGFILE", "-")
errorlog = os.getenv("GUNICORN_ERROR_LOGFILE", "-")

# The public site is reached through the host Nginx reverse proxy.
# Log the edge client IP from X-Forwarded-For and keep the Docker peer for debugging.
forwarded_allow_ips = os.getenv("GUNICORN_FORWARDED_ALLOW_IPS", "*")
access_log_format = os.getenv(
    "GUNICORN_ACCESS_LOG_FORMAT",
    '%({x-forwarded-for}i)s docker=%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"',
)
