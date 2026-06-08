import re

from rest_framework import serializers

from .models import ContactRequest


PHONE_RE = re.compile(r"^\+?[0-9\s()\-]{7,24}$")


class ContactRequestSerializer(serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ContactRequest
        fields = ("name", "company", "phone", "email", "comment", "website")
        extra_kwargs = {
            "name": {"required": True, "allow_blank": False, "trim_whitespace": True},
            "company": {"required": False, "allow_blank": True, "trim_whitespace": True},
            "phone": {"required": True, "allow_blank": False, "trim_whitespace": True},
            "email": {"required": False, "allow_blank": True, "trim_whitespace": True},
            "comment": {"required": False, "allow_blank": True, "trim_whitespace": True},
        }

    def validate_website(self, value: str) -> str:
        if value:
            raise serializers.ValidationError("Заявка не отправлена.")
        return value

    def validate_phone(self, value: str) -> str:
        if not PHONE_RE.match(value.strip()):
            raise serializers.ValidationError("Укажите корректный номер телефона.")
        return value

    def validate(self, attrs: dict) -> dict:
        attrs.pop("website", None)
        attrs["company"] = attrs.get("company") or "Не указана"
        attrs["email"] = attrs.get("email") or ""
        return attrs
