from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.mail import EmailMultiAlternatives
from django.utils.html import escape
from django.utils.text import Truncator

from .models import ContactRequest


def get_contact_recipients() -> list[str]:
    recipients = getattr(settings, "CONTACT_RECEIVER_EMAILS", None) or [settings.CONTACT_RECEIVER_EMAIL]
    return [email for email in recipients if email]


def validate_email_configuration() -> None:
    backend = getattr(settings, "EMAIL_BACKEND", "")
    if not backend.endswith("smtp.EmailBackend"):
        return

    if not settings.EMAIL_HOST:
        raise ImproperlyConfigured("EMAIL_HOST is empty. For Mail.ru set EMAIL_HOST=smtp.mail.ru.")
    if settings.EMAIL_HOST == "smtp.example.com":
        raise ImproperlyConfigured("EMAIL_HOST still uses smtp.example.com. For Mail.ru set EMAIL_HOST=smtp.mail.ru.")
    if not settings.EMAIL_HOST_USER:
        raise ImproperlyConfigured("EMAIL_HOST_USER is empty. For Mail.ru set it to info@avtch.io.")
    if not settings.EMAIL_HOST_PASSWORD:
        raise ImproperlyConfigured("EMAIL_HOST_PASSWORD is empty. Use a Mail.ru app password, not the regular mailbox password.")
    if settings.EMAIL_USE_TLS and settings.EMAIL_USE_SSL:
        raise ImproperlyConfigured("EMAIL_USE_TLS and EMAIL_USE_SSL cannot both be True.")
    if settings.EMAIL_HOST == "smtp.mail.ru" and settings.EMAIL_PORT == 465 and not settings.EMAIL_USE_SSL:
        raise ImproperlyConfigured("Mail.ru SMTP on port 465 requires EMAIL_USE_SSL=True and EMAIL_USE_TLS=False.")


def build_contact_email_messages(contact_request: ContactRequest) -> tuple[str, str, str]:
    subject_company = Truncator(contact_request.company).chars(80)
    subject = f"Новая заявка AvaTech #{contact_request.pk}: {subject_company}"
    comment = contact_request.comment or "Не указан"

    text_message = "\n".join(
        [
            "Новая заявка с сайта AvaTech",
            "",
            f"Имя: {contact_request.name}",
            f"Компания: {contact_request.company}",
            f"Телефон: {contact_request.phone}",
            f"Email: {contact_request.email}",
            "",
            "Комментарий:",
            comment,
            "",
            "Системная информация:",
            f"IP: {contact_request.ip_address or 'не определён'}",
            f"User-Agent: {contact_request.user_agent or 'не указан'}",
            f"ID заявки: {contact_request.pk}",
        ]
    )

    rows = [
        ("Имя", contact_request.name),
        ("Компания", contact_request.company),
        ("Телефон", contact_request.phone),
        ("Email", contact_request.email),
        ("Комментарий", comment),
        ("IP", contact_request.ip_address or "не определён"),
        ("User-Agent", contact_request.user_agent or "не указан"),
        ("ID заявки", str(contact_request.pk)),
    ]
    rows_html = "".join(
        f"""
        <tr>
          <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #e6edf5;color:#5f7188;width:190px;">{escape(label)}</th>
          <td style="padding:10px 12px;border-bottom:1px solid #e6edf5;color:#0f1f33;">{escape(value)}</td>
        </tr>
        """
        for label, value in rows
    )
    html_message = f"""
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f8fc;padding:24px;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #dce7f2;border-radius:8px;overflow:hidden;">
        <div style="background:#08111f;color:#ffffff;padding:22px 24px;">
          <div style="font-size:13px;color:#8ee9ff;font-weight:700;letter-spacing:.02em;">AvaTech</div>
          <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;">Новая заявка с сайта</h1>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.5;">
          <tbody>{rows_html}</tbody>
        </table>
        <div style="padding:18px 24px;color:#5f7188;font-size:13px;">
          Получатель: {escape(', '.join(get_contact_recipients()))}
        </div>
      </div>
    </div>
    """
    return subject, text_message, html_message


def send_contact_email(contact_request: ContactRequest) -> None:
    validate_email_configuration()
    subject, text_message, html_message = build_contact_email_messages(contact_request)
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=get_contact_recipients(),
        reply_to=[contact_request.email],
        headers={"X-AvaTech-Contact-Request-ID": str(contact_request.pk)},
    )
    email.attach_alternative(html_message, "text/html")
    email.send(fail_silently=False)
