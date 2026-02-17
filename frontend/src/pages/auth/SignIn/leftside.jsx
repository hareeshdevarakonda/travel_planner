import React from "react";
import { Map, Globe, Plane } from "lucide-react";

const Left = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">

      <img
        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070"
        alt="Premium Destination"
        className="absolute inset-0 w-full h-full object-cover opacity-70 scale-105 animate-subtle-zoom"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#041E23]/90 via-[#041E23]/40 to-transparent" />

      <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full">

        {/* Top Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center">
            <Plane size={20} className="text-[#041E23] -rotate-12" />
          </div>
          <span className="font-black tracking-widest uppercase text-sm text-white">
            Adventure Awaits
          </span>
        </div>

        {/* Main Content */}
        <div className="max-w-md">
          <h2 className="text-6xl font-extrabold text-white leading-tight mb-6">
            Plan your next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              great escape.
            </span>
          </h2>

          <p className="text-slate-300 text-lg leading-relaxed font-light">
            Join 50,000+ travelers mapping out their journeys with precision and ease.
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="flex gap-10 text-white/50 text-xs font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-amber-500" />
            190+ Countries
          </div>

          <div className="flex items-center gap-2">
            <Map size={16} className="text-amber-500" />
            1M+ Routes
          </div>
        </div>

      </div>
    </div>
  );
};

export default Left;
