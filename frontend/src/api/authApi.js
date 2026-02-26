// src/api/authApi.js
import api from "./axios";

/** PUBLIC: Login */
export const loginUser = async (email, password) => {
  // backend expects JSON { email, password }
  const response = await api.post("/auth/login", { email, password });
  return response.data; // { access_token, token_type }
};

/** LOCKED: Get current user */
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
