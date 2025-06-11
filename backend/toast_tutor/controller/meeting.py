from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta

from ..serializers import MeetingSerializer
from django.db.models import Q
from ..models import Meeting, User
from ..tasks import send_reminder


# pk = primary key
@api_view(["GET"])
def get_meeting(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    # Pass request context to serializer
    return Response(
        MeetingSerializer(meeting, context={"request": request}).data, status=status.HTTP_200_OK
    )


@api_view(["GET"])
def get_meetings(request):
    meetings = Meeting.objects.all().order_by("start_time")
    # Pass request context to serializer
    return Response(
        MeetingSerializer(meetings, many=True, context={"request": request}).data, status=200
    )


@api_view(["GET"])
def get_meetings_by_tutor(request, tutor_id):
    meetings = Meeting.objects.filter(organizer_id=tutor_id, status="scheduled").order_by(
        "start_time"
    )
    # Pass request context to serializer
    return Response(
        MeetingSerializer(meetings, many=True, context={"request": request}).data, status=200
    )


@api_view(["POST"])
def create_meeting(request):
    serializer = MeetingSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        meeting = serializer.save()
        return Response(
            MeetingSerializer(meeting, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
def update_meeting(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    serializer = MeetingSerializer(
        meeting, data=request.data, partial=True, context={"request": request}
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    if request.data.get("google_meet_link"):
        reminder_time = meeting.start_time - timedelta(minutes=5)
        if (
            meeting.organizer
            and getattr(meeting.organizer, "email", None)
            and reminder_time > timezone.now()
        ):
            send_reminder.apply_async(
                args=[meeting.organizer.email, reminder_time, request.data["google_meet_link"]],
                eta=reminder_time,
            )
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
def delete_meeting(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    meeting.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def book_meeting(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk, status="scheduled")
    student_id = request.data.get("student")
    if not student_id:
        return Response({"detail": "student id required"}, status=status.HTTP_400_BAD_REQUEST)
    if meeting.organizer_id == int(student_id):
        return Response(
            {"detail": "organizer cannot book own meeting"}, status=status.HTTP_400_BAD_REQUEST
        )

    meeting.set_pending(student_id)
    # Pass request context to serializer - this was missing!
    return Response(
        MeetingSerializer(meeting, context={"request": request}).data, status=status.HTTP_200_OK
    )


@api_view(["POST"])
def confirm_payment(request, pk):

    meeting = get_object_or_404(Meeting, pk=pk, status="pending")

    if meeting.payment_expires_at and timezone.now() > meeting.payment_expires_at:
        meeting.student = None
        meeting.status = "scheduled"
        meeting.payment_expires_at = None
        meeting.save(update_fields=["student", "status", "payment_expires_at"])
        return Response({"detail": "payment window expired"}, status=status.HTTP_400_BAD_REQUEST)

    # if confirmed payment
    meeting.status = "booked"
    meeting.payment_expires_at = None
    meeting.save(update_fields=["status", "payment_expires_at"])
    # Pass request context to serializer
    return Response(
        MeetingSerializer(meeting, context={"request": request}).data, status=status.HTTP_200_OK
    )


@api_view(["POST"])
def cancel_payment(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    if meeting.status != "pending":
        return Response({"detail": "nothing to cancel"}, status=status.HTTP_400_BAD_REQUEST)

    meeting.student = None
    meeting.status = "scheduled"
    meeting.payment_expires_at = None
    # Note: google_event_id and google_meet_link are preserved when canceling
    meeting.save(update_fields=["student", "status", "payment_expires_at"])
    # Pass request context to serializer
    return Response(
        MeetingSerializer(meeting, context={"request": request}).data, status=status.HTTP_200_OK
    )


@api_view(["GET"])
def get_user_meetings(request, user_id):
    """
    Fetch all meetings for a specific user (as organizer or student)
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Get meetings where user is either organizer or student
    meetings = Meeting.objects.filter(Q(organizer=user) | Q(student=user)).order_by("start_time")

    # Pass context with request and the specific user
    serializer = MeetingSerializer(meetings, many=True, context={"request": request, "user": user})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_user_meetings_by_status(request, user_id, meeting_status):
    """
    Fetch meetings for a specific user filtered by status
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Validate status
    valid_statuses = ["scheduled", "booked", "completed"]
    if meeting_status not in valid_statuses:
        return Response(
            {"error": "Invalid status. Valid options: scheduled, booked, completed"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    meetings = Meeting.objects.filter(
        Q(organizer=user) | Q(student=user), status=meeting_status
    ).order_by("start_time")

    # Pass context with request and the specific user
    serializer = MeetingSerializer(meetings, many=True, context={"request": request, "user": user})
    return Response(serializer.data, status=status.HTTP_200_OK)
