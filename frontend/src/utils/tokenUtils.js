import { jwtDecode } from "jwt-decode";

/* =====================================================
   SAFE TOKEN DECODE
===================================================== */
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

/* =====================================================
   GET TOKEN EXPIRY (ms timestamp)
===================================================== */
export const getTokenExpiry = (token) => {
  const decoded = decodeToken(token);
  return decoded?.exp ? decoded.exp * 1000 : null;
};

/* =====================================================
   CHECK IF TOKEN IS EXPIRED
===================================================== */
export const isTokenExpired = (token) => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  return Date.now() > expiry;
};

/* =====================================================
   GET STORED TOKEN
   (matches AuthContext storage key)
===================================================== */
export const getStoredToken = () => {
  return (
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken")
  );
};