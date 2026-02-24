import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/navbar";
import ProtectedRoute from "@/routes/ProtectedRoutes";
import ChatWidget from "@/components/AI-widget"; // Your new widget

const HomeLayout = () => {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen bg-white overflow-hidden font-sans">
        
        <Sidebar />

        <div className="flex-1 flex flex-col relative overflow-hidden">
          <Navbar />

          <main className="flex-1 overflow-y-auto bg-[#FAFAFA] rounded-tl-[40px] border-t border-l border-gray-100">
            <Outlet />
          </main>

          {/* GLOBAL WIDGET AREA 
             Positioned absolute so it floats over the main content
          */}
          <div className="absolute bottom-8 right-8 z-50">
            <ChatWidget />
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HomeLayout;