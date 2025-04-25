from rest_framework import serializers

from .models import (
    Award,
    Course,
    Education,
    Exam,
    ResetToken,
    TutorProfile,
    TutorRequest,
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


class ResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetToken
        fields = ["token", "created_at", "expiry_at"]
        read_only_fields = ["token", "created_at", "expiry_at"]
