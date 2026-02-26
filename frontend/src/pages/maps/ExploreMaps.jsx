import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRouteData } from '@/api/mapsApi'; // Importing your verified API function
import { Navigation, Loader2, Info } from 'lucide-react';

// Helper to move the camera when a route is found
const MapController = ({ center }) => {
  const map = useMap();
  if (center) map.setView(center, 10);
  return null;
};

const ExploreMaps = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!source || !destination) return;

    setLoading(true);
    try {
      const data = await fetchRouteData(source, destination);
      setRoute(data);
    } catch (err) {
      alert("Route not found! Try cities like 'Hyderabad' or 'Mumbai'.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* SIDEBAR */}
      <div className="w-96 border-r p-8 flex flex-col gap-8 z-[1000] bg-white shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-black p-2 rounded-xl">
            <Navigation size={20} className="text-[#FFD700]" />
          </div>
          <h2 className="font-black uppercase tracking-tighter text-xl text-black">Route Explorer</h2>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Starting Point</label>
            <input 
              className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none focus:border-[#FFD700] transition-all text-sm font-bold"
              placeholder="e.g., Hyderabad"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Destination</label>
            <input 
              className="w-full p-4 bg-zinc-50 border rounded-2xl outline-none focus:border-[#FFD700] transition-all text-sm font-bold"
              placeholder="e.g., Mumbai"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#FFD700] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-black hover:text-[#FFD700] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Find Path"}
          </button>
        </form>

        {route && (
          <div className="mt-auto bg-zinc-50 p-6 rounded-3xl border border-zinc-100 space-y-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <Info size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Journey Stats</span>
            </div>
            <div>
              <p className="text-3xl font-black text-black">{(route.distance_m / 1000).toFixed(1)} km</p>
              <p className="text-sm font-bold text-zinc-400">Approx. {(route.duration_s / 3600).toFixed(1)} hours</p>
            </div>
          </div>
        )}
      </div>

      {/* MAP VIEWPORT */}
      <div className="flex-1 relative">
        <MapContainer center={[17.3850, 78.4867]} zoom={6} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {route && (
            <>
              <MapController center={[route.source.lat, route.source.lon]} />
              
              {/* Start & End Pins */}
              <Marker position={[route.source.lat, route.source.lon]}>
                <Popup className="font-bold">Start: {route.source.name}</Popup>
              </Marker>
              
              <Marker position={[route.destination.lat, route.destination.lon]}>
                <Popup className="font-bold">End: {route.destination.name}</Popup>
              </Marker>

              {/* The actual Road Line */}
              <Polyline 
                positions={route.geometry.coordinates.map(c => [c[1], c[0]])} 
                pathOptions={{ color: '#000', weight: 6, opacity: 0.8 }} 
              />
              <Polyline 
                positions={route.geometry.coordinates.map(c => [c[1], c[0]])} 
                pathOptions={{ color: '#FFD700', weight: 3 }} 
              />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default ExploreMaps;