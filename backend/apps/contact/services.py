from django.conf import settings
from django.core.mail import send_mail

from .models import ContactRequest


def send_contact_email(contact_request: ContactRequest) -> None:
    subject = f"Новая заявка AvaTech: {contact_request.company}"
    message = "\n".join(
        [
            "Новая заявка с сайта AvaTech",
            "",
            f"Имя: {contact_request.name}",
            f"Компания: {contact_request.company}",
            f"Телефон: {contact_request.phone}",
            f"Email: {contact_request.email}",
            "",
            "Комментарий:",
            contact_request.comment or "Не указан",
            "",
            f"IP: {contact_request.ip_address or 'не определён'}",
            f"User-Agent: {contact_request.user_agent or 'не указан'}",
        ]
    )
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.CONTACT_RECEIVER_EMAIL],
        fail_silently=False,
    )
