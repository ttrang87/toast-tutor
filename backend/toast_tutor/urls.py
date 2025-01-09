from django.urls import path
from toast_tutor.controller import auth, profile

urlpatterns = [
    path('tutor/profile/<str:userId>/', profile.get_tutor_profile, name='get_tutor_profile'),
    path('password-reset/', auth.request_password_reset, name='request_password_reset'),
    path('api/reset-password/', auth.reset_password, name='reset_password')
]