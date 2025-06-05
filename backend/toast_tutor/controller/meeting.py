from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from ..models import Meeting, User  # Import your custom User model
from ..serializers import MeetingSerializer


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

    serializer = MeetingSerializer(meetings, many=True)
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

    serializer = MeetingSerializer(meetings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
