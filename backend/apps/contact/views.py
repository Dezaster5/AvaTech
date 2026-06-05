import logging
import time

from django.conf import settings
from django.core.cache import cache
from django.db import transaction
from django.utils import timezone
from django.utils.text import Truncator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ContactRequestSerializer
from .services import send_contact_email


logger = logging.getLogger(__name__)


def get_client_ip(request) -> str | None:
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def is_rate_limited(ip_address: str | None) -> bool:
    if not ip_address:
        return False

    key = f"contact-rate-limit:{ip_address}"
    now = time.time()
    window_start = now - settings.CONTACT_RATE_LIMIT_WINDOW_SECONDS
    attempts = [timestamp for timestamp in cache.get(key, []) if timestamp > window_start]

    if len(attempts) >= settings.CONTACT_RATE_LIMIT_COUNT:
        cache.set(key, attempts, settings.CONTACT_RATE_LIMIT_WINDOW_SECONDS)
        return True

    attempts.append(now)
    cache.set(key, attempts, settings.CONTACT_RATE_LIMIT_WINDOW_SECONDS)
    return False


class ContactRequestCreateView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    def post(self, request):
        ip_address = get_client_ip(request)
        if is_rate_limited(ip_address):
            return Response(
                {"detail": "Слишком много заявок. Попробуйте отправить форму позже."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        serializer = ContactRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"detail": "Проверьте заполнение формы.", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_agent = request.META.get("HTTP_USER_AGENT", "")[:1000]
        try:
            with transaction.atomic():
                contact_request = serializer.save(ip_address=ip_address, user_agent=user_agent)
        except Exception:
            logger.exception("Contact request save failed")
            return Response(
                {"detail": "Не удалось сохранить заявку. Попробуйте позже или напишите на info@avtch.io."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            send_contact_email(contact_request)
        except Exception as exc:
            email_error = Truncator(str(exc) or exc.__class__.__name__).chars(1000)
            contact_request.email_error = email_error
            contact_request.save(update_fields=["email_error"])
            logger.exception("Contact request email delivery failed: %s", contact_request.pk)
            return Response(
                {"detail": "Не удалось отправить заявку. Попробуйте позже или напишите на info@avtch.io."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        contact_request.email_sent_at = timezone.now()
        contact_request.email_error = ""
        contact_request.save(update_fields=["email_sent_at", "email_error"])

        return Response(
            {"detail": "Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время."},
            status=status.HTTP_201_CREATED,
        )
