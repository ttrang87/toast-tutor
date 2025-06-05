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


class MeetingSerializer(serializers.ModelSerializer):
    organizer_id = serializers.IntegerField(source="organizer.id", read_only=True)
    organizer_name = serializers.CharField(source="organizer.username", read_only=True)

    # Custom method to conditionally hide google fields based on status and user
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        current_user_id = None
        if request and hasattr(request, "user") and request.user.is_authenticated:
            current_user_id = request.user.ud

        # Hide google_event_id and google_meet_link for non-participants when status is not booked
        # or when the meeting is scheduled/pending and user is not the organizer
        if instance.status in ["scheduled", "pending"]:
            if current_user_id != instance.organizer_id:
                data["google_event_id"] = None
                data["google_meet_link"] = None
        elif instance.status == "booked":
            if current_user_id not in [
                instance.organizer_id,
                instance.student_id if instance.student else None,
            ]:
                data["google_event_id"] = None
                data["google_meet_link"] = None

        return data

    class Meta:
        model = Meeting
        fields = [
            "id",
            "organizer_id",
            "organizer_name",
            "organizer",
            "student",
            "start_time",
            "end_time",
            "status",
            "google_event_id",
            "google_meet_link",
            "created_at",
            "payment_expires_at",
        ]
        extra_kwargs = {
            "student": {"required": False, "allow_null": True},
        }


class ResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetToken
        fields = ["token", "created_at", "expiry_at"]
        read_only_fields = ["token", "created_at", "expiry_at"]
