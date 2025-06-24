// filepath: frontend/src/services/userService.js
import axios from "axios";
import { API_ROUTES } from "../constant/APIRoutes";

export const updateUserStatus = async (userId, isActive) => {
    try {
        const response = await axios.post(API_ROUTES.UPDATE_USER_STATUS, {
            user_id: userId,
            is_active: isActive,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user status:", error);
        throw error;
    }
};