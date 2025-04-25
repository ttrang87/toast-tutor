from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.cache import cache
from ..models import User, Course, Exam, TutorProfile


def get_filter_options():
    """Get all unique courses and exams for filtering"""
    try:
        # Get all unique courses
        all_courses = (
            Course.objects.values("name", "grade", "experience").distinct().order_by("name")
        )

        # Get all unique exams
        all_exams = Exam.objects.values("name", "experience").distinct().order_by("name")

        return {"available_courses": list(all_courses), "available_exams": list(all_exams)}
    except Exception as e:
        print(f"Error fetching filter options: {str(e)}")
        return {"available_courses": [], "available_exams": []}


def process_single_user(user):
    """Process data for a single user"""
    try:
        # Get education records
        education_list = [
            {
                "school_name": edu.school_name,
                "degree": edu.degree,
            }
            for edu in user.education_records.all()
        ]

        # Get course records
        course_list = [
            {"name": course.name, "grade": course.grade, "experience": course.experience}
            for course in user.course_list.all()
        ]

        # Get exam records
        exam_list = [
            {
                "name": exam.name,
                "score": exam.score,
                "date": exam.date,
                "experience": exam.experience,
            }
            for exam in user.exam_list.all()
        ]

        # Get tutor profile
        try:
            tutor_profile = user.tutor_profile
            hourly_rate = tutor_profile.hourly_rate if tutor_profile else None
            avatar = tutor_profile.avatar if tutor_profile else None
        except TutorProfile.DoesNotExist:
            hourly_rate = None
            avatar = None

        # Compile user details
        return {
            "userid": user.id,
            "username": user.username,
            "education": education_list,
            "courses": course_list,
            "exams": exam_list,
            "hourly_rate": hourly_rate,
            "avatar": avatar,
        }
    except Exception as e:
        print(f"Error processing user {user.username}: {str(e)}")
        return None


def get_user_data():
    """Get all user details with related data"""
    try:
        # Get all users with related data
        users = User.objects.prefetch_related(
            "education_records", "course_list", "exam_list", "tutor_profile"
        ).all()

        # Process each user
        user_details = []
        for user in users:
            user_data = process_single_user(user)
            if user_data:
                user_details.append(user_data)

        return user_details
    except Exception as e:
        print(f"Error fetching user data: {str(e)}")
        return []


@api_view(["GET"])
def get_user_details(request):
    """
    API endpoint to get all user details and filter options
    """
    try:
        # Check cache first
        cached_data = cache.get("all_user_details")
        if cached_data:
            return Response(cached_data)

        # Get filter options
        filter_options = get_filter_options()

        # Get user details
        user_details = get_user_data()

        # Prepare response data
        response_data = {"user_details": user_details, "filter_options": filter_options}

        # Cache the results
        cache.set("all_user_details", response_data, 360)  # Cache for 6 minutes

        return Response(response_data)

    except Exception as e:
        error_message = f"Failed to fetch user details: {str(e)}"
        print(error_message)  # Log the error
        return Response({"error": error_message}, status=500)
