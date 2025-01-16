const API_BASE_URL = 'http://127.0.0.1:8000/';

export const API_ROUTES = {
    /*PROFILE SECTION*/
    GET_TUTOR_PROFILE: (userId) => `${API_BASE_URL}/tutor/profile/${userId}/`,
    FIX_BASIC_INFOR: (profileId) => `${API_BASE_URL}/tutor/profile/updatebasic/${profileId}/`,
    FIX_AVATAR_COVER: (profileId) => `${API_BASE_URL}/tutor/profile/updateimage/${profileId}/`,

    /*EDUCATION SECTION*/
    FIX_EDUCATION_INFOR: (eduId) => `${API_BASE_URL}/tutor/profile/updateeducation/${eduId}/`,
    DELETE_EDUCATION_INFOR: (eduId) => `${API_BASE_URL}/tutor/profile/deleteeducation/${eduId}/`,
    ADD_EDUCATION: (userId) => `${API_BASE_URL}/tutor/profile/addeducation/${userId}/`,

    /*COURSE SECTION*/
    FIX_COURSE_INFOR: (courseId) => `${API_BASE_URL}/tutor/profile/updatecourse/${courseId}/`,
    DELETE_COURSE_INFOR: (courseId) => `${API_BASE_URL}/tutor/profile/deletecourse/${courseId}/`,
    ADD_COURSE: (userId) => `${API_BASE_URL}/tutor/profile/addcourse/${userId}/`,

    /*EXAM SECTION*/
    FIX_EXAM_INFOR: (examId) => `${API_BASE_URL}/tutor/profile/updateexam/${examId}/`,
    DELETE_EXAM_INFOR: (examId) => `${API_BASE_URL}/tutor/profile/deleteexam/${examId}/`,
    ADD_EXAM: (userId) => `${API_BASE_URL}/tutor/profile/addexam/${userId}/`,


    /*AWARD SECTION*/
    FIX_AWARD_INFOR: (awardId) => `${API_BASE_URL}/tutor/profile/updateaward/${awardId}/`,
    DELETE_AWARD_INFOR: (awardId) => `${API_BASE_URL}/tutor/profile/deleteaward/${awardId}/`,
    ADD_AWARD: (userId) => `${API_BASE_URL}/tutor/profile/addaward/${userId}/`,

    FIND_TUTORS: `${API_BASE_URL}/find_tutors/`

}