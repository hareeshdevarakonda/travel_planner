import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import {
  fetchUserItineraries,
  deleteItinerary,
  createItinerary,
  updateItinerary,
} from "@/api/itinerayservices";

import MyJourneys from "./My-history";

/* =====================================================
   NORMALIZE BACKEND RESPONSE
===================================================== */
const normalizeJourneys = (data) => {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.history)
    ? data.history
    : [];

  return list.map((j) => ({
    ...j,
    id: j.id ?? j.itinerary_id,
    items: j.items || [], 
  }));
};

const JourneysContainer = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for programmatic navigation

  /* ================= LOAD USER TRIPS ================= */
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserItineraries();
        if (mounted) setJourneys(normalizeJourneys(data));
      } catch (error) {
        console.error("Failed to load journeys:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  /* ================= VIEW (NAVIGATE TO TIMELINE) ================= */
  const handleView = useCallback((trip) => {
    const id = trip.id ?? trip.itinerary_id;
    // We pass 'trip' in state so the timeline page has the name immediately
    navigate(`/home/myjourneys/${id}`, { state: { trip } });
  }, [navigate]);

  /* ================= CREATE ================= */
  const handleCreate = useCallback(async (tripData) => {
    try {
      const res = await createItinerary(tripData);
      const newTrip = res?.itinerary || res;
      setJourneys((prev) => [{ ...newTrip, items: [] }, ...prev]);
    } catch (err) {
      alert(`Error creating trip: ${err}`);
    }
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Remove this expedition?")) return;
    try {
      await deleteItinerary(id);
      setJourneys((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  }, []);

  /* ================= UPDATE ================= */
  const handleEdit = useCallback(async (id, updatedData) => {
    try {
      const updated = await updateItinerary(id, updatedData);
      setJourneys((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...updated, items: updated.items || t.items || [] }
            : t
        )
      );
    } catch (err) {
      alert(`Update failed: ${err}`);
    }
  }, []);

  return (
    <MyJourneys
      journeys={journeys}
      loading={loading}
      onDelete={handleDelete}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onView={handleView} // Successfully connecting the view button
    />
  );
};

export default JourneysContainer;