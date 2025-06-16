import hashlib
import os
from datetime import date, timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now
from django.utils import timezone


class User(AbstractUser):
    email = models.EmailField(unique=True)
    status = models.CharField(max_length=20, default="Offline")
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="toast_tutor_users",  # Custom related_name
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="toast_tutor_users",  # Custom related_name
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def __str__(self):
        return self.username


class TutorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="tutor_profile")
    bio = models.TextField(blank=True)
    hourly_rate = models.IntegerField()
    # Brief description of teaching style
    teaching_style = models.JSONField(max_length=200)
    avatar = models.IntegerField()
    cover = models.IntegerField()

    def __str__(self):
        return f"{self.user.username}'s Tutor Profile"


class Education(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="education_records")
    school_name = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    start_year = models.IntegerField()
    end_year = models.CharField(max_length=50, default="Present", blank=True)

    def __str__(self):
        return f"{self.degree} from {self.school_name}"


class Course(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="course_list")
    name = models.CharField(max_length=200)
    grade = models.IntegerField()
    level = models.CharField(max_length=50)
    experience = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.name} - {self.grade} - {self.level} - {self.experience}"


class Exam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="exam_list")
    name = models.CharField(max_length=200)
    score = models.CharField(max_length=20)
    date = models.DateField(default=date.today)
    experience = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.name} - {self.score} - {self.date} - {self.experience}"


class Award(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="awards")
    name = models.CharField(max_length=200)
    year = models.IntegerField()

    def __str__(self):
        return f"{self.name} ({self.year})"


class Meeting(models.Model):
    STATUS_SCHEDULED = "scheduled"
    STATUS_PENDING = "pending"
    STATUS_BOOKED = "booked"

    STATUS_CHOICES = [
        (STATUS_SCHEDULED, "Scheduled"),
        (STATUS_PENDING, "Pending-Payment"),
        (STATUS_BOOKED, "Booked"),
    ]

    organizer = models.ForeignKey(User, related_name="organized_meetings", on_delete=models.CASCADE)
    student = models.ForeignKey(
        User, related_name="booked_meetings", null=True, blank=True, on_delete=models.SET_NULL
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_SCHEDULED)

    payment_expires_at = models.DateTimeField(null=True, blank=True)
    google_event_id = models.CharField(max_length=128, blank=True, null=True)
    google_meet_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_pending(self, student_id: int):
        """Set meeting as pending and start 5-minute payment window."""
        self.student_id = student_id
        self.status = self.STATUS_PENDING
        self.payment_expires_at = timezone.now() + timedelta(minutes=5)
        self.save(update_fields=["student", "status", "payment_expires_at"])

    def __str__(self):
        return f"Meeting - {self.start_time.strftime('%Y-%m-%d %H:%M')}"


class ResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reset_tokens")
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_at = models.DateTimeField()
    last_sent_at = models.DateTimeField(auto_now=True)

    @classmethod
    def generate_for_user(cls, user):
        print(f"Generating/retrieving token for user: {user.email}")

        # Check for existing valid token
        existing_token = cls.objects.filter(user=user, expiry_at__gt=now()).first()

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
        reset_token = cls.objects.create(user=user, token=token, expiry_at=expiry_at)
        print(f"Created new token: {token}")
        print(f"New token expiry: {expiry_at}")
        return reset_token.token


class TutorRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("matched", "Matched"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tutor_requests")
    # service = models.CharField(max_length=10)
    # request_type = models.CharField(max_length=10)
    # subject_name = models.CharField(max_length=200)  # Name of exam or course
    # min_pay = models.IntegerField()
    # max_pay = models.IntegerField()
    # grade = models.CharField(max_length=20)
    # aim = models.CharField(max_length=40)
    # teaching_styles = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    class Meta:
        ordering = ["-created_at"]


class Customer(models.Model):
    stripe_customer_id = models.CharField(max_length=255, unique=True)
    email = models.EmailField()
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Payment(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    stripe_payment_intent_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)


class Review(models.Model):
    tutor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_reviews")
    comment = models.TextField(default="No comment provided")
    created_at = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]
