from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.core.cache import cache
import json
from ..models import ChatBox, Message, User
from ..serializers import (
    ChatBoxSerializer,
    MessageSerializer,
)


@api_view(["GET"])
def get_user_chats(request):
    user_id = request.query_params.get("user_id")
    user = get_object_or_404(User, id=user_id)
    chat_boxes = ChatBox.objects.filter(user1=user) | ChatBox.objects.filter(user2=user)
    result = []

    for cb in chat_boxes:
        other_user = cb.user2 if cb.user1.id == user.id else cb.user1
        data = {
            "chat_box_id": cb.id,
            "other_user_id": other_user.id,
            "name": other_user.username,
            "avatar": other_user.tutor_profile.avatar,
            "hot_messages": get_hot_message(cb.id)
        }
        result.append(data)
    
    return Response({"chat_boxes": result}, status=200)


def get_hot_message(chat_box_id):
    chat_box = get_object_or_404(ChatBox, id = chat_box_id)
    cache_key = f"chat:hot:{chat_box.id}"
    cached = cache.get(cache_key)
    if cached:
        messages_data = json.loads(cached)
    else:
        messages = chat_box.messages.all()[:10]  # latest 10 messages
        serializer = MessageSerializer(messages, many=True)
        messages_data = serializer.data
        cache.set(cache_key, json.dumps(messages_data), timeout=3600)  # 1 hour cache TTL
    return messages_data

 

#from 10-20 messages
@api_view(["GET"])
def get_warm_message(request, chat_box_id):
    chat_box = get_object_or_404(ChatBox, id = chat_box_id)
    cache_key = f"chat:warm:{chat_box_id}"
    cached = cache.get(cache_key)
    if cached:
        messages_data = json.loads(cached)
    else: 
        messages = chat_box.messages.all()[10 : 20]  # next 20 messages
        serializer = MessageSerializer(messages, many=True)
        messages_data = serializer.data
        cache.set(cache_key, json.dumps(messages_data), timeout=300)  

    return Response({
        'messages': messages_data,
    }, status=status.HTTP_200_OK)

#from >40 messages
@api_view(["GET"])
def get_cold_message(request, chat_box_id):
    try:
        loaded = request.GET.get("loaded")
    except (TypeError, ValueError):
        return JsonResponse({"error": "Invalid or missing loaded messages"}, status=400)
    chat_box = get_object_or_404(ChatBox, id = chat_box_id)
    messages = chat_box.messages.all()[loaded : loaded+5]  # next 5 messages
    serializer = MessageSerializer(messages, many=True)
    messages_data = serializer.data
   
    return Response({
        'messages': messages_data,
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
def send_message(request):
    try:
        data = request.data  # rest_framework's request.data parses JSON automatically
        chat_box_id = data.get("chat_box_id")
        content = data.get("content")
        sender_id = data.get("sender_id")
        if not content or not sender_id or not chat_box_id:
            raise ValueError
        sender = get_object_or_404(User, id=sender_id)
    except (TypeError, ValueError):
        return JsonResponse({"error": "Invalid or missing content or sender or chat_box_id"}, status=400)

    chat_box = get_object_or_404(ChatBox, id=chat_box_id)

    new_message = Message.objects.create(chatbox=chat_box, content=content, sender=sender)

    hot_cache_key = f"chat:hot:{chat_box.id}"
    warm_cache_key = f"chat:warm:{chat_box.id}"

    # get cached messages
    hot_cached = cache.get(hot_cache_key)
    warm_cached = cache.get(warm_cache_key)

    hot_messages = json.loads(hot_cached) if hot_cached else []
    warm_messages = json.loads(warm_cached) if warm_cached else []

    # new message
    serialized_new = MessageSerializer(new_message).data
    hot_messages.insert(0, serialized_new)

    # handle overflow from hot to warm
    if len(hot_messages) > 10:
        overflow = hot_messages.pop()
        warm_messages.insert(0, overflow)
        warm_messages = warm_messages[:10] 

    cache.set(hot_cache_key, json.dumps(hot_messages), timeout=3600)
    cache.set(warm_cache_key, json.dumps(warm_messages), timeout=300)

    return Response(serialized_new, status=201)

@api_view(["GET"])
def check_exist_box(request):
    try:
        user1 = request.query_params.get("user1")
        user2 = request.query_params.get("user2")

        if not user1 or not user2:
            raise ValueError
    except (TypeError, ValueError):
        return JsonResponse({"error": "Invalid or missing data"}, status=400)

    u1 = get_object_or_404(User, id=user1)
    u2 = get_object_or_404(User, id=user2)

    if u1.id > u2.id:
        u1, u2 = u2, u1

    chatbox = ChatBox.objects.filter(user1=u1, user2=u2).first()
    
    if chatbox:
        return JsonResponse({"exists": True, "chatbox_id": chatbox.id}, status=200)
    
    return JsonResponse({"exists": False}, status=200)

@api_view(["POST"])
def start_message(request):
    try: 
        data = request.data  # rest_framework's request.data parses JSON automatically
        user1 = data.get("user1")
        user2 = data.get("user2")
        content = data.get("content")
        sender_id = data.get("sender_id")
        if not user1 or not user2 or not content or not sender_id:
            raise ValueError
        sender = get_object_or_404(User, id=sender_id)

    except (TypeError, ValueError):
        return JsonResponse({"error": "Invalid or missing data"}, status=400)
        
    u1 = get_object_or_404(User, id=user1)
    u2 = get_object_or_404(User, id=user2)

    #make sure smaller id will go first to make chatbox unique
    if u1.id > u2.id:
        u1, u2 = u2, u1 

    #create new box and add first message => always have meaningful box
    chat_box = ChatBox.objects.create(user1 = u1, user2 = u2)
    first_message = Message.objects.create(chatbox=chat_box, content=content, sender=sender)

    return JsonResponse({"chatbox_id": chat_box.id}, status=201)

