from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import User, TutorProfile

@api_view(['GET'])
def get_user_details(request):
    users = User.objects.all()
    user_details = []
    for user in users:

        education_records = user.education_records.all()
        education_list = [{
            'school_name': edu.school_name,
            'degree': edu.degree,
        } for edu in education_records]

        try:
            tutor_profile = user.tutor_profile
            hourly_rate = tutor_profile.hourly_rate

        except TutorProfile.DoesNotExist:
            hourly_rate = None

        details = {
            'id': user.id,
            'username': user.username,
            'education': education_list,
            'hourly_rate': hourly_rate
        }
        print("User details:", details)  
        
        try:
            user_details.append(details)
        except Exception as e:
            print(f"Error processing user {user.username}: {str(e)}")
            continue
    
    return Response({'user_details': user_details})