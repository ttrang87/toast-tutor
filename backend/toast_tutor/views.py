# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from django.contrib.auth import authenticate
# from rest_framework_simplejwt.tokens import RefreshToken
# from .models import User, TutorProfile, Education, Course, Exam, Award
# from .serializers import UserSerializer, TutorProfileSerializer, EducationSerializer, CourseSerializer, ExamSerializer, AwardSerializer
# from django.shortcuts import get_object_or_404
# from django.utils import timezone

# @api_view(['POST'])
# def register_user(request):
#     serializer = UserSerializer(data=request.data)
#     print(request.data, serializer.is_valid())
#     print(serializer.errors)
#     if serializer.is_valid():
#         # Create the User instance
#         print(serializer.validated_data)
#         user = User.objects.create_user(
#             username=serializer.validated_data['username'],
#             email=serializer.validated_data['email'],
#             password=serializer.validated_data['password'],
#             # profile=serializer.validated_data['profile'],
#             # education=serializer.validated_data['education'],
#             # course=serializer.validated_data['course'],
#             # exam=serializer.validated_data['exam'],
#             # award=serializer.validated_data['award']
#         )

#         userId = user.id

#         # Check if profile, education, course, exam, or award data exists
#         if 'profile' in request.data:
#             # Create TutorProfile for the user
#             profile_data = request.data['profile']
#             serializer = TutorProfileSerializer(data=profile_data)
#             curUser = get_object_or_404(User, id=userId)
#             if serializer.is_valid():
#               profile = serializer.save(user=curUser)
#             # profile = TutorProfile.objects.create(
#             #     user=user,
#             #     bio=profile_data.get('bio', ''),
#             #     hourly_rate=profile_data.get('hourly_rate', 0),
#             #     teaching_style=profile_data.get('teaching_style', ''),
#             #     avatar=profile_data.get('avatar', 0),
#             #     cover=profile_data.get('cover', 0)
#             # )

#         # Handle Education Data
#         if 'education' in request.data:
#             education_data = request.data['education']
#             serializer = EducationSerializer(data=education_data)
#             curUser = get_object_or_404(User, id=userId)
#             if serializer.is_valid():
#               education = serializer.save(user=curUser)
#             # for edu in education_data:
#             #     Education.objects.create(
#             #         user=user,
#             #         school_name=edu['school_name'],
#             #         degree=edu['degree'],
#             #         start_year=edu['start_year'],
#             #         end_year=edu.get('end_year', 'Present')
#             #     )

#         # Handle Course Data
#         if 'course' in request.data:
#             course_data = request.data['course']
#             serializer = CourseSerializer(data=course_data)
#             curUser = get_object_or_404(User, id=userId)
#             if serializer.is_valid():
#               course = serializer.save(user=curUser)
#             # for course in course_data:
#             #     Course.objects.create(
#             #         user=user,
#             #         name=course['name'],
#             #         grade=course['grade'],
#             #         level=course['level'],
#             #         experience=course['experience']
#             #     )

#         # Handle Exam Data
#         if 'exam' in request.data:
#             exam_data = request.data['exam']
#             serializer = ExamSerializer(data=exam_data)
#             curUser = get_object_or_404(User, id=userId)
#             if serializer.is_valid():
#               exam = serializer.save(user=curUser)
#             # for exam in exam_data:
#             #     Exam.objects.create(
#             #         user=user,
#             #         name=exam['name'],
#             #         score=exam['score'],
#             #         date=exam['date'],
#             #         experience=exam['experience']
#             #     )

#         # Handle Award Data
#         if 'award' in request.data:
#             award_data = request.data['award']
#             serializer = AwardSerializer(data=award_data)
#             curUser = get_object_or_404(User, id=userId)
#             if serializer.is_valid():
#               award = serializer.save(user=curUser)
#             # for award in award_data:
#             #     Award.objects.create(
#             #         user=user,
#             #         name=award['name'],
#             #         year=award['year']
#             #     )

# return Response({"message": "User registered successfully"},
# status=status.HTTP_201_CREATED)

# return Response({"errors": serializer.errors},
# status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# def login_user(request):
#     username = request.data.get('username')
#     password = request.data.get('password')
#     user = authenticate(username=username, password=password)
#     if user:
#         user.last_login = timezone.now()  # Set last_login to the current timestamp
#         user.save()  # Save the user to persist the change

#         refresh = RefreshToken.for_user(user)
#         return Response({
#             "refresh": str(refresh),
#             "access": str(refresh.access_token),
#             "username": user.username,
#             "userId": user.id,
#             "last_login": user.last_login,
#         }, status=status.HTTP_200_OK)
# return Response({"error": "Invalid credentials"},
# status=status.HTTP_401_UNAUTHORIZED)

# @api_view(['POST'])
# def logout_user(request):
#     try:
#         refresh_token = request.data.get('refresh')
#         token = RefreshToken(refresh_token)
#         token.blacklist()
#         return Response({"message": "User logged out successfully"}, status=status.HTTP_200_OK)
#     except Exception as e:
# return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# # from rest_framework import status
# # from rest_framework.decorators import api_view
# # from rest_framework.response import Response
# # from django.contrib.auth import authenticate
# # from rest_framework_simplejwt.tokens import RefreshToken
# # from .models import User
# # from .serializers import UserSerializer

# # @api_view(['POST'])
# # def register_user(request):
# #     serializer = UserSerializer(data=request.data)
# #     if serializer.is_valid():
# #         user = User.objects.create_user(
# #             username=serializer.validated_data['username'],
# #             email=serializer.validated_data['email'],
# #             password=serializer.validated_data['password']
# #         )
# #         return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
# #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # @api_view(['POST'])
# # def login_user(request):
# #     username = request.data.get('username')
# #     password = request.data.get('password')
# #     user = authenticate(username=username, password=password)
# #     if user:
# #         refresh = RefreshToken.for_user(user)
# #         return Response({
# #             "refresh": str(refresh),
# #             "access": str(refresh.access_token),
# #             "username": user.username
# #         }, status=status.HTTP_200_OK)
# #     return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# # @api_view(['POST'])
# # def logout_user(request):
# #     try:
# #         refresh_token = request.data.get('refresh')
# #         token = RefreshToken(refresh_token)
# #         token.blacklist()
# #         return Response({"message": "User logged out successfully"}, status=status.HTTP_200_OK)
# #     except Exception as e:
# #         return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
