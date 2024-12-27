from django.db import models

class Student(models.Model):
    id = models.AutoField(primary_key=True)  # Auto-increment ID
    username = models.CharField(max_length=50, unique=True)  # Unique for Student model
    email = models.EmailField(unique=True)  # Unique email for students
    password = models.CharField(max_length=128)  # Store hashed passwords as strings

    def __str__(self):
        return self.username


class Tutor(models.Model):
    id = models.AutoField(primary_key=True)  # Auto-increment ID
    username = models.CharField(max_length=50, unique=True)  # Unique for Tutor model
    email = models.EmailField(unique=True)  # Unique email for tutors
    password = models.CharField(max_length=128)  # Store hashed passwords as strings

    def __str__(self):
        return self.username

