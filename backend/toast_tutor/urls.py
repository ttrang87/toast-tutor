from django.urls import path
from .controller import profile

urlpatterns = [
    path('tutor/profile/<str:userId>/', profile.get_tutor_profile, name='get_tutor_profile'),
]