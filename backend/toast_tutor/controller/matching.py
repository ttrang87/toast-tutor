from django.core.cache import cache
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import TutorRequest, TutorProfile, User, Exam, Course
from .algorithm import TutorMatcher


@api_view(['POST'])
def find_tutors(request):
    # create new request
    req = request.data
    userId = req.get('userId')
    request_type = req.get('request_type')
    subject_name = req.get('subject_name')
    grade = int(req.get('grade'))
    aim = req.get('aim')
    max_score = req.get('max_score')
    description = req.get('description')
    min_pay = req.get('min_pay')
    max_pay = req.get('max_pay')
    teaching_styles = req.get('teaching_styles')

    user = get_object_or_404(User, id=userId)

    try:
        TutorRequest.objects.create(
            user=user,
            description=description
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    pay_range = f"{min_pay}-{max_pay}"
    cache_key = f'tutors:{subject_name}:{pay_range}'

    tutors = cache.get(cache_key)

    if not tutors:
        if request_type == 'exam':
            matching_items = Exam.objects.filter(name=subject_name)

        elif request_type == 'subject':
            matching_items = Course.objects.filter(name=subject_name)

        matching_user_ids = matching_items.values_list(
            'user_id', flat=True).distinct()

        tutors = []
        for user_id in matching_user_ids:
            try:
                tutor = User.objects.get(id=user_id)
                if min_pay <= tutor.tutor_profile.hourly_rate <= max_pay:
                    tutors.append(tutor)
            except (User.DoesNotExist, TutorProfile.DoesNotExist):
                continue

        if tutors:
            cache.set(cache_key, tutors, timeout=120)
        else:
            return Response([], status=status.HTTP_200_OK)

    ranked_tutors = []

    request_data = {
        'type': request_type,
        'grade': grade,
        'aim': aim,
        'max_score': max_score,
        'teaching_styles': teaching_styles,
        'min_pay': min_pay
    }

    for tutor in tutors:
        try:
            if request_type == 'subject':
                # Get matching courses for this tutor
                matching_course = Course.objects.filter(
                    user_id=tutor.id,
                    name=subject_name,
                    grade=grade
                ).first()

                if matching_course:
                    tutor_data = {
                        'score': matching_course.level,
                        'experience': matching_course.experience,
                        'teaching_styles': tutor.tutor_profile.teaching_style,
                        'hourly_rate': tutor.tutor_profile.hourly_rate
                    }

                    matcher = TutorMatcher(tutor_data, request_data)
                    matchScore = matcher.calculate_overall_score()

                    if matchScore > 0:
                        first_school = None
                        education_records = tutor.education_records.all()
                        if education_records and len(education_records) > 0:
                            first_school = education_records.first().school_name

                        ranked_tutors.append({
                            'userId': tutor.id,
                            'username': tutor.username,
                            'avatar': tutor.tutor_profile.avatar,
                            'school': first_school,
                            'score': matching_course.level,
                            'experience': matching_course.experience,
                            'teachingStyles': tutor.tutor_profile.teaching_style,
                            'hourlyRate': tutor.tutor_profile.hourly_rate,
                            'matchScore': matchScore
                        })

            else:  # exam type
                matching_exam = Exam.objects.filter(
                    user_id=tutor.id,
                    name=subject_name,
                    score__gte=float(aim) - 0.01
                ).first()

                if matching_exam:
                    tutor_data = {
                        'score': matching_exam.score,
                        'experience': matching_exam.experience,
                        'teaching_styles': tutor.tutor_profile.teaching_style,
                        'hourly_rate': tutor.tutor_profile.hourly_rate
                    }

                    matcher = TutorMatcher(tutor_data, request_data)
                    matchScore = matcher.calculate_overall_score()

                    if matchScore > 0:
                        first_school = None
                        education_records = tutor.education_records.all()
                        if education_records and len(education_records) > 0:
                            first_school = education_records.first().school_name
                        ranked_tutors.append({
                            'userId': tutor.id,
                            'username': tutor.username,
                            'avatar': tutor.tutor_profile.avatar,
                            'school': first_school,
                            'score': matching_exam.score,
                            'experience': matching_exam.experience,
                            'teachingStyles': tutor.tutor_profile.teaching_style,
                            'hourlyRate': tutor.tutor_profile.hourly_rate,
                            'matchScore': matchScore
                        })

        except Exception as e:
            print(f"Error processing tutor {tutor.id}: {str(e)}")
            continue

    # Sort tutors by match score
    ranked_tutors.sort(key=lambda x: x['matchScore'], reverse=True)

    return Response(ranked_tutors, status=status.HTTP_200_OK)
