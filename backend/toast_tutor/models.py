from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now, timedelta
from django.core.exceptions import ValidationError
import hashlib
import os


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
    
class ResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_tokens')
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_at = models.DateTimeField()
    last_sent_at = models.DateTimeField(auto_now=True)

    @classmethod
    def generate_for_user(cls, user):
        print(f"Generating/retrieving token for user: {user.email}")
        
        # Check for existing valid token
        existing_token = cls.objects.filter(
            user=user,
            expiry_at__gt=now()
        ).first()
        
        print(f"Existing valid token found: {existing_token is not None}")
        
        if existing_token:
            print(f"Using existing token: {existing_token.token}")
            print(f"Token expiry: {existing_token.expiry_at}")
            # Update last_sent_at and return existing token
            existing_token.last_sent_at = now()
            existing_token.save()
            return existing_token.token
        
        print("No valid token found, creating new one")
        # If no valid token exists, create new one
        token = hashlib.sha256(os.urandom(32)).hexdigest()
        while cls.objects.filter(token=token).exists():
            token = hashlib.sha256(os.urandom(32)).hexdigest()
            
        expiry_at = now() + timedelta(minutes=15)
        reset_token = cls.objects.create(
            user=user,
            token=token,
            expiry_at=expiry_at
        )
        print(f"Created new token: {token}")
        print(f"New token expiry: {expiry_at}")
        return reset_token.token


