import axios from "axios";

const API_URL = "http://127.0.0.1:8000/auth/";

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}register/`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}login/`, userData);
  if (response.data.access) {
    localStorage.setItem("userId", response.data.userId);
  }
  return response.data;
};

export const logout = () => {
  // localStorage.removeItem("user");
  localStorage.clear();
};
