from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import User
from ..serializers import TutorProfileSerializer, UserSerializer


@api_view(["POST"])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    print(serializer.is_valid())
    print(serializer.errors)
    if serializer.is_valid():
        # Create the User instance
        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )

        userId = user.id
        print("profile" in request.data)

        # Check if profile, education, course, exam, or award data exists
        if "profile" in request.data:
            # Create TutorProfile for the user
            profile_data = request.data["profile"]
            serializer = TutorProfileSerializer(data=profile_data)
            curUser = get_object_or_404(User, id=userId)
            if not serializer.is_valid():
                return Response(serializer.errors, status=400)
            if serializer.is_valid():
                serializer.save(user=curUser)

        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED,
        )

    return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user:
        user.last_login = timezone.now()  # Set last_login to the current timestamp
        user.save()  # Save the user to persist the change

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
                "userId": user.id,
                "last_login": user.last_login,
            },
            status=status.HTTP_200_OK,
        )
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def logout_user(request):
    try:
        refresh_token = request.data.get("refresh")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(
            {"message": "User logged out successfully"},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
