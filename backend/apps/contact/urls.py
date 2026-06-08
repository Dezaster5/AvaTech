from django.urls import path

from .views import ContactRequestCreateView, ContactRequestLogView


urlpatterns = [
    path("", ContactRequestCreateView.as_view(), name="contact-request-create"),
    path("log/", ContactRequestLogView.as_view(), name="contact-request-log"),
]
