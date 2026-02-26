import React, { useState } from "react";
import { Clock, Trash2, Plus, Loader2, ArrowLeft, Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const JourneyTimeline = ({ items, loading, onAdd, onDelete }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(false);

  // Grab trip info passed from the JourneysContainer navigation
  const trip = location.state?.trip;
  const tripName = trip?.name || "Journey Details";

  // Form State matching image_b385ac.png (FastAPI Schema)
  const [formData, setFormData] = useState({
    place_id: 1, // Defaulting to 1 for now; ideally linked to a place picker
    day: 1,
    order: 1,
    note: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate that note isn't empty before sending to API
    if (!formData.note.trim()) return;
    
    onAdd(formData);
    setIsAdding(false);
    // Reset note but keep day/order for quick sequential entry
    setFormData({ ...formData, note: "", order: formData.order + 1 });
  };

  return (
    <div className="p-12 bg-white min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-8 mb-16">
        <button 
          onClick={() => navigate("/home/myjourneys")} 
          className="p-5 rounded-full bg-zinc-50 hover:bg-zinc-100 transition-all border border-zinc-100 shadow-sm"
        >
          <ArrowLeft size={28} />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-yellow-500" />
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">
              {trip?.start_date} — {trip?.end_date}
            </p>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter">{tripName}</h1>
        </div>
      </div>

      {/* ACTION BAR */}
      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="mb-16 flex items-center gap-4 bg-black text-[#FFD700] px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-xl"
        >
          <Plus size={20} /> Add New Activity
        </button>
      )}

      {/* QUICK ADD FORM - Aligned with image_b385ac.png */}
      {isAdding && (
        <form 
          onSubmit={handleSubmit} 
          className="mb-16 p-10 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-6"
        >
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-4">Day Number</label>
            <input 
              type="number" 
              className="w-full bg-white p-5 rounded-2xl font-bold text-lg outline-none focus:ring-2 ring-yellow-400" 
              value={formData.day}
              onChange={(e) => setFormData({...formData, day: parseInt(e.target.value) || 1})}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-4">Activity Description</label>
            <input 
              placeholder="What are we doing?"
              className="w-full bg-white p-5 rounded-2xl font-bold text-lg outline-none focus:ring-2 ring-yellow-400" 
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              autoFocus
            />
          </div>
          <div className="flex items-end gap-3">
            <button type="submit" className="flex-1 bg-black text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest">Save</button>
            <button type="button" onClick={() => setIsAdding(false)} className="p-5 text-zinc-400 font-bold hover:text-black transition-colors">Cancel</button>
          </div>
        </form>
      )}

      {/* TIMELINE LIST - Aligned with image_b385e6.png */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-16 w-16 text-zinc-200" />
        </div>
      ) : (
        <div className="relative border-l-4 border-zinc-100 ml-6 pl-16 space-y-16">
          {items.length === 0 && (
            <div className="py-10">
               <p className="text-zinc-300 text-2xl font-bold uppercase tracking-widest italic">The page is blank. Start your odyssey.</p>
            </div>
          )}
          
          {items.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Connector Dot */}
              <div className="absolute -left-[4.75rem] top-3 w-6 h-6 rounded-full bg-white border-4 border-black group-hover:bg-[#FFD700] transition-all duration-300" />
              
              <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-transparent hover:border-zinc-100 hover:shadow-xl transition-all duration-500">
                <div>
                  <div className="flex items-center gap-4 text-zinc-400 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 px-4 py-1.5 rounded-full text-black">
                      Day {item.day}
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-yellow-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Seq. {item.order}</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    {item.note || "Explore Location"}
                  </h3>
                </div>
                
                <button 
                  onClick={() => onDelete(item.id)}
                  className="p-4 text-zinc-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                  title="Remove Activity"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JourneyTimeline;