from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Meeting, User
from ..serializers import MeetingSerializer

@api_view(["GET", "PATCH"])             
def meeting_detail_or_update(request, pk):
    meeting = get_object_or_404(Meeting, pk=pk)
    if request.method == "GET":
        return Response(MeetingSerializer(meeting).data)
    
    serializer = MeetingSerializer(meeting, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)

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
    return Response(MeetingSerializer(qs, many=True).data, status=200)\

@api_view(["GET"])
def get_meetings_by_tutor(request, tutor_id: int):
    qs = (Meeting.objects
               .filter(organizer_id=tutor_id, status="scheduled")  # optional filter
               .order_by("-start_time"))
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