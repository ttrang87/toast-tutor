from rest_framework import serializers
from .models import User, TutorProfile, Education, Course, Award, ResetToken

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['school_name', 'degree', 'start_year', 'end_year']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name', 'level']

class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = ['name', 'year']

class TutorProfileSerializer(serializers.ModelSerializer):
    education_records = EducationSerializer(many=True, read_only=True)
    course_list = CourseSerializer(many=True, read_only=True)
    awards = AwardSerializer(many=True, read_only=True)

    class Meta:
        model = TutorProfile
        fields = ['bio', 'hourly_rate', 'teaching_style', 'education_records', 'course_list', 'awards']

class UserSerializer(serializers.ModelSerializer):
    profile = TutorProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'profile']

class ResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResetToken
        fields = ['token', 'created_at', 'expiry_at']
        read_only_fields = ['token', 'created_at', 'expiry_at']