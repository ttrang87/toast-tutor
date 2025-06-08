from django.urls import path
from .controller import matching, profile, auth, meeting
# from .views import register_user, login_user, logout_user
from .controller.userauth import login_user, logout_user, register_user
from .controller import tutorlist

urlpatterns = [
    # Specific
    path("find_tutors/", matching.find_tutors, name="find_tutors"),
    # AUTHENTICATION
    path("auth/register/", register_user, name="register"),
    path("auth/meeting/", meeting.get_meetings, name="meeting"),
    
    path("meetings/", meeting.get_meetings, name="meetings_list"),
    path("meetings/create/", meeting.create_meeting, name="meeting_create"),
    path("meetings/<int:pk>/", meeting.meeting_detail_or_update, name="meeting_detail"),  
    path("meetings/<int:pk>/book/", meeting.book_meeting, name="meeting_book"),

    path("auth/login/", login_user, name="login"),
    path("auth/logout/", logout_user, name="logout"),
    # AWARD SECTION
    path(
        "tutor/profile/addaward/<int:userId>/",
        profile.add_award,
        name="add_award",
    ),
    path(
        "tutor/profile/updateaward/<int:awardId>/",
        profile.update_award,
        name="update_award",
    ),
    path(
        "tutor/profile/deleteaward/<int:awardId>/",
        profile.delete_award,
        name="delete_award",
    ),
    # COURSE SECTION
    path(
        "tutor/profile/addcourse/<int:userId>/",
        profile.add_course,
        name="add_course",
    ),
    path(
        "tutor/profile/updatecourse/<int:courseId>/",
        profile.update_course,
        name="update_course",
    ),
    path(
        "tutor/profile/deletecourse/<int:courseId>/",
        profile.delete_course,
        name="delete_course",
    ),
    # EXAM SECTION
    path(
        "tutor/profile/addexam/<int:userId>/",
        profile.add_exam,
        name="add_exam",
    ),
    path(
        "tutor/profile/updateexam/<int:examId>/",
        profile.update_exam,
        name="update_exam",
    ),
    path(
        "tutor/profile/deleteexam/<int:examId>/",
        profile.delete_exam,
        name="delete_exam",
    ),
    # EDUCATION SECTION
    path(
        "tutor/profile/addeducation/<int:userId>/",
        profile.add_education,
        name="add_education",
    ),
    path(
        "tutor/profile/updateeducation/<int:eduId>/",
        profile.update_education,
        name="update_education",
    ),
    path(
        "tutor/profile/deleteeducation/<int:eduId>/",
        profile.delete_education,
        name="delete_education",
    ),
    # PROFILE SECTION
    path(
        "tutor/profile/updatebasic/<int:profileId>/",
        profile.update_tutor_profile,
        name="update_tutor_profile",
    ),
    # Most general pattern last
    path(
        "tutor/profile/<int:userId>/",
        profile.get_tutor_profile,
        name="get_tutor_profile",
    ),
    path(
        "password-reset/",
        auth.request_password_reset,
        name="request_password_reset",
    ),
    path("reset-password/", auth.reset_password, name="reset_password"),
    # Add and get review section
    path(
        "tutor/profile/<int:tutorId>/addreview/",
        profile.add_review,
        name="add_review",
    ),
    path(
        "tutor/profile/<int:tutorId>/getreview/",
        profile.get_review,
        name="get_review",
    ),
    # DISPLAY ALL TUTORS
    path("get_all_tutor/", tutorlist.get_user_details, name="get_user_details"),
]
