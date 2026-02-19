import { Search, Bell, Plus } from "lucide-react";
import Logo from "@/components/logo";

const Navbar = () => {
  return (
    <header className="h-24 px-12 flex items-center justify-between bg-white z-10 gap-10 border-b border-zinc-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      
      {/* Branding */}
      <div className="flex items-center gap-4 group cursor-pointer">
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/10 transition-transform group-hover:-rotate-6">
          <Logo iconSize={24} className="text-[#FFD700] fill-[#FFD700]" />
        </div>

        <div className="hidden xl:block">
          <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]">
            Odyssey
          </span>
          <span className="block text-sm font-black text-black tracking-tighter">
            Travel Planner
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg group">
        <Search
          size={18}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#FFC107] transition-colors"
        />

        <input
          type="text"
          placeholder="Where to next, Explorer?"
          className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-16 pr-6 text-sm text-black font-medium outline-none focus:bg-white focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/10 transition-all placeholder:text-zinc-400 shadow-sm"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        
        {/* Notification */}
        <button className="relative p-3.5 bg-white border border-zinc-100 rounded-2xl text-zinc-400 hover:text-black hover:border-zinc-300 transition-all shadow-sm">
          <Bell size={22} />
          <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-[#FFD700] rounded-full border-2 border-white shadow-[0_0_10px_rgba(255,215,0,0.5)]"></span>
        </button>

        {/* New Trip Button */}
        <button className="relative overflow-hidden bg-[#FFD700] group px-8 py-4 rounded-2xl transition-all shadow-[0_8px_20px_rgba(255,215,0,0.15)] hover:shadow-[0_12px_25px_rgba(255,215,0,0.25)] active:scale-95 border border-black/5">
          <div className="relative flex items-center gap-3">
            <Plus size={18} strokeWidth={3} className="text-black" />
            <span className="font-black text-[11px] uppercase tracking-[0.2em] text-black">
              New Trip
            </span>
          </div>
        </button>

      </div>
    </header>
  );
};

export default Navbar;
