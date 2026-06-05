import logging

from django.contrib import admin
from django.contrib import messages
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
    list_display = ("name", "company", "phone", "email", "created_at", "email_sent_at", "ip_address")
    list_filter = ("created_at", "email_sent_at")
    search_fields = ("name", "company", "phone", "email", "comment")
    readonly_fields = ("created_at", "ip_address", "user_agent", "email_sent_at", "email_error")
    actions = (resend_contact_emails,)
    fieldsets = (
        ("Контакт", {"fields": ("name", "company", "phone", "email", "comment")}),
        ("Email", {"fields": ("email_sent_at", "email_error")}),
        ("Системная информация", {"fields": ("created_at", "ip_address", "user_agent")}),
    )
