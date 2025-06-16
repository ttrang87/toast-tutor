from django.urls import re_path
from .consumers import UserStatusConsumer

websocket_urlpatterns = [
    re_path(r'ws/status/$', UserStatusConsumer.as_asgi()),
]
