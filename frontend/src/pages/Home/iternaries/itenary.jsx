  import React, { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import {
    ChevronLeft,
    MapPin,
    Clock,
    Plane,
    Hotel,
    Coffee,
    Utensils,
    Map,
    Loader2,
  } from "lucide-react";

  import {
    fetchItineraryById,
    fetchItineraryItems,
  } from "@/api/itinerayservices";

  const Itineraries = () => {
    const { id } = useParams(); // ✅ /home/myjourneys/itineraries/:id
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [tripDays, setTripDays] = useState([]);
    const [activeDay, setActiveDay] = useState(1);
    const [loading, setLoading] = useState(true);

    /* =====================================================
      LOAD DATA FROM BACKEND
    ===================================================== */
    useEffect(() => {
      const loadItinerary = async () => {
        try {
          setLoading(true);

          // 1️⃣ get itinerary info
          const itinerary = await fetchItineraryById(id);

          // backend uses "name"
          setTrip({
            title: itinerary.name,
            start_date: itinerary.start_date,
          });

          // 2️⃣ get timeline items
          const items = await fetchItineraryItems(id);

          /*
            Backend returns:
            [
              { day, note, place_id, order }
            ]
          */

          // group items by day
          const grouped = {};

          items.forEach((item) => {
            if (!grouped[item.day]) {
              grouped[item.day] = [];
            }

            grouped[item.day].push({
              time: "09:00 AM", // you can later store real time
              type: "activity",
              title: item.note || "Activity",
              location: "Planned Stop",
              note: item.note || "",
            });
          });

          const formattedDays = Object.keys(grouped).map((day) => ({
            day: Number(day),
            activities: grouped[day],
          }));

          setTripDays(formattedDays);
          setActiveDay(formattedDays[0]?.day || 1);
        } catch (err) {
          console.error("Failed loading itinerary", err);
        } finally {
          setLoading(false);
        }
      };

      loadItinerary();
    }, [id]);

    /* =====================================================
      LOADING STATE
    ===================================================== */
    if (loading) {
      return (
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="animate-spin" size={40} />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white text-black p-6 md:p-12">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="p-4 rounded-2xl bg-black text-white hover:bg-[#FFD700] hover:text-black transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div>
              <h1 className="text-5xl font-black uppercase">
                {trip?.title || "Itinerary"}
              </h1>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
                Travel Plan
              </p>
            </div>
          </div>

          <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FFD700] hover:text-black transition-all">
            <Map size={16} /> View Map
          </button>
        </header>

        {/* DAY NAV */}
        <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur-md py-4 mb-12 border-b flex gap-3 overflow-x-auto">
          {tripDays.map((d) => (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition ${
                activeDay === d.day
                  ? "bg-[#FFD700] text-black shadow-lg scale-105"
                  : "bg-zinc-50 text-zinc-400"
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </nav>

        {/* TIMELINE */}
        <main className="max-w-4xl mx-auto relative">
          <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-zinc-100" />

          <div className="space-y-6">
            {tripDays
              .find((d) => d.day === activeDay)
              ?.activities.map((activity, idx) => (
                <TimelineCard key={idx} {...activity} />
              ))}
          </div>
        </main>
      </div>
    );
  };

  /* =====================================================
    TIMELINE CARD (UNCHANGED DESIGN)
  ===================================================== */
  const TimelineCard = ({ time, type, title, location, note }) => {
    const getIcon = () => {
      switch (type) {
        case "flight":
          return <Plane size={18} />;
        case "hotel":
          return <Hotel size={18} />;
        case "food":
          return <Utensils size={18} />;
        default:
          return <Coffee size={18} />;
      }
    };

    return (
      <div className="relative group">
        <div className="flex items-center gap-6">
          <div className="relative flex flex-col items-center w-12">
            <div className="w-[24px] h-[24px] rounded-full bg-white border-[4px] border-black group-hover:bg-[#FFD700] transition-all z-10" />
          </div>

          <div className="flex-1 bg-zinc-50 rounded-[2.5rem] p-6 md:p-8 flex justify-between gap-6 border-2 border-transparent group-hover:border-[#FFD700] transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center">
                {getIcon()}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={12} />
                  <span className="text-[10px] font-black uppercase">
                    {time}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase">
                  {title}
                </h3>
              </div>
            </div>

            <div className="flex flex-col md:items-end">
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin size={14} className="text-[#FFD700]" />
                <span className="text-[11px] font-bold uppercase">
                  {location}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 italic">
                "{note}"
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Itineraries;