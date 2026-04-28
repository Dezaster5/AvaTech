# Generated for AvaTech website.
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ContactRequest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120, verbose_name="Имя")),
                ("company", models.CharField(max_length=160, verbose_name="Компания")),
                ("phone", models.CharField(max_length=40, verbose_name="Телефон")),
                ("email", models.EmailField(max_length=254, verbose_name="Email")),
                ("comment", models.TextField(blank=True, verbose_name="Комментарий")),
                ("ip_address", models.GenericIPAddressField(blank=True, null=True, verbose_name="IP-адрес")),
                ("user_agent", models.TextField(blank=True, verbose_name="User-Agent")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")),
            ],
            options={
                "verbose_name": "Заявка",
                "verbose_name_plural": "Заявки",
                "ordering": ["-created_at"],
            },
        ),
    ]
