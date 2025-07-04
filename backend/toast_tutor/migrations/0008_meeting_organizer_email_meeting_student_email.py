# Generated by Django 5.1.7 on 2025-05-19 13:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("toast_tutor", "0007_remove_meeting_description_remove_meeting_title"),
    ]

    operations = [
        migrations.AddField(
            model_name="meeting",
            name="organizer_email",
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AddField(
            model_name="meeting",
            name="student_email",
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
