from django.db import models


class ContactRequest(models.Model):
    class BitrixStatus(models.TextChoices):
        NOT_SENT = "not_sent", "Не отправлялось"
        SUCCESS = "success", "Успешно"
        FAILED = "failed", "Ошибка"

    name = models.CharField("Имя", max_length=120)
    company = models.CharField("Компания", max_length=160)
    phone = models.CharField("Телефон", max_length=40)
    email = models.EmailField("Email")
    comment = models.TextField("Комментарий", blank=True)
    product = models.CharField("Продукт", max_length=160, blank=True)
    bitrix_status = models.CharField(
        "Статус Bitrix24",
        max_length=20,
        choices=BitrixStatus.choices,
        default=BitrixStatus.NOT_SENT,
    )
    bitrix_contact_id = models.PositiveIntegerField("Bitrix Contact ID", blank=True, null=True)
    bitrix_deal_id = models.PositiveIntegerField("Bitrix Deal ID", blank=True, null=True)
    bitrix_contact_response = models.JSONField("JSON ответа contact.add", blank=True, null=True)
    bitrix_deal_response = models.JSONField("JSON ответа deal.add", blank=True, null=True)
    bitrix_error = models.TextField("Ошибка Bitrix24", blank=True)
    request_payload = models.JSONField("JSON запроса формы", blank=True, null=True)
    api_response_payload = models.JSONField("JSON ответа API route", blank=True, null=True)
    ip_address = models.GenericIPAddressField("IP-адрес", blank=True, null=True)
    user_agent = models.TextField("User-Agent", blank=True)
    email_sent_at = models.DateTimeField("Email отправлен", blank=True, null=True)
    email_error = models.TextField("Ошибка отправки email", blank=True)
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self) -> str:
        return f"{self.name} / {self.company} / {self.created_at:%Y-%m-%d %H:%M}"
