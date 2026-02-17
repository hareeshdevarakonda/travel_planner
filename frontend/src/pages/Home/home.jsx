import React from "react";
import {
  Map,
  Plane,
  Compass,
  Calendar,
  Search,
  Plus,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/auth/AuthContext";
import Logo from "@/components/logo";
import SideBarIcon from "@/components/nav_con";

const HomePage = () => {
  const { logout } = useAuth();

  return (
    /* h-screen and overflow-hidden ensures the layout stays static and non-scrolling */
    /* Using #1A1C1E (Obsidian) instead of #020C0E (Black/Teal) */
    <div className="h-screen w-screen flex bg-[#1A1C1E] text-zinc-100 font-sans overflow-hidden">
      {/* 1. Sidebar Navigation - Deep Graphite */}
      <aside className="w-20 lg:w-64 bg-[#232629] border-r border-white/5 flex flex-col items-center py-8 z-20">
        <div className="mb-12 flex items-center justify-between w-full px-6">
          <Logo
            containerSize="w-10 h-10"
            iconSize={18}
            className="mb-0 flex justify-start size-[50px] saturate-150"
          />
          <SideBarIcon />
        </div>

        <nav className="flex-1 flex flex-col gap-2 w-full px-4">
          <NavItem icon={<Compass size={20} />} label="Explore" active />
          <NavItem icon={<Map size={20} />} label="My Routes" />
          <NavItem icon={<Calendar size={20} />} label="Itineraries" />
          <NavItem icon={<Plane size={20} />} label="Flights" />
        </nav>

        <div className="mt-auto w-full px-4 pt-6 border-t border-white/5 space-y-1">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <button
            onClick={logout}
            className="flex items-center gap-4 w-full p-3.5 rounded-2xl text-zinc-500 hover:text-amber-400 hover:bg-white/5 transition-all group"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden lg:block font-bold text-[10px] uppercase tracking-[0.2em]">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle Ambient Glow to break the flat background */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#1A1C1E]/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4 bg-[#232629] border border-white/5 rounded-2xl px-5 py-2.5 w-96 focus-within:border-amber-500/40 transition-all shadow-inner">
            <Search size={18} className="text-zinc-500" />
            <input
              type="text"
              placeholder="Search destinations..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600 text-zinc-200"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-zinc-400 hover:text-amber-400 transition-colors relative p-2 bg-white/5 rounded-xl border border-white/5">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-[#1A1C1E]"></span>
            </button>
            <button className="bg-amber-400 hover:bg-amber-300 text-[#1A1C1E] px-7 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-amber-900/20 transition-all active:scale-95">
              <Plus size={18} /> New Trip
            </button>
          </div>
        </header>

        {/* Dashboard Scrollable Section */}
        {/* Dashboard Scrollable Section */}
        <section className="flex-1 overflow-y-auto no-scrollbar relative bg-gradient-to-b from-amber-500/10 via-[#1A1C1E] to-[#0A0A0A]">
          {/* Inner padding container to keep content away from edges */}
          <div className="p-10">
            <div className="mb-12 relative">
              {/* This absolute div adds an extra soft "pulse" of light behind the text */}
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

              <h2 className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.5em] mb-3 relative z-10">
                Your Odyssey
              </h2>
              <h1 className="text-6xl font-black tracking-tighter text-white relative z-10">
                Welcome Back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-amber-400 to-amber-700">
                  Explorer
                </span>
              </h1>
            </div>

            {/* Grid Layout */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-center">
  {/* Your TripCards here */}
              <TripCard
                image="https://images.unsplash.com/photo-1506905372217-51e926cae444?auto=format&fit=crop&q=80&w=2070"
                title="Swiss Alps Expedition"
                date="March 12 - 18, 2026"
                status="Confirmed"
              />
              <TripCard
                image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070"
                title="Lake Como Retreat"
                date="April 05 - 12, 2026"
                status="In Progress"
              />

              {/* Innovative Action Card */}
             <div className="bg-white/[0.02] border-2 border-dashed border-white/20 rounded-[2rem] flex flex-col items-center justify-center gap-4 min-h-[300px] hover:border-amber-500/40 hover:bg-amber-500/[0.04] transition-all cursor-pointer group">
  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-amber-400 group-hover:rotate-90 transition-all duration-500">
    <Plus
      className="text-white group-hover:text-[#1A1C1E]" 
      size={28}
    />
  </div>

  <div className="text-center">
    <p className="font-bold text-white uppercase tracking-widest text-[16px]">
      Add New Journey
    </p>

    <p className="text-zinc-400 text-[12px] mt-1 group-hover:text-amber-500/60 uppercase">
      Start a new chapter
    </p>
  </div>
</div>
            </div>
          </div>
        </section>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  );
};

/* Sub-Components */
const NavItem = ({ icon, label, active = false }) => (
  <div
    className={`flex items-center gap-4 w-full p-4 rounded-2xl cursor-pointer transition-all duration-500 group ${
      active
        ? "bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
        : "text-zinc-500 hover:text-zinc-100 hover:bg-white/5 border border-transparent"
    }`}
  >
    <div
      className={`${active ? "text-amber-400" : "group-hover:text-amber-400"} transition-colors duration-300`}
    >
      {icon}
    </div>
    <span className="hidden lg:block font-bold text-[10px] uppercase tracking-[0.2em]">
      {label}
    </span>
  </div>
);

const TripCard = ({ image, title, date, status }) => (
  <div className="group relative rounded-[3rem] overflow-hidden bg-[#232629] border border-white/5 hover:border-amber-500/30 transition-all duration-700 shadow-2xl">
    <div className="h-64 overflow-hidden relative">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#232629] via-transparent to-transparent opacity-80" />
      <div className="absolute top-8 right-8">
        <span
          className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest backdrop-blur-md border border-white/10 ${
            status === "Confirmed"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-amber-500/20 text-amber-400"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
    <div className="p-10 relative">
      <h3 className="text-2xl font-black mb-2 group-hover:text-amber-400 transition-colors tracking-tight">
        {title}
      </h3>
      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8">
        {date}
      </p>
      <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-amber-400 hover:text-[#1A1C1E] text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
        View Itinerary
      </button>
    </div>
  </div>
);

export default HomePage;
