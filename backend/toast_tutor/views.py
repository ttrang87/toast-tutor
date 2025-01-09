from django.shortcuts import render
from django.core.mail import send_mail
from django.utils.timezone import now
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from .models import User,ResetToken
import json

def request_reset_link(request):
    if request.method == "POST":
        body = json.loads(request.body)
        email = body.get('email')
        user = User.objects.filter(email=email).first()

        if not user:
            return JsonResponse({'success': False, 'message': 'Email not found'}, status=404)

        token = ResetToken.generate_for_user(user)
        reset_link = f"http://localhost:3000/reset-password/{token}"

        # Send email
        send_mail(
            subject="Password Reset Request",
            message=f"Click the link to reset your password: {reset_link}",
            from_email="your_email@example.com",
            recipient_list=[email],
        )

        return JsonResponse({'success': True, 'message': 'Reset link sent'})

