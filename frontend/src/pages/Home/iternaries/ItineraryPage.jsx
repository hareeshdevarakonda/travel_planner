import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchItineraryItems,
  deleteItineraryItem,
} from "@/api/itinerayservices";

import DaySection from "./DaySection";

const groupByDay = (items = []) => {
  return items.reduce((acc, item) => {
    const day = item.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});
};

const ItineraryPage = () => {
  const { id } = useParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD TIMELINE ================= */
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await fetchItineraryItems(id);
        setItems(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [id]);

  /* ================= DELETE ================= */
  const handleDelete = async (itemId) => {
    try {
      await deleteItineraryItem(id, itemId);

      setItems((prev) =>
        prev.filter((i) => i.id !== itemId)
      );
    } catch {
      alert("Failed to delete activity");
    }
  };

  const grouped = groupByDay(items);

  if (loading) return <div className="p-10">Loading timeline...</div>;

  return (
    <div className="p-10 space-y-10">
      {Object.keys(grouped)
        .sort((a, b) => a - b)
        .map((day) => (
          <DaySection
            key={day}
            day={day}
            items={grouped[day]}
            onDelete={handleDelete}
          />
        ))}
    </div>
  );
};

export default ItineraryPage;