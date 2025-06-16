import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User

class UserStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_authenticated:
            self.user = self.scope['user']
            await self.channel_layer.group_add(
                'online_users',
                self.channel_name
            )
            await self.accept()
            await self.update_user_status('Online')
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'user'):
            await self.channel_layer.group_discard(
                'online_users',
                self.channel_name
            )
            await self.update_user_status('Offline')

    async def receive(self, text_data):
        pass

    @sync_to_async
    def update_user_status(self, status):
        self.user.status = status
        self.user.save()