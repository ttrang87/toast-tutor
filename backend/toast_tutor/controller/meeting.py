from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Meeting
from ..serializers import MeetingSerializer

@api_view(["GET"])
def get_meeting(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)

@api_view(["PATCH"])
def update_meeting(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    ser = MeetingSerializer(meeting, data=request.data, partial=True)
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response(ser.data, status=status.HTTP_200_OK)

@api_view(["DELETE"])
def delete_meeting(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    meeting.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["POST"])
def create_meeting(request):
    serializer = MeetingSerializer(data=request.data)
    if serializer.is_valid():
        meeting = serializer.save()
        return Response(MeetingSerializer(meeting).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get_meetings(request):
    qs = Meeting.objects.all().order_by("start_time")
    return Response(MeetingSerializer(qs, many=True).data, status=200)

@api_view(["GET"])
def get_meetings_by_tutor(request, tutor_id: int):
    qs = (Meeting.objects
               .filter(organizer_id=tutor_id, status="scheduled")
               .order_by("start_time"))
    return Response(MeetingSerializer(qs, many=True).data, status=200)

@api_view(["POST"])
def book_meeting(request, pk: int):
    mtg = get_object_or_404(Meeting, pk=pk, status="scheduled")
    student_id = request.data.get("student")
    if not student_id:
        return Response({"detail": "student id required"}, 400)
    if mtg.organizer_id == int(student_id):
        return Response({"detail": "organizer cannot book own meeting"}, 400)

    mtg.set_pending(student_id)          # <-- new helper
    return Response(MeetingSerializer(mtg).data, 200)


@api_view(["POST"])
def confirm_payment(request, pk: int):
    """Called by front-end ‘Pay now’ button (stub for real gateway)"""
    mtg = get_object_or_404(Meeting, pk=pk, status="pending")
    if mtg.payment_expires_at and timezone.now() > mtg.payment_expires_at:
        # window expired – revert
        mtg.student = None
        mtg.status  = "scheduled"
        mtg.payment_expires_at = None
        mtg.save(update_fields=["student", "status", "payment_expires_at"])
        return Response({"detail": "payment window expired"}, 400)

    mtg.status = "booked"
    mtg.payment_expires_at = None
    mtg.save(update_fields=["status", "payment_expires_at"])
    return Response(MeetingSerializer(mtg).data, 200)


@api_view(["POST"])
def cancel_payment(request, pk: int):
    """Either user cancels or front-end auto-cancel when timer hits 0"""
    mtg = get_object_or_404(Meeting, pk=pk)
    if mtg.status != "pending":
        return Response({"detail": "nothing to cancel"}, 400)

    mtg.student = None
    mtg.status  = "scheduled"
    mtg.payment_expires_at = None
    mtg.save(update_fields=["student", "status", "payment_expires_at"])
    return Response(MeetingSerializer(mtg).data, 200)

