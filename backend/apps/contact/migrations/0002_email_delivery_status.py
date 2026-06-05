from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("contact", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="contactrequest",
            name="email_error",
            field=models.TextField(blank=True, verbose_name="Ошибка отправки email"),
        ),
        migrations.AddField(
            model_name="contactrequest",
            name="email_sent_at",
            field=models.DateTimeField(blank=True, null=True, verbose_name="Email отправлен"),
        ),
    ]
