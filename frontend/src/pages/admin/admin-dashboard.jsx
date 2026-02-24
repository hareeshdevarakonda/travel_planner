import React, { useState } from "react";
import {
  ShieldCheck,
  Globe,
  CheckCircle,
} from "lucide-react";

import LocationSyncView from "./LocationSyncView";
import ApprovalsView from "./ApprovalsView";

/* =====================================================
   MAIN ADMIN DASHBOARD
===================================================== */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("locations");

  return (
    <div className="flex h-screen bg-zinc-50">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-black text-white p-6 flex flex-col gap-8">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#FFD700]" />
          <h1 className="font-black uppercase tracking-tight text-xl">
            Odyssey Admin
          </h1>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">

          <SidebarBtn
            active={activeTab === "locations"}
            onClick={() => setActiveTab("locations")}
            icon={<Globe size={18} />}
            label="Location Sync"
          />

          <SidebarBtn
            active={activeTab === "approvals"}
            onClick={() => setActiveTab("approvals")}
            icon={<CheckCircle size={18} />}
            label="Approvals"
          />

        </nav>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 overflow-y-auto p-10">

        {activeTab === "locations" && <LocationSyncView />}
        {activeTab === "approvals" && <ApprovalsView />}

      </div>
    </div>
  );
};

/* =====================================================
   SIDEBAR BUTTON
===================================================== */
const SidebarBtn = ({ active, icon, label, ...props }) => (
  <button
    {...props}
    className={`p-3 rounded-xl flex items-center gap-3 font-bold text-sm transition-all
      ${
        active
          ? "bg-[#FFD700] text-black"
          : "hover:bg-zinc-900"
      }`}
  >
    {icon}
    {label}
  </button>
);

export default AdminDashboard;