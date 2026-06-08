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
from .models import ContactRequest


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


def as_positive_int(value) -> int | None:
    try:
        number = int(value)
    except (TypeError, ValueError):
        return None
    return number if number > 0 else None


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


class ContactRequestLogView(APIView):
    authentication_classes: list = []
    permission_classes: list = []

    def post(self, request):
        accepted_tokens = getattr(settings, "INTERNAL_API_TOKENS", set())
        request_token = request.headers.get("X-AvaTech-Internal-Token", "")

        if accepted_tokens:
            if request_token not in accepted_tokens:
                logger.warning(
                    "Contact log token rejected. request_token_present=%s configured_token_count=%s",
                    bool(request_token),
                    len(accepted_tokens),
                )
                return Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
        elif not settings.DEBUG:
            logger.error("No internal API token is configured in non-debug environment")
            return Response({"detail": "Internal API token is not configured."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        name = str(data.get("name") or "").strip()
        phone = str(data.get("phone") or "").strip()

        if not name or not phone:
            return Response({"detail": "name and phone are required."}, status=status.HTTP_400_BAD_REQUEST)

        bitrix_status = data.get("bitrix_status") or ContactRequest.BitrixStatus.NOT_SENT
        allowed_statuses = {choice.value for choice in ContactRequest.BitrixStatus}
        if bitrix_status not in allowed_statuses:
            bitrix_status = ContactRequest.BitrixStatus.NOT_SENT

        contact_request = ContactRequest.objects.create(
            name=name,
            company=str(data.get("company") or "Не указана").strip() or "Не указана",
            phone=phone,
            email=str(data.get("email") or "").strip(),
            comment=str(data.get("comment") or data.get("message") or "").strip(),
            product=str(data.get("product") or "").strip(),
            bitrix_status=bitrix_status,
            bitrix_contact_id=as_positive_int(data.get("bitrix_contact_id")),
            bitrix_deal_id=as_positive_int(data.get("bitrix_deal_id")),
            bitrix_contact_response=data.get("bitrix_contact_response"),
            bitrix_deal_response=data.get("bitrix_deal_response"),
            bitrix_error=str(data.get("bitrix_error") or "").strip(),
            request_payload=data.get("request_payload"),
            api_response_payload=data.get("api_response_payload"),
            ip_address=data.get("ip_address") or get_client_ip(request),
            user_agent=str(data.get("user_agent") or request.META.get("HTTP_USER_AGENT", ""))[:1000],
        )

        email_sent = False
        try:
            send_contact_email(contact_request)
        except Exception as exc:
            contact_request.email_error = Truncator(str(exc) or exc.__class__.__name__).chars(1000)
            contact_request.save(update_fields=["email_error"])
            logger.exception("Logged contact request email delivery failed: %s", contact_request.pk)
        else:
            email_sent = True
            contact_request.email_sent_at = timezone.now()
            contact_request.email_error = ""
            contact_request.save(update_fields=["email_sent_at", "email_error"])

        return Response(
            {
                "success": True,
                "id": contact_request.pk,
                "bitrix_status": contact_request.bitrix_status,
                "email_sent": email_sent,
                "email_error": contact_request.email_error,
            },
            status=status.HTTP_201_CREATED,
        )
