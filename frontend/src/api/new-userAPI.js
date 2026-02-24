// 1️⃣ Import your custom axios instance
import api from "./axios";

/**
 * Registers a new user
 * Uses shared axios instance (token logic handled automatically)
 */
export const registerUser = async (userData) => {
  try {
    // 2️⃣ Call backend endpoint
    const response = await api.post("/users/", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    // 3️⃣ Return backend response
    return response.data;

  } catch (error) {
    console.error("API Error in registerUser:", error);

    // ✅ normalize backend error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail || // FastAPI often uses "detail"
      "Registration failed";

    throw new Error(message);
  }
};