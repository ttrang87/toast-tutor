from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date

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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tutor_profile')
    bio = models.TextField(blank=True)
    hourly_rate = models.IntegerField()
    teaching_style = models.JSONField(max_length=200)  # Brief description of teaching style
    avatar = models.IntegerField()
    cover = models.IntegerField()

    def __str__(self):
        return f"{self.user.username}'s Tutor Profile"

class Education(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='education_records')
    school_name = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    start_year = models.IntegerField()
    end_year = models.CharField(max_length=50, default="Present", blank=True)
    
    def __str__(self):
        return f"{self.degree} from {self.school_name}"

class Course(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_list')
    name = models.CharField(max_length=200)
    grade = models.CharField(max_length=200)
    level = models.CharField(max_length=50)  
    experience = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.name} - {self.teach_grade} - {self.level} - {self.experience}"

class Exam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exam_list')
    name = models.CharField(max_length=200)
    score = models.CharField(max_length=20)
    date = models.DateField(default=date.today)
    experience = models.CharField(max_length=20)
    
    def __str__(self):
        return f"{self.name} - {self.score} - {self.date} - {self.experience}"

class Award(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='awards')
    name = models.CharField(max_length=200)
    year = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.year})"
