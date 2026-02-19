import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  // ⭐ VERY IMPORTANT
  // wait until AuthContext finishes restoring token
  if (loading) {
    return null; // or loader component
  }

  // user not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
