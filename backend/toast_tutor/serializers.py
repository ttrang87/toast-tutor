from rest_framework import serializers

from .models import (
    Award,
    Course,
    Education,
    Exam,
    ResetToken,
    TutorProfile,
    TutorRequest,
    Meeting,
    User,
    Review,
)


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ["id", "school_name", "degree", "start_year", "end_year"]


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "name", "grade", "level", "experience"]


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = [
            "id",
            "name",
            "score",
            "date",
            "experience",
        ]  # Include 'id' here


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = ["id", "name", "year"]  # Include 'id' here


class TutorProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email")
    username = serializers.CharField(source="user.username")

    class Meta:
        model = TutorProfile
        fields = [
            "id",
            "email",
            "username",
            "bio",
            "hourly_rate",
            "teaching_style",
            "avatar",
            "cover",
        ]
        read_only_fields = ["id"]

    # def validate_email(self, value):
    #     user_id = self.instance.user.id if self.instance else None
    #     if User.objects.exclude(id=user_id).filter(email=value).exists():
    #         raise serializers.ValidationError("This email is already in use.")
    #     return value

    # def validate_username(self, value):
    #     user_id = self.instance.user.id if self.instance else None
    #     if User.objects.exclude(id=user_id).filter(username=value).exists():
    #         raise serializers.ValidationError("This username is already in use.")
    #     return value

    def update(self, instance, validated_data):
        # Get user data if provided
        user_data = {}
        if "user" in validated_data:
            user_data = validated_data.pop("user")

        # Update user fields if provided
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        # Update TutorProfile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class TutorRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorRequest
        fields = ["id", "user", "description", "status", "created_at"]
        read_only_fields = ["id", "created_at"]


class UserSerializer(serializers.ModelSerializer):
    profile = TutorProfileSerializer(source="tutor_profile", required=False)
    education = EducationSerializer(source="education_records", many=True, required=False)
    course = CourseSerializer(source="course_list", many=True, required=False)
    exam = ExamSerializer(source="exam_list", many=True, required=False)
    award = AwardSerializer(source="awards", many=True, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "profile",
            "education",
            "course",
            "exam",
            "award",
        ]


class ResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetToken
        fields = ["token", "created_at", "expiry_at"]
        read_only_fields = ["token", "created_at", "expiry_at"]


class MeetingSerializer(serializers.ModelSerializer):
    organizer_name = serializers.CharField(source="organizer.get_full_name", read_only=True)
    student_name = serializers.CharField(source="student.get_full_name", read_only=True)

    class Meta:
        model = Meeting
        fields = [
            "id",
            "status",
            "start_time",
            "end_time",
            "google_event_id",
            "google_meet_link",
            "created_at",
            "organizer",
            "student",
            "organizer_name",
            "student_name",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Transform to match frontend format
        if instance.start_time:
            data["date"] = instance.start_time.strftime("%Y-%m-%d")
            data["time"] = instance.start_time.strftime("%H:%M")

        # Calculate duration
        if instance.start_time and instance.end_time:
            duration = instance.end_time - instance.start_time
            duration_minutes = int(duration.total_seconds() / 60)
            hours = duration_minutes // 60
            minutes = duration_minutes % 60
            if hours > 0:
                data["duration"] = f"{hours}h {minutes}m"
            else:
                data["duration"] = f"{minutes}m"

        # Status titles fallback
        status_titles = {
            "scheduled": "Scheduled Meeting",
            "booked": "Booked Meeting",
            "completed": "Completed Meeting",
        }

        # Set title based on attendees and current user's perspective
        if instance.student and instance.organizer:
            if instance.student != instance.organizer:
                # Get the user from context (the user whose meetings we're fetching)
                current_user = self.context.get("user") or self.context["request"].user

                if current_user == instance.student:
                    # Current user is student, show organizer
                    data["title"] = (
                        f"""Meeting with {
                            instance.organizer.get_full_name() or instance.organizer.username
                        }"""
                    )
                elif current_user == instance.organizer:
                    # Current user is organizer, show student
                    data["title"] = (
                        f"""Meeting with {
                            instance.student.get_full_name() or instance.student.username
                        }"""
                    )
                else:
                    # Fallback for other users (admin, etc.)
                    data["title"] = (
                        f"Meeting: {instance.student.get_full_name() or instance.student.username} "
                        f"& {instance.organizer.get_full_name() or instance.organizer.username}"
                    )
            else:
                data["title"] = "Personal Meeting"
        else:
            data["title"] = status_titles.get(instance.status, "Meeting")

        # Set type based on google_meet_link
        data["type"] = "Online Meeting" if instance.google_meet_link else "Meeting"

        # Set location - keep it as display name, not the full URL
        data["location"] = "Google Meet" if instance.google_meet_link else "TBD"

        # Create attendees list
        attendees = []
        if instance.organizer:
            attendees.append(instance.organizer.get_full_name() or instance.organizer.username)
        if instance.student and instance.student != instance.organizer:
            attendees.append(instance.student.get_full_name() or instance.student.username)
        data["attendees"] = attendees

        # Set organizer name for display
        data["organizer"] = (
            instance.organizer.get_full_name() or instance.organizer.username
            if instance.organizer
            else ""
        )

        # Add description
        meeting_type = "online" if instance.google_meet_link else "in-person"
        data["description"] = (
            f"{meeting_type.title()} meeting scheduled for "
            f"{data.get('date', '')} at {data.get('time', '')}"
        )

        return data


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "tutor", "user", "comment", "created_at", "rating"]
        read_only_fields = ["id", "created_at"]
