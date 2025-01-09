const API_BASE_URL = 'http://127.0.0.1:8000';


export const API_ROUTES = {
    GET_TUTOR_PROFILE: (userId) => `${API_BASE_URL}/tutor/profile/${userId}`, 

    FORGOT_PASSWORD: () => `${API_BASE_URL}/password-reset/`,

    RESET_PASSWORD: () => `${API_BASE_URL}/api/reset-password/`
}