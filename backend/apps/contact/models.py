from django.db import models


class ContactRequest(models.Model):
    name = models.CharField("Имя", max_length=120)
    company = models.CharField("Компания", max_length=160)
    phone = models.CharField("Телефон", max_length=40)
    email = models.EmailField("Email")
    comment = models.TextField("Комментарий", blank=True)
    ip_address = models.GenericIPAddressField("IP-адрес", blank=True, null=True)
    user_agent = models.TextField("User-Agent", blank=True)
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"

    def __str__(self) -> str:
        return f"{self.name} / {self.company} / {self.created_at:%Y-%m-%d %H:%M}"
