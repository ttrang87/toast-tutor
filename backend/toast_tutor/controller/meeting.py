from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone

from ..models import Meeting, User
from ..serializers import MeetingSerializer
from ..tasks import send_reminder

@api_view(["GET", "PATCH"])             
def meeting_detail_or_update(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    if request.method == "GET":
        return Response(MeetingSerializer(meeting).data)
    allowed = {"google_event_id", "google_meet_link"}
    partial = {k: v for k, v in request.data.items() if k in allowed}

    ser = MeetingSerializer(meeting, data=partial, partial=True)
    ser.is_valid(raise_exception=True)
    ser.save()
    if partial.get("google_meet_link"):
        reminder_time = meeting.start_time - timedelta(minutes=5)
        if (
            meeting.organizer and getattr(meeting.organizer, "email", None)
            and reminder_time > timezone.now()
        ):
            send_reminder.apply_async(
                args=[meeting.organizer.email, reminder_time, partial["google_meet_link"]],
                eta=reminder_time
            )
    return Response(ser.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def create_meeting(request):
    serializer = MeetingSerializer(data=request.data)
    if serializer.is_valid():
        meeting = serializer.save()
        return Response(MeetingSerializer(meeting).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get_meetings(request):
    qs = Meeting.objects.all().order_by("-start_time")
    return Response(MeetingSerializer(qs, many=True).data, status=200)

@api_view(["POST"])
def book_meeting(request, pk: int):
    mtg = get_object_or_404(Meeting, pk=pk, status="scheduled")

    student_id = request.data.get("student")
    if not student_id:
        return Response({"detail": "student id required"}, 400)
    if mtg.organizer_id == int(student_id):
        return Response({"detail": "organizer cannot book own meeting"}, 400)

    mtg.student_id = student_id
    mtg.status     = "booked"
    mtg.save(update_fields=["student", "status"])
    return Response(MeetingSerializer(mtg).data, 200)