import React from "react";
import { Mail, Lock, Github, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link for routing
import Logo from "@/components/logo";

const Right = ({ username, password, setUsername, setPassword, handleLogin }) => {
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#F8FAF9] px-8 lg:px-20 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Logo containerSize="w-16 h-16" iconSize={40} className="mt-20" />
          <h1 className="text-5xl font-black text-[#041E23] mb-2">
            Travel Planner
          </h1>
          <p className="text-slate-500 font-medium text-[20px]">
            Ready to plan your next escape?
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3 focus:border-[#041E23] focus:ring-4 focus:ring-[#041E23]/10 outline-none transition-all"
                  placeholder="traveler_01"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3 focus:border-[#041E23] focus:ring-4 focus:ring-[#041E23]/10 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              
              {/* Forgot Password Link */}
              <div className="flex justify-end mt-2">
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-semibold text-[#041E23] hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white bg-[#041E23] hover:bg-[#062c33] transition-all flex items-center justify-center gap-2"
            >
              Start Navigating
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Social */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-semibold">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Google
            </button>

            <button className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition text-sm font-semibold">
              <Github size={18} />
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Right;