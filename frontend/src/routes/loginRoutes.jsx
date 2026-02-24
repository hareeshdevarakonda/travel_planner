import React from "react";
import { Outlet } from "react-router-dom";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/new-user/user";
import ForgotPassword from "../pages/auth/forgot-password/forgot-pass";
import Register from "@/pages/auth/new-user/user";

const AuthLayout = () => {
  return (
    <div className="auth-layout bg-[#FDFDFD] min-h-screen flex flex-col items-center justify-center font-sans">
      <Outlet />
    </div>
  );
};

const authRoutes = {
  element: <AuthLayout />,
  children: [
    { path: "/login", element: <SignIn /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password/:token", element: <Register /> },
  ],
};

export default authRoutes;