import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// local routes
import HomePage from "../pages/Home/home";
import ProtectedRoute from "../routes/ProtectedRoutes";
import SignIn from "../pages/auth/SignIn.jsx";
// Import your new components (adjust paths as necessary)
import ForgotPassword from "@/pages/auth/forgot-password/forgot-pass"; 
// import ResetPassword from "@/pages/auth/ResetPassword"; 

const router = createBrowserRouter([
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  // {
  //   // This is the page where users land after clicking the link in their email
  //   path: "/reset-password/:token", 
  //   element: <ResetPassword />,
  // },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <div className="flex items-center justify-center h-screen font-bold text-2xl">404 - Not Found</div>,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}