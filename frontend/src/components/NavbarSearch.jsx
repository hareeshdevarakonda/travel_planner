import React, { useEffect, useState, useRef } from "react";
import {
  fetchPlacesByCity,
  addPlaceToItinerary,
} from "@/api/searchApi";

import {
  filterPlaces,
  limitResults,
} from "@/utils/searchUtils";

const NavbarSearch = ({ cityId, itineraryId, existingItems = [] }) => {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const containerRef = useRef(null);

  /* =====================================================
     LOAD PLACES WHEN CITY CHANGES
  ===================================================== */
  useEffect(() => {
    if (!cityId) return;

    let active = true;

    const loadPlaces = async () => {
      try {
        setLoading(true);
        const data = await fetchPlacesByCity(cityId);
        if (active) setPlaces(data);
      } catch (err) {
        console.error("Search load failed", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPlaces();

    return () => (active = false);
  }, [cityId]);

  /* =====================================================
     FILTER + DEBOUNCE
  ===================================================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = filterPlaces(places, query);
      setResults(limitResults(filtered));
    }, 200);

    return () => clearTimeout(timer);
  }, [query, places]);

  /* =====================================================
     CLOSE DROPDOWN OUTSIDE CLICK
  ===================================================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =====================================================
     ADD PLACE
  ===================================================== */
  const handleSelect = async (place) => {
    try {
      setAddingId(place.id);

      await addPlaceToItinerary(
        itineraryId,
        place,
        1,
        existingItems
      );

      setQuery("");
      setResults([]);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div ref={containerRef} className="relative w-80">
      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search places..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-xl border outline-none"
      />

      {/* RESULTS */}
      {query && (
        <div className="absolute top-12 left-0 w-full bg-white shadow-xl rounded-xl z-50 max-h-80 overflow-auto">

          {loading ? (
            <div className="p-4 text-sm">Loading...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-gray-400">
              No results
            </div>
          ) : (
            results.map((place) => (
              <div
                key={place.id}
                onClick={() => handleSelect(place)}
                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
              >
                {/* ⭐ PLACE IMAGE */}
                <img
                  src={place.image || "/placeholder.jpg"}
                  alt={place.name}
                  onError={(e) =>
                    (e.target.src = "/placeholder.jpg")
                  }
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />

                {/* TEXT */}
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium">
                    {place.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {place.location}
                  </span>
                </div>

                {/* ADDING STATE */}
                {addingId === place.id && (
                  <span className="text-xs text-blue-500">
                    Adding...
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;