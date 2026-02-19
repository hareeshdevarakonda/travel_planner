
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/navbar";
import ProtectedRoute from "@/routes/ProtectedRoutes";

const HomeLayout = () => {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen bg-white overflow-hidden">

        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />

          {/* THIS PART CHANGES PER ROUTE */}
          <main className="flex-1 overflow-y-auto bg-[#FAFAFA]">
            <Outlet />
          </main>

        </div>

      </div>
    </ProtectedRoute>
  );
};

export default HomeLayout;
