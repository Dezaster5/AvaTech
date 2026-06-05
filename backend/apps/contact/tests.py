from django.core import mail
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from .models import ContactRequest
from .services import send_contact_email


EMAIL_TEST_SETTINGS = {
    "EMAIL_BACKEND": "django.core.mail.backends.locmem.EmailBackend",
    "DEFAULT_FROM_EMAIL": "AvaTech <no-reply@avtch.io>",
    "CONTACT_RECEIVER_EMAILS": ["info@avtch.io"],
    "CONTACT_RATE_LIMIT_COUNT": 100,
}


@override_settings(**EMAIL_TEST_SETTINGS)
class ContactEmailTests(TestCase):
    def test_send_contact_email_to_info_with_reply_to_and_html(self):
        contact_request = ContactRequest.objects.create(
            name="Мирас",
            company="AvaTech Test",
            phone="+7 701 971 27 77",
            email="client@example.com",
            comment="Нужна автоматизация парка",
            ip_address="127.0.0.1",
            user_agent="test-agent",
        )

        send_contact_email(contact_request)

        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ["info@avtch.io"])
        self.assertEqual(message.reply_to, ["client@example.com"])
        self.assertIn("Новая заявка AvaTech", message.subject)
        self.assertIn("AvaTech Test", message.body)
        self.assertEqual(message.alternatives[0][1], "text/html")

    def test_contact_api_saves_request_and_marks_email_as_sent(self):
        response = APIClient().post(
            "/api/contact/",
            {
                "name": "Мирас",
                "company": "AvaTech Test",
                "phone": "+7 701 971 27 77",
                "email": "client@example.com",
                "comment": "Нужна автоматизация парка",
                "website": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(mail.outbox), 1)
        contact_request = ContactRequest.objects.get()
        self.assertEqual(contact_request.email_error, "")
        self.assertIsNotNone(contact_request.email_sent_at)
        self.assertEqual(mail.outbox[0].to, ["info@avtch.io"])
