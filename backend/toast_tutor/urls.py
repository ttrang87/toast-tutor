from django.urls import path
from toast_tutor.controller import auth, profile, tutorlist
from .controller.tutorlist import get_user_details

urlpatterns = [
    path('tutor/profile/<str:userId>/', profile.get_tutor_profile, name='get_tutor_profile'),
    path('password-reset/', auth.request_password_reset, name='request_password_reset'),
    path('api/reset-password/', auth.reset_password, name='reset_password'),
    path('api/tutors/', get_user_details, name='get_user_details'),  # Add this route
]