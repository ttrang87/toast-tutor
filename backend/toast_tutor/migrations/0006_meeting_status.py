# Generated by Django 5.1.7 on 2025-05-18 00:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('toast_tutor', '0005_alter_meeting_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='meeting',
            name='status',
            field=models.CharField(choices=[('scheduled', 'Scheduled'), ('booked', 'Booked'), ('completed', 'Completed')], default='scheduled', max_length=20),
        ),
    ]
