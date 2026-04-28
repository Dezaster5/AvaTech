from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def healthcheck(_request):
    return JsonResponse({"status": "ok", "service": "avtch-api"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", healthcheck, name="healthcheck"),
    path("api/contact/", include("apps.contact.urls")),
]
