import { NavLink } from "react-router-dom";
import {
  Map,
  Plane,
  Compass,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import SidebarToggleIcon from "@/components/SideBarIcon";
import { useAuth } from "@/context/auth/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-20 lg:w-72 bg-black flex flex-col py-10 z-20 shadow-[4px_0px_20px_rgba(0,0,0,0.1)]">
      
      {/* Logo + Toggle */}
      <div className="mb-14 px-8 flex items-center gap-4">
        <div className="text-slate-500 hover:text-amber-400">
          <SidebarToggleIcon />
        </div>

        <span className="hidden lg:block font-black text-2xl tracking-tighter uppercase italic text-white">
          Odyssey
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-3 px-6">
        <NavItem to="/home" icon={<Compass size={22} />} label="Explore" />
        <NavItem to="/home/routes" icon={<Map size={22} />} label="My Routes" />
        <NavItem to="/home/itineraries" icon={<Calendar size={22} />} label="Itineraries" />
        <NavItem to="/home/flights" icon={<Plane size={22} />} label="Flights" />
      </nav>

      {/* Bottom Section */}
      <div className="px-6 space-y-2 pt-8 border-t border-white/10">
        <NavItem to="/home/settings" icon={<Settings size={22} />} label="Settings" />

        <button
          onClick={logout}
          className="flex items-center gap-4 w-full p-4 rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 group ${
        isActive
          ? "bg-[#FFD700] text-black font-black scale-105 shadow-lg shadow-yellow-500/10"
          : "text-zinc-500 hover:text-white hover:bg-white/5 font-bold"
      }`
    }
  >
    <div className="transition-colors group-hover:text-[#FFD700]">
      {icon}
    </div>
    <span className="hidden lg:block text-xs uppercase tracking-widest">
      {label}
    </span>
  </NavLink>
);
