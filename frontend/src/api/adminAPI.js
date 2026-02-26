import api from "./axios";

/* ==============================
   COMMON HANDLER
============================== */
const handleRequest = async (request) => {
  try {
    const res = await request;
    return res.data;
  } catch (error) {
    console.error("Admin API Error:", error);

    throw (
      error?.response?.data?.detail || 
      "Admin action failed"
    );
  }
};

/* ==============================
   ADMIN HEALTH
   GET /admin/health
============================== */
export const fetchAdminHealth = () => 
  handleRequest(api.get("/admin/health"));

/* ==============================
   LIST USERS
   GET /admin/users
============================== */
export const fetchAllUsers = () => 
  handleRequest(api.get("/admin/users"));

/* ==============================
   TOGGLE USER ACTIVE STATUS
   POST /admin/users/{user_id}/toggle-active
============================== */
export const toggleUserActive = (userId) => 
  handleRequest(
    api.post(`/admin/users/${userId}/toggle-active`)
  );
  