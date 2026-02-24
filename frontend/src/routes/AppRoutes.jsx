
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";


import homeRoutes from "./HomeRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import authRoutes from "./loginRoutes";
import AdminDashboard from "../pages/admin/admin-dashboard";
const router = createBrowserRouter([
  // Root redirect
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },

  // Public authentication routes
  authRoutes,

  // Private application routes (Dashboard layout)
  ProtectedRoutes,
  homeRoutes,
  // Global 404 page
  {
    path: "*",
    element: (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
        <h1 className="text-9xl font-black italic">404</h1>
        <div className="mt-6 p-5 border-[3px] border-black bg-[#FFD700] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest">
          Path Not Found
        </div>
      </div>
    ),
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
