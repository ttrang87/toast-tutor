from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import User, TutorProfile
from ..serializers import UserSerializer, TutorProfileSerializer

@api_view(['GET'])
def get_tutor_profile(request, userId):
    try:
        user = get_object_or_404(User, id=userId)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)