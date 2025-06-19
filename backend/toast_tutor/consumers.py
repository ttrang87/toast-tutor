# myapp/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json

class OnlineStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "online_users"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        if self.scope["user"].is_authenticated:
            await self.set_user_status(self.scope["user"].id, "Online")
            # print(f"User {self.scope['user'].id} connected and marked as online.")
            await self.broadcast_online_users()

    async def disconnect(self, close_code):
        # Remove from group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

        # Mark user as offline
        if self.scope["user"].is_authenticated:
            await self.set_user_status(self.scope["user"].id, "Offline")
            await self.broadcast_online_users()

    async def receive(self, text_data):
        # You can handle messages from client if needed
        pass

    @database_sync_to_async
    def set_user_status(self, user_id, status):
        from django.apps import apps
        User = apps.get_model('auth', 'User')
        user = User.objects.get(id=user_id)
        user.status = status
        user.save()

    @database_sync_to_async
    def broadcast_online_users(self):
        from django.apps import apps
        User = apps.get_model('auth', 'User')
        online_users = User.objects.filter(status="Online")
        online_usernames = [user.username for user in online_users]
        self.channel_layer.group_send(
            self.group_name,
            {
                "type": "send_online_users",
                "online_users": online_usernames
            }
        )

    async def send_online_users(self, event):
        await self.send(text_data=json.dumps({
            "online_users": event["online_users"]
        }))
