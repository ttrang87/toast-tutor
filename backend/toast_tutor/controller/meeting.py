from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..models import Meeting
from ..serializers import MeetingSerializer

# pk = primary key
@api_view(["GET"])
def get_meeting(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_meetings(request, pk):
    meetings = Meeting.objects.all().order_by("start_time")
    return Response(MeetingSerializer(meetings, many=True).data, status=200)

@api_view(["GET"])
def get_meetings_by_tutor(request, tutor_id):
    meetings = (Meeting.objects
                .filter(organizer_id=tutor_id, status="scheduled")
                .order_by("start_time"))
    return Response(MeetingSerializer(meetings, many=True).data, status=200)

    
@api_view(["POST"])
def create_meeting(request, pk):
    serializer = MeetingSerializer(data=request.data)
    if serializer.is_valid():
        meeting = serializer.save()
        return Response(MeetingSerializer(meeting).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
def update_meeting(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    serializer = MeetingSerializer(meeting, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
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
        return Response({"detail": "organizer cannot book own meeting"}, status=status.HTTP_400_BAD_REQUEST)

    meeting.set_pending(student_id)
    return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)

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
    return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)

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
    return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)


