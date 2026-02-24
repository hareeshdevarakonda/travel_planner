import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  Loader2,
  ChevronRight,
  Edit3,
} from "lucide-react";

/* =====================================================
   IMAGE RESOLVER
   Picks best image for journey
===================================================== */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "";

const resolveJourneyImage = (journey) => {
  if (!journey) return null;

  // already attached
  if (journey.image) return journey.image;

  // try first itinerary item image
  const firstItem = journey.items?.[0];

  if (firstItem?.place?.image_url) {
    const url = firstItem.place.image_url;
    return url.startsWith("http")
      ? url
      : `${API_BASE}${url}`;
  }

  // fallback dynamic endpoint
  if (firstItem?.place_id) {
    return `${API_BASE}/places/${firstItem.place_id}/image`;
  }

  return null;
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
}) => {
  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingTrip, setEditingTrip] = useState(null);

  /* ================= ADD IMAGE TO JOURNEYS ================= */
  const journeysWithImages = useMemo(
    () =>
      journeys.map((j) => ({
        ...j,
        image: resolveJourneyImage(j),
      })),
    [journeys]
  );

  /* ================= NAVIGATION ================= */
  const handleViewTrip = useCallback(
    (trip) => {
      const id = trip.id ?? trip.itinerary_id;
      navigate(`/home/myjourneys/${id}`, {
        state: { trip },
      });
    },
    [navigate]
  );

  const handleEditTrip = useCallback((trip) => {
    setEditingTrip(trip);
  }, []);

  /* ================= CREATE ================= */
  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreate({
      title: newTitle,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      total_budget: 0,
      items: [],
    });

    setNewTitle("");
    setIsAdding(false);
  };

  /* ================= UPDATE ================= */
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const id = editingTrip.id ?? editingTrip.itinerary_id;
    onEdit(id, editingTrip);
    setEditingTrip(null);
  };

  return (
    <div className="p-12 bg-white min-h-screen">

      {/* HEADER */}
      <div className="mb-14">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
          Your Personal Odyssey
        </p>

        <h1 className="text-6xl font-black uppercase">
          My Journeys
        </h1>
      </div>

      {/* QUICK ADD */}
      {isAdding && (
        <form
          onSubmit={handleQuickAdd}
          className="mb-14 p-10 bg-zinc-50 rounded-[3rem] border-2 border-dashed flex gap-6"
        >
          <input
            className="flex-1 bg-white p-6 rounded-[1.5rem] font-bold text-xl"
            placeholder="Where to next?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />

          <button className="bg-black text-[#FFD700] px-12 rounded-[1.5rem] font-black">
            Create
          </button>
        </form>
      )}

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center h-96 items-center">
          <Loader2 className="animate-spin h-16 w-16 text-zinc-200" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* CREATE CARD */}
          <div
            onClick={() => setIsAdding(true)}
            className="flex flex-col items-center justify-center min-h-[450px] border-2 border-dashed rounded-[4rem] cursor-pointer hover:border-[#FFD700]"
          >
            <Plus size={48} />
            <h2 className="font-black mt-4 uppercase">
              New Journey
            </h2>
          </div>

          {/* JOURNEYS */}
          {journeysWithImages.map((trip) => (
            <TripCard
              key={trip.id ?? trip.itinerary_id}
              trip={trip}
              onDelete={onDelete}
              onEdit={() => handleEditTrip(trip)}
              onView={() => handleViewTrip(trip)}
            />
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingTrip && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <form
            onSubmit={handleUpdateSubmit}
            className="bg-white p-12 rounded-3xl"
          >
            <input
              className="p-6 bg-zinc-50 rounded-xl font-bold"
              value={editingTrip.title}
              onChange={(e) =>
                setEditingTrip({
                  ...editingTrip,
                  title: e.target.value,
                })
              }
            />
          </form>
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

      {/* DELETE BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        className="absolute top-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition"
      >
        <X size={18} className="text-white" />
      </button>

      {/* IMAGE SECTION */}
      <div className="relative h-64 overflow-hidden">

        {/* IMAGE */}
        <img
          src={trip.image || "/placeholder.jpg"}
          onError={(e) => (e.target.src = "/placeholder.jpg")}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* ⭐ CINEMATIC GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* TITLE OVER IMAGE */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h3 className="text-3xl font-black uppercase tracking-tight line-clamp-1">
            {trip.title}
          </h3>

          <p className="text-xs uppercase tracking-widest opacity-80 mt-1">
            {trip.destination_name || "Your Journey"}
          </p>
        </div>
      </div>

      {/* ACTION AREA */}
      <div className="p-8 flex gap-3">
        <button
          onClick={onView}
          className="flex-1 py-4 rounded-xl bg-black text-white font-black text-xs uppercase tracking-[0.25em]
                     hover:bg-[#FFD700] hover:text-black transition-all flex items-center justify-center gap-2"
        >
          View <ChevronRight size={18} />
        </button>

        <button
          onClick={onEdit}
          className="px-6 rounded-xl border-2 border-zinc-100 hover:border-black transition"
        >
          <Edit3 size={16} />
        </button>
      </div>
    </div>
  );
});

export default React.memo(MyJourneys);