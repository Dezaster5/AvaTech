import logging
import json

from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html
from django.utils import timezone
from django.utils.text import Truncator

from .models import ContactRequest
from .services import send_contact_email


logger = logging.getLogger(__name__)


@admin.action(description="Повторно отправить выбранные заявки на email")
def resend_contact_emails(modeladmin, request, queryset):
    sent_count = 0
    failed_count = 0

    for contact_request in queryset:
        try:
            send_contact_email(contact_request)
        except Exception as exc:
            failed_count += 1
            contact_request.email_error = Truncator(str(exc) or exc.__class__.__name__).chars(1000)
            contact_request.save(update_fields=["email_error"])
            logger.exception("Contact request email resend failed: %s", contact_request.pk)
        else:
            sent_count += 1
            contact_request.email_sent_at = timezone.now()
            contact_request.email_error = ""
            contact_request.save(update_fields=["email_sent_at", "email_error"])

    level = messages.SUCCESS if failed_count == 0 else messages.WARNING
    modeladmin.message_user(
        request,
        f"Повторная отправка: успешно {sent_count}, с ошибкой {failed_count}.",
        level=level,
    )


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "phone",
        "email",
        "product",
        "bitrix_status_badge",
        "bitrix_contact_id",
        "bitrix_deal_id",
        "email_status_badge",
        "created_at",
    )
    list_filter = ("bitrix_status", "created_at", "email_sent_at", "product")
    search_fields = (
        "name",
        "company",
        "phone",
        "email",
        "comment",
        "product",
        "=bitrix_contact_id",
        "=bitrix_deal_id",
    )
    readonly_fields = (
        "created_at",
        "ip_address",
        "user_agent",
        "email_sent_at",
        "email_error",
        "bitrix_status",
        "bitrix_contact_id",
        "bitrix_deal_id",
        "bitrix_error",
        "request_payload_pretty",
        "api_response_payload_pretty",
        "bitrix_contact_response_pretty",
        "bitrix_deal_response_pretty",
    )
    actions = (resend_contact_emails,)
    fieldsets = (
        ("Контакт", {"fields": ("name", "company", "phone", "email", "product", "comment")}),
        (
            "Bitrix24",
            {
                "fields": (
                    "bitrix_status",
                    "bitrix_contact_id",
                    "bitrix_deal_id",
                    "bitrix_error",
                    "bitrix_contact_response_pretty",
                    "bitrix_deal_response_pretty",
                )
            },
        ),
        ("Email", {"fields": ("email_sent_at", "email_error")}),
        (
            "JSON диагностика",
            {
                "classes": ("collapse",),
                "fields": ("request_payload_pretty", "api_response_payload_pretty"),
            },
        ),
        ("Системная информация", {"fields": ("created_at", "ip_address", "user_agent")}),
    )

    @admin.display(description="Bitrix24")
    def bitrix_status_badge(self, obj: ContactRequest):
        colors = {
            ContactRequest.BitrixStatus.SUCCESS: "#0f9f6e",
            ContactRequest.BitrixStatus.FAILED: "#dc2626",
            ContactRequest.BitrixStatus.NOT_SENT: "#6b7280",
        }
        return format_html(
            '<strong style="color:{};">{}</strong>',
            colors.get(obj.bitrix_status, "#6b7280"),
            obj.get_bitrix_status_display(),
        )

    @admin.display(description="Email")
    def email_status_badge(self, obj: ContactRequest):
        if obj.email_sent_at:
            return format_html('<strong style="color:#0f9f6e;">Отправлено</strong>')
        if obj.email_error:
            return format_html('<strong style="color:#dc2626;">Ошибка</strong>')
        return format_html('<span style="color:#6b7280;">Не отправлялось</span>')

    def pretty_json(self, value):
        if value in (None, ""):
            return "—"
        return format_html(
            '<pre style="max-width:960px;white-space:pre-wrap;word-break:break-word;'
            'background:#0f172a;color:#e5eefc;padding:12px;border-radius:8px;'
            'font-size:12px;line-height:1.5;">{}</pre>',
            json.dumps(value, ensure_ascii=False, indent=2),
        )

    @admin.display(description="JSON запроса формы")
    def request_payload_pretty(self, obj: ContactRequest):
        return self.pretty_json(obj.request_payload)

    @admin.display(description="JSON ответа API route")
    def api_response_payload_pretty(self, obj: ContactRequest):
        return self.pretty_json(obj.api_response_payload)

    @admin.display(description="JSON ответа Bitrix contact.add")
    def bitrix_contact_response_pretty(self, obj: ContactRequest):
        return self.pretty_json(obj.bitrix_contact_response)

    @admin.display(description="JSON ответа Bitrix deal.add")
    def bitrix_deal_response_pretty(self, obj: ContactRequest):
        return self.pretty_json(obj.bitrix_deal_response)
