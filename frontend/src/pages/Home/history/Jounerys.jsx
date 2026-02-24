import React, { useState, useEffect, useCallback } from "react";
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
    items: j.items || [], // ensures image resolver works
  }));
};

const JourneysContainer = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER TRIPS ================= */
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const data = await fetchUserItineraries();

        if (mounted) {
          setJourneys(normalizeJourneys(data));
        }
      } catch (error) {
        console.error("Failed to load journeys:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => (mounted = false);
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = useCallback(async (tripData) => {
    try {
      const res = await createItinerary(tripData);

      const newTrip = res?.itinerary || res;

      setJourneys((prev) => [
        { ...newTrip, items: [] },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      alert("Error creating trip.");
    }
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Remove this expedition?")) return;

    try {
      await deleteItinerary(id);

      setJourneys((prev) =>
        prev.filter((t) => (t.id ?? t.itinerary_id) !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  }, []);

  /* ================= UPDATE ================= */
  const handleEdit = useCallback(async (id, updatedData) => {
    try {
      const updated = await updateItinerary(id, updatedData);

      setJourneys((prev) =>
        prev.map((t) =>
          (t.id ?? t.itinerary_id) === id
            ? { ...updated, items: updated.items || [] }
            : t
        )
      );
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  }, []);

  return (
    <MyJourneys
      journeys={journeys}
      loading={loading}
      onDelete={handleDelete}
      onCreate={handleCreate}
      onEdit={handleEdit}
    />
  );
};

export default JourneysContainer;