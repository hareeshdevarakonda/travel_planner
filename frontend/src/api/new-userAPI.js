// src/api/new-userAPI.js
import api from "./axios";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });
  return response.data;
};