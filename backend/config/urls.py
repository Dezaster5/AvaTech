from django.contrib import admin
from django.conf import settings
from django.http import JsonResponse
from django.urls import include, path


def healthcheck(_request):
    return JsonResponse({"status": "ok", "service": "avtch-api"})


urlpatterns = [
    path(settings.DJANGO_ADMIN_PATH, admin.site.urls),
    path("api/health/", healthcheck, name="healthcheck"),
    path("api/contact/", include("apps.contact.urls")),
]
