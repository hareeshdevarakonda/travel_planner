import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { 
  fetchItineraryItems, 
  addItineraryItem, 
  deleteItineraryItem 
} from "@/api/itinerayservices";
import JourneyTimeline from "./JourneyTimeline";

const TimelineContainer = () => {
  const { id } = useParams(); // Get itinerary_id from URL
  const { state } = useLocation(); // Optionally get trip name/data from navigation state
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ITEMS ================= */
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchItineraryItems(id);
      // Backend returns a list of items (image_b385e6)
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load timeline:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  /* ================= ADD ITEM ================= */
  const handleAddItem = async (itemData) => {
    try {
      // Body matches image_b385ac: place_id, day, order, note
      await addItineraryItem(id, itemData);
      loadItems(); // Refresh list to get the new ID and sorted order
    } catch (err) {
      alert(`Failed to add activity: ${err}`);
    }
  };

  /* ================= DELETE ITEM ================= */
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await deleteItineraryItem(id, itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      alert(`Delete failed: ${err}`);
    }
  };

  return (
    <JourneyTimeline 
      tripName={state?.trip?.name || "Journey Details"}
      items={items}
      loading={loading}
      onAdd={handleAddItem}
      onDelete={handleDeleteItem}
    />
  );
};

export default TimelineContainer;