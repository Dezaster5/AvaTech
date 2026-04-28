from django.contrib import admin

from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ("name", "company", "phone", "email", "created_at", "ip_address")
    list_filter = ("created_at",)
    search_fields = ("name", "company", "phone", "email", "comment")
    readonly_fields = ("created_at", "ip_address", "user_agent")
    fieldsets = (
        ("Контакт", {"fields": ("name", "company", "phone", "email", "comment")}),
        ("Системная информация", {"fields": ("created_at", "ip_address", "user_agent")}),
    )
