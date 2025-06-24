from django.core.cache import cache
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Award, Course, Education, Exam, TutorProfile, User, Review
from ..serializers import (
    AwardSerializer,
    CourseSerializer,
    EducationSerializer,
    ExamSerializer,
    TutorProfileSerializer,
    UserSerializer,
    ReviewSerializer,
)

# GET PROFILE


@api_view(["GET"])
def get_tutor_profile(request, userId):
    try:
        user = get_object_or_404(User, id=userId)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# FIX PROFILE


@api_view(["PUT"])
def update_tutor_profile(request, profileId):
    try:
        profile = get_object_or_404(TutorProfile, id=profileId)
        print(profile.teaching_style)
        serializer = TutorProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        errors = serializer.errors
        if "username" in errors:  # because validationError = "This username is already in use."
            return Response(
                {"error": "username_exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif "email" in errors:
            return Response({"error": "email_exists"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# EDUCATION SECTION


@api_view(["PUT"])
def update_education(request, eduId):
    try:
        education = get_object_or_404(Education, id=eduId)
        serializer = EducationSerializer(education, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_education(request, eduId):
    try:
        education = get_object_or_404(Education, id=eduId)
        education.delete()
        return Response(
            {"message": "Education entry deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def add_education(request, userId):
    try:
        user = get_object_or_404(User, id=userId)

        # Add user to the education data
        education_data = request.data

        # Create serializer with the data
        serializer = EducationSerializer(data=education_data)

        if serializer.is_valid():
            # Save education with the user
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# COURSE SECTION


@api_view(["PUT"])
def update_course(request, courseId):
    try:
        course = get_object_or_404(Course, id=courseId)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def add_course(request, userId):
    try:
        user = get_object_or_404(User, id=userId)
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_course(request, courseId):
    try:
        course = get_object_or_404(Course, id=courseId)
        course.delete()
        return Response(
            {"message": "Course deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# EXAM SECTION


@api_view(["PUT"])
def update_exam(request, examId):
    try:
        print(request.data)
        exam = get_object_or_404(Exam, id=examId)
        serializer = ExamSerializer(exam, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        print("Validation Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def add_exam(request, userId):
    try:
        user = get_object_or_404(User, id=userId)
        serializer = ExamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_exam(request, examId):
    try:
        exam = get_object_or_404(Exam, id=examId)
        exam.delete()
        return Response(
            {"message": "Exam deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# AWARD SECTION


@api_view(["PUT"])
def update_award(request, awardId):
    try:
        award = get_object_or_404(Award, id=awardId)
        serializer = AwardSerializer(award, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def add_award(request, userId):
    try:
        user = get_object_or_404(User, id=userId)
        serializer = AwardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def delete_award(request, awardId):
    try:
        award = get_object_or_404(Award, id=awardId)
        award.delete()
        return Response(
            {"message": "Award deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def add_review(request, tutorId):
    try:
        tutor = get_object_or_404(User, id=tutorId)
        review_data = request.data
        review_data["tutor"] = tutor.id  # Associate the review with the tutor

        serializer = ReviewSerializer(data=review_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_review(request, tutorId):
    cache_key = f"reviews_{tutorId}"
    cached_reviews = cache.get(cache_key)

    if cached_reviews:
        return Response(cached_reviews, status=status.HTTP_200_OK)

    try:
        tutor = get_object_or_404(User, id=tutorId)
        reviews = Review.objects.filter(tutor=tutor).select_related("user")
        response_data = {
            "tutor_name": tutor.username,
            "reviews": [
                {
                    "comment": review.comment,
                    "user_name": review.user.username,
                    "date": review.created_at.strftime("%Y-%m-%d"),
                    "rating": review.rating,
                }
                for review in reviews
            ],
        }
        cache.set(cache_key, response_data, timeout=360)  # Cache for 1 hour
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
