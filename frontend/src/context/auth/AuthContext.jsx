import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // prevents route flicker

  // ✅ Restore session on app start
  useEffect(() => {
    const storedToken =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (storedToken) {
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // ✅ Login (supports Remember Me)
const login = (accessToken, rememberMe = false) => {
  // ✅ clear old tokens first
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");

  if (rememberMe) {
    localStorage.setItem("authToken", accessToken);
  } else {
    sessionStorage.setItem("authToken", accessToken);
  }

  setToken(accessToken);
};


    

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
