import React, { useState, useCallback, useMemo } from "react";
import {
  Plus,
  X,
  Loader2,
  ChevronRight,
  Edit3,
  Calendar,
} from "lucide-react";

/* =====================================================
   IMAGE RESOLVER
===================================================== */
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// Map of popular Indian destinations to their image URLs
const DESTINATION_IMAGES = {
  // Taj Mahal / Agra
  "taj mahal": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop",
  "agra": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop",
  
  // Jaipur
  "jaipur": "https://images.unsplash.com/photo-1606693629269-6f7f3b6d1e01?w=600&h=400&fit=crop",
  "pink city": "https://images.unsplash.com/photo-1606693629269-6f7f3b6d1e01?w=600&h=400&fit=crop",
  "city palace": "https://images.unsplash.com/photo-1606693629269-6f7f3b6d1e01?w=600&h=400&fit=crop",
  "hawa mahal": "https://images.unsplash.com/photo-1599661046289-24f054695bcd?w=600&h=400&fit=crop",
  
  // Hyderabad / Charminar
  "charminar": "https://images.unsplash.com/photo-1561361513-2d7c4ed1f919?w=600&h=400&fit=crop",
  "hyderabad": "https://images.unsplash.com/photo-1561361513-2d7c4ed1f919?w=600&h=400&fit=crop",
  "khammam": "https://images.unsplash.com/photo-1561361513-2d7c4ed1f919?w=600&h=400&fit=crop",
  "wyra": "https://images.unsplash.com/photo-1561361513-2d7c4ed1f919?w=600&h=400&fit=crop",
  
  // Mumbai
  "mumbai": "https://images.unsplash.com/photo-1570876853701-e58162a8f753?w=600&h=400&fit=crop",
  "gateway of india": "https://images.unsplash.com/photo-1570876853701-e58162a8f753?w=600&h=400&fit=crop",
  "marine drive": "https://images.unsplash.com/photo-1570876853701-e58162a8f753?w=600&h=400&fit=crop",
  
  // Mysore
  "mysore": "https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=600&h=400&fit=crop",
  "mysore palace": "https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=600&h=400&fit=crop",
  "bangalore": "https://images.unsplash.com/photo-1568667256019-adf526b51754?w=600&h=400&fit=crop",
  
  // Varanasi
  "varanasi": "https://images.unsplash.com/photo-1599859876935-ba3cec276bfe?w=600&h=400&fit=crop",
  "benares": "https://images.unsplash.com/photo-1599859876935-ba3cec276bfe?w=600&h=400&fit=crop",
  "ganges": "https://images.unsplash.com/photo-1599859876935-ba3cec276bfe?w=600&h=400&fit=crop",
  
  // Goa
  "goa": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
  "panaji": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
  
  // Delhi
  "delhi": "https://images.unsplash.com/photo-1587595431973-160b0d0eab84?w=600&h=400&fit=crop",
  "new delhi": "https://images.unsplash.com/photo-1587595431973-160b0d0eab84?w=600&h=400&fit=crop",
  "india gate": "https://images.unsplash.com/photo-1587595431973-160b0d0eab84?w=600&h=400&fit=crop",
  
  // Other major cities
  "kolkata": "https://images.unsplash.com/photo-1580974928064-778814675591?w=600&h=400&fit=crop",
  "calcutta": "https://images.unsplash.com/photo-1580974928064-778814675591?w=600&h=400&fit=crop",
  "kerala": "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=600&h=400&fit=crop",
  "kochi": "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=600&h=400&fit=crop",
  "darjeeling": "https://images.unsplash.com/photo-1545256220-70ca7f49ffbe?w=600&h=400&fit=crop",
  "udaipur": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
  "pushkar": "https://images.unsplash.com/photo-1589308078519-fac814ea786f?w=600&h=400&fit=crop",
  "rajasthan": "https://images.unsplash.com/photo-1606693629269-6f7f3b6d1e01?w=600&h=400&fit=crop",
  "pune": "https://images.unsplash.com/photo-1568667256019-adf526b51754?w=600&h=400&fit=crop",
  "ahmedabad": "https://images.unsplash.com/photo-1587595431973-160b0d0eab84?w=600&h=400&fit=crop",
};

const resolveJourneyImage = (journey) => {
  if (!journey) return null;
  
  // If journey has explicit image, use it
  if (journey.image) {
    console.log(`✓ Using explicit journey image for: ${journey.name}`);
    return journey.image;
  }
  
  // Try to get image from first item
  const firstItem = journey.items?.[0];
  if (firstItem?.place?.image_url) {
    const url = firstItem.place.image_url;
    const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;
    console.log(`✓ Using first item image for: ${journey.name}`, fullUrl);
    return fullUrl;
  }
  
  // Try to get image from journey name (destination lookup)
  if (journey.name) {
    const nameLower = journey.name.toLowerCase();
    console.log(`Searching for image: "${journey.name}" (${nameLower})`);
    
    for (const [dest, img] of Object.entries(DESTINATION_IMAGES)) {
      if (nameLower.includes(dest)) {
        console.log(`✓ Matched journey name "${journey.name}" with destination "${dest}"`);
        return img;
      }
    }
  }
  
  // Fallback: try to match any item place name
  if (journey.items && journey.items.length > 0) {
    console.log(`Searching items for: ${journey.name}`);
    for (const item of journey.items) {
      const placeName = item.place?.name || item.place || "";
      const placeNameLower = placeName.toLowerCase();
      
      for (const [dest, img] of Object.entries(DESTINATION_IMAGES)) {
        if (placeNameLower.includes(dest)) {
          console.log(`✓ Matched item place "${placeName}" with destination "${dest}"`);
          return img;
        }
      }
    }
  }
  
  // Default gradient placeholder
  console.warn(`No image found for: ${journey.name}, using default`);
  return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop";
};

/* =====================================================
   MAIN COMPONENT
===================================================== */
const MyJourneys = ({
  journeys = [],
  loading,
  onDelete,
  onEdit,
  onCreate,
  onView, // Passed from Container
}) => {
  const [isAdding, setIsAdding] = useState(false);
  
  // State for New Journey
  const [newName, setNewName] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  // State for Editing
  const [editingTrip, setEditingTrip] = useState(null);

  const journeysWithImages = useMemo(
    () => journeys.map((j) => ({ ...j, image: resolveJourneyImage(j) })),
    [journeys]
  );

  /* ================= CREATE ================= */
  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onCreate({
      name: newName, // Corrected Key
      start_date: startDate,
      end_date: endDate,
    });

    setNewName("");
    setIsAdding(false);
  };

  /* ================= UPDATE ================= */
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const id = editingTrip.id ?? editingTrip.itinerary_id;
    
    onEdit(id, {
      name: editingTrip.name,
      start_date: editingTrip.start_date,
      end_date: editingTrip.end_date,
    });
    
    setEditingTrip(null);
  };

  return (
    <div className="p-12 bg-white min-h-screen">
      <div className="mb-14">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
          Your Personal Odyssey
        </p>
        <h1 className="text-6xl font-black uppercase">My Journeys</h1>
      </div>

      {/* QUICK ADD FORM */}
      {isAdding && (
        <form onSubmit={handleQuickAdd} className="mb-14 p-10 bg-zinc-50 rounded-[3rem] border-2 border-dashed">
          <div className="flex flex-col md:flex-row gap-6">
            <input
              className="flex-[2] bg-white p-6 rounded-[1.5rem] font-bold text-xl outline-none focus:ring-2 ring-yellow-400"
              placeholder="Name your journey..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            <div className="flex flex-1 gap-4">
              <input 
                type="date" 
                className="w-full bg-white p-6 rounded-[1.5rem] font-bold" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input 
                type="date" 
                className="w-full bg-white p-6 rounded-[1.5rem] font-bold" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-black text-[#FFD700] px-12 rounded-[1.5rem] font-black uppercase tracking-widest">
              Create
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="p-4 text-zinc-400">
              <X size={24} />
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center h-96 items-center">
          <Loader2 className="animate-spin h-16 w-16 text-zinc-200" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div 
            onClick={() => setIsAdding(true)} 
            className="flex flex-col items-center justify-center min-h-[450px] border-2 border-dashed rounded-[4rem] cursor-pointer hover:border-[#FFD700] transition-all group"
          >
            <Plus size={48} className="group-hover:rotate-90 transition-transform duration-300" />
            <h2 className="font-black mt-4 uppercase tracking-widest">New Journey</h2>
          </div>

          {journeysWithImages.map((trip) => (
            <TripCard
              key={trip.id ?? trip.itinerary_id}
              trip={trip}
              onDelete={onDelete}
              onEdit={() => setEditingTrip(trip)}
              onView={() => onView?.(trip)}
            />
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingTrip && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white p-12 rounded-[3rem] w-full max-w-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black uppercase mb-8">Update Journey</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-zinc-400">Journey Name</label>
                <input
                  className="w-full p-6 bg-zinc-50 rounded-2xl font-bold text-xl outline-none border-2 border-transparent focus:border-black"
                  value={editingTrip.name}
                  onChange={(e) => setEditingTrip({ ...editingTrip, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-zinc-400">Start Date</label>
                  <input
                    type="date"
                    className="w-full p-4 bg-zinc-50 rounded-xl font-bold outline-none"
                    value={editingTrip.start_date}
                    onChange={(e) => setEditingTrip({ ...editingTrip, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-zinc-400">End Date</label>
                  <input
                    type="date"
                    className="w-full p-4 bg-zinc-50 rounded-xl font-bold outline-none"
                    value={editingTrip.end_date}
                    onChange={(e) => setEditingTrip({ ...editingTrip, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-black text-[#FFD700] py-5 rounded-2xl font-black uppercase tracking-widest">Save Changes</button>
                <button type="button" onClick={() => setEditingTrip(null)} className="px-8 py-5 border-2 border-zinc-100 rounded-2xl font-black uppercase text-xs">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =====================================================
   TRIP CARD
===================================================== */
const TripCard = React.memo(({ trip, onDelete, onEdit, onView }) => {
  const id = trip.id ?? trip.itinerary_id;

  return (
    <div className="group relative bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(id); }}
        className="absolute top-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition p-2 bg-black/20 hover:bg-red-500 rounded-full"
      >
        <X size={18} className="text-white" />
      </button>

      <div className="relative h-64 overflow-hidden">
        <img
          src={trip.image || "/placeholder.jpg"}
          alt={trip.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h3 className="text-3xl font-black uppercase tracking-tight line-clamp-1">{trip.name}</h3>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-80 mt-1 font-bold">
            <Calendar size={12} />
            {trip.start_date} — {trip.end_date}
          </div>
        </div>
      </div>

      <div className="p-8 flex gap-3">
        <button onClick={onView} className="flex-1 py-4 rounded-xl bg-black text-white font-black text-xs uppercase tracking-[0.25em] hover:bg-[#FFD700] hover:text-black transition-all flex items-center justify-center gap-2">
          View <ChevronRight size={18} />
        </button>
        <button onClick={onEdit} className="px-6 rounded-xl border-2 border-zinc-100 hover:border-black transition">
          <Edit3 size={16} />
        </button>
      </div>
    </div>
  );
});

export default React.memo(MyJourneys);