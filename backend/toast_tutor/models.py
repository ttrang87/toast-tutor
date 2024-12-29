from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='toast_tutor_users',  # Custom related_name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='toast_tutor_users',  # Custom related_name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username

class TutorProfile(models.Model):
    tutor = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)
    teaching_style = models.CharField(max_length=200)  # Brief description of teaching style

    def __str__(self):
        return f"{self.tutor.username}'s Profile"

class Education(models.Model):
    tutor_profile = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='education_records')
    school_name = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    start_year = models.IntegerField()
    end_year = models.CharField(max_length=50, default="Present", blank=True)
    
    def __str__(self):
        return f"{self.degree} from {self.school_name}"

class Course(models.Model):
    tutor_profile = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='course_list')
    name = models.CharField(max_length=200)
    level = models.CharField(max_length=50)  # e.g., Beginner, Intermediate, Advanced
    
    def __str__(self):
        return f"{self.name} - {self.level}"

class Award(models.Model):
    tutor_profile = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name='awards')
    name = models.CharField(max_length=200)
    year = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.year})"