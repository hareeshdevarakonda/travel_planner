import {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

import { getMe } from "@/api/authApi";

const AuthContext = createContext();

/* =====================================================
   AUTH PROVIDER
===================================================== */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------
     RESTORE SESSION ON APP START
  ---------------------------------------------------*/
  useEffect(() => {
    const storedToken =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);

    getMe()
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  /* --------------------------------------------------
     LOGIN
  ---------------------------------------------------*/
  const login = async (
    accessToken,
    refreshToken,
    rememberMe = false
  ) => {
    const storage = rememberMe
      ? localStorage
      : sessionStorage;

    // remove only auth keys
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refreshToken");

    storage.setItem("authToken", accessToken);
    storage.setItem("refreshToken", refreshToken);

    setToken(accessToken);

    // ✅ immediately fetch user
    try {
      const userData = await getMe();
      setUser(userData);
    } catch {
      logout();
    }
  };

  /* --------------------------------------------------
     LOGOUT
  ---------------------------------------------------*/
  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refreshToken");

    setToken(null);
    setUser(null);
  };

  /* --------------------------------------------------
     DERIVED VALUES
  ---------------------------------------------------*/
  const role = user?.role || null;
  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        isAdmin,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* =====================================================
   HOOK
===================================================== */
export const useAuth = () => useContext(AuthContext);

export default AuthContext;