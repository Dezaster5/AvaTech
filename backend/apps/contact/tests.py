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
    "INTERNAL_API_TOKEN": "test-internal-token",
    "DJANGO_SUBMISSION_LOG_TOKEN": "",
    "INTERNAL_API_TOKENS": {"test-internal-token"},
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

    def test_contact_api_accepts_short_redesign_payload(self):
        response = APIClient().post(
            "/api/contact/",
            {
                "name": "Мирас",
                "phone": "+7 701 971 27 77",
                "comment": "Интересует продукт: AvaTracker",
                "website": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        contact_request = ContactRequest.objects.get()
        self.assertEqual(contact_request.company, "Не указана")
        self.assertEqual(contact_request.email, "")
        self.assertEqual(mail.outbox[0].reply_to, [])

    def test_contact_api_accepts_internal_docker_host(self):
        response = APIClient(HTTP_HOST="backend:8000").post(
            "/api/contact/",
            {
                "name": "Мирас",
                "phone": "+7 701 971 27 77",
                "comment": "Заявка из Next контейнера",
                "website": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_contact_log_api_saves_bitrix_and_email_diagnostics(self):
        response = APIClient().post(
            "/api/contact/log/",
            {
                "name": "Мирас",
                "company": "AvaTech Test",
                "phone": "+7 701 971 27 77",
                "email": "client@example.com",
                "message": "Интересует продукт: AvaTracker",
                "product": "AvaTracker",
                "ip_address": "127.0.0.1",
                "user_agent": "test-agent",
                "bitrix_status": "success",
                "bitrix_contact_id": 12345,
                "bitrix_deal_id": 67890,
                "bitrix_contact_response": {"result": 12345},
                "bitrix_deal_response": {"result": 67890},
                "request_payload": {"name": "Мирас", "phone": "+7 701 971 27 77"},
                "api_response_payload": {"success": True, "contactId": 12345, "dealId": 67890},
            },
            HTTP_X_AVATECH_INTERNAL_TOKEN="test-internal-token",
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["email_sent"], True)
        contact_request = ContactRequest.objects.get()
        self.assertEqual(contact_request.bitrix_status, ContactRequest.BitrixStatus.SUCCESS)
        self.assertEqual(contact_request.bitrix_contact_id, 12345)
        self.assertEqual(contact_request.bitrix_deal_id, 67890)
        self.assertEqual(contact_request.bitrix_contact_response, {"result": 12345})
        self.assertEqual(contact_request.api_response_payload["dealId"], 67890)
        self.assertIsNotNone(contact_request.email_sent_at)
        self.assertEqual(contact_request.email_error, "")
        self.assertEqual(len(mail.outbox), 1)

    @override_settings(
        INTERNAL_API_TOKEN="",
        DJANGO_SUBMISSION_LOG_TOKEN="frontend-log-token",
        INTERNAL_API_TOKENS={"frontend-log-token"},
    )
    def test_contact_log_api_accepts_django_submission_log_token_alias(self):
        response = APIClient().post(
            "/api/contact/log/",
            {
                "name": "Мирас",
                "phone": "+7 701 971 27 77",
                "message": "Alias token test",
                "bitrix_status": "failed",
                "bitrix_error": "Manual test",
            },
            HTTP_X_AVATECH_INTERNAL_TOKEN="frontend-log-token",
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        contact_request = ContactRequest.objects.get()
        self.assertEqual(contact_request.bitrix_status, ContactRequest.BitrixStatus.FAILED)
        self.assertEqual(contact_request.bitrix_error, "Manual test")
