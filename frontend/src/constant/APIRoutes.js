export const API_BASE_URL = 'http://127.0.0.1:8000'; // Backend Base URL

export const API_ROUTES = {
    // Tutor APIs
    GET_TUTOR_PROFILE: (userId) => `${API_BASE_URL}/api/tutors/${userId}/`,
    GET_ALL_TUTORS: () => `${API_BASE_URL}/api/tutors/`,
    SEARCH_TUTORS: (query) => `${API_BASE_URL}/api/tutors/search/?q=${query}`,
    
    // Course APIs
    GET_COURSES: () => `${API_BASE_URL}/api/courses/`,

    // User Authentication APIs
    FORGOT_PASSWORD: () => `${API_BASE_URL}/auth/password-reset/`,
    RESET_PASSWORD: () => `${API_BASE_URL}/auth/reset-password/`
};

export default API_ROUTES;
