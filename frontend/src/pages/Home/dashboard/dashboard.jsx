import React from "react";
import { ChevronRight, Plus } from "lucide-react";
import { useInfiniteScroll } from "@/utils/lazy_loading";

const Dashboard = () => {

  const fetchTrips = async (pageNum) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: Math.random(),
        title: `New Adventure ${pageNum}`,
        date: "Upcoming 2026",
        status:
          pageNum % 3 === 0
            ? "Rejected"
            : pageNum % 2 === 0
            ? "Confirmed"
            : "In Progress",
      },
    ];
  };

  const initialTrips = [
    {
      id: 1,
      title: "Swiss Alps Expedition",
      date: "March 12 - 18, 2026",
      status: "Confirmed",
    },
    {
      id: 2,
      title: "Lake Como Retreat",
      date: "April 05 - 12, 2026",
      status: "In Progress",
    },
  ];

  const { items, loading, loaderRef } =
    useInfiniteScroll(initialTrips, fetchTrips);

  // ✅ SHOW ONLY RECENT 5 ITEMS
  const recentTrips = items.slice(0, 5);

  return (
    <div className="p-10 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="mb-10">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.5em] mb-3">
          Your Travel Dashboard
        </p>

        <h1 className="text-5xl font-black tracking-tight text-black">
          Overview
        </h1>
      </div>

      {/* ---------------- RECENT ACTIVITY ---------------- */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">
          Recent Activity
        </h2>

        {/* VIEW ALL BUTTON */}
        <button className="flex items-center gap-2 text-sm font-bold hover:text-[#FFD700] transition">
          View All <ChevronRight size={16} />
        </button>
      </div>

      {/* LIST (SECONDARY SECTION NOW) */}
      <div className="space-y-3">
        {recentTrips.map((trip) => (
          <TripRow key={trip.id} {...trip} />
        ))}

        {/* ADD NEW JOURNEY */}
        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-zinc-200 hover:border-black transition cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
              <Plus className="text-[#FFD700]" size={16} />
            </div>
            <p className="font-bold uppercase text-xs tracking-wide">
              Plan New Journey
            </p>
          </div>
        </div>
      </div>

      {/* Loader still works for infinite scroll page */}
      <div
        ref={loaderRef}
        className="h-16 flex items-center justify-center mt-4"
      >
        {loading && (
          <p className="text-zinc-400 animate-pulse tracking-[0.3em] font-black uppercase text-[10px]">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
};


// --------------------------------------------------
// COMPACT ROW (LESS DOMINANT)
// --------------------------------------------------
const TripRow = ({ title, date, status }) => {

  const statusStyles = {
    Confirmed: "bg-emerald-100 text-emerald-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl hover:border-black transition shadow-sm">

      <div>
        <h3 className="font-semibold text-base text-black">{title}</h3>
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
          {date}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${statusStyles[status]}`}
        >
          {status}
        </span>

        <button className="flex items-center gap-1 text-xs font-bold hover:text-[#FFD700] transition">
          View <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;



// import React from "react";
// import { ChevronRight, Plus } from "lucide-react";

// const Dashboard = () => {
//   return (
//     <div className="p-12 animate-in fade-in duration-500">
//       <div className="mb-14">
//         <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Your Personal Odyssey</p>
//         <h1 className="text-7xl font-black tracking-tighter text-black leading-tight">
//           Welcome Back,<br />
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-zinc-600 to-zinc-400">Explorer</span>
//         </h1>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//         <TripCard
//           image="https://images.unsplash.com/photo-1506905372217-51e926cae444?auto=format&fit=crop&q=80&w=2070"
//           title="Swiss Alps Expedition"
//           date="March 12 - 18, 2026"
//           status="Confirmed"
//         />
//         <TripCard
//           image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070"
//           title="Lake Como Retreat"
//           date="April 05 - 12, 2026"
//           status="In Progress"
//         />

//         {/* Add New Journey Placeholder */}
//         <div className="group border-2 border-dashed border-zinc-200 rounded-[3rem] bg-white flex flex-col items-center justify-center p-12 hover:border-black hover:bg-zinc-50 transition-all cursor-pointer min-h-[450px] shadow-sm">
//           <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-zinc-200">
//             <Plus className="text-[#FFD700]" size={32} />
//           </div>
//           <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-tighter">New Journey</h3>
//           <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest text-center">Plan your next escape</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TripCard = ({ image, title, date, status }) => (
//   <div className="group relative bg-white border border-zinc-100 rounded-[3rem] overflow-hidden hover:border-zinc-300 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2">
//     <div className="h-64 relative overflow-hidden">
//       <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
//       <div className="absolute top-8 right-8">
//         <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/20 shadow-lg ${
//           status === "Confirmed" ? "bg-emerald-500 text-white" : "bg-[#FFD700] text-black"
//         }`}>
//           {status}
//         </span>
//       </div>
//     </div>
//     <div className="p-10">
//       <h3 className="text-3xl font-black text-black mb-2 tracking-tighter group-hover:text-[#FFD700] transition-colors">{title}</h3>
//       <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-10">{date}</p>
//       <button className="w-full py-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-[#FFD700] hover:text-black transition-all flex items-center justify-center gap-3 shadow-lg shadow-zinc-200">
//         View Itinerary <ChevronRight size={18} />
//       </button>
//     </div>
//   </div>
// );

// export default Dashboard;