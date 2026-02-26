import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/* ---------------- REQUEST ---------------- */
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ---------------- RESPONSE ----------------
   Backend uses only access tokens.
   There is NO /refresh endpoint.
   On 401 (except login/register) clear token and redirect to /login.
---------------------------------------------------------- */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    // Don't redirect for auth endpoints
    if (
      status === 401 &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/register")
    ) {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("refreshToken");
      // avoid infinite loops
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
